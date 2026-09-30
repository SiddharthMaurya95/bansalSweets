import type { FastifyError, FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';
import {
  AppError,
  ERROR_CODES,
  type ApiErrorEnvelope,
  type ErrorDetail,
  type StandardErrorCode,
} from '@bansal/shared';

const errorHandlerPluginAsync: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Handle 404 Unmatched Routes
  fastify.setNotFoundHandler((request, reply) => {
    const requestId = request.requestId || (request.headers['x-request-id'] as string) || 'unknown';
    const response: ApiErrorEnvelope = {
      error: {
        code: ERROR_CODES.NOT_FOUND,
        message: `Route ${request.method} ${request.url} not found`,
        requestId,
      },
    };
    return reply.status(404).send(response);
  });

  // Central Error Handler
  fastify.setErrorHandler((error: FastifyError | Error, request, reply) => {
    const requestId = request.requestId || (request.headers['x-request-id'] as string) || 'unknown';

    // 1. AppError (Domain typed errors)
    const errObj = error as unknown as Record<string, unknown>;
    if (
      error instanceof AppError ||
      (errObj && typeof errObj['statusCode'] === 'number' && typeof errObj['code'] === 'string')
    ) {
      const appErr = error as unknown as AppError;
      const response: ApiErrorEnvelope = {
        error: {
          code: appErr.code,
          message: appErr.message,
          details: appErr.details,
          requestId,
        },
      };
      return reply.status(appErr.statusCode).send(response);
    }

    // 2. Zod Validation Errors
    if (error instanceof ZodError) {
      const details: ErrorDetail[] = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        issue: issue.code,
        message: issue.message,
      }));

      const response: ApiErrorEnvelope = {
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Request payload validation failed',
          details,
          requestId,
        },
      };
      return reply.status(422).send(response);
    }

    // 3. Fastify Validation Errors (Fastify schema errors)
    if ('validation' in error && error.validation) {
      const details: ErrorDetail[] = error.validation.map((v) => ({
        field:
          v.instancePath ||
          (v.params && 'missingProperty' in v.params
            ? String(v.params['missingProperty'])
            : undefined),
        issue: v.keyword || 'invalid',
        message: v.message || 'Validation error',
      }));

      const response: ApiErrorEnvelope = {
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: error.message || 'Schema validation failed',
          details,
          requestId,
        },
      };
      return reply.status(422).send(response);
    }

    // 4. Fastify HTTP Errors (e.g. 404, 400, 413)
    if ('statusCode' in error && typeof error.statusCode === 'number') {
      let code: StandardErrorCode = ERROR_CODES.BAD_REQUEST;
      if (error.statusCode === 404) code = ERROR_CODES.NOT_FOUND;
      if (error.statusCode === 413) code = ERROR_CODES.PAYLOAD_TOO_LARGE;
      if (error.statusCode === 415) code = ERROR_CODES.UNSUPPORTED_MEDIA_TYPE;
      if (error.statusCode === 429) code = ERROR_CODES.RATE_LIMITED;

      const response: ApiErrorEnvelope = {
        error: {
          code,
          message: error.message,
          requestId,
        },
      };
      return reply.status(error.statusCode).send(response);
    }

    // 5. Unhandled Internal Server Errors (500)
    request.log.error({ err: error, requestId }, 'Unhandled Internal Server Error');

    const response: ApiErrorEnvelope = {
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'An unexpected internal error occurred. Please quote the requestId to support.',
        requestId,
      },
    };
    return reply.status(500).send(response);
  });
};

export const errorHandlerPlugin = fp(errorHandlerPluginAsync, {
  name: 'errorHandlerPlugin',
});

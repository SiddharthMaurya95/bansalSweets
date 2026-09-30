import type { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { createHash } from 'node:crypto';
import { ERROR_CODES, isValidUuid, type ApiErrorEnvelope } from '@bansal/shared';

export interface IdempotencyRecord {
  key: string;
  scope: string;
  requestHash: string;
  responseStatus: number;
  responseBody: unknown;
  expiresAt: number;
}

// In-memory store for fast lookup and testing; in production backs to Postgres/Redis
const memoryStore = new Map<string, IdempotencyRecord>();

export function clearIdempotencyStore(): void {
  memoryStore.clear();
}

const idempotencyPluginAsync: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    // Only check unsafe mutating requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return;
    }

    const idempotencyKey = request.headers['idempotency-key'];
    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return;
    }

    const requestId = request.requestId || 'unknown';

    // 1. Validate UUID format
    if (!isValidUuid(idempotencyKey)) {
      const err: ApiErrorEnvelope = {
        error: {
          code: ERROR_CODES.BAD_REQUEST,
          message: 'Idempotency-Key header must be a valid UUIDv7 or UUID string',
          requestId,
        },
      };
      return reply.status(400).send(err);
    }

    // 2. Compute request hash
    const bodyStr = request.body ? JSON.stringify(request.body) : '';
    const requestHash = createHash('sha256').update(bodyStr).digest('hex');

    const clientIp = request.ip || '0.0.0.0';
    const scope = `${clientIp}:${request.url}`;
    const storeKey = `${scope}:${idempotencyKey}`;

    const existing = memoryStore.get(storeKey);
    if (existing) {
      if (existing.expiresAt < Date.now()) {
        memoryStore.delete(storeKey);
      } else if (existing.requestHash === requestHash) {
        // Same key + same request payload => Return cached idempotent response
        reply.header('Idempotency-Replay', 'true');
        return reply.status(existing.responseStatus).send(existing.responseBody);
      } else {
        // Same key + different request payload => 409 Conflict
        const err: ApiErrorEnvelope = {
          error: {
            code: ERROR_CODES.IDEMPOTENCY_KEY_REUSED,
            message: 'Idempotency key has already been used with a different request payload',
            requestId,
          },
        };
        return reply.status(409).send(err);
      }
    }

    // Attach metadata for onSend hook
    (
      request as FastifyRequest & {
        idempotencyInfo?: { storeKey: string; scope: string; key: string; requestHash: string };
      }
    ).idempotencyInfo = {
      storeKey,
      scope,
      key: idempotencyKey,
      requestHash,
    };
  });

  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload) => {
    const info = (
      request as FastifyRequest & {
        idempotencyInfo?: { storeKey: string; scope: string; key: string; requestHash: string };
      }
    ).idempotencyInfo;
    if (!info) return payload;

    // Cache successful or domain error responses (e.g. 200, 201, 409, 422) for 24h
    if (reply.statusCode < 500) {
      try {
        const parsedBody = typeof payload === 'string' ? JSON.parse(payload) : payload;
        const record: IdempotencyRecord = {
          key: info.key,
          scope: info.scope,
          requestHash: info.requestHash,
          responseStatus: reply.statusCode,
          responseBody: parsedBody,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };
        memoryStore.set(info.storeKey, record);
      } catch {
        // Non-JSON payload, ignore
      }
    }

    return payload;
  });
};

export const idempotencyPlugin = fp(idempotencyPluginAsync, {
  name: 'idempotencyPlugin',
});

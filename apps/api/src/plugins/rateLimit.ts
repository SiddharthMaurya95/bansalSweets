import type { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { ERROR_CODES, type ApiErrorEnvelope } from '@bansal/shared';

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

interface WindowBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, WindowBucket>();

export function clearRateLimitBuckets(): void {
  buckets.clear();
}

const rateLimitPluginAsync: FastifyPluginAsync<RateLimitOptions> = async (
  fastify: FastifyInstance,
  opts: RateLimitOptions,
) => {
  const windowMs = opts.windowMs ?? 60 * 1000; // 1 minute default
  const maxRequests = opts.maxRequests ?? 100; // 100 req/min default

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Exclude health probes
    if (request.url === '/healthz' || request.url === '/readyz') {
      return;
    }

    const ip = request.ip || '0.0.0.0';
    const now = Date.now();
    const bucketKey = `${ip}:${Math.floor(now / windowMs)}`;

    let bucket = buckets.get(bucketKey);
    if (!bucket) {
      bucket = {
        count: 0,
        resetAt: Math.ceil(now / windowMs) * windowMs,
      };
      buckets.set(bucketKey, bucket);
    }

    bucket.count++;

    const remaining = Math.max(0, maxRequests - bucket.count);
    const resetSeconds = Math.ceil((bucket.resetAt - now) / 1000);

    reply.header('RateLimit-Limit', maxRequests);
    reply.header('RateLimit-Remaining', remaining);
    reply.header('RateLimit-Reset', resetSeconds);

    if (bucket.count > maxRequests) {
      reply.header('Retry-After', resetSeconds);
      const requestId = request.requestId || 'unknown';

      const response: ApiErrorEnvelope = {
        error: {
          code: ERROR_CODES.RATE_LIMITED,
          message: `Too many requests. Limit is ${maxRequests} requests per minute.`,
          details: [{ issue: 'rate_limited', retryAfterSeconds: resetSeconds }],
          requestId,
        },
      };

      return reply.status(429).send(response);
    }
  });
};

export const rateLimitPlugin = fp(rateLimitPluginAsync, {
  name: 'rateLimitPlugin',
});

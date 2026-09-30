import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fastify, { type FastifyInstance } from 'fastify';
import { rateLimitPlugin, clearRateLimitBuckets } from '../plugins/rateLimit.js';
import { errorHandlerPlugin } from '../plugins/errorHandler.js';
import { requestIdPlugin } from '../plugins/requestId.js';

describe('Rate Limit Plugin', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    clearRateLimitBuckets();
    app = fastify({ logger: false });
    await app.register(requestIdPlugin);
    await app.register(errorHandlerPlugin);
    await app.register(rateLimitPlugin, { maxRequests: 3, windowMs: 10000 });

    app.get('/healthz', async () => ({ status: 'ok' }));
    app.get('/api/test', async () => ({ status: 'success' }));

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('includes standard RateLimit headers in responses', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/test',
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['ratelimit-limit']).toBe('3');
    expect(res.headers['ratelimit-remaining']).toBe('2');
    expect(res.headers['ratelimit-reset']).toBeDefined();
  });

  it('returns 429 Too Many Requests when rate limit threshold is exceeded', async () => {
    // Request 1: remaining = 2
    await app.inject({ method: 'GET', url: '/api/test' });
    // Request 2: remaining = 1
    await app.inject({ method: 'GET', url: '/api/test' });
    // Request 3: remaining = 0
    const res3 = await app.inject({ method: 'GET', url: '/api/test' });
    expect(res3.statusCode).toBe(200);
    expect(res3.headers['ratelimit-remaining']).toBe('0');

    // Request 4: should be rate-limited
    const res4 = await app.inject({ method: 'GET', url: '/api/test' });
    expect(res4.statusCode).toBe(429);
    expect(res4.headers['retry-after']).toBeDefined();

    const body = JSON.parse(res4.payload);
    expect(body.error.code).toBe('RATE_LIMITED');
    expect(body.error.message).toContain('Too many requests');
    expect(body.error.details).toBeDefined();
    expect(body.error.requestId).toBeDefined();
  });

  it('does not rate limit health check endpoints', async () => {
    // Fire more than 3 requests at /healthz
    for (let i = 0; i < 5; i++) {
      const res = await app.inject({ method: 'GET', url: '/healthz' });
      expect(res.statusCode).toBe(200);
      expect(res.headers['ratelimit-limit']).toBeUndefined();
    }
  });
});

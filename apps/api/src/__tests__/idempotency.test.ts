import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { generateUuidV7 } from '@bansal/shared';
import { buildApp } from '../app.js';
import { clearIdempotencyStore } from '../plugins/idempotency.js';

describe('Idempotency Plugin', () => {
  let app: FastifyInstance;
  let executionCount = 0;

  beforeAll(async () => {
    app = await buildApp({ LOG_LEVEL: 'fatal' });

    // Register a test mutation route
    app.post('/api/v1/test-order', async (request) => {
      executionCount++;
      return {
        orderId: 'ord_123',
        payload: request.body,
        executionCount,
      };
    });

    await app.ready();
  });

  beforeEach(() => {
    executionCount = 0;
    clearIdempotencyStore();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects invalid UUID format for Idempotency-Key with 400 Bad Request', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/test-order',
      headers: {
        'idempotency-key': 'not-a-valid-uuid',
      },
      payload: { amount: 50000 },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('BAD_REQUEST');
    expect(body.error.message).toContain('valid UUID');
    expect(executionCount).toBe(0);
  });

  it('executes normally and records idempotency key on first request', async () => {
    const key = generateUuidV7();
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/test-order',
      headers: {
        'idempotency-key': key,
      },
      payload: { item: 'kashmiri-almond-500g', quantity: 2 },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['idempotency-replay']).toBeUndefined();
    const body = JSON.parse(res.payload);
    expect(body.executionCount).toBe(1);
    expect(executionCount).toBe(1);
  });

  it('replays identical cached response without re-executing handler on same key and payload', async () => {
    const key = generateUuidV7();
    const payload = { item: 'cashew-w240-1kg', quantity: 1 };

    // Request 1
    const res1 = await app.inject({
      method: 'POST',
      url: '/api/v1/test-order',
      headers: {
        'idempotency-key': key,
      },
      payload,
    });
    expect(res1.statusCode).toBe(200);
    expect(res1.headers['idempotency-replay']).toBeUndefined();

    // Request 2 (Exact duplicate)
    const res2 = await app.inject({
      method: 'POST',
      url: '/api/v1/test-order',
      headers: {
        'idempotency-key': key,
      },
      payload,
    });

    expect(res2.statusCode).toBe(200);
    expect(res2.headers['idempotency-replay']).toBe('true');
    const body2 = JSON.parse(res2.payload);
    // Handler must NOT have executed a second time
    expect(body2.executionCount).toBe(1);
    expect(executionCount).toBe(1);
  });

  it('rejects reused idempotency key with conflicting payload with 409 Conflict', async () => {
    const key = generateUuidV7();

    // First request
    const res1 = await app.inject({
      method: 'POST',
      url: '/api/v1/test-order',
      headers: {
        'idempotency-key': key,
      },
      payload: { item: 'walnut-inshell-1kg', quantity: 1 },
    });
    expect(res1.statusCode).toBe(200);

    // Second request with SAME key but DIFFERENT payload
    const res2 = await app.inject({
      method: 'POST',
      url: '/api/v1/test-order',
      headers: {
        'idempotency-key': key,
      },
      payload: { item: 'walnut-inshell-1kg', quantity: 99 },
    });

    expect(res2.statusCode).toBe(409);
    const body2 = JSON.parse(res2.payload);
    expect(body2.error.code).toBe('IDEMPOTENCY_KEY_REUSED');
    expect(body2.error.message).toContain('different request payload');
    expect(executionCount).toBe(1);
  });

  it('ignores idempotency key on safe HTTP methods (GET)', async () => {
    const key = generateUuidV7();
    const res = await app.inject({
      method: 'GET',
      url: '/healthz',
      headers: {
        'idempotency-key': key,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['idempotency-replay']).toBeUndefined();
  });
});

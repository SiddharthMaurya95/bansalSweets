import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../app.js';

describe('Fastify API Bootstrap', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp({ LOG_LEVEL: 'fatal' });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('responds with 200 on /healthz', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/healthz',
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
  });

  it('responds with 200 on /readyz', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/readyz',
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe('ready');
  });

  it('assigns and returns x-request-id header', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/healthz',
    });
    const requestId = res.headers['x-request-id'];
    expect(requestId).toBeDefined();
    expect(typeof requestId).toBe('string');
  });

  it('preserves client supplied x-request-id header', async () => {
    const clientRequestId = '018f3a2b-8a9d-7000-8000-123456789abc';
    const res = await app.inject({
      method: 'GET',
      url: '/healthz',
      headers: {
        'x-request-id': clientRequestId,
      },
    });
    expect(res.headers['x-request-id']).toBe(clientRequestId);
  });

  it('formats 404 in standard error envelope', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/non-existent-route',
    });
    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.payload);
    expect(body.error).toBeDefined();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.requestId).toBeDefined();
  });
});

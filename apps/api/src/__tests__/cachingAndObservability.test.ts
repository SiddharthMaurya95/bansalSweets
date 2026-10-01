import { describe, it, expect, beforeEach } from 'vitest';
import { cacheService } from '../modules/cache/cacheService.js';
import { buildApp } from '../app.js';

describe('Performance, Caching & Observability (Phase 10)', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  describe('CacheService Unit Tests', () => {
    it('sets and retrieves cached data', async () => {
      await cacheService.set('catalog:category_tree', { categories: ['Almonds', 'Cashews'] }, 60);
      const cached = await cacheService.get<{ categories: string[] }>('catalog:category_tree');
      expect(cached).not.toBeNull();
      expect(cached?.categories).toEqual(['Almonds', 'Cashews']);
    });

    it('returns null for missing keys', async () => {
      const missing = await cacheService.get('non_existent_key');
      expect(missing).toBeNull();
    });

    it('uses getOrSet to compute on miss and reuse on hit', async () => {
      let fetchCount = 0;
      const fetcher = async () => {
        fetchCount++;
        return { rate: 1850, commodity: 'Mamra Almonds' };
      };

      const result1 = await cacheService.getOrSet('lot:mamra:rates', 60, fetcher);
      expect(result1.rate).toBe(1850);
      expect(fetchCount).toBe(1);

      // Second call must hit cache without invoking fetcher
      const result2 = await cacheService.getOrSet('lot:mamra:rates', 60, fetcher);
      expect(result2.rate).toBe(1850);
      expect(fetchCount).toBe(1);
    });

    it('invalidates keys by prefix', async () => {
      await cacheService.set('catalog:product:1', 'Item 1');
      await cacheService.set('catalog:product:2', 'Item 2');
      await cacheService.set('user:session:100', 'User 100');

      const deleted = await cacheService.invalidatePrefix('catalog:');
      expect(deleted).toBe(2);

      expect(await cacheService.get('catalog:product:1')).toBeNull();
      expect(await cacheService.get('catalog:product:2')).toBeNull();
      expect(await cacheService.get('user:session:100')).toBe('User 100');
    });

    it('reports cache diagnostics and health status', () => {
      const health = cacheService.getHealth();
      expect(health.healthy).toBe(true);
      expect(health.type).toBe('memory');
      expect(typeof health.keyCount).toBe('number');
    });
  });

  describe('Fastify ETag & HTTP Caching Integration', () => {
    it('emits ETag and Cache-Control headers on catalog endpoints', async () => {
      const app = await buildApp();

      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/categories',
      });

      expect(res.statusCode).toBe(200);
      const etag = res.headers['etag'];
      expect(etag).toBeDefined();
      expect(String(etag)).toMatch(/^W\/"[a-f0-9]+"/);

      const cacheControl = res.headers['cache-control'];
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('max-age=60');

      await app.close();
    });

    it('returns 304 Not Modified when client provides matching If-None-Match header', async () => {
      const app = await buildApp();

      // First request to obtain ETag
      const initialRes = await app.inject({
        method: 'GET',
        url: '/api/v1/categories',
      });

      expect(initialRes.statusCode).toBe(200);
      const etag = initialRes.headers['etag'] as string;
      expect(etag).toBeDefined();

      // Conditional request
      const conditionalRes = await app.inject({
        method: 'GET',
        url: '/api/v1/categories',
        headers: {
          'if-none-match': etag,
        },
      });

      expect(conditionalRes.statusCode).toBe(304);
      expect(conditionalRes.body).toBe('');

      await app.close();
    });
  });

  describe('Observability: Health Probes & Prometheus Metrics', () => {
    it('GET /healthz returns liveness probe with process memory and uptime', async () => {
      const app = await buildApp();

      const res = await app.inject({
        method: 'GET',
        url: '/healthz',
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.status).toBe('ok');
      expect(typeof body.uptimeSeconds).toBe('number');
      expect(body.memory).toBeDefined();
      expect(typeof body.memory.rssMb).toBe('number');

      await app.close();
    });

    it('GET /readyz returns readiness probe with database and cache checks', async () => {
      const app = await buildApp();

      const res = await app.inject({
        method: 'GET',
        url: '/readyz',
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.status).toBe('ready');
      expect(body.checks.cache).toBe('ok');
      expect(body.cacheType).toBe('memory');

      await app.close();
    });

    it('GET /metrics returns standard Prometheus formatted metric lines', async () => {
      const app = await buildApp();

      // Trigger a request to populate counters
      await app.inject({ method: 'GET', url: '/api/v1/ping' });

      const metricsRes = await app.inject({
        method: 'GET',
        url: '/metrics',
      });

      expect(metricsRes.statusCode).toBe(200);
      expect(metricsRes.headers['content-type']).toContain('text/plain');
      expect(metricsRes.body).toContain('process_uptime_seconds');
      expect(metricsRes.body).toContain('process_resident_memory_bytes');
      expect(metricsRes.body).toContain('http_requests_total');

      await app.close();
    });
  });
});

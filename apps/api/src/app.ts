import fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import { loadEnv, type Env } from './config/env.js';
import { requestIdPlugin } from './plugins/requestId.js';
import { errorHandlerPlugin } from './plugins/errorHandler.js';
import { idempotencyPlugin } from './plugins/idempotency.js';
import { rateLimitPlugin } from './plugins/rateLimit.js';
import { authPlugin } from './plugins/auth.js';
import { authRoutes } from './modules/auth/authRoutes.js';
import { catalogRoutes } from './modules/catalog/catalogRoutes.js';
import { cartRoutes } from './modules/cart/cartRoutes.js';
import { orderRoutes } from './modules/orders/orderRoutes.js';
import { inventoryRoutes } from './modules/inventory/inventoryRoutes.js';
import { cachingPlugin } from './plugins/caching.js';
import { metricsPlugin } from './plugins/metrics.js';
import { cacheService } from './modules/cache/cacheService.js';
import { getDb } from '@bansal/db';
import { sql } from 'drizzle-orm';
import { REDACTED_PATHS } from './plugins/logging.js';

export async function buildApp(envOverride?: Partial<Env>): Promise<FastifyInstance> {
  const env = loadEnv({ ...process.env, ...envOverride });

  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      redact: REDACTED_PATHS,
    },
    bodyLimit: 1048576, // 1 MB limit
  });

  // Security Headers
  await app.register(helmet, {
    contentSecurityPolicy: false, // APIs are JSON-only
    crossOriginEmbedderPolicy: false,
  });

  // Cookies
  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  // CORS
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
  await app.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'X-CSRF-Token',
      'Idempotency-Key',
      'If-Match',
    ],
  });

  // Core Plugins
  await app.register(requestIdPlugin);
  await app.register(errorHandlerPlugin);
  await app.register(idempotencyPlugin);
  await app.register(rateLimitPlugin, { maxRequests: 500, windowMs: 60000 });
  await app.register(authPlugin);

  // Authentication & Session Routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });

  // Catalog Routes (public)
  await app.register(catalogRoutes, { prefix: '/api/v1' });

  // Cart Routes (public + optional auth)
  await app.register(cartRoutes, { prefix: '/api/v1' });

  // Order & Checkout Routes (public + optional auth)
  await app.register(orderRoutes, { prefix: '/api/v1' });

  // Inventory & Mandi Operations Routes
  await app.register(inventoryRoutes, { prefix: '/api/v1' });

  // Performance, Caching & Observability (Phase 10)
  await app.register(cachingPlugin);
  await app.register(metricsPlugin);

  // Health and Readiness probes
  app.get('/healthz', async () => {
    const mem = process.memoryUsage();
    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      memory: {
        rssMb: Math.round(mem.rss / 1024 / 1024),
        heapMb: Math.round(mem.heapUsed / 1024 / 1024),
      },
    };
  });

  app.get('/readyz', async (_request, reply) => {
    let dbStatus = 'ok';
    try {
      const db = getDb();
      await db.execute(sql`SELECT 1`);
    } catch {
      dbStatus = 'degraded_or_detached';
    }

    const cacheHealth = cacheService.getHealth();

    return reply.send({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus,
        cache: cacheHealth.healthy ? 'ok' : 'error',
      },
      cacheType: cacheHealth.type,
      activeKeys: cacheHealth.keyCount,
    });
  });

  // Base API v1 ping
  app.get('/api/v1/ping', async () => {
    return { message: 'Bansal Foods API v1 operational' };
  });

  return app;
}

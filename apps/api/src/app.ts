import fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { loadEnv, type Env } from './config/env.js';
import { requestIdPlugin } from './plugins/requestId.js';
import { errorHandlerPlugin } from './plugins/errorHandler.js';
import { idempotencyPlugin } from './plugins/idempotency.js';
import { rateLimitPlugin } from './plugins/rateLimit.js';
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

  // Health and Readiness probes
  app.get('/healthz', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  app.get('/readyz', async (_request, reply) => {
    // In Phase 1, placeholder checks. Phase 2 will execute live DB and Redis ping.
    const isReady = true;
    if (!isReady) {
      return reply.status(503).send({ status: 'unready' });
    }
    return { status: 'ready', checks: { database: 'ok', redis: 'ok' } };
  });

  // Base API v1 ping
  app.get('/api/v1/ping', async () => {
    return { message: 'Bansal Foods API v1 operational' };
  });

  return app;
}

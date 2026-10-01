import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { createHash } from 'node:crypto';

const PUBLIC_CACHE_ROUTES = ['/api/v1/categories', '/api/v1/products', '/api/v1/search'];

const PRIVATE_NO_CACHE_ROUTES = ['/api/v1/auth', '/api/v1/cart', '/api/v1/orders', '/api/v1/admin'];

const cachingPluginImpl: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onSend', async (request, reply, payload) => {
    // Only apply ETag and Cache-Control to GET and HEAD requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return payload;
    }

    const url = request.url;

    // Apply strict no-store to authenticated and dynamic endpoints
    if (PRIVATE_NO_CACHE_ROUTES.some((prefix) => url.startsWith(prefix))) {
      reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      reply.header('Pragma', 'no-cache');
      return payload;
    }

    // Apply public cache-control to catalog endpoints
    const isPublicCatalog = PUBLIC_CACHE_ROUTES.some((prefix) => url.startsWith(prefix));
    if (isPublicCatalog) {
      reply.header('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    }

    // Only generate ETag for successful JSON/text payloads
    if (reply.statusCode === 200 && payload) {
      try {
        const strPayload =
          typeof payload === 'string'
            ? payload
            : Buffer.isBuffer(payload)
              ? payload
              : JSON.stringify(payload);
        const hash = createHash('sha256').update(strPayload).digest('hex').slice(0, 16);
        const etag = `W/"${hash}"`;

        reply.header('ETag', etag);

        const clientEtag = request.headers['if-none-match'];
        if (clientEtag && clientEtag === etag) {
          reply.code(304);
          return '';
        }
      } catch {
        // Fallback gracefully without ETag if serialization fails
      }
    }

    return payload;
  });
};

export const cachingPlugin = fp(cachingPluginImpl, {
  name: 'caching-plugin',
  fastify: '5.x',
});

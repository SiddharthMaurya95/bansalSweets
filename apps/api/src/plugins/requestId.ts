import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { generateUuidV7 } from '@bansal/shared';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string;
  }
}

const requestIdPluginAsync: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.addHook('onRequest', async (request, reply) => {
    const incomingId = request.headers['x-request-id'];
    const id =
      typeof incomingId === 'string' && incomingId.length > 0 ? incomingId : generateUuidV7();
    request.requestId = id;
    reply.header('x-request-id', id);
  });
};

export const requestIdPlugin = fp(requestIdPluginAsync, {
  name: 'requestIdPlugin',
});

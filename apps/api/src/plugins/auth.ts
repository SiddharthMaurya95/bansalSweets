import type { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { AppError, ERROR_CODES, type PermissionKey, type SystemRole } from '@bansal/shared';
import { verifyAccessToken, type AccessTokenClaims } from '../modules/auth/tokenService.js';

export interface AuthenticatedUser {
  userId: string;
  email: string | null;
  phone: string | null;
  role: SystemRole;
  permissions: PermissionKey[];
  tokenVersion: number;
  audience: 'CUSTOMER' | 'ADMIN';
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requirePermission: (
      permission: PermissionKey,
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (
      roles: SystemRole | readonly SystemRole[],
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireOwnership: (
      getOwnerId: (req: FastifyRequest) => string | undefined | Promise<string | undefined>,
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const authPluginAsync: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Authentication preHandler hook
  const authenticate = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        ERROR_CODES.UNAUTHORIZED,
        'Missing or malformed Authorization header',
        401,
      );
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Empty Bearer token', 401);
    }

    const claims: AccessTokenClaims = await verifyAccessToken(token);

    request.user = {
      userId: claims.sub,
      email: claims.email,
      phone: claims.phone,
      role: claims.role,
      permissions: claims.permissions || [],
      tokenVersion: claims.tokenVersion,
      audience: claims.audience,
    };
  };

  // RBAC Permission guard
  const requirePermission = (permission: PermissionKey) => {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (!request.user) {
        await authenticate(request, reply);
      }

      const user = request.user!;

      // Superuser ADMIN role bypasses granular checks
      if (user.role === 'ADMIN') {
        return;
      }

      if (!user.permissions.includes(permission)) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          `Forbidden: Missing required permission '${permission}'`,
          403,
        );
      }
    };
  };

  // Role guard
  const requireRole = (roles: SystemRole | readonly SystemRole[]) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (!request.user) {
        await authenticate(request, reply);
      }

      const user = request.user!;

      if (user.role === 'ADMIN') {
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          `Forbidden: Required role ${allowedRoles.join(' or ')}`,
          403,
        );
      }
    };
  };

  // Resource Ownership guard (Section 12.3 & 46 Startup Route Audit)
  const requireOwnership = (
    getOwnerId: (req: FastifyRequest) => string | undefined | Promise<string | undefined>,
  ) => {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      if (!request.user) {
        await authenticate(request, reply);
      }

      const user = request.user!;

      // Administrative roles with customer read permission can inspect any user resource
      if (user.role === 'ADMIN' || user.permissions.includes('customer:read')) {
        return;
      }

      const targetOwnerId = await getOwnerId(request);

      if (!targetOwnerId || targetOwnerId !== user.userId) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Forbidden: You do not have permission to access another user’s resource',
          403,
        );
      }
    };
  };

  fastify.decorate('authenticate', authenticate);
  fastify.decorate('requirePermission', requirePermission);
  fastify.decorate('requireRole', requireRole);
  fastify.decorate('requireOwnership', requireOwnership);
};

export const authPlugin = fp(authPluginAsync, {
  name: 'authPlugin',
});

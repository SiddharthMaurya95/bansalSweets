import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fastify, { type FastifyInstance } from 'fastify';
import { authPlugin } from '../plugins/auth.js';
import { errorHandlerPlugin } from '../plugins/errorHandler.js';
import { requestIdPlugin } from '../plugins/requestId.js';
import { createAccessToken } from '../modules/auth/tokenService.js';
import { generateUuidV7 } from '@bansal/shared';

describe('Auth & RBAC Middleware Guards (Section 12 & 46)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify({ logger: false });
    await app.register(requestIdPlugin);
    await app.register(errorHandlerPlugin);
    await app.register(authPlugin);

    // Protected Route 1: Requires Authentication
    app.get('/api/test/profile', { preHandler: [app.authenticate] }, async (req) => {
      return { user: req.user };
    });

    // Protected Route 2: Requires Permission 'order:refund'
    app.post(
      '/api/test/refund',
      { preHandler: [app.requirePermission('order:refund')] },
      async () => {
        return { status: 'refund_processed' };
      },
    );

    // Protected Route 3: Requires Role 'INVENTORY_MANAGER' or 'ADMIN'
    app.get(
      '/api/test/inventory',
      { preHandler: [app.requireRole(['INVENTORY_MANAGER', 'ADMIN'])] },
      async () => {
        return { status: 'inventory_viewed' };
      },
    );

    // Protected Route 4: Requires Ownership of Resource
    app.get(
      '/api/test/users/:userId/orders',
      {
        preHandler: [app.requireOwnership((req) => (req.params as { userId: string }).userId)],
      },
      async (req) => {
        return { status: 'user_orders_viewed', target: (req.params as { userId: string }).userId };
      },
    );

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects unauthenticated requests with 401 Unauthorized', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/test/profile',
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('authenticates valid Bearer tokens and attaches request.user', async () => {
    const userId = generateUuidV7();
    const token = await createAccessToken({
      userId,
      email: 'customer@example.com',
      phone: null,
      role: 'CUSTOMER',
      permissions: [],
      tokenVersion: 0,
      audience: 'CUSTOMER',
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/test/profile',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.user.userId).toBe(userId);
    expect(body.user.role).toBe('CUSTOMER');
  });

  it('enforces RBAC permission check: blocks user without required permission with 403 Forbidden', async () => {
    const token = await createAccessToken({
      userId: generateUuidV7(),
      email: 'manager@example.com',
      phone: null,
      role: 'STORE_MANAGER',
      permissions: ['product:read', 'product:write'], // Missing 'order:refund'
      tokenVersion: 0,
      audience: 'ADMIN',
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/test/refund',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('FORBIDDEN');
    expect(body.error.message).toContain('order:refund');
  });

  it('allows access to permission-guarded route if user has the permission', async () => {
    const token = await createAccessToken({
      userId: generateUuidV7(),
      email: 'order-mgr@example.com',
      phone: null,
      role: 'ORDER_MANAGER',
      permissions: ['order:refund'],
      tokenVersion: 0,
      audience: 'ADMIN',
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/test/refund',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe('refund_processed');
  });

  it('allows ADMIN role to bypass granular permission requirements', async () => {
    const adminToken = await createAccessToken({
      userId: generateUuidV7(),
      email: 'admin@bansalfoods.com',
      phone: null,
      role: 'ADMIN',
      permissions: [], // Empty perms, but ADMIN role bypasses
      tokenVersion: 0,
      audience: 'ADMIN',
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/test/refund',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
  });

  it('enforces ownership policy: allows user to access their own resource', async () => {
    const userId = generateUuidV7();
    const token = await createAccessToken({
      userId,
      email: 'user@example.com',
      phone: null,
      role: 'CUSTOMER',
      permissions: [],
      tokenVersion: 0,
      audience: 'CUSTOMER',
    });

    const res = await app.inject({
      method: 'GET',
      url: `/api/test/users/${userId}/orders`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe('user_orders_viewed');
  });

  it('enforces ownership policy: blocks user from accessing another user’s resource with 403 Forbidden', async () => {
    const userA = generateUuidV7();
    const userB = generateUuidV7();

    const tokenA = await createAccessToken({
      userId: userA,
      email: 'userA@example.com',
      phone: null,
      role: 'CUSTOMER',
      permissions: [],
      tokenVersion: 0,
      audience: 'CUSTOMER',
    });

    // User A attempts to view User B's orders
    const res = await app.inject({
      method: 'GET',
      url: `/api/test/users/${userB}/orders`,
      headers: { authorization: `Bearer ${tokenA}` },
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('FORBIDDEN');
    expect(body.error.message).toContain('another user’s resource');
  });

  it('enforces ownership policy: ADMIN or customer:read permission can access other user resources', async () => {
    const userB = generateUuidV7();

    const adminToken = await createAccessToken({
      userId: generateUuidV7(),
      email: 'admin@bansalfoods.com',
      phone: null,
      role: 'ADMIN',
      permissions: [],
      tokenVersion: 0,
      audience: 'ADMIN',
    });

    const res = await app.inject({
      method: 'GET',
      url: `/api/test/users/${userB}/orders`,
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
  });
});

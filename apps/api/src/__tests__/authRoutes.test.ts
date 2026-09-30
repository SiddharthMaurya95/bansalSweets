import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../app.js';
import { setDb } from '@bansal/db';
import { hashPassword } from '../modules/auth/crypto.js';
import { clearFailedAttempts } from '../modules/auth/authRoutes.js';
import { generateUuidV7 } from '@bansal/shared';

describe('Auth API Routes Integration (Section 11, 12 & 46)', () => {
  let app: FastifyInstance;

  const usersTable = new Map<string, any>();
  const tokensTable = new Map<string, any>();
  const resetTokensTable = new Map<string, any>();

  beforeAll(async () => {
    app = await buildApp({ LOG_LEVEL: 'fatal' });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    usersTable.clear();
    tokensTable.clear();
    resetTokensTable.clear();
    clearFailedAttempts();

    const makeBuilder = (data: any[]) => ({
      limit: (_n: number) => makeBuilder(data),
      then: (resolve: any, reject: any) => Promise.resolve(data).then(resolve, reject),
    });

    const mockDb: any = {
      query: {
        users: {
          findFirst: async () => {
            // Find user in table
            for (const u of usersTable.values()) {
              return u;
            }
            return null;
          },
        },
        roles: {
          findFirst: async () => ({ id: 'role-customer', name: 'CUSTOMER' }),
        },
        refreshTokens: {
          findFirst: async () => {
            for (const t of tokensTable.values()) {
              return t;
            }
            return null;
          },
        },
        passwordResetTokens: {
          findFirst: async () => {
            for (const t of resetTokensTable.values()) {
              return t;
            }
            return null;
          },
        },
      },
      select: () => ({
        from: () => {
          const joinObj: any = {
            where: () => makeBuilder([{ roleName: 'CUSTOMER', roleId: 'role-customer' }]),
            limit: () => makeBuilder([{ roleName: 'CUSTOMER', roleId: 'role-customer' }]),
            innerJoin: () => joinObj,
          };
          return {
            innerJoin: () => joinObj,
            where: () => makeBuilder([{ roleName: 'CUSTOMER', roleId: 'role-customer' }]),
          };
        },
      }),
      insert: () => ({
        values: async (data: any) => {
          if (data.email || data.name) {
            usersTable.set(data.id, { ...data, tokenVersion: 0, status: 'ACTIVE' });
          } else if (data.tokenHash && data.familyId) {
            tokensTable.set(data.id, { ...data, revokedAt: null, replacedBy: null });
          } else if (data.tokenHash && data.userId) {
            resetTokensTable.set(data.id || generateUuidV7(), { ...data, usedAt: null });
          }
          return data;
        },
      }),
      update: () => ({
        set: (data: any) => ({
          where: async () => {
            for (const u of usersTable.values()) {
              Object.assign(u, data);
            }
          },
        }),
      }),
      transaction: async (cb: any) => cb(mockDb),
    };

    setDb(mockDb);
  });

  describe('POST /api/v1/auth/register', () => {
    it('rejects weak password with 422 Validation Error', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          name: 'Shashwat Bansal',
          email: 'shashwat@bansalfoods.com',
          password: 'weak', // missing uppercase, numbers, < 8 chars
        },
      });

      expect(res.statusCode).toBe(422);
      const body = JSON.parse(res.payload);
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.message).toContain('at least 8 characters');
    });

    it('rejects registration with neither email nor phone', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          name: 'Shashwat Bansal',
          password: 'StrongPassword#2026',
        },
      });

      expect(res.statusCode).toBe(422);
      const body = JSON.parse(res.payload);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('registers a new customer successfully, returns tokens, and sets refresh cookie', async () => {
      // Mock db returns null for existing user check
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          name: 'Shashwat Bansal',
          email: 'newuser@bansalfoods.com',
          phone: '9876543210',
          password: 'StrongPassword#2026',
          marketingOptIn: true,
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body.user).toBeDefined();
      expect(body.user.name).toBe('Shashwat Bansal');
      expect(body.user.email).toBe('newuser@bansalfoods.com');
      expect(body.user.role).toBe('CUSTOMER');
      expect(body.accessToken).toBeDefined();

      // Check HttpOnly refresh token cookie
      const cookies = res.cookies;
      const refreshCookie = cookies.find((c) => c.name === 'refreshToken');
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie?.httpOnly).toBe(true);
      expect(refreshCookie?.path).toBe('/api/v1/auth');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('rejects invalid password with 401 INVALID_CREDENTIALS', async () => {
      const testHash = await hashPassword('CorrectPassword#2026');
      usersTable.set('user-1', {
        id: 'user-1',
        name: 'Existing User',
        email: 'user@bansalfoods.com',
        phone: null,
        passwordHash: testHash,
        status: 'ACTIVE',
        tokenVersion: 0,
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          identifier: 'user@bansalfoods.com',
          password: 'WrongPassword#123',
        },
      });

      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.payload);
      expect(body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('locks out account after 5 consecutive failed login attempts', async () => {
      const testHash = await hashPassword('CorrectPassword#2026');
      usersTable.set('user-1', {
        id: 'user-1',
        name: 'Target Account',
        email: 'lockout@bansalfoods.com',
        passwordHash: testHash,
        status: 'ACTIVE',
        tokenVersion: 0,
      });

      // 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await app.inject({
          method: 'POST',
          url: '/api/v1/auth/login',
          payload: {
            identifier: 'lockout@bansalfoods.com',
            password: 'WrongAttempt',
          },
        });
      }

      // 6th attempt should be blocked by account lockout
      const res6 = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          identifier: 'lockout@bansalfoods.com',
          password: 'CorrectPassword#2026', // Even with correct password!
        },
      });

      expect(res6.statusCode).toBe(423);
      const body = JSON.parse(res6.payload);
      expect(body.error.code).toBe('ACCOUNT_LOCKED');
      expect(body.error.message).toContain('temporarily locked');
    });

    it('blocks CUSTOMER user from logging into ADMIN audience portal', async () => {
      const testHash = await hashPassword('CustomerPassword#2026');
      usersTable.set('user-cust', {
        id: 'user-cust',
        name: 'Retail Customer',
        email: 'cust@bansalfoods.com',
        passwordHash: testHash,
        status: 'ACTIVE',
        tokenVersion: 0,
      });

      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          identifier: 'cust@bansalfoods.com',
          password: 'CustomerPassword#2026',
          audience: 'ADMIN',
        },
      });

      expect(res.statusCode).toBe(403);
      const body = JSON.parse(res.payload);
      expect(body.error.code).toBe('FORBIDDEN');
      expect(body.error.message).toContain('administrative portals');
    });
  });

  describe('POST /api/v1/auth/refresh and logout', () => {
    it('returns 401 when refresh is called without cookie', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
      });

      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.payload);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('clears refresh token cookie on /logout', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/logout',
        cookies: {
          refreshToken: 'dummy-token',
        },
      });

      expect(res.statusCode).toBe(200);
      const refreshCookie = res.cookies.find((c) => c.name === 'refreshToken');
      expect(refreshCookie?.value).toBe('');
    });
  });

  describe('POST /api/v1/auth/password/forgot and /reset', () => {
    it('returns generic success on /forgot to prevent user enumeration', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/password/forgot',
        payload: {
          email: 'unknown-email@example.com',
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(body.message).toContain('reset link has been dispatched');
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createRefreshToken,
  rotateRefreshToken,
  revokeAllUserSessions,
} from '../modules/auth/tokenService.js';
import { setDb } from '@bansal/db';
import { hashToken } from '../modules/auth/crypto.js';

describe('Rotating Refresh Tokens & Family Reuse Detection (ADR 0008 & Section 46)', () => {
  const usersTable = new Map<string, any>();
  const tokensTable = new Map<string, any>();

  const testUserId = '018f3a2b-8a9d-7000-8000-user00000001';

  beforeEach(() => {
    usersTable.clear();
    tokensTable.clear();

    usersTable.set(testUserId, {
      id: testUserId,
      email: 'customer@bansalfoods.com',
      phone: '9876543210',
      status: 'ACTIVE',
      tokenVersion: 1,
    });

    const mockDb: any = {
      query: {
        users: {
          findFirst: async () => {
            return usersTable.get(testUserId) || null;
          },
        },
        refreshTokens: {
          findFirst: async () => {
            // Find by tokenHash
            for (const t of tokensTable.values()) {
              return t;
            }
            return null;
          },
        },
      },
      select: () => ({
        from: () => ({
          innerJoin: () => ({
            limit: async () => [{ roleName: 'CUSTOMER', roleId: 'role-1' }],
            innerJoin: () => ({
              innerJoin: () => ({
                where: async () => [],
              }),
            }),
          }),
        }),
      }),
      insert: () => ({
        values: async (data: any) => {
          tokensTable.set(data.id, {
            ...data,
            revokedAt: null,
            replacedBy: null,
          });
          return data;
        },
      }),
      update: () => ({
        set: (updateData: any) => ({
          where: async () => {
            for (const t of tokensTable.values()) {
              Object.assign(t, updateData);
            }
          },
        }),
      }),
      transaction: async (cb: any) => cb(mockDb),
    };

    setDb(mockDb);
  });

  it('issues a new refresh token and stores only its SHA-256 hash', async () => {
    const { rawToken, expiresAt } = await createRefreshToken({
      userId: testUserId,
      audience: 'CUSTOMER',
    });

    expect(rawToken).toBeDefined();
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Verify token stored in DB is hashed, NOT raw token
    const stored = Array.from(tokensTable.values())[0];
    expect(stored).toBeDefined();
    expect(stored.tokenHash).toBe(hashToken(rawToken));
    expect(stored.tokenHash).not.toBe(rawToken);
    expect(stored.revokedAt).toBeNull();
  });

  it('rotates a valid refresh token: emits new token, revokes previous, and returns new access token', async () => {
    const initial = await createRefreshToken({
      userId: testUserId,
      audience: 'CUSTOMER',
    });

    // Setup mock query to return this specific token by hash
    const firstKey = Array.from(tokensTable.keys())[0]!;
    const mockDb: any = {
      query: {
        users: {
          findFirst: async () => usersTable.get(testUserId),
        },
        refreshTokens: {
          findFirst: async () => tokensTable.get(firstKey),
        },
      },
      select: () => ({
        from: () => {
          const makeBuilder = (data: any[]) => ({
            limit: (_n: number) => makeBuilder(data),
            then: (resolve: any, reject: any) => Promise.resolve(data).then(resolve, reject),
          });

          const joinObj: any = {
            where: () => makeBuilder([{ roleName: 'CUSTOMER', roleId: 'role-1' }]),
            limit: () => makeBuilder([{ roleName: 'CUSTOMER', roleId: 'role-1' }]),
            innerJoin: () => joinObj,
          };
          return {
            innerJoin: () => joinObj,
            where: () => makeBuilder([{ roleName: 'CUSTOMER', roleId: 'role-1' }]),
          };
        },
      }),
      insert: () => ({
        values: async (data: any) => {
          tokensTable.set(data.id, {
            ...data,
            revokedAt: null,
            replacedBy: null,
          });
          return data;
        },
      }),
      update: () => ({
        set: (updateData: any) => ({
          where: async () => {
            const firstToken = tokensTable.get(firstKey);
            if (firstToken) Object.assign(firstToken, updateData);
          },
        }),
      }),
      transaction: async (cb: any) => cb(mockDb),
    };
    setDb(mockDb);

    const rotated = await rotateRefreshToken({
      rawToken: initial.rawToken,
    });

    expect(rotated.accessToken).toBeDefined();
    expect(rotated.newRefreshToken).toBeDefined();
    expect(rotated.newRefreshToken).not.toBe(initial.rawToken);

    // Initial token should now be revoked and replaced
    const initialStored = tokensTable.get(firstKey);
    expect(initialStored.revokedAt).not.toBeNull();
    expect(initialStored.replacedBy).toBeDefined();
  });

  it('detects refresh token reuse and immediately revokes entire token family (compromise indicator)', async () => {
    const familyId = 'family-alpha-123';
    const compromisedTokenId = 'tok-compromised';
    const rawToken = 'replayed-old-token';

    // Simulate an already revoked/replaced token in the family
    tokensTable.set(compromisedTokenId, {
      id: compromisedTokenId,
      userId: testUserId,
      familyId,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 100000),
      revokedAt: new Date(Date.now() - 5000), // Already revoked!
      replacedBy: 'tok-child-456',
    });

    // Also simulate a legitimate active child token in the same family
    const childTokenId = 'tok-child-456';
    tokensTable.set(childTokenId, {
      id: childTokenId,
      userId: testUserId,
      familyId,
      tokenHash: hashToken('child-token'),
      expiresAt: new Date(Date.now() + 100000),
      revokedAt: null,
      replacedBy: null,
    });

    let familyRevoked = false;

    const mockDb: any = {
      query: {
        refreshTokens: {
          findFirst: async () => tokensTable.get(compromisedTokenId),
        },
      },
      update: () => ({
        set: (updateData: any) => ({
          where: async () => {
            if (updateData.revokedAt) {
              familyRevoked = true;
              for (const t of tokensTable.values()) {
                if (t.familyId === familyId) {
                  t.revokedAt = updateData.revokedAt;
                }
              }
            }
          },
        }),
      }),
    };
    setDb(mockDb);

    // Replay attack: client attempts to use the already-revoked old token
    await expect(rotateRefreshToken({ rawToken })).rejects.toThrow(
      'Security anomaly detected. Session terminated.',
    );

    // Invariant: Entire family must have been revoked
    expect(familyRevoked).toBe(true);
    expect(tokensTable.get(childTokenId).revokedAt).not.toBeNull();
  });

  it('revokes all user sessions and increments tokenVersion on logout-all', async () => {
    let versionIncremented = false;

    const mockDb: any = {
      update: () => ({
        set: () => ({
          where: async () => {
            versionIncremented = true;
          },
        }),
      }),
      transaction: async (cb: any) => cb(mockDb),
    };
    setDb(mockDb);

    await revokeAllUserSessions(testUserId);
    expect(versionIncremented).toBe(true);
  });
});

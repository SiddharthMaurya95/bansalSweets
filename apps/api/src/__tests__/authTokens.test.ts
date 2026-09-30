import { describe, it, expect } from 'vitest';
import { createAccessToken, verifyAccessToken } from '../modules/auth/tokenService.js';
import { AppError } from '@bansal/shared';

describe('JWT Access Token Service', () => {
  it('creates and verifies a valid access token with claims', async () => {
    const userId = '018f3a2b-8a9d-7000-8000-123456789abc';
    const token = await createAccessToken({
      userId,
      email: 'owner@bansalfoods.com',
      phone: '9876543210',
      role: 'ADMIN',
      permissions: ['product:read', 'product:write', 'order:refund'],
      tokenVersion: 1,
      audience: 'ADMIN',
    });

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const claims = await verifyAccessToken(token);
    expect(claims.sub).toBe(userId);
    expect(claims.email).toBe('owner@bansalfoods.com');
    expect(claims.phone).toBe('9876543210');
    expect(claims.role).toBe('ADMIN');
    expect(claims.permissions).toEqual(['product:read', 'product:write', 'order:refund']);
    expect(claims.tokenVersion).toBe(1);
    expect(claims.audience).toBe('ADMIN');
    expect(claims.exp).toBeDefined();
  });

  it('rejects tampered or forged tokens', async () => {
    const token = await createAccessToken({
      userId: 'test-user',
      email: 'test@example.com',
      phone: null,
      role: 'CUSTOMER',
      permissions: [],
      tokenVersion: 0,
      audience: 'CUSTOMER',
    });

    // Tamper with payload part of JWT
    const parts = token.split('.');
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        ...JSON.parse(Buffer.from(parts[1]!, 'base64url').toString()),
        role: 'ADMIN',
      }),
    ).toString('base64url');
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    await expect(verifyAccessToken(tamperedToken)).rejects.toThrow(AppError);
  });

  it('rejects invalid or garbage token strings', async () => {
    await expect(verifyAccessToken('not.a.valid.jwt')).rejects.toThrow(AppError);
    await expect(verifyAccessToken('')).rejects.toThrow(AppError);
  });
});

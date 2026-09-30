import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  hashToken,
  constantTimeEquals,
  generateSecureRandomToken,
  generateNumericOtp,
} from '../modules/auth/crypto.js';

describe('Authentication Crypto Utilities (Section 46 / Argon2id)', () => {
  it('hashes passwords using Argon2id with conservative parameters and verifies correctly', async () => {
    const rawPassword = 'BansalSecurePassword#2026';
    const hash = await hashPassword(rawPassword);

    expect(hash).toBeDefined();
    // Argon2id standard identifier starts with $argon2id$
    expect(hash.startsWith('$argon2id$')).toBe(true);
    // Verify parameters: m=65536, t=3, p=4
    expect(hash).toContain('m=65536');
    expect(hash).toContain('p=4');
    expect(hash).toContain('t=3');

    const isValid = await verifyPassword(hash, rawPassword);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword(hash, 'WrongPassword123');
    expect(isInvalid).toBe(false);
  });

  it('computes deterministic SHA-256 digests for tokens', () => {
    const token = 'sample-refresh-token-string';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex string length
  });

  it('performs constant-time string equality safely', () => {
    const tokenA = hashToken('secret-token');
    const tokenB = hashToken('secret-token');
    const tokenC = hashToken('other-token');

    expect(constantTimeEquals(tokenA, tokenB)).toBe(true);
    expect(constantTimeEquals(tokenA, tokenC)).toBe(false);
    expect(constantTimeEquals(tokenA, 'short')).toBe(false);
  });

  it('generates secure random hex tokens of expected byte length', () => {
    const token32 = generateSecureRandomToken(32);
    expect(token32).toHaveLength(64); // 32 bytes in hex = 64 chars

    const token16 = generateSecureRandomToken(16);
    expect(token16).toHaveLength(32); // 16 bytes in hex = 32 chars
  });

  it('generates 6-digit numeric OTPs within expected range', () => {
    for (let i = 0; i < 20; i++) {
      const otp = generateNumericOtp(6);
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
      const num = parseInt(otp, 10);
      expect(num).toBeGreaterThanOrEqual(100000);
      expect(num).toBeLessThanOrEqual(999999);
    }
  });
});

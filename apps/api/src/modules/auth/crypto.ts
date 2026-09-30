import * as argon2 from 'argon2';
import { createHash, randomBytes, timingSafeEqual as nodeTimingSafeEqual } from 'node:crypto';

/**
 * Section 46 & Section 11.1 Security Invariants:
 * Password hashing uses Argon2id with strict parameters:
 * - memoryCost: 65536 (64 MB)
 * - timeCost: 3 iterations
 * - parallelism: 4 threads
 * - type: Argon2id (hybrid resistant to both side-channel and GPU/ASIC attacks)
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Hashes high-entropy tokens (refresh tokens, password reset, email verification)
 * using SHA-256 before database storage to prevent token theft from database leaks.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Constant-time comparison between two string digests to prevent timing attacks.
 */
export function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return nodeTimingSafeEqual(bufA, bufB);
}

/**
 * Cryptographically secure random token generator.
 */
export function generateSecureRandomToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

/**
 * Generates a 6-digit numeric OTP.
 */
export function generateNumericOtp(digits = 6): string {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const range = max - min + 1;
  const randomBuffer = randomBytes(4);
  const randomInt = randomBuffer.readUInt32BE(0);
  const code = min + (randomInt % range);
  return code.toString();
}

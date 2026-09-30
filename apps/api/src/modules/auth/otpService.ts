import { eq, and, desc, gt, gte, sql } from 'drizzle-orm';
import { getDb } from '@bansal/db';
import { otpChallenges } from '@bansal/db/schema';
import { AppError, ERROR_CODES, generateUuidV7 } from '@bansal/shared';
import { loadEnv } from '../../config/env.js';
import { hashToken, generateNumericOtp } from './crypto.js';
import { createLogger } from '../../plugins/logging.js';

const logger = createLogger();

export interface OtpProvider {
  sendOtp(
    phone: string,
    otp: string,
    purpose: string,
  ): Promise<{ success: boolean; messageId?: string }>;
}

/**
 * In-memory test store for verifying OTPs in automated tests without real SMS costs
 */
export const testOtpStore = new Map<string, string>();

export class MockOtpProvider implements OtpProvider {
  async sendOtp(
    phone: string,
    otp: string,
    purpose: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    const env = loadEnv();

    if (env.NODE_ENV === 'production' && env.ENABLE_PHONE_OTP) {
      throw new Error(
        'Real SMS Gateway Provider (e.g. MSG91 or Twilio) MUST be configured in production.',
      );
    }

    testOtpStore.set(`${phone}:${purpose}`, otp);

    const maskedPhone = phone.length > 4 ? `+91 ******${phone.slice(-4)}` : phone;
    logger.info({ phone: maskedPhone, purpose }, 'Mock OTP dispatched successfully');

    return {
      success: true,
      messageId: `mock_msg_${Date.now()}`,
    };
  }
}

let activeOtpProvider: OtpProvider = new MockOtpProvider();

export function setOtpProvider(provider: OtpProvider): void {
  activeOtpProvider = provider;
}

/**
 * Creates and dispatches a 6-digit OTP challenge with a 5-minute validity window.
 */
export async function sendOtpChallenge(params: {
  phone: string;
  purpose: 'LOGIN' | 'CHECKOUT' | 'PHONE_VERIFY';
  ip?: string;
}): Promise<{ challengeId: string; expiresAt: Date }> {
  const db = getDb();

  // Validate phone format (Indian 10-digit mobile number)
  const cleanPhone = params.phone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      'Invalid mobile number. 10-digit number required.',
      422,
    );
  }

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  // Rate limiting check: max 3 OTP requests per phone in 10 minutes
  const recentChallenges = await db
    .select({ count: sql<number>`count(*)` })
    .from(otpChallenges)
    .where(and(eq(otpChallenges.phone, cleanPhone), gte(otpChallenges.createdAt, tenMinutesAgo)));

  const requestCount = Number(recentChallenges[0]?.count || 0);
  if (requestCount >= 3) {
    throw new AppError(
      ERROR_CODES.RATE_LIMITED,
      'Too many OTP requests. Please wait 10 minutes before requesting again.',
      429,
    );
  }

  const otpCode = generateNumericOtp(6);
  const codeHash = hashToken(otpCode);
  const challengeId = generateUuidV7();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

  await db.insert(otpChallenges).values({
    id: challengeId,
    purpose: params.purpose,
    phone: cleanPhone,
    codeHash,
    attempts: 0,
    expiresAt,
    ip: params.ip,
  });

  // Dispatch via active provider
  await activeOtpProvider.sendOtp(cleanPhone, otpCode, params.purpose);

  return { challengeId, expiresAt };
}

/**
 * Verifies an OTP code against an active challenge with attempt limiting.
 */
export async function verifyOtpChallenge(params: {
  phone: string;
  purpose: 'LOGIN' | 'CHECKOUT' | 'PHONE_VERIFY';
  code: string;
}): Promise<{ verified: boolean; challengeId: string }> {
  const db = getDb();
  const cleanPhone = params.phone.replace(/\D/g, '').slice(-10);

  const challenge = await db.query.otpChallenges.findFirst({
    where: and(
      eq(otpChallenges.phone, cleanPhone),
      eq(otpChallenges.purpose, params.purpose),
      sql`verified_at IS NULL`,
      gt(otpChallenges.expiresAt, new Date()),
    ),
    orderBy: [desc(otpChallenges.createdAt)],
  });

  if (!challenge) {
    throw new AppError(
      ERROR_CODES.BAD_REQUEST,
      'Invalid or expired OTP. Please request a new code.',
      400,
    );
  }

  // Attempt limit: max 3 failed attempts
  if (challenge.attempts >= 3) {
    throw new AppError(
      ERROR_CODES.BAD_REQUEST,
      'Maximum verification attempts exceeded. Please request a new OTP.',
      400,
    );
  }

  const inputHash = hashToken(params.code.trim());

  if (challenge.codeHash !== inputHash) {
    await db
      .update(otpChallenges)
      .set({ attempts: challenge.attempts + 1 })
      .where(eq(otpChallenges.id, challenge.id));

    throw new AppError(
      ERROR_CODES.BAD_REQUEST,
      `Incorrect OTP. ${2 - challenge.attempts} attempt(s) remaining.`,
      400,
    );
  }

  // Mark as verified
  await db
    .update(otpChallenges)
    .set({ verifiedAt: new Date() })
    .where(eq(otpChallenges.id, challenge.id));

  return { verified: true, challengeId: challenge.id };
}

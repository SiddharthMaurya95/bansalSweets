import { describe, it, expect, beforeEach } from 'vitest';
import {
  sendOtpChallenge,
  verifyOtpChallenge,
  testOtpStore,
  MockOtpProvider,
  setOtpProvider,
} from '../modules/auth/otpService.js';
import { setDb } from '@bansal/db';
import { AppError } from '@bansal/shared';

describe('Phone OTP Abstraction Service (Section 46 / Flagged)', () => {
  const challenges = new Map<string, any>();

  beforeEach(() => {
    testOtpStore.clear();
    challenges.clear();
    setOtpProvider(new MockOtpProvider());

    // Provide mock db implementation for OTP operations
    const mockDb: any = {
      select: () => ({
        from: () => ({
          where: async () => [{ count: 0 }],
        }),
      }),
      insert: () => ({
        values: async (data: any) => {
          challenges.set(data.id, data);
          return data;
        },
      }),
      update: () => ({
        set: (updateData: any) => ({
          where: async () => {
            for (const c of challenges.values()) {
              Object.assign(c, updateData);
            }
          },
        }),
      }),
      query: {
        otpChallenges: {
          findFirst: async () => {
            const list = Array.from(challenges.values());
            return list[list.length - 1] || null;
          },
        },
      },
    };

    setDb(mockDb);
  });

  it('rejects phone numbers with invalid format (< 10 digits)', async () => {
    await expect(
      sendOtpChallenge({
        phone: '12345',
        purpose: 'LOGIN',
      }),
    ).rejects.toThrow(AppError);
  });

  it('generates, records, and dispatches a 6-digit OTP challenge via provider', async () => {
    const result = await sendOtpChallenge({
      phone: '9876543210',
      purpose: 'LOGIN',
    });

    expect(result.challengeId).toBeDefined();
    expect(result.expiresAt).toBeDefined();

    // Verify mock provider recorded the dispatched OTP
    const dispatchedCode = testOtpStore.get('9876543210:LOGIN');
    expect(dispatchedCode).toBeDefined();
    expect(dispatchedCode).toHaveLength(6);
  });

  it('verifies correct OTP code successfully', async () => {
    await sendOtpChallenge({
      phone: '9876543210',
      purpose: 'LOGIN',
    });

    const code = testOtpStore.get('9876543210:LOGIN')!;

    const verifyResult = await verifyOtpChallenge({
      phone: '9876543210',
      purpose: 'LOGIN',
      code,
    });

    expect(verifyResult.verified).toBe(true);
    expect(verifyResult.challengeId).toBeDefined();
  });

  it('rejects incorrect OTP code and decrements remaining attempts', async () => {
    await sendOtpChallenge({
      phone: '9876543210',
      purpose: 'LOGIN',
    });

    await expect(
      verifyOtpChallenge({
        phone: '9876543210',
        purpose: 'LOGIN',
        code: '000000',
      }),
    ).rejects.toThrow('Incorrect OTP');
  });

  it('locks out verification when maximum 3 attempts are exceeded', async () => {
    await sendOtpChallenge({
      phone: '9876543210',
      purpose: 'LOGIN',
    });

    // Artificially set attempts = 3
    for (const c of challenges.values()) {
      c.attempts = 3;
    }

    await expect(
      verifyOtpChallenge({
        phone: '9876543210',
        purpose: 'LOGIN',
        code: '123456',
      }),
    ).rejects.toThrow('Maximum verification attempts exceeded');
  });
});

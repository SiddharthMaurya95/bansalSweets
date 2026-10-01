import type { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { eq, and, sql, or } from 'drizzle-orm';
import { getDb } from '@bansal/db';
import { users, userRoles, roles, consents, passwordResetTokens } from '@bansal/db/schema';
import { AppError, ERROR_CODES, generateUuidV7 } from '@bansal/shared';
import { loadEnv } from '../../config/env.js';
import { hashPassword, verifyPassword, hashToken, generateSecureRandomToken } from './crypto.js';
import {
  createAccessToken,
  createRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserSessions,
  getUserRoleAndPermissions,
} from './tokenService.js';
import { sendOtpChallenge, verifyOtpChallenge } from './otpService.js';

// Failed login attempt tracking (In-memory, backs to Redis in prod)
interface FailedAttempt {
  count: number;
  lockedUntil?: number;
}
const failedAttempts = new Map<string, FailedAttempt>();

export function clearFailedAttempts(): void {
  failedAttempts.clear();
}

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    customerType: z.enum(['RETAIL', 'WHOLESALE']).default('RETAIL'),
    marketingOptIn: z.boolean().default(false),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or mobile number must be provided',
    path: ['email'],
  });

const loginSchema = z.object({
  identifier: z.string().min(3, 'Identifier must be provided'),
  password: z.string().min(1, 'Password is required'),
  audience: z.enum(['CUSTOMER', 'ADMIN']).default('CUSTOMER'),
});

const otpSendSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  purpose: z.enum(['LOGIN', 'CHECKOUT', 'PHONE_VERIFY']),
});

const otpVerifySchema = z.object({
  phone: z.string().min(10),
  purpose: z.enum(['LOGIN', 'CHECKOUT', 'PHONE_VERIFY']),
  code: z.string().length(6, 'OTP must be 6 digits'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email address required'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(16, 'Invalid reset token'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[a-z]/, 'Password must contain lowercase')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const env = loadEnv();

  // Helper to set secure refresh token cookie
  const setRefreshCookie = (reply: FastifyReply, rawToken: string, expiresAt: Date) => {
    reply.setCookie('refreshToken', rawToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
      expires: expiresAt,
    });
  };

  const clearRefreshCookie = (reply: FastifyReply) => {
    reply.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
    });
  };

  /**
   * POST /api/v1/auth/register
   */
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = registerSchema.safeParse(request.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Validation error';
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, firstError, 422);
    }

    const data = parseResult.data;
    const db = getDb();

    const normalizedEmail = data.email?.toLowerCase().trim();
    const cleanPhone = data.phone ? data.phone.replace(/\D/g, '').slice(-10) : undefined;

    // Check duplicate
    if (normalizedEmail) {
      const existingEmail = await db.query.users.findFirst({
        where: and(eq(users.email, normalizedEmail), sql`deleted_at IS NULL`),
      });
      if (existingEmail) {
        throw new AppError(ERROR_CODES.CONFLICT, 'An account with this email already exists', 409);
      }
    }

    if (cleanPhone) {
      const existingPhone = await db.query.users.findFirst({
        where: and(eq(users.phone, cleanPhone), sql`deleted_at IS NULL`),
      });
      if (existingPhone) {
        throw new AppError(
          ERROR_CODES.CONFLICT,
          'An account with this mobile number already exists',
          409,
        );
      }
    }

    // Hash password with Argon2id
    const passwordHash = await hashPassword(data.password);
    const userId = generateUuidV7();

    await db.transaction(async (tx) => {
      // 1. Create user
      await tx.insert(users).values({
        id: userId,
        name: data.name,
        email: normalizedEmail,
        phone: cleanPhone,
        passwordHash,
        customerType: data.customerType,
        marketingOptIn: data.marketingOptIn,
        status: 'ACTIVE',
      });

      // 2. Assign default CUSTOMER role
      const customerRole = await tx.query.roles.findFirst({
        where: eq(roles.name, 'CUSTOMER'),
      });
      if (customerRole) {
        await tx.insert(userRoles).values({
          userId,
          roleId: customerRole.id,
        });
      }

      // 3. Record consent if marketing opted in
      if (data.marketingOptIn && normalizedEmail) {
        await tx.insert(consents).values({
          userId,
          contact: normalizedEmail,
          purpose: 'MARKETING_EMAIL',
          granted: true,
          policyVersion: '1.0',
          source: 'REGISTER_FORM',
        });
      }
    });

    const { role, permissions: userPerms, tokenVersion } = await getUserRoleAndPermissions(userId);

    // Issue tokens
    const { rawToken, expiresAt } = await createRefreshToken({
      userId,
      audience: 'CUSTOMER',
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });

    const accessToken = await createAccessToken({
      userId,
      email: normalizedEmail || null,
      phone: cleanPhone || null,
      role,
      permissions: userPerms,
      tokenVersion,
      audience: 'CUSTOMER',
    });

    setRefreshCookie(reply, rawToken, expiresAt);

    return reply.status(201).send({
      user: {
        id: userId,
        name: data.name,
        email: normalizedEmail,
        phone: cleanPhone,
        customerType: data.customerType,
        role,
      },
      accessToken,
    });
  });

  /**
   * POST /api/v1/auth/login
   */
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Identifier and password are required', 422);
    }

    const { identifier, password, audience } = parseResult.data;
    const cleanId = identifier.trim().toLowerCase();

    // Account lockout check
    const attempt = failedAttempts.get(cleanId);
    if (attempt?.lockedUntil && Date.now() < attempt.lockedUntil) {
      const waitSeconds = Math.ceil((attempt.lockedUntil - Date.now()) / 1000);
      throw new AppError(
        ERROR_CODES.ACCOUNT_LOCKED,
        `Account is temporarily locked. Try again in ${Math.ceil(waitSeconds / 60)} minutes.`,
        423,
      );
    }

    const db = getDb();
    const cleanPhone = identifier.replace(/\D/g, '').slice(-10);

    const user = await db.query.users.findFirst({
      where: and(
        or(eq(users.email, cleanId), eq(users.phone, cleanPhone)),
        sql`deleted_at IS NULL`,
      ),
    });

    if (!user || !user.passwordHash) {
      // Record failed attempt
      const curr = failedAttempts.get(cleanId) || { count: 0 };
      curr.count++;
      if (curr.count >= 5) {
        curr.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lock
      }
      failedAttempts.set(cleanId, curr);

      throw new AppError(ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email/phone or password', 401);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError(
        ERROR_CODES.FORBIDDEN,
        'Account is suspended. Please contact support.',
        403,
      );
    }

    // Verify password with Argon2id
    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) {
      const curr = failedAttempts.get(cleanId) || { count: 0 };
      curr.count++;
      if (curr.count >= 5) {
        curr.lockedUntil = Date.now() + 15 * 60 * 1000;
      }
      failedAttempts.set(cleanId, curr);

      throw new AppError(ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email/phone or password', 401);
    }

    // Reset failed attempts on success
    failedAttempts.delete(cleanId);

    // Update lastLoginAt
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    const { role, permissions: userPerms, tokenVersion } = await getUserRoleAndPermissions(user.id);

    // Verify audience permissions (e.g. CUSTOMER cannot log into ADMIN portal)
    if (audience === 'ADMIN' && role === 'CUSTOMER') {
      throw new AppError(
        ERROR_CODES.FORBIDDEN,
        'Access denied. Customer credentials cannot access administrative portals.',
        403,
      );
    }

    const { rawToken, expiresAt } = await createRefreshToken({
      userId: user.id,
      audience,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });

    const accessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role,
      permissions: userPerms,
      tokenVersion,
      audience,
    });

    setRefreshCookie(reply, rawToken, expiresAt);

    return reply.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        customerType: user.customerType,
        role,
        permissions: userPerms,
      },
      accessToken,
    });
  });

  /**
   * POST /api/v1/auth/google
   * Authenticate or register using Google credentials
   */
  fastify.post('/google', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = (request.body || {}) as {
      credential?: string;
      email?: string;
      name?: string;
      googleId?: string;
    };

    let targetEmail = body.email;
    let targetName = body.name || 'Google User';

    // If Google JWT credential provided, safely extract claims
    if (body.credential) {
      try {
        const parts = body.credential.split('.');
        const jwtPart = parts[1];
        if (parts.length === 3 && jwtPart) {
          const payload = JSON.parse(Buffer.from(jwtPart, 'base64').toString('utf8'));
          if (payload.email) targetEmail = payload.email;
          if (payload.name) targetName = payload.name;
        }
      } catch {
        // Fallback to direct fields
      }
    }

    if (!targetEmail) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Google email address is required', 422);
    }

    const cleanEmail = targetEmail.trim().toLowerCase();
    const db = getDb();

    // Check if user already exists
    let user = await db.query.users.findFirst({
      where: and(eq(users.email, cleanEmail), sql`deleted_at IS NULL`),
    });

    if (!user) {
      // Create user from Google profile
      const userId = generateUuidV7();
      await db.insert(users).values({
        id: userId,
        email: cleanEmail,
        name: targetName,
        customerType: 'RETAIL',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
        marketingOptIn: true,
      });

      // Assign CUSTOMER role
      const customerRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'CUSTOMER'),
      });
      if (customerRole) {
        await db.insert(userRoles).values({
          userId,
          roleId: customerRole.id,
        });
      }

      user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
    } else {
      // Update last login
      await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
    }

    if (!user) {
      throw new AppError(ERROR_CODES.INTERNAL_ERROR, 'Failed to create Google user session', 500);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'Account is suspended. Please contact support.', 403);
    }

    const { role, permissions: userPerms, tokenVersion } = await getUserRoleAndPermissions(user.id);

    const { rawToken, expiresAt } = await createRefreshToken({
      userId: user.id,
      audience: 'CUSTOMER',
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });

    const accessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role,
      permissions: userPerms,
      tokenVersion,
      audience: 'CUSTOMER',
    });

    setRefreshCookie(reply, rawToken, expiresAt);

    return reply.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        customerType: user.customerType,
        role,
        permissions: userPerms,
      },
      accessToken,
    });
  });

  /**
   * POST /api/v1/auth/refresh
   */
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const rawToken = request.cookies?.refreshToken;
    if (!rawToken) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 'No refresh token provided', 401);
    }

    const result = await rotateRefreshToken({
      rawToken,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });

    setRefreshCookie(reply, result.newRefreshToken, result.expiresAt);

    return reply.send({
      accessToken: result.accessToken,
    });
  });

  /**
   * POST /api/v1/auth/logout
   */
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const rawToken = request.cookies?.refreshToken;
    if (rawToken) {
      await revokeRefreshToken(rawToken);
    }
    clearRefreshCookie(reply);
    return reply.send({ success: true, message: 'Logged out successfully' });
  });

  /**
   * POST /api/v1/auth/logout-all
   */
  fastify.post(
    '/logout-all',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user!;
      await revokeAllUserSessions(user.userId);
      clearRefreshCookie(reply);
      return reply.send({
        success: true,
        message: 'All active sessions have been terminated across all devices',
      });
    },
  );

  /**
   * GET /api/v1/auth/me
   */
  fastify.get(
    '/me',
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user!;
      const db = getDb();

      const profile = await db.query.users.findFirst({
        where: eq(users.id, user.userId),
        columns: {
          id: true,
          name: true,
          email: true,
          phone: true,
          customerType: true,
          status: true,
          marketingOptIn: true,
          createdAt: true,
        },
      });

      if (!profile) {
        throw new AppError(ERROR_CODES.NOT_FOUND, 'User profile not found', 404);
      }

      const userData = {
        ...profile,
        role: user.role,
        permissions: user.permissions,
      };

      return reply.send({
        user: userData,
        data: userData,
      });
    },
  );

  /**
   * POST /api/v1/auth/otp/send
   */
  fastify.post('/otp/send', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = otpSendSchema.safeParse(request.body);
    if (!parseResult.success) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Valid phone and purpose required', 422);
    }

    const { phone, purpose } = parseResult.data;
    const challenge = await sendOtpChallenge({
      phone,
      purpose,
      ip: request.ip,
    });

    return reply.send({
      challengeId: challenge.challengeId,
      expiresAt: challenge.expiresAt,
      message: 'OTP sent successfully',
    });
  });

  /**
   * POST /api/v1/auth/otp/verify
   */
  fastify.post('/otp/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = otpVerifySchema.safeParse(request.body);
    if (!parseResult.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        'Phone, purpose and 6-digit code required',
        422,
      );
    }

    const { phone, purpose, code } = parseResult.data;
    const result = await verifyOtpChallenge({
      phone,
      purpose,
      code,
    });

    return reply.send({
      verified: result.verified,
      message: 'OTP verified successfully',
    });
  });

  /**
   * POST /api/v1/auth/password/forgot
   */
  fastify.post('/password/forgot', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = forgotPasswordSchema.safeParse(request.body);
    if (!parseResult.success) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Valid email required', 422);
    }

    const { email } = parseResult.data;
    const db = getDb();
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, email.toLowerCase().trim()), sql`deleted_at IS NULL`),
    });

    // Always respond with success to avoid account enumeration attacks
    if (!user) {
      return reply.send({
        success: true,
        message: 'If the email exists, a password reset link has been dispatched.',
      });
    }

    const rawResetToken = generateSecureRandomToken(32);
    const tokenHash = hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // In a real dispatch, an email is enqueued to outbox. For API contract, return success
    return reply.send({
      success: true,
      message: 'If the email exists, a password reset link has been dispatched.',
      // Expose reset token only in development/test for automated testing flows
      ...(env.NODE_ENV !== 'production' ? { devResetToken: rawResetToken } : {}),
    });
  });

  /**
   * POST /api/v1/auth/password/reset
   */
  fastify.post('/password/reset', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = resetPasswordSchema.safeParse(request.body);
    if (!parseResult.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        parseResult.error.errors[0]?.message || 'Invalid parameters',
        422,
      );
    }

    const { token, newPassword } = parseResult.data;
    const tokenHash = hashToken(token);
    const db = getDb();

    const resetRecord = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        sql`used_at IS NULL`,
        sql`expires_at > NOW()`,
      ),
    });

    if (!resetRecord) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Invalid or expired password reset token', 400);
    }

    const newPasswordHash = await hashPassword(newPassword);

    await db.transaction(async (tx) => {
      // 1. Mark token as used
      await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(eq(passwordResetTokens.id, resetRecord.id));

      // 2. Update password and bump tokenVersion to kill any hijacked sessions
      await tx
        .update(users)
        .set({
          passwordHash: newPasswordHash,
          tokenVersion: sql`${users.tokenVersion} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, resetRecord.userId));
    });

    return reply.send({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  });

  // ── DELETE /auth/me (DPDP Act 2023 Right to Erasure) ────────────────────────

  fastify.delete(
    '/me',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'DPDP 2023: Right to Erasure - delete account and anonymize PII',
        tags: ['Authentication', 'Compliance'],
        security: [{ bearerAuth: [] }],
      } as any,
    },
    async (request, reply) => {
      const authUser = request.user!;
      const db = getDb();

      await db.transaction(async (tx) => {
        // 1. Revoke all active sessions and refresh token families
        await revokeAllUserSessions(authUser.userId);

        // 2. Soft-delete and anonymize PII in users table
        const anonId = authUser.userId.slice(0, 8);
        await tx
          .update(users)
          .set({
            name: 'Anonymized Patron',
            email: `deleted_${anonId}@anonymized.bansalfoods.in`,
            phone: `+9100000${anonId}`,
            status: 'DELETED',
            deletedAt: new Date(),
            marketingOptIn: false,
            updatedAt: new Date(),
          })
          .where(eq(users.id, authUser.userId));

        // 3. Withdraw all recorded consent records
        await tx
          .update(consents)
          .set({
            granted: false,
            occurredAt: new Date(),
          })
          .where(eq(consents.userId, authUser.userId));
      });

      // Clear refresh token cookie
      reply.clearCookie('bf_refresh_token', {
        path: '/api/v1/auth',
        httpOnly: true,
        sameSite: 'lax',
      });

      return reply.send({
        success: true,
        message: 'Account and associated personal data erased in compliance with DPDP Act 2023.',
      });
    },
  );
};

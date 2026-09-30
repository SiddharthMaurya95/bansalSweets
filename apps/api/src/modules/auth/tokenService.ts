import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { eq, and, sql } from 'drizzle-orm';
import { getDb } from '@bansal/db';
import {
  refreshTokens,
  users,
  userRoles,
  roles,
  rolePermissions,
  permissions,
} from '@bansal/db/schema';
import {
  AppError,
  ERROR_CODES,
  generateUuidV7,
  type PermissionKey,
  type SystemRole,
} from '@bansal/shared';
import { loadEnv } from '../../config/env.js';
import { hashToken, generateSecureRandomToken } from './crypto.js';
import { createLogger } from '../../plugins/logging.js';

const logger = createLogger();

export interface AccessTokenClaims extends JWTPayload {
  sub: string; // User ID
  email: string | null;
  phone: string | null;
  role: SystemRole;
  permissions: PermissionKey[];
  tokenVersion: number;
  audience: 'CUSTOMER' | 'ADMIN';
}

function getAccessSecret(): Uint8Array {
  const env = loadEnv();
  return new TextEncoder().encode(env.JWT_ACCESS_SECRET);
}

/**
 * Creates a signed short-lived (15 minutes) access token (Section 11.2 & ADR 0008).
 */
export async function createAccessToken(claims: {
  userId: string;
  email: string | null;
  phone: string | null;
  role: SystemRole;
  permissions: PermissionKey[];
  tokenVersion: number;
  audience: 'CUSTOMER' | 'ADMIN';
}): Promise<string> {
  const secret = getAccessSecret();

  return new SignJWT({
    email: claims.email,
    phone: claims.phone,
    role: claims.role,
    permissions: claims.permissions,
    tokenVersion: claims.tokenVersion,
    audience: claims.audience,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.userId)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret);
}

/**
 * Verifies and decodes an access token.
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenClaims> {
  const secret = getAccessSecret();
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AccessTokenClaims;
  } catch {
    throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Invalid or expired access token', 401);
  }
}

/**
 * Retrieves the effective role and aggregated permissions for a user.
 */
export async function getUserRoleAndPermissions(userId: string): Promise<{
  role: SystemRole;
  permissions: PermissionKey[];
  tokenVersion: number;
}> {
  const db = getDb();

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user || user.status !== 'ACTIVE') {
    throw new AppError(ERROR_CODES.UNAUTHORIZED, 'User not found or inactive', 401);
  }

  // Get primary role
  const userRoleRecord = await db
    .select({
      roleName: roles.name,
      roleId: roles.id,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId))
    .limit(1);

  const primaryRole = (userRoleRecord[0]?.roleName as SystemRole) || 'CUSTOMER';

  // Get all permissions assigned to user's roles
  const userPerms = await db
    .select({
      key: permissions.key,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(userRoles.userId, userId));

  const permKeys = Array.from(new Set(userPerms.map((p) => p.key as PermissionKey)));

  return {
    role: primaryRole,
    permissions: permKeys,
    tokenVersion: user.tokenVersion,
  };
}

/**
 * Issues a new refresh token family or child token.
 */
export async function createRefreshToken(params: {
  userId: string;
  familyId?: string;
  audience: 'CUSTOMER' | 'ADMIN';
  ip?: string;
  userAgent?: string;
}): Promise<{ rawToken: string; expiresAt: Date }> {
  const db = getDb();
  const rawToken = generateSecureRandomToken(32);
  const tokenHash = hashToken(rawToken);
  const tokenId = generateUuidV7();
  const familyId = params.familyId || generateUuidV7();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(refreshTokens).values({
    id: tokenId,
    userId: params.userId,
    familyId,
    tokenHash,
    expiresAt,
    audience: params.audience,
    ip: params.ip,
    userAgent: params.userAgent,
  });

  return { rawToken, expiresAt };
}

/**
 * Rotates a refresh token with strict family reuse detection (ADR 0008).
 * If a previously rotated or revoked token is reused, the entire token family is immediately
 * revoked to protect the account against token theft.
 */
export async function rotateRefreshToken(params: {
  rawToken: string;
  ip?: string;
  userAgent?: string;
}): Promise<{
  accessToken: string;
  newRefreshToken: string;
  expiresAt: Date;
  claims: AccessTokenClaims;
}> {
  const db = getDb();
  const tokenHash = hashToken(params.rawToken);

  const existing = await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens.tokenHash, tokenHash),
  });

  if (!existing) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Invalid refresh token', 401);
  }

  // REUSE DETECTION: If this token was already replaced or revoked, someone may be replaying an old token!
  if (existing.revokedAt !== null || existing.replacedBy !== null) {
    logger.warn(
      {
        userId: existing.userId,
        familyId: existing.familyId,
        tokenId: existing.id,
      },
      '🚨 SECURITY ALERT: Refresh token reuse detected! Revoking token family.',
    );

    // Invalidate entire family immediately
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.familyId, existing.familyId));

    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      'Security anomaly detected. Session terminated. Please log in again.',
      401,
    );
  }

  // Expiration check
  if (existing.expiresAt < new Date()) {
    throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Refresh token has expired', 401);
  }

  // Verify user status
  const user = await db.query.users.findFirst({
    where: eq(users.id, existing.userId),
  });

  if (!user || user.status !== 'ACTIVE') {
    throw new AppError(ERROR_CODES.UNAUTHORIZED, 'User account is inactive or suspended', 401);
  }

  const { role, permissions: userPerms, tokenVersion } = await getUserRoleAndPermissions(user.id);

  // Generate new replacement token in same family
  const newRawToken = generateSecureRandomToken(32);
  const newTokenHash = hashToken(newRawToken);
  const newTokenId = generateUuidV7();
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Execute atomic replacement
  await db.transaction(async (tx) => {
    // 1. Mark current token as replaced & revoked
    await tx
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        replacedBy: newTokenId,
      })
      .where(eq(refreshTokens.id, existing.id));

    // 2. Insert new token
    await tx.insert(refreshTokens).values({
      id: newTokenId,
      userId: user.id,
      familyId: existing.familyId,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
      audience: existing.audience,
      ip: params.ip,
      userAgent: params.userAgent,
    });
  });

  const accessToken = await createAccessToken({
    userId: user.id,
    email: user.email,
    phone: user.phone,
    role,
    permissions: userPerms,
    tokenVersion,
    audience: existing.audience,
  });

  const claims: AccessTokenClaims = {
    sub: user.id,
    email: user.email,
    phone: user.phone,
    role,
    permissions: userPerms,
    tokenVersion,
    audience: existing.audience,
  };

  return {
    accessToken,
    newRefreshToken: newRawToken,
    expiresAt: newExpiresAt,
    claims,
  };
}

/**
 * Revokes a single active refresh token on logout.
 */
export async function revokeRefreshToken(rawToken: string): Promise<void> {
  const db = getDb();
  const tokenHash = hashToken(rawToken);

  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(and(eq(refreshTokens.tokenHash, tokenHash), sql`revoked_at IS NULL`));
}

/**
 * Revokes all sessions for a user across all devices (ADR 0008).
 * Increments tokenVersion on users table to invalidate existing access tokens immediately.
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  const db = getDb();

  await db.transaction(async (tx) => {
    // 1. Revoke all refresh tokens
    await tx
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), sql`revoked_at IS NULL`));

    // 2. Increment token version to immediately invalidate in-flight access tokens
    await tx
      .update(users)
      .set({
        tokenVersion: sql`${users.tokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  });
}

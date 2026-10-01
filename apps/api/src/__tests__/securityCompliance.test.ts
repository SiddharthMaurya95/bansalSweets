import { describe, it, expect } from 'vitest';
import { buildApp } from '../app.js';
import { REDACTED_PATHS } from '../plugins/logging.js';
import { loadEnv } from '../config/env.js';

describe('Security Engineering & Compliance (Phase 11)', () => {
  describe('DPDP Act 2023 & Account Erasure', () => {
    it('rejects unauthenticated DELETE /api/v1/auth/me requests with 401', async () => {
      const app = await buildApp();

      const res = await app.inject({
        method: 'DELETE',
        url: '/api/v1/auth/me',
      });

      expect(res.statusCode).toBe(401);
      await app.close();
    });

    it('rejects unauthenticated GET /api/v1/auth/me requests with 401', async () => {
      const app = await buildApp();

      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
      });

      expect(res.statusCode).toBe(401);
      await app.close();
    });
  });

  describe('Security Headers & Helmet Audit', () => {
    it('sets strict security headers on API responses', async () => {
      const app = await buildApp();

      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/ping',
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-download-options']).toBe('noopen');
      expect(res.headers['x-dns-prefetch-control']).toBe('off');

      await app.close();
    });
  });

  describe('PII Redaction & Logging Audit', () => {
    it('contains comprehensive PII redaction paths for logs', () => {
      const requiredFields = [
        'password',
        'otp',
        'cardNumber',
        'cvv',
        'signature',
        'token',
        'refreshToken',
      ];

      for (const field of requiredFields) {
        const found = REDACTED_PATHS.some(
          (p) => p === field || p.includes(field) || p.endsWith(field),
        );
        expect(found).toBe(true);
      }
    });
  });

  describe('Production Environment Security Gatekeeper', () => {
    it('fails startup in production if insecure development placeholders are used', () => {
      expect(() => {
        loadEnv({
          NODE_ENV: 'production',
          JWT_ACCESS_SECRET: 'development_jwt_access_secret_min_32_chars_long!',
        });
      }).toThrow(/Production environment contains insecure placeholder/);
    });

    it('fails startup in production if __SET_ME__ placeholders are present', () => {
      expect(() => {
        loadEnv({
          NODE_ENV: 'production',
          JWT_ACCESS_SECRET: 'a_very_secure_production_secret_at_least_32_chars!',
          JWT_REFRESH_SECRET: 'another_very_secure_production_secret_32_chars!',
          COOKIE_SECRET: 'cookie_secret_with_adequate_entropy_for_production!',
          CSRF_SECRET: 'csrf_secret_with_adequate_entropy_for_production!',
          RAZORPAY_KEY_ID: '__SET_ME__',
        });
      }).toThrow(/Production environment contains insecure placeholder/);
    });
  });
});

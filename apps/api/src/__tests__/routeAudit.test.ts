import { describe, it, expect, beforeEach } from 'vitest';
import fastify, { type FastifyInstance } from 'fastify';
import {
  routeAuditorPlugin,
  auditRouteSecurity,
  clearAuditedRoutes,
  getAuditedRoutes,
} from '../plugins/routeAuditor.js';
import { authPlugin } from '../plugins/auth.js';

describe('Startup Route Audit Test (Section 46 Requirement)', () => {
  beforeEach(() => {
    clearAuditedRoutes();
  });

  it('detects violations when an admin route lacks RBAC permission guards', () => {
    const fakeRoutes = [
      {
        method: 'GET',
        url: '/api/v1/admin/unprotected-secret-settings',
        hasAuth: false,
        hasPermissionGuard: false,
        hasOwnershipGuard: false,
      },
      {
        method: 'POST',
        url: '/api/v1/admin/products',
        hasAuth: true,
        hasPermissionGuard: true,
        hasOwnershipGuard: false,
      },
    ];

    const result = auditRouteSecurity(fakeRoutes);
    expect(result.passed).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0]?.url).toBe('/api/v1/admin/unprotected-secret-settings');
    expect(result.violations[0]?.reason).toContain('lacks required RBAC permission');
  });

  it('detects violations when a customer resource route lacks ownership policy', () => {
    const fakeRoutes = [
      {
        method: 'GET',
        url: '/api/v1/customer/orders/:userId',
        hasAuth: false,
        hasPermissionGuard: false,
        hasOwnershipGuard: false,
      },
    ];

    const result = auditRouteSecurity(fakeRoutes);
    expect(result.passed).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0]?.url).toBe('/api/v1/customer/orders/:userId');
    expect(result.violations[0]?.reason).toContain('lacks ownership verification');
  });

  it('passes audit when all admin and customer routes are properly guarded', async () => {
    const app: FastifyInstance = fastify({ logger: false });
    await app.register(routeAuditorPlugin);
    await app.register(authPlugin);

    // Properly guarded admin route
    app.post(
      '/api/v1/admin/inventory/adjust',
      { preHandler: [app.requirePermission('inventory:adjust')] },
      async () => ({ status: 'adjusted' }),
    );

    // Properly guarded customer resource route
    app.get(
      '/api/v1/customer/orders/:userId',
      {
        preHandler: [app.requireOwnership((req) => (req.params as { userId: string }).userId)],
      },
      async () => ({ status: 'orders' }),
    );

    await app.ready();

    const routes = getAuditedRoutes();
    const result = auditRouteSecurity(routes);
    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);

    await app.close();
  });
});

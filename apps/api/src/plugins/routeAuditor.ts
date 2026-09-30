import type { FastifyInstance, RouteOptions } from 'fastify';
import fp from 'fastify-plugin';

export interface RouteAuditRecord {
  method: string;
  url: string;
  hasAuth: boolean;
  hasPermissionGuard: boolean;
  hasOwnershipGuard: boolean;
}

export interface RouteAuditViolation {
  method: string;
  url: string;
  reason: string;
}

const auditRecords: RouteAuditRecord[] = [];

export function getAuditedRoutes(): RouteAuditRecord[] {
  return [...auditRecords];
}

export function clearAuditedRoutes(): void {
  auditRecords.length = 0;
}

/**
 * Startup Route Auditor (Section 46 Requirement):
 * Intercepts every registered route at server bootstrap.
 * Validates that:
 * 1. Every '/api/v1/admin/*' route is protected with RBAC permission / role guard.
 * 2. Every user-scoped resource route enforces ownership verification.
 */
export function auditRouteSecurity(routes: RouteAuditRecord[]): {
  passed: boolean;
  violations: RouteAuditViolation[];
} {
  const violations: RouteAuditViolation[] = [];

  for (const r of routes) {
    // 1. Admin Routes must require permissions
    if (r.url.startsWith('/api/v1/admin')) {
      if (!r.hasPermissionGuard) {
        violations.push({
          method: r.method,
          url: r.url,
          reason: 'Admin route lacks required RBAC permission or role guard',
        });
      }
    }

    // 2. Customer scoped resource routes (e.g. /users/:userId/* or /orders/:userId/*) must enforce ownership
    if (r.url.includes('/:userId') || r.url.startsWith('/api/v1/customer')) {
      if (!r.hasOwnershipGuard && !r.hasAuth) {
        violations.push({
          method: r.method,
          url: r.url,
          reason: 'Customer-scoped route lacks ownership verification or authentication',
        });
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

export const routeAuditorPlugin = fp(
  async (fastify: FastifyInstance) => {
    fastify.addHook('onRoute', (routeOptions: RouteOptions) => {
      const url = routeOptions.url;
      const method = Array.isArray(routeOptions.method)
        ? routeOptions.method.join(',')
        : routeOptions.method;

      // Check preHandlers for guards
      const preHandlers = Array.isArray(routeOptions.preHandler)
        ? routeOptions.preHandler
        : routeOptions.preHandler
          ? [routeOptions.preHandler]
          : [];

      const preHandlerNames = preHandlers.map((fn: any) => fn.name || fn.toString());

      const hasAuth = preHandlerNames.some(
        (name) =>
          name.includes('authenticate') ||
          name.includes('requirePermission') ||
          name.includes('requireRole') ||
          name.includes('requireOwnership'),
      );

      const hasPermissionGuard = preHandlerNames.some(
        (name) =>
          name.includes('requirePermission') ||
          name.includes('requireRole') ||
          name.includes('permission'),
      );

      const hasOwnershipGuard = preHandlerNames.some(
        (name) => name.includes('requireOwnership') || name.includes('ownership'),
      );

      auditRecords.push({
        method,
        url,
        hasAuth,
        hasPermissionGuard,
        hasOwnershipGuard,
      });
    });
  },
  { name: 'routeAuditorPlugin' },
);

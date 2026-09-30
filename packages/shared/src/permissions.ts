/**
 * Role-Based Access Control (RBAC) Permission Catalogue (Section 12.2)
 */

export const PERMISSIONS = [
  // Catalog
  'product:read',
  'product:write',
  'product:delete',
  'product:bulk',
  'category:write',
  'brand:write',
  'pricing:write',

  // Inventory
  'inventory:read',
  'inventory:adjust',
  'inventory:stocktake',

  // Orders
  'order:read',
  'order:update_status',
  'order:cancel',
  'order:refund',
  'order:note',
  'order:assign_delivery',
  'cod:collect',

  // Customers
  'customer:read',
  'customer:write',
  'customer:export',
  'customer:suspend',

  // Coupons
  'coupon:read',
  'coupon:write',

  // Content
  'content:read',
  'content:write',
  'review:moderate',
  'enquiry:read',

  // Delivery / Settings
  'delivery:write',
  'settings:read',
  'settings:write',

  // Analytics / Audit
  'analytics:view',
  'audit:view',

  // Access Control
  'user:read',
  'user:manage',
  'role:manage',
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number];

export const SYSTEM_ROLES = {
  ADMIN: 'ADMIN',
  STORE_MANAGER: 'STORE_MANAGER',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  ORDER_MANAGER: 'ORDER_MANAGER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

/**
 * Default permission mappings seeded by migration (Section 12.2)
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRole, readonly PermissionKey[]> = {
  ADMIN: PERMISSIONS, // All permissions
  STORE_MANAGER: [
    'product:read',
    'product:write',
    'product:delete',
    'product:bulk',
    'category:write',
    'brand:write',
    'pricing:write',
    'coupon:read',
    'coupon:write',
    'content:read',
    'content:write',
    'review:moderate',
    'order:read',
    'customer:read',
    'analytics:view',
    'settings:read',
  ],
  INVENTORY_MANAGER: [
    'product:read',
    'inventory:read',
    'inventory:adjust',
    'inventory:stocktake',
    'analytics:view',
  ],
  ORDER_MANAGER: [
    'order:read',
    'order:update_status',
    'order:cancel',
    'order:note',
    'order:assign_delivery',
    'cod:collect',
    'customer:read',
    'enquiry:read',
  ],
  CUSTOMER: [], // Own-data access only, no admin permissions
};

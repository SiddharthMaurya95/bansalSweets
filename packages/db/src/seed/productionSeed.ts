import { PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, SYSTEM_ROLES } from '@bansal/shared';
import { getDb } from '../client';
import {
  roles,
  permissions,
  rolePermissions,
  categories,
  inventoryLocations,
  storeSettings,
} from '../schema/index';
import { eq } from 'drizzle-orm';

/**
 * Production Seed Data
 * ONLY structural, verified system data: roles, permissions, categories skeleton,
 * default warehouse location, and core settings.
 * NO fake products, fake reviews, fake GSTIN, or synthetic customer data.
 */
export async function runProductionSeed(): Promise<void> {
  const db = getDb();
  console.log('🌱 Starting Production Seed...');

  // 1. Seed Permissions
  console.log('  -> Seeding permissions catalogue...');
  const permissionIdMap = new Map<string, string>();
  for (const permKey of PERMISSIONS) {
    const [inserted] = await db
      .insert(permissions)
      .values({
        key: permKey,
        description: `Permission to ${permKey}`,
      })
      .onConflictDoUpdate({
        target: permissions.key,
        set: { description: `Permission to ${permKey}` },
      })
      .returning({ id: permissions.id, key: permissions.key });

    if (inserted) {
      permissionIdMap.set(inserted.key, inserted.id);
    }
  }

  // 2. Seed System Roles and Role Permissions
  console.log('  -> Seeding system roles and role_permissions...');
  for (const [roleName, permKeys] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    const isSystemRole = roleName !== SYSTEM_ROLES.CUSTOMER;
    const [roleRow] = await db
      .insert(roles)
      .values({
        name: roleName,
        description: `System role for ${roleName}`,
        isSystem: isSystemRole,
      })
      .onConflictDoUpdate({
        target: roles.name,
        set: { isSystem: isSystemRole },
      })
      .returning({ id: roles.id, name: roles.name });

    if (roleRow) {
      for (const permKey of permKeys) {
        const permId = permissionIdMap.get(permKey);
        if (permId) {
          await db
            .insert(rolePermissions)
            .values({
              roleId: roleRow.id,
              permissionId: permId,
            })
            .onConflictDoNothing();
        }
      }
    }
  }

  // 3. Seed Initial Category Skeleton (Section 14.1)
  console.log('  -> Seeding category taxonomy skeleton...');
  const initialCategories = [
    { name: 'Almonds', slug: 'almonds', sortRank: 10 },
    { name: 'Cashews', slug: 'cashews', sortRank: 20 },
    { name: 'Pistachios', slug: 'pistachios', sortRank: 30 },
    { name: 'Walnuts', slug: 'walnuts', sortRank: 40 },
    { name: 'Raisins', slug: 'raisins', sortRank: 50 },
    { name: 'Dates', slug: 'dates', sortRank: 60 },
    { name: 'Figs', slug: 'figs', sortRank: 70 },
    { name: 'Apricots', slug: 'apricots', sortRank: 80 },
    { name: 'Seeds', slug: 'seeds', sortRank: 90 },
    { name: 'Mixed Dry Fruits', slug: 'mixed-dry-fruits', sortRank: 100 },
    { name: 'Premium Dry Fruits', slug: 'premium-dry-fruits', sortRank: 110 },
    { name: 'Gift Packs', slug: 'gift-packs', sortRank: 120 },
    { name: 'Combos', slug: 'combos', sortRank: 130 },
    { name: 'Seasonal Products', slug: 'seasonal-products', sortRank: 140 },
  ];

  for (const cat of initialCategories) {
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, cat.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(categories).values({
        name: cat.name,
        slug: cat.slug,
        sortRank: cat.sortRank,
        isActive: true,
        depth: 0,
      });
    }
  }

  // 4. Seed Default Central Inventory Location (Fatehpuri)
  console.log('  -> Seeding default inventory location...');
  const [defaultLoc] = await db
    .select({ id: inventoryLocations.id })
    .from(inventoryLocations)
    .where(eq(inventoryLocations.code, 'FATEHPURI_MAIN'))
    .limit(1);

  if (!defaultLoc) {
    await db.insert(inventoryLocations).values({
      name: 'Fatehpuri Central Warehouse',
      code: 'FATEHPURI_MAIN',
      isDefault: true,
      address: 'Fatehpuri, Chandni Chowk, Delhi - 110006',
    });
  }

  // 5. Seed Core Store Settings Defaults
  console.log('  -> Seeding store_settings defaults...');
  const defaultSettings = [
    {
      key: 'general',
      value: {
        storeName: 'Bansal Foods',
        legalName: '__SET_ME__',
        gstin: '__SET_ME__',
        fssaiNumber: '__SET_ME__',
        contactPhones: ['9313321535'],
        whatsappNumber: '9313321535',
        supportEmail: 'care@bansalfoods.example.com',
        address: 'Fatehpuri, Delhi - 110006',
        reservationTtlMinutes: 15,
        currency: 'INR',
      },
    },
    {
      key: 'timings',
      value: {
        weekly: {
          monday: { open: '10:00', close: '20:30', closed: false },
          tuesday: { open: '10:00', close: '20:30', closed: false },
          wednesday: { open: '10:00', close: '20:30', closed: false },
          thursday: { open: '10:00', close: '20:30', closed: false },
          friday: { open: '10:00', close: '20:30', closed: false },
          saturday: { open: '10:00', close: '20:30', closed: false },
          sunday: { open: '10:00', close: '20:30', closed: true },
        },
      },
    },
    {
      key: 'delivery',
      value: {
        sameDayCutoffTime: '16:00',
        defaultEstimatedDays: 2,
        freeDeliveryAbovePaise: 99900, // ₹999
        pickupEnabled: true,
      },
    },
  ];

  for (const s of defaultSettings) {
    await db
      .insert(storeSettings)
      .values({
        key: s.key,
        value: s.value,
        version: 1,
      })
      .onConflictDoNothing();
  }

  console.log('✅ Production Seed Completed.');
}

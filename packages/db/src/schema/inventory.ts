import {
  pgTable,
  uuid,
  text,
  bigint,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { products, productVariants } from './catalog';
import { users } from './identity';

/**
 * 44.3 Inventory Entities & Ledger
 */

export const inventoryLocations = pgTable('inventory_locations', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  code: text('code').notNull().unique(), // e.g. 'FATEHPURI_MAIN'
  isDefault: boolean('is_default').default(true).notNull(),
  address: text('address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const inventoryItems = pgTable(
  'inventory_items',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    locationId: uuid('location_id')
      .references(() => inventoryLocations.id, { onDelete: 'restrict' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
    stockUnit: text('stock_unit', { enum: ['UNIT', 'GRAM'] })
      .default('UNIT')
      .notNull(),
    onHandQty: bigint('on_hand_qty', { mode: 'number' }).default(0).notNull(),
    reservedQty: bigint('reserved_qty', { mode: 'number' }).default(0).notNull(),
    onlineBufferQty: bigint('online_buffer_qty', { mode: 'number' }).default(0).notNull(),
    lowStockThreshold: bigint('low_stock_threshold', { mode: 'number' }).default(5).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('inventory_items_location_variant_idx')
      .on(table.locationId, table.variantId)
      .where(sql`${table.variantId} IS NOT NULL`),
    uniqueIndex('inventory_items_location_product_gram_idx')
      .on(table.locationId, table.productId)
      .where(sql`${table.variantId} IS NULL AND ${table.stockUnit} = 'GRAM'`),
    check('inventory_items_on_hand_check', sql`${table.onHandQty} >= 0`),
    check('inventory_items_reserved_check', sql`${table.reservedQty} >= 0`),
    check('inventory_items_reserved_le_on_hand', sql`${table.reservedQty} <= ${table.onHandQty}`),
  ],
);

export const inventoryTransactions = pgTable(
  'inventory_transactions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    inventoryItemId: uuid('inventory_item_id')
      .references(() => inventoryItems.id, { onDelete: 'restrict' })
      .notNull(),
    type: text('type', {
      enum: [
        'RECEIPT',
        'ADJUSTMENT',
        'RESERVE',
        'RELEASE',
        'SALE_COMMIT',
        'RETURN_RESTOCK',
        'DAMAGE',
        'EXPIRY_WRITE_OFF',
        'STOCKTAKE',
        'COUNTER_SALE',
      ],
    }).notNull(),
    deltaOnHand: bigint('delta_on_hand', { mode: 'number' }).notNull(),
    deltaReserved: bigint('delta_reserved', { mode: 'number' }).notNull(),
    onHandAfter: bigint('on_hand_after', { mode: 'number' }).notNull(),
    reservedAfter: bigint('reserved_after', { mode: 'number' }).notNull(),
    referenceType: text('reference_type'), // e.g. 'ORDER', 'STOCKTAKE', 'MANUAL'
    referenceId: uuid('reference_id'),
    reasonCode: text('reason_code'),
    note: text('note'),
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('inventory_transactions_item_created_idx').on(table.inventoryItemId, table.createdAt),
    index('inventory_transactions_reference_idx').on(table.referenceType, table.referenceId),
  ],
);

export const inventoryReservations = pgTable(
  'inventory_reservations',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id').notNull(),
    inventoryItemId: uuid('inventory_item_id')
      .references(() => inventoryItems.id, { onDelete: 'restrict' })
      .notNull(),
    quantity: bigint('quantity', { mode: 'number' }).notNull(),
    status: text('status', { enum: ['ACTIVE', 'CONFIRMED', 'FULFILLED', 'RELEASED'] })
      .default('ACTIVE')
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('inventory_reservations_order_idx').on(table.orderId),
    index('inventory_reservations_expires_idx')
      .on(table.expiresAt)
      .where(sql`${table.status} = 'ACTIVE'`),
    check('inventory_reservations_qty_check', sql`${table.quantity} > 0`),
  ],
);

export const inventoryBatches = pgTable(
  'inventory_batches',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    inventoryItemId: uuid('inventory_item_id')
      .references(() => inventoryItems.id, { onDelete: 'cascade' })
      .notNull(),
    batchNumber: text('batch_number').notNull().unique(), // e.g. 'BATCH-2026-KM-01'
    supplierName: text('supplier_name').notNull(),
    originCountry: text('origin_country').default('India').notNull(),
    grade: text('grade'), // e.g. 'W240 Jumbo', 'Kashmiri Mamra 1st Choice'
    initialQty: bigint('initial_qty', { mode: 'number' }).notNull(),
    remainingQty: bigint('remaining_qty', { mode: 'number' }).notNull(),
    costPerUnitPaise: bigint('cost_per_unit_paise', { mode: 'number' }).notNull(),
    harvestDate: timestamp('harvest_date', { withTimezone: true }),
    packagedDate: timestamp('packaged_date', { withTimezone: true }).defaultNow().notNull(),
    bestBeforeDate: timestamp('best_before_date', { withTimezone: true }).notNull(),
    fssaiBatchCert: text('fssai_batch_cert'),
    status: text('status', { enum: ['ACTIVE', 'EXHAUSTED', 'EXPIRED', 'QUARANTINED'] })
      .default('ACTIVE')
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('inventory_batches_item_idx').on(table.inventoryItemId),
    index('inventory_batches_expiry_idx').on(table.bestBeforeDate),
    check('inventory_batches_remaining_qty_check', sql`${table.remainingQty} >= 0`),
    check('inventory_batches_qty_check', sql`${table.remainingQty} <= ${table.initialQty}`),
  ],
);

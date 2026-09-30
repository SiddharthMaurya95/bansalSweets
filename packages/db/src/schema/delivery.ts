import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  date,
  time,
  numeric,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * 44.8 Delivery Zones, Pincodes, Rates & Holidays
 */

export const pincodes = pgTable('pincodes', {
  pincode: text('pincode').primaryKey(), // 6-digit Indian PIN Code e.g. '110006'
  city: text('city').notNull(),
  district: text('district').notNull(),
  state: text('state').notNull(),
  stateCode: text('state_code').notNull(), // e.g. '07' for Delhi
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const deliveryZones = pgTable('delivery_zones', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(), // e.g. 'Old Delhi Central', 'Delhi-NCR Standard'
  type: text('type', { enum: ['PINCODE', 'AREA', 'DISTANCE'] })
    .default('PINCODE')
    .notNull(),
  priority: integer('priority').default(0).notNull(), // Higher priority evaluated first
  isActive: boolean('is_active').default(true).notNull(),
  codAllowed: boolean('cod_allowed').default(true).notNull(),
  etaText: text('eta_text').notNull(), // e.g. 'Same Day (Order before 4 PM)'
  cutoffTime: time('cutoff_time'), // e.g. '16:00:00'
  centerLat: numeric('center_lat', { precision: 10, scale: 7 }),
  centerLng: numeric('center_lng', { precision: 10, scale: 7 }),
  minKm: numeric('min_km', { precision: 6, scale: 2 }),
  maxKm: numeric('max_km', { precision: 6, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const deliveryZonePincodes = pgTable(
  'delivery_zone_pincodes',
  {
    zoneId: uuid('zone_id')
      .references(() => deliveryZones.id, { onDelete: 'cascade' })
      .notNull(),
    pincode: text('pincode')
      .references(() => pincodes.pincode, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.zoneId, table.pincode] }),
    index('delivery_zone_pincodes_pincode_idx').on(table.pincode),
  ],
);

export const deliveryRates = pgTable('delivery_rates', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  zoneId: uuid('zone_id')
    .references(() => deliveryZones.id, { onDelete: 'cascade' })
    .notNull(),
  minOrderPaise: bigint('min_order_paise', { mode: 'number' }).default(0).notNull(),
  maxOrderPaise: bigint('max_order_paise', { mode: 'number' }),
  feePaise: bigint('fee_paise', { mode: 'number' }).notNull(),
  freeAbovePaise: bigint('free_above_paise', { mode: 'number' }), // Free delivery threshold
  codFeePaise: bigint('cod_fee_paise', { mode: 'number' }).default(0).notNull(),
  estimatedDays: integer('estimated_days').default(1).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const storeHolidays = pgTable('store_holidays', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  date: date('date').notNull().unique(),
  reason: text('reason').notNull(),
  isClosed: boolean('is_closed').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

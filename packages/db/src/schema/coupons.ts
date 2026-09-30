import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * 44.7 Coupons & Redemptions
 */

export const coupons = pgTable(
  'coupons',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    code: text('code').notNull(),
    type: text('type', { enum: ['PERCENT', 'FIXED', 'FREE_DELIVERY'] }).notNull(),
    value: bigint('value', { mode: 'number' }).notNull(), // Basis points (e.g. 1000 = 10%) or paise for fixed
    maxDiscountPaise: bigint('max_discount_paise', { mode: 'number' }),
    minOrderPaise: bigint('min_order_paise', { mode: 'number' }).default(0).notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    usageLimitTotal: integer('usage_limit_total'),
    usageLimitPerUser: integer('usage_limit_per_user'),
    usedCount: integer('used_count').default(0).notNull(),
    firstOrderOnly: boolean('first_order_only').default(false).notNull(),
    stackable: boolean('stackable').default(false).notNull(),
    appliesToSaleItems: boolean('applies_to_sale_items').default(true).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isPromoted: boolean('is_promoted').default(false).notNull(),
    description: text('description'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('coupons_code_idx')
      .on(sql`lower(${table.code})`)
      .where(sql`${table.deletedAt} IS NULL`),
    check('coupons_used_count_check', sql`${table.usedCount} >= 0`),
  ],
);

export const couponScopes = pgTable(
  'coupon_scopes',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    couponId: uuid('coupon_id')
      .references(() => coupons.id, { onDelete: 'cascade' })
      .notNull(),
    scopeType: text('scope_type', {
      enum: ['PRODUCT', 'VARIANT', 'CATEGORY', 'COLLECTION'],
    }).notNull(),
    scopeId: uuid('scope_id').notNull(),
    mode: text('mode', { enum: ['INCLUDE', 'EXCLUDE'] })
      .default('INCLUDE')
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('coupon_scopes_coupon_idx').on(table.couponId)],
);

export const couponRedemptions = pgTable(
  'coupon_redemptions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    couponId: uuid('coupon_id')
      .references(() => coupons.id, { onDelete: 'restrict' })
      .notNull(),
    orderId: uuid('order_id').notNull(),
    userKey: text('user_key').notNull(), // User UUID or normalized phone/email for guests
    status: text('status', { enum: ['RESERVED', 'CONFIRMED', 'RELEASED'] })
      .default('RESERVED')
      .notNull(),
    discountPaise: bigint('discount_paise', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('coupon_redemptions_coupon_order_idx').on(table.couponId, table.orderId),
    index('coupon_redemptions_user_status_idx').on(table.couponId, table.userKey, table.status),
  ],
);

import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './identity';
import { productVariants } from './catalog';

/**
 * 44.4 Cart Entities
 */

export const carts = pgTable(
  'carts',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    guestTokenHash: text('guest_token_hash'),
    status: text('status', { enum: ['ACTIVE', 'CONVERTED', 'ABANDONED', 'MERGED'] })
      .default('ACTIVE')
      .notNull(),
    couponId: uuid('coupon_id'), // Reference to coupons table
    deliveryPincode: text('delivery_pincode'),
    version: integer('version').default(1).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('carts_active_user_idx')
      .on(table.userId)
      .where(sql`${table.status} = 'ACTIVE' AND ${table.userId} IS NOT NULL`),
    uniqueIndex('carts_guest_token_idx')
      .on(table.guestTokenHash)
      .where(sql`${table.guestTokenHash} IS NOT NULL`),
    check(
      'carts_user_or_guest_check',
      sql`${table.userId} IS NOT NULL OR ${table.guestTokenHash} IS NOT NULL`,
    ),
  ],
);

export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    cartId: uuid('cart_id')
      .references(() => carts.id, { onDelete: 'cascade' })
      .notNull(),
    variantId: uuid('variant_id')
      .references(() => productVariants.id, { onDelete: 'cascade' })
      .notNull(),
    quantity: integer('quantity').notNull(),
    savedForLater: boolean('saved_for_later').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('cart_items_cart_variant_idx').on(table.cartId, table.variantId),
    check('cart_items_qty_check', sql`${table.quantity} > 0`),
  ],
);

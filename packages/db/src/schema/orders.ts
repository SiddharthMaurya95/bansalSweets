import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './identity';
import { products, productVariants } from './catalog';
import { carts } from './cart';
import { coupons } from './coupons';

/**
 * 44.5 Orders, Fulfilment, Invoices & Sequences
 */

export const orders = pgTable(
  'orders',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderNumber: text('order_number').notNull().unique(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    customerName: text('customer_name').notNull(),
    customerPhone: text('customer_phone').notNull(),
    customerEmail: text('customer_email'),
    channel: text('channel', { enum: ['WEB', 'ADMIN', 'WHATSAPP'] })
      .default('WEB')
      .notNull(),
    orderType: text('order_type', { enum: ['RETAIL', 'BULK', 'WHOLESALE'] })
      .default('RETAIL')
      .notNull(),

    // Order and Payment Status State Machines (Section 23.1)
    status: text('status', {
      enum: [
        'PENDING',
        'PAYMENT_PENDING',
        'CONFIRMED',
        'PROCESSING',
        'PACKED',
        'DISPATCHED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'RETURNED',
        'REFUNDED',
      ],
    }).notNull(),
    paymentStatus: text('payment_status', {
      enum: ['UNPAID', 'PENDING_COLLECTION', 'PAID', 'FAILED', 'PARTIALLY_REFUNDED', 'REFUNDED'],
    }).notNull(),
    paymentMethod: text('payment_method', {
      enum: ['UPI', 'CARD', 'NETBANKING', 'WALLET', 'COD'],
    }).notNull(),
    deliveryMethod: text('delivery_method', {
      enum: ['LOCAL_DELIVERY', 'STORE_PICKUP', 'COURIER'],
    }).notNull(),

    // Money in integer paise (Section 9.1)
    subtotalPaise: bigint('subtotal_paise', { mode: 'number' }).notNull(),
    discountPaise: bigint('discount_paise', { mode: 'number' }).default(0).notNull(),
    deliveryFeePaise: bigint('delivery_fee_paise', { mode: 'number' }).default(0).notNull(),
    codFeePaise: bigint('cod_fee_paise', { mode: 'number' }).default(0).notNull(),
    taxTotalPaise: bigint('tax_total_paise', { mode: 'number' }).notNull(),
    totalPaise: bigint('total_paise', { mode: 'number' }).notNull(),
    refundedPaise: bigint('refunded_paise', { mode: 'number' }).default(0).notNull(),
    currency: text('currency').default('INR').notNull(),

    couponId: uuid('coupon_id').references(() => coupons.id, { onDelete: 'set null' }),
    couponCode: text('coupon_code'),

    // Historical Snapshots
    shippingAddress: jsonb('shipping_address').notNull(),
    billingAddress: jsonb('billing_address'),
    customerGstin: text('customer_gstin'),
    placeOfSupplyStateCode: text('place_of_supply_state_code').notNull(), // e.g. '07'

    customerNote: text('customer_note'),
    cancelReason: text('cancel_reason'),
    sourceCartId: uuid('source_cart_id').references(() => carts.id, { onDelete: 'set null' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),

    // Timestamps
    placedAt: timestamp('placed_at', { withTimezone: true }).defaultNow().notNull(),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    dispatchedAt: timestamp('dispatched_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    version: integer('version').default(1).notNull(),
    ipHash: text('ip_hash'),
    userAgentHash: text('user_agent_hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('orders_user_placed_idx').on(table.userId, table.placedAt),
    index('orders_status_placed_idx').on(table.status, table.placedAt),
    index('orders_payment_status_placed_idx').on(table.paymentStatus, table.placedAt),
    index('orders_customer_phone_idx').on(table.customerPhone),
    uniqueIndex('orders_open_cart_idx')
      .on(table.sourceCartId)
      .where(sql`${table.status} = 'PAYMENT_PENDING'`),
    check('orders_total_paise_check', sql`${table.totalPaise} >= 0`),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'restrict' })
      .notNull(),
    variantId: uuid('variant_id')
      .references(() => productVariants.id, { onDelete: 'restrict' })
      .notNull(),
    sku: text('sku').notNull(),
    name: text('name').notNull(),
    variantLabel: text('variant_label').notNull(),
    imageUrl: text('image_url'),
    hsnCode: text('hsn_code'),
    weightGrams: integer('weight_grams').notNull(),
    quantity: integer('quantity').notNull(),
    unitMrpPaise: bigint('unit_mrp_paise', { mode: 'number' }).notNull(),
    unitPricePaise: bigint('unit_price_paise', { mode: 'number' }).notNull(),
    discountPaise: bigint('discount_paise', { mode: 'number' }).default(0).notNull(),
    lineTotalPaise: bigint('line_total_paise', { mode: 'number' }).notNull(),
    taxRateBps: integer('tax_rate_bps').notNull(),
    taxableValuePaise: bigint('taxable_value_paise', { mode: 'number' }).notNull(),
    cgstPaise: bigint('cgst_paise', { mode: 'number' }).default(0).notNull(),
    sgstPaise: bigint('sgst_paise', { mode: 'number' }).default(0).notNull(),
    igstPaise: bigint('igst_paise', { mode: 'number' }).default(0).notNull(),
    refundedQuantity: integer('refunded_quantity').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('order_items_order_idx').on(table.orderId),
    index('order_items_variant_idx').on(table.variantId),
    check('order_items_qty_check', sql`${table.quantity} > 0`),
  ],
);

export const orderEvents = pgTable(
  'order_events',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    type: text('type').notNull(), // e.g. 'STATUS_CHANGE', 'PAYMENT_CAPTURE', 'NOTE_ADDED'
    fromStatus: text('from_status'),
    toStatus: text('to_status'),
    actorType: text('actor_type', { enum: ['CUSTOMER', 'ADMIN', 'SYSTEM', 'GATEWAY'] }).notNull(),
    actorId: uuid('actor_id'),
    visibility: text('visibility', { enum: ['CUSTOMER', 'INTERNAL'] })
      .default('INTERNAL')
      .notNull(),
    note: text('note'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('order_events_order_created_idx').on(table.orderId, table.createdAt)],
);

export const shipments = pgTable(
  'shipments',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    method: text('method').notNull(),
    deliveryPersonId: uuid('delivery_person_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    courierName: text('courier_name'),
    trackingNumber: text('tracking_number'),
    trackingUrl: text('tracking_url'),
    dispatchedAt: timestamp('dispatched_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    proofUrl: text('proof_url'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('shipments_order_idx').on(table.orderId)],
);

export const invoices = pgTable('invoices', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  orderId: uuid('order_id')
    .references(() => orders.id, { onDelete: 'restrict' })
    .notNull(),
  invoiceNumber: text('invoice_number').notNull().unique(), // e.g. BF/2627/000123
  financialYear: text('financial_year').notNull(), // e.g. '2627'
  issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
  storageKey: text('storage_key').notNull(),
  type: text('type', { enum: ['TAX_INVOICE', 'CREDIT_NOTE'] })
    .default('TAX_INVOICE')
    .notNull(),
  relatedInvoiceId: uuid('related_invoice_id'),
  sellerSnapshot: jsonb('seller_snapshot').notNull(),
  buyerSnapshot: jsonb('buyer_snapshot').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const documentSequences = pgTable(
  'document_sequences',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    docType: text('doc_type').notNull(), // e.g. 'INVOICE', 'CREDIT_NOTE'
    financialYear: text('financial_year').notNull(), // e.g. '2627'
    prefix: text('prefix').notNull(), // e.g. 'BF/2627/'
    lastValue: bigint('last_value', { mode: 'number' }).default(0).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('doc_seq_type_fy_idx').on(table.docType, table.financialYear)],
);

import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './identity';
import { orders } from './orders';

/**
 * 44.6 Payments, Idempotency & Webhooks
 */

export const payments = pgTable(
  'payments',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'restrict' })
      .notNull(),
    provider: text('provider', { enum: ['RAZORPAY', 'COD', 'MANUAL'] }).notNull(),
    method: text('method'), // 'UPI', 'CARD', 'NETBANKING', 'WALLET', 'COD'
    status: text('status', {
      enum: [
        'CREATED',
        'AUTHORIZED',
        'CAPTURED',
        'FAILED',
        'PENDING_COLLECTION',
        'COLLECTED',
        'REFUNDED',
        'PARTIALLY_REFUNDED',
      ],
    }).notNull(),
    amountPaise: bigint('amount_paise', { mode: 'number' }).notNull(),
    currency: text('currency').default('INR').notNull(),
    providerOrderId: text('provider_order_id'), // Razorpay order id e.g. 'order_xyz'
    providerPaymentId: text('provider_payment_id'), // Razorpay payment id e.g. 'pay_xyz'
    signatureVerifiedAt: timestamp('signature_verified_at', { withTimezone: true }),
    failureCode: text('failure_code'),
    failureReason: text('failure_reason'),
    capturedAt: timestamp('captured_at', { withTimezone: true }),
    collectedBy: uuid('collected_by').references(() => users.id, { onDelete: 'set null' }),
    collectedAt: timestamp('collected_at', { withTimezone: true }),
    providerPayload: jsonb('provider_payload'), // Redacted
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('payments_order_idx').on(table.orderId),
    index('payments_provider_order_idx').on(table.providerOrderId),
    uniqueIndex('payments_provider_payment_idx')
      .on(table.provider, table.providerPaymentId)
      .where(sql`${table.providerPaymentId} IS NOT NULL`),
  ],
);

export const paymentAttempts = pgTable(
  'payment_attempts',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'set null' }),
    attemptNo: integer('attempt_no').notNull(),
    status: text('status').notNull(),
    providerError: jsonb('provider_error'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('payment_attempts_order_idx').on(table.orderId)],
);

export const refunds = pgTable(
  'refunds',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: uuid('order_id')
      .references(() => orders.id, { onDelete: 'restrict' })
      .notNull(),
    paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'restrict' }),
    amountPaise: bigint('amount_paise', { mode: 'number' }).notNull(),
    status: text('status', { enum: ['REQUESTED', 'PROCESSING', 'PROCESSED', 'FAILED'] })
      .default('REQUESTED')
      .notNull(),
    reason: text('reason').notNull(),
    method: text('method', { enum: ['ORIGINAL', 'MANUAL_UPI', 'MANUAL_BANK'] })
      .default('ORIGINAL')
      .notNull(),
    providerRefundId: text('provider_refund_id').unique(),
    idempotencyKey: text('idempotency_key').notNull().unique(),
    items: jsonb('items'),
    restock: boolean('restock').default(false).notNull(),
    requestedBy: uuid('requested_by')
      .references(() => users.id, { onDelete: 'set null' })
      .notNull(),
    approvedBy: uuid('approved_by').references(() => users.id, { onDelete: 'set null' }),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    reference: text('reference'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [check('refunds_amount_paise_check', sql`${table.amountPaise} > 0`)],
);

export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    provider: text('provider').notNull(), // 'RAZORPAY'
    eventId: text('event_id').notNull(), // Provider event identifier
    eventType: text('event_type').notNull(), // e.g. 'payment.captured'
    payload: jsonb('payload').notNull(), // Redacted
    signatureValid: boolean('signature_valid').notNull(),
    status: text('status', { enum: ['RECEIVED', 'PROCESSED', 'FAILED', 'IGNORED'] })
      .default('RECEIVED')
      .notNull(),
    error: text('error'),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('webhook_events_provider_event_idx').on(table.provider, table.eventId)],
);

export const idempotencyKeys = pgTable(
  'idempotency_keys',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    key: text('key').notNull(),
    scope: text('scope').notNull(), // User UUID or IP hash + endpoint
    requestHash: text('request_hash').notNull(),
    responseStatus: integer('response_status'),
    responseBody: jsonb('response_body'),
    lockedAt: timestamp('locked_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('idempotency_keys_scope_key_idx').on(table.scope, table.key)],
);

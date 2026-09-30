import {
  pgTable,
  uuid,
  text,
  integer,
  smallint,
  bigint,
  boolean,
  timestamp,
  date,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './identity';

/**
 * 44.9 Notifications, Content, Settings, Audit & Analytics
 */

export const notificationTemplates = pgTable(
  'notification_templates',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    key: text('key').notNull(), // e.g. 'order_placed', 'otp_code'
    channel: text('channel', { enum: ['EMAIL', 'SMS', 'WHATSAPP', 'IN_APP'] }).notNull(),
    locale: text('locale').default('en-IN').notNull(),
    version: integer('version').default(1).notNull(),
    subject: text('subject'),
    body: text('body').notNull(),
    providerTemplateId: text('provider_template_id'), // e.g. DLT template ID or WhatsApp template name
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('notification_templates_key_ch_loc_ver_idx').on(
      table.key,
      table.channel,
      table.locale,
      table.version,
    ),
  ],
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    data: jsonb('data'),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('notifications_user_read_idx').on(table.userId, table.readAt, table.createdAt)],
);

export const notificationDeliveries = pgTable('notification_deliveries', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  recipient: text('recipient').notNull(),
  channel: text('channel', { enum: ['EMAIL', 'SMS', 'WHATSAPP', 'IN_APP'] }).notNull(),
  templateKey: text('template_key').notNull(),
  dedupeKey: text('dedupe_key').notNull().unique(),
  status: text('status', {
    enum: ['QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'SUPPRESSED'],
  })
    .default('QUEUED')
    .notNull(),
  provider: text('provider'),
  providerMessageId: text('provider_message_id'),
  error: text('error'),
  attempts: integer('attempts').default(0).notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const outboxEvents = pgTable(
  'outbox_events',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    type: text('type').notNull(), // e.g. 'order.confirmed', 'payment.captured'
    aggregateType: text('aggregate_type').notNull(), // e.g. 'Order', 'Payment'
    aggregateId: uuid('aggregate_id').notNull(),
    payload: jsonb('payload').notNull(),
    status: text('status', { enum: ['PENDING', 'PROCESSED', 'FAILED'] })
      .default('PENDING')
      .notNull(),
    attempts: integer('attempts').default(0).notNull(),
    availableAt: timestamp('available_at', { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('outbox_events_pending_idx')
      .on(table.availableAt)
      .where(sql`${table.status} = 'PENDING'`),
  ],
);

export const banners = pgTable('banners', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  imageUrlMobile: text('image_url_mobile').notNull(),
  imageUrlDesktop: text('image_url_desktop').notNull(),
  altText: text('alt_text').notNull(),
  linkUrl: text('link_url'),
  position: text('position').default('HOME_HERO').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).defaultNow().notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  sortRank: integer('sort_rank').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const homeSections = pgTable('home_sections', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  type: text('type', {
    enum: [
      'HERO',
      'CATEGORY_TILES',
      'PRODUCT_RAIL',
      'COLLECTION',
      'OFFER_STRIP',
      'WHY_CHOOSE_US',
      'QUALITY',
      'TESTIMONIALS',
      'DELIVERY_INFO',
      'STORE_LOCATION',
      'BULK_CTA',
    ],
  }).notNull(),
  config: jsonb('config').notNull(),
  sortRank: integer('sort_rank').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const testimonials = pgTable('testimonials', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  location: text('location'),
  body: text('body').notNull(),
  rating: smallint('rating').default(5).notNull(),
  source: text('source', { enum: ['MANUAL', 'GOOGLE'] })
    .default('MANUAL')
    .notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const staticPages = pgTable('static_pages', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: text('slug').notNull().unique(), // e.g. 'about', 'privacy-policy', 'terms'
  title: text('title').notNull(),
  bodyHtml: text('body_html').notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const faqs = pgTable('faqs', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').default('GENERAL').notNull(),
  sortRank: integer('sort_rank').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  status: text('status', { enum: ['NEW', 'READ', 'REPLIED'] })
    .default('NEW')
    .notNull(),
  ipHash: text('ip_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const bulkEnquiries = pgTable('bulk_enquiries', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  businessName: text('business_name'),
  phone: text('phone').notNull(),
  email: text('email'),
  city: text('city'),
  itemsText: text('items_text').notNull(),
  estimatedQuantity: text('estimated_quantity'),
  notes: text('notes'),
  status: text('status', { enum: ['NEW', 'CONTACTED', 'QUOTED', 'CLOSED'] })
    .default('NEW')
    .notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const storeSettings = pgTable('store_settings', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  key: text('key').notNull().unique(), // e.g. 'general', 'taxes', 'delivery', 'timings'
  value: jsonb('value').notNull(),
  version: integer('version').default(1).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    actorRole: text('actor_role'),
    action: text('action').notNull(), // e.g. 'PRICE_CHANGE', 'REFUND_PROCESSED'
    entityType: text('entity_type').notNull(), // e.g. 'Product', 'Order'
    entityId: text('entity_id').notNull(),
    before: jsonb('before'),
    after: jsonb('after'),
    ip: text('ip'),
    userAgent: text('user_agent'),
    requestId: text('request_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('audit_logs_entity_idx').on(table.entityType, table.entityId, table.createdAt),
    index('audit_logs_actor_idx').on(table.actorId, table.createdAt),
  ],
);

// Analytics Summary Tables (Built asynchronously by rollup jobs)
export const analyticsDailySales = pgTable('analytics_daily_sales', {
  day: date('day').primaryKey(),
  orderCount: integer('order_count').default(0).notNull(),
  grossSalesPaise: bigint('gross_sales_paise', { mode: 'number' }).default(0).notNull(),
  netSalesPaise: bigint('net_sales_paise', { mode: 'number' }).default(0).notNull(),
  discountPaise: bigint('discount_paise', { mode: 'number' }).default(0).notNull(),
  taxPaise: bigint('tax_paise', { mode: 'number' }).default(0).notNull(),
  deliveryFeePaise: bigint('delivery_fee_paise', { mode: 'number' }).default(0).notNull(),
  refundedPaise: bigint('refunded_paise', { mode: 'number' }).default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const analyticsDailyProduct = pgTable(
  'analytics_daily_product',
  {
    day: date('day').notNull(),
    productId: uuid('product_id').notNull(),
    unitsSold: integer('units_sold').default(0).notNull(),
    revenuePaise: bigint('revenue_paise', { mode: 'number' }).default(0).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('analytics_daily_product_day_prod_idx').on(table.day, table.productId)],
);

export const analyticsDailyCategory = pgTable(
  'analytics_daily_category',
  {
    day: date('day').notNull(),
    categoryId: uuid('category_id').notNull(),
    unitsSold: integer('units_sold').default(0).notNull(),
    revenuePaise: bigint('revenue_paise', { mode: 'number' }).default(0).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('analytics_daily_category_day_cat_idx').on(table.day, table.categoryId)],
);

export const analyticsDailyCoupon = pgTable(
  'analytics_daily_coupon',
  {
    day: date('day').notNull(),
    couponId: uuid('coupon_id').notNull(),
    redemptionCount: integer('redemption_count').default(0).notNull(),
    discountPaise: bigint('discount_paise', { mode: 'number' }).default(0).notNull(),
    revenueInfluencedPaise: bigint('revenue_influenced_paise', { mode: 'number' })
      .default(0)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('analytics_daily_coupon_day_c_idx').on(table.day, table.couponId)],
);

export const analyticsDailyPayment = pgTable(
  'analytics_daily_payment',
  {
    day: date('day').notNull(),
    method: text('method').notNull(),
    successCount: integer('success_count').default(0).notNull(),
    failedCount: integer('failed_count').default(0).notNull(),
    amountPaise: bigint('amount_paise', { mode: 'number' }).default(0).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('analytics_daily_payment_day_method_idx').on(table.day, table.method)],
);

export const analyticsDailyTraffic = pgTable('analytics_daily_traffic', {
  day: date('day').primaryKey(),
  uniqueVisitors: integer('unique_visitors').default(0).notNull(),
  pageViews: integer('page_views').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

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
  numeric,
  jsonb,
  index,
  uniqueIndex,
  check,
  primaryKey,
  customType,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './identity';

/**
 * Custom PostgreSQL Types
 */
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

/**
 * 44.2 Catalog Entities
 */

export const brands = pgTable(
  'brands',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull(),
    logoUrl: text('logo_url'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('brands_slug_idx')
      .on(table.slug)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    parentId: uuid('parent_id'),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    introHtml: text('intro_html'),
    imageUrl: text('image_url'),
    sortRank: integer('sort_rank').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    depth: smallint('depth').default(0).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('categories_slug_idx')
      .on(table.slug)
      .where(sql`${table.deletedAt} IS NULL`),
    index('categories_parent_sort_idx').on(table.parentId, table.sortRank),
    check('categories_depth_check', sql`${table.depth} BETWEEN 0 AND 2`),
  ],
);

export const products = pgTable(
  'products',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    shortDescription: text('short_description'),
    description: text('description'),
    brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'set null' }),
    status: text('status', { enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'] })
      .default('DRAFT')
      .notNull(),
    publishAt: timestamp('publish_at', { withTimezone: true }),
    productType: text('product_type', { enum: ['SIMPLE', 'VARIANTS', 'BUNDLE'] })
      .default('VARIANTS')
      .notNull(),
    inventoryMode: text('inventory_mode', { enum: ['UNIT', 'GRAM', 'BUNDLE_COMPONENTS'] })
      .default('UNIT')
      .notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    isBestseller: boolean('is_bestseller').default(false).notNull(),
    isNewArrival: boolean('is_new_arrival').default(false).notNull(),
    sortRank: integer('sort_rank').default(0).notNull(),

    // GST & Compliance
    hsnCode: text('hsn_code'),
    taxRateBps: integer('tax_rate_bps').default(500).notNull(), // e.g. 500 = 5.00%
    taxInclusive: boolean('tax_inclusive').default(true).notNull(),

    // Limits & Food Compliance
    minOrderQty: integer('min_order_qty').default(1).notNull(),
    maxOrderQty: integer('max_order_qty').default(50).notNull(),
    shelfLifeDays: integer('shelf_life_days'),
    storageInstructions: text('storage_instructions'),
    ingredients: text('ingredients'),
    allergenNote: text('allergen_note'),
    countryOfOrigin: text('country_of_origin').default('India'),
    nutrition: jsonb('nutrition'),

    // SEO
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    ogImageUrl: text('og_image_url'),

    // Denormalized for high performance catalog queries
    minPricePaise: bigint('min_price_paise', { mode: 'number' }),
    maxPricePaise: bigint('max_price_paise', { mode: 'number' }),
    maxDiscountPct: smallint('max_discount_pct').default(0),
    inStock: boolean('in_stock').default(true).notNull(),
    ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }).default('0.00'),
    ratingCount: integer('rating_count').default(0).notNull(),
    salesCount: integer('sales_count').default(0).notNull(),

    // Full-Text Search
    searchVector: tsvector('search_vector'),
    version: integer('version').default(1).notNull(),
    isSeed: boolean('is_seed').default(false).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('products_slug_idx')
      .on(table.slug)
      .where(sql`${table.deletedAt} IS NULL`),
    index('products_active_featured_idx')
      .on(table.status, table.isFeatured, table.sortRank)
      .where(sql`${table.status} = 'ACTIVE' AND ${table.deletedAt} IS NULL`),
    index('products_min_price_idx').on(table.minPricePaise),
    index('products_sales_count_idx').on(table.salesCount),
    index('products_created_at_idx').on(table.createdAt),
    check('products_tax_rate_check', sql`${table.taxRateBps} BETWEEN 0 AND 2800`),
    check('products_order_qty_check', sql`${table.minOrderQty} <= ${table.maxOrderQty}`),
  ],
);

export const productCategories = pgTable(
  'product_categories',
  {
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: uuid('category_id')
      .references(() => categories.id, { onDelete: 'restrict' })
      .notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.categoryId] }),
    index('product_categories_cat_prod_idx').on(table.categoryId, table.productId),
    uniqueIndex('product_categories_primary_idx')
      .on(table.productId)
      .where(sql`${table.isPrimary} = true`),
  ],
);

export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    sku: text('sku').notNull(),
    label: text('label').notNull(), // e.g. "250 g", "500 g", "1 kg"
    weightGrams: integer('weight_grams').notNull(),
    mrpPaise: bigint('mrp_paise', { mode: 'number' }).notNull(),
    pricePaise: bigint('price_paise', { mode: 'number' }).notNull(),
    taxRateBps: integer('tax_rate_bps'), // Overrides product if set
    hsnCode: text('hsn_code'),
    minOrderQty: integer('min_order_qty'),
    maxOrderQty: integer('max_order_qty'),
    qtyStep: integer('qty_step').default(1).notNull(),
    gramsPerUnit: integer('grams_per_unit'), // Used for GRAM inventory mode
    barcode: text('barcode'),
    isDefault: boolean('is_default').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    sortRank: integer('sort_rank').default(0).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('product_variants_sku_idx')
      .on(table.sku)
      .where(sql`${table.deletedAt} IS NULL`),
    index('product_variants_product_active_idx').on(table.productId, table.isActive),
    uniqueIndex('product_variants_default_idx')
      .on(table.productId)
      .where(sql`${table.isDefault} = true AND ${table.deletedAt} IS NULL`),
    check('product_variants_weight_check', sql`${table.weightGrams} > 0`),
    check(
      'product_variants_price_check',
      sql`${table.pricePaise} <= ${table.mrpPaise} AND ${table.pricePaise} >= 0`,
    ),
  ],
);

export const variantPriceHistory = pgTable(
  'variant_price_history',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    variantId: uuid('variant_id')
      .references(() => productVariants.id, { onDelete: 'cascade' })
      .notNull(),
    oldMrpPaise: bigint('old_mrp_paise', { mode: 'number' }).notNull(),
    oldPricePaise: bigint('old_price_paise', { mode: 'number' }).notNull(),
    newMrpPaise: bigint('new_mrp_paise', { mode: 'number' }).notNull(),
    newPricePaise: bigint('new_price_paise', { mode: 'number' }).notNull(),
    changedBy: uuid('changed_by').references(() => users.id, { onDelete: 'set null' }),
    reason: text('reason').notNull(),
    effectiveAt: timestamp('effective_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('variant_price_history_variant_idx').on(table.variantId, table.createdAt)],
);

export const productImages = pgTable(
  'product_images',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
    storageKey: text('storage_key').notNull(),
    url: text('url').notNull(),
    width: integer('width'),
    height: integer('height'),
    blurhash: text('blurhash'),
    altText: text('alt_text').notNull(),
    sortRank: integer('sort_rank').default(0).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('product_images_product_sort_idx').on(table.productId, table.sortRank)],
);

export const attributeDefinitions = pgTable('attribute_definitions', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(), // e.g. 'origin', 'grade', 'raw_roasted'
  type: text('type', { enum: ['SELECT', 'BOOLEAN', 'TEXT'] })
    .default('SELECT')
    .notNull(),
  isFilterable: boolean('is_filterable').default(true).notNull(),
  sortRank: integer('sort_rank').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const productAttributeValues = pgTable(
  'product_attribute_values',
  {
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    attributeId: uuid('attribute_id')
      .references(() => attributeDefinitions.id, { onDelete: 'cascade' })
      .notNull(),
    value: text('value').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.attributeId, table.value] }),
    index('product_attribute_values_attr_val_idx').on(table.attributeId, table.value),
  ],
);

export const collections = pgTable(
  'collections',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    isActive: boolean('is_active').default(true).notNull(),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('collections_slug_idx')
      .on(table.slug)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);

export const collectionProducts = pgTable(
  'collection_products',
  {
    collectionId: uuid('collection_id')
      .references(() => collections.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    sortRank: integer('sort_rank').default(0).notNull(),
  },
  (table) => [primaryKey({ columns: [table.collectionId, table.productId] })],
);

export const bundleComponents = pgTable(
  'bundle_components',
  {
    bundleVariantId: uuid('bundle_variant_id')
      .references(() => productVariants.id, { onDelete: 'cascade' })
      .notNull(),
    componentVariantId: uuid('component_variant_id')
      .references(() => productVariants.id, { onDelete: 'restrict' })
      .notNull(),
    quantity: integer('quantity').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.bundleVariantId, table.componentVariantId] }),
    check('bundle_components_qty_check', sql`${table.quantity} > 0`),
  ],
);

export const searchSynonyms = pgTable('search_synonyms', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  term: text('term').notNull().unique(), // e.g. 'kaju'
  synonyms: text('synonyms').array().notNull(), // ['cashew', 'cashews']
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const searchQueries = pgTable(
  'search_queries',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    queryNormalized: text('query_normalized').notNull(),
    day: date('day').notNull(),
    count: integer('count').default(1).notNull(),
    zeroResults: integer('zero_results').default(0).notNull(),
  },
  (table) => [uniqueIndex('search_queries_query_day_idx').on(table.queryNormalized, table.day)],
);

export const slugRedirects = pgTable(
  'slug_redirects',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    entityType: text('entity_type', { enum: ['PRODUCT', 'CATEGORY', 'COLLECTION'] }).notNull(),
    oldSlug: text('old_slug').notNull(),
    newSlug: text('new_slug').notNull(),
    statusCode: smallint('status_code').default(301).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('slug_redirects_type_old_idx').on(table.entityType, table.oldSlug)],
);

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    orderItemId: uuid('order_item_id'),
    rating: smallint('rating').notNull(),
    title: text('title'),
    body: text('body'),
    status: text('status', { enum: ['PENDING', 'APPROVED', 'REJECTED'] })
      .default('PENDING')
      .notNull(),
    moderatedBy: uuid('moderated_by').references(() => users.id, { onDelete: 'set null' }),
    moderatedAt: timestamp('moderated_at', { withTimezone: true }),
    isVerifiedPurchase: boolean('is_verified_purchase').default(false).notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('reviews_user_product_idx')
      .on(table.userId, table.productId)
      .where(sql`${table.deletedAt} IS NULL`),
    index('reviews_product_created_idx')
      .on(table.productId, table.createdAt)
      .where(sql`${table.status} = 'APPROVED' AND ${table.deletedAt} IS NULL`),
    check('reviews_rating_check', sql`${table.rating} BETWEEN 1 AND 5`),
  ],
);

export const wishlistItems = pgTable(
  'wishlist_items',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('wishlist_user_product_variant_idx').on(
      table.userId,
      table.productId,
      sql`COALESCE(${table.variantId}, '00000000-0000-0000-0000-000000000000'::uuid)`,
    ),
  ],
);

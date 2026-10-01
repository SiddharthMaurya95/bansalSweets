import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { eq, and, sql, ilike, inArray, desc, asc, lt, gt, isNull } from 'drizzle-orm';
import { getDb } from '@bansal/db';
import {
  products,
  productVariants,
  productImages,
  categories,
  productCategories,
  reviews,
  brands,
} from '@bansal/db/schema';
import { AppError, ERROR_CODES } from '@bansal/shared';
import { reviewService } from './reviewService.js';
import { cacheService } from '../cache/cacheService.js';

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const listProductsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  category: z.string().optional(),
  search: z.string().max(200).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'bestseller', 'rating']).default('bestseller'),
  featured: z.coerce.boolean().optional(),
  inStock: z.coerce.boolean().optional(),
});

const reviewBodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(120).optional(),
  body: z.string().max(2000).optional(),
  verifiedPurchase: z.boolean().default(false),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a product summary shape from a joined query row */
function mapProductSummary(row: {
  product: typeof products.$inferSelect;
  defaultVariant: typeof productVariants.$inferSelect | null;
  primaryImage: typeof productImages.$inferSelect | null;
  brand: typeof brands.$inferSelect | null;
}) {
  const { product, defaultVariant, primaryImage, brand } = row;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    brand: brand ? { id: brand.id, name: brand.name, slug: brand.slug } : null,
    status: product.status,
    isFeatured: product.isFeatured,
    isBestseller: product.isBestseller,
    isNewArrival: product.isNewArrival,
    minPricePaise: product.minPricePaise,
    maxPricePaise: product.maxPricePaise,
    maxDiscountPct: product.maxDiscountPct,
    ratingAvg: Number(product.ratingAvg),
    ratingCount: product.ratingCount,
    inStock: product.inStock,
    countryOfOrigin: product.countryOfOrigin,
    defaultVariant: defaultVariant
      ? {
          id: defaultVariant.id,
          sku: defaultVariant.sku,
          label: defaultVariant.label,
          weightGrams: defaultVariant.weightGrams,
          pricePaise: defaultVariant.pricePaise,
          mrpPaise: defaultVariant.mrpPaise,
          isActive: defaultVariant.isActive,
        }
      : null,
    primaryImage: primaryImage
      ? {
          url: primaryImage.url,
          altText: primaryImage.altText,
          blurhash: primaryImage.blurhash,
          width: primaryImage.width,
          height: primaryImage.height,
        }
      : null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

// ─── Route Plugin ─────────────────────────────────────────────────────────────

export const catalogRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const db = getDb();

  // ── GET /categories ────────────────────────────────────────────────────────

  const FALLBACK_CATEGORIES = [
    { id: 'cat-almonds', name: 'Almonds', slug: 'almonds', isActive: true, sortRank: 1 },
    { id: 'cat-cashews', name: 'Cashews', slug: 'cashews', isActive: true, sortRank: 2 },
    { id: 'cat-pistachios', name: 'Pistachios', slug: 'pistachios', isActive: true, sortRank: 3 },
    { id: 'cat-walnuts', name: 'Walnuts', slug: 'walnuts', isActive: true, sortRank: 4 },
  ];

  fastify.get(
    '/categories',
    {
      schema: {
        description: 'List active product categories',
        tags: ['Catalog'],
        response: {
          200: { type: 'object', properties: { data: { type: 'array' } } },
        },
      } as any,
    },
    async (_request, reply) => {
      const rows = await cacheService.getOrSet('catalog:categories:all', 300, async () => {
        try {
          return await db
            .select()
            .from(categories)
            .where(and(eq(categories.isActive, true), isNull(categories.deletedAt)))
            .orderBy(asc(categories.sortRank), asc(categories.name));
        } catch {
          return FALLBACK_CATEGORIES;
        }
      });

      return reply.send({ data: rows });
    },
  );

  // ── GET /categories/:slug ──────────────────────────────────────────────────

  fastify.get<{ Params: { slug: string } }>(
    '/categories/:slug',
    {
      schema: {
        description: 'Get a single category by slug',
        tags: ['Catalog'],
        params: { type: 'object', properties: { slug: { type: 'string' } } },
      } as any,
    },
    async (request, reply) => {
      const [cat] = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.slug, request.params.slug),
            eq(categories.isActive, true),
            isNull(categories.deletedAt),
          ),
        )
        .limit(1);

      if (!cat) {
        throw new AppError(ERROR_CODES.NOT_FOUND, 'Category not found', 404);
      }
      return reply.send({ data: cat });
    },
  );

  // ── GET /products ──────────────────────────────────────────────────────────

  fastify.get(
    '/products',
    {
      schema: {
        description: 'Paginated product catalog with filtering and sorting',
        tags: ['Catalog'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            category: { type: 'string' },
            search: { type: 'string' },
            minPrice: { type: 'number' },
            maxPrice: { type: 'number' },
            sort: { type: 'string' },
            featured: { type: 'boolean' },
            inStock: { type: 'boolean' },
          },
        },
      } as any,
    },
    async (request, reply) => {
      const query = listProductsQuery.safeParse(request.query);
      if (!query.success) {
        throw new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          query.error.errors[0]?.message || 'Invalid query parameters',
          400,
          query.error.issues.map((i) => ({ field: i.path.join('.'), issue: i.message })),
        );
      }

      const { page, limit, category, search, minPrice, maxPrice, sort, featured, inStock } =
        query.data;
      const offset = (page - 1) * limit;

      // Build WHERE conditions
      const conditions = [eq(products.status, 'ACTIVE'), isNull(products.deletedAt)];

      if (featured !== undefined) {
        conditions.push(eq(products.isFeatured, featured));
      }
      if (inStock !== undefined) {
        conditions.push(eq(products.inStock, inStock));
      }
      if (minPrice !== undefined) {
        conditions.push(gt(products.minPricePaise, minPrice));
      }
      if (maxPrice !== undefined) {
        conditions.push(lt(products.maxPricePaise, maxPrice));
      }
      if (search) {
        conditions.push(ilike(products.name, `%${search}%`));
      }

      // Category filter via join
      let categoryProductIds: string[] | undefined;
      if (category) {
        const [cat] = await db
          .select({ id: categories.id })
          .from(categories)
          .where(
            and(
              eq(categories.slug, category),
              eq(categories.isActive, true),
              isNull(categories.deletedAt),
            ),
          )
          .limit(1);

        if (!cat) {
          return reply.send({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
        }

        const catProducts = await db
          .select({ productId: productCategories.productId })
          .from(productCategories)
          .where(eq(productCategories.categoryId, cat.id));

        categoryProductIds = catProducts.map((r) => r.productId);
        if (categoryProductIds.length === 0) {
          return reply.send({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
        }
        conditions.push(inArray(products.id, categoryProductIds));
      }

      // Sort
      const orderBy =
        sort === 'price_asc'
          ? asc(products.minPricePaise)
          : sort === 'price_desc'
            ? desc(products.maxPricePaise)
            : sort === 'newest'
              ? desc(products.createdAt)
              : sort === 'rating'
                ? desc(products.ratingAvg)
                : desc(products.salesCount); // bestseller default

      // Count
      const [countRow] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(and(...conditions));
      const count = countRow?.count ?? 0;

      // Fetch products
      const productRows = await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      if (productRows.length === 0) {
        return reply.send({
          data: [],
          pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
        });
      }

      const productIds = productRows.map((p) => p.id);

      // Fetch default variants
      const variantRows = await db
        .select()
        .from(productVariants)
        .where(
          and(
            inArray(productVariants.productId, productIds),
            eq(productVariants.isDefault, true),
            eq(productVariants.isActive, true),
            isNull(productVariants.deletedAt),
          ),
        );

      // Fetch primary images
      const imageRows = await db
        .select()
        .from(productImages)
        .where(
          and(inArray(productImages.productId, productIds), eq(productImages.isPrimary, true)),
        );

      // Fetch brands
      const brandIds = [...new Set(productRows.map((p) => p.brandId).filter(Boolean))] as string[];
      const brandRows =
        brandIds.length > 0
          ? await db.select().from(brands).where(inArray(brands.id, brandIds))
          : [];

      // Map to summary shape
      const variantMap = new Map(variantRows.map((v) => [v.productId, v]));
      const imageMap = new Map(imageRows.map((i) => [i.productId, i]));
      const brandMap = new Map(brandRows.map((b) => [b.id, b]));

      const data = productRows.map((product) =>
        mapProductSummary({
          product,
          defaultVariant: variantMap.get(product.id) ?? null,
          primaryImage: imageMap.get(product.id) ?? null,
          brand: product.brandId ? (brandMap.get(product.brandId) ?? null) : null,
        }),
      );

      return reply.send({
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    },
  );

  // ── GET /products/:slug ────────────────────────────────────────────────────

  fastify.get<{ Params: { slug: string } }>(
    '/products/:slug',
    {
      schema: {
        description: 'Get full product details by slug',
        tags: ['Catalog'],
        params: { type: 'object', properties: { slug: { type: 'string' } } },
      } as any,
    },
    async (request, reply) => {
      const [product] = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.slug, request.params.slug),
            eq(products.status, 'ACTIVE'),
            isNull(products.deletedAt),
          ),
        )
        .limit(1);

      if (!product) {
        throw new AppError(ERROR_CODES.NOT_FOUND, 'Product not found', 404);
      }

      // Fetch all active variants
      const variants = await db
        .select()
        .from(productVariants)
        .where(
          and(
            eq(productVariants.productId, product.id),
            eq(productVariants.isActive, true),
            isNull(productVariants.deletedAt),
          ),
        )
        .orderBy(asc(productVariants.sortRank), asc(productVariants.weightGrams));

      // Fetch all images
      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .orderBy(asc(productImages.sortRank));

      // Fetch brand
      const brand = product.brandId
        ? ((await db.select().from(brands).where(eq(brands.id, product.brandId)).limit(1))[0] ??
          null)
        : null;

      // Fetch categories
      const catRows = await db
        .select({ category: categories })
        .from(productCategories)
        .innerJoin(categories, eq(productCategories.categoryId, categories.id))
        .where(eq(productCategories.productId, product.id));

      // Fetch recent reviews (latest 10)
      const reviewRows = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.productId, product.id), eq(reviews.status, 'APPROVED')))
        .orderBy(desc(reviews.createdAt))
        .limit(10);

      return reply.send({
        data: {
          ...product,
          ratingAvg: Number(product.ratingAvg),
          brand: brand ? { id: brand.id, name: brand.name, slug: brand.slug } : null,
          variants,
          images,
          categories: catRows.map((r) => r.category),
          reviews: reviewRows,
        },
      });
    },
  );

  // ── GET /products/featured ─────────────────────────────────────────────────

  fastify.get(
    '/products/featured',
    {
      schema: {
        description: 'Get featured products for homepage',
        tags: ['Catalog'],
      } as any,
    },
    async (_request, reply) => {
      const productRows = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.status, 'ACTIVE'),
            eq(products.isFeatured, true),
            isNull(products.deletedAt),
          ),
        )
        .orderBy(asc(products.sortRank), desc(products.salesCount))
        .limit(8);

      if (productRows.length === 0) return reply.send({ data: [] });

      const productIds = productRows.map((p) => p.id);
      const [variantRows, imageRows] = await Promise.all([
        db
          .select()
          .from(productVariants)
          .where(
            and(
              inArray(productVariants.productId, productIds),
              eq(productVariants.isDefault, true),
              isNull(productVariants.deletedAt),
            ),
          ),
        db
          .select()
          .from(productImages)
          .where(
            and(inArray(productImages.productId, productIds), eq(productImages.isPrimary, true)),
          ),
      ]);

      const variantMap = new Map(variantRows.map((v) => [v.productId, v]));
      const imageMap = new Map(imageRows.map((i) => [i.productId, i]));

      return reply.send({
        data: productRows.map((product) =>
          mapProductSummary({
            product,
            defaultVariant: variantMap.get(product.id) ?? null,
            primaryImage: imageMap.get(product.id) ?? null,
            brand: null,
          }),
        ),
      });
    },
  );

  // ── GET /products/:id/reviews ──────────────────────────────────────────────

  fastify.get<{ Params: { id: string }; Querystring: { limit?: string; offset?: string } }>(
    '/products/:id/reviews',
    {
      schema: {
        description: 'Get approved customer reviews for a product',
        tags: ['Catalog'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
      } as any,
    },
    async (request, reply) => {
      const { id } = request.params;
      const limit = request.query.limit ? parseInt(request.query.limit, 10) : 20;
      const offset = request.query.offset ? parseInt(request.query.offset, 10) : 0;

      const reviewList = await reviewService.listApprovedReviews(id, limit, offset);
      return reply.send({ data: reviewList });
    },
  );

  // ── GET /products/:id/reviews/stats ────────────────────────────────────────

  fastify.get<{ Params: { id: string } }>(
    '/products/:id/reviews/stats',
    {
      schema: {
        description: 'Get aggregate rating breakdown and star distribution',
        tags: ['Catalog'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
      } as any,
    },
    async (request, reply) => {
      const stats = await reviewService.getAggregateRating(request.params.id);
      return reply.send({ data: stats });
    },
  );

  // ── POST /products/:id/reviews ─────────────────────────────────────────────

  fastify.post<{ Params: { id: string } }>(
    '/products/:id/reviews',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Submit a product review (authenticated customers)',
        tags: ['Catalog'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
        security: [{ bearerAuth: [] }],
      } as any,
    },
    async (request, reply) => {
      const body = reviewBodySchema.safeParse(request.body);
      if (!body.success) {
        throw new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          body.error.errors[0]?.message || 'Invalid review data',
          400,
          body.error.issues.map((i) => ({ field: i.path.join('.'), issue: i.message })),
        );
      }

      const { id } = request.params;
      const user = request.user!;

      const newReview = await reviewService.submitReview({
        userId: user.userId,
        productId: id,
        rating: body.data.rating,
        title: body.data.title,
        body: body.data.body,
      });

      return reply.status(201).send({ data: newReview });
    },
  );

  // ── GET /admin/reviews ─────────────────────────────────────────────────────

  fastify.get<{
    Querystring: { status?: 'PENDING' | 'APPROVED' | 'REJECTED'; limit?: string; offset?: string };
  }>(
    '/admin/reviews',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'List reviews for Merchant Moderation Desk',
        tags: ['Admin', 'Reviews'],
        security: [{ bearerAuth: [] }],
      } as any,
    },
    async (request, reply) => {
      const status = request.query.status;
      const limit = request.query.limit ? parseInt(request.query.limit, 10) : 50;
      const offset = request.query.offset ? parseInt(request.query.offset, 10) : 0;

      const adminReviews = await reviewService.listReviewsForAdmin({ status, limit, offset });
      return reply.send({ data: adminReviews });
    },
  );

  // ── PATCH /admin/reviews/:id/status ────────────────────────────────────────

  fastify.patch<{ Params: { id: string }; Body: { status: 'APPROVED' | 'REJECTED' } }>(
    '/admin/reviews/:id/status',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Approve or reject a customer review',
        tags: ['Admin', 'Reviews'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
        security: [{ bearerAuth: [] }],
      } as any,
    },
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body || {};

      if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
        throw new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          'Status must be APPROVED or REJECTED',
          400,
        );
      }

      const user = request.user!;
      const updated = await reviewService.moderateReview({
        reviewId: id,
        status,
        moderatedBy: user.userId,
      });

      return reply.send({ data: updated });
    },
  );
};

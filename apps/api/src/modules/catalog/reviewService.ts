import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import { getDb } from '@bansal/db';
import { reviews, products, users, orders, orderItems } from '@bansal/db/schema';
import { AppError, ERROR_CODES } from '@bansal/shared';

export interface RatingBreakdown {
  averageRating: number;
  totalReviews: number;
  starsCount: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  starsPercentage: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export class ReviewService {
  /**
   * Check if a customer has an authenticated purchase of this product
   * in any confirmed/packed/dispatched/delivered order.
   */
  async checkVerifiedPurchase(userId: string, productId: string): Promise<boolean> {
    try {
      const db = getDb();
      const [purchased] = await db
        .select({ id: orderItems.id })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            eq(orders.userId, userId),
            eq(orderItems.productId, productId),
            inArray(orders.status, [
              'CONFIRMED',
              'PROCESSING',
              'PACKED',
              'DISPATCHED',
              'OUT_FOR_DELIVERY',
              'DELIVERED',
            ]),
          ),
        )
        .limit(1);

      return Boolean(purchased);
    } catch {
      return false;
    }
  }

  /**
   * Submit a new customer review.
   * Auto-detects verified purchaser status and places in PENDING moderation queue.
   */
  async submitReview(params: {
    userId: string;
    productId: string;
    rating: number;
    title?: string;
    body?: string;
  }) {
    const { userId, productId, rating, title, body } = params;

    if (rating < 1 || rating > 5) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        'Rating must be an integer between 1 and 5',
        400,
      );
    }

    const db = getDb();

    // Verify product exists and is active
    const [product] = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.status, 'ACTIVE')))
      .limit(1);

    if (!product) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Product not found or inactive', 404);
    }

    // Prevent duplicate reviews per user per product
    const [existing] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.userId, userId),
          sql`${reviews.deletedAt} IS NULL`,
        ),
      )
      .limit(1);

    if (existing) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        'You have already submitted a review for this Mandi dry fruit product',
        409,
      );
    }

    // Check verified purchase
    const isVerifiedPurchase = await this.checkVerifiedPurchase(userId, productId);

    const [newReview] = await db
      .insert(reviews)
      .values({
        productId,
        userId,
        rating,
        title: title?.trim(),
        body: body?.trim(),
        isVerifiedPurchase,
        status: 'PENDING', // Awaits admin quality moderation
      })
      .returning();

    return newReview;
  }

  /**
   * Pure calculation helper for rating breakdown and percentages.
   */
  calculateRatingBreakdown(ratings: number[]): RatingBreakdown {
    const totalReviews = ratings.length;
    const starsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews === 0) {
      return {
        averageRating: 5.0, // default new catalog baseline
        totalReviews: 0,
        starsCount,
        starsPercentage: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    let sum = 0;
    for (const r of ratings) {
      sum += r;
      if (r >= 1 && r <= 5) {
        starsCount[r as keyof typeof starsCount] += 1;
      }
    }

    const averageRating = Number((sum / totalReviews).toFixed(1));
    const starsPercentage = {
      5: Math.round((starsCount[5] / totalReviews) * 100),
      4: Math.round((starsCount[4] / totalReviews) * 100),
      3: Math.round((starsCount[3] / totalReviews) * 100),
      2: Math.round((starsCount[2] / totalReviews) * 100),
      1: Math.round((starsCount[1] / totalReviews) * 100),
    };

    return {
      averageRating,
      totalReviews,
      starsCount,
      starsPercentage,
    };
  }

  /**
   * Fetch aggregate rating statistics and star distribution for a product.
   */
  async getAggregateRating(productId: string): Promise<RatingBreakdown> {
    try {
      const db = getDb();
      const approvedReviews = await db
        .select({
          rating: reviews.rating,
        })
        .from(reviews)
        .where(
          and(
            eq(reviews.productId, productId),
            eq(reviews.status, 'APPROVED'),
            sql`${reviews.deletedAt} IS NULL`,
          ),
        );

      return this.calculateRatingBreakdown(approvedReviews.map((r) => r.rating));
    } catch {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        starsCount: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        starsPercentage: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }
  }

  /**
   * Recalculate denormalized ratingAvg and ratingCount on products table.
   */
  async recalculateProductRating(productId: string): Promise<void> {
    const db = getDb();
    const stats = await this.getAggregateRating(productId);
    await db
      .update(products)
      .set({
        ratingAvg: stats.averageRating.toFixed(2),
        ratingCount: stats.totalReviews,
      })
      .where(eq(products.id, productId));
  }

  /**
   * List approved reviews for storefront product page.
   */
  async listApprovedReviews(productId: string, limit = 20, offset = 0) {
    const db = getDb();
    const rows = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        createdAt: reviews.createdAt,
        reviewerName: users.name,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.status, 'APPROVED'),
          sql`${reviews.deletedAt} IS NULL`,
        ),
      )
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map(
      (r: {
        id: string;
        rating: number;
        title: string | null;
        body: string | null;
        isVerifiedPurchase: boolean;
        createdAt: Date;
        reviewerName: string | null;
      }) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        isVerifiedPurchase: r.isVerifiedPurchase,
        createdAt: r.createdAt.toISOString(),
        reviewerName: r.reviewerName || 'Fatehpuri Patron',
      }),
    );
  }

  /**
   * List reviews for Merchant Admin Moderation console.
   */
  async listReviewsForAdmin(params?: {
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    limit?: number;
    offset?: number;
  }) {
    const db = getDb();
    const limit = params?.limit || 50;
    const offset = params?.offset || 0;

    const conditions = [sql`${reviews.deletedAt} IS NULL`];
    if (params?.status) {
      conditions.push(eq(reviews.status, params.status));
    }

    const rows = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        productName: products.name,
        userId: reviews.userId,
        reviewerName: users.name,
        reviewerPhone: users.phone,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        status: reviews.status,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .innerJoin(products, eq(reviews.productId, products.id))
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map(
      (r: {
        id: string;
        productId: string;
        productName: string;
        userId: string;
        reviewerName: string | null;
        reviewerPhone: string | null;
        rating: number;
        title: string | null;
        body: string | null;
        isVerifiedPurchase: boolean;
        status: string;
        createdAt: Date;
      }) => ({
        ...r,
        reviewerName: r.reviewerName || 'Bansal Foods Buyer',
        createdAt: r.createdAt.toISOString(),
      }),
    );
  }

  /**
   * Moderate a review: approve or reject.
   */
  async moderateReview(params: {
    reviewId: string;
    status: 'APPROVED' | 'REJECTED';
    moderatedBy: string;
  }) {
    const { reviewId, status, moderatedBy } = params;
    const db = getDb();

    const [existing] = await db
      .select({ id: reviews.id, productId: reviews.productId })
      .from(reviews)
      .where(and(eq(reviews.id, reviewId), sql`${reviews.deletedAt} IS NULL`))
      .limit(1);

    if (!existing) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Review not found', 404);
    }

    const [updated] = await db
      .update(reviews)
      .set({
        status,
        moderatedBy,
        moderatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId))
      .returning();

    // Recalculate denormalized product rating
    await this.recalculateProductRating(existing.productId);

    return updated;
  }
}

export const reviewService = new ReviewService();

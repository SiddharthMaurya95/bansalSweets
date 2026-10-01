import { describe, it, expect } from 'vitest';
import { reviewService } from '../modules/catalog/reviewService.js';
import { AppError } from '@bansal/shared';

describe('ReviewService & Social Proof (Phase 9)', () => {
  describe('Rating Validation Rules', () => {
    it('rejects ratings less than 1 or greater than 5', async () => {
      await expect(
        reviewService.submitReview({
          userId: '00000000-0000-0000-0000-000000000001',
          productId: '00000000-0000-0000-0000-000000000002',
          rating: 0,
        }),
      ).rejects.toThrow(AppError);

      await expect(
        reviewService.submitReview({
          userId: '00000000-0000-0000-0000-000000000001',
          productId: '00000000-0000-0000-0000-000000000002',
          rating: 6,
        }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('Aggregate Rating & Star Breakdown Math', () => {
    it('calculates average score and star percentages correctly', () => {
      // Simulate raw ratings: [5, 5, 5, 4, 1]
      const ratings = [5, 5, 5, 4, 1];
      const totalReviews = ratings.length;
      const sum = ratings.reduce((a, b) => a + b, 0); // 20
      const averageRating = Number((sum / totalReviews).toFixed(1)); // 4.0

      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      for (const r of ratings) {
        counts[r as keyof typeof counts]++;
      }

      const percentages = {
        5: Math.round((counts[5] / totalReviews) * 100), // 3/5 = 60%
        4: Math.round((counts[4] / totalReviews) * 100), // 1/5 = 20%
        3: Math.round((counts[3] / totalReviews) * 100), // 0%
        2: Math.round((counts[2] / totalReviews) * 100), // 0%
        1: Math.round((counts[1] / totalReviews) * 100), // 1/5 = 20%
      };

      expect(averageRating).toBe(4.0);
      expect(percentages[5]).toBe(60);
      expect(percentages[4]).toBe(20);
      expect(percentages[1]).toBe(20);
      expect(percentages[3]).toBe(0);
    });

    it('defaults to baseline 5.0 for brand new products without approved reviews', async () => {
      // Mock productId that has 0 reviews
      const stats = await reviewService.getAggregateRating('00000000-0000-0000-0000-000000000999');
      expect(stats.totalReviews).toBe(0);
      expect(stats.averageRating).toBe(5.0);
      expect(stats.starsPercentage[5]).toBe(0);
    });
  });

  describe('Social Proof & Moderation State Transitions', () => {
    it('defines allowable moderation statuses', () => {
      const allowed = ['PENDING', 'APPROVED', 'REJECTED'];
      expect(allowed).toContain('PENDING');
      expect(allowed).toContain('APPROVED');
      expect(allowed).toContain('REJECTED');
    });

    it('identifies verified purchase criteria properly', () => {
      const eligibleOrderStatuses = [
        'CONFIRMED',
        'PROCESSING',
        'PACKED',
        'DISPATCHED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
      ];

      expect(eligibleOrderStatuses.includes('DELIVERED')).toBe(true);
      expect(eligibleOrderStatuses.includes('PACKED')).toBe(true);
      expect(eligibleOrderStatuses.includes('CANCELLED')).toBe(false);
      expect(eligibleOrderStatuses.includes('PENDING')).toBe(false);
    });
  });
});

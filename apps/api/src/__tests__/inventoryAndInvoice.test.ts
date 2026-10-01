import { describe, it, expect } from 'vitest';
import { getCurrentFinancialYear, numberToWordsInr } from '../modules/orders/invoiceService.js';

describe('Inventory & Invoicing Operations (Phase 7)', () => {
  describe('Indian Financial Year Generator', () => {
    it('computes FY2627 for dates between April 2026 and March 2027', () => {
      // April 15, 2026 -> FY 2627
      const aprDate = new Date(2026, 3, 15);
      expect(getCurrentFinancialYear(aprDate)).toBe('2627');

      // December 1, 2026 -> FY 2627
      const decDate = new Date(2026, 11, 1);
      expect(getCurrentFinancialYear(decDate)).toBe('2627');

      // February 10, 2027 -> FY 2627
      const febDate = new Date(2027, 1, 10);
      expect(getCurrentFinancialYear(febDate)).toBe('2627');

      // March 31, 2027 -> FY 2627
      const marDate = new Date(2027, 2, 31);
      expect(getCurrentFinancialYear(marDate)).toBe('2627');
    });

    it('transitions to FY2728 on April 1, 2027', () => {
      const nextFyDate = new Date(2027, 3, 1);
      expect(getCurrentFinancialYear(nextFyDate)).toBe('2728');
    });
  });

  describe('Number to Words in INR (Paise to Words)', () => {
    it('converts exact amounts to Indian Rupee words', () => {
      // ₹1,200 (120,000 paise)
      expect(numberToWordsInr(120000)).toBe('One Thousand Two Hundred Rupees Only');

      // ₹4,500 (450,000 paise)
      expect(numberToWordsInr(450000)).toBe('Four Thousand Five Hundred Rupees Only');

      // ₹25,000 (2,500,000 paise)
      expect(numberToWordsInr(2500000)).toBe('Twenty Five Thousand Rupees Only');

      // ₹1,50,000 (15,000,000 paise)
      expect(numberToWordsInr(15000000)).toBe('One Lakh Fifty Thousand Rupees Only');
    });

    it('handles zero gracefully', () => {
      expect(numberToWordsInr(0)).toBe('Zero Rupees Only');
    });
  });

  describe('Inventory Availability Formula', () => {
    it('calculates available quantity deducting reserved and buffer', () => {
      const onHand = 50;
      const reserved = 10;
      const buffer = 5;

      const available = Math.max(0, onHand - reserved - buffer);
      expect(available).toBe(35);
    });

    it('floors available quantity to zero when reserved exceeds on-hand', () => {
      const onHand = 10;
      const reserved = 12;
      const buffer = 2;

      const available = Math.max(0, onHand - reserved - buffer);
      expect(available).toBe(0);
    });
  });
});

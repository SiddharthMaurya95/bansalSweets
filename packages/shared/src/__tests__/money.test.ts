import { describe, it, expect } from 'vitest';
import { Money, calculateGstBreakup } from '../money.js';

describe('Money Utility', () => {
  it('creates money from integer paise', () => {
    const m = Money.fromPaise(79900);
    expect(m.toPaiseNumber()).toBe(79900);
    expect(m.toRupeesNumber()).toBe(799);
  });

  it('throws when float paise is supplied', () => {
    expect(() => Money.fromPaise(799.5)).toThrow(TypeError);
  });

  it('creates money from rupee amounts and rounds safely to paise', () => {
    const m = Money.fromRupees(799.5);
    expect(m.toPaiseNumber()).toBe(79950);
  });

  it('performs exact addition and subtraction without floating errors', () => {
    const a = Money.fromPaise(10033);
    const b = Money.fromPaise(20067);
    const sum = a.add(b);
    expect(sum.toPaiseNumber()).toBe(30100);

    const diff = sum.subtract(a);
    expect(diff.toPaiseNumber()).toBe(20067);
  });

  it('computes unit price per 100 grams correctly', () => {
    // 500g pack costing 799 rupees (79900 paise)
    // Unit price = round(79900 * 100 / 500) = 15980 paise (₹159.80 / 100g)
    const pack = Money.fromPaise(79900);
    const unitPrice = pack.unitPricePer100g(500);
    expect(unitPrice.toPaiseNumber()).toBe(15980);
    expect(unitPrice.toRupeesNumber()).toBe(159.8);
  });

  it('allocates discount proportionally with largest-remainder exact sum guarantee', () => {
    // Total discount: ₹100 (10000 paise) across items with prices 300, 300, 400
    const discount = Money.fromPaise(10000);
    const ratios = [300, 300, 400];
    const allocations = Money.allocateProportional(discount, ratios);

    expect(allocations.length).toBe(3);
    const sumAllocated = allocations.reduce((acc, cur) => acc.add(cur), Money.zero());
    expect(sumAllocated.toPaiseNumber()).toBe(10000);

    // Uneven split test: ₹100 across 3 equal items (10000 / 3 = 3333.33)
    const unevenAllocations = Money.allocateProportional(Money.fromPaise(10000), [1, 1, 1]);
    const unevenSum = unevenAllocations.reduce((acc, cur) => acc.add(cur), Money.zero());
    expect(unevenSum.toPaiseNumber()).toBe(10000);
    // Two items get 3333 and one gets 3334
    const paiseValues = unevenAllocations.map((a) => a.toPaiseNumber());
    expect(paiseValues).toEqual([3334, 3333, 3333]);
  });
});

describe('GST Calculation (Section 15.2)', () => {
  it('calculates intra-state GST with exact formula from spec', () => {
    // Spec example: 500 g pack, price ₹799 (79,900 paise), rate 500 bps (5%), intra-state
    // taxable = round(79,900 * 10,000 / 10,500) = 76,095
    // tax = 3,805; CGST 1,902, SGST 1,903
    const result = calculateGstBreakup(79900, 500, false);
    expect(result.taxableValuePaise).toBe(76095);
    expect(result.taxAmountPaise).toBe(3805);
    expect(result.cgstPaise).toBe(1902);
    expect(result.sgstPaise).toBe(1903);
    expect(result.igstPaise).toBe(0);
    expect(result.cgstPaise + result.sgstPaise).toBe(result.taxAmountPaise);
    expect(result.taxableValuePaise + result.taxAmountPaise).toBe(79900);
  });

  it('calculates inter-state GST with IGST', () => {
    const result = calculateGstBreakup(79900, 500, true);
    expect(result.taxableValuePaise).toBe(76095);
    expect(result.taxAmountPaise).toBe(3805);
    expect(result.cgstPaise).toBe(0);
    expect(result.sgstPaise).toBe(0);
    expect(result.igstPaise).toBe(3805);
  });
});

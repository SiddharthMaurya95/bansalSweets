import { describe, it, expect } from 'vitest';
import {
  calculateFinancials,
  generateOrderNumber,
  DELHI_STATE_CODE,
  STANDARD_DELIVERY_FEE_PAISE,
  COD_FEE_PAISE,
} from '../modules/orders/orderService.js';
import type { productVariants, products } from '@bansal/db/schema';

describe('Order Service & Financials (Phase 6)', () => {
  const mockProduct = {
    id: '018f3a2b-8a9d-7000-8000-prod00000001',
    name: 'Kashmiri Mamra Almonds',
    taxRateBps: 500, // 5%
    hsnCode: '080211',
  } as unknown as typeof products.$inferSelect;

  const mockVariant = {
    id: '018f3a2b-8a9d-7000-8000-var000000001',
    sku: 'ALM-MAMRA-500G',
    label: '500g',
    weightGrams: 500,
    pricePaise: 120000, // ₹1,200 (120,000 paise)
    mrpPaise: 150000, // ₹1,500
  } as unknown as typeof productVariants.$inferSelect;

  it('generates order numbers in standard format BF-YYYYMMDD-XXXX', () => {
    const orderNo = generateOrderNumber();
    expect(orderNo).toMatch(/^BF-\d{8}-[A-Z0-9]{4}$/);
  });

  it('applies free delivery for orders at or above threshold', () => {
    // 1 item of ₹1,200 is > ₹999
    const financials = calculateFinancials(
      [{ product: mockProduct, variant: mockVariant, quantity: 1 }],
      DELHI_STATE_CODE,
      'UPI',
    );

    expect(financials.subtotalPaise).toBe(120000);
    expect(financials.deliveryFeePaise).toBe(0);
    expect(financials.codFeePaise).toBe(0);
    expect(financials.totalPaise).toBe(120000);
  });

  it('charges standard delivery fee for orders below threshold', () => {
    const smallVariant = {
      ...mockVariant,
      pricePaise: 45000, // ₹450
    } as unknown as typeof productVariants.$inferSelect;

    const financials = calculateFinancials(
      [{ product: mockProduct, variant: smallVariant, quantity: 1 }],
      DELHI_STATE_CODE,
      'CARD',
    );

    expect(financials.subtotalPaise).toBe(45000);
    expect(financials.deliveryFeePaise).toBe(STANDARD_DELIVERY_FEE_PAISE);
    expect(financials.totalPaise).toBe(45000 + STANDARD_DELIVERY_FEE_PAISE);
  });

  it('adds COD fee when Cash on Delivery is selected', () => {
    const financials = calculateFinancials(
      [{ product: mockProduct, variant: mockVariant, quantity: 1 }],
      DELHI_STATE_CODE,
      'COD',
    );

    expect(financials.codFeePaise).toBe(COD_FEE_PAISE);
    expect(financials.totalPaise).toBe(120000 + COD_FEE_PAISE);
  });

  it('calculates CGST and SGST for Delhi deliveries (stateCode 07)', () => {
    const financials = calculateFinancials(
      [{ product: mockProduct, variant: mockVariant, quantity: 1 }],
      '07',
      'UPI',
    );

    const item = financials.lineItems[0]!;
    expect(item.cgstPaise).toBeGreaterThan(0);
    expect(item.sgstPaise).toBeGreaterThan(0);
    expect(item.igstPaise).toBe(0);
    expect(item.cgstPaise + item.sgstPaise + item.taxableValuePaise).toBe(item.lineTotalPaise);
  });

  it('calculates IGST for non-Delhi interstate deliveries', () => {
    const financials = calculateFinancials(
      [{ product: mockProduct, variant: mockVariant, quantity: 1 }],
      '27', // Maharashtra
      'UPI',
    );

    const item = financials.lineItems[0]!;
    expect(item.igstPaise).toBeGreaterThan(0);
    expect(item.cgstPaise).toBe(0);
    expect(item.sgstPaise).toBe(0);
    expect(item.igstPaise + item.taxableValuePaise).toBe(item.lineTotalPaise);
  });
});

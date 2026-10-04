import { getDb } from '@bansal/db';
import { orders, orderItems, invoices, documentSequences } from '@bansal/db/schema';
import { eq, sql } from 'drizzle-orm';
import { AppError, ERROR_CODES, generateUuidV7, formatInr } from '@bansal/shared';

// ─── Financial Year Helper ───────────────────────────────────────────────────

export function getCurrentFinancialYear(date = new Date()): string {
  const month = date.getMonth(); // 0 = Jan, 3 = Apr
  const fullYear = date.getFullYear();
  // Indian FY runs April 1 to March 31
  const startYear = month >= 3 ? fullYear : fullYear - 1;
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}${String(endYear).slice(-2)}`;
}

// ─── Snapshots ────────────────────────────────────────────────────────────────

export interface BuyerSnapshot {
  name: string;
  phone: string;
  email?: string | null;
  address: string;
  gstin?: string | null;
  stateCode: string;
}

export const BANSAL_FOODS_SELLER_SNAPSHOT = {
  legalName: 'Bansal Foods',
  tradeName: 'Bansal Foods Khari Baoli Mandi',
  address: 'Shop 42, Katra Ishwar Bhawan, Khari Baoli, Old Delhi, Delhi 110006',
  gstin: '07AAAAA0000A1Z5',
  state: 'Delhi',
  stateCode: '07',
  fssaiNumber: '13320001000123',
  phone: '+91 11 2390 1234',
  email: 'invoices@bansalfoods.in',
  bankDetails: {
    bankName: 'State Bank of India',
    branch: 'Chandni Chowk, Delhi',
    accountNumber: '398200100054321',
    ifscCode: 'SBIN0000620',
  },
};

// ─── Number to Words (Indian Numbering Format) ────────────────────────────────

export function numberToWordsInr(paise: number): string {
  const rupees = Math.floor(paise / 100);
  if (rupees === 0) return 'Zero Rupees Only';

  const a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen ',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(num: number): string {
    if (num === 0) return '';
    if (num < 20) return a[num]!;
    if (num < 100) return b[Math.floor(num / 10)]! + ' ' + a[num % 10];
    if (num < 1000)
      return (
        a[Math.floor(num / 100)]! +
        'Hundred ' +
        (num % 100 !== 0 ? 'and ' + inWords(num % 100) : '')
      );
    if (num < 100000) return inWords(Math.floor(num / 1000)) + 'Thousand ' + inWords(num % 1000);
    if (num < 10000000) return inWords(Math.floor(num / 100000)) + 'Lakh ' + inWords(num % 100000);
    return inWords(Math.floor(num / 10000000)) + 'Crore ' + inWords(num % 10000000);
  }

  return inWords(rupees).trim() + ' Rupees Only';
}

// ─── Invoice Service ─────────────────────────────────────────────────────────

export const invoiceService = {
  /** Atomically generate sequential invoice number */
  async getNextInvoiceNumber(financialYear = getCurrentFinancialYear()) {
    const db = getDb();
    const docType = 'INVOICE';
    const prefix = `BF/${financialYear}/`;

    // Upsert / Increment sequence
    const [seq] = await db
      .insert(documentSequences)
      .values({
        id: generateUuidV7(),
        docType,
        financialYear,
        prefix,
        lastValue: 1,
      })
      .onConflictDoUpdate({
        target: [documentSequences.docType, documentSequences.financialYear],
        set: {
          lastValue: sql`${documentSequences.lastValue} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning();

    const sequenceNum = String(seq!.lastValue).padStart(6, '0');
    return `${prefix}${sequenceNum}`;
  },

  /** Create or retrieve existing Tax Invoice for an order */
  async getOrCreateInvoice(orderId: string) {
    const db = getDb();

    // Check existing invoice
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.orderId, orderId))
      .limit(1);

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) throw new AppError(ERROR_CODES.NOT_FOUND, 'Order not found', 404);

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

    if (existingInvoice) {
      return {
        invoice: existingInvoice,
        order,
        items,
        seller: existingInvoice.sellerSnapshot as typeof BANSAL_FOODS_SELLER_SNAPSHOT,
        buyer: existingInvoice.buyerSnapshot as BuyerSnapshot,
        amountInWords: numberToWordsInr(order.totalPaise),
      };
    }

    const fy = getCurrentFinancialYear(order.placedAt);
    const invoiceNumber = await this.getNextInvoiceNumber(fy);

    const shippingAddress = order.shippingAddress as Record<string, string>;
    const buyerSnapshot = {
      name: order.customerName,
      phone: order.customerPhone,
      email: order.customerEmail,
      address: `${shippingAddress.line1 || ''}, ${shippingAddress.line2 || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''} - ${shippingAddress.pincode || ''}`,
      gstin: order.customerGstin || null,
      stateCode: order.placeOfSupplyStateCode,
    };

    const [newInvoice] = await db
      .insert(invoices)
      .values({
        id: generateUuidV7(),
        orderId,
        invoiceNumber,
        financialYear: fy,
        storageKey: `invoices/${fy}/${invoiceNumber.replace(/\//g, '_')}.json`,
        type: 'TAX_INVOICE',
        sellerSnapshot: BANSAL_FOODS_SELLER_SNAPSHOT,
        buyerSnapshot,
        issuedAt: new Date(),
      })
      .returning();

    return {
      invoice: newInvoice!,
      order,
      items,
      seller: BANSAL_FOODS_SELLER_SNAPSHOT,
      buyer: buyerSnapshot,
      amountInWords: numberToWordsInr(order.totalPaise),
    };
  },

  /** Render printable invoice HTML */
  async renderInvoiceHtml(orderId: string): Promise<string> {
    const data = await this.getOrCreateInvoice(orderId);
    const { invoice, order, items, seller, buyer, amountInWords } = data;

    const isDelhi = order.placeOfSupplyStateCode === '07';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; color: #1B1F2A; background: #fff; font-size: 13px; line-height: 1.5; }
    .invoice-box { max-width: 800px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0B2A6B; padding-bottom: 16px; margin-bottom: 20px; }
    .brand-title { font-size: 24px; font-weight: 900; color: #0B2A6B; }
    .brand-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #D9A521; font-weight: bold; }
    .invoice-title { font-size: 20px; font-weight: 800; color: #1B1F2A; text-align: right; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .card { background: #fafaf8; border: 1px solid #f3f4f6; border-radius: 8px; padding: 12px 16px; }
    .card-title { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
    th { background: #0B2A6B; color: #fff; text-align: left; padding: 8px 10px; font-weight: 600; }
    td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
    .text-right { text-align: right; }
    .totals { margin-top: 16px; border-top: 2px solid #e5e7eb; padding-top: 12px; }
    .total-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 12px; }
    .grand-total { font-size: 16px; font-weight: 800; color: #0B2A6B; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 8px; }
    .words { font-style: italic; color: #4b5563; font-size: 11px; margin-top: 8px; }
    .footer { text-align: center; font-size: 10px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <div>
        <div class="brand-title">BANSAL FOODS</div>
        <div class="brand-subtitle">Khari Baoli Mandi • Delhi 110006</div>
        <div style="font-size: 11px; color: #4b5563; margin-top: 4px;">FSSAI Lic: ${seller.fssaiNumber} | GSTIN: ${seller.gstin}</div>
      </div>
      <div>
        <div class="invoice-title">TAX INVOICE</div>
        <div style="text-align: right; font-size: 12px; font-weight: bold; color: #0B2A6B;">${invoice.invoiceNumber}</div>
        <div style="text-align: right; font-size: 11px; color: #6b7280;">Date: ${new Date(invoice.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        <div style="text-align: right; font-size: 11px; color: #6b7280;">Order: ${order.orderNumber}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">Sold By (Seller)</div>
        <div style="font-weight: bold; color: #1B1F2A;">${seller.legalName}</div>
        <div>${seller.address}</div>
        <div>State: ${seller.state} (Code: ${seller.stateCode})</div>
        <div>Phone: ${seller.phone}</div>
      </div>
      <div class="card">
        <div class="card-title">Billed &amp; Shipped To (Buyer)</div>
        <div style="font-weight: bold; color: #1B1F2A;">${buyer.name}</div>
        <div>${buyer.address}</div>
        <div>Phone: ${buyer.phone}</div>
        ${buyer.gstin ? `<div><strong>GSTIN:</strong> ${buyer.gstin}</div>` : ''}
        <div>Place of Supply: State Code ${order.placeOfSupplyStateCode}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item Description</th>
          <th>HSN</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Taxable</th>
          <th class="text-right">${isDelhi ? 'CGST+SGST' : 'IGST'}</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${item.name}</strong> (${item.variantLabel})</td>
          <td>${item.hsnCode || '0802'}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${formatInr(item.unitPricePaise)}</td>
          <td class="text-right">${formatInr(item.taxableValuePaise)}</td>
          <td class="text-right">${formatInr(isDelhi ? item.cgstPaise + item.sgstPaise : item.igstPaise)}</td>
          <td class="text-right font-bold">${formatInr(item.lineTotalPaise)}</td>
        </tr>`,
          )
          .join('')}
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between;">
      <div style="max-width: 450px;">
        <div class="words"><strong>Amount in Words:</strong> ${amountInWords}</div>
        <div style="font-size: 11px; margin-top: 12px; color: #4b5563;">
          <strong>Payment Mode:</strong> ${order.paymentMethod} • Status: ${order.paymentStatus}
        </div>
        <div style="font-size: 10px; color: #9ca3af; margin-top: 8px;">
          Goods once sold can only be replaced for quality issues within 7 days. Subject to Delhi jurisdiction.
        </div>
      </div>

      <div class="totals" style="width: 250px;">
        <div class="total-row"><span>Subtotal:</span><span>${formatInr(order.subtotalPaise)}</span></div>
        ${order.deliveryFeePaise > 0 ? `<div class="total-row"><span>Delivery Fee:</span><span>${formatInr(order.deliveryFeePaise)}</span></div>` : '<div class="total-row"><span>Delivery:</span><span style="color: green; font-weight: bold;">FREE</span></div>'}
        ${order.codFeePaise > 0 ? `<div class="total-row"><span>COD Convenience Fee:</span><span>${formatInr(order.codFeePaise)}</span></div>` : ''}
        <div class="total-row"><span>Total GST Included:</span><span>${formatInr(order.taxTotalPaise)}</span></div>
        <div class="total-row grand-total"><span>Total Payable:</span><span>${formatInr(order.totalPaise)}</span></div>
      </div>
    </div>

    <div class="footer">
      This is a computer-generated Tax Invoice in compliance with Section 31 of the CGST Act, 2017. No signature required.
    </div>
  </div>
</body>
</html>`;
  },
};

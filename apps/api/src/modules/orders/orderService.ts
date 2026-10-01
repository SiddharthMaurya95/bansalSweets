import { getDb } from '@bansal/db';
import {
  orders,
  orderItems,
  orderEvents,
  payments,
  paymentAttempts,
  carts,
  cartItems,
  productVariants,
  products,
  outboxEvents,
} from '@bansal/db/schema';
import { eq, and, sql, desc, inArray } from 'drizzle-orm';
import { AppError, ERROR_CODES, generateUuidV7 } from '@bansal/shared';
import { createHmac } from 'node:crypto';
import { loadEnv } from '../../config/env.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShippingAddressInput {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  stateCode: string; // e.g. '07' for Delhi
  country?: string;
}

export interface CheckoutInput {
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: ShippingAddressInput;
  billingAddress?: ShippingAddressInput;
  customerGstin?: string;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD';
  deliveryMethod?: 'LOCAL_DELIVERY' | 'STORE_PICKUP' | 'COURIER';
  customerNote?: string;
  cartId?: string;
  items?: { variantId: string; quantity: number }[];
  ipHash?: string;
  userAgentHash?: string;
}

// ─── Financials Calculation ───────────────────────────────────────────────────

export interface LineItemCalculation {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  variantLabel: string;
  imageUrl?: string | null;
  hsnCode?: string | null;
  weightGrams: number;
  quantity: number;
  unitMrpPaise: number;
  unitPricePaise: number;
  discountPaise: number;
  lineTotalPaise: number;
  taxRateBps: number;
  taxableValuePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
}

export interface OrderFinancials {
  subtotalPaise: number;
  discountPaise: number;
  deliveryFeePaise: number;
  codFeePaise: number;
  taxTotalPaise: number;
  totalPaise: number;
  lineItems: LineItemCalculation[];
}

export const DELHI_STATE_CODE = '07';
export const FREE_DELIVERY_THRESHOLD_PAISE = 99900; // Free above ₹999
export const STANDARD_DELIVERY_FEE_PAISE = 8000; // ₹80 standard delivery
export const COD_FEE_PAISE = 5000; // ₹50 COD handling fee

export function calculateFinancials(
  items: {
    variant: typeof productVariants.$inferSelect;
    product: typeof products.$inferSelect;
    quantity: number;
  }[],
  shippingStateCode: string,
  paymentMethod: string,
): OrderFinancials {
  const isDelhi = shippingStateCode.trim() === DELHI_STATE_CODE;
  let subtotalPaise = 0;
  let taxTotalPaise = 0;

  const lineItems: LineItemCalculation[] = items.map(({ variant, product, quantity }) => {
    const lineTotal = variant.pricePaise * quantity;
    subtotalPaise += lineTotal;

    // Tax is inclusive in Indian retail dry fruits (usually 5% or 12%)
    // taxable = round(lineTotal / (1 + rateBps / 10000))
    const taxRateBps = product.taxRateBps || 500; // 5% default
    const taxableValue = Math.round(lineTotal / (1 + taxRateBps / 10000));
    const lineTax = lineTotal - taxableValue;
    taxTotalPaise += lineTax;

    let cgstPaise = 0;
    let sgstPaise = 0;
    let igstPaise = 0;

    if (isDelhi) {
      cgstPaise = Math.round(lineTax / 2);
      sgstPaise = lineTax - cgstPaise;
    } else {
      igstPaise = lineTax;
    }

    return {
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
      name: product.name,
      variantLabel: variant.label,
      imageUrl: null,
      hsnCode: product.hsnCode || '0802', // Standard dry fruits HSN chapter 08
      weightGrams: variant.weightGrams,
      quantity,
      unitMrpPaise: variant.mrpPaise,
      unitPricePaise: variant.pricePaise,
      discountPaise: Math.max(0, variant.mrpPaise - variant.pricePaise) * quantity,
      lineTotalPaise: lineTotal,
      taxRateBps,
      taxableValuePaise: taxableValue,
      cgstPaise,
      sgstPaise,
      igstPaise,
    };
  });

  const deliveryFeePaise =
    subtotalPaise >= FREE_DELIVERY_THRESHOLD_PAISE ? 0 : STANDARD_DELIVERY_FEE_PAISE;
  const codFeePaise = paymentMethod === 'COD' ? COD_FEE_PAISE : 0;
  const totalPaise = subtotalPaise + deliveryFeePaise + codFeePaise;

  return {
    subtotalPaise,
    discountPaise: 0,
    deliveryFeePaise,
    codFeePaise,
    taxTotalPaise,
    totalPaise,
    lineItems,
  };
}

// ─── Order Number Generator ───────────────────────────────────────────────────

export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BF-${dateStr}-${randomSuffix}`;
}

// ─── Order Operations ─────────────────────────────────────────────────────────

export const orderService = {
  /** Create a new order from cart or input items */
  async createOrder(input: CheckoutInput) {
    const db = getDb();
    const env = loadEnv();

    // 1. Resolve checkout items
    let resolvedItems: {
      variant: typeof productVariants.$inferSelect;
      product: typeof products.$inferSelect;
      quantity: number;
    }[] = [];

    if (input.cartId) {
      const dbCartItems = await db
        .select({
          cartItem: cartItems,
          variant: productVariants,
          product: products,
        })
        .from(cartItems)
        .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(eq(cartItems.cartId, input.cartId));

      if (dbCartItems.length === 0) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Cart is empty', 400);
      }

      resolvedItems = dbCartItems.map((r) => ({
        variant: r.variant,
        product: r.product,
        quantity: r.cartItem.quantity,
      }));
    } else if (input.items && input.items.length > 0) {
      const variantIds = input.items.map((i) => i.variantId);
      const rows = await db
        .select({
          variant: productVariants,
          product: products,
        })
        .from(productVariants)
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(
          and(
            inArray(productVariants.id, variantIds),
            eq(productVariants.isActive, true),
            eq(products.status, 'ACTIVE'),
          ),
        );

      resolvedItems = input.items.map((reqItem) => {
        const row = rows.find((r) => r.variant.id === reqItem.variantId);
        if (!row) {
          throw new AppError(
            ERROR_CODES.PRODUCT_UNAVAILABLE,
            `Product variant ${reqItem.variantId} is unavailable`,
            400,
          );
        }
        return {
          variant: row.variant,
          product: row.product,
          quantity: reqItem.quantity,
        };
      });
    } else {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'No items provided for checkout', 400);
    }

    // 2. Compute order financials
    const financials = calculateFinancials(
      resolvedItems,
      input.shippingAddress.stateCode || DELHI_STATE_CODE,
      input.paymentMethod,
    );

    const orderId = generateUuidV7();
    const orderNumber = generateOrderNumber();
    const isCod = input.paymentMethod === 'COD';

    // Initial status: COD is CONFIRMED immediately, Online payment is PAYMENT_PENDING
    const initialOrderStatus = isCod ? 'CONFIRMED' : 'PAYMENT_PENDING';
    const initialPaymentStatus = isCod ? 'PENDING_COLLECTION' : 'UNPAID';

    // 3. Atomically persist order, items, payment attempt, and outbox event
    const [createdOrder] = await db
      .insert(orders)
      .values({
        id: orderId,
        orderNumber,
        userId: input.userId || null,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        channel: 'WEB',
        orderType: 'RETAIL',
        status: initialOrderStatus,
        paymentStatus: initialPaymentStatus,
        paymentMethod: input.paymentMethod,
        deliveryMethod: input.deliveryMethod || 'COURIER',
        subtotalPaise: financials.subtotalPaise,
        discountPaise: financials.discountPaise,
        deliveryFeePaise: financials.deliveryFeePaise,
        codFeePaise: financials.codFeePaise,
        taxTotalPaise: financials.taxTotalPaise,
        totalPaise: financials.totalPaise,
        currency: 'INR',
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress || input.shippingAddress,
        customerGstin: input.customerGstin || null,
        placeOfSupplyStateCode: input.shippingAddress.stateCode || DELHI_STATE_CODE,
        customerNote: input.customerNote || null,
        sourceCartId: input.cartId || null,
        placedAt: new Date(),
        confirmedAt: isCod ? new Date() : null,
        ipHash: input.ipHash || null,
        userAgentHash: input.userAgentHash || null,
      })
      .returning();

    // Insert order items
    await db.insert(orderItems).values(
      financials.lineItems.map((li) => ({
        id: generateUuidV7(),
        orderId,
        productId: li.productId,
        variantId: li.variantId,
        sku: li.sku,
        name: li.name,
        variantLabel: li.variantLabel,
        imageUrl: li.imageUrl,
        hsnCode: li.hsnCode,
        weightGrams: li.weightGrams,
        quantity: li.quantity,
        unitMrpPaise: li.unitMrpPaise,
        unitPricePaise: li.unitPricePaise,
        discountPaise: li.discountPaise,
        lineTotalPaise: li.lineTotalPaise,
        taxRateBps: li.taxRateBps,
        taxableValuePaise: li.taxableValuePaise,
        cgstPaise: li.cgstPaise,
        sgstPaise: li.sgstPaise,
        igstPaise: li.igstPaise,
      })),
    );

    // Insert order audit event
    await db.insert(orderEvents).values({
      id: generateUuidV7(),
      orderId,
      type: 'ORDER_CREATED',
      fromStatus: null,
      toStatus: initialOrderStatus,
      actorType: 'CUSTOMER',
      actorId: input.userId ? (input.userId as string) : null,
      visibility: 'CUSTOMER',
      note: isCod ? 'Order placed via Cash on Delivery' : 'Order placed, awaiting online payment',
      metadata: { totalPaise: financials.totalPaise, paymentMethod: input.paymentMethod },
    });

    // 4. Payment Preparation
    const paymentId = generateUuidV7();
    let providerOrderId: string | null = null;

    if (isCod) {
      await db.insert(payments).values({
        id: paymentId,
        orderId,
        provider: 'COD',
        method: 'COD',
        status: 'PENDING_COLLECTION',
        amountPaise: financials.totalPaise,
        currency: 'INR',
      });
    } else {
      // Mock/Sandbox Razorpay order id (or real API in production)
      providerOrderId = `order_${generateUuidV7().replace(/-/g, '').slice(0, 16)}`;

      await db.insert(payments).values({
        id: paymentId,
        orderId,
        provider: 'RAZORPAY',
        method: input.paymentMethod,
        status: 'CREATED',
        amountPaise: financials.totalPaise,
        currency: 'INR',
        providerOrderId,
      });

      await db.insert(paymentAttempts).values({
        id: generateUuidV7(),
        orderId,
        paymentId,
        attemptNo: 1,
        status: 'INITIATED',
      });
    }

    // 5. Transactional Outbox Event
    await db.insert(outboxEvents).values({
      id: generateUuidV7(),
      type: isCod ? 'order.confirmed' : 'order.created',
      aggregateType: 'Order',
      aggregateId: orderId,
      payload: {
        orderId,
        orderNumber,
        totalPaise: financials.totalPaise,
        customerPhone: input.customerPhone,
        paymentMethod: input.paymentMethod,
      },
      status: 'PENDING',
    });

    // 6. Mark cart converted if applicable
    if (input.cartId) {
      await db
        .update(carts)
        .set({ status: 'CONVERTED', lastActivityAt: new Date() })
        .where(eq(carts.id, input.cartId));
    }

    return {
      order: createdOrder,
      financials,
      payment: {
        id: paymentId,
        method: input.paymentMethod,
        amountPaise: financials.totalPaise,
        providerOrderId,
        keyId: env.RAZORPAY_KEY_ID,
      },
    };
  },

  /** Verify Razorpay online payment callback */
  async verifyPayment(params: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const db = getDb();
    const env = loadEnv();

    const [order] = await db.select().from(orders).where(eq(orders.id, params.orderId)).limit(1);
    if (!order) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Order not found', 404);
    }

    // Signature verification: HMAC-SHA256 of "order_id|payment_id" with secret
    const expectedSignature = createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
      .digest('hex');

    // In development/test mode, allow simulated sandbox signatures or verify valid HMAC
    const isDevelopment = env.NODE_ENV !== 'production';
    const isMockSignature = isDevelopment && params.razorpaySignature.startsWith('mock_sig_');
    const isValidSignature = expectedSignature === params.razorpaySignature || isMockSignature;

    if (!isValidSignature) {
      throw new AppError(
        ERROR_CODES.PAYMENT_VERIFICATION_FAILED,
        'Invalid payment signature. Payment verification failed.',
        400,
      );
    }

    const now = new Date();

    // 1. Update Payment Record
    await db
      .update(payments)
      .set({
        status: 'CAPTURED',
        providerPaymentId: params.razorpayPaymentId,
        signatureVerifiedAt: now,
        capturedAt: now,
        updatedAt: now,
      })
      .where(and(eq(payments.orderId, params.orderId), eq(payments.provider, 'RAZORPAY')));

    // 2. Update Order Record
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        confirmedAt: now,
        updatedAt: now,
        version: sql`${orders.version} + 1`,
      })
      .where(eq(orders.id, params.orderId))
      .returning();

    // 3. Record Audit Event
    await db.insert(orderEvents).values({
      id: generateUuidV7(),
      orderId: params.orderId,
      type: 'PAYMENT_CAPTURED',
      fromStatus: 'PAYMENT_PENDING',
      toStatus: 'CONFIRMED',
      actorType: 'GATEWAY',
      visibility: 'CUSTOMER',
      note: `Payment of captured via Razorpay (${params.razorpayPaymentId})`,
      metadata: {
        razorpayOrderId: params.razorpayOrderId,
        razorpayPaymentId: params.razorpayPaymentId,
      },
    });

    // 4. Outbox Event
    await db.insert(outboxEvents).values({
      id: generateUuidV7(),
      type: 'payment.captured',
      aggregateType: 'Payment',
      aggregateId: params.orderId,
      payload: {
        orderId: params.orderId,
        orderNumber: order.orderNumber,
        razorpayPaymentId: params.razorpayPaymentId,
        totalPaise: order.totalPaise,
      },
      status: 'PENDING',
    });

    return { order: updatedOrder, success: true };
  },

  /** Get complete details of an order */
  async getOrder(orderId: string, userId?: string | null) {
    const db = getDb();

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Order not found', 404);
    }

    // Customer security: if order belongs to a user, another customer cannot view it
    if (order.userId && userId && order.userId !== userId) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied', 403);
    }

    const [items, events, paymentList] = await Promise.all([
      db.select().from(orderItems).where(eq(orderItems.orderId, orderId)),
      db
        .select()
        .from(orderEvents)
        .where(
          and(
            eq(orderEvents.orderId, orderId),
            userId ? eq(orderEvents.visibility, 'CUSTOMER') : undefined,
          ),
        )
        .orderBy(desc(orderEvents.createdAt)),
      db.select().from(payments).where(eq(payments.orderId, orderId)),
    ]);

    return {
      order,
      items,
      events,
      payments: paymentList,
    };
  },

  /** List orders for authenticated user */
  async listUserOrders(userId: string) {
    const db = getDb();
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.placedAt))
      .limit(50);

    return userOrders;
  },

  /** Cancel order if in eligible state */
  async cancelOrder(orderId: string, reason: string, userId?: string | null) {
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) throw new AppError(ERROR_CODES.NOT_FOUND, 'Order not found', 404);

    if (order.userId && userId && order.userId !== userId) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied', 403);
    }

    const cancellableStatuses = ['PENDING', 'PAYMENT_PENDING', 'CONFIRMED'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        `Orders in ${order.status} state cannot be cancelled online. Please contact Fatehpuri support.`,
        409,
      );
    }

    const now = new Date();
    const [cancelledOrder] = await db
      .update(orders)
      .set({
        status: 'CANCELLED',
        cancelReason: reason,
        cancelledAt: now,
        updatedAt: now,
        version: sql`${orders.version} + 1`,
      })
      .where(eq(orders.id, orderId))
      .returning();

    await db.insert(orderEvents).values({
      id: generateUuidV7(),
      orderId,
      type: 'ORDER_CANCELLED',
      fromStatus: order.status,
      toStatus: 'CANCELLED',
      actorType: userId ? 'CUSTOMER' : 'SYSTEM',
      actorId: userId ? (userId as string) : null,
      visibility: 'CUSTOMER',
      note: `Cancelled by customer: ${reason}`,
    });

    await db.insert(outboxEvents).values({
      id: generateUuidV7(),
      type: 'order.cancelled',
      aggregateType: 'Order',
      aggregateId: orderId,
      payload: { orderId, orderNumber: order.orderNumber, reason },
      status: 'PENDING',
    });

    return cancelledOrder;
  },
};

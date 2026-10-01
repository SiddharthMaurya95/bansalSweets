import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AppError, ERROR_CODES } from '@bansal/shared';
import { orderService } from './orderService.js';

// ─── Request Schemas ──────────────────────────────────────────────────────────

const shippingAddressSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional(),
  landmark: z.string().max(100).optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit PIN code required'),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  stateCode: z.string().length(2, 'State code must be 2 characters (e.g. 07)'),
  country: z.string().default('IN'),
});

const checkoutSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(10).max(15),
  customerEmail: z.string().email().optional(),
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema.optional(),
  customerGstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN')
    .optional(),
  paymentMethod: z.enum(['UPI', 'CARD', 'NETBANKING', 'WALLET', 'COD']),
  deliveryMethod: z.enum(['LOCAL_DELIVERY', 'STORE_PICKUP', 'COURIER']).default('COURIER'),
  customerNote: z.string().max(500).optional(),
  cartId: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .optional(),
});

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

const cancelOrderSchema = z.object({
  reason: z.string().min(3).max(300),
});

// ─── Route Plugin ─────────────────────────────────────────────────────────────

export const orderRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // ── POST /orders/checkout ──────────────────────────────────────────────────

  fastify.post(
    '/orders/checkout',
    {
      schema: {
        description: 'Create an order from cart and prepare payment',
        tags: ['Orders'],
      } as any,
    },
    async (request, reply) => {
      const parsed = checkoutSchema.safeParse(request.body);
      if (!parsed.success) {
        throw new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          parsed.error.errors[0]?.message || 'Invalid checkout payload',
          400,
          parsed.error.issues.map((i) => ({ field: i.path.join('.'), issue: i.message })),
        );
      }

      const user = (request as unknown as { user?: { userId: string } }).user;

      const result = await orderService.createOrder({
        ...parsed.data,
        userId: user?.userId || null,
        ipHash: request.ip,
        userAgentHash: request.headers['user-agent'],
      });

      return reply.status(201).send({ data: result });
    },
  );

  // ── POST /orders/:id/verify-payment ────────────────────────────────────────

  fastify.post<{ Params: { id: string } }>(
    '/orders/:id/verify-payment',
    {
      schema: {
        description: 'Verify payment gateway signature and confirm order',
        tags: ['Orders'],
      } as any,
    },
    async (request, reply) => {
      const parsed = verifyPaymentSchema.safeParse(request.body);
      if (!parsed.success) {
        throw new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          'Invalid payment verification details',
          400,
        );
      }

      const result = await orderService.verifyPayment({
        orderId: request.params.id,
        ...parsed.data,
      });

      return reply.send({ data: result });
    },
  );

  // ── GET /orders/:id ────────────────────────────────────────────────────────

  fastify.get<{ Params: { id: string } }>(
    '/orders/:id',
    {
      schema: {
        description: 'Get single order details by ID',
        tags: ['Orders'],
      } as any,
    },
    async (request, reply) => {
      const user = (request as unknown as { user?: { userId: string } }).user;
      const order = await orderService.getOrder(request.params.id, user?.userId);

      return reply.send({ data: order });
    },
  );

  // ── GET /orders ────────────────────────────────────────────────────────────

  fastify.get(
    '/orders',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'List orders for authenticated customer',
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
      } as any,
    },
    async (request, reply) => {
      const user = request.user!;
      const orders = await orderService.listUserOrders(user.userId);

      return reply.send({ data: orders });
    },
  );

  // ── POST /orders/:id/cancel ────────────────────────────────────────────────

  fastify.post<{ Params: { id: string } }>(
    '/orders/:id/cancel',
    {
      schema: {
        description: 'Cancel an order before dispatch',
        tags: ['Orders'],
      } as any,
    },
    async (request, reply) => {
      const parsed = cancelOrderSchema.safeParse(request.body);
      if (!parsed.success) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Cancellation reason is required', 400);
      }

      const user = (request as unknown as { user?: { userId: string } }).user;
      const result = await orderService.cancelOrder(
        request.params.id,
        parsed.data.reason,
        user?.userId,
      );

      return reply.send({ data: result });
    },
  );
};

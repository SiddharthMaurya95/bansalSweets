import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AppError, ERROR_CODES } from '@bansal/shared';
import { inventoryService } from './inventoryService.js';
import { invoiceService } from '../orders/invoiceService.js';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const inwardBatchSchema = z.object({
  variantId: z.string().uuid(),
  batchNumber: z.string().min(3).max(50),
  supplierName: z.string().min(2).max(100),
  originCountry: z.string().max(50).optional(),
  grade: z.string().max(50).optional(),
  quantity: z.number().int().min(1),
  costPerUnitPaise: z.number().int().min(1),
  bestBeforeDate: z.string().datetime(),
  harvestDate: z.string().datetime().optional(),
  fssaiBatchCert: z.string().max(100).optional(),
  locationCode: z.string().max(30).optional(),
});

const adjustStockSchema = z.object({
  inventoryItemId: z.string().uuid(),
  deltaQty: z.number().int(),
  type: z.enum(['ADJUSTMENT', 'DAMAGE', 'EXPIRY_WRITE_OFF', 'STOCKTAKE']),
  reasonCode: z.string().max(50).optional(),
  note: z.string().max(300).optional(),
});

// ─── Route Plugin ─────────────────────────────────────────────────────────────

export const inventoryRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // ── GET /inventory/stock ───────────────────────────────────────────────────

  fastify.get<{ Querystring: { variantId: string; locationCode?: string } }>(
    '/inventory/stock',
    {
      schema: {
        description: 'Get real-time stock levels for a product variant',
        tags: ['Inventory'],
        querystring: {
          type: 'object',
          required: ['variantId'],
          properties: {
            variantId: { type: 'string' },
            locationCode: { type: 'string' },
          },
        },
      } as any,
    },
    async (request, reply) => {
      const { variantId, locationCode } = request.query;
      if (!variantId) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'variantId query parameter is required', 400);
      }

      const stock = await inventoryService.getAvailableStock(variantId, locationCode);
      return reply.send({ data: stock });
    },
  );

  // ── POST /inventory/receipt ────────────────────────────────────────────────

  fastify.post(
    '/inventory/receipt',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Inward a new dry-fruit harvest lot/batch at Fatehpuri warehouse',
        tags: ['Inventory'],
        security: [{ bearerAuth: [] }],
      } as any,
    },
    async (request, reply) => {
      const parsed = inwardBatchSchema.safeParse(request.body);
      if (!parsed.success) {
        throw new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          parsed.error.errors[0]?.message || 'Invalid batch receipt payload',
          400,
          parsed.error.issues.map((i) => ({ field: i.path.join('.'), issue: i.message })),
        );
      }

      const user = request.user!;
      const batch = await inventoryService.inwardBatch({
        ...parsed.data,
        bestBeforeDate: new Date(parsed.data.bestBeforeDate),
        harvestDate: parsed.data.harvestDate ? new Date(parsed.data.harvestDate) : undefined,
        actorId: user.userId,
      });

      return reply.status(201).send({ data: batch });
    },
  );

  // ── POST /inventory/adjust ─────────────────────────────────────────────────

  fastify.post(
    '/inventory/adjust',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Manual inventory adjustment (damage, stocktake)',
        tags: ['Inventory'],
        security: [{ bearerAuth: [] }],
      } as any,
    },
    async (request, reply) => {
      const parsed = adjustStockSchema.safeParse(request.body);
      if (!parsed.success) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid adjustment parameters', 400);
      }

      const user = request.user!;
      const result = await inventoryService.adjustStock({
        ...parsed.data,
        actorId: user.userId,
      });

      return reply.send({ data: result });
    },
  );

  // ── GET /inventory/batches ─────────────────────────────────────────────────

  fastify.get<{ Querystring: { variantId?: string } }>(
    '/inventory/batches',
    {
      schema: {
        description: 'List active batches and expiry health status',
        tags: ['Inventory'],
      } as any,
    },
    async (request, reply) => {
      const batches = await inventoryService.listBatches(request.query.variantId);
      return reply.send({ data: batches });
    },
  );

  // ── GET /orders/:id/invoice ────────────────────────────────────────────────

  fastify.get<{ Params: { id: string } }>(
    '/orders/:id/invoice',
    {
      schema: {
        description: 'Get GST Tax Invoice metadata and breakdown for an order',
        tags: ['Orders', 'Invoices'],
      } as any,
    },
    async (request, reply) => {
      const invoiceData = await invoiceService.getOrCreateInvoice(request.params.id);
      return reply.send({ data: invoiceData });
    },
  );

  // ── GET /orders/:id/invoice/print ──────────────────────────────────────────

  fastify.get<{ Params: { id: string } }>(
    '/orders/:id/invoice/print',
    {
      schema: {
        description: 'Render printable GST Tax Invoice HTML document',
        tags: ['Orders', 'Invoices'],
      } as any,
    },
    async (request, reply) => {
      const html = await invoiceService.renderInvoiceHtml(request.params.id);
      reply.type('text/html');
      return reply.send(html);
    },
  );
};

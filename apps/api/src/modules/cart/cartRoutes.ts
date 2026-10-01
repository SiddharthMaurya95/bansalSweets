import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { getDb } from '@bansal/db';
import { carts, cartItems, productVariants, products, productImages } from '@bansal/db/schema';
import { AppError, ERROR_CODES, generateUuidV7 } from '@bansal/shared';
import { hashToken } from '../auth/crypto.js';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const addItemSchema = z.object({
  variantId: z.string().uuid('Invalid variant ID'),
  quantity: z.number().int().min(1).max(99),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0).max(99),
});

const GUEST_TOKEN_COOKIE = 'bf_cart_token';
const CART_EXPIRY_DAYS = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve or create a cart for the current request (user or guest) */
async function resolveCart(
  request: FastifyRequest,
  db: ReturnType<typeof getDb>,
  createIfMissing = true,
): Promise<{ cart: typeof carts.$inferSelect | null; guestToken: string | null }> {
  const user = (request as unknown as { user?: { userId: string } }).user;

  if (user) {
    // Authenticated: look up user cart
    const [cart] = await db
      .select()
      .from(carts)
      .where(and(eq(carts.userId, user.userId), eq(carts.status, 'ACTIVE')))
      .limit(1);

    if (cart) return { cart, guestToken: null };

    if (!createIfMissing) return { cart: null, guestToken: null };

    // Create new user cart
    const [newCart] = await db
      .insert(carts)
      .values({
        id: generateUuidV7(),
        userId: user.userId,
        expiresAt: new Date(Date.now() + CART_EXPIRY_DAYS * 86400 * 1000),
        lastActivityAt: new Date(),
      })
      .returning();

    return { cart: newCart ?? null, guestToken: null };
  }

  // Guest: look up via hashed cookie token
  const rawToken: string | undefined = (request.cookies as Record<string, string | undefined>)[
    GUEST_TOKEN_COOKIE
  ];

  if (rawToken) {
    const tokenHash = await hashToken(rawToken);
    const [cart] = await db
      .select()
      .from(carts)
      .where(and(eq(carts.guestTokenHash, tokenHash), eq(carts.status, 'ACTIVE')))
      .limit(1);

    if (cart) return { cart, guestToken: rawToken };
  }

  if (!createIfMissing) return { cart: null, guestToken: null };

  // Create guest cart
  const newToken = generateUuidV7();
  const tokenHash = await hashToken(newToken);

  const [newCart] = await db
    .insert(carts)
    .values({
      id: generateUuidV7(),
      guestTokenHash: tokenHash,
      expiresAt: new Date(Date.now() + CART_EXPIRY_DAYS * 86400 * 1000),
      lastActivityAt: new Date(),
    })
    .returning();

  return { cart: newCart ?? null, guestToken: newToken };
}

/** Fetch cart with enriched items */
async function enrichCart(cartId: string, db: ReturnType<typeof getDb>) {
  const items = await db
    .select({
      cartItem: cartItems,
      variant: productVariants,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
      },
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  // Fetch primary images
  const productIds = [...new Set(items.map((i) => i.product.id))];
  const images =
    productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(
            and(
              sql`${productImages.productId} = ANY(${sql.raw(`ARRAY['${productIds.join("','")}']::uuid[]`)})`,
              eq(productImages.isPrimary, true),
            ),
          )
      : [];

  const imageMap = new Map(images.map((img) => [img.productId, img.url]));

  return items.map(({ cartItem, variant, product }) => ({
    id: cartItem.id,
    variantId: cartItem.variantId,
    quantity: cartItem.quantity,
    savedForLater: cartItem.savedForLater,
    variant: {
      id: variant.id,
      sku: variant.sku,
      label: variant.label,
      weightGrams: variant.weightGrams,
      pricePaise: variant.pricePaise,
      mrpPaise: variant.mrpPaise,
      isActive: variant.isActive,
    },
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: imageMap.get(product.id) ?? null,
    },
    lineTotalPaise: variant.pricePaise * cartItem.quantity,
  }));
}

// ─── Cart Routes ──────────────────────────────────────────────────────────────

export const cartRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const db = getDb();

  // ── GET /cart ──────────────────────────────────────────────────────────────

  fastify.get(
    '/cart',
    {
      schema: {
        description: 'Get the current cart (user or guest)',
        tags: ['Cart'],
      } as any,
    },
    async (request, reply) => {
      const { cart, guestToken } = await resolveCart(request, db, false);

      if (!cart) {
        return reply.send({ data: { items: [], subtotalPaise: 0, itemCount: 0 } });
      }

      const items = await enrichCart(cart.id, db);
      const subtotalPaise = items.reduce((sum, i) => sum + i.lineTotalPaise, 0);

      // Persist guest token cookie if newly created
      if (guestToken) {
        reply.setCookie(GUEST_TOKEN_COOKIE, guestToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: CART_EXPIRY_DAYS * 86400,
          path: '/',
        });
      }

      return reply.send({
        data: {
          id: cart.id,
          status: cart.status,
          deliveryPincode: cart.deliveryPincode,
          version: cart.version,
          items,
          subtotalPaise,
          itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        },
      });
    },
  );

  // ── POST /cart/items ───────────────────────────────────────────────────────

  fastify.post(
    '/cart/items',
    {
      schema: {
        description: 'Add an item to the cart',
        tags: ['Cart'],
        body: {
          type: 'object',
          required: ['variantId', 'quantity'],
          properties: {
            variantId: { type: 'string', format: 'uuid' },
            quantity: { type: 'number', minimum: 1, maximum: 99 },
          },
        },
      } as any,
    },
    async (request, reply) => {
      const body = addItemSchema.safeParse(request.body);
      if (!body.success) {
        throw new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          body.error.errors[0]?.message || 'Invalid cart item data',
          400,
          body.error.issues.map((i) => ({ field: i.path.join('.'), issue: i.message })),
        );
      }

      const { variantId, quantity } = body.data;

      // Validate variant exists and is active
      const [variant] = await db
        .select()
        .from(productVariants)
        .where(
          and(
            eq(productVariants.id, variantId),
            eq(productVariants.isActive, true),
            isNull(productVariants.deletedAt),
          ),
        )
        .limit(1);

      if (!variant) {
        throw new AppError(ERROR_CODES.NOT_FOUND, 'Product variant not found or inactive', 404);
      }

      const effectiveMaxQty = variant.maxOrderQty ?? 99;
      if (quantity > effectiveMaxQty) {
        throw new AppError(
          ERROR_CODES.VALIDATION_ERROR,
          `Maximum order quantity for this item is ${effectiveMaxQty}`,
          400,
        );
      }

      const { cart, guestToken } = await resolveCart(request, db, true);
      if (!cart) throw new AppError(ERROR_CODES.INTERNAL_ERROR, 'Could not create cart', 500);

      // Upsert cart item
      const [existing] = await db
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.variantId, variantId)))
        .limit(1);

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, effectiveMaxQty);
        await db
          .update(cartItems)
          .set({ quantity: newQty, updatedAt: new Date() })
          .where(eq(cartItems.id, existing.id));
      } else {
        await db.insert(cartItems).values({
          id: generateUuidV7(),
          cartId: cart.id,
          variantId,
          quantity,
        });
      }

      // Bump cart version
      await db
        .update(carts)
        .set({ version: sql`${carts.version} + 1`, lastActivityAt: new Date() })
        .where(eq(carts.id, cart.id));

      const items = await enrichCart(cart.id, db);
      const subtotalPaise = items.reduce((sum, i) => sum + i.lineTotalPaise, 0);

      if (guestToken) {
        reply.setCookie(GUEST_TOKEN_COOKIE, guestToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: CART_EXPIRY_DAYS * 86400,
          path: '/',
        });
      }

      return reply.status(201).send({
        data: { items, subtotalPaise, itemCount: items.reduce((s, i) => s + i.quantity, 0) },
      });
    },
  );

  // ── PATCH /cart/items/:itemId ──────────────────────────────────────────────

  fastify.patch<{ Params: { itemId: string } }>(
    '/cart/items/:itemId',
    {
      schema: {
        description: 'Update the quantity of a cart item (0 removes it)',
        tags: ['Cart'],
        params: { type: 'object', properties: { itemId: { type: 'string' } } },
      } as any,
    },
    async (request, reply) => {
      const body = updateItemSchema.safeParse(request.body);
      if (!body.success) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid quantity', 400);
      }

      const { cart } = await resolveCart(request, db, false);
      if (!cart) throw new AppError(ERROR_CODES.NOT_FOUND, 'Cart not found', 404);

      const { itemId } = request.params;
      const [item] = await db
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)))
        .limit(1);

      if (!item) throw new AppError(ERROR_CODES.NOT_FOUND, 'Cart item not found', 404);

      if (body.data.quantity === 0) {
        await db.delete(cartItems).where(eq(cartItems.id, itemId));
      } else {
        await db
          .update(cartItems)
          .set({ quantity: body.data.quantity, updatedAt: new Date() })
          .where(eq(cartItems.id, itemId));
      }

      await db
        .update(carts)
        .set({ version: sql`${carts.version} + 1`, lastActivityAt: new Date() })
        .where(eq(carts.id, cart.id));

      const items = await enrichCart(cart.id, db);
      const subtotalPaise = items.reduce((sum, i) => sum + i.lineTotalPaise, 0);

      return reply.send({
        data: { items, subtotalPaise, itemCount: items.reduce((s, i) => s + i.quantity, 0) },
      });
    },
  );

  // ── DELETE /cart ───────────────────────────────────────────────────────────

  fastify.delete(
    '/cart',
    {
      schema: { description: 'Clear all items from the cart', tags: ['Cart'] } as any,
    },
    async (request, reply) => {
      const { cart } = await resolveCart(request, db, false);
      if (!cart) return reply.status(204).send();

      await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
      await db
        .update(carts)
        .set({ version: sql`${carts.version} + 1`, lastActivityAt: new Date() })
        .where(eq(carts.id, cart.id));

      return reply.status(204).send();
    },
  );
};

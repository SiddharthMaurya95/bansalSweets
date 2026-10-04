import { getDb } from '@bansal/db';
import {
  inventoryLocations,
  inventoryItems,
  inventoryTransactions,
  inventoryReservations,
  inventoryBatches,
  productVariants,
  products,
} from '@bansal/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { AppError, ERROR_CODES, generateUuidV7 } from '@bansal/shared';

// ─── Default Location ─────────────────────────────────────────────────────────

export const DEFAULT_LOCATION_CODE = 'FATEHPURI_MAIN';

async function getOrCreateLocation(db: ReturnType<typeof getDb>, code = DEFAULT_LOCATION_CODE) {
  const [existing] = await db
    .select()
    .from(inventoryLocations)
    .where(eq(inventoryLocations.code, code))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(inventoryLocations)
    .values({
      id: generateUuidV7(),
      code,
      name: 'Khari Baoli Mandi Warehouse',
      isDefault: true,
      address: 'Shop 42, Katra Ishwar Bhawan, Khari Baoli, Delhi 110006',
    })
    .returning();

  return created!;
}

async function getOrCreateInventoryItem(
  db: ReturnType<typeof getDb>,
  locationId: string,
  variantId: string,
) {
  const [existing] = await db
    .select()
    .from(inventoryItems)
    .where(and(eq(inventoryItems.locationId, locationId), eq(inventoryItems.variantId, variantId)))
    .limit(1);

  if (existing) return existing;

  const [variant] = await db
    .select({ productId: productVariants.productId })
    .from(productVariants)
    .where(eq(productVariants.id, variantId))
    .limit(1);

  if (!variant) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 'Product variant not found', 404);
  }

  const [created] = await db
    .insert(inventoryItems)
    .values({
      id: generateUuidV7(),
      locationId,
      productId: variant.productId,
      variantId,
      stockUnit: 'UNIT',
      onHandQty: 0,
      reservedQty: 0,
      onlineBufferQty: 2, // 2 units safety buffer for mandi counter sales
      lowStockThreshold: 5,
    })
    .returning();

  return created!;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const inventoryService = {
  /** Get stock availability for a variant */
  async getAvailableStock(variantId: string, locationCode = DEFAULT_LOCATION_CODE) {
    const db = getDb();
    const location = await getOrCreateLocation(db, locationCode);
    const item = await getOrCreateInventoryItem(db, location.id, variantId);

    const onHand = Number(item.onHandQty);
    const reserved = Number(item.reservedQty);
    const buffer = Number(item.onlineBufferQty);
    const available = Math.max(0, onHand - reserved - buffer);
    const isLowStock = available <= Number(item.lowStockThreshold);

    return {
      inventoryItemId: item.id,
      locationId: location.id,
      locationCode: location.code,
      variantId,
      onHandQty: onHand,
      reservedQty: reserved,
      onlineBufferQty: buffer,
      availableQty: available,
      isLowStock,
    };
  },

  /** Reserve inventory for a pending checkout with TTL */
  async reserveStock(
    orderId: string,
    items: { variantId: string; quantity: number }[],
    ttlMinutes = 15,
  ) {
    const db = getDb();
    const location = await getOrCreateLocation(db);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    const reservations = [];

    for (const reqItem of items) {
      const invItem = await getOrCreateInventoryItem(db, location.id, reqItem.variantId);
      const onHand = Number(invItem.onHandQty);
      const reserved = Number(invItem.reservedQty);
      const buffer = Number(invItem.onlineBufferQty);
      const available = onHand - reserved - buffer;

      if (available < reqItem.quantity) {
        throw new AppError(
          ERROR_CODES.INSUFFICIENT_STOCK,
          `Insufficient stock for item. Available: ${Math.max(0, available)}, requested: ${reqItem.quantity}`,
          409,
        );
      }

      // Update reserved count
      const newReserved = reserved + reqItem.quantity;
      await db
        .update(inventoryItems)
        .set({ reservedQty: newReserved, updatedAt: new Date() })
        .where(eq(inventoryItems.id, invItem.id));

      // Record reservation
      const [res] = await db
        .insert(inventoryReservations)
        .values({
          id: generateUuidV7(),
          orderId,
          inventoryItemId: invItem.id,
          quantity: reqItem.quantity,
          status: 'ACTIVE',
          expiresAt,
        })
        .returning();

      // Record audit ledger transaction
      await db.insert(inventoryTransactions).values({
        id: generateUuidV7(),
        inventoryItemId: invItem.id,
        type: 'RESERVE',
        deltaOnHand: 0,
        deltaReserved: reqItem.quantity,
        onHandAfter: onHand,
        reservedAfter: newReserved,
        referenceType: 'ORDER',
        referenceId: orderId,
        note: `Hold for checkout (Order ${orderId})`,
      });

      reservations.push(res!);
    }

    return reservations;
  },

  /** Commit reservation upon successful payment */
  async commitReservation(orderId: string) {
    const db = getDb();
    const activeRes = await db
      .select()
      .from(inventoryReservations)
      .where(
        and(eq(inventoryReservations.orderId, orderId), eq(inventoryReservations.status, 'ACTIVE')),
      );

    for (const res of activeRes) {
      const [invItem] = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.id, res.inventoryItemId))
        .limit(1);

      if (invItem) {
        const qty = Number(res.quantity);
        const newOnHand = Math.max(0, Number(invItem.onHandQty) - qty);
        const newReserved = Math.max(0, Number(invItem.reservedQty) - qty);

        await db
          .update(inventoryItems)
          .set({ onHandQty: newOnHand, reservedQty: newReserved, updatedAt: new Date() })
          .where(eq(inventoryItems.id, invItem.id));

        await db
          .update(inventoryReservations)
          .set({ status: 'CONFIRMED', updatedAt: new Date() })
          .where(eq(inventoryReservations.id, res.id));

        await db.insert(inventoryTransactions).values({
          id: generateUuidV7(),
          inventoryItemId: invItem.id,
          type: 'SALE_COMMIT',
          deltaOnHand: -qty,
          deltaReserved: -qty,
          onHandAfter: newOnHand,
          reservedAfter: newReserved,
          referenceType: 'ORDER',
          referenceId: orderId,
          note: `Payment confirmed. Deducted ${qty} units.`,
        });
      }
    }
  },

  /** Release active reservations (order cancelled or expired) */
  async releaseReservation(orderId: string) {
    const db = getDb();
    const activeRes = await db
      .select()
      .from(inventoryReservations)
      .where(
        and(eq(inventoryReservations.orderId, orderId), eq(inventoryReservations.status, 'ACTIVE')),
      );

    for (const res of activeRes) {
      const [invItem] = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.id, res.inventoryItemId))
        .limit(1);

      if (invItem) {
        const qty = Number(res.quantity);
        const newReserved = Math.max(0, Number(invItem.reservedQty) - qty);

        await db
          .update(inventoryItems)
          .set({ reservedQty: newReserved, updatedAt: new Date() })
          .where(eq(inventoryItems.id, invItem.id));

        await db
          .update(inventoryReservations)
          .set({ status: 'RELEASED', updatedAt: new Date() })
          .where(eq(inventoryReservations.id, res.id));

        await db.insert(inventoryTransactions).values({
          id: generateUuidV7(),
          inventoryItemId: invItem.id,
          type: 'RELEASE',
          deltaOnHand: 0,
          deltaReserved: -qty,
          onHandAfter: Number(invItem.onHandQty),
          reservedAfter: newReserved,
          referenceType: 'ORDER',
          referenceId: orderId,
          note: `Released reservation for Order ${orderId}`,
        });
      }
    }
  },

  /** Sweep expired checkout reservations */
  async sweepExpiredReservations(): Promise<number> {
    const db = getDb();
    const expiredRes = await db
      .select()
      .from(inventoryReservations)
      .where(
        and(
          eq(inventoryReservations.status, 'ACTIVE'),
          lte(inventoryReservations.expiresAt, new Date()),
        ),
      )
      .limit(100);

    let releasedCount = 0;
    for (const res of expiredRes) {
      await this.releaseReservation(res.orderId);
      releasedCount++;
    }

    return releasedCount;
  },

  /** Inward a new harvest lot/batch at Khari Baoli */
  async inwardBatch(data: {
    variantId: string;
    batchNumber: string;
    supplierName: string;
    originCountry?: string;
    grade?: string;
    quantity: number;
    costPerUnitPaise: number;
    bestBeforeDate: Date;
    harvestDate?: Date;
    fssaiBatchCert?: string;
    locationCode?: string;
    actorId?: string;
  }) {
    const db = getDb();
    const location = await getOrCreateLocation(db, data.locationCode);
    const item = await getOrCreateInventoryItem(db, location.id, data.variantId);

    // 1. Create Batch record
    const [batch] = await db
      .insert(inventoryBatches)
      .values({
        id: generateUuidV7(),
        inventoryItemId: item.id,
        batchNumber: data.batchNumber,
        supplierName: data.supplierName,
        originCountry: data.originCountry || 'India',
        grade: data.grade || null,
        initialQty: data.quantity,
        remainingQty: data.quantity,
        costPerUnitPaise: data.costPerUnitPaise,
        harvestDate: data.harvestDate || null,
        bestBeforeDate: data.bestBeforeDate,
        fssaiBatchCert: data.fssaiBatchCert || null,
        status: 'ACTIVE',
      })
      .returning();

    // 2. Increment on-hand stock
    const newOnHand = Number(item.onHandQty) + data.quantity;
    await db
      .update(inventoryItems)
      .set({ onHandQty: newOnHand, updatedAt: new Date() })
      .where(eq(inventoryItems.id, item.id));

    // 3. Record transaction
    await db.insert(inventoryTransactions).values({
      id: generateUuidV7(),
      inventoryItemId: item.id,
      type: 'RECEIPT',
      deltaOnHand: data.quantity,
      deltaReserved: 0,
      onHandAfter: newOnHand,
      reservedAfter: Number(item.reservedQty),
      referenceType: 'MANUAL',
      referenceId: batch!.id,
      actorId: data.actorId || null,
      note: `Inward Lot ${data.batchNumber} from ${data.supplierName}`,
    });

    return batch!;
  },

  /** Adjust inventory (damage, write-off, count corrections) */
  async adjustStock(data: {
    inventoryItemId: string;
    deltaQty: number;
    type: 'ADJUSTMENT' | 'DAMAGE' | 'EXPIRY_WRITE_OFF' | 'STOCKTAKE';
    reasonCode?: string;
    note?: string;
    actorId?: string;
  }) {
    const db = getDb();
    const [item] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, data.inventoryItemId))
      .limit(1);

    if (!item) throw new AppError(ERROR_CODES.NOT_FOUND, 'Inventory item not found', 404);

    const onHand = Number(item.onHandQty);
    const newOnHand = onHand + data.deltaQty;
    if (newOnHand < 0) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Stock cannot be negative', 400);
    }

    await db
      .update(inventoryItems)
      .set({ onHandQty: newOnHand, updatedAt: new Date() })
      .where(eq(inventoryItems.id, item.id));

    await db.insert(inventoryTransactions).values({
      id: generateUuidV7(),
      inventoryItemId: item.id,
      type: data.type,
      deltaOnHand: data.deltaQty,
      deltaReserved: 0,
      onHandAfter: newOnHand,
      reservedAfter: Number(item.reservedQty),
      reasonCode: data.reasonCode || null,
      note: data.note || null,
      actorId: data.actorId || null,
    });

    return { inventoryItemId: item.id, onHandQty: newOnHand };
  },

  /** Query active batches and expiry health */
  async listBatches(variantId?: string) {
    const db = getDb();
    const now = new Date();

    const query = db
      .select({
        batch: inventoryBatches,
        item: inventoryItems,
        variant: productVariants,
        product: products,
      })
      .from(inventoryBatches)
      .innerJoin(inventoryItems, eq(inventoryBatches.inventoryItemId, inventoryItems.id))
      .innerJoin(productVariants, eq(inventoryItems.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .orderBy(inventoryBatches.bestBeforeDate);

    const rows = variantId ? await query.where(eq(productVariants.id, variantId)) : await query;

    return rows.map(({ batch, variant, product }) => {
      const daysToExpiry = Math.ceil(
        (batch.bestBeforeDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
      );
      return {
        id: batch.id,
        batchNumber: batch.batchNumber,
        productName: product.name,
        variantLabel: variant.label,
        supplierName: batch.supplierName,
        originCountry: batch.originCountry,
        grade: batch.grade,
        remainingQty: Number(batch.remainingQty),
        initialQty: Number(batch.initialQty),
        costPerUnitPaise: Number(batch.costPerUnitPaise),
        harvestDate: batch.harvestDate,
        packagedDate: batch.packagedDate,
        bestBeforeDate: batch.bestBeforeDate,
        daysToExpiry,
        isExpired: daysToExpiry <= 0,
        isNearExpiry: daysToExpiry > 0 && daysToExpiry <= 30,
        status: batch.status,
      };
    });
  },
};

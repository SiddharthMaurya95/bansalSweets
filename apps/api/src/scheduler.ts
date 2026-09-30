import { getDb } from '@bansal/db';
import { inventoryReservations, inventoryItems, orders, idempotencyKeys } from '@bansal/db/schema';
import { and, eq, lt, sql } from 'drizzle-orm';
import { createLogger } from './plugins/logging.js';

const logger = createLogger();

/**
 * Sweeps and releases expired inventory reservations (Section 24.3 & 24.4)
 */
export async function expireInventoryReservations(): Promise<number> {
  const db = getDb();
  const now = new Date();

  // Find active reservations past their TTL
  const expired = await db
    .select()
    .from(inventoryReservations)
    .where(
      and(eq(inventoryReservations.status, 'ACTIVE'), lt(inventoryReservations.expiresAt, now)),
    );

  if (expired.length === 0) return 0;

  logger.info({ count: expired.length }, 'Expiring inventory reservations');

  for (const res of expired) {
    try {
      await db.transaction(async (tx) => {
        // 1. Release reserved quantity on inventory item
        await tx
          .update(inventoryItems)
          .set({
            reservedQty: sql`${inventoryItems.reservedQty} - ${res.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(inventoryItems.id, res.inventoryItemId));

        // 2. Mark reservation as RELEASED
        await tx
          .update(inventoryReservations)
          .set({
            status: 'RELEASED',
            updatedAt: new Date(),
          })
          .where(eq(inventoryReservations.id, res.id));

        // 3. Mark order as CANCELLED (PAYMENT_TIMEOUT)
        await tx
          .update(orders)
          .set({
            status: 'CANCELLED',
            cancelReason: 'PAYMENT_TIMEOUT',
            cancelledAt: new Date(),
            updatedAt: new Date(),
          })
          .where(and(eq(orders.id, res.orderId), eq(orders.status, 'PAYMENT_PENDING')));
      });
    } catch (err) {
      logger.error({ err, reservationId: res.id }, 'Failed to release reservation');
    }
  }

  return expired.length;
}

/**
 * Cleans up expired idempotency keys and old carts
 */
export async function runHousekeeping(): Promise<void> {
  const db = getDb();
  const now = new Date();

  try {
    await db.delete(idempotencyKeys).where(lt(idempotencyKeys.expiresAt, now));
    logger.info('Housekeeping: expired idempotency keys purged');
  } catch (err) {
    logger.error({ err }, 'Error during housekeeping run');
  }
}

export async function startScheduler(): Promise<void> {
  logger.info('⏱️ Bansal Foods Repeatable Jobs Scheduler started');

  // Sweep expired reservations every 60 seconds
  setInterval(() => {
    expireInventoryReservations().catch((err) =>
      logger.error({ err }, 'Reservation expiry job error'),
    );
  }, 60 * 1000);

  // Housekeeping run every 12 hours
  setInterval(
    () => {
      runHousekeeping().catch((err) => logger.error({ err }, 'Housekeeping job error'));
    },
    12 * 60 * 60 * 1000,
  );
}

// When executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  void startScheduler();
}

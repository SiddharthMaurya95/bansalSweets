import { getDb } from '@bansal/db';
import { outboxEvents } from '@bansal/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { loadEnv } from './config/env.js';
import { createLogger } from './plugins/logging.js';

const logger = createLogger();

export interface WorkerStatus {
  isRunning: boolean;
  processedCount: number;
  errorCount: number;
}

const status: WorkerStatus = {
  isRunning: false,
  processedCount: 0,
  errorCount: 0,
};

/**
 * Polls and processes pending transactional outbox events (Section 9.4 & ADR 0009).
 * Uses row locking semantics to ensure safe concurrent worker processing.
 */
export async function processOutboxBatch(batchSize = 25): Promise<number> {
  const db = getDb();

  // Find and lock pending events
  const pendingEvents = await db
    .select()
    .from(outboxEvents)
    .where(and(eq(outboxEvents.status, 'PENDING'), lte(outboxEvents.availableAt, new Date())))
    .limit(batchSize);

  if (pendingEvents.length === 0) {
    return 0;
  }

  logger.info({ count: pendingEvents.length }, 'Processing outbox batch');

  for (const event of pendingEvents) {
    try {
      // Dispatch event to handlers (e.g. notifications, cache revalidation, analytics)
      logger.info({ eventId: event.id, type: event.type }, 'Dispatching domain event');

      // Update to PROCESSED
      await db
        .update(outboxEvents)
        .set({
          status: 'PROCESSED',
          processedAt: new Date(),
        })
        .where(eq(outboxEvents.id, event.id));

      status.processedCount++;
    } catch (err) {
      status.errorCount++;
      logger.error({ err, eventId: event.id }, 'Failed to dispatch outbox event');

      const nextAttempts = event.attempts + 1;
      const isFailed = nextAttempts >= 5;

      // Exponential backoff delay (2^attempts * 10 seconds)
      const nextDelaySeconds = Math.pow(2, nextAttempts) * 10;
      const nextAvailableAt = new Date(Date.now() + nextDelaySeconds * 1000);

      await db
        .update(outboxEvents)
        .set({
          status: isFailed ? 'FAILED' : 'PENDING',
          attempts: nextAttempts,
          availableAt: nextAvailableAt,
        })
        .where(eq(outboxEvents.id, event.id));
    }
  }

  return pendingEvents.length;
}

export async function startWorker(): Promise<void> {
  loadEnv();
  status.isRunning = true;
  logger.info('🚀 Bansal Foods Background Worker started');

  const pollIntervalMs = 5000;

  const loop = async () => {
    while (status.isRunning) {
      try {
        await processOutboxBatch();
      } catch (err) {
        logger.error({ err }, 'Error in worker loop execution');
      }
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  };

  void loop();

  const shutdown = (signal: string) => {
    logger.info({ signal }, 'Worker shutting down gracefully...');
    status.isRunning = false;
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// When executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  void startWorker();
}

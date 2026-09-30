import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

export type Database = PostgresJsDatabase<typeof schema>;
export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

export interface TransactionOptions {
  isolationLevel?: 'read committed' | 'repeatable read' | 'serializable';
  maxRetries?: number;
  lockTimeoutMs?: number;
  statementTimeoutMs?: number;
}

let dbInstance: Database | null = null;
let sqlClient: ReturnType<typeof postgres> | null = null;

export function getDb(connectionString?: string): Database {
  if (dbInstance) return dbInstance;

  const conn =
    connectionString ||
    process.env['DATABASE_URL'] ||
    'postgres://postgres:postgrespassword@localhost:5432/bansal_foods';

  sqlClient = postgres(conn, {
    max: 20, // Max pool size
    idle_timeout: 20,
    connect_timeout: 10,
    transform: {
      undefined: null,
    },
  });

  dbInstance = drizzle(sqlClient, { schema });
  return dbInstance;
}

export async function closeDb(): Promise<void> {
  if (sqlClient) {
    await sqlClient.end();
    sqlClient = null;
    dbInstance = null;
  }
}

/**
 * Executes a function within a managed database transaction.
 * Features:
 * - Default READ COMMITTED isolation
 * - Statement and lock timeouts set on the transaction
 * - Bounded retries (default 3) on deadlock (40P01) and serialization failure (40001)
 * - Jittered exponential backoff
 */
export async function withTransaction<T>(
  fn: (tx: Transaction) => Promise<T>,
  options: TransactionOptions = {},
): Promise<T> {
  const db = getDb();
  const isolationLevel = options.isolationLevel || 'read committed';
  const maxRetries = options.maxRetries ?? 3;
  const lockTimeoutMs = options.lockTimeoutMs ?? 3000;
  const statementTimeoutMs = options.statementTimeoutMs ?? 5000;

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await db.transaction(
        async (tx) => {
          // Set timeouts on this transaction session
          await tx.execute(`SET LOCAL lock_timeout = '${lockTimeoutMs}ms'`);
          await tx.execute(`SET LOCAL statement_timeout = '${statementTimeoutMs}ms'`);
          return await fn(tx);
        },
        { isolationLevel },
      );
    } catch (err: unknown) {
      attempt++;
      const isPostgresError =
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        typeof (err as { code: unknown }).code === 'string';

      const code = isPostgresError ? (err as { code: string }).code : '';
      const isDeadlockOrSerialization = code === '40P01' || code === '40001';

      if (isDeadlockOrSerialization && attempt < maxRetries) {
        // Jittered backoff: (2^attempt * 50ms) + random jitter (0-50ms)
        const delay = Math.pow(2, attempt) * 50 + Math.floor(Math.random() * 50);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw err;
    }
  }

  throw new Error('Transaction failed after maximum retry attempts');
}

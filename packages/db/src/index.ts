/**
 * PostgreSQL Database Client & Connection Helpers.
 * Configured per Section 10 with strict isolation, timeouts, and transaction helper.
 */

export interface DbConnectionOptions {
  connectionString: string;
  maxConnections?: number;
  idleTimeout?: number;
  connectTimeout?: number;
}

export const DB_DEFAULTS = {
  statementTimeoutMs: 5000,
  lockTimeoutMs: 3000,
  idleInTransactionSessionTimeoutMs: 10000,
} as const;

export type DbClient = {
  // Placeholder type for Phase 1 skeleton, full Drizzle client wired in Phase 2
  query: (sql: string, params?: unknown[]) => Promise<unknown>;
};

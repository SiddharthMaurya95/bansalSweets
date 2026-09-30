import { eq, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { products, storeSettings } from '../schema/index';

export const FORBIDDEN_PRODUCTION_MARKERS = ['__PLACEHOLDER__', '__SEED__', '__SET_ME__'] as const;

export class SeedGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SeedGuardError';
  }
}

/**
 * Scan an arbitrary text or JSON object for forbidden placeholder markers.
 */
export function scanForPlaceholders(target: unknown, path = ''): string[] {
  const violations: string[] = [];

  if (typeof target === 'string') {
    for (const marker of FORBIDDEN_PRODUCTION_MARKERS) {
      if (target.includes(marker)) {
        violations.push(`Found marker "${marker}" at "${path}": ${target}`);
      }
    }
  } else if (Array.isArray(target)) {
    target.forEach((item, index) => {
      violations.push(...scanForPlaceholders(item, `${path}[${index}]`));
    });
  } else if (typeof target === 'object' && target !== null) {
    for (const [key, value] of Object.entries(target)) {
      violations.push(...scanForPlaceholders(value, path ? `${path}.${key}` : key));
    }
  }

  return violations;
}

/**
 * Validates that a production database does not contain synthetic seed data
 * or unconfigured placeholders. (Section 0.5)
 */
export async function assertProductionClean(): Promise<void> {
  const db = getDb();

  // 1. Ensure zero synthetic seed products in production
  const [seedProductCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.isSeed, true));

  if (seedProductCount && seedProductCount.count > 0) {
    throw new SeedGuardError(
      `🚨 PRODUCTION GUARD FAILED: Found ${seedProductCount.count} synthetic seed products in the database! Synthetic data is strictly forbidden in production.`,
    );
  }

  // 2. Validate store settings for unresolved placeholders
  const settingsRows = await db.select().from(storeSettings);
  const settingViolations: string[] = [];

  for (const row of settingsRows) {
    const violations = scanForPlaceholders(row.value, `store_settings.${row.key}`);
    settingViolations.push(...violations);
  }

  if (settingViolations.length > 0) {
    throw new SeedGuardError(
      `🚨 PRODUCTION GUARD FAILED: Unresolved placeholders in store_settings:\n${settingViolations.join('\n')}`,
    );
  }

  console.log('✅ SeedGuard: Production database verified clean of synthetic seed data.');
}

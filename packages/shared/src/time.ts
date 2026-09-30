/**
 * Time and Timezone utilities.
 * Single source of truth for time handling:
 * - Timestamps are stored in UTC (timestamptz)
 * - Business day calculations use Asia/Kolkata (IST = UTC+05:30)
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

export function nowUtc(): Date {
  return new Date();
}

export function nowIsoUtc(): string {
  return new Date().toISOString();
}

/**
 * Get current date string in Asia/Kolkata in YYYY-MM-DD format
 */
export function getIstDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

/**
 * Format timestamp in IST human-readable format
 */
export function formatIstDateTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Calculate if current IST time is before cut-off time (e.g., '17:00')
 */
export function isBeforeIstCutoff(cutoffTimeString: string, date: Date = new Date()): boolean {
  const parts = cutoffTimeString.split(':').map(Number);
  const cutoffHour = parts[0] ?? 17;
  const cutoffMinute = parts[1] ?? 0;

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIMEZONE,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const partsFormatted = timeFormatter.formatToParts(date);
  const hour = Number(partsFormatted.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(partsFormatted.find((p) => p.type === 'minute')?.value ?? 0);

  if (hour < cutoffHour) return true;
  if (hour === cutoffHour && minute < cutoffMinute) return true;
  return false;
}

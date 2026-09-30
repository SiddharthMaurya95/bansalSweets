import { webcrypto } from 'node:crypto';

const cryptoObj = globalThis.crypto || webcrypto;

let lastTimestamp = -1;
let sequenceCounter = 0;

/**
 * Generate a monotonic RFC 9562 compliant UUIDv7.
 * Provides time-ordered UUIDs suitable as high-performance database primary keys.
 */
export function generateUuidV7(): string {
  let timestamp = Date.now();

  if (timestamp <= lastTimestamp) {
    sequenceCounter++;
    if (sequenceCounter > 0xfff) {
      // Counter rollover within same ms; advance timestamp
      timestamp = lastTimestamp + 1;
      sequenceCounter = 0;
    }
  } else {
    sequenceCounter = Math.floor(Math.random() * 0x100);
  }

  lastTimestamp = timestamp;

  const bytes = new Uint8Array(16);
  cryptoObj.getRandomValues(bytes);

  // 48-bit timestamp (bytes 0-5)
  bytes[0] = (timestamp >> 40) & 0xff;
  bytes[1] = (timestamp >> 32) & 0xff;
  bytes[2] = (timestamp >> 24) & 0xff;
  bytes[3] = (timestamp >> 16) & 0xff;
  bytes[4] = (timestamp >> 8) & 0xff;
  bytes[5] = timestamp & 0xff;

  // 4-bit version (7) + 12-bit sequence counter (bytes 6-7)
  bytes[6] = 0x70 | ((sequenceCounter >> 8) & 0x0f);
  bytes[7] = sequenceCounter & 0xff;

  // 2-bit variant (10) + remaining random bits (byte 8)
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  // Format as canonical 8-4-4-4-12 hex string
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(id: string): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

import { describe, it, expect } from 'vitest';
import { generateUuidV7, isValidUuid } from '../ids.js';

describe('UUIDv7 Generator', () => {
  it('generates valid UUID format', () => {
    const id = generateUuidV7();
    expect(isValidUuid(id)).toBe(true);
    // UUID v7 has '7' at the 14th character (version 7)
    expect(id.charAt(14)).toBe('7');
    // Variant must be 8, 9, a, or b (0b10..)
    expect(['8', '9', 'a', 'b']).toContain(id.charAt(19).toLowerCase());
  });

  it('generates chronologically sortable identifiers', async () => {
    const id1 = generateUuidV7();
    // Tiny delay to ensure subsequent timestamp or monotonic sequence
    await new Promise((r) => setTimeout(r, 2));
    const id2 = generateUuidV7();

    expect(id1 < id2).toBe(true);
  });
});

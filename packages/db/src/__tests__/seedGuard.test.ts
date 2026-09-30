import { describe, it, expect } from 'vitest';
import { scanForPlaceholders } from '../seed/seedGuard';

describe('SeedGuard Placeholder Scanner (Section 0.5)', () => {
  it('detects forbidden placeholder markers in simple strings', () => {
    const violations = scanForPlaceholders('__SET_ME__');
    expect(violations.length).toBe(1);
    expect(violations[0]).toContain('__SET_ME__');
  });

  it('detects placeholders in nested configuration objects', () => {
    const config = {
      store: {
        legalName: 'Bansal Foods Delhi',
        gstin: '__SET_ME__',
        contacts: ['9313321535', '__PLACEHOLDER__'],
      },
    };

    const violations = scanForPlaceholders(config);
    expect(violations.length).toBe(2);
    expect(violations[0]).toContain('store.gstin');
    expect(violations[1]).toContain('store.contacts[1]');
  });

  it('passes completely clean production configurations', () => {
    const cleanConfig = {
      store: {
        legalName: 'Bansal Foods Private Limited',
        gstin: '07AAAAA0000A1Z5',
        fssaiNumber: '10020011000123',
        contacts: ['9313321535'],
      },
    };

    const violations = scanForPlaceholders(cleanConfig);
    expect(violations.length).toBe(0);
  });
});

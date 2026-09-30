/**
 * Money utilities for Bansal Foods e-commerce.
 * RULE: All money is represented in integer paise (bigint or number).
 * Floating-point representation for money is strictly forbidden.
 */

export class Money {
  readonly paise: bigint;

  private constructor(paise: bigint) {
    this.paise = paise;
  }

  static fromPaise(paise: bigint | number): Money {
    if (typeof paise === 'number') {
      if (!Number.isInteger(paise)) {
        throw new TypeError(`Money paise value must be an integer, received float: ${paise}`);
      }
      return new Money(BigInt(paise));
    }
    return new Money(paise);
  }

  static fromRupees(rupees: number): Money {
    if (!Number.isFinite(rupees)) {
      throw new TypeError(`Invalid rupee value: ${rupees}`);
    }
    // Convert to paise integer safely
    const paise = Math.round(rupees * 100);
    return new Money(BigInt(paise));
  }

  static zero(): Money {
    return new Money(0n);
  }

  toPaiseBigInt(): bigint {
    return this.paise;
  }

  toPaiseNumber(): number {
    if (
      this.paise > BigInt(Number.MAX_SAFE_INTEGER) ||
      this.paise < BigInt(Number.MIN_SAFE_INTEGER)
    ) {
      throw new RangeError(`Paise value ${this.paise} exceeds JavaScript Number.MAX_SAFE_INTEGER`);
    }
    return Number(this.paise);
  }

  toRupeesNumber(): number {
    return Number(this.paise) / 100;
  }

  add(other: Money): Money {
    return new Money(this.paise + other.paise);
  }

  subtract(other: Money): Money {
    const result = this.paise - other.paise;
    return new Money(result);
  }

  multiply(multiplier: bigint | number): Money {
    if (typeof multiplier === 'number') {
      if (!Number.isInteger(multiplier)) {
        throw new TypeError(`Multiplier must be an integer: ${multiplier}`);
      }
      return new Money(this.paise * BigInt(multiplier));
    }
    return new Money(this.paise * multiplier);
  }

  isZero(): boolean {
    return this.paise === 0n;
  }

  isPositive(): boolean {
    return this.paise > 0n;
  }

  isNegative(): boolean {
    return this.paise < 0n;
  }

  equals(other: Money): boolean {
    return this.paise === other.paise;
  }

  greaterThan(other: Money): boolean {
    return this.paise > other.paise;
  }

  lessThan(other: Money): boolean {
    return this.paise < other.paise;
  }

  /**
   * Format money in Indian Rupee format (en-IN)
   */
  format(): string {
    const rupees = this.toRupeesNumber();
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(rupees);
  }

  /**
   * Compute unit price per 100 grams
   */
  unitPricePer100g(weightGrams: number): Money {
    if (weightGrams <= 0) {
      throw new RangeError(`Weight in grams must be positive, got ${weightGrams}`);
    }
    // Round half up: (pricePaise * 100 + weightGrams / 2) / weightGrams
    const priceNum = this.toPaiseNumber();
    const unitPaise = Math.round((priceNum * 100) / weightGrams);
    return Money.fromPaise(unitPaise);
  }

  /**
   * Largest-remainder allocation for dividing an amount into parts proportional to weights.
   * Guarantees: sum(allocations) === total.
   */
  static allocateProportional(total: Money, ratios: number[]): Money[] {
    if (ratios.length === 0) return [];
    const totalRatio = ratios.reduce((sum, r) => sum + r, 0);
    if (totalRatio <= 0) {
      throw new RangeError('Sum of allocation ratios must be positive');
    }

    const totalPaise = total.toPaiseBigInt();
    const totalRatioBig = BigInt(Math.round(totalRatio));

    const shares: bigint[] = [];
    const remainders: { index: number; remainder: bigint }[] = [];
    let allocatedSum = 0n;

    for (let i = 0; i < ratios.length; i++) {
      const ratio = ratios[i] ?? 0;
      const ratioBig = BigInt(Math.round(ratio));
      const numerator = totalPaise * ratioBig;
      const share = numerator / totalRatioBig;
      const rem = numerator % totalRatioBig;

      shares.push(share);
      allocatedSum += share;
      remainders.push({ index: i, remainder: rem });
    }

    let leftOver = totalPaise - allocatedSum;
    // Sort remainders descending
    remainders.sort((a, b) => (b.remainder > a.remainder ? 1 : b.remainder < a.remainder ? -1 : 0));

    for (let i = 0; i < remainders.length && leftOver > 0n; i++) {
      const idx = remainders[i]?.index ?? 0;
      shares[idx] = (shares[idx] ?? 0n) + 1n;
      leftOver -= 1n;
    }

    return shares.map((s) => Money.fromPaise(s));
  }
}

/**
 * GST Calculation Helper (Section 15.2)
 * All inputs and outputs in integer paise and basis points (bps).
 */
export interface GstBreakup {
  taxableValuePaise: number;
  taxAmountPaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
}

export function calculateGstBreakup(
  netGrossPaise: number,
  taxRateBps: number,
  isInterState: boolean,
): GstBreakup {
  if (netGrossPaise <= 0 || taxRateBps <= 0) {
    return {
      taxableValuePaise: Math.max(0, netGrossPaise),
      taxAmountPaise: 0,
      cgstPaise: 0,
      sgstPaise: 0,
      igstPaise: 0,
    };
  }

  // taxable_value = round_half_up(line_net_gross * 10000 / (10000 + tax_rate_bps))
  const taxableValuePaise = Math.round((netGrossPaise * 10000) / (10000 + taxRateBps));
  const taxAmountPaise = netGrossPaise - taxableValuePaise;

  if (isInterState) {
    return {
      taxableValuePaise,
      taxAmountPaise,
      cgstPaise: 0,
      sgstPaise: 0,
      igstPaise: taxAmountPaise,
    };
  }

  // Intra-state: CGST = floor(tax_amount / 2), SGST = tax_amount - CGST
  const cgstPaise = Math.floor(taxAmountPaise / 2);
  const sgstPaise = taxAmountPaise - cgstPaise;

  return {
    taxableValuePaise,
    taxAmountPaise,
    cgstPaise,
    sgstPaise,
    igstPaise: 0,
  };
}

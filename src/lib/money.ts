/**
 * Money helpers for the order / reporting system.
 *
 * Every stored or calculated amount is an INTEGER number of paise — never a
 * floating-point rupee value — so totals reconcile exactly.
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Rupees (may have up to 2 decimals) → integer paise. */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/** Integer paise → rupees as a number (for display / spreadsheet cells only). */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/** "₹1,23,456.50" — Indian digit grouping, always 2 decimals. */
export function formatPaise(paise: number): string {
  return inrFormatter.format(paise / 100);
}

/**
 * Parse an amount typed by the admin ("99", "99.5", "₹ 1,299.00") into paise.
 * Returns null for anything that is not a non-negative amount with ≤ 2 decimals.
 */
export function parseRupeesInput(input: string | number): number | null {
  const raw = typeof input === "number" ? String(input) : input;
  const cleaned = raw.replace(/[₹,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const paise = Math.round(Number(cleaned) * 100);
  return Number.isSafeInteger(paise) ? paise : null;
}

/**
 * Split `total` paise across `weights` proportionally using the largest-remainder
 * method, so the parts always add up to exactly `total`.
 */
export function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (total <= 0 || sum <= 0) return weights.map(() => 0);

  const products = weights.map((w) => total * w);
  const floors = products.map((p) => Math.floor(p / sum));
  const remainders = products.map((p, i) => p - floors[i] * sum);

  let left = total - floors.reduce((a, b) => a + b, 0);
  const order = remainders
    .map((rem, i) => ({ i, rem }))
    .sort((a, b) => b.rem - a.rem || a.i - b.i);

  for (let k = 0; left > 0; k++, left--) {
    floors[order[k % order.length].i] += 1;
  }
  return floors;
}

/** Sum an array of integers. */
export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

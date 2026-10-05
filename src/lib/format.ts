/** Small formatting utilities. */

/** Whole-rupee prices render without decimals; paise (e.g. discounts) keep up to 2. */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Money amounts (discounts, totals) — always 2 decimals, e.g. ₹19.80. */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Round to paise to avoid floating-point artefacts in discount math. */
export function roundPaise(amount: number): number {
  return Math.round(amount * 100) / 100;
}

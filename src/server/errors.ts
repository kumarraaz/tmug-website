import "server-only";

/** Expected, user-facing failures. Anything else is treated as an unexpected server error. */

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}

/** A request that is well-formed but not allowed by business rules (e.g. refund exceeds amount paid). */
export class BusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessRuleError";
  }
}

/** Something in the cart cannot be bought as requested (sold out, removed, bad coupon…). */
export interface CheckoutIssue {
  variantId?: string;
  code: "unknown_product" | "unavailable" | "stock" | "coupon" | "total";
  message: string;
}

export class CheckoutBlockedError extends Error {
  issues: CheckoutIssue[];
  constructor(issues: CheckoutIssue[]) {
    super(issues[0]?.message ?? "This order cannot be placed.");
    this.name = "CheckoutBlockedError";
    this.issues = issues;
  }
}

/** The total the shopper saw no longer matches the current prices. `quote` carries the fresh numbers. */
export class PriceChangedError extends Error {
  quote: unknown;
  constructor(quote: unknown) {
    super("Prices changed since you last looked. Please review your updated total.");
    this.name = "PriceChangedError";
    this.quote = quote;
  }
}

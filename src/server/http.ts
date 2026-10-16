import "server-only";
import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { DatabaseNotConfiguredError, pgConstraint, pgErrorCode } from "./db";
import { BusinessRuleError, CheckoutBlockedError, ConflictError, NotFoundError, PriceChangedError } from "./errors";
import { GatewayError, PaymentsNotConfiguredError } from "./razorpay";

/** JSON helpers shared by route handlers. */

export function json<T>(data: T, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return json({ error: message, ...extra }, status);
}

export type ParseResult<T> = { ok: true; data: T } | { ok: false; response: NextResponse };

/** Read + validate a JSON body with a zod schema. Never throws. */
export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<ParseResult<T>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { ok: false, response: jsonError("Request body must be valid JSON.", 400) };
  }
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };

  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in fields)) fields[key] = issue.message;
  }
  const first = Object.entries(fields)[0];
  const message = first ? (first[0] === "_" ? first[1] : `${first[0]}: ${first[1]}`) : "Invalid request.";
  return { ok: false, response: jsonError(message, 400, { fields }) };
}

/**
 * Convert any thrown error into a safe JSON response. Expected failures keep
 * their message; unexpected ones are logged server-side and reported generically
 * (no SQL, stack traces or connection details leak to the client).
 */
export function errorResponse(err: unknown) {
  if (err instanceof DatabaseNotConfiguredError) {
    return jsonError("The database is not configured yet. Set DATABASE_URL and redeploy.", 503, { code: "db_not_configured" });
  }
  if (err instanceof PaymentsNotConfiguredError) {
    return jsonError("Online payment is not available yet.", 503, { code: "payments_not_configured" });
  }
  if (err instanceof GatewayError) {
    console.error("[payments] gateway error:", err.message);
    return jsonError("We could not reach the payment gateway. Please try again in a moment.", 502, { code: "gateway_error" });
  }
  if (err instanceof PriceChangedError) return jsonError(err.message, 409, { code: "price_changed", quote: err.quote });
  if (err instanceof CheckoutBlockedError) return jsonError(err.message, 409, { code: "checkout_blocked", issues: err.issues });
  if (err instanceof NotFoundError) return jsonError(err.message, 404);
  if (err instanceof ConflictError) return jsonError(err.message, 409);
  if (err instanceof BusinessRuleError) return jsonError(err.message, 422);

  const code = pgErrorCode(err);
  const constraint = pgConstraint(err);
  if (code === "23505") {
    if (constraint === "product_variants_sku_key") return jsonError("That SKU is already used by another variant.", 409, { fields: { sku: "Already in use" } });
    if (constraint === "products_slug_key") return jsonError("A product with that URL already exists.", 409);
    if (constraint === "orders_invoice_number_key") return jsonError("That invoice number is already used by another order.", 409);
    return jsonError("That value already exists.", 409);
  }
  if (code === "23503") return jsonError("A referenced record does not exist (for example, an unknown category).", 400);
  if (code === "23514") return jsonError("A value is outside the allowed range.", 400);

  console.error("[api] unexpected error:", err instanceof Error ? err.stack ?? err.message : err);
  return jsonError("Something went wrong on the server. Please try again.", 500);
}

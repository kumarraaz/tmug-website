import "server-only";

/**
 * Razorpay REST client + configuration status.
 *
 * Environment variables (all server-side; the secret is never sent to the browser):
 *   RAZORPAY_KEY_ID          – publishable key id (rzp_test_… or rzp_live_…)
 *   RAZORPAY_KEY_SECRET      – API secret, used to create orders and verify payments
 *   RAZORPAY_WEBHOOK_SECRET  – secret configured on the Razorpay webhook (verifies webhook calls)
 *
 * Nothing here is "pretend": without the key id + secret, `isPaymentConfigured()`
 * is false, checkout stays disabled, and the admin shows what is missing.
 */

export class PaymentsNotConfiguredError extends Error {
  constructor() {
    super("The payment gateway is not configured.");
    this.name = "PaymentsNotConfiguredError";
  }
}

export class GatewayError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "GatewayError";
    this.status = status;
  }
}

export interface GatewayStatus {
  provider: "razorpay";
  keyIdSet: boolean;
  keySecretSet: boolean;
  webhookSecretSet: boolean;
  /** Key id + secret present → orders can be created and payments verified. */
  configured: boolean;
  /** Webhook secret present → webhook calls can be verified. */
  webhookConfigured: boolean;
  /** Derived from the key id prefix only; the key itself is never exposed. */
  mode: "live" | "test" | "unknown" | null;
}

export function getGatewayStatus(): GatewayStatus {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  return {
    provider: "razorpay",
    keyIdSet: Boolean(keyId),
    keySecretSet: Boolean(keySecret),
    webhookSecretSet: Boolean(webhookSecret),
    configured: Boolean(keyId && keySecret),
    webhookConfigured: Boolean(webhookSecret),
    mode: keyId ? (keyId.startsWith("rzp_live_") ? "live" : keyId.startsWith("rzp_test_") ? "test" : "unknown") : null,
  };
}

export const isPaymentConfigured = (): boolean => getGatewayStatus().configured;

export function credentials(): { keyId: string; keySecret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  return keyId && keySecret ? { keyId, keySecret } : null;
}

export function webhookSecret(): string | null {
  return process.env.RAZORPAY_WEBHOOK_SECRET?.trim() || null;
}

/** Overridable for local testing against a stub; defaults to Razorpay's production API. */
const apiBase = () => (process.env.RAZORPAY_API_BASE_URL?.trim() || "https://api.razorpay.com/v1").replace(/\/$/, "");

export interface GatewayOrder {
  id: string;
  amount: number;
  amount_paid: number;
  currency: string;
  receipt: string | null;
  status: string;
}

export interface GatewayPayment {
  id: string;
  order_id: string | null;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  method?: string | null;
  captured?: boolean;
  /** unix seconds */
  created_at: number;
  error_code?: string | null;
  error_description?: string | null;
}

export interface GatewayRefund {
  id: string;
  payment_id: string;
  amount: number;
  currency?: string;
  status: "pending" | "processed" | "failed";
  /** unix seconds */
  created_at: number;
  notes?: unknown;
}

async function call<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const creds = credentials();
  if (!creds) throw new PaymentsNotConfiguredError();

  let res: Response;
  try {
    res = await fetch(`${apiBase()}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new GatewayError(`Could not reach the payment gateway (${err instanceof Error ? err.name : "network error"}).`, 504);
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok) {
    const description = (data as { error?: { description?: string } } | null)?.error?.description;
    throw new GatewayError(`Payment gateway error (${res.status})${description ? `: ${description}` : ""}`, res.status);
  }
  return data as T;
}

/** Create the gateway-side order. `amountPaise` is in paise; `receipt` ≤ 40 chars. */
export function createGatewayOrder(input: { amountPaise: number; receipt: string; notes?: Record<string, string> }): Promise<GatewayOrder> {
  return call<GatewayOrder>("POST", "/orders", {
    amount: input.amountPaise,
    currency: "INR",
    receipt: input.receipt,
    notes: input.notes ?? {},
  });
}

export function fetchGatewayPayment(paymentId: string): Promise<GatewayPayment> {
  return call<GatewayPayment>("GET", `/payments/${encodeURIComponent(paymentId)}`);
}

export function captureGatewayPayment(paymentId: string, amountPaise: number): Promise<GatewayPayment> {
  return call<GatewayPayment>("POST", `/payments/${encodeURIComponent(paymentId)}/capture`, { amount: amountPaise, currency: "INR" });
}

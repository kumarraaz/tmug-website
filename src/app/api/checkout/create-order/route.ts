import { checkoutSchema } from "@/lib/checkout-schema";
import { sameOriginViolation } from "@/server/auth";
import { createOrder } from "@/server/checkout";
import { errorResponse, json, jsonError, parseBody } from "@/server/http";
import { clientIp, rateLimit } from "@/server/rate-limit";

/**
 * Start a payment: validates the customer details, re-prices the cart from the database,
 * stores the order as "awaiting payment" and opens a gateway order. The order is only
 * marked paid later, by /api/checkout/verify or the signed webhook.
 */
export async function POST(req: Request) {
  const csrf = sameOriginViolation(req);
  if (csrf) return csrf;
  if (!rateLimit(`create-order:${clientIp(req)}`, 15, 10 * 60_000).ok) {
    return jsonError("Too many checkout attempts. Please wait a few minutes and try again.", 429);
  }

  const parsed = await parseBody(req, checkoutSchema);
  if (!parsed.ok) return parsed.response;
  try {
    const order = await createOrder(parsed.data);
    return json({
      ok: true,
      orderToken: order.publicToken,
      orderNumber: order.orderNumber,
      amountPaise: order.totalPaise,
      gatewayOrderId: order.gatewayOrderId,
      keyId: order.keyId,
      prefill: { name: parsed.data.customer.name, email: parsed.data.customer.email, contact: parsed.data.customer.phone },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

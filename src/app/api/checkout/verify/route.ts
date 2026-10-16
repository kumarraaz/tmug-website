import { z } from "zod";
import { sameOriginViolation } from "@/server/auth";
import { revalidateCatalog } from "@/server/catalog";
import { errorResponse, json, jsonError, parseBody } from "@/server/http";
import { verifyCheckoutPayment } from "@/server/payments";
import { clientIp, rateLimit } from "@/server/rate-limit";

const schema = z.object({
  orderToken: z.string().trim().min(16).max(64),
  razorpay_order_id: z.string().trim().min(1).max(64),
  razorpay_payment_id: z.string().trim().min(1).max(64),
  razorpay_signature: z.string().trim().min(1).max(256),
});

/**
 * Called by the browser after the payment popup reports success. The browser's word is NOT
 * trusted: the signature is verified and the payment is re-fetched from the gateway before
 * the order is marked paid.
 */
export async function POST(req: Request) {
  const csrf = sameOriginViolation(req);
  if (csrf) return csrf;
  if (!rateLimit(`verify:${clientIp(req)}`, 30, 10 * 60_000).ok) return jsonError("Too many requests. Please wait a moment.", 429);

  const parsed = await parseBody(req, schema);
  if (!parsed.ok) return parsed.response;
  const b = parsed.data;
  try {
    const result = await verifyCheckoutPayment({
      publicToken: b.orderToken,
      gatewayOrderId: b.razorpay_order_id,
      paymentId: b.razorpay_payment_id,
      signature: b.razorpay_signature,
    });
    if (result.stockChanged) revalidateCatalog();
    return json({ ok: true, status: result.status, orderNumber: result.orderNumber });
  } catch (err) {
    return errorResponse(err);
  }
}

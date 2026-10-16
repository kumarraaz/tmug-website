import { quoteSchema } from "@/lib/checkout-schema";
import { sameOriginViolation } from "@/server/auth";
import { buildQuote, toClientQuote } from "@/server/checkout";
import { errorResponse, json, jsonError, parseBody } from "@/server/http";
import { clientIp, rateLimit } from "@/server/rate-limit";

/** Re-price a cart on the server (prices, stock, coupon, shipping, GST). Read-only. */
export async function POST(req: Request) {
  const csrf = sameOriginViolation(req);
  if (csrf) return csrf;
  if (!rateLimit(`quote:${clientIp(req)}`, 60, 60_000).ok) return jsonError("Too many requests. Please slow down.", 429);

  const parsed = await parseBody(req, quoteSchema);
  if (!parsed.ok) return parsed.response;
  try {
    return json({ quote: toClientQuote(await buildQuote(parsed.data)) });
  } catch (err) {
    return errorResponse(err);
  }
}

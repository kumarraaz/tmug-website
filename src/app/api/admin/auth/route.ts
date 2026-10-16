import { cookies } from "next/headers";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  checkAdminCredentials,
  createSessionToken,
  isAdmin,
  sameOriginViolation,
  sessionCookieOptions,
} from "@/server/auth";
import { json, jsonError, parseBody } from "@/server/http";
import { clientIp, rateLimit } from "@/server/rate-limit";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("login"), email: z.string().max(200), password: z.string().max(500) }),
  z.object({ action: z.literal("logout") }),
  z.object({ action: z.literal("status") }),
]);

export async function POST(req: Request) {
  const parsed = await parseBody(req, bodySchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  if (body.action === "status") {
    return json({ authed: await isAdmin() });
  }

  const csrf = sameOriginViolation(req);
  if (csrf) return csrf;

  const store = await cookies();

  if (body.action === "logout") {
    store.delete(ADMIN_COOKIE);
    return json({ ok: true, authed: false });
  }

  // login — throttled per IP (best effort on serverless)
  const limited = rateLimit(`admin-login:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!limited.ok) {
    return json({ error: "Too many sign-in attempts. Please try again later." }, 429, {
      "Retry-After": String(limited.retryAfterSeconds),
    });
  }

  const result = checkAdminCredentials(body.email, body.password);
  if (result === "not-configured") {
    return jsonError("Admin sign-in is not configured on the server (set ADMIN_EMAIL and ADMIN_PASSWORD).", 500);
  }
  if (result === "invalid") {
    return jsonError("Incorrect admin email or password.", 401);
  }

  store.set(ADMIN_COOKIE, await createSessionToken(), sessionCookieOptions);
  return json({ ok: true, authed: true });
}

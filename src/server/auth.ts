import "server-only";
import { createHash, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { json, jsonError } from "./http";

/**
 * Admin authentication.
 *
 * Credentials come from the environment (ADMIN_EMAIL / ADMIN_PASSWORD). A
 * successful login sets an HttpOnly cookie holding a SIGNED, EXPIRING token
 * (HS256 JWT). The previous implementation stored the constant string "ok",
 * which anyone could forge by hand — that value is no longer accepted.
 *
 * Signing key: ADMIN_SESSION_SECRET (recommended, ≥ 32 random characters). If
 * unset, a key is derived from the admin credentials with scrypt, so existing
 * deployments keep working; changing the password then signs everyone out.
 */

export const ADMIN_COOKIE = "tmug-admin";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;
const ISSUER = "tmug-admin";

let cachedKey: { fingerprint: string; key: Uint8Array } | null = null;

function sessionKey(): Uint8Array | null {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  const fingerprint = `${explicit ?? ""}|${process.env.ADMIN_EMAIL ?? ""}|${password ?? ""}`;
  if (cachedKey?.fingerprint === fingerprint) return cachedKey.key;

  let key: Uint8Array | null = null;
  if (explicit && explicit.length >= 16) {
    key = new TextEncoder().encode(explicit);
  } else if (password) {
    key = scryptSync(`${process.env.ADMIN_EMAIL ?? ""}\n${password}`, "tmug-admin-session-v1", 32);
  }
  if (key) cachedKey = { fingerprint, key };
  return key;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

const digest = (s: string) => createHash("sha256").update(s).digest();

/** Constant-time credential check. */
export function checkAdminCredentials(email: string, password: string): "ok" | "invalid" | "not-configured" {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword || !sessionKey()) return "not-configured";
  const emailOk = timingSafeEqual(digest(email.trim().toLowerCase()), digest(expectedEmail.trim().toLowerCase()));
  const passOk = timingSafeEqual(digest(password), digest(expectedPassword));
  return emailOk && passOk ? "ok" : "invalid";
}

export async function createSessionToken(): Promise<string> {
  const key = sessionKey();
  if (!key) throw new Error("Admin authentication is not configured.");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const key = sessionKey();
  if (!key) return false;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"], issuer: ISSUER });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

/** Is the current request (via next/headers cookies) an authenticated admin? */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/**
 * Server Components / pages: call at the top of EVERY admin page. Layout-level
 * checks alone are not enough (layouts do not re-render on client navigation).
 */
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** CSRF defence in depth: browsers always send Origin on state-changing requests. */
export function sameOriginViolation(req: Request): Response | null {
  const origin = req.headers.get("origin");
  if (!origin) return jsonError("Missing Origin header.", 403);
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    if (new URL(origin).host !== host) return jsonError("Cross-origin request blocked.", 403);
  } catch {
    return jsonError("Invalid Origin header.", 403);
  }
  return null;
}

/**
 * Route handlers: `const denied = await adminGuard(req); if (denied) return denied;`
 * Enforces authentication on the server for every admin API, plus an
 * Origin check on state-changing methods.
 */
export async function adminGuard(req: Request): Promise<Response | null> {
  if (!(await isAdmin())) return json({ error: "Unauthorized. Please sign in as admin." }, 401);
  if (MUTATING.has(req.method.toUpperCase())) return sameOriginViolation(req);
  return null;
}

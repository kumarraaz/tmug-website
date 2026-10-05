import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { seoStore } from "@/lib/seo-store";
import type { SeoSettings } from "@/types";

const COOKIE = "tmug-admin";
const SESSION_VALUE = "ok";

function isAuthed(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  return cookieStore.get(COOKIE)?.value === SESSION_VALUE;
}

function adminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

/** GET — returns current SEO settings if the admin cookie is present. */
export async function GET() {
  const store = await cookies();
  if (!isAuthed(store)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const settings = await seoStore.get();
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const password = adminPassword();
  if (!password) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on the server. Add it to your environment variables." },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { action: "login"; password: string }
    | { action: "save"; settings: SeoSettings }
    | null;

  if (!body) return NextResponse.json({ error: "bad request" }, { status: 400 });

  if (body.action === "login") {
    if (body.password !== password) {
      return NextResponse.json({ error: "Wrong password." }, { status: 403 });
    }
    const store = await cookies();
    store.set(COOKIE, SESSION_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    const settings = await seoStore.get();
    return NextResponse.json({ ok: true, settings });
  }

  if (body.action === "save") {
    const store = await cookies();
    if (!isAuthed(store)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const result = await seoStore.save(body.settings);
    return NextResponse.json({ ok: true, ...result });
  }

  return NextResponse.json({ error: "bad request" }, { status: 400 });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { siteControlStore } from "@/lib/site-control-store";
import type { SiteControls } from "@/types";

const COOKIE = "tmug-admin";
const SESSION_VALUE = "ok";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === SESSION_VALUE;
}

export async function GET() {
  const authed = await isAuthed();
  const controls = await siteControlStore.get();
  return NextResponse.json({ controls, authed });
}

export async function POST(req: Request) {
  const authed = await isAuthed();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    action: "save";
    controls: SiteControls;
  } | null;

  if (!body || body.action !== "save" || !body.controls) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const result = await siteControlStore.save(body.controls);
  return NextResponse.json({ ok: true, ...result });
}

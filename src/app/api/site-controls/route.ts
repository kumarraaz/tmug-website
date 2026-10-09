import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { siteControlStore } from "@/lib/site-control-store";

const COOKIE = "tmug-admin";
const SESSION_VALUE = "ok";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const previewParam = url.searchParams.get("preview");

  const store = await cookies();
  const isAuthed = store.get(COOKIE)?.value === SESSION_VALUE;

  // Only authenticated admins can view draft controls
  const mode = previewParam === "draft" && isAuthed ? "draft" : "published";
  const controls = await siteControlStore.get(mode);

  return NextResponse.json({
    controls,
    mode,
    ...controls,
  });
}

import { NextResponse } from "next/server";
import { siteControlStore } from "@/lib/site-control-store";

/** Public: the published storefront appearance settings (read-only). */
export async function GET() {
  const controls = await siteControlStore.get();
  return NextResponse.json({ controls, mode: "published", ...controls });
}

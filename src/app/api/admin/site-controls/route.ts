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
  const state = await siteControlStore.getState();
  return NextResponse.json({
    authed,
    controls: state.draft, // Default for admin editor is draft
    published: state.published,
    draft: state.draft,
    history: state.history,
    hasDraftChanges: state.hasDraftChanges,
  });
}

export async function POST(req: Request) {
  const authed = await isAuthed();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    action: "save-draft" | "publish" | "discard-draft" | "reset-defaults" | "rollback" | "save";
    controls?: SiteControls;
    historyId?: string;
  } | null;

  if (!body || !body.action) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  try {
    let result: any;
    switch (body.action) {
      case "save-draft": {
        if (!body.controls) {
          return NextResponse.json({ error: "Missing controls payload." }, { status: 400 });
        }
        result = await siteControlStore.saveDraft(body.controls);
        break;
      }

      case "publish": {
        result = await siteControlStore.publish(body.controls);
        break;
      }

      case "discard-draft": {
        result = await siteControlStore.discardDraft();
        break;
      }

      case "reset-defaults": {
        result = await siteControlStore.resetDefaults();
        break;
      }

      case "rollback": {
        const histId = body.historyId || (body as any).snapshotId;
        if (!histId) {
          return NextResponse.json({ error: "Missing historyId for rollback." }, { status: 400 });
        }
        result = await siteControlStore.rollback(histId);
        break;
      }

      case "save": {
        // Legacy backward compatibility
        if (!body.controls) {
          return NextResponse.json({ error: "Missing controls payload." }, { status: 400 });
        }
        result = await siteControlStore.publish(body.controls);
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${(body as any).action}` }, { status: 400 });
    }

    const state = await siteControlStore.getState();
    return NextResponse.json({
      ok: true,
      action: body.action,
      ...result,
      published: state.published,
      draft: state.draft,
      history: state.history,
      hasDraftChanges: state.hasDraftChanges,
      controls: state.draft,
    });
  } catch (error) {
    console.error("Site controls API error:", error);
    return NextResponse.json(
      { error: "Server error handling site controls action." },
      { status: 500 }
    );
  }
}

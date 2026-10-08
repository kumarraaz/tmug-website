import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE = "tmug-admin";
const SESSION_VALUE = "ok";

function getExpectedPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "tmug-admin-preview" : undefined);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { action: "login"; password?: string }
    | { action: "logout" }
    | { action: "status" }
    | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const store = await cookies();

  if (body.action === "status") {
    const isAuthed = store.get(COOKIE)?.value === SESSION_VALUE;
    return NextResponse.json({ authed: isAuthed });
  }

  if (body.action === "logout") {
    store.delete(COOKIE);
    return NextResponse.json({ ok: true, authed: false });
  }

  if (body.action === "login") {
    const expected = getExpectedPassword();
    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured in server environment." },
        { status: 500 }
      );
    }

    if (!body.password || body.password !== expected) {
      return NextResponse.json({ error: "Incorrect admin password." }, { status: 401 });
    }

    store.set(COOKIE, SESSION_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return NextResponse.json({ ok: true, authed: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

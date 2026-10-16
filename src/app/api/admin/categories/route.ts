import { z } from "zod";
import { adminGuard } from "@/server/auth";
import { errorResponse, json, parseBody } from "@/server/http";
import { createCategory, listCategories } from "@/server/products-admin";

export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    return json({ categories: await listCategories() });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const parsed = await parseBody(req, z.object({ name: z.string().trim().min(2).max(60) }));
  if (!parsed.ok) return parsed.response;

  try {
    return json({ ok: true, category: await createCategory(parsed.data.name) }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}

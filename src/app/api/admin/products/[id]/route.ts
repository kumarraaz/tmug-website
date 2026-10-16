import type { NextRequest } from "next/server";
import { adminGuard } from "@/server/auth";
import { revalidateCatalog } from "@/server/catalog";
import { errorResponse, json, jsonError, parseBody } from "@/server/http";
import { productInputSchema } from "@/lib/product-schema";
import { deleteProduct, getProductAdmin, updateProduct } from "@/server/products-admin";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/admin/products/[id]">) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const product = await getProductAdmin(id);
    return product ? json({ product }) : jsonError("Product not found.", 404);
  } catch (err) {
    return errorResponse(err);
  }
}

/** Update a product and its variants. The URL slug is never changed. */
export async function PUT(req: NextRequest, ctx: RouteContext<"/api/admin/products/[id]">) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const parsed = await parseBody(req, productInputSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const { id } = await ctx.params;
    const updated = await updateProduct(id, parsed.data);
    if (!updated) return jsonError("Product not found.", 404);
    revalidateCatalog();
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Permanently delete a product (the admin UI asks for confirmation first). Order history is preserved. */
export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/admin/products/[id]">) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    const { id } = await ctx.params;
    const removed = await deleteProduct(id);
    if (!removed) return jsonError("Product not found.", 404);
    revalidateCatalog();
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}

import { adminGuard } from "@/server/auth";
import { revalidateCatalog } from "@/server/catalog";
import { errorResponse, json, parseBody } from "@/server/http";
import { productInputSchema } from "@/lib/product-schema";
import { createProduct } from "@/server/products-admin";
import { ConflictError } from "@/server/errors";

/** Create a product (with its variants). */
export async function POST(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const parsed = await parseBody(req, productInputSchema);
  if (!parsed.ok) return parsed.response;
  if (!parsed.data.slug) {
    return errorResponse(new ConflictError("A URL slug is required when creating a product."));
  }

  try {
    const created = await createProduct(parsed.data);
    revalidateCatalog();
    return json({ ok: true, ...created }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}

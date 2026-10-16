import { notFound } from "next/navigation";
import { toFormState } from "@/lib/product-form";
import { requireAdminPage } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import { getProductAdmin, listCategories } from "@/server/products-admin";
import { ProductForm } from "../../../_components/ProductForm";
import { DatabaseNotConfigured, Notice, PageHeader } from "../../../_components/ui";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdminPage();
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Edit product" />
        <DatabaseNotConfigured />
      </>
    );
  }
  const { id } = await params;
  const sp = await searchParams;
  const [product, categories] = await Promise.all([getProductAdmin(id), listCategories()]);
  if (!product) notFound();

  return (
    <>
      <PageHeader title={product.name} subtitle={`Product ID: ${product.id} · Last updated ${product.updatedAt.toISOString().slice(0, 10)}`} />
      {sp.created && (
        <div className="mb-4">
          <Notice tone="good">Product created. It is {product.active ? "now live on the store" : "saved as inactive and hidden from the store"}.</Notice>
        </div>
      )}
      <ProductForm mode="edit" productId={product.id} initial={toFormState(product)} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} liveSlug={product.slug} />
    </>
  );
}

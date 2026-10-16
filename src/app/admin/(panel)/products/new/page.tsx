import { emptyForm } from "@/lib/product-form";
import { requireAdminPage } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import { listCategories } from "@/server/products-admin";
import { ProductForm } from "../../../_components/ProductForm";
import { DatabaseNotConfigured, PageHeader } from "../../../_components/ui";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdminPage();
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Add product" />
        <DatabaseNotConfigured />
      </>
    );
  }
  const categories = await listCategories();
  return (
    <>
      <PageHeader title="Add product" subtitle="Fill in the details, add at least one variant with a price and image, then create it." />
      <ProductForm mode="create" initial={emptyForm(categories[0]?.slug ?? "")} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
    </>
  );
}

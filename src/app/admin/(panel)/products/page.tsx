import Image from "next/image";
import Link from "next/link";
import { formatPaise } from "@/lib/money";
import { requireAdminPage } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import { listCategories, listProductsAdmin } from "@/server/products-admin";
import { getSettings } from "@/server/settings";
import { CategoryManager } from "../../_components/CategoryManager";
import { DeleteProductButton } from "../../_components/DeleteProductButton";
import { Badge, Card, DatabaseNotConfigured, EmptyState, PageHeader, btnPrimary, btnSecondary, inputClass, tableClass, tdClass, thClass } from "../../_components/ui";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdminPage();
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Products" />
        <DatabaseNotConfigured />
      </>
    );
  }

  const sp = await searchParams;
  const status = sp.status === "active" || sp.status === "inactive" ? sp.status : "all";
  const settings = await getSettings();
  const [rows, categories] = await Promise.all([
    listProductsAdmin({ search: sp.q, category: sp.category, status, lowStockThreshold: settings.lowStockThreshold }),
    listCategories(),
  ]);
  const filtered = Boolean(sp.q || sp.category || status !== "all");

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Add and edit teas, prices, stock and images. Changes appear on the store within seconds."
        actions={
          <Link href="/admin/products/new" className={btnPrimary}>
            + Add product
          </Link>
        }
      />

      <form method="get" className="mb-4 flex flex-wrap items-end gap-2">
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Search name, URL or SKU" aria-label="Search products" className={`${inputClass} max-w-xs`} />
        <select name="category" defaultValue={sp.category ?? ""} aria-label="Category" className={`${inputClass} max-w-[14rem]`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} aria-label="Status" className={`${inputClass} max-w-[10rem]`}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit" className={btnSecondary}>
          Filter
        </button>
        {filtered && (
          <Link href="/admin/products" className="text-xs font-bold text-charcoal/60 underline">
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <EmptyState title={filtered ? "No products match these filters" : "No products yet"}>
          {filtered ? "Try clearing the filters." : "Add your first product to put it on the store."}
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-white shadow-xs">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Product</th>
                <th className={thClass}>Category</th>
                <th className={thClass}>Price</th>
                <th className={thClass}>Variants</th>
                <th className={thClass}>Stock</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-warm-ivory/60">
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-warm-surface">
                        {p.thumb && <Image src={p.thumb} alt="" fill sizes="48px" className="object-contain p-1" />}
                      </span>
                      <div className="min-w-0">
                        <Link href={`/admin/products/${p.id}`} className="font-extrabold text-deep-plum hover:underline">
                          {p.name}
                        </Link>
                        <p className="truncate text-xs text-charcoal/55">/products/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className={tdClass}>{p.categoryName}</td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {p.minPricePaise === p.maxPricePaise ? formatPaise(p.minPricePaise) : `${formatPaise(p.minPricePaise)} – ${formatPaise(p.maxPricePaise)}`}
                  </td>
                  <td className={tdClass}>{p.variantCount}</td>
                  <td className={tdClass}>
                    {p.trackedVariants === 0 ? (
                      <span className="text-xs text-charcoal/55">Not tracked</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {p.totalStock} units
                        {p.lowStockVariants > 0 && <Badge tone="warn">{p.lowStockVariants} low</Badge>}
                      </span>
                    )}
                  </td>
                  <td className={tdClass}>
                    <Badge tone={p.active ? "good" : "neutral"}>{p.active ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap text-right`}>
                    <Link href={`/admin/products/${p.id}`} className="rounded-full px-3 py-1 text-xs font-extrabold text-deep-plum hover:bg-warm-surface">
                      Edit
                    </Link>
                    {p.active && (
                      <Link href={`/products/${p.slug}`} target="_blank" className="rounded-full px-3 py-1 text-xs font-bold text-charcoal/60 hover:bg-warm-surface">
                        View ↗
                      </Link>
                    )}
                    <DeleteProductButton id={p.id} name={p.name} compact />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Card className="mt-6" title="Categories" subtitle="Used to group products on the store.">
        <CategoryManager categories={categories} />
      </Card>
    </>
  );
}

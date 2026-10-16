"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  emptyVariant,
  suggestSku,
  toPayload,
  validateForm,
  type ImageForm,
  type ProductFormState,
  type VariantForm,
} from "@/lib/product-form";
import { slugify } from "@/lib/slug";
import { DeleteProductButton } from "./DeleteProductButton";
import { Badge, Card, Field, Notice, btnPrimary, btnSecondary, inputClass } from "./ui";

interface Props {
  mode: "create" | "edit";
  productId?: string;
  initial: ProductFormState;
  categories: { slug: string; name: string }[];
  /** Only set when editing: lets the admin jump to the live page. */
  liveSlug?: string;
}

const PACKS = ["jar", "pouch", "box", "sachet", "tin"];

export function ProductForm({ mode, productId, initial, categories: initialCategories, liveSlug }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(initial);
  const [categories, setCategories] = useState(initialCategories);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ tone: "good" | "bad"; text: string } | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const set = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setVariant = (index: number, patch: Partial<VariantForm>) =>
    setForm((f) => ({ ...f, variants: f.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)) }));

  async function addCategory() {
    setAddingCategory(true);
    try {
      const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCategory }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setErrors((e) => ({ ...e, category: data.error ?? "Could not add the category" }));
      else {
        setCategories((c) => [...c, data.category]);
        set("category", data.category.slug);
        setNewCategory("");
        setErrors((e) => {
          const { category: _removed, ...rest } = e;
          void _removed;
          return rest;
        });
      }
    } catch {
      setErrors((e) => ({ ...e, category: "Network error" }));
    }
    setAddingCategory(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);
    const problems = validateForm(form, mode);
    if (Object.keys(problems).length > 0) {
      setErrors(problems);
      setBanner({ tone: "bad", text: "Please fix the highlighted fields." });
      document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch(mode === "create" ? "/api/admin/products" : `/api/admin/products/${encodeURIComponent(productId ?? "")}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(form, mode)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors((data.fields as Record<string, string> | undefined) ?? {});
        setBanner({ tone: "bad", text: data.error ?? "Could not save the product." });
        setSaving(false);
        return;
      }
      if (mode === "create") {
        router.push(`/admin/products/${data.id}?created=1`);
      } else {
        setBanner({ tone: "good", text: "Saved. The store will show these changes within a few seconds." });
        router.refresh();
      }
    } catch {
      setBanner({ tone: "bad", text: "Network error. Please try again." });
    }
    setSaving(false);
  }

  const err = (key: string) => errors[key];

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {banner && (
        <div className="sticky top-2 z-20">
          <Notice tone={banner.tone === "good" ? "good" : "bad"}>{banner.text}</Notice>
        </div>
      )}

      <Card title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Product name" htmlFor="name" error={err("name")}>
            <input
              id="name"
              className={inputClass}
              value={form.name}
              maxLength={120}
              data-field-error={err("name") ? "" : undefined}
              onChange={(e) => {
                set("name", e.target.value);
                if (mode === "create" && !slugTouched) set("slug", slugify(e.target.value));
              }}
            />
          </Field>
          <Field
            label="Page URL"
            htmlFor="slug"
            error={err("slug")}
            hint={mode === "create" ? "Becomes the product page address. It cannot be changed later, so existing links never break." : "Fixed after creation so existing links keep working."}
          >
            <div className="flex items-center">
              <span className="rounded-l-xl border border-r-0 border-charcoal/20 bg-charcoal/5 px-3 py-2 text-sm text-charcoal/60">/products/</span>
              <input
                id="slug"
                className={`${inputClass} rounded-l-none`}
                value={form.slug}
                disabled={mode === "edit"}
                data-field-error={err("slug") ? "" : undefined}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value.toLowerCase());
                }}
              />
            </div>
          </Field>
          <Field label="Tagline" htmlFor="tagline" hint="One short line shown under the name.">
            <input id="tagline" className={inputClass} value={form.tagline} maxLength={160} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Category" htmlFor="category" error={err("category")}>
            <select id="category" className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)} data-field-error={err("category") ? "" : undefined}>
              <option value="" disabled>
                Choose…
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="mt-2 flex gap-2">
              <input aria-label="New category name" placeholder="Or create a new category" className={inputClass} value={newCategory} maxLength={60} onChange={(e) => setNewCategory(e.target.value)} />
              <button type="button" className={btnSecondary} disabled={addingCategory || newCategory.trim().length < 2} onClick={addCategory}>
                {addingCategory ? "Adding…" : "Add"}
              </button>
            </div>
          </Field>
          <div className="md:col-span-2">
            <Field label="Description" htmlFor="description">
              <textarea id="description" rows={4} className={inputClass} value={form.description} maxLength={4000} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </div>
          <Field label="Tasting notes" htmlFor="profile" hint="e.g. Earthy · Floral · Turns citrus-bright with lemon">
            <input id="profile" className={inputClass} value={form.profile} maxLength={300} onChange={(e) => set("profile", e.target.value)} />
          </Field>
          <Field label="Ingredients" htmlFor="ingredients">
            <input id="ingredients" className={inputClass} value={form.ingredients} maxLength={1000} onChange={(e) => set("ingredients", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="How to brew" htmlFor="brew">
              <textarea id="brew" rows={3} className={inputClass} value={form.brewGuide} maxLength={2000} onChange={(e) => set("brewGuide", e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <Card title="Visibility & display">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-start gap-3 rounded-xl border border-charcoal/15 p-3">
            <input type="checkbox" className="mt-1 h-4 w-4" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
            <span>
              <span className="block text-sm font-extrabold text-deep-plum">Active (visible on the store)</span>
              <span className="block text-xs text-charcoal/60">Untick to hide the product and its page without deleting it. Past orders are unaffected.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-charcoal/15 p-3">
            <input type="checkbox" className="mt-1 h-4 w-4" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
            <span>
              <span className="block text-sm font-extrabold text-deep-plum">Bestseller badge</span>
              <span className="block text-xs text-charcoal/60">Shows the “Bestseller” label and lists it under Bestsellers.</span>
            </span>
          </label>
          <Field label="Display order" htmlFor="sortOrder" hint="Lower numbers appear first." error={err("sortOrder")}>
            <input id="sortOrder" inputMode="numeric" className={inputClass} value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Accent colour" htmlFor="accent">
              <input id="accent" type="color" className="h-10 w-full cursor-pointer rounded-xl border border-charcoal/20 bg-white p-1" value={form.accent} onChange={(e) => set("accent", e.target.value)} />
            </Field>
            <Field label="Soft background" htmlFor="accentSoft">
              <input id="accentSoft" type="color" className="h-10 w-full cursor-pointer rounded-xl border border-charcoal/20 bg-white p-1" value={form.accentSoft} onChange={(e) => set("accentSoft", e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <Card title="Tax (GST)" subtitle="Used only when GST is switched on in Settings. Leave blank if you have not confirmed the rate — nothing is assumed.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="GST rate (%)" htmlFor="gst" error={err("gstRatePercent")} hint="e.g. 5. Confirm the correct rate and HSN with your accountant.">
            <input id="gst" inputMode="decimal" className={inputClass} value={form.gstRate} placeholder="Not set" onChange={(e) => set("gstRate", e.target.value)} />
          </Field>
          <Field label="HSN code" htmlFor="hsn" error={err("hsnCode")} hint="4, 6 or 8 digits.">
            <input id="hsn" inputMode="numeric" className={inputClass} value={form.hsnCode} placeholder="Not set" maxLength={8} onChange={(e) => set("hsnCode", e.target.value.replace(/\D/g, ""))} />
          </Field>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-black text-deep-plum">Variants (pack sizes)</h2>
          <button type="button" className={btnSecondary} onClick={() => setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }))}>
            + Add variant
          </button>
        </div>
        {err("variants") && (
          <p role="alert" data-field-error className="text-sm font-bold text-berry">
            {err("variants")}
          </p>
        )}

        {form.variants.map((v, i) => (
          <VariantCard
            key={v.key}
            index={i}
            variant={v}
            productName={form.name}
            canRemove={form.variants.length > 1}
            errors={errors}
            onChange={(patch) => setVariant(i, patch)}
            onRemove={() => setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))}
          />
        ))}
      </div>

      <details className="rounded-2xl border border-charcoal/10 bg-white p-4">
        <summary className="cursor-pointer font-display text-base font-extrabold text-deep-plum">Search listing (SEO) — optional</summary>
        <div className="mt-3 grid gap-4">
          <Field label="Page title" htmlFor="seoTitle" hint="Leave blank to use “Product name | TMUG”.">
            <input id="seoTitle" className={inputClass} value={form.seoTitle} maxLength={160} onChange={(e) => set("seoTitle", e.target.value)} />
          </Field>
          <Field label="Meta description" htmlFor="meta" hint="Leave blank to use the start of the description.">
            <textarea id="meta" rows={2} className={inputClass} value={form.metaDescription} maxLength={320} onChange={(e) => set("metaDescription", e.target.value)} />
          </Field>
        </div>
      </details>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/10 bg-warm-ivory/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-2">
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
          </button>
          <Link href="/admin/products" className={btnSecondary}>
            Back to products
          </Link>
          {mode === "edit" && liveSlug && form.active && (
            <Link href={`/products/${liveSlug}`} target="_blank" className="text-sm font-bold text-charcoal/70 underline">
              View on store ↗
            </Link>
          )}
        </div>
        {mode === "edit" && productId && <DeleteProductButton id={productId} name={form.name || "this product"} redirectTo="/admin/products" />}
      </div>
    </form>
  );
}

function VariantCard({
  index,
  variant: v,
  productName,
  canRemove,
  errors,
  onChange,
  onRemove,
}: {
  index: number;
  variant: VariantForm;
  productName: string;
  canRemove: boolean;
  errors: Record<string, string>;
  onChange: (patch: Partial<VariantForm>) => void;
  onRemove: () => void;
}) {
  const e = (field: string) => errors[`variants.${index}.${field}`];
  const marker = (field: string) => (e(field) ? { "data-field-error": "" } : {});
  const stockNumber = v.stock.trim() === "" ? null : Number(v.stock);

  return (
    <section className="rounded-2xl border border-charcoal/10 bg-white p-4 shadow-xs sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-extrabold text-deep-plum">Variant {index + 1}</h3>
          {v.id ? <Badge tone="neutral">Saved</Badge> : <Badge tone="info">New</Badge>}
          {!v.available && <Badge tone="warn">Unavailable</Badge>}
          {stockNumber === 0 && <Badge tone="bad">Out of stock</Badge>}
        </div>
        {canRemove && (
          <button type="button" className="rounded-full px-3 py-1 text-xs font-extrabold text-berry hover:bg-berry/10 cursor-pointer" onClick={onRemove}>
            Remove variant
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Weight / size" htmlFor={`w${index}`} error={e("weight")}>
          <input
            id={`w${index}`}
            className={inputClass}
            value={v.weight}
            placeholder="e.g. 100g"
            maxLength={30}
            {...marker("weight")}
            onChange={(ev) => onChange({ weight: ev.target.value })}
            onBlur={() => {
              if (!v.sku.trim() && v.weight.trim()) onChange({ sku: suggestSku(productName, v.weight, v.pack) });
            }}
          />
        </Field>
        <Field label="Pack type" htmlFor={`p${index}`} error={e("pack")}>
          <input id={`p${index}`} list="pack-types" className={inputClass} value={v.pack} maxLength={30} {...marker("pack")} onChange={(ev) => onChange({ pack: ev.target.value })} />
          <datalist id="pack-types">
            {PACKS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </Field>
        <Field label="Label shown to customers" htmlFor={`l${index}`} error={e("label")} hint="Blank = weight + pack, e.g. “100g Pouch”.">
          <input id={`l${index}`} className={inputClass} value={v.label} maxLength={60} onChange={(ev) => onChange({ label: ev.target.value })} />
        </Field>
        <Field label="SKU" htmlFor={`s${index}`} error={e("sku")} hint="Unique stock code.">
          <input id={`s${index}`} className={`${inputClass} font-mono`} value={v.sku} maxLength={64} {...marker("sku")} onChange={(ev) => onChange({ sku: ev.target.value.toUpperCase() })} />
        </Field>

        <Field label="Price (₹)" htmlFor={`pr${index}`} error={e("price")}>
          <input id={`pr${index}`} inputMode="decimal" className={inputClass} value={v.price} {...marker("price")} onChange={(ev) => onChange({ price: ev.target.value })} />
        </Field>
        <Field label="Sale price (₹)" htmlFor={`sp${index}`} error={e("salePrice")} hint="Optional. Shown instead of the price, with the price struck through.">
          <input id={`sp${index}`} inputMode="decimal" className={inputClass} value={v.salePrice} placeholder="No sale" {...marker("salePrice")} onChange={(ev) => onChange({ salePrice: ev.target.value })} />
        </Field>
        <Field label="Stock quantity" htmlFor={`st${index}`} error={e("stock")} hint="Leave blank to not track stock.">
          <input id={`st${index}`} inputMode="numeric" className={inputClass} value={v.stock} placeholder="Not tracked" {...marker("stock")} onChange={(ev) => onChange({ stock: ev.target.value })} />
        </Field>
        <label className="flex items-start gap-3 self-end rounded-xl border border-charcoal/15 p-3">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={v.available} onChange={(ev) => onChange({ available: ev.target.checked })} />
          <span>
            <span className="block text-sm font-extrabold text-deep-plum">Available to buy</span>
            <span className="block text-xs text-charcoal/60">Untick to show “Out of stock”.</span>
          </span>
        </label>
      </div>

      <ImageEditor
        label={`Images — variant ${index + 1}`}
        images={v.images}
        error={e("images")}
        defaultAlt={`${productName || "TMUG tea"} ${v.label || `${v.weight} ${v.pack}`}`.trim()}
        onChange={(images) => onChange({ images })}
      />
    </section>
  );
}

function ImageEditor({ label, images, error, defaultAlt, onChange }: { label: string; images: ImageForm[]; error?: string; defaultAlt: string; onChange: (images: ImageForm[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setUploadError("");
    let next = images;
    for (const file of Array.from(files)) {
      if (file.size > 4 * 1024 * 1024) {
        setUploadError(`“${file.name}” is larger than 4 MB.`);
        continue;
      }
      const body = new FormData();
      body.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setUploadError(data.error ?? "Upload failed.");
          continue;
        }
        const kind: ImageForm["kind"] = next.length === 0 ? "front" : next.some((i) => i.kind === "back") ? "fssai" : "back";
        next = [...next, { src: data.url as string, alt: defaultAlt, kind }];
        onChange(next);
      } catch {
        setUploadError("Network error while uploading.");
      }
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="mt-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-extrabold uppercase tracking-wide text-charcoal/70">{label}</p>
        <div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="sr-only" id={`file-${label}`} onChange={(e) => upload(e.target.files)} />
          <button type="button" className={btnSecondary} disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? "Uploading…" : "Upload image"}
          </button>
        </div>
      </div>
      <p className="mb-2 text-xs text-charcoal/55">PNG, JPG or WebP up to 4 MB. The “front” image is the main picture; transparent PNGs look best.</p>
      {error && (
        <p role="alert" data-field-error className="mb-2 text-xs font-bold text-berry">
          {error}
        </p>
      )}
      {uploadError && (
        <p role="alert" className="mb-2 text-xs font-bold text-berry">
          {uploadError}
        </p>
      )}
      {images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-charcoal/25 p-4 text-center text-sm text-charcoal/60">No images yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <li key={`${img.src}-${i}`} className="flex gap-3 rounded-xl border border-charcoal/10 bg-warm-ivory/60 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" className="h-20 w-20 shrink-0 rounded-lg bg-white object-contain" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <input aria-label="Image description (alt text)" className={`${inputClass} !py-1 text-xs`} value={img.alt} maxLength={200} placeholder="Describe the image" onChange={(e) => onChange(images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
                <div className="flex items-center gap-2">
                  <select aria-label="Image type" className={`${inputClass} !py-1 text-xs`} value={img.kind} onChange={(e) => onChange(images.map((x, j) => (j === i ? { ...x, kind: e.target.value as ImageForm["kind"] } : x)))}>
                    <option value="front">Front</option>
                    <option value="back">Back</option>
                    <option value="fssai">FSSAI / label</option>
                  </select>
                  <button type="button" className="shrink-0 rounded-full px-2 py-1 text-xs font-extrabold text-berry hover:bg-berry/10 cursor-pointer" onClick={() => onChange(images.filter((_, j) => j !== i))}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

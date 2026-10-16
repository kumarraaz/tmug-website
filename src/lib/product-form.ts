import type { AdminProduct } from "./admin-types";
import type { ProductInputRaw } from "./product-schema";
import { slugify } from "./slug";

/** Client-side form state for the product editor, and its conversion to / from the API payload. */

export interface ImageForm {
  src: string;
  alt: string;
  kind: "front" | "back" | "fssai";
}

export interface VariantForm {
  /** React key (stable across edits). */
  key: string;
  /** Existing variant id — absent for variants not saved yet. */
  id?: string;
  label: string;
  weight: string;
  pack: string;
  sku: string;
  price: string;
  salePrice: string;
  stock: string;
  available: boolean;
  images: ImageForm[];
}

export interface ProductFormState {
  name: string;
  slug: string;
  tagline: string;
  category: string;
  description: string;
  brewGuide: string;
  ingredients: string;
  profile: string;
  accent: string;
  accentSoft: string;
  featured: boolean;
  active: boolean;
  sortOrder: string;
  seoTitle: string;
  metaDescription: string;
  hsnCode: string;
  gstRate: string;
  variants: VariantForm[];
}

let keyCounter = 0;
export const newKey = () => `v${Date.now().toString(36)}${(keyCounter++).toString(36)}`;

const rupees = (paise: number) => String(paise / 100);

export function emptyVariant(): VariantForm {
  return { key: newKey(), label: "", weight: "", pack: "pouch", sku: "", price: "", salePrice: "", stock: "", available: true, images: [] };
}

export function emptyForm(category: string): ProductFormState {
  return {
    name: "",
    slug: "",
    tagline: "",
    category,
    description: "",
    brewGuide: "",
    ingredients: "",
    profile: "",
    accent: "#D8A62A",
    accentSoft: "#FBEFD2",
    featured: false,
    active: true,
    sortOrder: "0",
    seoTitle: "",
    metaDescription: "",
    hsnCode: "",
    gstRate: "",
    variants: [emptyVariant()],
  };
}

export function toFormState(p: AdminProduct): ProductFormState {
  return {
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    category: p.category,
    description: p.description,
    brewGuide: p.brewGuide,
    ingredients: p.ingredients,
    profile: p.profile,
    accent: p.accent,
    accentSoft: p.accentSoft,
    featured: p.featured,
    active: p.active,
    sortOrder: String(p.sortOrder),
    seoTitle: p.seoTitle,
    metaDescription: p.metaDescription,
    hsnCode: p.hsnCode ?? "",
    gstRate: p.gstRateBp == null ? "" : String(p.gstRateBp / 100),
    variants: p.variants.map((v) => ({
      key: v.id,
      id: v.id,
      label: v.label,
      weight: v.weight,
      pack: v.pack,
      sku: v.sku,
      price: rupees(v.pricePaise),
      salePrice: v.salePricePaise == null ? "" : rupees(v.salePricePaise),
      stock: v.stock == null ? "" : String(v.stock),
      available: v.available,
      images: v.images.map((i) => ({ src: i.src, alt: i.alt, kind: i.kind })),
    })),
  };
}

/** Suggest a SKU like TMUG-BUTTERFLY-PEA-50G-JAR from the product name and pack. */
export function suggestSku(productName: string, weight: string, pack: string): string {
  const parts = [productName, weight, pack].map((s) => slugify(s).toUpperCase()).filter(Boolean);
  return parts.length ? `TMUG-${parts.join("-")}` : "";
}

const isMoney = (s: string) => /^\d+(\.\d{1,2})?$/.test(s.trim());

/** Friendly client-side checks (the server re-validates everything). Keys match the API's field paths. */
export function validateForm(f: ProductFormState, mode: "create" | "edit"): Record<string, string> {
  const e: Record<string, string> = {};
  if (f.name.trim().length < 2) e.name = "Enter the product name";
  if (mode === "create" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.slug.trim())) e.slug = "Use lowercase letters, numbers and hyphens";
  if (!f.category) e.category = "Choose a category";
  if (f.gstRate.trim() !== "" && !(Number(f.gstRate) >= 0 && Number(f.gstRate) <= 40)) e.gstRatePercent = "Enter a rate between 0 and 40";
  if (f.hsnCode.trim() !== "" && !/^\d{4}(\d{2}(\d{2})?)?$/.test(f.hsnCode.trim())) e.hsnCode = "HSN must be 4, 6 or 8 digits";
  if (!/^\d+$/.test(f.sortOrder.trim() || "0")) e.sortOrder = "Whole number";

  f.variants.forEach((v, i) => {
    const k = (field: string) => `variants.${i}.${field}`;
    if (!v.weight.trim()) e[k("weight")] = "Required";
    if (!v.pack.trim()) e[k("pack")] = "Required";
    if (!v.sku.trim()) e[k("sku")] = "SKU is required";
    if (!isMoney(v.price) || Number(v.price) <= 0) e[k("price")] = "Enter a price (max 2 decimals)";
    if (v.salePrice.trim() !== "") {
      if (!isMoney(v.salePrice)) e[k("salePrice")] = "Enter a valid amount";
      else if (isMoney(v.price) && Number(v.salePrice) >= Number(v.price)) e[k("salePrice")] = "Must be lower than the regular price";
    }
    if (v.stock.trim() !== "" && !/^\d+$/.test(v.stock.trim())) e[k("stock")] = "Whole number, or leave blank";
    if (v.images.length === 0) e[k("images")] = "Add at least one image";
  });
  return e;
}

export function toPayload(f: ProductFormState, mode: "create" | "edit"): ProductInputRaw {
  return {
    name: f.name.trim(),
    ...(mode === "create" ? { slug: f.slug.trim() } : {}),
    tagline: f.tagline.trim(),
    category: f.category,
    description: f.description.trim(),
    brewGuide: f.brewGuide.trim(),
    ingredients: f.ingredients.trim(),
    profile: f.profile.trim(),
    accent: f.accent,
    accentSoft: f.accentSoft,
    featured: f.featured,
    seoTitle: f.seoTitle.trim(),
    metaDescription: f.metaDescription.trim(),
    hsnCode: f.hsnCode.trim() || null,
    gstRatePercent: f.gstRate.trim() === "" ? null : Number(f.gstRate),
    active: f.active,
    sortOrder: Number(f.sortOrder.trim() || "0"),
    variants: f.variants.map((v) => ({
      ...(v.id ? { id: v.id } : {}),
      sku: v.sku.trim(),
      label: v.label.trim() || `${v.weight.trim()} ${v.pack.trim().replace(/^./, (c) => c.toUpperCase())}`.trim(),
      weight: v.weight.trim(),
      pack: v.pack.trim(),
      price: Number(v.price),
      salePrice: v.salePrice.trim() === "" ? null : Number(v.salePrice),
      stock: v.stock.trim() === "" ? null : Number(v.stock),
      available: v.available,
      images: v.images.map((i) => ({ src: i.src, alt: i.alt.trim(), kind: i.kind })),
    })),
  };
}

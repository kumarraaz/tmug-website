import { z } from "zod";
import { isValidHsn } from "./india";

/**
 * Validation for product create / update payloads. Shared by the admin API
 * (authoritative) and, as TypeScript types only, by the admin form.
 */

export const IMAGE_KINDS = ["front", "back", "fssai"] as const;

/**
 * Only images the storefront can actually render: files shipped in /public, or
 * Vercel Blob uploads. Anything else (arbitrary hosts, data: URLs, paths with
 * "..") is rejected so a bad value can never break next/image or leak a request.
 */
export function isAllowedImageSrc(src: string): boolean {
  if (typeof src !== "string" || src.length === 0 || src.length > 500) return false;
  if (src.startsWith("/")) {
    return (
      !src.startsWith("//") &&
      !src.includes("..") &&
      !src.includes("\\") &&
      /^\/[A-Za-z0-9_\-./]+\.(png|jpe?g|webp|avif|gif)$/i.test(src)
    );
  }
  try {
    const u = new URL(src);
    return (
      u.protocol === "https:" &&
      /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i.test(u.hostname) &&
      /\.(png|jpe?g|webp)$/i.test(u.pathname)
    );
  } catch {
    return false;
  }
}

const hexColour = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex colour such as #D8A62A");

const twoDecimals = (n: number) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6;

const rupees = z
  .number({ error: "Enter a number" })
  .min(0, "Cannot be negative")
  .max(1_000_000, "Too large")
  .refine(twoDecimals, "At most 2 decimal places");

const imageSchema = z.object({
  src: z.string().refine(isAllowedImageSrc, "Image must be an uploaded file or a file already on the site"),
  alt: z.string().trim().max(200),
  kind: z.enum(IMAGE_KINDS),
});

/** Empty string → null, otherwise a trimmed string. */
const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional()
    .transform((v) => (v == null || v === "" ? null : v));

export const variantInputSchema = z
  .object({
    /** Present when editing an existing variant (IDs never change, carts & orders refer to them). */
    id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,100}$/).optional(),
    sku: z
      .string()
      .trim()
      .min(1, "SKU is required")
      .max(64)
      .regex(/^[A-Za-z0-9][A-Za-z0-9._\-/]*$/, "SKU may only contain letters, numbers and - _ . /")
      .transform((s) => s.toUpperCase()),
    label: z.string().trim().min(1, "Label is required").max(60),
    weight: z.string().trim().min(1, "Weight / pack size is required").max(30),
    pack: z
      .string()
      .trim()
      .min(1, "Pack type is required")
      .max(30)
      .transform((s) => s.toLowerCase()),
    price: rupees.refine((n) => n > 0, "Price must be greater than 0"),
    salePrice: rupees.nullable(),
    /** null = stock is not tracked (always available while "available" is on). */
    stock: z.number().int("Whole number").min(0).max(1_000_000).nullable(),
    available: z.boolean(),
    images: z.array(imageSchema).min(1, "Add at least one image").max(8),
  })
  .superRefine((v, ctx) => {
    if (v.salePrice != null && v.salePrice >= v.price) {
      ctx.addIssue({ code: "custom", path: ["salePrice"], message: "Sale price must be lower than the regular price" });
    }
  });

export const productInputSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required").max(120),
    /** Required when creating; ignored on update (URLs never change after creation). */
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens")
      .optional(),
    tagline: z.string().trim().max(160).default(""),
    category: z.string().trim().min(1, "Choose a category").max(60),
    description: z.string().trim().max(4000).default(""),
    brewGuide: z.string().trim().max(2000).default(""),
    ingredients: z.string().trim().max(1000).default(""),
    profile: z.string().trim().max(300).default(""),
    accent: hexColour.default("#D8A62A"),
    accentSoft: hexColour.default("#FBEFD2"),
    featured: z.boolean().default(false),
    seoTitle: z.string().trim().max(160).default(""),
    metaDescription: z.string().trim().max(320).default(""),
    hsnCode: nullableText(8).refine((v) => v === null || isValidHsn(v), "HSN must be 4, 6 or 8 digits"),
    /** GST rate in percent (e.g. 5). null = not configured; no tax is assumed. */
    gstRatePercent: z
      .number()
      .min(0)
      .max(40)
      .refine(twoDecimals, "At most 2 decimal places")
      .nullable()
      .optional()
      .transform((v) => v ?? null),
    active: z.boolean(),
    sortOrder: z.number().int().min(0).max(100000).default(0),
    variants: z.array(variantInputSchema).min(1, "Add at least one variant").max(12),
  })
  .superRefine((p, ctx) => {
    const skus = new Set<string>();
    p.variants.forEach((v, i) => {
      if (skus.has(v.sku)) ctx.addIssue({ code: "custom", path: ["variants", i, "sku"], message: "Duplicate SKU in this product" });
      skus.add(v.sku);
    });
  });

export type ProductInput = z.infer<typeof productInputSchema>;
export type VariantInput = z.infer<typeof variantInputSchema>;
export type ProductInputRaw = z.input<typeof productInputSchema>;

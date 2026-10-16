import "server-only";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { INDIAN_STATE_NAMES, findState, isValidGstinFormat } from "@/lib/india";
import { query, queryOne } from "./db";
import type { TaxSettings } from "@/lib/tax";

/**
 * Essential store settings, stored as one JSON document (key "store").
 * Contains NO secrets — payment credentials live only in environment variables.
 */

export const storeSettingsSchema = z
  .object({
    storeName: z.string().trim().min(1, "Store name is required").max(80),
    legalName: z.string().trim().max(120).default(""),
    email: z.string().trim().max(120).refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address").default(""),
    phone: z.string().trim().max(30).default(""),
    address: z.string().trim().max(400).default(""),
    gst: z
      .object({
        enabled: z.boolean(),
        /** Entered by the admin as-is; only the FORMAT is checked, it is not verified with the GST portal. */
        gstin: z.string().trim().toUpperCase().max(15).default(""),
        businessState: z.string().trim().max(60).default(""),
        pricesIncludeGst: z.boolean(),
      })
      .default({ enabled: false, gstin: "", businessState: "", pricesIncludeGst: true }),
    shipping: z
      .object({
        /** Flat shipping charge in rupees (0 = free shipping). */
        flatFee: z.number().min(0).max(100000).refine((n) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6, "At most 2 decimals"),
        /** Orders at or above this value (after discount) ship free. null = no free-shipping threshold. */
        freeAbove: z.number().min(0).max(10000000).nullable(),
      })
      .default({ flatFee: 0, freeAbove: null }),
    lowStockThreshold: z.number().int().min(0).max(10000).default(5),
  })
  .superRefine((s, ctx) => {
    if (s.gst.gstin && !isValidGstinFormat(s.gst.gstin)) {
      ctx.addIssue({ code: "custom", path: ["gst", "gstin"], message: "GSTIN must be 15 characters in the standard format (e.g. 27AAPFU0939F1ZV)" });
    }
    if (s.gst.businessState && !INDIAN_STATE_NAMES.includes(s.gst.businessState)) {
      ctx.addIssue({ code: "custom", path: ["gst", "businessState"], message: "Choose a state from the list" });
    }
    if (s.gst.enabled && !s.gst.businessState) {
      ctx.addIssue({ code: "custom", path: ["gst", "businessState"], message: "Business state is required to apply GST (it decides CGST+SGST vs IGST)" });
    }
  });

export type StoreSettings = z.infer<typeof storeSettingsSchema>;

export function defaultSettings(): StoreSettings {
  return {
    storeName: siteConfig.name,
    legalName: "",
    email: siteConfig.email,
    phone: siteConfig.whatsapp.display,
    address: "",
    gst: { enabled: false, gstin: "", businessState: "", pricesIncludeGst: true },
    shipping: { flatFee: 0, freeAbove: null },
    lowStockThreshold: 5,
  };
}

/** Saved settings merged over the defaults (so newly added fields always have a value). */
export async function getSettings(): Promise<StoreSettings> {
  const row = await queryOne<{ value: unknown }>("SELECT value FROM store_settings WHERE key = 'store'");
  const base = defaultSettings();
  if (!row || typeof row.value !== "object" || row.value === null) return base;
  const saved = row.value as Partial<StoreSettings>;
  const parsed = storeSettingsSchema.safeParse({
    ...base,
    ...saved,
    gst: { ...base.gst, ...(saved.gst ?? {}) },
    shipping: { ...base.shipping, ...(saved.shipping ?? {}) },
  });
  return parsed.success ? parsed.data : base;
}

export async function saveSettings(settings: StoreSettings): Promise<void> {
  await query(
    `INSERT INTO store_settings (key, value, updated_at) VALUES ('store', $1::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [JSON.stringify(settings)],
  );
}

export function taxSettingsOf(s: StoreSettings): TaxSettings {
  return {
    gstEnabled: s.gst.enabled,
    pricesIncludeGst: s.gst.pricesIncludeGst,
    sellerState: s.gst.businessState ? (findState(s.gst.businessState)?.name ?? s.gst.businessState) : null,
  };
}

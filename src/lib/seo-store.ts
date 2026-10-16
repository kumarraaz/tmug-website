/**
 * SEO settings for the homepage metadata (read-only).
 *
 * Defaults live in src/config/seo.ts. An optional override file (data/seo-overrides.json)
 * is still honoured when present, so previously saved values keep working; the admin
 * screen that edited it has been removed.
 */
import { promises as fs } from "fs";
import path from "path";
import type { SeoSettings } from "@/types";
import { defaultSeoSettings } from "@/config/seo";

const OVERRIDES_PATH = path.join(process.cwd(), "data", "seo-overrides.json");

function sanitize(input: Partial<SeoSettings>): SeoSettings {
  const d = defaultSeoSettings;
  const pick = (v: unknown, fallback: string) => (typeof v === "string" && v.trim().length > 0 ? v : fallback);
  return {
    pageTitle: pick(input.pageTitle, d.pageTitle),
    metaTitle: pick(input.metaTitle, d.metaTitle),
    metaDescription: pick(input.metaDescription, d.metaDescription),
    canonicalUrl: pick(input.canonicalUrl, d.canonicalUrl),
    robotsIndex: typeof input.robotsIndex === "boolean" ? input.robotsIndex : d.robotsIndex,
    robotsFollow: typeof input.robotsFollow === "boolean" ? input.robotsFollow : d.robotsFollow,
    h1: pick(input.h1, d.h1),
    ogTitle: pick(input.ogTitle, d.ogTitle),
    ogDescription: pick(input.ogDescription, d.ogDescription),
    ogImage: pick(input.ogImage, d.ogImage),
    topics: pick(input.topics, d.topics),
  };
}

export const seoStore = {
  async get(): Promise<SeoSettings> {
    try {
      const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
      return sanitize({ ...defaultSeoSettings, ...JSON.parse(raw) });
    } catch {
      return { ...defaultSeoSettings };
    }
  },
};

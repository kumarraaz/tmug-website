/**
 * SEO settings storage — Phase 1.
 *
 * This module defines a storage *interface* so Phase 2 can swap in a real
 * database/CMS without touching the admin UI or the metadata layer.
 *
 * Phase 1 implementation (`FileSeoStore`):
 *  - reads overrides from `data/seo-overrides.json` (best effort)
 *  - writes overrides to the same file when running somewhere with a
 *    writable filesystem (local dev). On serverless hosts (Vercel) the
 *    filesystem is ephemeral, so writes there will NOT persist — the admin
 *    UI says this explicitly. Phase 2 replaces this class with a DB-backed
 *    one implementing the same interface.
 *
 * We deliberately do NOT use browser localStorage as the "database" for
 * SEO settings: SEO metadata is rendered on the server at build/request
 * time, so client-only storage cannot affect it.
 */
import { promises as fs } from "fs";
import path from "path";
import type { SeoSettings } from "@/types";
import { defaultSeoSettings } from "@/config/seo";

export interface SeoStore {
  get(): Promise<SeoSettings>;
  save(settings: SeoSettings): Promise<{ persisted: boolean; note?: string }>;
}

const OVERRIDES_PATH = path.join(process.cwd(), "data", "seo-overrides.json");

function sanitize(input: Partial<SeoSettings>): SeoSettings {
  const d = defaultSeoSettings;
  const pick = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim().length > 0 ? v : fallback;
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

class FileSeoStore implements SeoStore {
  async get(): Promise<SeoSettings> {
    try {
      const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
      return sanitize({ ...defaultSeoSettings, ...JSON.parse(raw) });
    } catch {
      return { ...defaultSeoSettings };
    }
  }

  async save(settings: SeoSettings): Promise<{ persisted: boolean; note?: string }> {
    const clean = sanitize(settings);
    try {
      await fs.mkdir(path.dirname(OVERRIDES_PATH), { recursive: true });
      await fs.writeFile(OVERRIDES_PATH, JSON.stringify(clean, null, 2), "utf8");
      return { persisted: true };
    } catch {
      // Serverless / read-only filesystem: keep the interface honest.
      return {
        persisted: false,
        note:
          "Could not write to the filesystem here (likely a serverless/production host). " +
          "Settings were validated but not persisted. Connect a database in Phase 2 for production persistence.",
      };
    }
  }
}

export const seoStore: SeoStore = new FileSeoStore();

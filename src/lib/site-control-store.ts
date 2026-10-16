import path from "node:path";
import type { SiteControls, SiteControlsStoreState } from "@/types";
import { readJson, hasBlob } from "@/lib/persist";
import { DEFAULT_SITE_CONTROLS } from "@/config/site-controls";

export { DEFAULT_SITE_CONTROLS };

const DATA_PATH = path.join(process.cwd(), "data", "site-controls.json");

/** Deep merge helper to guarantee every default field exists even if persisted data is partial */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T> | undefined): T {
  if (!source) return JSON.parse(JSON.stringify(target));
  const output = { ...target };
  for (const key of Object.keys(source)) {
    const sVal = (source as any)[key];
    const tVal = (output as any)[key];
    if (sVal === undefined) continue;
    if (sVal !== null && typeof sVal === "object" && !Array.isArray(sVal) && typeof tVal === "object" && !Array.isArray(tVal)) {
      (output as any)[key] = deepMerge(tVal || {}, sVal);
    } else {
      (output as any)[key] = sVal;
    }
  }
  return output;
}

let cachedState: SiteControlsStoreState | null = null;

async function loadFromDisk(): Promise<SiteControlsStoreState> {
  // Blob mode: always read fresh (serverless instances don't share memory)
  if (cachedState && !hasBlob()) return cachedState;

  const parsed = (await readJson(DATA_PATH)) as any;
  if (parsed && parsed.published && parsed.draft) {
    cachedState = {
      published: deepMerge(DEFAULT_SITE_CONTROLS, parsed.published),
      draft: deepMerge(DEFAULT_SITE_CONTROLS, parsed.draft),
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } else if (parsed) {
    const merged = deepMerge(DEFAULT_SITE_CONTROLS, parsed);
    cachedState = { published: merged, draft: JSON.parse(JSON.stringify(merged)), history: [] };
  } else {
    cachedState = {
      published: JSON.parse(JSON.stringify(DEFAULT_SITE_CONTROLS)),
      draft: JSON.parse(JSON.stringify(DEFAULT_SITE_CONTROLS)),
      history: [],
    };
  }
  return cachedState!;
}

export const siteControlStore = {
  /** The published storefront appearance settings (read-only; the visual editor was removed). */
  async get(): Promise<SiteControls> {
    const state = await loadFromDisk();
    return state.published;
  },
};

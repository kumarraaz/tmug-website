import fs from "node:fs/promises";
import path from "node:path";
import type { SiteControls, SiteControlsStoreState, SiteControlsHistoryItem } from "@/types";
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
  if (cachedState) return cachedState;

  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);

    if (parsed.published && parsed.draft) {
      cachedState = {
        published: deepMerge(DEFAULT_SITE_CONTROLS, parsed.published),
        draft: deepMerge(DEFAULT_SITE_CONTROLS, parsed.draft),
        history: Array.isArray(parsed.history) ? parsed.history : [],
      };
    } else {
      // Legacy single SiteControls object
      const merged = deepMerge(DEFAULT_SITE_CONTROLS, parsed);
      cachedState = {
        published: merged,
        draft: JSON.parse(JSON.stringify(merged)),
        history: [],
      };
    }
  } catch {
    cachedState = {
      published: JSON.parse(JSON.stringify(DEFAULT_SITE_CONTROLS)),
      draft: JSON.parse(JSON.stringify(DEFAULT_SITE_CONTROLS)),
      history: [],
    };
  }

  return cachedState!;
}

async function persistToDisk(state: SiteControlsStoreState): Promise<{ persisted: boolean; note?: string }> {
  cachedState = state;
  try {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(state, null, 2), "utf-8");
    return { persisted: true };
  } catch (err) {
    return {
      persisted: false,
      note: `Saved in memory only: ${(err as Error).message}`,
    };
  }
}

export const siteControlStore = {
  /**
   * Get active site controls. Default mode is 'published' for public visitors,
   * or 'draft' for preview and admin controls.
   */
  async get(mode: "published" | "draft" = "published"): Promise<SiteControls> {
    const state = await loadFromDisk();
    return mode === "draft" ? state.draft : state.published;
  },

  /** Get complete state including published, draft, history, and status flags */
  async getState(): Promise<{
    published: SiteControls;
    draft: SiteControls;
    history: SiteControlsHistoryItem[];
    hasDraftChanges: boolean;
  }> {
    const state = await loadFromDisk();
    const hasDraftChanges = JSON.stringify(state.published) !== JSON.stringify(state.draft);
    return {
      published: state.published,
      draft: state.draft,
      history: state.history,
      hasDraftChanges,
    };
  },

  /** Save working changes to draft */
  async saveDraft(controls: SiteControls): Promise<{ persisted: boolean; note?: string }> {
    const state = await loadFromDisk();
    state.draft = deepMerge(DEFAULT_SITE_CONTROLS, controls);
    return persistToDisk(state);
  },

  /** Publish draft (or provided controls) to live site */
  async publish(controls?: SiteControls): Promise<{ persisted: boolean; note?: string }> {
    const state = await loadFromDisk();
    const toPublish = controls ? deepMerge(DEFAULT_SITE_CONTROLS, controls) : state.draft;
    state.published = JSON.parse(JSON.stringify(toPublish));
    state.draft = JSON.parse(JSON.stringify(toPublish));

    const historyItem: SiteControlsHistoryItem = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      label: `Published revision on ${new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      controls: JSON.parse(JSON.stringify(toPublish)),
    };

    state.history = [historyItem, ...(state.history || [])].slice(0, 10); // Keep last 10 snapshots
    return persistToDisk(state);
  },

  /** Discard draft changes and restore to published */
  async discardDraft(): Promise<{ persisted: boolean; note?: string }> {
    const state = await loadFromDisk();
    state.draft = JSON.parse(JSON.stringify(state.published));
    return persistToDisk(state);
  },

  /** Restore default site controls */
  async resetDefaults(): Promise<{ persisted: boolean; note?: string }> {
    const state = await loadFromDisk();
    state.draft = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTROLS));
    return persistToDisk(state);
  },

  /** Rollback to a historical snapshot */
  async rollback(historyId: string): Promise<{ success: boolean; persisted: boolean; note?: string }> {
    const state = await loadFromDisk();
    const found = state.history.find((h) => h.id === historyId);
    if (!found) {
      return { success: false, persisted: false, note: "History revision not found." };
    }
    state.draft = JSON.parse(JSON.stringify(found.controls));
    state.published = JSON.parse(JSON.stringify(found.controls));
    const result = await persistToDisk(state);
    return { success: true, ...result };
  },

  /** Backward-compatible save method used by existing legacy callers */
  async save(controls: SiteControls): Promise<{ persisted: boolean; note?: string }> {
    return this.publish(controls);
  },
};

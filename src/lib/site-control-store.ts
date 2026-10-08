import fs from "node:fs/promises";
import path from "node:path";
import type { SiteControls } from "@/types";
import { DEFAULT_SITE_CONTROLS } from "@/config/site-controls";

export { DEFAULT_SITE_CONTROLS };

const DATA_PATH = path.join(process.cwd(), "data", "site-controls.json");

let cachedControls: SiteControls | null = null;

export const siteControlStore = {
  async get(): Promise<SiteControls> {
    if (cachedControls) return cachedControls;
    try {
      const data = await fs.readFile(DATA_PATH, "utf-8");
      cachedControls = JSON.parse(data) as SiteControls;
      return cachedControls;
    } catch {
      cachedControls = DEFAULT_SITE_CONTROLS;
      return DEFAULT_SITE_CONTROLS;
    }
  },

  async save(controls: SiteControls): Promise<{ persisted: boolean; note?: string }> {
    cachedControls = controls;
    try {
      await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
      await fs.writeFile(DATA_PATH, JSON.stringify(controls, null, 2), "utf-8");
      return { persisted: true };
    } catch (err) {
      return {
        persisted: false,
        note: `Saved in memory only: ${(err as Error).message}`,
      };
    }
  },
};

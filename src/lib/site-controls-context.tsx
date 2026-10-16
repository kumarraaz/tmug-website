"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteControls } from "@/types";
import { DEFAULT_SITE_CONTROLS } from "@/config/site-controls";

interface SiteControlsContextType {
  controls: SiteControls;
  /** Always false: draft previews were part of the removed visual editor. Kept so existing consumers compile. */
  isDraftPreview: boolean;
}

const SiteControlsContext = createContext<SiteControlsContextType>({
  controls: DEFAULT_SITE_CONTROLS,
  isDraftPreview: false,
});

export function SiteControlsProvider({
  children,
  initialControls,
}: {
  children: ReactNode;
  initialControls?: SiteControls;
}) {
  const [controls, setControls] = useState<SiteControls>(initialControls || DEFAULT_SITE_CONTROLS);

  useEffect(() => {
    // The statically generated page may be older than the published settings: pick up the latest once.
    fetch("/api/site-controls")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.controls) setControls(data.controls);
      })
      .catch(() => {
        /* keep the initial controls */
      });
  }, []);

  return <SiteControlsContext.Provider value={{ controls, isDraftPreview: false }}>{children}</SiteControlsContext.Provider>;
}

export function useSiteControls(): SiteControlsContextType {
  return useContext(SiteControlsContext);
}

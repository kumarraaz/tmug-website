"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { SiteControls } from "@/types";
import { DEFAULT_SITE_CONTROLS } from "@/config/site-controls";

interface SiteControlsContextType {
  controls: SiteControls;
  isDraftPreview: boolean;
  setLiveControls?: (controls: SiteControls) => void;
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
  const [controls, setControls] = useState<SiteControls>(
    initialControls || DEFAULT_SITE_CONTROLS
  );
  const [isDraftPreview, setIsDraftPreview] = useState(false);

  useEffect(() => {
    // Check if ?preview=draft is in the URL (used by Admin Live Preview iframe)
    const params = new URLSearchParams(window.location.search);
    const isPreview = params.get("preview") === "draft";
    setIsDraftPreview(isPreview);

    // Fetch site controls from the API
    const url = isPreview ? "/api/site-controls?preview=draft" : "/api/site-controls";
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.controls) {
          setControls(data.controls);
        }
      })
      .catch(() => {
        // Fallback to initialControls or DEFAULT_SITE_CONTROLS
      });

    // Listen for cross-window / iframe postMessage updates from Admin Panel for instantaneous preview
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TMUG_PREVIEW_CONTROLS" && event.data.controls) {
        setControls(event.data.controls);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <SiteControlsContext.Provider
      value={{
        controls,
        isDraftPreview,
        setLiveControls: setControls,
      }}
    >
      {children}
    </SiteControlsContext.Provider>
  );
}

export function useSiteControls(): SiteControlsContextType {
  return useContext(SiteControlsContext);
}

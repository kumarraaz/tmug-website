"use client";

import { useState, useRef, useEffect } from "react";
import type { SiteControls } from "@/types";

interface LivePreviewPaneProps {
  controls: SiteControls;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

export default function LivePreviewPane({ controls }: LivePreviewPaneProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  // Send real-time controls to the preview iframe whenever controls change
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "TMUG_PREVIEW_CONTROLS", controls },
        "*"
      );
    }
  }, [controls]);

  const handleReload = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = "/?preview=draft&t=" + Date.now();
    }
  };

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "w-[390px] h-[844px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      case "desktop":
      default:
        return "w-full h-[820px]";
    }
  };

  return (
    <div className="flex flex-col rounded-3xl border border-charcoal/15 bg-charcoal/5 p-4 shadow-sm">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-charcoal">
            Live Preview
          </span>
          <span className="rounded-full bg-tea-gold px-2 py-0.5 text-[10px] font-black text-charcoal">
            Draft Mode
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 rounded-2xl border border-charcoal/15 bg-white p-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
              device === "desktop"
                ? "bg-charcoal text-white shadow-xs"
                : "text-charcoal/70 hover:text-charcoal"
            }`}
          >
            Desktop (1280px)
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
              device === "tablet"
                ? "bg-charcoal text-white shadow-xs"
                : "text-charcoal/70 hover:text-charcoal"
            }`}
          >
            Tablet (768px)
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
              device === "mobile"
                ? "bg-charcoal text-white shadow-xs"
                : "text-charcoal/70 hover:text-charcoal"
            }`}
          >
            Mobile (390px)
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReload}
            title="Reload preview"
            className="flex items-center gap-1 rounded-xl border border-charcoal/15 bg-white px-2.5 py-1 text-xs font-bold text-charcoal hover:bg-warm-surface cursor-pointer"
          >
            <span>↻ Refresh</span>
          </button>
          <a
            href="/?preview=draft"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-xl bg-charcoal px-3 py-1 text-xs font-bold text-white hover:bg-tea-gold hover:text-charcoal cursor-pointer"
          >
            <span>↗ New Tab</span>
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex flex-1 items-center justify-center overflow-auto rounded-2xl bg-charcoal/10 p-2 sm:p-4">
        <div
          className={`relative overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ${getDeviceWidth()}`}
        >
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-charcoal">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-charcoal border-t-transparent" />
                <span>Loading storefront preview...</span>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="/?preview=draft"
            title="Live Storefront Preview"
            onLoad={() => setLoading(false)}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import { useSiteControls } from "@/lib/site-controls-context";
import { buildSectionCss, REVEAL_KEYFRAMES } from "@/lib/section-css";

/** Wraps a homepage section and applies its admin-controlled style overrides (scoped to this section only). */
export default function SectionStyle({ k, children }: { k: string; children: ReactNode }) {
  const { controls } = useSiteControls();
  const css = buildSectionCss(k, controls?.sectionStyles?.[k]);
  return (
    <div data-tmug-sec={k} className="relative">
      {css && <style dangerouslySetInnerHTML={{ __html: REVEAL_KEYFRAMES + css }} />}
      {children}
    </div>
  );
}

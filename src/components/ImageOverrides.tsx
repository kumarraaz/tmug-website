"use client";

import { useEffect, useRef } from "react";
import { useSiteControls } from "@/lib/site-controls-context";
import { safeUrl } from "@/lib/section-css";

/** Resolve the original source of an <img>, unwrapping next/image's /_next/image?url=… */
function originalOf(src: string): string {
  try {
    const u = new URL(src, window.location.origin);
    if (u.pathname === "/_next/image") return u.searchParams.get("url") || src;
    return u.origin === window.location.origin ? u.pathname : u.href;
  } catch {
    return src;
  }
}

const STYLED = ["object-fit", "object-position", "border-radius", "max-width", "max-height", "display"];

/**
 * Site-wide image replacement. Every <img> is keyed by its original source; if the admin set an override for that
 * key, the real element is swapped (src / mobile src / fit / position / radius / size / hidden). It also reports the
 * images it finds to the admin preview iframe so the Page Builder can list them per section.
 */
export default function ImageOverrides() {
  const { controls, isDraftPreview } = useSiteControls();
  const overrides = controls?.imageOverrides;
  const ref = useRef(overrides);
  ref.current = overrides;

  useEffect(() => {
    let raf = 0;
    const mq = window.matchMedia("(max-width:767px)");

    const apply = () => {
      const map = ref.current || {};
      const found: { section: string; orig: string; alt: string }[] = [];
      document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        const cur = img.getAttribute("src") || "";
        if (!cur || cur.startsWith("data:")) return;
        if (img.dataset.tmugApplied !== cur) {
          img.dataset.tmugOrig = originalOf(img.currentSrc || cur);
          img.dataset.tmugSrc = cur;
          img.dataset.tmugSrcset = img.getAttribute("srcset") || "";
          delete img.dataset.tmugApplied;
        }
        const orig = img.dataset.tmugOrig || "";
        const sec =
          (img.closest("[data-tmug-sec]") as HTMLElement | null)?.dataset.tmugSec ||
          (img.closest("header") ? "header" : img.closest("footer") ? "footer" : "other");
        found.push({ section: sec, orig, alt: img.alt });

        const ov = map[orig];
        if (!ov) {
          if (img.dataset.tmugApplied) {
            img.setAttribute("src", img.dataset.tmugSrc || cur);
            if (img.dataset.tmugSrcset) img.setAttribute("srcset", img.dataset.tmugSrcset);
            delete img.dataset.tmugApplied;
          }
          if (img.dataset.tmugStyled) {
            STYLED.forEach((p) => img.style.removeProperty(p));
            delete img.dataset.tmugStyled;
          }
          return;
        }
        const url = safeUrl((mq.matches && ov.mobileSrc) || ov.src);
        if (url && cur !== url) {
          img.removeAttribute("srcset");
          img.setAttribute("src", url);
          img.dataset.tmugApplied = url;
        }
        if (ov.alt) img.alt = ov.alt;
        const st = (p: string, v: string | undefined) =>
          v ? img.style.setProperty(p, v, "important") : img.style.removeProperty(p);
        st("object-fit", ov.fit);
        st("object-position", /^[a-z0-9%\s-]{1,30}$/.test(ov.position || "") ? ov.position : undefined);
        st("border-radius", ov.radius ? `${Math.min(ov.radius, 300)}px` : undefined);
        st("max-width", ov.maxWidth ? `${Math.min(ov.maxWidth, 3000)}px` : undefined);
        st("max-height", ov.maxHeight ? `${Math.min(ov.maxHeight, 3000)}px` : undefined);
        st("display", ov.hidden ? "none" : undefined);
        img.dataset.tmugStyled = "1";
      });

      if (isDraftPreview && window.parent !== window) {
        window.parent.postMessage({ type: "TMUG_SECTION_IMAGES", images: found }, window.location.origin);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const obs = new MutationObserver(schedule);
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset"],
    });
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "TMUG_REQUEST_IMAGES") schedule();
      if (e.data?.type === "TMUG_SCROLL_TO" && typeof e.data.section === "string") {
        document
          .querySelector(`[data-tmug-sec="${CSS.escape(e.data.section)}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("message", onMsg);
    mq.addEventListener("change", schedule);
    schedule();
    const t = setTimeout(schedule, 1200);
    return () => {
      obs.disconnect();
      window.removeEventListener("message", onMsg);
      mq.removeEventListener("change", schedule);
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [isDraftPreview]);

  // Re-apply whenever the overrides change (live preview edits, publish)
  useEffect(() => {
    window.postMessage({ type: "TMUG_REQUEST_IMAGES" }, window.location.origin);
  }, [overrides]);

  return null;
}

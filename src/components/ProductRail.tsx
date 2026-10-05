"use client";

import { useRef } from "react";
import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import Reveal from "./motion/Reveal";

/**
 * Horizontal product rail: scroll-snap, arrow controls, swipe on mobile.
 * Cards get a fixed min-width so the rail feels editorial, not grid-y.
 */
export default function ProductRail({
  title,
  subtitle,
  products,
  accent = "#176B4D",
  id,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  accent?: string;
  id?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <section id={id} aria-label={title} className="relative overflow-hidden py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: accent }}>
              {subtitle ?? "The lineup"}
            </p>
            <h2 className="text-section mt-1.5 font-display font-extrabold text-tea-ink">
              {title}
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll products left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-all duration-200 hover:text-cream"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.borderColor = "transparent"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.borderColor = ""; }}
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-2"><path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll products right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-all duration-200 hover:text-cream"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.borderColor = "transparent"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.borderColor = ""; }}
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-2"><path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </Reveal>
      </div>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        {products.map((p, i) => (
          <div key={p.id} className="w-[230px] shrink-0 snap-start sm:w-[260px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

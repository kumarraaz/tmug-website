"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCatalog } from "@/lib/catalog-context";
import type { Product } from "@/types";
import ShopProductCard from "./ShopProductCard";
import Reveal from "./motion/Reveal";

/**
 * Products featured here, in order: 2 jars + 4 pouches. `variant` is the pack the card opens on.
 * No launch dates are implied — edit this list to change the selection.
 */
const NEW_ARRIVALS: { id: string; variant: string }[] = [
  { id: "butterfly-pea", variant: "butterfly-pea-50g-jar" },
  { id: "lemongrass", variant: "lemongrass-50g-jar" },
  { id: "premium-tea", variant: "premium-tea-500g-pouch" },
  { id: "gold-tea", variant: "gold-tea-500g-pouch" },
  { id: "chamomile", variant: "chamomile-100g-pouch" },
  { id: "hibiscus", variant: "hibiscus-100g-pouch" },
];

export default function NewArrivals() {
  const { products } = useCatalog();
  // Resolved from the live catalogue; a removed / inactive product simply drops out.
  const PICKS: { product: Product; variant: string }[] = useMemo(
    () =>
      NEW_ARRIVALS.flatMap(({ id, variant }) => {
        const product = products.find((p) => p.id === id);
        return product ? [{ product, variant }] : [];
      }),
    [products],
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const slide = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 280) + 20;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#3A3438]/15 bg-white text-[#33243A] shadow-xs transition-all duration-200";

  return (
    <section id="new-arrivals" aria-labelledby="new-arrivals-heading" className="relative bg-[#FFF7EF] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <Reveal>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#144E25]">Fresh on the shelf</span>
            <h2 id="new-arrivals-heading" className="text-section mt-1 font-display font-black text-[#33243A]">
              New Arrivals
            </h2>
          </Reveal>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => slide(-1)}
              disabled={!canPrev}
              aria-label="Previous products"
              className={`${arrow} ${canPrev ? "cursor-pointer hover:bg-[#FFF183]" : "cursor-not-allowed opacity-30"}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              disabled={!canNext}
              aria-label="Next products"
              className={`${arrow} ${canNext ? "cursor-pointer hover:bg-[#FFF183]" : "cursor-not-allowed opacity-30"}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-4 pt-1"
          style={{ scrollbarWidth: "none" }}
        >
          {PICKS.map(({ product, variant }) => (
            <div
              key={product.id}
              className="w-[72vw] max-w-[340px] min-w-[230px] flex-none snap-start sm:w-[calc(50%-10px)] sm:max-w-none md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"
            >
              <ShopProductCard product={product} defaultVariantId={variant} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

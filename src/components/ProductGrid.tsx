"use client";

import { PRODUCTS } from "@/data/products";
import ProductCard from "./ProductCard";
import Reveal, { Stagger, RevealItem } from "./motion/Reveal";

/** Full product grid — "Shop All Teas". Collection filtering lives on /collections. */
export default function ProductGrid() {
  return (
    <section id="shop" className="scroll-mt-24 bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-6 text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tea-green">
            The full lineup
          </p>
          <h2 className="text-section mt-1.5 font-display font-extrabold text-tea-ink">
            Shop all <span className="text-tea-green">teas</span>
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-[15px] text-ink-soft">
            Seven teas, thirteen packs. Whole flowers, long leaves and kadak chai —
            pick your ritual.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4" gap={0.05}>
          {PRODUCTS.map((p, i) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} index={i} />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

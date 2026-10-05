"use client";

import { PRODUCTS } from "@/data/products";
import ProductCard from "./ProductCard";
import Reveal, { Stagger, RevealItem } from "./motion/Reveal";

/** Full product grid — "Shop All Teas". Collection filtering lives on /collections. */
export default function ProductGrid() {
  return (
    <section id="shop" className="scroll-mt-24 bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-tea-green">
            The full lineup
          </p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-tea-ink sm:text-5xl">
            Shop all <span className="text-tea-green">teas</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            Seven teas, thirteen packs. Whole flowers, long leaves and kadak chai —
            pick your ritual.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4" gap={0.06}>
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

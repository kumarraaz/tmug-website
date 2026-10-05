"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import type { Collection } from "@/types";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";

/** Product grid with optional collection filtering. */
export default function ProductGrid({
  activeCollection,
  onClear,
}: {
  activeCollection: Collection | null;
  onClear: () => void;
}) {
  const products = activeCollection
    ? PRODUCTS.filter((p) => activeCollection.productIds.includes(p.id))
    : PRODUCTS;

  return (
    <section id="shop" className="scroll-mt-24 bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The lineup"
          title={activeCollection ? activeCollection.name : "Shop All Teas"}
          description={
            activeCollection
              ? activeCollection.description
              : "Seven teas, thirteen packs. Whole flowers, long leaves and kadak chai — pick your ritual."
          }
        >
          <AnimatePresence>
            {activeCollection && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={onClear}
                className="mt-2 rounded-full border border-tea-green/30 px-4 py-1.5 text-sm font-bold text-tea-green transition-colors hover:bg-tea-green/5"
              >
                ✕ Clear filter — show all teas
              </motion.button>
            )}
          </AnimatePresence>
        </SectionHeading>

        <motion.div layout className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {products.map((p, i) => (
              <motion.div key={p.id} layout exit={{ opacity: 0, scale: 0.95 }}>
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

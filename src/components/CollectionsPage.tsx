"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { COLLECTIONS, collectionProducts, getCollection } from "@/data/collections";
import ProductCard from "@/components/ProductCard";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import { IconArrowRight } from "@/components/icons";

/** Visual catalog with category tabs + animated grid. */
function CollectionsInner() {
  const params = useSearchParams();
  const activeId = params.get("c") ?? "all-teas";
  const active = getCollection(activeId) ?? COLLECTIONS[0];
  const products = collectionProducts(active);

  return (
    <div className="bg-cream-light pb-16 sm:pb-24">
      {/* Tabs */}
      <div className="sticky top-[50px] z-30 border-b border-ink/8 bg-cream-light/90 backdrop-blur-md">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
          {COLLECTIONS.map((c) => {
            const selected = c.id === active.id;
            return (
              <Link
                key={c.id}
                href={`/collections?c=${c.id}`}
                scroll={false}
                aria-current={selected ? "true" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-extrabold transition-all duration-200 ${
                  selected ? "text-white shadow-md" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink/25"
                }`}
                style={selected ? { backgroundColor: c.accent } : undefined}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selected ? "#fff" : c.accent }}
                  aria-hidden="true"
                />
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active collection hero */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-7xl px-4 pt-6 sm:px-6"
        >
          <div
            className="relative overflow-hidden rounded-[1.75rem] border border-ink/8 p-5 sm:p-7"
            style={{ background: `linear-gradient(135deg, ${active.accent}1f, ${active.accent}08)` }}
          >
            <div className="grid items-center gap-5 sm:grid-cols-[1fr_180px]">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: active.accent }}>
                  {active.tagline}
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-extrabold text-tea-ink sm:text-4xl">
                  {active.name}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-ink-soft">{active.description}</p>
                <p className="mt-1.5 text-[13px] font-bold text-ink-soft">
                  {products.length} {products.length === 1 ? "tea" : "teas"}
                </p>
              </div>
              <div className="relative mx-auto hidden aspect-square w-full max-w-[180px] overflow-hidden rounded-3xl border border-ink/8 sm:block">
                <Image src={active.image} alt={active.imageAlt} fill sizes="180px" loading="lazy" className="object-cover" />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id + "-grid"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* All collections strip */}
        <Reveal className="mt-12">
          <h3 className="text-center font-display text-xl font-extrabold text-tea-ink sm:text-2xl">
            Explore every collection
          </h3>
        </Reveal>
        <Stagger className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" gap={0.06}>
          {COLLECTIONS.map((c) => (
            <RevealItem key={c.id}>
              <Link
                href={`/collections?c=${c.id}`}
                scroll={false}
                className="group relative block overflow-hidden rounded-3xl border border-ink/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(11,61,46,0.35)]"
                aria-label={`View ${c.name}`}
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(max-width: 640px) 45vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3.5">
                    <div>
                      <p className="font-display text-[15px] font-bold text-white">{c.name}</p>
                      <p className="text-[11px] font-bold text-white/75">{collectionProducts(c).length} teas</p>
                    </div>
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1"
                      style={{ backgroundColor: c.accent }}
                    >
                      <IconArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-cream-light" aria-hidden="true" />}>
      <CollectionsInner />
    </Suspense>
  );
}

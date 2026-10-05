"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { COLLECTIONS, collectionProducts } from "@/data/products";
import type { Collection } from "@/types";
import { IconArrowRight } from "./icons";
import SectionHeading from "./SectionHeading";

function CollectionCard({
  collection,
  onSelect,
  active,
}: {
  collection: Collection;
  onSelect: (c: Collection) => void;
  active: boolean;
}) {
  const [tapped, setTapped] = useState(false);
  const count = collectionProducts(collection).length;
  const expanded = tapped; // mobile tap toggles the info overlay

  return (
    <motion.button
      type="button"
      onClick={() => {
        setTapped((v) => !v);
        onSelect(collection);
      }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-pressed={active}
      className={`group relative overflow-hidden rounded-[1.75rem] text-left shadow-[0_20px_50px_-20px_rgba(23,32,24,0.35)] transition-shadow hover:shadow-[0_30px_60px_-20px_rgba(23,32,24,0.45)] ${
        active ? "ring-4 ring-gold" : ""
      }`}
    >
      <div className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
        <Image
          src={collection.image}
          alt={collection.imageAlt}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* gradient + info */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-tea-dark/95 via-tea-dark/25 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-soft">
            {collection.tagline}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold text-cream sm:text-3xl">
            {collection.name}
          </h3>
          <div
            className={`grid transition-all duration-500 ease-out ${
              expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            } md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100`}
          >
            <div className="overflow-hidden">
              <p className="pt-2 text-sm leading-relaxed text-cream/80">{collection.description}</p>
              <p className="pt-1 text-xs font-semibold text-cream/60">
                {count} {count === 1 ? "tea" : "teas"}
              </p>
            </div>
          </div>
          <span
            className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold transition-all duration-300 ${
              active ? "bg-gold text-tea-dark" : "bg-cream/15 text-cream backdrop-blur group-hover:bg-gold group-hover:text-tea-dark"
            }`}
          >
            {active ? "Showing below" : "Shop now"} <IconArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function Collections({
  onSelect,
  activeId,
}: {
  onSelect: (c: Collection | null) => void;
  activeId: string | null;
}) {
  return (
    <section id="collections" className="scroll-mt-24 bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Collections"
          title="Shop Our Collections"
          description="Four little worlds of tea. Pick your mood — colourful herbals, mountain greens or proper kadak chai."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {COLLECTIONS.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              active={activeId === c.id}
              onSelect={(col) => onSelect(activeId === col.id ? null : col)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

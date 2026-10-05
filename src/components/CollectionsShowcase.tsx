"use client";

import Image from "next/image";
import Link from "next/link";
import { collectionProducts, getCollection } from "@/data/collections";
import Reveal, { Stagger, RevealItem } from "./motion/Reveal";
import { IconArrowRight } from "./icons";

/** Homepage mood grid — exactly 4 compact cards with a clean bottom panel. */
const HOME_COLLECTIONS = ["all-teas", "flower-teas", "green-tea", "chai"];

export default function CollectionsShowcase() {
  const cards = HOME_COLLECTIONS.map((id) => getCollection(id)!).filter(Boolean);

  return (
    <section aria-label="Collections" className="bg-cream-light py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tea-green">
              Pick your vibe
            </p>
            <h2 className="text-section mt-1.5 font-display font-extrabold text-tea-ink">
              Shop by mood
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-tea-green hover:underline"
          >
            Explore all collections <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" gap={0.07}>
          {cards.map((c) => {
            const count = collectionProducts(c).length;
            return (
              <RevealItem key={c.id}>
                <Link
                  href={`/collections?c=${c.id}`}
                  className="group block overflow-hidden rounded-[1.375rem] border border-ink/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(11,61,46,0.35)]"
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
                  aria-label={`Browse ${c.name} — ${count} teas`}
                >
                  <span className="relative block h-[132px] overflow-hidden bg-cream-light sm:h-[168px]">
                    <Image
                      src={c.image}
                      alt={c.imageAlt}
                      fill
                      sizes="(max-width: 640px) 45vw, 25vw"
                      loading="lazy"
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-2 px-4 py-3">
                    <span className="min-w-0">
                      <span className="block truncate font-display text-[15px] font-bold text-ink">
                        {c.name}
                      </span>
                      <span className="block truncate text-xs text-ink-soft">
                        {c.tagline} · {count} {count === 1 ? "tea" : "teas"}
                      </span>
                    </span>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-0.5"
                      style={{ backgroundColor: c.accent }}
                    >
                      <IconArrowRight className="h-4 w-4" />
                    </span>
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

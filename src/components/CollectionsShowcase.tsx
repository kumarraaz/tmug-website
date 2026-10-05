"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS } from "@/data/collections";
import Reveal, { Stagger, RevealItem } from "./motion/Reveal";
import { IconArrowRight } from "./icons";

/**
 * Colorful collection cards — unique color identity, image, hover motion,
 * arrow interaction. Links to /collections?c=<id>.
 */
export default function CollectionsShowcase() {
  return (
    <section aria-label="Collections" className="relative overflow-hidden bg-cream-light py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-6 text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold">
            Pick your vibe
          </p>
          <h2 className="text-section mt-1.5 font-display font-extrabold text-tea-ink">
            Shop by <span className="text-tea-green">mood</span>
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" gap={0.07}>
          {COLLECTIONS.slice(0, 4).map((c) => (
            <RevealItem key={c.id}>
              <Link
                href={`/collections?c=${c.id}`}
                className="group relative block overflow-hidden rounded-3xl border border-ink/8 shadow-[0_12px_30px_-16px_rgba(11,61,46,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-18px_rgba(11,61,46,0.4)]"
                aria-label={`Browse ${c.name}`}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[4/3] w-full"
                  style={{ backgroundColor: c.accent }}
                >
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 22vw"
                    loading="lazy"
                    className="object-cover opacity-95 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/85">
                      {c.tagline}
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-extrabold text-white sm:text-xl">
                      {c.name}
                    </h3>
                    <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink transition-all duration-300 group-hover:translate-x-1 group-hover:bg-gold group-hover:text-tea-ink">
                      <IconArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </RevealItem>
          ))}
        </Stagger>

        {/* remaining collections as compact rows */}
        <Stagger className="mt-3 grid gap-3 sm:mt-4 md:grid-cols-3" gap={0.07}>
          {COLLECTIONS.slice(4).map((c) => (
            <RevealItem key={c.id}>
              <Link
                href={`/collections?c=${c.id}`}
                className="group flex items-center gap-3.5 overflow-hidden rounded-3xl border border-ink/8 bg-white p-3 shadow-[0_10px_28px_-16px_rgba(11,61,46,0.3)] transition-all duration-300 hover:-translate-y-1"
                aria-label={`Browse ${c.name}`}
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-[72px] sm:w-[72px]">
                  <Image src={c.image} alt={c.imageAlt} fill sizes="72px" loading="lazy" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base font-bold text-tea-ink">
                    {c.name}
                  </span>
                  <span className="block truncate text-[13px] text-ink-soft">{c.tagline}</span>
                </span>
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1"
                  style={{ backgroundColor: c.accent }}
                >
                  <IconArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </Stagger>

        <Reveal className="mt-8 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-full bg-tea-ink px-7 py-3.5 text-sm font-extrabold text-cream transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            View all collections <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

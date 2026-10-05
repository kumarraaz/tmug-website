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
    <section aria-label="Collections" className="relative overflow-hidden bg-cream-light py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-gold">
            Pick your vibe
          </p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-tea-ink sm:text-5xl">
            Shop by <span className="text-tea-green">mood</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            Seven collections, each with its own colour. Find the one that matches your cup.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" gap={0.08}>
          {COLLECTIONS.slice(0, 4).map((c) => (
            <RevealItem key={c.id}>
              <Link
                href={`/collections?c=${c.id}`}
                className="group relative block overflow-hidden rounded-[1.75rem] shadow-[0_18px_45px_-18px_rgba(11,61,46,0.35)] transition-shadow hover:shadow-[0_30px_60px_-18px_rgba(11,61,46,0.5)]"
                aria-label={`Browse ${c.name}`}
              >
                <motion.div
                  whileHover={{ scale: 1.04, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  className="relative aspect-[4/5] w-full"
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
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/80">
                      {c.tagline}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-black text-white sm:text-2xl">
                      {c.name}
                    </h3>
                    <span className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-all duration-300 group-hover:translate-x-1.5 group-hover:bg-gold group-hover:text-tea-ink">
                      <IconArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </RevealItem>
          ))}
        </Stagger>

        {/* remaining collections as wide banners */}
        <Stagger className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 md:grid-cols-3" gap={0.08}>
          {COLLECTIONS.slice(4).map((c) => (
            <RevealItem key={c.id}>
              <Link
                href={`/collections?c=${c.id}`}
                className="group flex items-center gap-4 overflow-hidden rounded-[1.75rem] p-4 shadow-[0_18px_45px_-18px_rgba(11,61,46,0.35)] transition-transform duration-300 hover:-translate-y-1"
                style={{ backgroundColor: `${c.accent}18` }}
                aria-label={`Browse ${c.name}`}
              >
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24">
                  <Image src={c.image} alt={c.imageAlt} fill sizes="96px" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-extrabold text-tea-ink">
                    {c.name}
                  </span>
                  <span className="block truncate text-sm text-ink-soft">{c.description}</span>
                </span>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1.5"
                  style={{ backgroundColor: c.accent }}
                >
                  <IconArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </Stagger>

        <Reveal className="mt-10 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-full bg-tea-ink px-8 py-4 text-sm font-extrabold text-cream transition-transform hover:scale-[1.03]"
          >
            View all collections <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

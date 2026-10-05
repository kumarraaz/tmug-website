"use client";

import Image from "next/image";
import Link from "next/link";
import { getProduct, frontImage } from "@/data/products";
import { formatINR } from "@/lib/format";
import Reveal, { Stagger, RevealItem } from "./motion/Reveal";
import { IconArrowRight } from "./icons";

const FLOWER_IDS = ["butterfly-pea", "chamomile", "hibiscus"];
const BLURBS: Record<string, string> = {
  "butterfly-pea": "Brews blue, turns violet with lemon.",
  chamomile: "Soft apple-blossom calm in a cup.",
  hibiscus: "Tangy ruby-red, great iced.",
};

/** Compact editorial grid — small image, title, one-liner, subtle accent. */
export default function FlowerGrid() {
  const products = FLOWER_IDS.map((id) => getProduct(id)!).filter(Boolean);

  return (
    <section aria-label="Flower teas" className="bg-cream-light py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blossom">
              Caffeine-free & colourful
            </p>
            <h2 className="text-section mt-1.5 font-display font-extrabold text-tea-ink">
              Flower power
            </h2>
          </div>
          <Link
            href="/collections?c=flower-teas"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-tea-green hover:underline"
          >
            All flower teas <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-3" gap={0.07}>
          {products.map((p) => {
            const img = frontImage(p.variants[0]);
            return (
              <RevealItem key={p.id}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group flex items-center gap-4 rounded-3xl border border-ink/8 bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(11,61,46,0.35)]"
                  style={{ ["--accent" as string]: p.accent }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = p.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
                >
                  <span
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24"
                    style={{ backgroundColor: p.accentSoft }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="96px"
                      loading="lazy"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-[0.16em]"
                      style={{ color: p.accent }}
                    >
                      Flower tea
                    </span>
                    <span className="block truncate font-display text-lg font-bold text-ink">
                      {p.name.replace(" Flower Tea", "")}
                    </span>
                    <span className="block truncate text-[13px] text-ink-soft">
                      {BLURBS[p.id]}
                    </span>
                    <span className="mt-1 block text-sm font-extrabold text-tea-green">
                      from {formatINR(p.variants[0].price)}
                    </span>
                  </span>
                  <IconArrowRight className="h-5 w-5 shrink-0 text-ink/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                </Link>
              </RevealItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "./motion/Reveal";
import FloatingLogo from "./motion/FloatingLogo";
import { Parallax } from "./motion/Parallax";
import { IconArrowRight } from "./icons";

const PILLARS = [
  { title: "Quality ingredients", copy: "Whole flowers, long leaf, honest CTC. No shortcuts." },
  { title: "Simple brewing", copy: "Hot water, two minutes, done. No ceremony required." },
  { title: "Modern presentation", copy: "Jars and pouches you'll actually want on your shelf." },
  { title: "Everyday rituals", copy: "Morning kadak to midnight chamomile — tea for every hour." },
];

/** Brand storytelling: animated type, logo watermark, product closeups. */
export default function StorySection() {
  return (
    <section aria-label="The TMUG story" className="relative overflow-hidden bg-cream py-12 sm:py-16">
      <FloatingLogo opacity={0.035} size="80%" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tea-green">
                Our story
              </p>
              <h2 className="text-section mt-2 font-display font-extrabold text-tea-ink">
                Modern tea.
                <br />
                <span className="text-tea-green">Thoughtfully</span> selected.
                <br />
                Made for everyday rituals.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base">
                TMUG started with a simple frustration: great tea in India was either boring or
                overpriced. We wanted teas that taste exciting, look beautiful, and fit real life —
                from the first kadak of the morning to a calm chamomile at night.
              </p>
            </Reveal>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={0.05 * i} kind="fade-in">
                  <div className="rounded-2xl border border-ink/8 bg-white p-4.5 shadow-[0_10px_28px_-16px_rgba(11,61,46,0.25)]">
                    <p className="font-display text-[15px] font-bold text-tea-deep">{p.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{p.copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.15} className="mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-tea-green px-6 py-3 text-sm font-extrabold text-cream transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                Read our story <IconArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <Parallax speed={0.1} className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3 pt-8">
                {[
                  { src: "/products/butterfly-pea-50g-jar-front.jpg", alt: "TMUG butterfly pea flower tea 50g jar" },
                  { src: "/products/gold-250g-pouch-front.jpg", alt: "TMUG Gold chai patti 250g pouch" },
                ].map((img) => (
                  <Reveal key={img.src} kind="scale">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-ink/8 shadow-[0_16px_36px_-18px_rgba(11,61,46,0.35)]">
                      <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 40vw, 280px" loading="lazy" className="object-cover" />
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { src: "/products/chamomile-100g-pouch-front.jpg", alt: "TMUG chamomile flower tea 100g pouch" },
                  { src: "/products/premium-500g-pouch-front.jpg", alt: "TMUG Premium chai patti 500g pouch" },
                ].map((img) => (
                  <Reveal key={img.src} kind="scale" delay={0.08}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-ink/8 shadow-[0_16px_36px_-18px_rgba(11,61,46,0.35)]">
                      <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 40vw, 280px" loading="lazy" className="object-cover" />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

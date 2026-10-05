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
    <section aria-label="The TMUG story" className="relative overflow-hidden bg-cream py-16 sm:py-24">
      <FloatingLogo opacity={0.035} size="80%" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-tea-green">
                Our story
              </p>
              <h2 className="mt-3 font-display text-4xl font-black leading-[0.95] tracking-tight text-tea-ink sm:text-6xl">
                Modern tea.
                <br />
                <span className="text-tea-green">Thoughtfully</span> selected.
                <br />
                Made for <span className="text-outline text-gold">everyday</span> rituals.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
                TMUG started with a simple frustration: great tea in India was either boring or
                overpriced. We wanted teas that taste exciting, look beautiful, and fit real life —
                from the first kadak of the morning to a calm chamomile at night.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={0.06 * i} kind="fade-in">
                  <div className="rounded-2xl bg-white p-5 shadow-[0_12px_30px_-14px_rgba(11,61,46,0.25)] ring-1 ring-ink/5">
                    <p className="font-display text-base font-extrabold text-tea-deep">{p.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{p.copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2} className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-tea-green px-7 py-3.5 text-sm font-extrabold text-cream transition-transform hover:scale-[1.04]"
              >
                Read our story <IconArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <Parallax speed={0.12} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-10">
                {[
                  { src: "/products/butterfly-pea-50g-jar-front.jpg", alt: "TMUG butterfly pea flower tea 50g jar" },
                  { src: "/products/gold-250g-pouch-front.jpg", alt: "TMUG Gold chai patti 250g pouch" },
                ].map((img) => (
                  <Reveal key={img.src} kind="scale">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] shadow-xl ring-1 ring-ink/10">
                      <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 40vw, 300px" loading="lazy" className="object-cover" />
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { src: "/products/chamomile-100g-pouch-front.jpg", alt: "TMUG chamomile flower tea 100g pouch" },
                  { src: "/products/premium-500g-pouch-front.jpg", alt: "TMUG Premium chai patti 500g pouch" },
                ].map((img) => (
                  <Reveal key={img.src} kind="scale" delay={0.1}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] shadow-xl ring-1 ring-ink/10">
                      <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 40vw, 300px" loading="lazy" className="object-cover" />
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

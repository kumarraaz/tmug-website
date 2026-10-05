"use client";

import Link from "next/link";
import Reveal from "./motion/Reveal";
import FloatingLogo from "./motion/FloatingLogo";

/** Compact hero for inner pages: breadcrumb + oversized display title. */
export default function PageHero({
  eyebrow,
  title,
  copy,
  accent = "#176B4D",
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
  accent?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-cream pb-10 pt-8 sm:pb-12 sm:pt-10">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 80% 10%, ${accent}1a, transparent), radial-gradient(ellipse 50% 40% at 10% 90%, #D8A62A14, transparent)`,
        }}
      />
      <FloatingLogo opacity={0.035} size="70%" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal kind="fade-in">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-[11px] font-bold text-ink-soft">
              <li><Link href="/" className="hover:text-tea-green">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{eyebrow}</li>
            </ol>
          </nav>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: accent }}>
            {eyebrow}
          </p>
          <h1 className="text-section mt-2 max-w-3xl font-display font-extrabold text-tea-ink">
            {title}
          </h1>
          {copy && (
            <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-ink-soft">{copy}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

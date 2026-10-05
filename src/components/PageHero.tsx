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
    <section className="relative overflow-hidden bg-cream pb-14 pt-10 sm:pb-20 sm:pt-14">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 80% 10%, ${accent}22, transparent), radial-gradient(ellipse 50% 40% at 10% 90%, #D8A62A1f, transparent)`,
        }}
      />
      <FloatingLogo opacity={0.04} size="70%" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal kind="fade-in">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-bold text-ink-soft">
              <li><Link href="/" className="hover:text-tea-green">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{eyebrow}</li>
            </ol>
          </nav>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em]" style={{ color: accent }}>
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-black leading-[0.95] tracking-tight text-tea-ink sm:text-6xl">
            {title}
          </h1>
          {copy && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">{copy}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

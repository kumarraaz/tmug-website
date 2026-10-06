"use client";

import { motion } from "framer-motion";
import { DEMO_REVIEWS, FEEDBACK_MESSAGE } from "@/data/reviews";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconArrowRight, IconWhatsApp } from "./icons";

/**
 * Customer Love — funky Gen-Z review section on deep TMUG green.
 * Reviews are DEMO placeholders (see src/data/reviews.ts): never labeled
 * verified, no fake counts. Decorations are capped at a handful, with only
 * a few carrying continuous animation.
 */
export default function CustomerLove() {
  return (
    <section aria-label="Customer love" className="relative overflow-hidden bg-tea-deep py-14 sm:py-20">
      {/* ── decorations: blobs, sparkles, doodles, dots (aria-hidden) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* organic blobs */}
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-[45%_55%_50%_50%] bg-cream opacity-[0.05]" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-gold opacity-10 blur-3xl" />
        <div className="absolute right-[12%] top-[8%] h-40 w-40 rounded-[60%_40%_55%_45%] bg-[#d84f6d] opacity-[0.07]" />
        {/* twinkling stars */}
        <span className="absolute left-[10%] top-[22%] text-xl text-gold-soft animate-dot-pulse">★</span>
        <span className="absolute right-[14%] top-[30%] text-sm text-cream opacity-70 animate-dot-pulse" style={{ animationDelay: "1.4s" }}>★</span>
        <span className="absolute bottom-[24%] left-[16%] text-base text-gold opacity-80 animate-dot-pulse" style={{ animationDelay: "2.6s" }}>✦</span>
        <span className="absolute bottom-[18%] right-[20%] text-lg text-gold-soft opacity-60">★</span>
        {/* tiny accent dots */}
        <span className="absolute left-[30%] top-[12%] h-2 w-2 rounded-full bg-[#4a6fd4] opacity-60" />
        <span className="absolute right-[30%] bottom-[12%] h-2 w-2 rounded-full bg-[#e8a93d] opacity-70" />
        <span className="absolute left-[48%] bottom-[8%] h-1.5 w-1.5 rounded-full bg-cream opacity-40" />
        {/* tea-cup doodle */}
        <svg viewBox="0 0 64 48" className="absolute right-[8%] top-[14%] h-12 w-16 text-cream opacity-25 animate-float-slow" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M10 14 h34 v10 c0 10 -8 16 -17 16 s-17 -6 -17 -16 Z" />
          <path d="M44 18 h6 c5 0 5 8 0 8 h-7" />
          <path d="M22 8 c -2 -3 2 -4 0 -7 M30 8 c -2 -3 2 -4 0 -7" opacity="0.8" />
        </svg>
        {/* botanical leaves */}
        <svg viewBox="0 0 60 90" className="absolute bottom-[10%] left-[6%] h-20 w-14 text-cream opacity-20 animate-float" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M30 85 C 28 60, 30 40, 34 18" />
          <path d="M30 62 C 20 58, 14 50, 12 40 C 22 42, 28 50, 30 62 Z" fill="currentColor" stroke="none" opacity="0.7" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[75rem] px-4 sm:px-6">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-2.5 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            Customer love
          </span>
          <h2 className="text-section font-display font-extrabold text-balance text-cream">
            Good tea deserves good company.
          </h2>
          <p className="text-[15px] leading-relaxed text-cream/70">
            Your next favourite cup starts here.
          </p>
        </motion.div>

        {/* review cards: 3-col desktop, swipeable on mobile */}
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 sm:mt-10 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {DEMO_REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative w-[84vw] max-w-[340px] shrink-0 snap-center rounded-[1.375rem] border border-ink/8 bg-cream p-5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:border-gold/60 sm:w-auto sm:max-w-none sm:snap-align-none"
            >
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 text-gold opacity-40 transition-transform duration-300 group-hover:translate-x-1"
              >
                <IconArrowRight className="h-4 w-4" />
              </span>
              <div
                className="text-lg tracking-[0.2em] text-gold transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                role="img"
                aria-label="5 out of 5 stars (demo review)"
              >
                ★★★★★
              </div>
              <blockquote className="mt-3 text-[14px] leading-relaxed text-ink">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-extrabold text-tea-deep">
                — {r.name}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-cream/50">
          Sample reviews shown for design preview.
        </p>

        {/* WhatsApp feedback CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-center"
        >
          <a
            href={whatsappLink(FEEDBACK_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-[15px] font-extrabold text-tea-dark shadow-[0_14px_30px_-12px_rgba(216,166,42,0.5)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            <IconWhatsApp className="h-5 w-5" />
            Share your TMUG moment
            <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          <p className="mt-3 text-xs text-cream/50">
            Opens WhatsApp {siteConfig.whatsapp.display} — no fake review forms, just chat.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

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
        {/* stickers and sparkles */}
        <img src="/assets/stickers/sparkle.svg" alt="" className="absolute left-[10%] top-[22%] h-6 w-6 opacity-60 animate-dot-pulse" />
        <img src="/assets/stickers/sparkle.svg" alt="" className="absolute right-[14%] top-[30%] h-5 w-5 opacity-50 animate-dot-pulse" style={{ animationDelay: "1.4s" }} />
        <img src="/assets/stickers/tea-leaf.svg" alt="" className="absolute bottom-[20%] left-[8%] h-10 w-10 opacity-30 rotate-12 animate-float" />
        <img src="/assets/stickers/tea-cup.svg" alt="" className="absolute right-[8%] top-[14%] h-12 w-14 opacity-25 animate-float-slow" />
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

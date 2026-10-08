"use client";

import { motion } from "framer-motion";
import { DEMO_REVIEWS, FEEDBACK_MESSAGE } from "@/data/reviews";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconArrowRight, IconWhatsApp } from "./icons";

/**
 * Customer Love — authentic review section with warm surface background.
 * Zero Green UI.
 */
export default function CustomerLove() {
  return (
    <section aria-label="Customer love" className="relative overflow-hidden bg-plum py-8 sm:py-12 text-warm-ivory">
      {/* Background decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-tea-gold/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-pink-accent/15 blur-3xl" />
        <img src="/assets/stickers/sparkle.svg" alt="" className="absolute left-[10%] top-[22%] h-6 w-6 opacity-60 animate-dot-pulse" />
        <img src="/assets/stickers/sparkle.svg" alt="" className="absolute right-[14%] top-[30%] h-5 w-5 opacity-50 animate-dot-pulse" style={{ animationDelay: "1.4s" }} />
        <img src="/assets/stickers/tea-leaf.svg" alt="" className="absolute bottom-[20%] left-[8%] h-10 w-10 opacity-30 rotate-12 animate-float" />
        <img src="/assets/stickers/tea-cup.svg" alt="" className="absolute right-[8%] top-[14%] h-12 w-14 opacity-25 animate-float-slow" />
      </div>

      <div className="relative mx-auto max-w-[75rem] px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-tea-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-tea-gold" aria-hidden="true" />
            Customer love
          </span>
          <h2 className="text-section font-display font-black text-balance text-warm-ivory">
            Good tea deserves good company.
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-warm-ivory/70">
            Your next favourite cup starts here.
          </p>
        </motion.div>

        {/* Review cards: 3-col desktop, swipeable on mobile */}
        <div className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 sm:mt-8 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {DEMO_REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative w-[84vw] max-w-[340px] shrink-0 snap-center rounded-[1.5rem] border border-white/10 bg-white/95 p-6 shadow-xl transition-all duration-300 hover:border-tea-gold/60 sm:w-auto sm:max-w-none sm:snap-align-none"
            >
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 text-tea-gold opacity-40 transition-transform duration-300 group-hover:translate-x-1"
              >
                <IconArrowRight className="h-4 w-4" />
              </span>
              <div
                className="text-lg tracking-[0.2em] text-tea-gold transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                role="img"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </div>
              <blockquote className="mt-3 text-[14px] leading-relaxed text-charcoal font-medium">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-black text-charcoal/80">
                — {r.name}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Share feedback CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <a
            href={whatsappLink(FEEDBACK_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-tea-gold px-6 py-3.5 text-xs sm:text-sm font-black text-charcoal shadow-md transition-all hover:bg-gold-soft hover:scale-105 active:scale-95"
          >
            <IconWhatsApp className="h-4 w-4" /> Share Your TMUG Experience
          </a>
        </div>
      </div>
    </section>
  );
}

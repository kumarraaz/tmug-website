"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconArrowRight, IconWhatsApp } from "./icons";

/** Section 14 — Final Conversion CTA band */
export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-tea-dark py-16 text-cream sm:py-24">
      {/* Decorative background glows & botanical shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-0 h-96 w-96 rounded-full bg-tea-green/40 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <Image
          src="/assets/stickers/sparkle.svg"
          alt=""
          width={28}
          height={28}
          className="absolute left-[15%] top-12 opacity-40 animate-dot-pulse"
        />
        <Image
          src="/assets/stickers/tea-leaf.svg"
          alt=""
          width={36}
          height={36}
          className="absolute right-[12%] top-20 rotate-45 opacity-30"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Headline, Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:col-span-7 lg:text-left"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Start Your Ritual
            </span>

            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-cream sm:text-4xl md:text-5xl">
              Ready to make tea <span className="text-gold">more fun?</span>
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
              Colour-changing blue teas, soothing whole chamomile, and properly brisk Assam chai
              — packed fresh for your everyday cup.
              {siteConfig.promo.enabled && (
                <span className="block mt-2 font-medium text-gold-soft">
                  ✨ Use code <strong className="font-extrabold text-gold">{siteConfig.promo.code}</strong> for {siteConfig.promo.discountPercent}% off your order.
                </span>
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {/* Primary: Shop TMUG */}
              <Link
                href="#shop"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-extrabold text-tea-dark shadow-[0_14px_30px_-12px_rgba(216,166,42,0.5)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] hover:bg-gold-soft"
              >
                Shop TMUG
                <IconArrowRight className="h-4 w-4" />
              </Link>

              {/* Verified Amazon CTA */}
              <a
                href={siteConfig.amazonStore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-white/10 px-7 py-4 text-sm font-extrabold text-cream backdrop-blur-xs transition-all duration-200 hover:border-gold hover:bg-white/15 hover:scale-[1.02]"
              >
                Shop on Amazon
                <span className="text-xs text-gold">↗</span>
              </a>

              {/* WhatsApp direct order */}
              <a
                href={whatsappLink("Hi TMUG! I would like to order fresh tea.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/15 px-6 py-4 text-sm font-extrabold text-[#25D366] transition-all duration-200 hover:bg-[#25D366]/25"
              >
                <IconWhatsApp className="h-4 w-4" />
                WhatsApp
              </a>
            </div>

            <p className="mt-5 text-xs text-cream/50">
              Free shipping across India • Cash on Delivery & UPI available • Fresh batch guarantee
            </p>
          </motion.div>

          {/* Right Column: Layered Packshot Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex items-center justify-center lg:col-span-5"
            aria-hidden="true"
          >
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-cream/5 backdrop-blur-xs border border-white/10 sm:h-88 sm:w-88">
              {/* Backing pack: Assam Gold */}
              <div className="absolute -left-2 bottom-4 h-48 w-48 sm:h-56 sm:w-56 -rotate-6 drop-shadow-2xl">
                <Image
                  src="/hero/gold-250g-pouch-front.png"
                  alt="TMUG Gold Chai"
                  width={224}
                  height={224}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Front pack: Butterfly Pea Jar */}
              <div className="absolute -right-2 top-4 h-48 w-48 sm:h-56 sm:w-56 rotate-6 drop-shadow-2xl">
                <Image
                  src="/hero/butterfly-pea-50g-jar-front.png"
                  alt="TMUG Butterfly Pea Jar"
                  width={224}
                  height={224}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Center floating badge */}
              <div className="absolute z-10 rounded-2xl border border-gold/40 bg-tea-ink/90 px-4 py-2 text-center shadow-xl backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gold">
                  100% PURE
                </p>
                <p className="font-display text-xs font-extrabold text-cream">No Fillers • No Dust</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

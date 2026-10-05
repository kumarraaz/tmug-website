"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconArrowRight, IconWhatsApp } from "./icons";

/** Final conversion CTA band. */
export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-tea-dark py-20 text-cream sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-tea-green/60 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-soft">
            Ready when you are
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl">
            Your ritual is <span className="text-gold">waiting.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-cream/70 sm:text-lg lg:mx-0">
            Seven teas. Thirteen packs. One very good decision.
            {siteConfig.promo.enabled && (
              <> Don’t forget code <span className="font-extrabold text-gold-soft">{siteConfig.promo.code}</span> for {siteConfig.promo.discountPercent}% off.</>
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a
              href="#shop"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-extrabold text-tea-dark transition-transform hover:scale-[1.03] active:scale-95"
            >
              Shop All Teas <IconArrowRight className="h-5 w-5" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-8 py-4 text-base font-bold text-cream transition-colors hover:bg-white/10"
            >
              <IconWhatsApp className="h-5 w-5" /> Talk to us
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto hidden w-64 lg:block"
          aria-hidden="true"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src="/products/darjeeling-100g-jar-front.jpg"
              alt=""
              fill
              sizes="256px"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

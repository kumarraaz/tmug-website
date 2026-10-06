"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconArrowRight, IconWhatsApp } from "./icons";

export default function AvailableInStores() {
  return (
    <section
      aria-label="Available where you shop"
      className="relative overflow-hidden bg-cream-light py-16 sm:py-24"
    >
      {/* Background radial gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <Image
          src="/assets/stickers/sparkle.svg"
          alt=""
          width={24}
          height={24}
          className="absolute left-[12%] top-12 opacity-30 animate-dot-pulse"
        />
        <Image
          src="/assets/stickers/tea-leaf.svg"
          alt=""
          width={32}
          height={32}
          className="absolute right-[14%] bottom-10 -rotate-12 opacity-25"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-tea-green/15 bg-white px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-tea-green shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-tea-green" />
            Everywhere You Need Us
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-tea-ink sm:text-4xl md:text-5xl">
            Available where you shop.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            Pick your favourite way to experience TMUG — from our official Amazon brand store to
            instant WhatsApp concierge and nationwide express shipping.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Channel 1: Official Amazon Store (PRIMARY VERIFIED) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border-2 border-gold/40 bg-white p-7 shadow-[0_20px_45px_-18px_rgba(216,166,42,0.25)] transition-all duration-300 hover:border-gold hover:shadow-[0_24px_50px_-16px_rgba(216,166,42,0.35)] sm:p-9"
          >
            {/* Top accent badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-extrabold text-tea-dark">
                <span className="h-2 w-2 rounded-full bg-gold" />
                Official Brand Store
              </span>
              <span className="text-xs font-bold text-ink-soft/70">Prime Verified</span>
            </div>

            <div className="my-6 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl font-extrabold text-tea-ink sm:text-3xl">
                    TMUG on Amazon
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                  Fast doorstep delivery across India. Enjoy authentic TMUG whole-flower teas,
                  green tea and chai with official Amazon fulfillment.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs font-bold text-tea-deep sm:text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Fast Prime delivery across India
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span> 100% genuine factory sealed batches
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">✓</span> Easy doorstep returns & payment options
                  </li>
                </ul>
              </div>

              {/* Product preview thumbnail */}
              <div className="relative mx-auto h-36 w-36 shrink-0 rounded-2xl bg-cream-light p-2 sm:mx-0">
                <Image
                  src="/hero/butterfly-pea-50g-jar-front.png"
                  alt="TMUG Amazon Pack"
                  fill
                  sizes="144px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={siteConfig.amazonStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF9900] py-3.5 text-sm font-extrabold text-ink transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:bg-[#F28B00]"
            >
              Shop on Amazon
              <IconArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Channel 2: WhatsApp Concierge Store (DIRECT) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-ink/8 bg-white p-7 shadow-[0_16px_36px_-16px_rgba(11,61,46,0.18)] transition-all duration-300 hover:border-tea-green/40 sm:p-9"
          >
            {/* Top accent badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3 py-1 text-xs font-extrabold text-tea-deep">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                Direct from Brand
              </span>
              <span className="text-xs font-bold text-ink-soft/70">Personal Concierge</span>
            </div>

            <div className="my-6 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <h3 className="font-display text-2xl font-extrabold text-tea-ink sm:text-3xl">
                  Order on WhatsApp
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                  Chat directly with our team. Order fresh batches, request personalized brewing
                  recommendations, or arrange bespoke gifting sets.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs font-bold text-tea-deep sm:text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-[#25D366]">✓</span> Real human tea experts on chat
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#25D366]">✓</span> Freshly packed straight from inventory
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#25D366]">✓</span> Custom festival & corporate tea gifting
                  </li>
                </ul>
              </div>

              {/* Product preview thumbnail */}
              <div className="relative mx-auto h-36 w-36 shrink-0 rounded-2xl bg-cream-light p-2 sm:mx-0">
                <Image
                  src="/hero/gold-250g-pouch-front.png"
                  alt="TMUG Direct Chai"
                  fill
                  sizes="144px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={whatsappLink("Hi TMUG! I would like to order fresh tea directly from your team.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-extrabold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:bg-[#20BA5A]"
            >
              <IconWhatsApp className="h-4 w-4" />
              Order on WhatsApp ({siteConfig.whatsapp.display})
            </a>
          </motion.div>
        </div>

        {/* Configurable Future Marketplaces Strip (Transparent & Honest) */}
        <div className="mt-8 rounded-2xl border border-ink/8 bg-white/70 p-4 sm:p-6 backdrop-blur-xs">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-display text-sm font-extrabold text-tea-ink">
                Quick-Commerce & Hyperlocal Delivery
              </p>
              <p className="text-xs text-ink-soft">
                We are rapidly partnering with 10-minute delivery networks in top metros.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {siteConfig.marketplaces
                .filter((m) => !m.active)
                .map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream px-3.5 py-1.5 text-xs font-bold text-ink-soft"
                  >
                    <span>{m.name}</span>
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-extrabold text-ink-soft">
                      {m.badge}
                    </span>
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

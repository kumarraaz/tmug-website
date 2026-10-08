"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./motion/Reveal";
import { IconArrowRight, IconSparkle } from "./icons";

interface CreativeItem {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  alt: string;
  productSlug: string;
  productName: string;
  badge: string;
  aspectRatio: string;
}

const RITUAL_ITEMS: CreativeItem[] = [
  {
    id: "blue-blooms",
    title: "Blue Blooms, Beautiful Moments",
    subtitle: "100% natural dried Aparajita flowers brewing a pure sapphire cup.",
    imageSrc: "/rituals/butterfly-pea-blooms-moments.jpg",
    alt: "TMUG Butterfly Pea Flower Tea — Blue Blooms, Beautiful Moments",
    productSlug: "butterfly-pea",
    productName: "Butterfly Pea Flower Tea",
    badge: "Signature Ritual",
    aspectRatio: "aspect-square",
  },
  {
    id: "flatlay-artisan",
    title: "Artisan Tea Table & Whole Flowers",
    subtitle: "Hand-harvested dried blossoms steeped to vivid royal blue.",
    imageSrc: "/rituals/butterfly-pea-lifestyle-flatlay.jpg",
    alt: "TMUG Butterfly Pea tea table with whole dried flowers and teacup",
    productSlug: "butterfly-pea",
    productName: "Butterfly Pea Flower Tea",
    badge: "Whole Botanical",
    aspectRatio: "aspect-square",
  },
  {
    id: "chamomile-wind-down",
    title: "Chamomile Wind-Down Ritual",
    subtitle: "Naturally sweet whole apple-blossom heads for restorative sleep.",
    imageSrc: "/rituals/chamomile-daily-ritual.png",
    alt: "TMUG Chamomile Daily Evening Ritual",
    productSlug: "chamomile",
    productName: "Chamomile Herbal Tea",
    badge: "Evening Pause",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "hibiscus-afternoon",
    title: "Ruby Hibiscus Afternoon Refresh",
    subtitle: "Tart, crimson-hued calyces loaded with natural botanicals.",
    imageSrc: "/rituals/ruby-hibiscus-daily-ritual.png",
    alt: "TMUG Ruby Hibiscus Daily Refresh Ritual",
    productSlug: "hibiscus",
    productName: "Hibiscus Flower Tea",
    badge: "Afternoon Glow",
    aspectRatio: "aspect-[4/5]",
  },
];

const RECIPE_ITEMS: CreativeItem[] = [
  {
    id: "butterfly-pea-enjoy",
    title: "More Ways to Enjoy Butterfly Pea",
    subtitle: "Hot Tea • Lavender Lemonade • Sapphire Rice • Crystal Jelly",
    imageSrc: "/recipes/butterfly-pea-ways-to-enjoy.jpg",
    alt: "More Ways to Enjoy Butterfly Pea — Tea, Lemonade, Rice, Jelly",
    productSlug: "butterfly-pea",
    productName: "Butterfly Pea Flower Tea",
    badge: "4-in-1 Creations",
    aspectRatio: "aspect-square",
  },
  {
    id: "chamomile-latte",
    title: "Honey Chamomile Latte & Panna Cotta",
    subtitle: "Velvety spiced latte and delicate floral dessert infusions.",
    imageSrc: "/recipes/chamomile-latte-panna-cotta.png",
    alt: "Chamomile Tea Latte & Panna Cotta Recipes",
    productSlug: "chamomile",
    productName: "Chamomile Herbal Tea",
    badge: "Cafe Style",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "hibiscus-sorbet",
    title: "Hibiscus Sorbet & Ruby Ice Pops",
    subtitle: "Chilled zesty sorbet scoops and revitalizing iced botanical pops.",
    imageSrc: "/recipes/hibiscus-sorbet-ice-pops.png",
    alt: "Ruby Hibiscus Lime Sorbet and Ice Pops",
    productSlug: "hibiscus",
    productName: "Hibiscus Flower Tea",
    badge: "Cool Summer",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "lemongrass-creations",
    title: "Lemongrass Ginger Chai & Broths",
    subtitle: "Invigorating spiced morning pot and warming coconut broth.",
    imageSrc: "/recipes/lemongrass-ginger-chai-soup.png",
    alt: "Lemongrass Ginger Chai and Herbal Soup",
    productSlug: "lemongrass",
    productName: "Lemongrass Herbal Tea",
    badge: "Zesty Infusion",
    aspectRatio: "aspect-[4/5]",
  },
];

export default function TeaRitualsAndRecipes() {
  const [tab, setTab] = useState<"rituals" | "recipes">("rituals");
  const items = tab === "rituals" ? RITUAL_ITEMS : RECIPE_ITEMS;

  return (
    <section
      id="rituals-recipes"
      aria-label="TMUG Rituals and Creative Recipes"
      className="relative overflow-hidden bg-warm-ivory py-8 sm:py-12"
    >
      {/* Background Subtle Ambient Auras */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-pink-accent/15 blur-3xl" />
        <div className="absolute right-0 bottom-20 h-72 w-72 rounded-full bg-tea-gold/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-tea-gold/40 bg-white/90 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-charcoal shadow-xs">
              <IconSparkle className="h-3 w-3 text-tea-gold" />
              Creative Tea Inspiration
            </span>
            <h2 className="text-section mt-2 font-display font-black text-charcoal">
              Rituals &amp; <span className="text-coral">Recipes</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-charcoal/70">
              Discover authentic ways our community brews, bakes, and creates colorful moments with whole botanicals.
            </p>
          </Reveal>
        </div>

        {/* Tab Switcher Pills */}
        <div className="mt-5 sm:mt-6 flex justify-center">
          <div className="inline-flex rounded-full border border-charcoal/10 bg-warm-surface p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setTab("rituals")}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                tab === "rituals"
                  ? "bg-charcoal text-white shadow-xs"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              🌸 Daily Rituals
            </button>
            <button
              type="button"
              onClick={() => setTab("recipes")}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                tab === "recipes"
                  ? "bg-charcoal text-white shadow-xs"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              🍹 Creative Recipes
            </button>
          </div>
        </div>

        {/* Grid of Verified Campaign Artwork Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-6 sm:mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-charcoal/10 bg-white shadow-[0_12px_32px_-16px_rgba(39,35,41,0.12)] transition-all duration-300 hover:border-tea-gold hover:shadow-[0_20px_45px_-18px_rgba(39,35,41,0.22)]"
              >
                {/* Authentic Artwork Frame (Preserved as creative artwork) */}
                <div className={`relative w-full ${item.aspectRatio} overflow-hidden bg-warm-surface/40`}>
                  <Image
                    src={item.imageSrc}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge */}
                  <span className="absolute top-3 left-3 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-charcoal shadow-xs backdrop-blur-xs">
                    {item.badge}
                  </span>
                </div>

                {/* Card Content & Direct Product CTA */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <h3 className="font-display text-base font-black text-charcoal leading-snug group-hover:text-coral transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-charcoal/70 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-charcoal/8">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="inline-flex w-full items-center justify-between rounded-full bg-warm-ivory px-4 py-2 text-xs font-black text-charcoal transition-all hover:bg-tea-gold hover:text-charcoal"
                    >
                      <span>Explore {item.productName}</span>
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

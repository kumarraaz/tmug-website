"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight } from "./icons";

interface StoryMoment {
  id: string;
  timeTag: string;
  title: string;
  subtitle: string;
  teaName: string;
  description: string;
  flavorProfile: string[];
  productImage: string;
  accentColor: string;
  bgTint: string;
  tagline: string;
}

const RITUAL_MOMENTS: StoryMoment[] = [
  {
    id: "morning",
    timeTag: "7:00 AM — Rise & Hustle",
    title: "The Kadak Kickstart",
    subtitle: "Proper Indian Chai",
    teaName: "Assam Gold CTC Tea",
    description:
      "Grown in upper Assam gardens. High briskness, deep amber liquor, and full-bodied malt that cuts through milk and crushed ginger like a dream.",
    flavorProfile: ["Malty", "Deep Amber", "High Briskness", "Cardamom Friendly"],
    productImage: "/hero/gold-250g-pouch-front.png",
    accentColor: "#D8A62A",
    bgTint: "rgba(216, 166, 42, 0.08)",
    tagline: "Properly brisk. Never dusty.",
  },
  {
    id: "afternoon",
    timeTag: "1:30 PM — Afternoon Spark",
    title: "The Violet Bloom",
    subtitle: "Colour-Changing Wonder",
    teaName: "Butterfly Pea Flower Tea",
    description:
      "Hand-plucked whole Clitoria ternatea blossoms. Brews a mesmerizing royal blue; squeeze a fresh lemon slice to watch it transform into a vibrant violet.",
    flavorProfile: ["Earthy", "Royal Blue to Violet", "100% Herbal", "Caffeine-Free"],
    productImage: "/hero/butterfly-pea-50g-jar-front.png",
    accentColor: "#3A5EC8",
    bgTint: "rgba(58, 94, 200, 0.08)",
    tagline: "Sip colour. Taste calm.",
  },
  {
    id: "evening",
    timeTag: "4:30 PM — Mountain Reset",
    title: "The Himalayan Reset",
    subtitle: "Pure Darjeeling Green",
    teaName: "Darjeeling Whole Leaf Green Tea",
    description:
      "Unfermented whole leaves hand-selected from misty high-elevation slopes. Delicate vegetal sweetness, nutty aroma, and clean finish without harsh astringency.",
    flavorProfile: ["Vegetal", "Nutty Sweet", "Rich Antioxidants", "Crisp Clean"],
    productImage: "/hero/darjeeling-100g-jar-front.png",
    accentColor: "#6C4AB6",
    bgTint: "rgba(108, 74, 182, 0.08)",
    tagline: "Zero bitterness. Pure mountain leaf.",
  },
  {
    id: "night",
    timeTag: "10:00 PM — Unwind & Sleep",
    title: "The Midnight Calm",
    subtitle: "Whole Apple-Blossom Heads",
    teaName: "Chamomile Flower Tea",
    description:
      "Sun-dried German chamomile flowers with intact golden centres. Naturally sweet, honey-apple aroma that eases racing thoughts and welcomes restful sleep.",
    flavorProfile: ["Apple-Blossom", "Naturally Sweet", "Calming", "Zero Caffeine"],
    productImage: "/hero/chamomile-50g-jar-front.png",
    accentColor: "#D9A441",
    bgTint: "rgba(217, 164, 65, 0.08)",
    tagline: "Pure botanical comfort in a cup.",
  },
];

export default function TeaStory() {
  const [activeMoment, setActiveMoment] = useState<string>("morning");
  const current = RITUAL_MOMENTS.find((m) => m.id === activeMoment) || RITUAL_MOMENTS[0];

  return (
    <section
      id="about"
      aria-label="The TMUG Tea Story"
      className="relative overflow-hidden bg-warm-surface/40 py-16 sm:py-24"
    >
      {/* Decorative botanical backdrop elements */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-tea-gold/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-pink-accent/15 blur-3xl" />
        <Image
          src="/assets/stickers/sparkle.svg"
          alt=""
          width={28}
          height={28}
          className="absolute right-[10%] top-12 opacity-30 animate-dot-pulse"
        />
        <Image
          src="/assets/stickers/tea-leaf.svg"
          alt=""
          width={36}
          height={36}
          className="absolute bottom-16 left-[6%] rotate-12 opacity-25"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-tea-gold/30 bg-white px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-charcoal shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            The TMUG Ritual
          </span>
          <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-charcoal sm:text-4xl md:text-5xl">
            More than just a cup of tea.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70 sm:text-lg">
            From your first morning sip to late-night conversations, TMUG brings a little more
            colour, craft, and joy to your everyday tea.
          </p>
        </div>

        {/* Ritual Selector Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {RITUAL_MOMENTS.map((m) => {
            const isActive = m.id === activeMoment;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMoment(m.id)}
                className={`relative rounded-full px-4 py-2.5 text-xs font-extrabold transition-all duration-300 sm:px-6 sm:py-3 sm:text-sm ${
                  isActive
                    ? "bg-tea-ink text-white shadow-md scale-105"
                    : "bg-white text-ink-soft hover:bg-white/80 hover:text-tea-ink border border-ink/8"
                }`}
              >
                <span>{m.title}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeRitualPill"
                    className="absolute inset-0 rounded-full border-2 border-gold -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Story Display Stage */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2.5rem] border border-ink/8 bg-white p-6 shadow-xl sm:p-10 md:p-12"
              style={{
                boxShadow: `0 24px 48px -20px ${current.accentColor}25, 0 10px 24px -10px rgba(11,61,46,0.06)`,
              }}
            >
              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left: Editorial Storytelling */}
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-extrabold tracking-wide uppercase"
                      style={{
                        backgroundColor: current.bgTint,
                        color: current.accentColor,
                      }}
                    >
                      {current.timeTag}
                    </span>
                    <span className="text-xs font-bold text-ink-soft/70">
                      • {current.subtitle}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-extrabold text-charcoal sm:text-3xl md:text-4xl">
                    {current.teaName}
                  </h3>

                  <p className="mt-1 font-display text-base font-semibold italic text-coral sm:text-lg">
                    “{current.tagline}”
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-charcoal/75 sm:text-base">
                    {current.description}
                  </p>

                  {/* Flavour notes pills */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {current.flavorProfile.map((note) => (
                      <span
                        key={note}
                        className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-warm-ivory px-3.5 py-1 text-xs font-extrabold text-charcoal"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: current.accentColor }}
                        />
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href="/#shop"
                      className="inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-sm font-extrabold text-white shadow-md transition-all duration-200 hover:bg-tea-gold hover:text-charcoal hover:scale-[1.03] active:scale-[0.98]"
                    >
                      Explore the range
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/collections"
                      className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-white px-6 py-3.5 text-sm font-extrabold text-charcoal transition-colors hover:bg-warm-surface"
                    >
                      Browse Collections
                    </Link>
                  </div>
                </div>

                {/* Right: Full packaging stage with organic backing */}
                <div className="relative flex items-center justify-center lg:col-span-5">
                  <div
                    className="relative flex h-72 w-72 items-center justify-center rounded-full transition-transform duration-700 sm:h-88 sm:w-88"
                    style={{ backgroundColor: current.bgTint }}
                  >
                    {/* Concentric subtle rings */}
                    <div
                      className="absolute inset-4 rounded-full border border-dashed opacity-40 animate-spin-slower"
                      style={{ borderColor: current.accentColor }}
                    />
                    <div className="relative h-60 w-60 sm:h-72 sm:w-72 drop-shadow-2xl">
                      <Image
                        src={current.productImage}
                        alt={`TMUG ${current.teaName}`}
                        fill
                        sizes="(max-width: 768px) 240px, 288px"
                        priority
                        className="object-contain transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Floating sticker badge */}
                  <div
                    className="absolute -bottom-2 -right-2 rounded-2xl bg-white p-3 shadow-lg border border-ink/8 sm:bottom-2 sm:right-2"
                    style={{ transform: "rotate(4deg)" }}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/stickers/badge-natural.svg"
                        alt=""
                        width={28}
                        height={28}
                      />
                      <div className="text-left">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-tea-gold">
                          Fresh Harvest
                        </p>
                        <p className="text-xs font-extrabold text-charcoal">Pure Botanicals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

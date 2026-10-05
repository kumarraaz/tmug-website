"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "./motion/Reveal";
import { Parallax } from "./motion/Parallax";
import { IconArrowRight } from "./icons";

interface StripProps {
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
  cta: { label: string; href: string };
  bg: string;
  textColor?: string;
  image?: { src: string; alt: string };
  flip?: boolean;
}

/** Big colorful editorial strip with oversized typography + product cutout. */
function Strip({ eyebrow, title, copy, cta, bg, textColor = "#FFF8EA", image, flip = false }: StripProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundColor: bg }}>
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-black/10 blur-3xl"
      />
      <div className={`relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 ${image ? "lg:grid-cols-2" : ""}`}>
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] opacity-70" style={{ color: textColor }}>
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl" style={{ color: textColor }}>
            {title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed opacity-80 sm:text-lg" style={{ color: textColor }}>
            {copy}
          </p>
          <Link
            href={cta.href}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/95 px-7 py-3.5 text-sm font-extrabold text-ink shadow-lg transition-transform hover:scale-[1.04]"
          >
            {cta.label} <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        {image && (
          <Parallax speed={0.18} className={`relative ${flip ? "lg:order-first" : ""}`}>
            <motion.div
              whileHover={{ rotate: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[2.5rem] shadow-2xl ring-4 ring-white/25"
            >
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 85vw, 420px" loading="lazy" className="object-cover" />
            </motion.div>
          </Parallax>
        )}
      </div>
    </section>
  );
}

export default function Editorial() {
  return (
    <>
      <Strip
        eyebrow="Flower power"
        title={<>Flower power<br />in every brew.</>}
        copy="Whole dried petals, not dust. Butterfly pea, chamomile and hibiscus — teas that look as good as they taste."
        cta={{ label: "Shop flower teas", href: "/collections?c=flower-teas" }}
        bg="#D84F6D"
        image={{ src: "/products/hibiscus-100g-pouch-front.jpg", alt: "TMUG hibiscus flower tea 100g pouch with dried red petals" }}
      />
      <Strip
        eyebrow="Find your mood"
        title={<>Your daily cup,<br />upgraded.</>}
        copy="From petals to leaves to proper kadak chai — seven teas, thirteen packs. There's a TMUG for every hour of the day."
        cta={{ label: "Browse all teas", href: "/#shop" }}
        bg="#176B4D"
        image={{ src: "/products/darjeeling-100g-jar-front.jpg", alt: "TMUG Darjeeling green tea 100g jar with loose long leaf green tea" }}
        flip
      />
    </>
  );
}

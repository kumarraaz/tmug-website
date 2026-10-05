"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { getProduct, getVariant } from "@/data/products";
import { whatsappProductLink } from "@/config/site";
import { formatINR } from "@/lib/format";
import { VariantSelector, QuantitySelector } from "./ProductCard";
import AddToCartButton from "./cart/AddToCartButton";
import Reveal from "./motion/Reveal";
import { Parallax } from "./motion/Parallax";
import { IconWhatsApp, IconLeaf } from "./icons";

/**
 * Flagship product showcase: large visual area, 3D product tilt,
 * floating decorative elements, variant + qty + add to cart + WhatsApp.
 */
export default function FeaturedProduct() {
  const product = getProduct("butterfly-pea")!;
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const variant = getVariant(product, variantId);
  const reduce = useReducedMotion();

  const wrapRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 140, damping: 18 });

  const images = variant.images;

  return (
    <section aria-label="Featured product" className="relative overflow-hidden bg-tea-deep py-16 sm:py-24">
      {/* ambient blobs */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-pea/25 blur-[110px]" />
        <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-gold/20 blur-[110px]" />
      </div>
      <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        {/* Visual */}
        <div
          ref={wrapRef}
          onMouseMove={(e) => {
            if (reduce || !wrapRef.current) return;
            const r = wrapRef.current.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width);
            my.set((e.clientY - r.top) / r.height);
          }}
          onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
          className="perspective-1000 relative mx-auto w-full max-w-[440px]"
        >
          <Parallax speed={0.15}>
            <motion.div
              style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative"
            >
              <div className="animate-float-slow relative overflow-hidden rounded-[2.5rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={images[0].src}
                    alt={images[0].alt}
                    fill
                    sizes="(max-width: 768px) 85vw, 440px"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              </div>
              {/* floating mini cards */}
              <div
                className="animate-float absolute -left-8 top-8 hidden w-28 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-ink/10 sm:block"
                style={{ transform: "translateZ(80px)" }}
                aria-hidden="true"
              >
                <div className="relative aspect-square">
                  <Image src="/products/lemongrass-50g-jar-front.jpg" alt="" fill sizes="112px" loading="lazy" className="object-cover" />
                </div>
              </div>
              <div
                className="animate-float-slow absolute -right-6 bottom-10 hidden w-28 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-ink/10 sm:block"
                style={{ transform: "translateZ(70px)" }}
                aria-hidden="true"
              >
                <div className="relative aspect-square">
                  <Image src="/products/chamomile-50g-jar-front.jpg" alt="" fill sizes="112px" loading="lazy" className="object-cover" />
                </div>
              </div>
              <span className="animate-wiggle absolute -top-4 right-10 text-gold/70" aria-hidden="true">
                <IconLeaf className="h-12 w-12" />
              </span>
            </motion.div>
          </Parallax>
        </div>

        {/* Copy */}
        <div className="text-cream">
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-gold-soft">
              ★ Featured brew
            </p>
            <h2 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl">
              The blue tea that{" "}
              <span className="text-transparent" style={{ WebkitTextStroke: "2px #D8A62A" }}>
                changes colour.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-cream/75 sm:text-lg">
              Whole butterfly pea flowers that brew a stunning indigo cup — squeeze in lemon and
              watch it flip to violet. {product.tagline}
            </p>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-cream/50">
              {product.profile}
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-7">
            <div className="flex flex-wrap items-center gap-3">
              <VariantSelector product={product} selectedId={variantId} onChange={setVariantId} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <p className="font-display text-4xl font-black text-gold">{formatINR(variant.price)}</p>
              <QuantitySelector qty={qty} onChange={setQty} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton
                product={product}
                variant={variant}
                qty={qty}
                className="bg-gold px-8 py-4 text-base text-tea-ink hover:bg-gold-soft"
              />
              <a
                href={whatsappProductLink(product, variant, qty)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-cream/25 px-8 py-[14px] text-base font-extrabold text-cream transition-colors hover:border-cream/60"
              >
                <IconWhatsApp className="h-5 w-5" /> WhatsApp Order
              </a>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="mt-5 inline-block text-sm font-bold text-cream/70 underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-soft"
            >
              Full product story →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

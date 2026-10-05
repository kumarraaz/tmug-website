"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import { getVariant } from "@/data/products";
import { whatsappProductLink } from "@/config/site";
import { formatINR } from "@/lib/format";
import { VariantSelector, QuantitySelector } from "@/components/ProductCard";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Reveal from "@/components/motion/Reveal";
import { IconWhatsApp, IconArrowRight, IconLeaf, IconCup, IconShield } from "@/components/icons";

/** Client-side product detail: gallery, variants, cart, WhatsApp, info sections. */
export default function ProductDetail({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const variant = getVariant(product, variantId);
  const images = variant.images;

  return (
    <div className="bg-cream-light">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-bold text-ink-soft">
          <li><Link href="/" className="hover:text-tea-green">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/#shop" className="hover:text-tea-green">Shop</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:py-12">
        {/* Gallery */}
        <div>
          <motion.div
            layout
            className="relative aspect-square overflow-hidden rounded-[2rem] shadow-[0_30px_70px_-25px_rgba(11,61,46,0.4)] ring-1 ring-ink/10"
            style={{ backgroundColor: product.accentSoft }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={images[Math.min(activeImg, images.length - 1)].src}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[Math.min(activeImg, images.length - 1)].src}
                  alt={images[Math.min(activeImg, images.length - 1)].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            {product.featured && (
              <span
                className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-md"
                style={{ backgroundColor: product.accent }}
              >
                ★ Bestseller
              </span>
            )}
          </motion.div>
          {/* Thumbnails */}
          <div className="mt-4 flex gap-3" role="tablist" aria-label="Product images">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={i === Math.min(activeImg, images.length - 1)}
                aria-label={`View ${img.kind} image`}
                onClick={() => setActiveImg(i)}
                className={`relative h-20 w-20 overflow-hidden rounded-2xl ring-2 transition-all ${
                  i === Math.min(activeImg, images.length - 1)
                    ? "ring-tea-green scale-105"
                    : "ring-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt="" aria-hidden="true" fill sizes="80px" loading="lazy" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <Reveal kind="fade-in">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: product.accent }}>
              {product.tagline}
            </p>
            <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-tea-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-ink-soft">
              {product.profile}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">Choose your pack</p>
            <div className="mt-2">
              <VariantSelector product={product} selectedId={variantId} onChange={(id) => { setVariantId(id); setActiveImg(0); }} />
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mt-6 flex flex-wrap items-center gap-5">
            <p className="font-display text-4xl font-black text-tea-deep">{formatINR(variant.price)}</p>
            <QuantitySelector qty={qty} onChange={setQty} />
          </Reveal>

          <Reveal delay={0.16} className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton
              product={product}
              variant={variant}
              qty={qty}
              openCart
              className="px-8 py-4 text-base"
            />
            <a
              href={whatsappProductLink(product, variant, qty)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-tea-green/30 px-8 py-[14px] text-base font-extrabold text-tea-green transition-colors hover:border-tea-green"
            >
              <IconWhatsApp className="h-5 w-5" /> Order on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={0.2} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-ink-soft">
            <span>SKU: {variant.sku}</span>
            <span>Pack: {variant.label}</span>
            <span>Ships across India</span>
          </Reveal>

          {/* Info accordion */}
          <div className="mt-8 divide-y divide-ink/10 rounded-3xl bg-white p-2 ring-1 ring-ink/5">
            {[
              { icon: <IconLeaf className="h-5 w-5" />, title: "What's inside", body: product.ingredients },
              { icon: <IconCup className="h-5 w-5" />, title: "How to brew", body: product.brewGuide },
              { icon: <IconShield className="h-5 w-5" />, title: "Good to know", body: product.description },
            ].map((row) => (
              <details key={row.title} className="group px-4 py-4" open={row.title === "What's inside"}>
                <summary className="flex cursor-pointer list-none items-center gap-3 font-display text-base font-extrabold text-tea-ink">
                  <span style={{ color: product.accent }}>{row.icon}</span>
                  {row.title}
                  <span className="ml-auto text-xl text-ink-soft transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 pl-8 text-sm leading-relaxed text-ink-soft">{row.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Story band */}
      <section className="relative overflow-hidden py-14 sm:py-20" style={{ backgroundColor: product.accent }}>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              Why you&rsquo;ll love it
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              {product.description}
            </p>
            <Link
              href="/#shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-ink transition-transform hover:scale-[1.04]"
            >
              Shop more teas <IconArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

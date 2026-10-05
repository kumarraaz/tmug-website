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

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[42%_58%] lg:gap-12 lg:py-10">
        {/* Gallery */}
        <div>
          <motion.div
            layout
            className="relative aspect-square max-h-[46vh] w-full overflow-hidden rounded-3xl border border-ink/8 shadow-[0_20px_50px_-24px_rgba(11,61,46,0.35)] lg:max-h-none"
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
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: product.accent }}>
              {product.tagline}
            </p>
            <h1 className="text-section mt-2 font-display font-extrabold text-tea-ink">
              {product.name}
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
              {product.profile}
            </p>
          </Reveal>

          <Reveal delay={0.06} className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">Choose your pack</p>
            <div className="mt-2">
              <VariantSelector product={product} selectedId={variantId} onChange={(id) => { setVariantId(id); setActiveImg(0); }} />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-5 flex flex-wrap items-center gap-4">
            <p className="font-display text-3xl font-extrabold text-tea-deep">{formatINR(variant.price)}</p>
            <QuantitySelector qty={qty} onChange={setQty} />
          </Reveal>

          <Reveal delay={0.14} className="mt-5 flex flex-wrap gap-2.5">
            <AddToCartButton
              product={product}
              variant={variant}
              qty={qty}
              openCart
              className="px-7 py-3.5 text-[15px]"
            />
            <a
              href={whatsappProductLink(product, variant, qty)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-tea-green/30 px-6 py-3.5 text-[15px] font-bold text-tea-green transition-colors duration-200 hover:border-tea-green"
            >
              <IconWhatsApp className="h-4.5 w-4.5" /> Order on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={0.16} className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-bold text-ink-soft">
            <span>SKU: {variant.sku}</span>
            <span>Pack: {variant.label}</span>
            <span>Ships across India</span>
          </Reveal>

          {/* Info accordion */}
          <div className="mt-6 divide-y divide-ink/8 rounded-3xl border border-ink/8 bg-white p-2">
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

      {/* Story band — compact, accent-bordered */}
      <section className="bg-cream pb-12 pt-4 sm:pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div
              className="rounded-[1.75rem] border border-ink/8 bg-cream-light p-6 text-center sm:p-8"
              style={{ borderTop: `4px solid ${product.accent}` }}
            >
              <h2 className="font-display text-2xl font-extrabold text-tea-ink sm:text-3xl">
                Why you&rsquo;ll love it
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                {product.description}
              </p>
              <Link
                href="/#shop"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-tea-ink px-6 py-3 text-sm font-extrabold text-cream transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                Shop more teas <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

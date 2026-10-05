"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProduct, getVariant } from "@/data/products";
import { whatsappProductLink } from "@/config/site";
import { formatINR } from "@/lib/format";
import { VariantSelector, QuantitySelector } from "./ProductCard";
import AddToCartButton from "./cart/AddToCartButton";
import Reveal from "./motion/Reveal";
import { IconWhatsApp, IconArrowRight } from "./icons";

/**
 * Product spotlight — compact editorial split. Cream card, product left,
 * story + purchase controls right. No giant colour blocks.
 */
export default function FeaturedProduct() {
  const product = getProduct("butterfly-pea")!;
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const variant = getVariant(product, variantId);

  return (
    <section aria-label="Product spotlight" className="bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-[1.75rem] border border-ink/8 bg-cream-light shadow-[0_20px_50px_-24px_rgba(11,61,46,0.3)]">
            <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Visual */}
              <div className="relative mx-auto w-full max-w-[320px]">
                <div
                  aria-hidden="true"
                  className="absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl"
                  style={{ backgroundColor: product.accent }}
                />
                <div className="animate-float relative overflow-hidden rounded-3xl border border-ink/8">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={variant.images[0].src}
                      alt={variant.images[0].alt}
                      fill
                      sizes="(max-width: 768px) 80vw, 320px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                </div>
                <span
                  className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white"
                  style={{ backgroundColor: product.accent }}
                >
                  Spotlight
                </span>
              </div>

              {/* Copy + purchase */}
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-tea-green">
                  Product spotlight
                </p>
                <h2 className="text-section mt-2 font-display font-extrabold text-tea-ink">
                  The blue tea that changes colour.
                </h2>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
                  Whole butterfly pea flowers brew a stunning indigo cup — squeeze in lemon
                  and watch it flip violet. {product.tagline}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">
                  {product.profile}
                </p>

                <div className="mt-5">
                  <VariantSelector product={product} selectedId={variantId} onChange={setVariantId} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <p className="font-display text-3xl font-extrabold text-tea-deep">
                    {formatINR(variant.price)}
                  </p>
                  <QuantitySelector qty={qty} onChange={setQty} />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <AddToCartButton
                    product={product}
                    variant={variant}
                    qty={qty}
                    className="px-7 py-3.5 text-[15px]"
                  />
                  <a
                    href={whatsappProductLink(product, variant, qty)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-tea-green/30 px-6 py-3.5 text-[15px] font-bold text-tea-green transition-colors duration-200 hover:border-tea-green"
                  >
                    <IconWhatsApp className="h-4.5 w-4.5" /> WhatsApp Order
                  </a>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-tea-green hover:underline"
                >
                  Full product story <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { frontImage, getVariant } from "@/data/products";
import { useCatalog } from "@/lib/catalog-context";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";

/**
 * Build Your Own Box: uses the real catalogue (names, images, prices) and the normal cart.
 * No minimum size, bundle price or discount is applied — the total is the sum of the real prices.
 */
export default function BuildYourBox() {
  const { addToCart, setCartOpen, showToast } = useShop();
  const { products: PRODUCTS } = useCatalog();
  const [variantIds, setVariantIds] = useState<Record<string, string>>({});
  const [qtys, setQtys] = useState<Record<string, number>>({}); // keyed by variant id

  const variantOf = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId)!;
    return getVariant(product, variantIds[productId] ?? product.variants[0].id);
  };

  const chosen = PRODUCTS.flatMap((p) =>
    p.variants.filter((v) => (qtys[v.id] ?? 0) > 0).map((v) => ({ product: p, variant: v, qty: qtys[v.id] })),
  );
  const totalItems = chosen.reduce((n, c) => n + c.qty, 0);
  const total = chosen.reduce((n, c) => n + c.qty * c.variant.price, 0);

  const setQty = (variantId: string, qty: number) =>
    setQtys((q) => ({ ...q, [variantId]: Math.max(0, Math.min(20, qty)) }));

  const addBox = () => {
    chosen.forEach((c) => addToCart(c.product, c.variant, c.qty));
    showToast(`${totalItems} item${totalItems === 1 ? "" : "s"} from your box added to cart`);
    setQtys({});
    setCartOpen(true);
  };

  return (
    <section className="bg-cream pb-28 pt-4 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS.map((product) => {
            const variant = variantOf(product.id);
            const img = frontImage(variant);
            const qty = qtys[variant.id] ?? 0;
            return (
              <article
                key={product.id}
                className={`flex flex-col rounded-2xl border bg-white p-4 shadow-xs transition-colors ${
                  qty > 0 ? "border-[#144E25]" : "border-charcoal/10"
                }`}
              >
                <div className="relative mx-auto aspect-square w-full max-w-[220px]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 60vw, 220px"
                    className="object-contain"
                  />
                </div>
                <h3 className="mt-3 text-center font-display text-base font-black text-charcoal">{product.name}</h3>

                {product.variants.length > 1 && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1.5" role="radiogroup" aria-label={`Pack for ${product.name}`}>
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={v.id === variant.id}
                        onClick={() => setVariantIds((s) => ({ ...s, [product.id]: v.id }))}
                        className={`rounded-full border px-3 py-1 text-xs font-bold cursor-pointer ${
                          v.id === variant.id
                            ? "border-charcoal bg-charcoal text-white"
                            : "border-charcoal/20 bg-white text-charcoal hover:border-charcoal"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
                {product.variants.length === 1 && (
                  <p className="mt-1 text-center text-xs font-semibold text-charcoal/60">{variant.label}</p>
                )}

                <p className="mt-2 text-center font-display text-lg font-black text-charcoal">{formatINR(variant.price)}</p>
                {!variant.inStock && <p className="text-center text-xs font-bold text-berry">Out of stock</p>}

                <div className="mt-auto flex items-center justify-center pt-3">
                  <div className="inline-flex items-center rounded-full border-2 border-charcoal/20 bg-white p-0.5">
                    <button
                      type="button"
                      aria-label={`Remove one ${product.name} ${variant.label}`}
                      disabled={qty === 0}
                      onClick={() => setQty(variant.id, qty - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-black text-charcoal hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-9 text-center text-sm font-black text-charcoal" aria-live="polite">{qty}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${product.name} ${variant.label}`}
                      disabled={!variant.inStock}
                      onClick={() => setQty(variant.id, qty + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-black text-charcoal hover:bg-warm-surface disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Sticky box summary */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-bold text-charcoal/60">
              {totalItems === 0 ? "Your box is empty" : `${totalItems} item${totalItems === 1 ? "" : "s"} in your box`}
            </p>
            <p className="font-display text-lg font-black text-charcoal">{formatINR(total)}</p>
          </div>
          <button
            type="button"
            disabled={totalItems === 0}
            onClick={addBox}
            className="rounded-full bg-[#144E25] px-6 py-3 text-sm font-black text-[#FBBF24] shadow-md transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
          >
            Add box to cart
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Product } from "@/types";
import { PRODUCTS } from "@/data/products";

/**
 * The live product catalogue for client components.
 *
 * The root layout loads it on the server (database when configured, built-in
 * catalogue otherwise) and provides it here, so every component sees the same
 * products, prices, images and availability that the admin manages.
 */
interface CatalogValue {
  products: Product[];
  /** true when online checkout is live (database + payment gateway configured on the server). */
  checkoutEnabled: boolean;
  getProduct: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

function build(products: Product[], checkoutEnabled = false): CatalogValue {
  const byId = new Map(products.map((p) => [p.id, p]));
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return {
    products,
    checkoutEnabled,
    getProduct: (id) => byId.get(id),
    getProductBySlug: (slug) => bySlug.get(slug),
  };
}

const CatalogContext = createContext<CatalogValue>(build(PRODUCTS));

export function CatalogProvider({
  products,
  checkoutEnabled = false,
  children,
}: {
  products: Product[];
  checkoutEnabled?: boolean;
  children: ReactNode;
}) {
  const value = useMemo(() => build(products, checkoutEnabled), [products, checkoutEnabled]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  return useContext(CatalogContext);
}

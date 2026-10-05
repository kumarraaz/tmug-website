"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product, ProductVariant } from "@/types";

const STORAGE_KEY = "tmug-cart-v1";

interface ShopState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  quickViewId: string | null;
  setQuickViewId: (id: string | null) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, qty?: number) => void;
  updateQty: (variantId: string, qty: number) => void;
  removeLine: (variantId: string) => void;
  clearCart: () => void;
}

const ShopContext = createContext<ShopState | null>(null);

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: cart hydrates from localStorage on first render, no effect needed.
  const [lines, setLines] = useState<CartLine[]>(() => {
    if (typeof window === "undefined") return [];
    return loadCart();
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Persist on every change (writes back the just-loaded cart on mount — harmless).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full/blocked — cart still works for the session */
    }
  }, [lines]);

  const addToCart = useCallback(
    (product: Product, variant: ProductVariant, qty = 1) => {
      const image = variant.images[0];
      setLines((prev) => {
        const existing = prev.find((l) => l.variantId === variant.id);
        if (existing) {
          return prev.map((l) =>
            l.variantId === variant.id ? { ...l, qty: l.qty + qty } : l,
          );
        }
        return [
          ...prev,
          {
            variantId: variant.id,
            productId: product.id,
            productName: product.name,
            variantLabel: variant.label,
            price: variant.price,
            image: image?.src ?? "",
            imageAlt: image?.alt ?? product.name,
            qty,
          },
        ];
      });
    },
    [],
  );

  const updateQty = useCallback((variantId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const { count, subtotal } = useMemo(() => {
    return {
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
    };
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      cartOpen,
      setCartOpen,
      quickViewId,
      setQuickViewId,
      searchOpen,
      setSearchOpen,
      addToCart,
      updateQty,
      removeLine,
      clearCart,
    }),
    [lines, count, subtotal, cartOpen, quickViewId, searchOpen, addToCart, updateQty, removeLine, clearCart],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

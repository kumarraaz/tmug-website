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
import { siteConfig } from "@/config/site";
import { roundPaise } from "@/lib/format";

const STORAGE_KEY = "tmug-cart-v1";
const COUPON_KEY = "tmug-coupon-v1";

interface ShopState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon: string | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
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

function loadCoupon(): string | null {
  try {
    const raw = localStorage.getItem(COUPON_KEY);
    if (!raw) return null;
    // Only restore if the promo is still enabled and the code still matches
    const { promo } = siteConfig;
    return promo.enabled && raw.trim().toUpperCase() === promo.code.toUpperCase() ? promo.code : null;
  } catch {
    return null;
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

  const [coupon, setCoupon] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return loadCoupon();
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  // Persist cart + coupon on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full/blocked — cart still works for the session */
    }
  }, [lines]);

  useEffect(() => {
    try {
      if (coupon) localStorage.setItem(COUPON_KEY, coupon);
      else localStorage.removeItem(COUPON_KEY);
    } catch {
      /* ignore */
    }
  }, [coupon]);

  const applyCoupon = useCallback((code: string): boolean => {
    const { promo } = siteConfig;
    const normalized = code.trim().toUpperCase();
    if (!promo.enabled) {
      setCouponError("This offer has ended.");
      return false;
    }
    if (normalized === promo.code.toUpperCase()) {
      setCoupon(promo.code);
      setCouponError(null);
      return true;
    }
    setCouponError(`"${code.trim()}" is not a valid coupon code.`);
    return false;
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
  }, []);

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

  const { count, subtotal, discount, total } = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    const discount = coupon
      ? roundPaise((subtotal * siteConfig.promo.discountPercent) / 100)
      : 0;
    return { count, subtotal, discount, total: roundPaise(subtotal - discount) };
  }, [lines, coupon]);

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      discount,
      total,
      coupon,
      couponError,
      applyCoupon,
      removeCoupon,
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
    [lines, count, subtotal, discount, total, coupon, couponError, applyCoupon, removeCoupon, cartOpen, quickViewId, searchOpen, addToCart, updateQty, removeLine, clearCart],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, frontImage } from "@/data/products";
import { useShop } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IconClose, IconSearch } from "./icons";

/**
 * Search panel content — mounted fresh each time the overlay opens,
 * so the query starts empty without a reset effect.
 */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const { setQuickViewId } = useShop();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -24, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="mx-auto mt-20 w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-3xl bg-cream shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
        <IconSearch className="h-5 w-5 text-ink-soft" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teas — try “hibiscus” or “chai”…"
          className="w-full bg-transparent text-base outline-none placeholder:text-ink-soft/60"
          aria-label="Search teas"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="rounded-full p-1.5 text-ink-soft hover:bg-ink/5"
        >
          <IconClose />
        </button>
      </div>
      <ul className="nice-scroll max-h-[50vh] overflow-y-auto p-2">
        {results.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-ink-soft">
            No teas found for “{query}”. Try “green”, “chai” or “flower”.
          </li>
        )}
        {results.map((p) => {
          const v = p.variants[0];
          const imgObj = frontImage(v);
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setQuickViewId(p.id);
                }}
                className="flex w-full items-center gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-tea-green/5"
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                  <Image src={imgObj.src} alt="" fill className="object-cover" sizes="56px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-ink">{p.name}</span>
                  <span className="block truncate text-xs text-ink-soft">{p.tagline}</span>
                </span>
                <span className="text-sm font-extrabold text-tea-green">
                  {formatINR(v.price)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

/** Full-screen product search overlay. */
export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();

  useEffect(() => {
    if (!searchOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen, setSearchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-tea-dark/70 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search teas"
        >
          <SearchPanel onClose={() => setSearchOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

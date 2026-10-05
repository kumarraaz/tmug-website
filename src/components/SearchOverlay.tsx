"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.profile.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <motion.div
      initial={{ y: -32, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -24, opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="mx-auto mt-16 w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-[2rem] bg-cream-light shadow-[0_40px_90px_-20px_rgba(8,42,32,0.55)] ring-1 ring-ink/10 sm:mt-24"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 border-b border-ink/10 bg-white/60 px-5 py-4 sm:px-6 sm:py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tea-green text-cream">
          <IconSearch className="h-5 w-5" />
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teas — try “hibiscus” or “chai”…"
          className="w-full bg-transparent font-display text-lg font-bold text-ink outline-none placeholder:font-sans placeholder:font-medium placeholder:text-ink-soft/60"
          aria-label="Search teas"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="rounded-full bg-ink/5 p-2 text-ink-soft transition-colors hover:bg-ink/10"
        >
          <IconClose />
        </button>
      </div>
      {!query && (
        <div className="flex flex-wrap gap-2 px-5 pt-4 sm:px-6">
          {["butterfly pea", "chai", "green", "chamomile"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="rounded-full bg-tea-green/8 px-3.5 py-1.5 text-xs font-bold text-tea-green transition-colors hover:bg-tea-green/15"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <ul className="nice-scroll max-h-[55vh] overflow-y-auto p-3 sm:p-4">
        {results.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-ink-soft">
            No teas found for “{query}”. Try “green”, “chai” or “flower”.
          </li>
        )}
        {results.map((p, i) => {
          const v = p.variants[0];
          const imgObj = frontImage(v);
          return (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setQuickViewId(p.id);
                }}
                className="group flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition-all hover:bg-white hover:shadow-md"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl" style={{ backgroundColor: p.accentSoft }}>
                  <Image src={imgObj.src} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="64px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.accent }} aria-hidden="true" />
                    <span className="truncate font-display text-base font-extrabold text-ink">{p.name}</span>
                  </span>
                  <span className="block truncate pl-4 text-xs text-ink-soft">{p.profile}</span>
                </span>
                <span className="font-display text-base font-extrabold text-tea-green">
                  {formatINR(v.price)}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
      <div className="border-t border-ink/8 bg-white/50 px-5 py-3 text-center">
        <Link
          href="/#shop"
          onClick={onClose}
          className="text-xs font-bold text-tea-green hover:underline"
        >
          Browse all teas →
        </Link>
      </div>
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
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-tea-ink/60 backdrop-blur-md"
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

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  SiteControls,
  HeroBannerControl,
  ProductControl,
  CollectionControl,
  SectionControl,
} from "@/types";
import { DEFAULT_SITE_CONTROLS } from "@/config/site-controls";
import { formatINR } from "@/lib/format";
import { IconCheck, IconTrash, IconArrowRight, IconSparkle } from "@/components/icons";
import MediaUploadField from "./MediaUploadField";

type AdminTab = "banners" | "products" | "collections" | "sections";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [controls, setControls] = useState<SiteControls | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("banners");
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch controls & check auth
  useEffect(() => {
    fetch("/api/admin/site-controls")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authed) {
          router.push("/admin/login");
          return;
        }
        setControls(data.controls || DEFAULT_SITE_CONTROLS);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
  };

  const handleSave = async () => {
    if (!controls) return;
    setSaving(true);
    setToastMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/site-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", controls }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Save failed.");
      } else {
        setToastMsg("Changes saved successfully! ✓");
        setTimeout(() => setToastMsg(""), 4000);
      }
    } catch {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to restore default site settings?")) {
      setControls(JSON.parse(JSON.stringify(DEFAULT_SITE_CONTROLS)));
      setToastMsg("Restored defaults. Click 'Save Changes' to apply.");
    }
  };

  // Helper reorder
  const moveItem = <T,>(arr: T[], index: number, direction: "up" | "down"): T[] => {
    const copy = [...arr];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= copy.length) return copy;
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    return copy;
  };

  if (loading || !controls) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-ivory text-charcoal">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-charcoal border-t-transparent" />
          <p className="mt-3 text-xs font-black uppercase tracking-wider text-charcoal/70">
            Loading TMUG Control Panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory pb-28 text-charcoal">
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="TMUG Logo"
                width={80}
                height={32}
                className="object-contain"
              />
            </Link>
            <span className="hidden sm:inline-block rounded-full border border-tea-gold/40 bg-warm-surface px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-charcoal">
              Control Panel
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-3.5 py-1.5 text-xs font-black text-charcoal transition-all hover:border-tea-gold hover:bg-warm-surface"
            >
              <span>Live Site</span>
              <span className="text-[10px]">↗</span>
            </Link>

            <Link
              href="/admin/seo"
              className="inline-flex items-center gap-1 rounded-full border border-charcoal/15 bg-white px-3.5 py-1.5 text-xs font-black text-charcoal transition-all hover:border-tea-gold hover:bg-warm-surface"
            >
              SEO Controls
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-charcoal/5 px-3.5 py-1.5 text-xs font-black text-charcoal/70 transition-all hover:bg-coral hover:text-white cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-charcoal/5 pt-2 pb-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("banners")}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition-all cursor-pointer ${
                activeTab === "banners"
                  ? "bg-charcoal text-white shadow-xs"
                  : "bg-white text-charcoal/70 hover:text-charcoal border border-charcoal/10"
              }`}
            >
              🖼️ Hero Banners ({controls.banners.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-charcoal text-white shadow-xs"
                  : "bg-white text-charcoal/70 hover:text-charcoal border border-charcoal/10"
              }`}
            >
              🍵 Products &amp; Prices ({controls.products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("collections")}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition-all cursor-pointer ${
                activeTab === "collections"
                  ? "bg-charcoal text-white shadow-xs"
                  : "bg-white text-charcoal/70 hover:text-charcoal border border-charcoal/10"
              }`}
            >
              📦 Collections ({controls.collections.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sections")}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition-all cursor-pointer ${
                activeTab === "sections"
                  ? "bg-charcoal text-white shadow-xs"
                  : "bg-white text-charcoal/70 hover:text-charcoal border border-charcoal/10"
              }`}
            >
              📑 Homepage Sections ({controls.sections.length})
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Tab Content ── */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
        {/* Alerts */}
        {toastMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-tea-gold/50 bg-warm-surface p-4 text-xs font-black text-charcoal shadow-sm">
            <IconCheck className="h-4 w-4 text-tea-gold" />
            <span>{toastMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 rounded-2xl border border-coral/30 bg-coral/10 p-4 text-xs font-black text-coral shadow-sm">
            {errorMsg}
          </div>
        )}

        {/* ── TAB 1: HERO BANNERS ── */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-charcoal">
                  Hero Campaign Banners
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/70">
                  Manage the rotating storefront campaign window. Drag or reorder, toggle visibility, and update campaign copy.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {controls.banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all ${
                    banner.enabled ? "border-charcoal/15" : "border-charcoal/10 opacity-60 bg-gray-50/50"
                  }`}
                >
                  <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                    {/* Thumbnail preview */}
                    <div className="lg:col-span-3">
                      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl border border-charcoal/10 bg-warm-surface">
                        <Image
                          src={banner.desktopSrc}
                          alt={banner.title}
                          fill
                          sizes="300px"
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 truncate text-[11px] font-mono text-charcoal/50">
                        {banner.desktopSrc}
                      </p>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 lg:col-span-7">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            Banner Headline
                          </label>
                          <input
                            type="text"
                            value={banner.title}
                            onChange={(e) => {
                              const updated = [...controls.banners];
                              updated[idx].title = e.target.value;
                              setControls({ ...controls, banners: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-bold text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            Subheading
                          </label>
                          <input
                            type="text"
                            value={banner.subtitle}
                            onChange={(e) => {
                              const updated = [...controls.banners];
                              updated[idx].subtitle = e.target.value;
                              setControls({ ...controls, banners: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-medium text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={banner.ctaText}
                            onChange={(e) => {
                              const updated = [...controls.banners];
                              updated[idx].ctaText = e.target.value;
                              setControls({ ...controls, banners: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-bold text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            CTA Link Target
                          </label>
                          <input
                            type="text"
                            value={banner.ctaLink}
                            onChange={(e) => {
                              const updated = [...controls.banners];
                              updated[idx].ctaLink = e.target.value;
                              setControls({ ...controls, banners: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-mono text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                      </div>

                      {/* Real Image Upload with Slot Requirements */}
                      <div className="grid gap-3 pt-1 sm:grid-cols-2">
                        <MediaUploadField
                          label="Desktop Banner (3:1)"
                          value={banner.desktopSrc}
                          onChange={(url) => {
                            const updated = [...controls.banners];
                            updated[idx].desktopSrc = url;
                            setControls({ ...controls, banners: updated });
                          }}
                          slotType="hero-banner"
                          aspectRatio="3:1"
                          recommendedDimensions="2172 × 724 px"
                          recommendedFormat="PNG / WEBP / JPG"
                        />
                        <MediaUploadField
                          label="Mobile Banner (1:1 / 4:3)"
                          value={banner.mobileSrc}
                          onChange={(url) => {
                            const updated = [...controls.banners];
                            updated[idx].mobileSrc = url;
                            setControls({ ...controls, banners: updated });
                          }}
                          slotType="hero-banner"
                          aspectRatio="1:1 or 4:3"
                          recommendedDimensions="1080 × 1080 px"
                          recommendedFormat="PNG / WEBP"
                        />
                      </div>
                    </div>

                    {/* Actions & Reordering */}
                    <div className="flex items-center justify-between gap-2 lg:col-span-2 lg:flex-col lg:items-end">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={banner.enabled}
                          onChange={(e) => {
                            const updated = [...controls.banners];
                            updated[idx].enabled = e.target.checked;
                            setControls({ ...controls, banners: updated });
                          }}
                          className="h-4 w-4 rounded text-coral focus:ring-coral"
                        />
                        <span className="text-xs font-black text-charcoal">
                          {banner.enabled ? "Visible" : "Hidden"}
                        </span>
                      </label>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const reordered = moveItem(controls.banners, idx, "up");
                            setControls({ ...controls, banners: reordered });
                          }}
                          className="h-7 w-7 rounded border border-charcoal/15 bg-white text-xs font-black hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === controls.banners.length - 1}
                          onClick={() => {
                            const reordered = moveItem(controls.banners, idx, "down");
                            setControls({ ...controls, banners: reordered });
                          }}
                          className="h-7 w-7 rounded border border-charcoal/15 bg-white text-xs font-black hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: PRODUCTS & PRICES ── */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-charcoal">
                Products &amp; Pricing Controls
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/70">
                Update live product prices (in INR), packshots, alternate back images, and feature flags.
              </p>
            </div>

            <div className="space-y-4">
              {controls.products.map((prod, idx) => (
                <div
                  key={prod.id}
                  className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all ${
                    prod.enabled ? "border-charcoal/15" : "border-charcoal/10 opacity-60 bg-gray-50/50"
                  }`}
                >
                  <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                    {/* Packshot thumbnail */}
                    <div className="flex items-center gap-3 lg:col-span-3">
                      <div className="relative h-16 w-16 shrink-0 rounded-xl border border-charcoal/10 bg-warm-surface p-1">
                        <Image
                          src={prod.frontImage}
                          alt={prod.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-black text-charcoal">
                          {prod.name}
                        </h3>
                        <span className="rounded-full bg-warm-ivory px-2 py-0.5 text-[10px] font-black uppercase text-charcoal/60">
                          {prod.category}
                        </span>
                      </div>
                    </div>

                    {/* Pricing & URLs */}
                    <div className="space-y-3 lg:col-span-6">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            Live Price (₹ INR)
                          </label>
                          <input
                            type="number"
                            value={prod.price}
                            onChange={(e) => {
                              const updated = [...controls.products];
                              updated[idx].price = Number(e.target.value) || 0;
                              setControls({ ...controls, products: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-black text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            Compare At Price (₹ INR)
                          </label>
                          <input
                            type="number"
                            value={prod.compareAtPrice || ""}
                            onChange={(e) => {
                              const updated = [...controls.products];
                              updated[idx].compareAtPrice = Number(e.target.value) || undefined;
                              setControls({ ...controls, products: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-bold text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                      </div>

                      {/* Product Media Management */}
                      <div className="space-y-3 pt-2">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <MediaUploadField
                            label="Front Packshot Cutout (1:1)"
                            value={prod.frontImage}
                            onChange={(url) => {
                              const updated = [...controls.products];
                              updated[idx].frontImage = url;
                              setControls({ ...controls, products: updated });
                            }}
                            slotType="product-cutout"
                            aspectRatio="1:1"
                            recommendedDimensions="1200 × 1200 px"
                            recommendedFormat="PNG"
                            transparencyPreferred={true}
                          />
                          <MediaUploadField
                            label="Back / Alternate Image"
                            value={prod.backImage || ""}
                            onChange={(url) => {
                              const updated = [...controls.products];
                              updated[idx].backImage = url;
                              setControls({ ...controls, products: updated });
                            }}
                            slotType="product-back"
                            aspectRatio="1:1 or 4:5"
                            recommendedDimensions="1200 × 1200 px"
                            recommendedFormat="JPG / PNG"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <MediaUploadField
                            label="Lifestyle / Campaign Asset"
                            value={prod.lifestyleImage || ""}
                            onChange={(url) => {
                              const updated = [...controls.products];
                              updated[idx].lifestyleImage = url;
                              setControls({ ...controls, products: updated });
                            }}
                            slotType="lifestyle"
                            aspectRatio="Source Ratio"
                            recommendedDimensions="1200 × 1500 px"
                            recommendedFormat="JPG / WEBP"
                          />
                          <MediaUploadField
                            label="Thumbnail (Square)"
                            value={prod.thumbnail || ""}
                            onChange={(url) => {
                              const updated = [...controls.products];
                              updated[idx].thumbnail = url;
                              setControls({ ...controls, products: updated });
                            }}
                            slotType="thumbnail"
                            aspectRatio="1:1"
                            recommendedDimensions="400 × 400 px"
                            recommendedFormat="PNG / WEBP"
                            transparencyPreferred={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Flags & Toggles */}
                    <div className="flex flex-wrap items-center justify-between gap-3 lg:col-span-3 lg:flex-col lg:items-end">
                      <div className="flex flex-wrap gap-3">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prod.isBestSeller}
                            onChange={(e) => {
                              const updated = [...controls.products];
                              updated[idx].isBestSeller = e.target.checked;
                              setControls({ ...controls, products: updated });
                            }}
                            className="h-3.5 w-3.5 rounded text-coral focus:ring-coral"
                          />
                          <span className="text-[11px] font-bold text-charcoal">Best Seller</span>
                        </label>

                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prod.isPopularPick}
                            onChange={(e) => {
                              const updated = [...controls.products];
                              updated[idx].isPopularPick = e.target.checked;
                              setControls({ ...controls, products: updated });
                            }}
                            className="h-3.5 w-3.5 rounded text-coral focus:ring-coral"
                          />
                          <span className="text-[11px] font-bold text-charcoal">Popular Pick</span>
                        </label>

                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prod.enabled}
                            onChange={(e) => {
                              const updated = [...controls.products];
                              updated[idx].enabled = e.target.checked;
                              setControls({ ...controls, products: updated });
                            }}
                            className="h-3.5 w-3.5 rounded text-coral focus:ring-coral"
                          />
                          <span className="text-[11px] font-bold text-charcoal">Active</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const reordered = moveItem(controls.products, idx, "up");
                            setControls({ ...controls, products: reordered });
                          }}
                          className="h-7 w-7 rounded border border-charcoal/15 bg-white text-xs font-black hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === controls.products.length - 1}
                          onClick={() => {
                            const reordered = moveItem(controls.products, idx, "down");
                            setControls({ ...controls, products: reordered });
                          }}
                          className="h-7 w-7 rounded border border-charcoal/15 bg-white text-xs font-black hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: COLLECTIONS ── */}
        {activeTab === "collections" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-charcoal">
                Collections Controls
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/70">
                Manage collection categories, descriptions, and storefront display order.
              </p>
            </div>

            <div className="space-y-4">
              {controls.collections.map((col, idx) => (
                <div
                  key={col.id}
                  className="rounded-2xl border border-charcoal/15 bg-white p-4 sm:p-5 shadow-xs"
                >
                  <div className="grid gap-4 sm:grid-cols-12 sm:items-center">
                    <div className="space-y-3 sm:col-span-10">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            Collection Name
                          </label>
                          <input
                            type="text"
                            value={col.name}
                            onChange={(e) => {
                              const updated = [...controls.collections];
                              updated[idx].name = e.target.value;
                              setControls({ ...controls, collections: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-black text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            Category Identifier
                          </label>
                          <input
                            type="text"
                            disabled
                            value={col.id}
                            className="mt-1 w-full rounded-lg border border-charcoal/10 bg-gray-50 px-3 py-1.5 text-xs font-mono text-charcoal/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase text-charcoal/60">
                          Description
                        </label>
                        <input
                          type="text"
                          value={col.description}
                          onChange={(e) => {
                            const updated = [...controls.collections];
                            updated[idx].description = e.target.value;
                            setControls({ ...controls, collections: updated });
                          }}
                          className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs text-charcoal outline-none focus:border-coral"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:col-span-2 sm:flex-col sm:items-end gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={col.enabled}
                          onChange={(e) => {
                            const updated = [...controls.collections];
                            updated[idx].enabled = e.target.checked;
                            setControls({ ...controls, collections: updated });
                          }}
                          className="h-4 w-4 rounded text-coral focus:ring-coral"
                        />
                        <span className="text-xs font-black text-charcoal">
                          {col.enabled ? "Active" : "Hidden"}
                        </span>
                      </label>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const reordered = moveItem(controls.collections, idx, "up");
                            setControls({ ...controls, collections: reordered });
                          }}
                          className="h-7 w-7 rounded border border-charcoal/15 bg-white text-xs font-black hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === controls.collections.length - 1}
                          onClick={() => {
                            const reordered = moveItem(controls.collections, idx, "down");
                            setControls({ ...controls, collections: reordered });
                          }}
                          className="h-7 w-7 rounded border border-charcoal/15 bg-white text-xs font-black hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: HOMEPAGE SECTIONS ── */}
        {activeTab === "sections" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-charcoal">
                Homepage Sections &amp; Headings Controls
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/70">
                Toggle section visibility on/off, reorder page sequence, and customize headlines &amp; CTAs.
              </p>
            </div>

            <div className="space-y-4">
              {controls.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all ${
                    sec.enabled ? "border-charcoal/15" : "border-charcoal/10 opacity-60 bg-gray-50/50"
                  }`}
                >
                  <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warm-surface text-[10px] font-black text-charcoal">
                          {idx + 1}
                        </span>
                        <h3 className="font-display text-sm font-black text-charcoal">
                          {sec.label}
                        </h3>
                      </div>
                      <p className="mt-1 text-[11px] font-mono text-charcoal/50">
                        #{sec.id}
                      </p>
                    </div>

                    <div className="space-y-3 lg:col-span-7">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            Section Heading
                          </label>
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={(e) => {
                              const updated = [...controls.sections];
                              updated[idx].heading = e.target.value;
                              setControls({ ...controls, sections: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-bold text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase text-charcoal/60">
                            Subheading / Description
                          </label>
                          <input
                            type="text"
                            value={sec.subheading}
                            onChange={(e) => {
                              const updated = [...controls.sections];
                              updated[idx].subheading = e.target.value;
                              setControls({ ...controls, sections: updated });
                            }}
                            className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs text-charcoal outline-none focus:border-coral"
                          />
                        </div>
                      </div>

                      {sec.ctaText !== undefined && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-black uppercase text-charcoal/60">
                              CTA Text
                            </label>
                            <input
                              type="text"
                              value={sec.ctaText || ""}
                              onChange={(e) => {
                                const updated = [...controls.sections];
                                updated[idx].ctaText = e.target.value;
                                setControls({ ...controls, sections: updated });
                              }}
                              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-bold text-charcoal outline-none focus:border-coral"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-black uppercase text-charcoal/60">
                              CTA Target Link
                            </label>
                            <input
                              type="text"
                              value={sec.ctaLink || ""}
                              onChange={(e) => {
                                const updated = [...controls.sections];
                                updated[idx].ctaLink = e.target.value;
                                setControls({ ...controls, sections: updated });
                              }}
                              className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-mono text-charcoal outline-none focus:border-coral"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 lg:col-span-2 lg:flex-col lg:items-end">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sec.enabled}
                          onChange={(e) => {
                            const updated = [...controls.sections];
                            updated[idx].enabled = e.target.checked;
                            setControls({ ...controls, sections: updated });
                          }}
                          className="h-4 w-4 rounded text-coral focus:ring-coral"
                        />
                        <span className="text-xs font-black text-charcoal">
                          {sec.enabled ? "Active" : "Disabled"}
                        </span>
                      </label>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const reordered = moveItem(controls.sections, idx, "up");
                            setControls({ ...controls, sections: reordered });
                          }}
                          className="h-7 w-7 rounded border border-charcoal/15 bg-white text-xs font-black hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === controls.sections.length - 1}
                          onClick={() => {
                            const reordered = moveItem(controls.sections, idx, "down");
                            setControls({ ...controls, sections: reordered });
                          }}
                          className="h-7 w-7 rounded border border-charcoal/15 bg-white text-xs font-black hover:bg-warm-surface disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Sticky Bottom Action Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-charcoal/10 bg-white/95 p-3 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-black text-charcoal/60 hover:text-coral transition-colors cursor-pointer"
          >
            Reset All to Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-tea-gold hover:text-charcoal active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <IconCheck className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

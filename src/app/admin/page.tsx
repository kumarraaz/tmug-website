"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  SiteControls,
  HeroBannerControl,
  ProductControl,
  CollectionControl,
  SectionControl,
  SiteControlsHistoryItem,
} from "@/types";
import { DEFAULT_SITE_CONTROLS } from "@/config/site-controls";
import { formatINR } from "@/lib/format";
import { IconCheck, IconTrash, IconArrowRight, IconSparkle, IconClose } from "@/components/icons";
import MediaUploadField from "./MediaUploadField";
import ColorField from "./components/ColorField";
import TypographyField from "./components/TypographyField";
import HoverEffectField from "./components/HoverEffectField";
import LivePreviewPane from "./components/LivePreviewPane";

type NavigationCategory =
  | "dashboard"
  | "global-colors"
  | "global-typography"
  | "global-spacing"
  | "global-buttons"
  | "global-animations"
  | "header-layout"
  | "header-nav"
  | "header-announcement"
  | "sec-hero"
  | "sec-trust"
  | "sec-collections"
  | "sec-bestsellers"
  | "sec-openreveal"
  | "sec-whytmug"
  | "sec-realtea"
  | "sec-teastory"
  | "sec-recipes"
  | "sec-lifestyle"
  | "sec-brandproof"
  | "sec-customerlove"
  | "sec-stores"
  | "sec-finalcta"
  | "catalog-products"
  | "catalog-collections"
  | "comp-productcard"
  | "comp-cartdrawer"
  | "comp-quickview"
  | "overlay-promo"
  | "overlay-whatsapp"
  | "media-library"
  | "footer-settings"
  | "live-preview"
  | "history-rollback";

export default function AdminControlCenter() {
  const router = useRouter();
  const [controls, setControls] = useState<SiteControls | null>(null);
  const [publishedControls, setPublishedControls] = useState<SiteControls | null>(null);
  const [history, setHistory] = useState<SiteControlsHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<NavigationCategory>("dashboard");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Track expanded groups in sidebar
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    global: true,
    header: true,
    sections: true,
    products: false,
    components: false,
    overlays: false,
  });

  const toggleGroup = (grp: string) => {
    setExpandedGroups((prev) => ({ ...prev, [grp]: !prev[grp] }));
  };

  // Fetch controls & check auth on mount
  useEffect(() => {
    fetch("/api/admin/site-controls")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authed) {
          router.push("/admin/login");
          return;
        }
        setControls(data.draft || data.controls || DEFAULT_SITE_CONTROLS);
        setPublishedControls(data.published || DEFAULT_SITE_CONTROLS);
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const hasDraftChanges = useMemo(() => {
    if (!controls || !publishedControls) return false;
    return JSON.stringify(controls) !== JSON.stringify(publishedControls);
  }, [controls, publishedControls]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
  };

  const handleSaveDraft = async () => {
    if (!controls) return;
    setSaving(true);
    setToastMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/site-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save-draft", controls }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save draft.");
      } else {
        setToastMsg("Draft saved! Ready to preview or publish. ✓");
        setTimeout(() => setToastMsg(""), 4000);
      }
    } catch {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!controls) return;
    setPublishing(true);
    setToastMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/site-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", controls }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Publish failed.");
      } else {
        setPublishedControls(JSON.parse(JSON.stringify(controls)));
        setToastMsg("🚀 Live site updated! All changes are now published.");
        setTimeout(() => setToastMsg(""), 5000);

        // Refresh history
        const statusRes = await fetch("/api/admin/site-controls");
        const statusData = await statusRes.json();
        if (statusData.history) setHistory(statusData.history);
      }
    } catch {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDiscardDraft = async () => {
    if (!publishedControls) return;
    if (confirm("Discard all uncommitted draft changes and revert to live settings?")) {
      setControls(JSON.parse(JSON.stringify(publishedControls)));
      await fetch("/api/admin/site-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "discard-draft" }),
      });
      setToastMsg("Draft reverted to published live version.");
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  const handleResetDefaults = async () => {
    if (confirm("Restore all settings to default TMUG design system?")) {
      const reset = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTROLS));
      setControls(reset);
      await fetch("/api/admin/site-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-defaults" }),
      });
      setToastMsg("Settings restored to factory defaults. Click Publish to apply live.");
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  const handleRollback = async (historyId: string) => {
    if (confirm("Rollback live storefront to this historical snapshot?")) {
      const res = await fetch("/api/admin/site-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback", historyId }),
      });
      const data = await res.json();
      if (res.ok) {
        const found = history.find((h) => h.id === historyId);
        if (found) {
          setControls(found.controls);
          setPublishedControls(found.controls);
        }
        setToastMsg("Storefront rolled back successfully! ✓");
        setTimeout(() => setToastMsg(""), 4000);
      } else {
        setErrorMsg(data.error || "Rollback failed.");
      }
    }
  };

  // Helper reorder for lists
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
            Loading TMUG Visual Control Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F5] text-charcoal">
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/tmug-logo.png"
                alt="TMUG Logo"
                width={88}
                height={40}
                className="h-8 w-auto object-contain drop-shadow-xs"
              />
            </Link>
            <span className="hidden sm:inline-block rounded-full bg-charcoal px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Visual Control Center
            </span>
            {hasDraftChanges ? (
              <span className="rounded-full bg-coral/15 px-2.5 py-0.5 text-[10px] font-extrabold text-coral border border-coral/30">
                ● Unsaved Draft Changes
              </span>
            ) : (
              <span className="hidden md:inline-block rounded-full bg-tea-green/40 px-2.5 py-0.5 text-[10px] font-extrabold text-charcoal border border-charcoal/10">
                ✓ Synced With Live
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("live-preview")}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "live-preview"
                  ? "bg-tea-gold border-charcoal text-charcoal font-black shadow-xs"
                  : "border-charcoal/15 bg-white text-charcoal hover:bg-warm-surface"
              }`}
            >
              👁 Preview
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="rounded-xl border border-charcoal/20 bg-white px-3.5 py-1.5 text-xs font-bold text-charcoal shadow-xs transition-all hover:bg-warm-surface active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-xl bg-charcoal px-4 py-1.5 text-xs font-black text-white shadow-md transition-all hover:bg-deep-plum active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Publish Live 🚀"}
            </button>

            <button
              type="button"
              onClick={handleDiscardDraft}
              disabled={!hasDraftChanges}
              title="Discard draft changes"
              className="hidden lg:inline-block rounded-xl border border-charcoal/15 bg-white px-2.5 py-1.5 text-xs font-bold text-charcoal/70 hover:text-coral hover:border-coral/30 cursor-pointer disabled:opacity-40"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-charcoal/15 px-2.5 py-1.5 text-xs font-bold text-charcoal/70 hover:bg-charcoal/5 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout: Sidebar Navigation + Settings Canvas ── */}
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6">
        {/* ── Left Sidebar Navigation ── */}
        <aside className="w-64 shrink-0 space-y-4">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-charcoal/10 bg-white p-3 shadow-xs nice-scroll">
            {/* Quick Actions */}
            <div className="space-y-1 pb-3 border-b border-charcoal/10">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-black transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-charcoal text-white shadow-xs"
                    : "text-charcoal/80 hover:bg-warm-surface hover:text-charcoal"
                }`}
              >
                <span>📊 Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("live-preview")}
                className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-black transition-all cursor-pointer ${
                  activeTab === "live-preview"
                    ? "bg-charcoal text-white shadow-xs"
                    : "text-charcoal/80 hover:bg-warm-surface hover:text-charcoal"
                }`}
              >
                <span>👁 Responsive Preview</span>
                <span className="ml-auto rounded-full bg-tea-gold px-1.5 py-0.2 text-[9px] font-black text-charcoal">
                  Live
                </span>
              </button>
            </div>

            {/* 1. Global Design System */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleGroup("global")}
                className="flex w-full items-center justify-between px-2 text-[11px] font-black uppercase tracking-wider text-charcoal/60"
              >
                <span>Global Design</span>
                <span>{expandedGroups.global ? "−" : "+"}</span>
              </button>
              {expandedGroups.global && (
                <div className="mt-1 space-y-0.5">
                  {[
                    { id: "global-colors", label: "Brand Colors" },
                    { id: "global-typography", label: "Typography" },
                    { id: "global-spacing", label: "Spacing & Layout" },
                    { id: "global-buttons", label: "Buttons & Links" },
                    { id: "global-animations", label: "Hover & Motion" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveTab(sub.id as NavigationCategory)}
                      className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        activeTab === sub.id
                          ? "bg-warm-surface text-charcoal font-black"
                          : "text-charcoal/70 hover:bg-warm-surface/60 hover:text-charcoal"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Header & Navigation */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleGroup("header")}
                className="flex w-full items-center justify-between px-2 text-[11px] font-black uppercase tracking-wider text-charcoal/60"
              >
                <span>Header & Nav</span>
                <span>{expandedGroups.header ? "−" : "+"}</span>
              </button>
              {expandedGroups.header && (
                <div className="mt-1 space-y-0.5">
                  {[
                    { id: "header-layout", label: "Navbar & Logo" },
                    { id: "header-nav", label: "Nav Links & Menu" },
                    { id: "header-announcement", label: "Announcement Bar" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveTab(sub.id as NavigationCategory)}
                      className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        activeTab === sub.id
                          ? "bg-warm-surface text-charcoal font-black"
                          : "text-charcoal/70 hover:bg-warm-surface/60 hover:text-charcoal"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Homepage Sections */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleGroup("sections")}
                className="flex w-full items-center justify-between px-2 text-[11px] font-black uppercase tracking-wider text-charcoal/60"
              >
                <span>Homepage Sections</span>
                <span>{expandedGroups.sections ? "−" : "+"}</span>
              </button>
              {expandedGroups.sections && (
                <div className="mt-1 space-y-0.5">
                  {[
                    { id: "sec-hero", label: "01. Hero Banners" },
                    { id: "sec-trust", label: "02. Trust Strip" },
                    { id: "sec-collections", label: "03. Shop Collections" },
                    { id: "sec-bestsellers", label: "04. Best Sellers" },
                    { id: "sec-openreveal", label: "05. Box Opener" },
                    { id: "sec-whytmug", label: "06. Why TMUG" },
                    { id: "sec-realtea", label: "07. Real Botanicals" },
                    { id: "sec-teastory", label: "08. Tea Story Rituals" },
                    { id: "sec-recipes", label: "09. Recipes & Rituals" },
                    { id: "sec-lifestyle", label: "10. Moments Gallery" },
                    { id: "sec-brandproof", label: "11. Brand Proof" },
                    { id: "sec-customerlove", label: "12. Reviews" },
                    { id: "sec-stores", label: "13. Store Channels" },
                    { id: "sec-finalcta", label: "14. Final CTA" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveTab(sub.id as NavigationCategory)}
                      className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        activeTab === sub.id
                          ? "bg-warm-surface text-charcoal font-black"
                          : "text-charcoal/70 hover:bg-warm-surface/60 hover:text-charcoal"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Products & Catalog */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleGroup("products")}
                className="flex w-full items-center justify-between px-2 text-[11px] font-black uppercase tracking-wider text-charcoal/60"
              >
                <span>Product Catalog</span>
                <span>{expandedGroups.products ? "−" : "+"}</span>
              </button>
              {expandedGroups.products && (
                <div className="mt-1 space-y-0.5">
                  {[
                    { id: "catalog-products", label: "Products & Prices" },
                    { id: "catalog-collections", label: "Collections" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveTab(sub.id as NavigationCategory)}
                      className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        activeTab === sub.id
                          ? "bg-warm-surface text-charcoal font-black"
                          : "text-charcoal/70 hover:bg-warm-surface/60 hover:text-charcoal"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Product Components & Overlays */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => toggleGroup("components")}
                className="flex w-full items-center justify-between px-2 text-[11px] font-black uppercase tracking-wider text-charcoal/60"
              >
                <span>Components & Overlays</span>
                <span>{expandedGroups.components ? "−" : "+"}</span>
              </button>
              {expandedGroups.components && (
                <div className="mt-1 space-y-0.5">
                  {[
                    { id: "comp-productcard", label: "Product Cards" },
                    { id: "comp-cartdrawer", label: "Cart Drawer" },
                    { id: "comp-quickview", label: "Quick View Popup" },
                    { id: "overlay-promo", label: "Promo Popup" },
                    { id: "overlay-whatsapp", label: "WhatsApp Button" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveTab(sub.id as NavigationCategory)}
                      className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        activeTab === sub.id
                          ? "bg-warm-surface text-charcoal font-black"
                          : "text-charcoal/70 hover:bg-warm-surface/60 hover:text-charcoal"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Media Library & Footer */}
            <div className="pt-3">
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("media-library")}
                  className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "media-library"
                      ? "bg-warm-surface text-charcoal font-black"
                      : "text-charcoal/70 hover:bg-warm-surface/60 hover:text-charcoal"
                  }`}
                >
                  🖼 Media Library
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("footer-settings")}
                  className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "footer-settings"
                      ? "bg-warm-surface text-charcoal font-black"
                      : "text-charcoal/70 hover:bg-warm-surface/60 hover:text-charcoal"
                  }`}
                >
                  ⚓ Footer Settings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("history-rollback")}
                  className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "history-rollback"
                      ? "bg-warm-surface text-charcoal font-black"
                      : "text-charcoal/70 hover:bg-warm-surface/60 hover:text-charcoal"
                  }`}
                >
                  ⏱ History & Rollback
                </button>
              </div>
            </div>

            {/* Reset Defaults button */}
            <div className="pt-4 mt-3 border-t border-charcoal/10">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="w-full rounded-xl border border-charcoal/15 bg-white py-1.5 text-[11px] font-black text-charcoal/60 hover:text-coral hover:border-coral/40 transition-colors"
              >
                Reset Factory Defaults
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main Canvas ── */}
        <main className="flex-1 min-w-0">
          {/* Notifications */}
          {toastMsg && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-tea-gold/50 bg-warm-surface p-4 text-xs font-black text-charcoal shadow-sm">
              <div className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-tea-gold" />
                <span>{toastMsg}</span>
              </div>
              <button type="button" onClick={() => setToastMsg("")} className="cursor-pointer">
                <IconClose className="h-4 w-4" />
              </button>
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-coral/30 bg-coral/10 p-4 text-xs font-black text-coral shadow-sm">
              <span>{errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg("")} className="cursor-pointer">
                <IconClose className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: DASHBOARD                                            */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs">
                <h2 className="font-display text-2xl font-black text-charcoal">
                  TMUG Website Visual Control Center
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  Welcome! You have complete visual, typography, layout, animation, and catalog control over every website section without writing any code.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-charcoal/10 bg-warm-surface/40 p-4">
                    <p className="text-[11px] font-black uppercase text-charcoal/60">Campaign Banners</p>
                    <p className="mt-1 font-display text-2xl font-black text-charcoal">{controls.banners.length}</p>
                    <p className="text-[11px] text-charcoal/70">{controls.banners.filter((b) => b.enabled).length} active</p>
                  </div>
                  <div className="rounded-2xl border border-charcoal/10 bg-warm-surface/40 p-4">
                    <p className="text-[11px] font-black uppercase text-charcoal/60">Catalog Products</p>
                    <p className="mt-1 font-display text-2xl font-black text-charcoal">{controls.products.length}</p>
                    <p className="text-[11px] text-charcoal/70">{controls.products.filter((p) => p.enabled).length} active</p>
                  </div>
                  <div className="rounded-2xl border border-charcoal/10 bg-warm-surface/40 p-4">
                    <p className="text-[11px] font-black uppercase text-charcoal/60">Homepage Sections</p>
                    <p className="mt-1 font-display text-2xl font-black text-charcoal">14</p>
                    <p className="text-[11px] text-charcoal/70">Fully customizable</p>
                  </div>
                  <div className="rounded-2xl border border-charcoal/10 bg-warm-surface/40 p-4">
                    <p className="text-[11px] font-black uppercase text-charcoal/60">Draft Status</p>
                    <p className="mt-1 font-display text-base font-black text-charcoal">
                      {hasDraftChanges ? "Unsaved Changes" : "Live & Synced"}
                    </p>
                    <p className="text-[11px] text-charcoal/70">{hasDraftChanges ? "Ready to publish" : "Up to date"}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("live-preview")}
                    className="rounded-2xl bg-charcoal px-5 py-2.5 text-xs font-black text-white hover:bg-deep-plum cursor-pointer"
                  >
                    Launch Live Preview ↗
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("global-colors")}
                    className="rounded-2xl border border-charcoal/15 bg-white px-5 py-2.5 text-xs font-bold text-charcoal hover:bg-warm-surface cursor-pointer"
                  >
                    Edit Brand Palette
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("header-layout")}
                    className="rounded-2xl border border-charcoal/15 bg-white px-5 py-2.5 text-xs font-bold text-charcoal hover:bg-warm-surface cursor-pointer"
                  >
                    Customize Navbar
                  </button>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div
                  onClick={() => setActiveTab("global-colors")}
                  className="rounded-3xl border border-charcoal/10 bg-white p-5 hover:border-tea-gold transition-all cursor-pointer shadow-xs"
                >
                  <span className="text-2xl">🎨</span>
                  <h3 className="mt-2 font-display text-base font-extrabold text-charcoal">Brand Colors & Palette</h3>
                  <p className="mt-1 text-xs text-charcoal/70">Change primary, canvas, buttons, and section color overrides.</p>
                </div>
                <div
                  onClick={() => setActiveTab("global-typography")}
                  className="rounded-3xl border border-charcoal/10 bg-white p-5 hover:border-tea-gold transition-all cursor-pointer shadow-xs"
                >
                  <span className="text-2xl">✍️</span>
                  <h3 className="mt-2 font-display text-base font-extrabold text-charcoal">Typography Controls</h3>
                  <p className="mt-1 text-xs text-charcoal/70">Pick fonts, adjust base font size, weights, and heading scales.</p>
                </div>
                <div
                  onClick={() => setActiveTab("sec-hero")}
                  className="rounded-3xl border border-charcoal/10 bg-white p-5 hover:border-tea-gold transition-all cursor-pointer shadow-xs"
                >
                  <span className="text-2xl">🎠</span>
                  <h3 className="mt-2 font-display text-base font-extrabold text-charcoal">Hero Slider Banners</h3>
                  <p className="mt-1 text-xs text-charcoal/70">Add banners, edit headlines, change autoplay speed and heights.</p>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: GLOBAL BRAND COLORS                                  */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "global-colors" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Global Brand Palette</h2>
                <p className="text-sm text-charcoal/70">
                  Configure sitewide colors. These tokens propagate to all components, buttons, and sections unless an individual section has a local override.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ColorField
                  label="Primary Accent (Cherry Blossom)"
                  value={controls.global.colors.brandPrimary}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.brandPrimary = c;
                    setControls(updated);
                  }}
                  description="Main Gen-Z playful accent, badge highlights"
                />
                <ColorField
                  label="Secondary Accent (Fawn)"
                  value={controls.global.colors.brandSecondary}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.brandSecondary = c;
                    setControls(updated);
                  }}
                  description="Warm tea highlights and card borders"
                />
                <ColorField
                  label="Gold Accent (Maize / Tea Gold)"
                  value={controls.global.colors.brandGold}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.brandGold = c;
                    setControls(updated);
                  }}
                  description="Bestseller badges, promo ribbons, active pills"
                />
                <ColorField
                  label="Sky Blue (Butterfly Pea)"
                  value={controls.global.colors.brandSkyBlue}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.brandSkyBlue = c;
                    setControls(updated);
                  }}
                  description="Aparajita floral accent"
                />
                <ColorField
                  label="Canvas Background (Warm Ivory)"
                  value={controls.global.colors.canvas}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.canvas = c;
                    setControls(updated);
                  }}
                  description="Main page body background"
                />
                <ColorField
                  label="Surface / Card Container (Peach Cream)"
                  value={controls.global.colors.surface}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.surface = c;
                    setControls(updated);
                  }}
                  description="Secondary section and card surfaces"
                />
                <ColorField
                  label="Warm Charcoal (Dark Sections & Buttons)"
                  value={controls.global.colors.charcoal}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.charcoal = c;
                    setControls(updated);
                  }}
                  description="Navigation bar, primary dark buttons, footer"
                />
                <ColorField
                  label="Deep Plum (Primary Heading Text)"
                  value={controls.global.colors.deepPlum}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.deepPlum = c;
                    setControls(updated);
                  }}
                  description="High-contrast editorial typography"
                />
                <ColorField
                  label="Default Border Color"
                  value={controls.global.colors.borderDefault}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.colors.borderDefault = c;
                    setControls(updated);
                  }}
                  description="Subtle hairline dividers across the site"
                />
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: GLOBAL TYPOGRAPHY                                    */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "global-typography" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Global Typography</h2>
                <p className="text-sm text-charcoal/70">
                  Select fonts, customize base font sizes, heading weights, and letter-spacing across the entire website.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <TypographyField
                  label="Headline / Display Font"
                  fontFamily={controls.global.typography.fontDisplay}
                  onFontFamilyChange={(f) => {
                    const updated = { ...controls };
                    updated.global.typography.fontDisplay = f;
                    setControls(updated);
                  }}
                  fontWeight={controls.global.typography.headingWeight}
                  onFontWeightChange={(w) => {
                    const updated = { ...controls };
                    updated.global.typography.headingWeight = w;
                    setControls(updated);
                  }}
                  letterSpacing={controls.global.typography.letterSpacing}
                  onLetterSpacingChange={(s) => {
                    const updated = { ...controls };
                    updated.global.typography.letterSpacing = s;
                    setControls(updated);
                  }}
                />

                <TypographyField
                  label="Body / Content Font"
                  fontFamily={controls.global.typography.fontBody}
                  onFontFamilyChange={(f) => {
                    const updated = { ...controls };
                    updated.global.typography.fontBody = f;
                    setControls(updated);
                  }}
                  fontSize={controls.global.typography.baseFontSize}
                  onFontSizeChange={(size) => {
                    const updated = { ...controls };
                    updated.global.typography.baseFontSize = size;
                    setControls(updated);
                  }}
                  minSize={14}
                  maxSize={20}
                />
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: GLOBAL BUTTONS & LINKS                               */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "global-buttons" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Buttons & Call-to-Actions</h2>
                <p className="text-sm text-charcoal/70">
                  Style default primary and secondary buttons, corner radii, and hover animation effects.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <ColorField
                  label="Primary Button Background"
                  value={controls.global.buttons.primaryBg}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.buttons.primaryBg = c;
                    setControls(updated);
                  }}
                />
                <ColorField
                  label="Primary Button Text"
                  value={controls.global.buttons.primaryText}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.buttons.primaryText = c;
                    setControls(updated);
                  }}
                />
                <ColorField
                  label="Primary Button Hover Bg"
                  value={controls.global.buttons.primaryHoverBg}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.buttons.primaryHoverBg = c;
                    setControls(updated);
                  }}
                />
                <ColorField
                  label="Primary Button Hover Text"
                  value={controls.global.buttons.primaryHoverText}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.global.buttons.primaryHoverText = c;
                    setControls(updated);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-charcoal/70">Button Corner Radius</label>
                  <div className="flex gap-2">
                    {[
                      { label: "Pill (Full)", value: "rounded-full" },
                      { label: "Soft (2XL)", value: "rounded-2xl" },
                      { label: "Medium (XL)", value: "rounded-xl" },
                      { label: "Sharp (None)", value: "rounded-none" },
                    ].map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => {
                          const updated = { ...controls };
                          updated.global.buttons.radius = r.value;
                          setControls(updated);
                        }}
                        className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-all cursor-pointer ${
                          controls.global.buttons.radius === r.value
                            ? "border-charcoal bg-charcoal text-white"
                            : "border-charcoal/15 bg-white text-charcoal hover:border-tea-gold"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <HoverEffectField
                  label="Button Hover Animation"
                  value={controls.global.buttons.hoverEffect}
                  onChange={(eff) => {
                    const updated = { ...controls };
                    updated.global.buttons.hoverEffect = eff;
                    setControls(updated);
                  }}
                />
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: GLOBAL ANIMATIONS & HOVER                             */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "global-animations" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Hover & Animation Control</h2>
                <p className="text-sm text-charcoal/70">
                  Control sitewide motion, transition speeds, and card hover physics. Full accessibility and reduced-motion compliant.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <HoverEffectField
                  label="Default Product Card Hover Effect"
                  value={controls.global.animations.cardHoverEffect}
                  onChange={(eff) => {
                    const updated = { ...controls };
                    updated.global.animations.cardHoverEffect = eff;
                    setControls(updated);
                  }}
                  duration={controls.global.animations.transitionDuration}
                  onDurationChange={(ms) => {
                    const updated = { ...controls };
                    updated.global.animations.transitionDuration = ms;
                    setControls(updated);
                  }}
                />

                <div className="space-y-4 rounded-2xl border border-charcoal/10 bg-warm-surface/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-charcoal">Animations Enabled</p>
                      <p className="text-[11px] text-charcoal/60">Toggle all CSS and Framer Motion transitions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={controls.global.animations.enabled}
                      onChange={(e) => {
                        const updated = { ...controls };
                        updated.global.animations.enabled = e.target.checked;
                        setControls(updated);
                      }}
                      className="h-5 w-5 accent-charcoal cursor-pointer"
                    />
                  </div>

                  <div className="border-t border-charcoal/10 pt-3">
                    <p className="text-xs font-bold text-charcoal">Accessibility Guarantee:</p>
                    <p className="mt-1 text-[11px] text-charcoal/70">
                      Users with <code>prefers-reduced-motion</code> set in their operating system will always receive zero disruptive animations regardless of admin settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: NAVBAR & LOGO LAYOUT                                 */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "header-layout" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Header & Navbar Controls</h2>
                <p className="text-sm text-charcoal/70">
                  Control the navigation bar layout, background, logo sizing, vertical height, and sticky behavior.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ColorField
                  label="Navbar Background"
                  value={controls.header.background}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.header.background = c;
                    setControls(updated);
                  }}
                  description="Primary header bar color"
                />
                <ColorField
                  label="Navbar Text Color"
                  value={controls.header.textColor}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.header.textColor = c;
                    setControls(updated);
                  }}
                  description="Navigation labels, icons"
                />
                <ColorField
                  label="Cart Badge Background"
                  value={controls.header.cartBadgeBg}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.header.cartBadgeBg = c;
                    setControls(updated);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal">Header Height Desktop</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={56}
                      max={96}
                      value={controls.header.heightDesktop}
                      onChange={(e) => {
                        const updated = { ...controls };
                        updated.header.heightDesktop = Number(e.target.value);
                        setControls(updated);
                      }}
                      className="flex-1 accent-charcoal"
                    />
                    <span className="font-mono text-xs font-bold">{controls.header.heightDesktop}px</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal">Logo Height (px)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={30}
                      max={64}
                      value={controls.header.logoHeight}
                      onChange={(e) => {
                        const updated = { ...controls };
                        updated.header.logoHeight = Number(e.target.value);
                        setControls(updated);
                      }}
                      className="flex-1 accent-charcoal"
                    />
                    <span className="font-mono text-xs font-bold">{controls.header.logoHeight}px</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal">Nav Font Size (px)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={14}
                      max={22}
                      value={controls.header.navFontSize}
                      onChange={(e) => {
                        const updated = { ...controls };
                        updated.header.navFontSize = Number(e.target.value);
                        setControls(updated);
                      }}
                      className="flex-1 accent-charcoal"
                    />
                    <span className="font-mono text-xs font-bold">{controls.header.navFontSize}px</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal">Sticky Navigation</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      checked={controls.header.sticky}
                      onChange={(e) => {
                        const updated = { ...controls };
                        updated.header.sticky = e.target.checked;
                        setControls(updated);
                      }}
                      className="h-5 w-5 accent-charcoal cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-charcoal">Affix to top on scroll</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: ANNOUNCEMENT BAR                                     */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "header-announcement" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Announcement Bar Settings</h2>
                <p className="text-sm text-charcoal/70">
                  Control the sitewide promotional marquee strip running above the main header.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-warm-surface/30 p-4">
                <input
                  type="checkbox"
                  checked={controls.header.showAnnouncement}
                  onChange={(e) => {
                    const updated = { ...controls };
                    updated.header.showAnnouncement = e.target.checked;
                    setControls(updated);
                  }}
                  className="h-5 w-5 accent-charcoal cursor-pointer"
                />
                <div>
                  <p className="text-xs font-bold text-charcoal">Show Announcement Bar</p>
                  <p className="text-[11px] text-charcoal/60">Display continuous promo ribbon on top</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-charcoal">Custom Announcement Text</label>
                <input
                  type="text"
                  value={controls.header.announcementText}
                  onChange={(e) => {
                    const updated = { ...controls };
                    updated.header.announcementText = e.target.value;
                    setControls(updated);
                  }}
                  placeholder="e.g. Festive offer — 10% off with code TMUG10"
                  className="w-full rounded-xl border border-charcoal/20 bg-white p-3 text-xs font-semibold text-charcoal focus:border-tea-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ColorField
                  label="Announcement Bar Background"
                  value={controls.header.announcementBg}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.header.announcementBg = c;
                    setControls(updated);
                  }}
                />
                <ColorField
                  label="Announcement Text Color"
                  value={controls.header.announcementTextColor}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.header.announcementTextColor = c;
                    setControls(updated);
                  }}
                />
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: HERO SECTION & BANNERS                               */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "sec-hero" && (
            <div className="space-y-6">
              {/* Slider Settings */}
              <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-black text-charcoal">Hero Slider Controls</h2>
                    <p className="text-sm text-charcoal/70">Configure rotating campaign slider parameters</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal">Enabled</span>
                    <input
                      type="checkbox"
                      checked={controls.sectionsVisual.hero.enabled}
                      onChange={(e) => {
                        const updated = { ...controls };
                        updated.sectionsVisual.hero.enabled = e.target.checked;
                        setControls(updated);
                      }}
                      className="h-5 w-5 accent-charcoal cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal">Autoplay</label>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        checked={controls.sectionsVisual.hero.autoplay}
                        onChange={(e) => {
                          const updated = { ...controls };
                          updated.sectionsVisual.hero.autoplay = e.target.checked;
                          setControls(updated);
                        }}
                        className="h-4 w-4 accent-charcoal cursor-pointer"
                      />
                      <span className="text-xs font-semibold">Rotate automatically</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal">Slide Interval (ms)</label>
                    <input
                      type="number"
                      step={500}
                      min={2000}
                      max={12000}
                      value={controls.sectionsVisual.hero.interval}
                      onChange={(e) => {
                        const updated = { ...controls };
                        updated.sectionsVisual.hero.interval = Number(e.target.value);
                        setControls(updated);
                      }}
                      className="w-full rounded-xl border border-charcoal/20 px-3 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal">Show Arrow Controls</label>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        checked={controls.sectionsVisual.hero.showArrows}
                        onChange={(e) => {
                          const updated = { ...controls };
                          updated.sectionsVisual.hero.showArrows = e.target.checked;
                          setControls(updated);
                        }}
                        className="h-4 w-4 accent-charcoal cursor-pointer"
                      />
                      <span className="text-xs font-semibold">Previous / Next Flank Buttons</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banners List */}
              <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-black text-charcoal">Campaign Banners ({controls.banners.length})</h3>
                </div>

                <div className="space-y-4">
                  {controls.banners.map((b, idx) => (
                    <div
                      key={b.id}
                      className={`rounded-2xl border p-4 transition-all ${
                        b.enabled ? "border-charcoal/15 bg-white" : "border-charcoal/10 bg-gray-50 opacity-60"
                      }`}
                    >
                      <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-3">
                          <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl border border-charcoal/10 bg-warm-surface">
                            <Image src={b.desktopSrc || b.image || "/hero/butterfly-pea-100g-jar-front.png"} alt={b.title || b.headline || "Banner"} fill sizes="300px" className="object-cover" />
                          </div>
                          <p className="mt-1 truncate text-[10px] font-mono text-charcoal/50">{b.desktopSrc || b.image || ""}</p>
                        </div>

                        <div className="space-y-2 lg:col-span-7">
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                              <label className="text-[10px] font-black uppercase text-charcoal/60">Headline</label>
                              <input
                                type="text"
                                value={b.title || b.headline || ""}
                                onChange={(e) => {
                                  const updated = [...controls.banners];
                                  updated[idx].title = e.target.value;
                                  setControls({ ...controls, banners: updated });
                                }}
                                className="w-full rounded-lg border border-charcoal/15 px-2.5 py-1 text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black uppercase text-charcoal/60">CTA Text</label>
                              <input
                                type="text"
                                value={b.ctaText}
                                onChange={(e) => {
                                  const updated = [...controls.banners];
                                  updated[idx].ctaText = e.target.value;
                                  setControls({ ...controls, banners: updated });
                                }}
                                className="w-full rounded-lg border border-charcoal/15 px-2.5 py-1 text-xs font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 lg:col-span-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = moveItem(controls.banners, idx, "up");
                              setControls({ ...controls, banners: updated });
                            }}
                            disabled={idx === 0}
                            className="rounded-lg border px-2 py-1 text-xs font-bold disabled:opacity-30 cursor-pointer"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = moveItem(controls.banners, idx, "down");
                              setControls({ ...controls, banners: updated });
                            }}
                            disabled={idx === controls.banners.length - 1}
                            className="rounded-lg border px-2 py-1 text-xs font-bold disabled:opacity-30 cursor-pointer"
                          >
                            ↓
                          </button>
                          <input
                            type="checkbox"
                            checked={b.enabled}
                            onChange={(e) => {
                              const updated = [...controls.banners];
                              updated[idx].enabled = e.target.checked;
                              setControls({ ...controls, banners: updated });
                            }}
                            className="h-4 w-4 accent-charcoal cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: SHOP COLLECTIONS SECTION                              */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "sec-collections" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-charcoal">Shop Collections Section</h2>
                  <p className="text-sm text-charcoal/70">Customizable multi-tab product slider</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal">Enabled</span>
                  <input
                    type="checkbox"
                    checked={controls.sectionsVisual.collections.enabled}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.collections.enabled = e.target.checked;
                      setControls(updated);
                    }}
                    className="h-5 w-5 accent-charcoal cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-charcoal">Section Heading</label>
                  <input
                    type="text"
                    value={controls.sectionsVisual.collections.heading}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.collections.heading = e.target.value;
                      setControls(updated);
                    }}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal">Subheading</label>
                  <input
                    type="text"
                    value={controls.sectionsVisual.collections.subheading}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.collections.subheading = e.target.value;
                      setControls(updated);
                    }}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ColorField
                  label="Section Background Color"
                  value={controls.sectionsVisual.collections.bgColor || "#FFF7EF"}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.sectionsVisual.collections.bgColor = c;
                    setControls(updated);
                  }}
                />
                <ColorField
                  label="Card Background Color"
                  value={controls.sectionsVisual.collections.cardBg || "#FFFFFF"}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.sectionsVisual.collections.cardBg = c;
                    setControls(updated);
                  }}
                />
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: BEST SELLERS SECTION                                 */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "sec-bestsellers" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-charcoal">Best Sellers Section</h2>
                  <p className="text-sm text-charcoal/70">Top rated product spotlight & showcase</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal">Enabled</span>
                  <input
                    type="checkbox"
                    checked={controls.sectionsVisual.bestSellers.enabled}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.bestSellers.enabled = e.target.checked;
                      setControls(updated);
                    }}
                    className="h-5 w-5 accent-charcoal cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-charcoal">Section Heading</label>
                  <input
                    type="text"
                    value={controls.sectionsVisual.bestSellers.heading}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.bestSellers.heading = e.target.value;
                      setControls(updated);
                    }}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal">Subheading</label>
                  <input
                    type="text"
                    value={controls.sectionsVisual.bestSellers.subheading}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.bestSellers.subheading = e.target.value;
                      setControls(updated);
                    }}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ColorField
                  label="Section Background"
                  value={controls.sectionsVisual.bestSellers.bgColor || "#FBE7DC"}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.sectionsVisual.bestSellers.bgColor = c;
                    setControls(updated);
                  }}
                />
                <HoverEffectField
                  label="Card Hover Physics"
                  value={controls.sectionsVisual.bestSellers.cardHoverEffect || "lift"}
                  onChange={(eff) => {
                    const updated = { ...controls };
                    updated.sectionsVisual.bestSellers.cardHoverEffect = eff;
                    setControls(updated);
                  }}
                />
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: BOX OPENER (OPEN REVEAL)                             */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "sec-openreveal" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black text-charcoal">Interactive Box Opener</h2>
                  <p className="text-sm text-charcoal/70">Tap-to-reveal collector box experience</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal">Enabled</span>
                  <input
                    type="checkbox"
                    checked={controls.sectionsVisual.openReveal.enabled}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.openReveal.enabled = e.target.checked;
                      setControls(updated);
                    }}
                    className="h-5 w-5 accent-charcoal cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-charcoal">Heading</label>
                  <input
                    type="text"
                    value={controls.sectionsVisual.openReveal.heading}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.openReveal.heading = e.target.value;
                      setControls(updated);
                    }}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal">Subheading</label>
                  <input
                    type="text"
                    value={controls.sectionsVisual.openReveal.subheading}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.openReveal.subheading = e.target.value;
                      setControls(updated);
                    }}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ColorField
                  label="Background Color"
                  value={controls.sectionsVisual.openReveal.bgColor || "#FFF7EF"}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.sectionsVisual.openReveal.bgColor = c;
                    setControls(updated);
                  }}
                />
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    checked={controls.sectionsVisual.openReveal.petalShower}
                    onChange={(e) => {
                      const updated = { ...controls };
                      updated.sectionsVisual.openReveal.petalShower = e.target.checked;
                      setControls(updated);
                    }}
                    className="h-5 w-5 accent-charcoal cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Botanical Petal Shower</p>
                    <p className="text-[11px] text-charcoal/60">Non-blocking flower petal particle feedback</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: OTHER HOMEPAGE SECTIONS                               */}
          {/* ═════════════════════════════════════════════════════════ */}
          {[
            { id: "sec-whytmug", key: "whyTmug", title: "Why TMUG Section" },
            { id: "sec-realtea", key: "madeWithRealTea", title: "Made With Real Tea Section" },
            { id: "sec-teastory", key: "teaStory", title: "Tea Story Rituals Section" },
            { id: "sec-recipes", key: "ritualsRecipes", title: "Recipes & Rituals Section" },
            { id: "sec-lifestyle", key: "lifestyleGallery", title: "Lifestyle Gallery Moments" },
            { id: "sec-brandproof", key: "brandProof", title: "Brand Proof Section" },
            { id: "sec-customerlove", key: "customerLove", title: "Customer Reviews Section" },
            { id: "sec-stores", key: "availableInStores", title: "Available Where You Shop" },
            { id: "sec-finalcta", key: "finalCta", title: "Final Conversion CTA" },
          ].map((sec) => {
            if (activeTab !== sec.id) return null;
            const item = (controls.sectionsVisual as any)[sec.key];
            return (
              <div key={sec.id} className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                  <h2 className="font-display text-2xl font-black text-charcoal">{sec.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal">Enabled</span>
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => {
                        const updated = { ...controls };
                        (updated.sectionsVisual as any)[sec.key].enabled = e.target.checked;
                        setControls(updated);
                      }}
                      className="h-5 w-5 accent-charcoal cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-charcoal">Section Heading</label>
                    <input
                      type="text"
                      value={item.heading || ""}
                      onChange={(e) => {
                        const updated = { ...controls };
                        (updated.sectionsVisual as any)[sec.key].heading = e.target.value;
                        setControls(updated);
                      }}
                      className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-charcoal">Subheading / Description</label>
                    <input
                      type="text"
                      value={item.subheading || ""}
                      onChange={(e) => {
                        const updated = { ...controls };
                        (updated.sectionsVisual as any)[sec.key].subheading = e.target.value;
                        setControls(updated);
                      }}
                      className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <ColorField
                    label="Background Color"
                    value={item.bgColor || "#FFF7EF"}
                    onChange={(c) => {
                      const updated = { ...controls };
                      (updated.sectionsVisual as any)[sec.key].bgColor = c;
                      setControls(updated);
                    }}
                  />
                  {item.ctaText !== undefined && (
                    <div>
                      <label className="text-xs font-bold text-charcoal">CTA Button Label</label>
                      <input
                        type="text"
                        value={item.ctaText || ""}
                        onChange={(e) => {
                          const updated = { ...controls };
                          (updated.sectionsVisual as any)[sec.key].ctaText = e.target.value;
                          setControls(updated);
                        }}
                        className="mt-1 w-full rounded-xl border border-charcoal/20 p-2.5 text-xs font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: PRODUCTS & PRICES CATALOG                            */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "catalog-products" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-black text-charcoal">Products & Pricing Manager</h2>
                  <p className="text-sm text-charcoal/70">
                    Live catalog prices in INR, compare-at pricing, packshot assets, and best-seller flags.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {controls.products.map((prod, idx) => (
                  <div
                    key={prod.id}
                    className={`rounded-2xl border p-5 transition-all ${
                      prod.enabled ? "border-charcoal/15 bg-white" : "border-charcoal/10 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
                      <div className="lg:col-span-2 flex items-center justify-center p-2 rounded-xl bg-warm-surface/40">
                        <Image
                          src={prod.frontImage}
                          alt={prod.name}
                          width={100}
                          height={100}
                          className="h-20 w-auto object-contain"
                        />
                      </div>

                      <div className="space-y-2 lg:col-span-6">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-base font-black text-charcoal">{prod.name}</h4>
                          <span className="rounded-full bg-warm-surface px-2 py-0.5 text-[10px] font-bold text-charcoal uppercase">
                            {prod.category}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          <div>
                            <label className="text-[10px] font-black uppercase text-charcoal/60">Live Price (INR)</label>
                            <input
                              type="number"
                              value={prod.price}
                              onChange={(e) => {
                                const updated = [...controls.products];
                                updated[idx].price = Number(e.target.value);
                                setControls({ ...controls, products: updated });
                              }}
                              className="w-full rounded-lg border border-charcoal/20 px-2.5 py-1 text-xs font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-charcoal/60">Compare-At MRP</label>
                            <input
                              type="number"
                              value={prod.compareAtPrice || ""}
                              onChange={(e) => {
                                const updated = [...controls.products];
                                updated[idx].compareAtPrice = Number(e.target.value) || undefined;
                                setControls({ ...controls, products: updated });
                              }}
                              className="w-full rounded-lg border border-charcoal/20 px-2.5 py-1 text-xs font-mono font-bold"
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-3">
                            <input
                              type="checkbox"
                              checked={prod.isBestSeller}
                              onChange={(e) => {
                                const updated = [...controls.products];
                                updated[idx].isBestSeller = e.target.checked;
                                setControls({ ...controls, products: updated });
                              }}
                              className="h-4 w-4 accent-charcoal cursor-pointer"
                            />
                            <span className="text-[11px] font-bold">Best Seller ★</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-4">
                        <MediaUploadField
                          label="Replace Product Cutout"
                          value={prod.frontImage}
                          onChange={(url) => {
                            const updated = [...controls.products];
                            updated[idx].frontImage = url;
                            setControls({ ...controls, products: updated });
                          }}
                          slotType="product-cutout"
                          aspectRatio="1:1"
                          recommendedDimensions="1200 × 1200 px"
                          recommendedFormat="PNG (Transparent)"
                          transparencyPreferred
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: PRODUCT CARD COMPONENT STYLING                       */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "comp-productcard" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Product Card Visual Styling</h2>
                <p className="text-sm text-charcoal/70">
                  Configure card surface styling, packshot container heights, borders, and hover micro-animations.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ColorField
                  label="Card Background Color"
                  value={controls.components.productCard.cardBg}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.components.productCard.cardBg = c;
                    setControls(updated);
                  }}
                />
                <ColorField
                  label="Card Border Color"
                  value={controls.components.productCard.borderColor}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.components.productCard.borderColor = c;
                    setControls(updated);
                  }}
                />
                <ColorField
                  label="Price Tag Color"
                  value={controls.components.productCard.priceColor}
                  onChange={(c) => {
                    const updated = { ...controls };
                    updated.components.productCard.priceColor = c;
                    setControls(updated);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-charcoal">Product Cutout Frame Height</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={220}
                      max={360}
                      value={controls.components.productCard.imageHeightDesktop}
                      onChange={(e) => {
                        const updated = { ...controls };
                        updated.components.productCard.imageHeightDesktop = Number(e.target.value);
                        setControls(updated);
                      }}
                      className="flex-1 accent-charcoal cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold">
                      {controls.components.productCard.imageHeightDesktop}px
                    </span>
                  </div>
                </div>

                <HoverEffectField
                  label="Card Hover Physics"
                  value={controls.components.productCard.hoverEffect}
                  onChange={(eff) => {
                    const updated = { ...controls };
                    updated.components.productCard.hoverEffect = eff as any;
                    setControls(updated);
                  }}
                />
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: MEDIA LIBRARY                                        */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "media-library" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Media Upload & Asset Library</h2>
                <p className="text-sm text-charcoal/70">
                  Upload, inspect, and replace storefront assets with direct file-picker support, format verification, and dimensions inspection.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-charcoal/10 bg-warm-surface/20 p-5 space-y-3">
                  <h3 className="font-display text-base font-extrabold text-charcoal">Hero Campaign Banners</h3>
                  <p className="text-xs text-charcoal/70">Slot specs: 3:1 aspect ratio, 2172 × 724 px recommended.</p>
                  <MediaUploadField
                    label="Upload New Banner Artwork"
                    value=""
                    onChange={(url) => {
                      setToastMsg(`Uploaded banner artwork: ${url}`);
                    }}
                    slotType="hero-banner"
                    aspectRatio="3:1"
                    recommendedDimensions="2172 × 724 px"
                    recommendedFormat="PNG / WEBP / JPG"
                  />
                </div>

                <div className="rounded-2xl border border-charcoal/10 bg-warm-surface/20 p-5 space-y-3">
                  <h3 className="font-display text-base font-extrabold text-charcoal">Product Cutout Assets</h3>
                  <p className="text-xs text-charcoal/70">Slot specs: 1:1 aspect ratio, 1200 × 1200 px transparent PNG.</p>
                  <MediaUploadField
                    label="Upload Transparent Packshot"
                    value=""
                    onChange={(url) => {
                      setToastMsg(`Uploaded product packshot: ${url}`);
                    }}
                    slotType="product-cutout"
                    aspectRatio="1:1"
                    recommendedDimensions="1200 × 1200 px"
                    recommendedFormat="PNG (Transparent)"
                    transparencyPreferred
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: RESPONSIVE LIVE PREVIEW                              */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "live-preview" && (
            <div className="space-y-4">
              <LivePreviewPane controls={controls} />
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB: HISTORY & ROLLBACK                                   */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === "history-rollback" && (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-charcoal">Change History & Version Rollback</h2>
                <p className="text-sm text-charcoal/70">
                  Every publish event creates an immutable snapshot. Easily rollback to any previous version if needed.
                </p>
              </div>

              {history.length === 0 ? (
                <div className="rounded-2xl border border-charcoal/10 bg-warm-surface/30 p-8 text-center text-xs font-bold text-charcoal/60">
                  No previous publish history yet. The current live state is revision 1.
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((rev) => (
                    <div
                      key={rev.id}
                      className="flex items-center justify-between rounded-2xl border border-charcoal/10 bg-white p-4 shadow-xs"
                    >
                      <div>
                        <p className="text-sm font-extrabold text-charcoal">{rev.label}</p>
                        <p className="font-mono text-[11px] text-charcoal/50">
                          {new Date(rev.timestamp).toLocaleString("en-IN")} • ID: {rev.id}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRollback(rev.id)}
                        className="rounded-xl border border-charcoal/20 bg-warm-surface px-3 py-1.5 text-xs font-black text-charcoal hover:bg-tea-gold transition-colors cursor-pointer"
                      >
                        Rollback to This Snapshot ↩
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

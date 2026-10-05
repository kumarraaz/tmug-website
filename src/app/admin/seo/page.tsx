"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import type { SeoSettings } from "@/types";

type Status = "loading" | "login" | "ready" | "error";

function LengthHint({ value, min, max, label }: { value: string; min: number; max: number; label: string }) {
  const len = value.length;
  const ok = len >= min && len <= max;
  const short = len < min;
  return (
    <p className={`mt-1 text-xs font-semibold ${ok ? "text-tea-green" : short ? "text-amber-600" : "text-red-600"}`}>
      {label}: {len} chars {ok ? "✓ ideal" : short ? "— a bit short" : "— too long"}
    </p>
  );
}

function Field({
  label, value, onChange, hint, textarea, rows = 2,
}: {
  label: string; value: string; onChange: (v: string) => void; hint?: React.ReactNode; textarea?: boolean; rows?: number;
}) {
  const cls = "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-tea-green";
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-ink">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {hint}
    </label>
  );
}

export default function AdminSeoPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [settings, setSettings] = useState<SeoSettings | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setSettings(d.settings);
        setStatus("ready");
      })
      .catch(() => setStatus("login"));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const r = await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    const d = await r.json();
    if (!r.ok) {
      setLoginError(d.error ?? "Login failed.");
      return;
    }
    setSettings(d.settings);
    setStatus("ready");
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setSaveMsg("");
    const r = await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", settings }),
    });
    const d = await r.json();
    setSaving(false);
    if (!r.ok) {
      setSaveMsg(d.error ?? "Save failed.");
      return;
    }
    setSaveMsg(
      d.persisted
        ? "Saved ✓ (rebuild/redeploy to apply to the live site)"
        : `Validated but NOT persisted: ${d.note ?? ""}`,
    );
  };

  // ---- warnings ----
  const warnings = useMemo(() => {
    const w: string[] = [];
    if (!settings) return w;
    if (!settings.canonicalUrl) w.push("Canonical URL is missing.");
    if (!settings.robotsIndex) w.push("Robots is set to noindex — the site will be hidden from search engines.");
    const titles = PRODUCTS.map((p) => p.seoTitle);
    const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
    if (dupes.length) w.push(`Duplicate product SEO titles: ${[...new Set(dupes)].join(", ")}`);
    const missingAlt: string[] = [];
    PRODUCTS.forEach((p) =>
      p.variants.forEach((v) =>
        v.images.forEach((im) => {
          if (!im.alt.trim()) missingAlt.push(`${p.name} / ${v.label}`);
        }),
      ),
    );
    if (missingAlt.length) w.push(`Missing image alt text: ${missingAlt.join(", ")}`);
    return w;
  }, [settings]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (status === "login") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="font-display text-2xl font-extrabold text-ink">TMUG Admin</h1>
          <p className="mt-1 text-sm text-ink-soft">SEO settings — authorized access only.</p>
          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm font-bold text-ink">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-tea-green"
              autoComplete="current-password"
            />
          </label>
          {loginError && <p className="mt-2 text-sm font-semibold text-red-600">{loginError}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-tea-green py-3 text-sm font-extrabold text-cream transition-transform hover:scale-[1.02]"
          >
            Sign in
          </button>
          <Link href="/" className="mt-4 block text-center text-xs font-semibold text-ink-soft hover:underline">
            ← Back to site
          </Link>
        </form>
      </main>
    );
  }

  if (!settings) return null;

  const set = (k: keyof SeoSettings, v: string | boolean) =>
    setSettings({ ...settings, [k]: v });

  return (
    <main className="min-h-screen bg-cream px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-ink">SEO Settings</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Homepage metadata. Changes apply after rebuild/redeploy. Product SEO lives in{" "}
              <code className="rounded bg-ink/5 px-1">src/data/products.ts</code> (Phase 2: CMS).
            </p>
          </div>
          <Link href="/" className="text-sm font-bold text-tea-green hover:underline">
            ← Site
          </Link>
        </div>

        {warnings.length > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm font-extrabold text-amber-800">Warnings</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}
        {warnings.length === 0 && (
          <p className="mt-6 rounded-2xl bg-tea-green/10 p-4 text-sm font-bold text-tea-green">
            ✓ No SEO issues detected.
          </p>
        )}

        <div className="mt-6 grid gap-5 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <Field label="Page title (H1 preview)" value={settings.h1} onChange={(v) => set("h1", v)} />
          <Field
            label="Meta title"
            value={settings.metaTitle}
            onChange={(v) => set("metaTitle", v)}
            hint={<LengthHint value={settings.metaTitle} min={50} max={60} label="Title length" />}
          />
          <Field
            label="Meta description"
            value={settings.metaDescription}
            onChange={(v) => set("metaDescription", v)}
            textarea
            rows={3}
            hint={<LengthHint value={settings.metaDescription} min={150} max={160} label="Description length" />}
          />
          <Field label="Canonical URL" value={settings.canonicalUrl} onChange={(v) => set("canonicalUrl", v)} />
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={settings.robotsIndex}
                onChange={(e) => set("robotsIndex", e.target.checked)}
                className="h-4 w-4 accent-[#286021]"
              />
              Allow indexing
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={settings.robotsFollow}
                onChange={(e) => set("robotsFollow", e.target.checked)}
                className="h-4 w-4 accent-[#286021]"
              />
              Allow following links
            </label>
          </div>
          <Field label="OG title" value={settings.ogTitle} onChange={(v) => set("ogTitle", v)} />
          <Field
            label="OG description"
            value={settings.ogDescription}
            onChange={(v) => set("ogDescription", v)}
            textarea
          />
          <Field label="OG image URL" value={settings.ogImage} onChange={(v) => set("ogImage", v)} />
          <Field
            label="Homepage topics (comma-separated)"
            value={settings.topics}
            onChange={(v) => set("topics", v)}
            textarea
            rows={2}
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-tea-green px-8 py-3 text-sm font-extrabold text-cream transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save settings"}
            </button>
            {saveMsg && <p className="text-sm font-semibold text-ink-soft">{saveMsg}</p>}
          </div>
        </div>

        {/* Product SEO overview (read-only in Phase 1) */}
        <h2 className="mt-10 font-display text-2xl font-extrabold text-ink">Product SEO</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Read-only in Phase 1 — edit in <code className="rounded bg-ink/5 px-1">src/data/products.ts</code>.
        </p>
        <div className="mt-4 space-y-3">
          {PRODUCTS.map((p) => (
            <details key={p.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <summary className="cursor-pointer text-sm font-extrabold text-ink">{p.name}</summary>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="font-bold text-ink-soft">SEO title ({p.seoTitle.length} chars)</dt>
                  <dd className="text-ink">{p.seoTitle}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink-soft">Meta description ({p.metaDescription.length} chars)</dt>
                  <dd className="text-ink">{p.metaDescription}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink-soft">Image alt texts</dt>
                  <dd>
                    <ul className="mt-1 space-y-1">
                      {p.variants.flatMap((v) =>
                        v.images.map((im) => (
                          <li key={im.src} className="flex gap-2 text-xs">
                            <span className={im.alt.trim() ? "text-tea-green font-bold" : "text-red-600 font-bold"}>
                              {im.alt.trim() ? "✓" : "✕"}
                            </span>
                            <span className="text-ink-soft">{im.src.split("/").pop()} — {im.alt || "(missing)"}</span>
                          </li>
                        )),
                      )}
                    </ul>
                  </dd>
                </div>
              </dl>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}

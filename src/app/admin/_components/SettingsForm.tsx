"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { INDIAN_STATE_NAMES, findState } from "@/lib/india";
import type { StoreSettings } from "@/server/settings";
import { Card, Field, Notice, btnPrimary, inputClass } from "./ui";

export function SettingsForm({ initial }: { initial: StoreSettings }) {
  const router = useRouter();
  const [s, setS] = useState({
    ...initial,
    shippingFlat: String(initial.shipping.flatFee),
    shippingFree: initial.shipping.freeAbove == null ? "" : String(initial.shipping.freeAbove),
    lowStock: String(initial.lowStockThreshold),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ tone: "good" | "bad"; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setBanner(null);
    setErrors({});
    const flat = Number(s.shippingFlat || "0");
    const free = s.shippingFree.trim() === "" ? null : Number(s.shippingFree);
    if (Number.isNaN(flat) || (free !== null && Number.isNaN(free)) || !/^\d+$/.test(s.lowStock.trim() || "0")) {
      setBanner({ tone: "bad", text: "Please enter valid numbers for shipping and the low-stock level." });
      setSaving(false);
      return;
    }
    const payload: StoreSettings = {
      storeName: s.storeName,
      legalName: s.legalName,
      email: s.email,
      phone: s.phone,
      address: s.address,
      gst: { enabled: s.gst.enabled, gstin: s.gst.gstin, businessState: s.gst.businessState, pricesIncludeGst: s.gst.pricesIncludeGst },
      shipping: { flatFee: flat, freeAbove: free },
      lowStockThreshold: Number(s.lowStock.trim() || "0"),
    };
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors((data.fields as Record<string, string> | undefined) ?? {});
        setBanner({ tone: "bad", text: data.error ?? "Could not save the settings." });
      } else {
        setBanner({ tone: "good", text: "Settings saved. New orders will use them immediately." });
        router.refresh();
      }
    } catch {
      setBanner({ tone: "bad", text: "Network error. Please try again." });
    }
    setSaving(false);
  }

  const gstinState = s.gst.gstin.length >= 2 ? INDIAN_STATE_NAMES.find((n) => findState(n)?.code === s.gst.gstin.slice(0, 2)) : undefined;
  const stateMismatch = Boolean(gstinState && s.gst.businessState && gstinState !== s.gst.businessState);

  return (
    <form onSubmit={save} className="space-y-4" noValidate>
      {banner && <Notice tone={banner.tone === "good" ? "good" : "bad"}>{banner.text}</Notice>}

      <Card title="Store details" subtitle="Shown on your reports.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Store name" htmlFor="storeName" error={errors.storeName}>
            <input id="storeName" className={inputClass} value={s.storeName} maxLength={80} onChange={(e) => setS({ ...s, storeName: e.target.value })} />
          </Field>
          <Field label="Registered / legal name" htmlFor="legalName" hint="Optional.">
            <input id="legalName" className={inputClass} value={s.legalName} maxLength={120} onChange={(e) => setS({ ...s, legalName: e.target.value })} />
          </Field>
          <Field label="Contact email" htmlFor="email" error={errors.email}>
            <input id="email" type="email" className={inputClass} value={s.email} maxLength={120} onChange={(e) => setS({ ...s, email: e.target.value })} />
          </Field>
          <Field label="Contact phone" htmlFor="phone">
            <input id="phone" className={inputClass} value={s.phone} maxLength={30} onChange={(e) => setS({ ...s, phone: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Business address" htmlFor="address" hint="Optional.">
              <textarea id="address" rows={2} className={inputClass} value={s.address} maxLength={400} onChange={(e) => setS({ ...s, address: e.target.value })} />
            </Field>
          </div>
          <Field label="Currency" htmlFor="currency" hint="The store sells in Indian Rupees only.">
            <input id="currency" className={inputClass} value="INR (₹) — Indian Rupee" disabled readOnly />
          </Field>
        </div>
      </Card>

      <Card title="Tax (GST)" subtitle="Off by default. Switch it on only if your business charges GST — rates are set per product, and nothing is assumed.">
        <label className="mb-3 flex items-start gap-3 rounded-xl border border-charcoal/15 p-3">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={s.gst.enabled} onChange={(e) => setS({ ...s, gst: { ...s.gst, enabled: e.target.checked } })} />
          <span>
            <span className="block text-sm font-extrabold text-deep-plum">Apply GST to orders</span>
            <span className="block text-xs text-charcoal/60">Applies to products that have a GST rate. Tax amounts are recorded on every order for your reports.</span>
          </span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="GSTIN" htmlFor="gstin" error={errors["gst.gstin"]} hint="Entered as given — only the format is checked, not that it is registered.">
            <input id="gstin" className={`${inputClass} font-mono uppercase`} value={s.gst.gstin} maxLength={15} placeholder="Not entered" onChange={(e) => setS({ ...s, gst: { ...s.gst, gstin: e.target.value.toUpperCase() } })} />
          </Field>
          <Field label="Business state" htmlFor="state" error={errors["gst.businessState"]} hint="Decides CGST + SGST (same state) vs IGST (other states).">
            <select id="state" className={inputClass} value={s.gst.businessState} onChange={(e) => setS({ ...s, gst: { ...s.gst, businessState: e.target.value } })}>
              <option value="">Select…</option>
              {INDIAN_STATE_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {stateMismatch && (
          <div className="mt-3">
            <Notice tone="warn">The first two digits of this GSTIN indicate {gstinState}, but the business state is {s.gst.businessState}. Please double-check both.</Notice>
          </div>
        )}
        <fieldset className="mt-4">
          <legend className="mb-1 text-xs font-extrabold uppercase tracking-wide text-charcoal/70">Listed prices are…</legend>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="incl" checked={s.gst.pricesIncludeGst} onChange={() => setS({ ...s, gst: { ...s.gst, pricesIncludeGst: true } })} />
              <span>
                <strong>Inclusive of GST</strong> (customer pays the listed price)
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="incl" checked={!s.gst.pricesIncludeGst} onChange={() => setS({ ...s, gst: { ...s.gst, pricesIncludeGst: false } })} />
              <span>
                <strong>Exclusive of GST</strong> (GST is added at checkout)
              </span>
            </label>
          </div>
        </fieldset>
      </Card>

      <Card title="Shipping" subtitle="A simple flat charge. Leave at 0 for free shipping on every order. GST on shipping is not calculated by this system.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Flat shipping charge (₹)" htmlFor="ship">
            <input id="ship" inputMode="decimal" className={inputClass} value={s.shippingFlat} onChange={(e) => setS({ ...s, shippingFlat: e.target.value })} />
          </Field>
          <Field label="Free shipping above (₹)" htmlFor="free" hint="Optional. Orders at or above this amount (after discount) ship free.">
            <input id="free" inputMode="decimal" className={inputClass} value={s.shippingFree} placeholder="No threshold" onChange={(e) => setS({ ...s, shippingFree: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card title="Stock alerts">
        <Field label="Low-stock level (units)" htmlFor="low" hint="Variants with stock tracking at or below this number are flagged on the dashboard.">
          <input id="low" inputMode="numeric" className={`${inputClass} max-w-[10rem]`} value={s.lowStock} onChange={(e) => setS({ ...s, lowStock: e.target.value })} />
        </Field>
      </Card>

      <div>
        <button type="submit" className={btnPrimary} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}

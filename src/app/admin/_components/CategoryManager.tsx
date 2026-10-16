"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { btnSecondary, inputClass } from "./ui";

export function CategoryManager({ categories }: { categories: { slug: string; name: string; productCount: number }[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMessage({ tone: "bad", text: data.error ?? "Could not add the category." });
      else {
        setMessage({ tone: "ok", text: `Added “${data.category?.name}”.` });
        setName("");
        router.refresh();
      }
    } catch {
      setMessage({ tone: "bad", text: "Network error. Please try again." });
    }
    setBusy(false);
  }

  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <li key={c.slug} className="rounded-full bg-warm-ivory px-3 py-1 text-xs font-bold text-charcoal ring-1 ring-charcoal/10">
            {c.name} <span className="font-normal text-charcoal/60">· {c.productCount}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="mt-3 flex flex-wrap items-center gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" aria-label="New category name" maxLength={60} className={`${inputClass} max-w-xs`} />
        <button type="submit" disabled={busy || name.trim().length < 2} className={btnSecondary}>
          {busy ? "Adding…" : "Add category"}
        </button>
        {message && (
          <span role="status" className={`text-xs font-bold ${message.tone === "ok" ? "text-[#2f5d35]" : "text-berry"}`}>
            {message.text}
          </span>
        )}
      </form>
      <p className="mt-2 text-xs text-charcoal/55">A new category gets its own tab in the shop section once it has an active product.</p>
    </div>
  );
}

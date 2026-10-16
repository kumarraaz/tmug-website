"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { btnDanger } from "./ui";

export function DeleteProductButton({ id, name, redirectTo, compact = false }: { id: string; name: string; redirectTo?: string; compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not delete this product.");
        setBusy(false);
        return;
      }
      setOpen(false);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={compact ? "rounded-full px-3 py-1 text-xs font-extrabold text-berry hover:bg-berry/10 cursor-pointer" : btnDanger}
      >
        Delete{compact ? "" : " product"}
      </button>
      <ConfirmDialog open={open} title={`Delete “${name}”?`} confirmLabel="Delete permanently" busy={busy} error={error} onConfirm={confirm} onCancel={() => !busy && setOpen(false)}>
        <p>
          This permanently removes the product and all of its variants from the store, and its page will stop working. <strong>Past orders are not affected</strong> — they keep their own
          copy of the product name, SKU, price and tax.
        </p>
        <p className="mt-2">If you only want to hide it for now, mark it as <strong>Inactive</strong> instead.</p>
      </ConfirmDialog>
    </>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { btnDanger, btnPrimary, btnSecondary } from "./ui";

/** Accessible confirmation dialog built on the native <dialog> (focus trap, Esc to close). */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  tone = "danger",
  busy = false,
  error,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  tone?: "danger" | "primary";
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !busy) onCancel();
      }}
      className="m-auto w-[min(92vw,28rem)] rounded-2xl border border-charcoal/15 bg-white p-0 text-charcoal shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="p-5">
        <h2 className="font-display text-lg font-black text-deep-plum">{title}</h2>
        <div className="mt-2 text-sm text-charcoal/80">{children}</div>
        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-berry/10 px-3 py-2 text-sm font-bold text-berry">
            {error}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className={btnSecondary} onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className={tone === "danger" ? btnDanger : btnPrimary} onClick={onConfirm} disabled={busy}>
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

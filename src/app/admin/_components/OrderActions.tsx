"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { Card, Field, btnPrimary, inputClass } from "./ui";

type Msg = { tone: "ok" | "bad"; text: string } | null;

/** POST one action to the order API, refresh the page on success. */
function useOrderAction(orderId: string) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function run(body: Record<string, unknown>, okText: string): Promise<boolean> {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ tone: "bad", text: data.error ?? "Something went wrong." });
        setBusy(false);
        return false;
      }
      setMsg({ tone: "ok", text: data.refundRequired ? `${okText} Payment had been received — remember to record the refund.` : okText });
      router.refresh();
      setBusy(false);
      return true;
    } catch {
      setMsg({ tone: "bad", text: "Network error. Please try again." });
      setBusy(false);
      return false;
    }
  }
  return { busy, msg, run, setMsg };
}

const Message = ({ msg }: { msg: Msg }) =>
  msg ? (
    <p role={msg.tone === "bad" ? "alert" : "status"} className={`mt-2 text-xs font-bold ${msg.tone === "ok" ? "text-[#2f5d35]" : "text-berry"}`}>
      {msg.text}
    </p>
  ) : null;

export function StatusCard({
  orderId,
  current,
  allowedNext,
  tracking,
  blockedReason,
}: {
  orderId: string;
  current: string;
  allowedNext: { value: string; label: string }[];
  tracking: string;
  blockedReason?: string;
}) {
  const { busy, msg, run } = useOrderAction(orderId);
  const [next, setNext] = useState(allowedNext[0]?.value ?? "");
  const [track, setTrack] = useState(tracking);

  return (
    <Card title="Fulfilment" subtitle={`Current status: ${current}`}>
      {blockedReason ? (
        <p className="text-sm text-charcoal/70">{blockedReason}</p>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void run({ action: "status", status: next, trackingReference: track.trim() || null }, "Status updated.");
          }}
        >
          <Field label="Move to" htmlFor="next-status">
            <select id="next-status" className={inputClass} value={next} onChange={(e) => setNext(e.target.value)}>
              {allowedNext.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Courier / tracking reference" htmlFor="tracking" hint="Optional. Shown only to you.">
            <input id="tracking" className={inputClass} value={track} maxLength={120} onChange={(e) => setTrack(e.target.value)} />
          </Field>
          <button type="submit" className={btnPrimary} disabled={busy || !next}>
            {busy ? "Saving…" : "Update status"}
          </button>
        </form>
      )}
      <Message msg={msg} />
    </Card>
  );
}

export function InvoiceCard({ orderId, invoiceNumber, invoiceDate, adminNote }: { orderId: string; invoiceNumber: string; invoiceDate: string; adminNote: string }) {
  const { busy, msg, run } = useOrderAction(orderId);
  const [no, setNo] = useState(invoiceNumber);
  const [date, setDate] = useState(invoiceDate);
  const [note, setNote] = useState(adminNote);

  return (
    <Card title="Invoice & internal note" subtitle="Enter the invoice number from your invoicing records. This system does not generate tax invoices.">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void run({ action: "meta", invoiceNumber: no.trim(), invoiceDate: date, adminNote: note }, "Saved.");
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Invoice number" htmlFor="inv-no">
            <input id="inv-no" className={inputClass} value={no} maxLength={40} placeholder="Not issued" onChange={(e) => setNo(e.target.value)} />
          </Field>
          <Field label="Invoice date" htmlFor="inv-date">
            <input id="inv-date" type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Internal note" htmlFor="note" hint="Visible to admins only.">
          <textarea id="note" rows={3} className={inputClass} value={note} maxLength={2000} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <button type="submit" className={btnPrimary} disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </button>
      </form>
      <Message msg={msg} />
    </Card>
  );
}

export function RefundCard({ orderId, refundableRupees }: { orderId: string; refundableRupees: number }) {
  const { busy, msg, run } = useOrderAction(orderId);
  const [amount, setAmount] = useState(String(refundableRupees));
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState("");

  return (
    <Card title="Record a refund" subtitle="Records money you have already returned to the customer — it does not send money. Refunds made from the Razorpay dashboard are recorded automatically by the webhook; do not enter those again.">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void run({ action: "refund", amount: Number(amount), reason, reference: reference.trim() || null, refundedOn: date || null }, "Refund recorded.");
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (₹)" htmlFor="rf-amount" hint={`Up to ₹${refundableRupees.toFixed(2)}`}>
            <input id="rf-amount" inputMode="decimal" className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="Date refunded" htmlFor="rf-date" hint="Blank = today">
            <input id="rf-date" type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Reason" htmlFor="rf-reason">
          <input id="rf-reason" className={inputClass} value={reason} maxLength={300} placeholder="e.g. Customer returned the order" onChange={(e) => setReason(e.target.value)} />
        </Field>
        <Field label="Reference (optional)" htmlFor="rf-ref" hint="Razorpay refund ID, UPI or bank reference.">
          <input id="rf-ref" className={inputClass} value={reference} maxLength={80} onChange={(e) => setReference(e.target.value)} />
        </Field>
        <button type="submit" className={btnPrimary} disabled={busy || reason.trim().length < 2 || !(Number(amount) > 0)}>
          {busy ? "Saving…" : "Record refund"}
        </button>
      </form>
      <Message msg={msg} />
    </Card>
  );
}

export function CancelCard({ orderId, paidNotRefunded }: { orderId: string; paidNotRefunded: boolean }) {
  const { busy, msg, run, setMsg } = useOrderAction(orderId);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <Card title="Cancel order">
      <p className="text-sm text-charcoal/70">
        Cancelling keeps the order on record, returns tracked stock to inventory and cannot be undone.
        {paidNotRefunded && " Payment has been received, so you will need to record a refund afterwards."}
      </p>
      <Field label="Reason" htmlFor="cancel-reason">
        <input id="cancel-reason" className={inputClass} value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} />
      </Field>
      <button type="button" className="mt-3 rounded-full border border-berry px-5 py-2 text-sm font-extrabold text-berry hover:bg-berry/10 cursor-pointer" onClick={() => setOpen(true)}>
        Cancel this order…
      </button>
      <Message msg={msg} />
      <ConfirmDialog
        open={open}
        title="Cancel this order?"
        confirmLabel="Yes, cancel order"
        busy={busy}
        onCancel={() => {
          setOpen(false);
          setMsg(null);
        }}
        onConfirm={async () => {
          const ok = await run({ action: "cancel", reason }, "Order cancelled.");
          if (ok) setOpen(false);
        }}
      >
        <p>The order will be marked cancelled and stock will be restored. This cannot be undone.</p>
      </ConfirmDialog>
    </Card>
  );
}

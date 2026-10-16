import type { GatewayStatus } from "@/server/razorpay";
import { Badge, Card, Notice } from "./ui";

/** Server component: shows ONLY whether each variable is set — never a value. */
export function GatewayStatusCard({ status, webhookUrl }: { status: GatewayStatus; webhookUrl: string }) {
  const rows: { name: string; set: boolean; purpose: string; required: boolean }[] = [
    { name: "RAZORPAY_KEY_ID", set: status.keyIdSet, purpose: "Publishable key id (starts rzp_test_ or rzp_live_). Opens the payment window.", required: true },
    { name: "RAZORPAY_KEY_SECRET", set: status.keySecretSet, purpose: "Secret key. Creates orders and verifies every payment on the server. Never sent to browsers.", required: true },
    { name: "RAZORPAY_WEBHOOK_SECRET", set: status.webhookSecretSet, purpose: "Secret you choose when creating the webhook. Verifies payment / refund notifications.", required: false },
  ];

  return (
    <Card title="Payment gateway — Razorpay" subtitle="Credentials live only in your hosting environment variables; they are never shown here or sent to the browser.">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone={status.configured ? "good" : "bad"}>{status.configured ? "Payments can be taken" : "Not configured — online payment is OFF"}</Badge>
        {status.mode && <Badge tone={status.mode === "live" ? "good" : "warn"}>{status.mode === "live" ? "Live mode" : status.mode === "test" ? "Test mode (no real money)" : "Unknown key type"}</Badge>}
        <Badge tone={status.webhookConfigured ? "good" : "warn"}>{status.webhookConfigured ? "Webhook secret set" : "Webhook secret missing"}</Badge>
      </div>

      <ul className="divide-y divide-charcoal/10 text-sm">
        {rows.map((r) => (
          <li key={r.name} className="flex flex-wrap items-start justify-between gap-2 py-2">
            <div className="min-w-0">
              <code className="font-mono text-xs font-bold text-deep-plum">{r.name}</code>
              <p className="text-xs text-charcoal/60">{r.purpose}</p>
            </div>
            <Badge tone={r.set ? "good" : r.required ? "bad" : "warn"}>{r.set ? "Set" : "Missing"}</Badge>
          </li>
        ))}
      </ul>

      {!status.configured && (
        <div className="mt-3">
          <Notice tone="warn" title="What to do">
            <ol className="list-decimal pl-5">
              <li>In your Razorpay dashboard, copy the API Key ID and Key Secret (use Test keys first).</li>
              <li>Add <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in Vercel → Project → Settings → Environment Variables, then redeploy.</li>
              <li>Until then the cart keeps offering “Order on WhatsApp” and no payment is ever simulated.</li>
            </ol>
          </Notice>
        </div>
      )}

      <div className="mt-3 rounded-xl bg-warm-ivory p-3 text-xs text-charcoal/80">
        <p className="font-extrabold text-deep-plum">Webhook (recommended — confirms payments even if a customer closes the page)</p>
        <p className="mt-1">
          Razorpay Dashboard → Settings → Webhooks → Add: URL <code className="break-all rounded bg-white px-1 font-mono">{webhookUrl}</code>, secret = the value you set in{" "}
          <code>RAZORPAY_WEBHOOK_SECRET</code>, events: <code>payment.authorized</code>, <code>payment.captured</code>, <code>payment.failed</code>, <code>order.paid</code>, <code>refund.created</code>,{" "}
          <code>refund.processed</code>, <code>refund.failed</code>.
        </p>
      </div>
    </Card>
  );
}

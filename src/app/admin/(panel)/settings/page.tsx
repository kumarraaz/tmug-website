import { headers } from "next/headers";
import { hasBlob } from "@/lib/persist";
import { isAdminAuthConfigured, requireAdminPage } from "@/server/auth";
import { databaseStatus, isDatabaseConfigured } from "@/server/db";
import { getGatewayStatus } from "@/server/razorpay";
import { getSettings } from "@/server/settings";
import { GatewayStatusCard } from "../../_components/GatewayStatus";
import { SettingsForm } from "../../_components/SettingsForm";
import { Badge, Card, DatabaseNotConfigured, PageHeader } from "../../_components/ui";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdminPage();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "your-domain";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const gateway = getGatewayStatus();
  const dbConfigured = isDatabaseConfigured();
  const db = dbConfigured ? await databaseStatus() : null;
  const settings = db?.connected ? await getSettings() : null;

  const sessionSecret = process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16 ? "dedicated" : "derived";

  return (
    <>
      <PageHeader title="Settings" subtitle="Only what the store needs: store details, tax, shipping and the status of integrations." />

      <div className="space-y-4">
        {!dbConfigured && <DatabaseNotConfigured />}
        {db && !db.connected && (
          <Card title="Database">
            <Badge tone="bad">Connection failed</Badge>
            <p className="mt-2 font-mono text-xs text-charcoal/70">{db.error}</p>
          </Card>
        )}
        {settings && <SettingsForm initial={settings} />}

        <GatewayStatusCard status={gateway} webhookUrl={`${proto}://${host}/api/payments/razorpay/webhook`} />

        <Card title="System status" subtitle="Environment variables are only reported as set / missing — their values are never displayed.">
          <ul className="divide-y divide-charcoal/10 text-sm">
            <li className="flex flex-wrap items-start justify-between gap-2 py-2">
              <div>
                <code className="font-mono text-xs font-bold text-deep-plum">DATABASE_URL</code>
                <p className="text-xs text-charcoal/60">PostgreSQL connection (Neon, Vercel Postgres, Supabase…). Stores products, orders, payments and settings.{db?.host ? ` Host: ${db.host}` : ""}</p>
              </div>
              <Badge tone={db?.connected ? "good" : dbConfigured ? "bad" : "bad"}>{db?.connected ? "Connected" : dbConfigured ? "Set, cannot connect" : "Missing"}</Badge>
            </li>
            <li className="flex flex-wrap items-start justify-between gap-2 py-2">
              <div>
                <code className="font-mono text-xs font-bold text-deep-plum">ADMIN_EMAIL / ADMIN_PASSWORD</code>
                <p className="text-xs text-charcoal/60">Admin sign-in credentials.</p>
              </div>
              <Badge tone={isAdminAuthConfigured() ? "good" : "bad"}>{isAdminAuthConfigured() ? "Set" : "Missing"}</Badge>
            </li>
            <li className="flex flex-wrap items-start justify-between gap-2 py-2">
              <div>
                <code className="font-mono text-xs font-bold text-deep-plum">ADMIN_SESSION_SECRET</code>
                <p className="text-xs text-charcoal/60">Signs admin session cookies. Recommended: a random string of 32+ characters. If unset, a key is derived from the admin password.</p>
              </div>
              <Badge tone={sessionSecret === "dedicated" ? "good" : "warn"}>{sessionSecret === "dedicated" ? "Set" : "Not set (derived)"}</Badge>
            </li>
            <li className="flex flex-wrap items-start justify-between gap-2 py-2">
              <div>
                <code className="font-mono text-xs font-bold text-deep-plum">BLOB_READ_WRITE_TOKEN</code>
                <p className="text-xs text-charcoal/60">Vercel Blob storage for uploaded product images (BLOB_STORE_ID also works).</p>
              </div>
              <Badge tone={hasBlob() ? "good" : "warn"}>{hasBlob() ? "Set" : "Missing — uploads disabled in production"}</Badge>
            </li>
          </ul>
        </Card>
      </div>
    </>
  );
}

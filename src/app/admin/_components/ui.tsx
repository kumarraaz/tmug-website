import Link from "next/link";
import type { ReactNode } from "react";
import { databaseEnvNames } from "@/lib/env-names";

/** Small presentational building blocks shared by the admin screens (server-component friendly). */

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-black text-deep-plum sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-charcoal/70">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, subtitle, children, className = "", action }: { title?: string; subtitle?: ReactNode; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={`rounded-2xl border border-charcoal/10 bg-white p-4 shadow-xs sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-display text-base font-extrabold text-deep-plum">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-charcoal/60">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatTile({ label, value, hint, tone = "default" }: { label: string; value: ReactNode; hint?: ReactNode; tone?: "default" | "good" | "warn" | "bad" }) {
  const accent = { default: "bg-cherry-blossom", good: "bg-olivine", warn: "bg-fawn", bad: "bg-berry" }[tone];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-charcoal/10 bg-white p-4 shadow-xs">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${accent}`} />
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-black text-deep-plum">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-charcoal/60">{hint}</p>}
    </div>
  );
}

const BADGE_TONES = {
  neutral: "bg-charcoal/10 text-charcoal",
  good: "bg-olivine/25 text-[#2f5d35]",
  warn: "bg-fawn/40 text-[#7a4a12]",
  bad: "bg-berry/15 text-berry",
  info: "bg-sky-blue/30 text-[#1d5670]",
} as const;

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof BADGE_TONES; children: ReactNode }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${BADGE_TONES[tone]}`}>{children}</span>;
}

const NOTICE_TONES = {
  info: "border-sky-blue/50 bg-sky-blue/15 text-[#1d5670]",
  warn: "border-fawn bg-fawn/25 text-[#6b3f0b]",
  bad: "border-berry/40 bg-berry/10 text-berry",
  good: "border-olivine/60 bg-olivine/20 text-[#2f5d35]",
} as const;

export function Notice({ tone = "info", title, children }: { tone?: keyof typeof NOTICE_TONES; title?: string; children?: ReactNode }) {
  return (
    <div role={tone === "bad" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${NOTICE_TONES[tone]}`}>
      {title && <p className="font-extrabold">{title}</p>}
      {children && <div className={title ? "mt-1" : ""}>{children}</div>}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-charcoal/20 bg-white/60 px-6 py-10 text-center">
      <p className="font-display text-lg font-extrabold text-deep-plum">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-charcoal/70">{children}</div>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-cherry-blossom focus:ring-2 focus:ring-cherry-blossom/30 disabled:bg-charcoal/5 disabled:text-charcoal/50";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-deep-plum active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/25 bg-white px-4 py-2 text-sm font-bold text-charcoal transition hover:border-charcoal/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-full bg-berry px-5 py-2.5 text-sm font-extrabold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: ReactNode; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-charcoal/70">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-charcoal/55">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-bold text-berry">
          {error}
        </p>
      )}
    </div>
  );
}

export const tableClass = "w-full min-w-[640px] border-collapse text-left text-sm";
export const thClass = "border-b border-charcoal/15 px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-charcoal/60";
export const tdClass = "border-b border-charcoal/8 px-3 py-2.5 align-middle text-charcoal";

export function Pagination({ page, pageSize, total, hrefFor }: { page: number; pageSize: number; total: number; hrefFor: (page: number) => string }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
      <p className="text-charcoal/60">
        Page {page} of {pages} · {total} total
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className={btnSecondary}>
            ← Previous
          </Link>
        ) : null}
        {page < pages ? (
          <Link href={hrefFor(page + 1)} className={btnSecondary}>
            Next →
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

/** Shown on every data screen when DATABASE_URL is missing: no fake numbers, just the setup steps. */
export function DatabaseNotConfigured() {
  return (
    <Notice tone="warn" title="The database is not connected yet">
      <p>
        Products, orders, payments and reports are stored in PostgreSQL. Set the <code className="rounded bg-white/70 px-1 font-mono text-xs">DATABASE_URL</code> environment
        variable (for example from a Neon or Vercel Postgres database) and redeploy. The tables are created automatically the first time this panel loads, and your existing
        catalogue is imported once. Until then the public store keeps working from its built-in catalogue and nothing here is simulated.
      </p>
      <p className="mt-2">
        Database-related variable names this deployment can see (values are never shown):{" "}
        <span className="font-mono text-xs">{databaseEnvNames().join(", ") || "none — the variable is not reaching this deployment (check it is enabled for Production, then redeploy)"}</span>
      </p>
      <p className="mt-2">
        See <Link href="/admin/settings" className="font-bold underline">Settings</Link> for the exact variables and their current status.
      </p>
    </Notice>
  );
}

export function DatabaseError({ message }: { message: string }) {
  return (
    <Notice tone="bad" title="Could not read from the database">
      <p className="font-mono text-xs">{message}</p>
    </Notice>
  );
}

import Link from "next/link";
import { resolveRange, type DateRange } from "@/lib/dates";

/** Read ?range=&from=&to= into an IST date range. `allowAll` adds an "all time" option (returns null). */
export function rangeFromParams(
  sp: Record<string, string | string[] | undefined>,
  opts: { allowAll: boolean },
  now = new Date(),
): { range: DateRange | null; preset: string } {
  const get = (k: string) => (Array.isArray(sp[k]) ? (sp[k] as string[])[0] : (sp[k] as string | undefined));
  const preset = get("range");
  if (opts.allowAll && (!preset || preset === "all")) return { range: null, preset: "all" };
  const range = resolveRange(preset ?? "this-month", now, get("from"), get("to"));
  return { range, preset: range.preset };
}

const PRESETS = [
  { id: "today", label: "Today" },
  { id: "this-month", label: "This month" },
  { id: "previous-month", label: "Previous month" },
  { id: "custom", label: "Custom range" },
];

/** Today / This month / Previous month / Custom range selector. Plain links + a GET form: no client JS needed. */
export function RangeFilter({
  basePath,
  preset,
  range,
  allowAll = false,
  preserve = {},
}: {
  basePath: string;
  preset: string;
  range: DateRange | null;
  allowAll?: boolean;
  preserve?: Record<string, string | undefined>;
}) {
  const href = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(preserve)) if (v) p.set(k, v);
    for (const [k, v] of Object.entries(extra)) p.set(k, v);
    return `${basePath}?${p.toString()}`;
  };
  const pill = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${active ? "bg-charcoal text-white shadow-sm" : "bg-white text-charcoal ring-1 ring-charcoal/15 hover:ring-charcoal/40"}`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {allowAll && (
          <Link href={href({ range: "all" })} className={pill(preset === "all")}>
            All time
          </Link>
        )}
        {PRESETS.filter((p) => p.id !== "custom").map((p) => (
          <Link key={p.id} href={href({ range: p.id })} className={pill(preset === p.id)}>
            {p.label}
          </Link>
        ))}
        <span className={pill(preset === "custom")}>Custom range</span>
        {range && <span className="text-xs font-bold text-charcoal/60">{range.fromStr === range.toStr ? range.fromStr : `${range.fromStr} → ${range.toStr}`} (IST)</span>}
      </div>
      <form method="get" action={basePath} className="flex flex-wrap items-end gap-2">
        {Object.entries(preserve).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
        <input type="hidden" name="range" value="custom" />
        <label className="text-xs font-bold text-charcoal/70">
          From
          <input type="date" name="from" defaultValue={preset === "custom" ? range?.fromStr : ""} required className="ml-2 rounded-lg border border-charcoal/20 bg-white px-2 py-1 text-sm" />
        </label>
        <label className="text-xs font-bold text-charcoal/70">
          To
          <input type="date" name="to" defaultValue={preset === "custom" ? range?.toStr : ""} required className="ml-2 rounded-lg border border-charcoal/20 bg-white px-2 py-1 text-sm" />
        </label>
        <button type="submit" className="rounded-full bg-tea-gold px-4 py-1.5 text-xs font-extrabold text-deep-plum ring-1 ring-charcoal/20 hover:ring-charcoal/50 cursor-pointer">
          Apply
        </button>
      </form>
    </div>
  );
}

/**
 * Date helpers. TMUG reports in Indian Standard Time (UTC+05:30, no DST), and
 * the Indian financial year runs April → March.
 *
 * All instants are stored in UTC (timestamptz). "Day" and "month" boundaries
 * are computed here as exact UTC instants for IST midnights.
 */

export const IST_OFFSET_MS = 330 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface IstParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function istParts(date: Date): IstParts {
  const t = new Date(date.getTime() + IST_OFFSET_MS);
  return {
    year: t.getUTCFullYear(),
    month: t.getUTCMonth() + 1,
    day: t.getUTCDate(),
    hour: t.getUTCHours(),
    minute: t.getUTCMinutes(),
    second: t.getUTCSeconds(),
  };
}

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

/** "2026-10-16" — the IST calendar date of an instant. */
export function istDateString(date: Date): string {
  const p = istParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** The UTC instant at which the given IST calendar day begins. */
export function startOfIstDay(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day) - IST_OFFSET_MS);
}

/** Parse "YYYY-MM-DD" (a real calendar date) into parts, or null. */
export function parseDateInput(value: string | null | undefined): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  return { year, month, day };
}

export type RangePreset = "today" | "this-month" | "previous-month" | "custom";

export interface DateRange {
  preset: RangePreset;
  /** Inclusive start instant. */
  start: Date;
  /** Exclusive end instant. */
  endExclusive: Date;
  /** Inclusive IST dates, "YYYY-MM-DD". */
  fromStr: string;
  toStr: string;
  label: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const monthName = (m: number) => MONTH_NAMES[m - 1];
export const monthShort = (m: number) => MONTH_SHORT[m - 1];

/** "16 Oct 2026" */
export function formatDateIst(date: Date): string {
  const p = istParts(date);
  return `${pad(p.day)} ${MONTH_SHORT[p.month - 1]} ${p.year}`;
}

/** "16 Oct 2026, 14:05" (IST) */
export function formatDateTimeIst(date: Date): string {
  const p = istParts(date);
  return `${pad(p.day)} ${MONTH_SHORT[p.month - 1]} ${p.year}, ${pad(p.hour)}:${pad(p.minute)}`;
}

/** Calendar month range in IST. `month` is 1-12. */
export function monthRange(year: number, month: number): DateRange {
  const start = startOfIstDay(year, month, 1);
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const endExclusive = startOfIstDay(nextYear, nextMonth, 1);
  const lastDay = new Date(endExclusive.getTime() - DAY_MS);
  return {
    preset: "custom",
    start,
    endExclusive,
    fromStr: istDateString(start),
    toStr: istDateString(lastDay),
    label: `${MONTH_NAMES[month - 1]} ${year}`,
  };
}

export const MAX_CUSTOM_RANGE_DAYS = 800;

/**
 * Resolve a dashboard / list filter into an exact IST range.
 * Invalid or reversed custom dates fall back to "this month".
 */
export function resolveRange(
  preset: string | null | undefined,
  now: Date,
  customFrom?: string | null,
  customTo?: string | null,
): DateRange {
  const today = istParts(now);

  if (preset === "today") {
    const start = startOfIstDay(today.year, today.month, today.day);
    return {
      preset: "today",
      start,
      endExclusive: new Date(start.getTime() + DAY_MS),
      fromStr: istDateString(start),
      toStr: istDateString(start),
      label: "Today",
    };
  }

  if (preset === "previous-month") {
    const prevMonth = today.month === 1 ? 12 : today.month - 1;
    const prevYear = today.month === 1 ? today.year - 1 : today.year;
    return { ...monthRange(prevYear, prevMonth), preset: "previous-month", label: `Previous month (${MONTH_NAMES[prevMonth - 1]} ${prevYear})` };
  }

  if (preset === "custom") {
    const from = parseDateInput(customFrom);
    const to = parseDateInput(customTo);
    if (from && to) {
      const start = startOfIstDay(from.year, from.month, from.day);
      const endExclusive = new Date(startOfIstDay(to.year, to.month, to.day).getTime() + DAY_MS);
      const days = (endExclusive.getTime() - start.getTime()) / DAY_MS;
      if (endExclusive > start && days <= MAX_CUSTOM_RANGE_DAYS) {
        return {
          preset: "custom",
          start,
          endExclusive,
          fromStr: istDateString(start),
          toStr: istDateString(new Date(endExclusive.getTime() - DAY_MS)),
          label: `${formatDateIst(start)} – ${formatDateIst(new Date(endExclusive.getTime() - DAY_MS))}`,
        };
      }
    }
  }

  const range = monthRange(today.year, today.month);
  return { ...range, preset: "this-month", label: `This month (${MONTH_NAMES[today.month - 1]} ${today.year})` };
}

/* ---------------- Indian financial year (April → March) ---------------- */

/** Calendar months in financial-year order: April … March. */
export const FY_MONTH_ORDER = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3] as const;

/** Start year of the FY containing the instant (Apr 2026 – Mar 2027 → 2026). */
export function fyStartYearOf(date: Date): number {
  const p = istParts(date);
  return p.month >= 4 ? p.year : p.year - 1;
}

/** "2026-27" */
export function fyLabel(startYear: number): string {
  return `${startYear}-${pad((startYear + 1) % 100)}`;
}

/** Calendar year in which `month` (1-12) falls for the FY starting in `fyStartYear`. */
export function fyCalendarYear(fyStartYear: number, month: number): number {
  return month >= 4 ? fyStartYear : fyStartYear + 1;
}

/** Range for one month of a financial year. */
export function fyMonthRange(fyStartYear: number, month: number): DateRange {
  return monthRange(fyCalendarYear(fyStartYear, month), month);
}

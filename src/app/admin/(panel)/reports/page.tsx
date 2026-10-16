import { FY_MONTH_ORDER, fyCalendarYear, fyLabel, fyStartYearOf, istParts, monthName } from "@/lib/dates";
import { formatPaise } from "@/lib/money";
import { DISCLAIMER, buildReport } from "@/lib/report";
import { requireAdminPage } from "@/server/auth";
import { databaseStatus, isDatabaseConfigured } from "@/server/db";
import { MIN_REPORT_FY, loadReportInput, reportYearBounds } from "@/server/report-data";
import { Badge, Card, DatabaseError, DatabaseNotConfigured, Notice, PageHeader, btnPrimary, btnSecondary, inputClass } from "../../_components/ui";

export const dynamic = "force-dynamic";

const CSV_SHEETS = [
  { key: "summary", label: "Summary" },
  { key: "orders", label: "Order Details" },
  { key: "products", label: "Product Sales" },
  { key: "payments", label: "Payment Reconciliation" },
  { key: "tax", label: "Tax Summary" },
];

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdminPage();
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Monthly Reports / CA Export" />
        <DatabaseNotConfigured />
      </>
    );
  }
  const status = await databaseStatus();
  if (!status.connected) {
    return (
      <>
        <PageHeader title="Monthly Reports / CA Export" />
        <DatabaseError message={status.error ?? "Unknown error"} />
      </>
    );
  }

  const sp = await searchParams;
  const now = new Date();
  const ist = istParts(now);
  const currentFy = fyStartYearOf(now);

  // Default: the most recently completed month (the current month is still in progress).
  const prevMonth = ist.month === 1 ? 12 : ist.month - 1;
  const prevCal = ist.month === 1 ? ist.year - 1 : ist.year;
  const defaultFy = prevMonth >= 4 ? prevCal : prevCal - 1;

  const reqFy = Number(sp.fy);
  const reqMonth = Number(sp.month);
  const fy = Number.isInteger(reqFy) && reqFy >= MIN_REPORT_FY && reqFy <= currentFy ? reqFy : defaultFy;
  const month = Number.isInteger(reqMonth) && reqMonth >= 1 && reqMonth <= 12 ? reqMonth : prevMonth;

  const { first } = await reportYearBounds();
  const firstFy = Math.max(MIN_REPORT_FY, Math.min(first ?? currentFy, currentFy - 1));
  const years: number[] = [];
  for (let y = currentFy; y >= firstFy; y--) years.push(y);

  const report = buildReport(await loadReportInput(fy, month, now));
  const s = report.summary;
  const bad = report.checks.filter((c) => !c.ok);
  const calYear = fyCalendarYear(fy, month);
  const isCurrentMonth = calYear === ist.year && month === ist.month;
  const qs = `fy=${fy}&month=${month}`;

  const rows: [string, string][] = [
    ["Orders placed (all statuses)", String(s.ordersPlaced)],
    ["Paid orders (counted as sales)", String(s.salesOrders)],
    ["Gross sales", formatPaise(s.grossSalesPaise)],
    ["Discounts", formatPaise(s.discountsPaise)],
    ["Returns and refunds", formatPaise(s.refundsPaise)],
    ["Net sales", formatPaise(s.netSalesPaise)],
    ["Shipping charges", formatPaise(s.shippingPaise)],
    ["Final order totals", formatPaise(s.finalTotalsPaise)],
    ["Taxable sales", formatPaise(s.taxablePaise)],
    ["CGST / SGST / IGST", `${formatPaise(s.cgstPaise)} / ${formatPaise(s.sgstPaise)} / ${formatPaise(s.igstPaise)}`],
    ["Paid amount (received)", formatPaise(s.paidAmountPaise)],
    ["Unpaid amount (awaiting payment)", formatPaise(s.unpaidAmountPaise)],
  ];

  return (
    <>
      <PageHeader title="Monthly Reports / CA Export" subtitle="Pick a financial year and month, then download an Excel workbook you can send straight to your Chartered Accountant." />

      <Card className="mb-4">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-extrabold uppercase tracking-wide text-charcoal/70">
            Financial year
            <select name="fy" defaultValue={fy} className={`${inputClass} mt-1 min-w-[10rem]`}>
              {years.map((y) => (
                <option key={y} value={y}>
                  FY {fyLabel(y)} (Apr {y} – Mar {y + 1})
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-extrabold uppercase tracking-wide text-charcoal/70">
            Month
            <select name="month" defaultValue={month} className={`${inputClass} mt-1 min-w-[10rem]`}>
              {FY_MONTH_ORDER.map((m) => (
                <option key={m} value={m}>
                  {monthName(m)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className={btnSecondary}>
            Show preview
          </button>
        </form>
      </Card>

      <Card
        title={`${report.input.periodLabel} · FY ${report.input.fyLabel}`}
        subtitle={`Orders placed ${report.input.fromStr} to ${report.input.toStr} (IST).`}
        action={bad.length === 0 ? <Badge tone="good">All totals reconcile</Badge> : <Badge tone="bad">{bad.length} check(s) failed</Badge>}
      >
        {isCurrentMonth && (
          <div className="mb-3">
            <Notice tone="warn">This month is still in progress — the report will change as more orders and refunds are recorded. Download it again after month-end.</Notice>
          </div>
        )}
        {(report.input.testOrdersExcluded ?? 0) > 0 && (
          <div className="mb-3">
            <Notice tone="info" title="Test orders left out">
              <p>
                {report.input.testOrdersExcluded} order{report.input.testOrdersExcluded === 1 ? "" : "s"} in this month {report.input.testOrdersExcluded === 1 ? "was" : "were"} placed with Razorpay test keys (no real money) and {report.input.testOrdersExcluded === 1 ? "is" : "are"} not in this report.
              </p>
            </Notice>
          </div>
        )}
        {bad.length > 0 && (
          <div className="mb-3">
            <Notice tone="bad" title="Some totals do not reconcile">
              <ul className="list-disc pl-5">
                {bad.map((c) => (
                  <li key={c.label}>{c.label}</li>
                ))}
              </ul>
              <p className="mt-1">Check the affected orders and payments before sending this report.</p>
            </Notice>
          </div>
        )}
        <dl className="grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 border-b border-charcoal/8 py-1.5">
              <dt className="text-charcoal/75">{k}</dt>
              <dd className="font-extrabold text-deep-plum">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href={`/api/admin/reports/monthly?${qs}&format=xlsx`} className={btnPrimary} download>
            ⬇ Download Excel for CA
          </a>
          <span className="text-xs text-charcoal/60">.xlsx · 5 sheets: Summary, Order Details, Product Sales, Payment Reconciliation, Tax Summary</span>
        </div>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-charcoal/60">Or download a single sheet as CSV</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {CSV_SHEETS.map((c) => (
            <a key={c.key} href={`/api/admin/reports/monthly?${qs}&format=csv&sheet=${c.key}`} className="rounded-full border border-charcoal/20 px-3 py-1 text-xs font-bold text-charcoal hover:border-charcoal/50" download>
              {c.label}.csv
            </a>
          ))}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="How this report is calculated">
          <ul className="list-disc space-y-1 pl-5 text-sm text-charcoal/80">
            <li>Orders are selected by <strong>order date</strong> in Indian Standard Time.</li>
            <li>A <strong>sale</strong> is an order for which payment was received and verified. Orders awaiting payment or cancelled before payment are listed but never counted as sales.</li>
            <li>Amounts come only from recorded orders, payments and refunds. GST appears only for orders placed while GST was enabled and the product had a GST rate; otherwise the report says “not applied” instead of guessing.</li>
            <li>Invoice numbers are shown only where you entered them on the order. This system does not generate tax invoices.</li>
            <li>Shipping is shown separately; GST on shipping is not calculated.</li>
          </ul>
        </Card>
        <Card title="Important">
          <p className="text-sm text-charcoal/80">{DISCLAIMER}</p>
          <p className="mt-2 text-sm text-charcoal/80">Your Chartered Accountant remains responsible for GST returns, credit notes and any adjustments.</p>
        </Card>
      </div>
    </>
  );
}

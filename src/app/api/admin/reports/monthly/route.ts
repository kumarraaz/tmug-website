import { monthShort } from "@/lib/dates";
import { buildReport, type ReportSheet } from "@/lib/report";
import { sheetToCsv } from "@/lib/report-csv";
import { adminGuard } from "@/server/auth";
import { errorResponse, jsonError } from "@/server/http";
import { MIN_REPORT_FY, loadReportInput } from "@/server/report-data";
import { buildWorkbook } from "@/server/report-xlsx";

export const dynamic = "force-dynamic";

const SHEETS = ["summary", "orders", "products", "payments", "tax"] as const;
type SheetKey = (typeof SHEETS)[number];

/**
 * GET /api/admin/reports/monthly?fy=2026&month=10&format=xlsx            → full workbook
 * GET /api/admin/reports/monthly?fy=2026&month=10&format=csv&sheet=orders → one sheet as CSV
 * `fy` is the year the financial year STARTS (April); `month` is the calendar month 1-12.
 */
export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const fy = Number(url.searchParams.get("fy"));
  const month = Number(url.searchParams.get("month"));
  const format = url.searchParams.get("format") ?? "xlsx";
  const nowYear = new Date().getUTCFullYear() + 1;
  if (!Number.isInteger(fy) || fy < MIN_REPORT_FY || fy > nowYear) return jsonError("Choose a valid financial year.", 400);
  if (!Number.isInteger(month) || month < 1 || month > 12) return jsonError("Choose a valid month.", 400);
  if (format !== "xlsx" && format !== "csv") return jsonError("Format must be xlsx or csv.", 400);

  try {
    const report = buildReport(await loadReportInput(fy, month));
    const calYear = month >= 4 ? fy : fy + 1;
    const stem = `TMUG-CA-Report-${calYear}-${String(month).padStart(2, "0")}-${monthShort(month)}-FY${report.input.fyLabel}`;
    const headers = { "Cache-Control": "no-store, max-age=0", "X-Content-Type-Options": "nosniff" };

    if (format === "xlsx") {
      const body = await buildWorkbook(report);
      return new Response(new Uint8Array(body), {
        headers: {
          ...headers,
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${stem}.xlsx"`,
        },
      });
    }

    const key = (url.searchParams.get("sheet") ?? "orders") as SheetKey;
    if (!SHEETS.includes(key)) return jsonError("Unknown sheet.", 400);
    const sheet: ReportSheet = report.sheets[key];
    return new Response(sheetToCsv(sheet), {
      headers: {
        ...headers,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${stem}-${key}.csv"`,
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

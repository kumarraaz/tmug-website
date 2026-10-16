import "server-only";
import ExcelJS from "exceljs";
import { IST_OFFSET_MS } from "@/lib/dates";
import type { Cell, CellType, Column, Report, ReportSheet, Row } from "@/lib/report";

/**
 * Builds the real .xlsx workbook for the CA (ExcelJS). Sheets, in order:
 *   1 Monthly Sales Summary   2 Order Details   3 Product Sales
 *   4 Payment Reconciliation  5 Tax Summary
 *
 * Formatting: styled header, ₹ with Indian (lakh / crore) digit grouping, dd-mmm-yyyy
 * dates in IST, sized columns, filters + frozen header on the data sheets, and live
 * SUBTOTAL totals that follow the filters.
 */

// Indian grouping: 1,23,45,678.90 / 12,34,567.50 / 99,999.50
const MONEY_FORMAT = '[>=10000000]"₹"##\\,##\\,##\\,##0.00;[>=100000]"₹"##\\,##\\,##0.00;"₹"#,##0.00';
const FORMATS: Record<CellType, string | undefined> = {
  text: undefined,
  money: MONEY_FORMAT,
  int: "#,##0",
  percent: "0.00%",
  date: "dd-mmm-yyyy",
  datetime: "dd-mmm-yyyy hh:mm",
};

const COLOURS = {
  header: "FF33243A", // deep plum
  headerText: "FFFFFFFF",
  section: "FFFBE7DC", // warm surface
  total: "FFFFF3B0",
  note: "FF5C5560",
  border: "FFE3D9D0",
  tab: ["FF33243A", "FFFAA4B5", "FFF8B77C", "FF70C1E1", "FF82BA88"],
};

const thin = { style: "thin" as const, color: { argb: COLOURS.border } };

function columnLetter(n: number): string {
  let s = "";
  for (let x = n; x > 0; x = Math.floor((x - 1) / 26)) s = String.fromCharCode(65 + ((x - 1) % 26)) + s;
  return s;
}

/** Excel stores dates without a time zone; shift so the sheet shows IST wall-clock time. */
const toExcelDate = (d: Date) => new Date(d.getTime() + IST_OFFSET_MS);

function cellValue(cell: Cell, type: CellType): ExcelJS.CellValue {
  if (cell === null || cell === undefined || cell === "") return null;
  if (cell instanceof Date) return toExcelDate(cell);
  if (typeof cell === "number") {
    if (type === "money") return cell / 100;
    if (type === "percent") return cell / 10000;
    return cell;
  }
  return cell;
}

/** Convert an exact integer total (paise for money) to the value written in the sheet (rupees for money). */
const fromTotal = (total: number, type: CellType): number => (type === "money" ? total / 100 : total);
const raw = (cell: Cell | undefined): number => (typeof cell === "number" ? cell : 0);

function addHeadingLine(ws: ExcelJS.Worksheet, rowNo: number, text: string, columns: Column[], bold: boolean) {
  const cell = ws.getCell(rowNo, 1);
  cell.value = text;
  cell.font = bold ? { bold: true, size: 14, color: { argb: COLOURS.header } } : { size: 10, color: { argb: COLOURS.note } };
  cell.alignment = { vertical: "top", wrapText: true };
  // Merge across enough columns to read comfortably, and size the row for the wrapped text.
  let span = 0;
  let widthChars = 0;
  while (span < columns.length && widthChars < 130) {
    widthChars += columns[span].width;
    span += 1;
  }
  if (span > 1) ws.mergeCells(rowNo, 1, rowNo, span);
  const charsPerLine = Math.max(30, widthChars * 1.05);
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
  ws.getRow(rowNo).height = bold ? 24 : Math.max(15, lines * 14);
}

function styleDataCell(cell: ExcelJS.Cell, col: Column) {
  const fmt = FORMATS[col.type];
  if (fmt) cell.numFmt = fmt;
  cell.border = { bottom: thin };
  cell.alignment = {
    vertical: "top",
    horizontal: col.type === "text" || col.type === "datetime" || col.type === "date" ? "left" : "right",
    indent: col.type === "text" || col.type === "datetime" || col.type === "date" ? 1 : 0,
    wrapText: false,
  };
}

function writeSheet(wb: ExcelJS.Workbook, sheet: ReportSheet, index: number) {
  const ncols = sheet.columns.length;
  const ws = wb.addWorksheet(sheet.name, {
    properties: { tabColor: { argb: COLOURS.tab[index % COLOURS.tab.length] } },
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9 },
  });
  sheet.columns.forEach((c, i) => {
    ws.getColumn(i + 1).width = c.width;
  });

  // Data sheets: only the title sits above the table (keeps the frozen area small);
  // the remaining notes go below it. The summary is a fixed layout with all notes on top.
  const topLines = sheet.filterable ? sheet.heading.slice(0, 1) : sheet.heading;
  const bottomLines = sheet.filterable ? sheet.heading.slice(1) : [];

  let r = 1;
  topLines.forEach((line, i) => {
    addHeadingLine(ws, r, line, sheet.columns, i === 0);
    r += 1;
  });
  if (!sheet.filterable) r += 1;

  // Header row
  const headerRow = r;
  sheet.columns.forEach((c, i) => {
    const cell = ws.getCell(headerRow, i + 1);
    cell.value = c.header;
    cell.font = { bold: true, color: { argb: COLOURS.headerText } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOURS.header } };
    cell.alignment = { vertical: "middle", horizontal: c.type === "text" ? "left" : "center", indent: c.type === "text" ? 1 : 0, wrapText: true };
    cell.border = { bottom: thin };
  });
  ws.getRow(headerRow).height = 32;

  // Rows
  r = headerRow + 1;
  const firstData = r;
  for (const row of sheet.rows) {
    writeRow(ws, r, row, sheet.columns);
    r += 1;
  }
  const lastData = r - 1;

  if (sheet.filterable) {
    if (sheet.rows.length === 0) {
      const cell = ws.getCell(r, 1);
      cell.value = "No records in this period.";
      cell.font = { italic: true, color: { argb: COLOURS.note } };
      r += 1;
    } else {
      ws.autoFilter = { from: { row: headerRow, column: 1 }, to: { row: lastData, column: ncols } };

      // Live totals that follow the filters.
      if (sheet.columns.some((c) => c.sum)) {
        const totalRow = r;
        const label = ws.getCell(totalRow, 1);
        label.value = "Total (follows filters)";
        sheet.columns.forEach((c, i) => {
          const cell = ws.getCell(totalRow, i + 1);
          if (c.sum) {
            const letter = columnLetter(i + 1);
            const result = fromTotal(sheet.rows.reduce((acc, row) => acc + raw(row.cells[i]), 0), c.type);
            cell.value = { formula: `SUBTOTAL(109,${letter}${firstData}:${letter}${lastData})`, result };
            cell.numFmt = FORMATS[c.type] ?? "General";
          }
          cell.font = { bold: true };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOURS.total } };
          cell.border = { top: { style: "thin", color: { argb: COLOURS.header } } };
          cell.alignment = { horizontal: c.type === "text" ? "left" : "right" };
        });
        r += 1;

        // Orders sheet: also show the total for rows counted as sales (matches the Summary).
        const countedIdx = sheet.columns.findIndex((c) => c.header === "Counted in sales");
        if (countedIdx >= 0) {
          const countedLetter = columnLetter(countedIdx + 1);
          const row2 = r;
          ws.getCell(row2, 1).value = "Of which counted in sales (paid orders)";
          sheet.columns.forEach((c, i) => {
            const cell = ws.getCell(row2, i + 1);
            if (c.sum) {
              const letter = columnLetter(i + 1);
              const result = fromTotal(sheet.rows.reduce((acc, row) => acc + (row.cells[countedIdx] === "Yes" ? raw(row.cells[i]) : 0), 0), c.type);
              cell.value = { formula: `SUMIFS(${letter}${firstData}:${letter}${lastData},$${countedLetter}${firstData}:$${countedLetter}${lastData},"Yes")`, result };
              cell.numFmt = FORMATS[c.type] ?? "General";
            }
            cell.font = { bold: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOURS.total } };
            cell.alignment = { horizontal: c.type === "text" ? "left" : "right" };
          });
          r += 1;
        }
      }
    }
  }

  // Notes below the table
  if (bottomLines.length > 0) {
    r += 1;
    for (const line of bottomLines) {
      addHeadingLine(ws, r, line, sheet.columns, false);
      r += 1;
    }
  }

  // Freeze the title + header row (and leading identifier columns) on data sheets.
  if (sheet.filterable) {
    ws.views = [{ state: "frozen", xSplit: sheet.freezeColumns, ySplit: headerRow, topLeftCell: `${columnLetter(sheet.freezeColumns + 1)}${headerRow + 1}` }];
  }
}

function writeRow(ws: ExcelJS.Worksheet, rowNo: number, row: Row, columns: Column[]) {
  const kind = row.kind ?? "data";
  columns.forEach((col, i) => {
    const cell = ws.getCell(rowNo, i + 1);
    cell.value = cellValue(row.cells[i] ?? null, col.type);
    styleDataCell(cell, col);
    if (kind === "section") {
      cell.font = { bold: true, color: { argb: COLOURS.header } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOURS.section } };
    } else if (kind === "total") {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOURS.total } };
    } else if (kind === "note") {
      cell.font = { italic: true, color: { argb: COLOURS.note } };
    }
    // Long explanatory text (summary "Basis / notes") wraps.
    if (col.type === "text" && col.width >= 60) cell.alignment = { vertical: "top", horizontal: "left", indent: 1, wrapText: true };
  });
}

export async function buildWorkbook(report: Report): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "TMUG Admin";
  wb.lastModifiedBy = "TMUG Admin";
  wb.created = report.input.generatedAt;
  wb.modified = report.input.generatedAt;
  wb.title = `${report.input.store.storeName} — Monthly CA report — ${report.input.periodLabel}`;
  wb.subject = "Bookkeeping support report (not a GST return)";
  wb.description = "Generated from store records. Not filed with or verified by any government authority.";

  const { summary, orders, products, payments, tax } = report.sheets;
  [summary, orders, products, payments, tax].forEach((sheet, i) => writeSheet(wb, sheet, i));

  const out = await wb.xlsx.writeBuffer();
  return Buffer.from(out as ArrayBuffer);
}

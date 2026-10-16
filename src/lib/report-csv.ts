import { formatDateIst, formatDateTimeIst } from "./dates";
import type { Cell, CellType, ReportSheet } from "./report";

/**
 * CSV export of one report sheet (UTF-8 with BOM so Excel opens ₹ and Indic text
 * correctly, CRLF line endings).
 *
 * Spreadsheet formula injection: customer-supplied text (names, addresses…) that
 * starts with = + - @ TAB or CR would be executed by Excel when the CSV is opened,
 * so such text cells are prefixed with an apostrophe.
 */

export function csvEscapeText(value: string): string {
  const guarded = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

function formatCell(cell: Cell, type: CellType): string {
  if (cell === null || cell === undefined) return "";
  if (cell instanceof Date) return csvEscapeText(type === "date" ? formatDateIst(cell) : formatDateTimeIst(cell));
  if (typeof cell === "number") {
    if (type === "money") return (cell / 100).toFixed(2);
    if (type === "percent") return `${(cell / 100).toFixed(2)}%`;
    return String(cell);
  }
  return csvEscapeText(cell);
}

export function sheetToCsv(sheet: ReportSheet): string {
  const lines: string[] = [];
  lines.push(sheet.columns.map((c) => csvEscapeText(c.header)).join(","));
  for (const row of sheet.rows) {
    lines.push(sheet.columns.map((c, i) => formatCell(row.cells[i] ?? null, c.type)).join(","));
  }
  return `﻿${lines.join("\r\n")}\r\n`;
}

import test from "node:test";
import assert from "node:assert/strict";
import {
  fyCalendarYear,
  fyLabel,
  fyMonthRange,
  fyStartYearOf,
  istDateString,
  istParts,
  monthRange,
  parseDateInput,
  resolveRange,
  startOfIstDay,
} from "./dates";

const iso = (d: Date) => d.toISOString();

test("IST day boundary is 18:30 UTC the previous day", () => {
  assert.equal(istDateString(new Date("2026-10-15T18:29:59Z")), "2026-10-15");
  assert.equal(istDateString(new Date("2026-10-15T18:30:00Z")), "2026-10-16");
  assert.equal(iso(startOfIstDay(2026, 10, 16)), "2026-10-15T18:30:00.000Z");
  const p = istParts(new Date("2026-12-31T20:00:00Z"));
  assert.deepEqual([p.year, p.month, p.day, p.hour, p.minute], [2027, 1, 1, 1, 30]);
});

test("parseDateInput validates real calendar dates only", () => {
  assert.deepEqual(parseDateInput("2028-02-29"), { year: 2028, month: 2, day: 29 });
  assert.equal(parseDateInput("2026-02-29"), null);
  assert.equal(parseDateInput("2026-13-01"), null);
  assert.equal(parseDateInput("16-10-2026"), null);
  assert.equal(parseDateInput(""), null);
  assert.equal(parseDateInput(undefined), null);
});

test("resolveRange: today / this month / previous month", () => {
  const now = new Date("2026-10-16T05:00:00Z"); // 10:30 IST on 16 Oct
  const today = resolveRange("today", now);
  assert.equal(iso(today.start), "2026-10-15T18:30:00.000Z");
  assert.equal(iso(today.endExclusive), "2026-10-16T18:30:00.000Z");
  assert.equal(today.fromStr, "2026-10-16");

  const month = resolveRange("this-month", now);
  assert.equal(month.fromStr, "2026-10-01");
  assert.equal(month.toStr, "2026-10-31");
  assert.equal(iso(month.start), "2026-09-30T18:30:00.000Z");
  assert.equal(iso(month.endExclusive), "2026-10-31T18:30:00.000Z");

  const prev = resolveRange("previous-month", now);
  assert.equal(prev.fromStr, "2026-09-01");
  assert.equal(prev.toStr, "2026-09-30");
});

test("resolveRange: previous month across a year boundary", () => {
  const prev = resolveRange("previous-month", new Date("2027-01-10T06:00:00Z"));
  assert.equal(prev.fromStr, "2026-12-01");
  assert.equal(prev.toStr, "2026-12-31");
});

test("resolveRange: custom range is inclusive of the end date", () => {
  const r = resolveRange("custom", new Date("2026-10-16T05:00:00Z"), "2026-10-01", "2026-10-03");
  assert.equal(r.preset, "custom");
  assert.equal(iso(r.start), "2026-09-30T18:30:00.000Z");
  assert.equal(iso(r.endExclusive), "2026-10-03T18:30:00.000Z");
  assert.equal(r.toStr, "2026-10-03");
});

test("resolveRange: invalid / reversed / oversized custom ranges fall back to this month", () => {
  const now = new Date("2026-10-16T05:00:00Z");
  for (const [from, to] of [
    ["2026-10-05", "2026-10-01"],
    ["nope", "2026-10-01"],
    [undefined, undefined],
    ["2020-01-01", "2026-10-01"],
  ] as const) {
    const r = resolveRange("custom", now, from, to);
    assert.equal(r.preset, "this-month", `${from}..${to}`);
  }
  assert.equal(resolveRange("garbage", now).preset, "this-month");
});

test("monthRange handles leap February and December", () => {
  const feb = monthRange(2028, 2);
  assert.equal(feb.toStr, "2028-02-29");
  const dec = monthRange(2026, 12);
  assert.equal(dec.toStr, "2026-12-31");
  assert.equal(iso(dec.endExclusive), "2026-12-31T18:30:00.000Z");
});

test("financial year runs April to March (IST)", () => {
  assert.equal(fyStartYearOf(new Date("2026-03-31T18:29:00Z")), 2025); // 31 Mar 23:59 IST
  assert.equal(fyStartYearOf(new Date("2026-03-31T18:30:00Z")), 2026); // 1 Apr 00:00 IST
  assert.equal(fyStartYearOf(new Date("2026-10-16T05:00:00Z")), 2026);
  assert.equal(fyStartYearOf(new Date("2027-02-01T05:00:00Z")), 2026);
  assert.equal(fyLabel(2026), "2026-27");
  assert.equal(fyLabel(2099), "2099-00");
  assert.equal(fyCalendarYear(2026, 4), 2026);
  assert.equal(fyCalendarYear(2026, 3), 2027);
  assert.equal(fyMonthRange(2026, 1).fromStr, "2027-01-01");
  assert.equal(fyMonthRange(2026, 4).fromStr, "2026-04-01");
});

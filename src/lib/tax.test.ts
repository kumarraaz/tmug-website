import test from "node:test";
import assert from "node:assert/strict";
import { priceOrder, TaxConfigError, type TaxSettings, type PricingLineInput } from "./tax";
import { sum } from "./money";

const GST_ON_INCL: TaxSettings = { gstEnabled: true, pricesIncludeGst: true, sellerState: "Maharashtra" };
const GST_ON_EXCL: TaxSettings = { gstEnabled: true, pricesIncludeGst: false, sellerState: "Maharashtra" };
const GST_OFF: TaxSettings = { gstEnabled: false, pricesIncludeGst: true, sellerState: null };

const line = (unit: number, qty = 1, rate: number | null = 500): PricingLineInput => ({
  unitPricePaise: unit,
  qty,
  gstRateBp: rate,
});

test("GST disabled: nothing is taxed and no rate is recorded", () => {
  const r = priceOrder({ lines: [line(9900, 2)], discountPercent: 0, shippingPaise: 0, tax: GST_OFF, placeOfSupplyState: "Kerala" });
  assert.equal(r.taxPaise, 0);
  assert.equal(r.totalPaise, 19800);
  assert.equal(r.supply, "none");
  assert.equal(r.lines[0].gstApplied, false);
  assert.equal(r.lines[0].gstRateBp, null);
  assert.equal(r.lines[0].taxablePaise, 19800);
});

test("tax-inclusive 5%, intra-state: taxable + CGST + SGST = price", () => {
  const r = priceOrder({ lines: [line(10500)], discountPercent: 0, shippingPaise: 0, tax: GST_ON_INCL, placeOfSupplyState: "maharashtra" });
  const l = r.lines[0];
  assert.equal(r.supply, "intra");
  assert.equal(l.taxablePaise, 10000);
  assert.equal(l.taxPaise, 500);
  assert.equal(l.cgstPaise, 250);
  assert.equal(l.sgstPaise, 250);
  assert.equal(l.igstPaise, 0);
  assert.equal(r.totalPaise, 10500, "inclusive pricing must not change the total");
});

test("tax-inclusive 5% on ₹99 splits odd paise without losing any", () => {
  const r = priceOrder({ lines: [line(9900)], discountPercent: 0, shippingPaise: 0, tax: GST_ON_INCL, placeOfSupplyState: "Maharashtra" });
  const l = r.lines[0];
  assert.equal(l.taxablePaise, 9429);
  assert.equal(l.taxPaise, 471);
  assert.equal(l.cgstPaise + l.sgstPaise, 471);
  assert.equal(l.taxablePaise + l.taxPaise, 9900);
});

test("inter-state supply uses IGST only", () => {
  const r = priceOrder({ lines: [line(10500)], discountPercent: 0, shippingPaise: 0, tax: GST_ON_INCL, placeOfSupplyState: "Karnataka" });
  assert.equal(r.supply, "inter");
  assert.equal(r.lines[0].igstPaise, 500);
  assert.equal(r.lines[0].cgstPaise, 0);
  assert.equal(r.lines[0].sgstPaise, 0);
});

test("tax-exclusive pricing adds GST on top", () => {
  const r = priceOrder({ lines: [line(10000, 3)], discountPercent: 0, shippingPaise: 0, tax: GST_ON_EXCL, placeOfSupplyState: "Maharashtra" });
  assert.equal(r.lines[0].taxablePaise, 30000);
  assert.equal(r.taxPaise, 1500);
  assert.equal(r.totalPaise, 31500);
});

test("coupon discount is allocated across lines and sums exactly", () => {
  const r = priceOrder({ lines: [line(9900), line(18900)], discountPercent: 10, shippingPaise: 0, tax: GST_OFF, placeOfSupplyState: null });
  assert.equal(r.subtotalPaise, 28800);
  assert.equal(r.discountPaise, 2880);
  assert.deepEqual(r.lines.map((l) => l.discountPaise), [990, 1890]);
  assert.equal(r.totalPaise, 25920);
});

test("a line without a configured rate is left untaxed even when GST is enabled", () => {
  const r = priceOrder({ lines: [line(10500, 1, 500), line(10000, 1, null)], discountPercent: 0, shippingPaise: 0, tax: GST_ON_INCL, placeOfSupplyState: "Maharashtra" });
  assert.equal(r.lines[0].gstApplied, true);
  assert.equal(r.lines[1].gstApplied, false);
  assert.equal(r.lines[1].gstRateBp, null);
  assert.equal(r.taxPaise, 500);
});

test("shipping is added to the total and is not taxed", () => {
  const r = priceOrder({ lines: [line(10500)], discountPercent: 0, shippingPaise: 5000, tax: GST_ON_INCL, placeOfSupplyState: "Maharashtra" });
  assert.equal(r.shippingPaise, 5000);
  assert.equal(r.taxPaise, 500);
  assert.equal(r.totalPaise, 15500);
});

test("enabling GST without a business / delivery state is refused, never guessed", () => {
  assert.throws(
    () => priceOrder({ lines: [line(10500)], discountPercent: 0, shippingPaise: 0, tax: { ...GST_ON_INCL, sellerState: null }, placeOfSupplyState: "Kerala" }),
    TaxConfigError,
  );
  assert.throws(
    () => priceOrder({ lines: [line(10500)], discountPercent: 0, shippingPaise: 0, tax: GST_ON_INCL, placeOfSupplyState: null }),
    TaxConfigError,
  );
});

test("pricing invariants hold for random baskets", () => {
  let seed = 987654321;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const rates = [null, 0, 250, 500, 1200, 1800, 2800];
  for (let n = 0; n < 3000; n++) {
    const lines = Array.from({ length: 1 + Math.floor(rnd() * 5) }, () =>
      line(100 + Math.floor(rnd() * 120000), 1 + Math.floor(rnd() * 6), rates[Math.floor(rnd() * rates.length)]),
    );
    const settings = rnd() < 0.5 ? GST_ON_INCL : GST_ON_EXCL;
    const state = rnd() < 0.5 ? "Maharashtra" : "Tamil Nadu";
    const pct = [0, 5, 10, 15][Math.floor(rnd() * 4)];
    const shipping = Math.floor(rnd() * 20000);
    const r = priceOrder({ lines, discountPercent: pct, shippingPaise: shipping, tax: settings, placeOfSupplyState: state });

    assert.equal(sum(r.lines.map((l) => l.discountPaise)), r.discountPaise, "line discounts add up");
    assert.equal(sum(r.lines.map((l) => l.netPaise)), r.subtotalPaise - r.discountPaise, "line nets add up");
    assert.equal(sum(r.lines.map((l) => l.taxPaise)), r.taxPaise, "line taxes add up");
    for (const l of r.lines) {
      assert.equal(l.cgstPaise + l.sgstPaise + l.igstPaise, l.taxPaise, "split equals tax");
      assert.ok(l.taxablePaise >= 0 && l.taxPaise >= 0);
      if (l.gstApplied && settings.pricesIncludeGst) assert.equal(l.taxablePaise + l.taxPaise, l.netPaise);
      if (l.gstApplied && !settings.pricesIncludeGst) assert.equal(l.totalPaise, l.netPaise + l.taxPaise);
      if (!l.gstApplied) assert.equal(l.taxPaise, 0);
    }
    const expectedTotal = r.subtotalPaise - r.discountPaise + shipping + (settings.pricesIncludeGst ? 0 : r.taxPaise);
    assert.equal(r.totalPaise, expectedTotal, "grand total reconciles");
  }
});

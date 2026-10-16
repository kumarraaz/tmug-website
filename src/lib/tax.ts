/**
 * Order pricing and GST arithmetic. Pure functions, integer paise only.
 *
 * Nothing here invents a tax rate: a line is taxed only when GST is enabled in
 * the store settings AND the product has a configured GST rate.
 */

import { allocate, sum } from "./money";
import { isSameState } from "./india";

export interface TaxSettings {
  gstEnabled: boolean;
  /** true: listed prices already include GST (usual for Indian B2C MRP). */
  pricesIncludeGst: boolean;
  /** The seller's state (needed to decide CGST+SGST vs IGST). */
  sellerState: string | null;
}

export interface PricingLineInput {
  qty: number;
  /** Selling price per unit in paise (sale price if one is active). */
  unitPricePaise: number;
  /** GST rate in basis points (500 = 5%), or null when not configured. */
  gstRateBp: number | null;
}

export interface PricedLine {
  qty: number;
  unitPricePaise: number;
  /** unit price × qty */
  grossPaise: number;
  /** this line's share of the order discount */
  discountPaise: number;
  /** gross − discount */
  netPaise: number;
  gstApplied: boolean;
  gstRateBp: number | null;
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  taxPaise: number;
  /** net, plus tax when prices exclude GST */
  totalPaise: number;
}

export interface PricingResult {
  lines: PricedLine[];
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  /** total GST (included in the total when prices include GST, added otherwise) */
  taxPaise: number;
  totalPaise: number;
  supply: "intra" | "inter" | "none";
}

export class TaxConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaxConfigError";
  }
}

/** Coupon discount in paise: `percent`% of the subtotal, rounded to the nearest paisa, never above the subtotal. */
export function discountForPercent(subtotalPaise: number, percent: number): number {
  const percentBp = Math.round(percent * 100);
  return Math.min(subtotalPaise, Math.round((subtotalPaise * percentBp) / 10000));
}

export interface PriceOrderInput {
  lines: PricingLineInput[];
  /** Coupon percentage off the subtotal, e.g. 10. 0 = none. */
  discountPercent: number;
  shippingPaise: number;
  tax: TaxSettings;
  /** Customer's delivery state — the place of supply. */
  placeOfSupplyState: string | null;
}

export function priceOrder(input: PriceOrderInput): PricingResult {
  const { lines, tax } = input;

  const grosses = lines.map((l) => l.unitPricePaise * l.qty);
  const subtotalPaise = sum(grosses);

  const discountPaise = discountForPercent(subtotalPaise, input.discountPercent);
  const lineDiscounts = allocate(discountPaise, grosses);

  const anyTaxed = tax.gstEnabled && lines.some((l) => l.gstRateBp != null);
  let supply: PricingResult["supply"] = "none";
  if (anyTaxed) {
    if (!tax.sellerState) throw new TaxConfigError("GST is enabled but the business state is not configured.");
    if (!input.placeOfSupplyState) throw new TaxConfigError("A delivery state is required to apply GST.");
    supply = isSameState(tax.sellerState, input.placeOfSupplyState) ? "intra" : "inter";
  }

  const priced: PricedLine[] = lines.map((l, i) => {
    const grossPaise = grosses[i];
    const discount = lineDiscounts[i];
    const netPaise = grossPaise - discount;
    const rate = l.gstRateBp;
    const gstApplied = tax.gstEnabled && rate != null;

    if (!gstApplied || rate == null) {
      return {
        qty: l.qty,
        unitPricePaise: l.unitPricePaise,
        grossPaise,
        discountPaise: discount,
        netPaise,
        gstApplied: false,
        gstRateBp: null,
        taxablePaise: netPaise,
        cgstPaise: 0,
        sgstPaise: 0,
        igstPaise: 0,
        taxPaise: 0,
        totalPaise: netPaise,
      };
    }

    let taxablePaise: number;
    let taxPaise: number;
    if (tax.pricesIncludeGst) {
      taxablePaise = Math.round((netPaise * 10000) / (10000 + rate));
      taxPaise = netPaise - taxablePaise;
    } else {
      taxablePaise = netPaise;
      taxPaise = Math.round((netPaise * rate) / 10000);
    }

    let cgstPaise = 0;
    let sgstPaise = 0;
    let igstPaise = 0;
    if (supply === "intra") {
      cgstPaise = Math.floor(taxPaise / 2);
      sgstPaise = taxPaise - cgstPaise;
    } else {
      igstPaise = taxPaise;
    }

    return {
      qty: l.qty,
      unitPricePaise: l.unitPricePaise,
      grossPaise,
      discountPaise: discount,
      netPaise,
      gstApplied: true,
      gstRateBp: rate,
      taxablePaise,
      cgstPaise,
      sgstPaise,
      igstPaise,
      taxPaise,
      totalPaise: tax.pricesIncludeGst ? netPaise : netPaise + taxPaise,
    };
  });

  const taxPaise = sum(priced.map((l) => l.taxPaise));
  const goodsTotal = sum(priced.map((l) => l.totalPaise));

  return {
    lines: priced,
    subtotalPaise,
    discountPaise,
    shippingPaise: input.shippingPaise,
    taxPaise,
    totalPaise: goodsTotal + input.shippingPaise,
    supply,
  };
}

/** Basis points → "5%" / "2.5%" for display. */
export function formatRateBp(bp: number | null | undefined): string {
  if (bp == null) return "";
  const pct = bp / 100;
  return `${Number.isInteger(pct) ? pct : pct.toFixed(2).replace(/0+$/, "")}%`;
}

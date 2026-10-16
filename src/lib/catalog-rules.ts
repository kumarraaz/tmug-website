/** Pure catalogue rules shared by the storefront catalogue loader and the checkout. */

/** Selling price in paise: the sale price while it is lower than the regular price. */
export function effectivePricePaise(pricePaise: number, salePaise: number | null): number {
  return salePaise != null && salePaise < pricePaise ? salePaise : pricePaise;
}

/** A variant can be bought when it is marked available and tracked stock (if any) is above zero. */
export function isInStock(v: { is_available: boolean; stock_quantity: number | null }): boolean {
  return v.is_available && (v.stock_quantity === null || v.stock_quantity > 0);
}

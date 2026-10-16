/**
 * India-specific reference data and validators (states / UTs with GST state
 * codes, PIN code, mobile number, GSTIN and HSN formats).
 *
 * Validators check FORMAT only. A GSTIN that passes `isValidGstinFormat` has
 * not been verified against the GST portal.
 */

export interface IndianState {
  /** Two-digit GST state code. */
  code: string;
  name: string;
}

export const INDIAN_STATES: readonly IndianState[] = [
  { code: "01", name: "Jammu and Kashmir" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" },
  { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" },
  { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" },
  { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "10", name: "Bihar" },
  { code: "11", name: "Sikkim" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" },
  { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" },
  { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" },
  { code: "18", name: "Assam" },
  { code: "19", name: "West Bengal" },
  { code: "20", name: "Jharkhand" },
  { code: "21", name: "Odisha" },
  { code: "22", name: "Chhattisgarh" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "27", name: "Maharashtra" },
  { code: "29", name: "Karnataka" },
  { code: "30", name: "Goa" },
  { code: "31", name: "Lakshadweep" },
  { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" },
  { code: "34", name: "Puducherry" },
  { code: "35", name: "Andaman and Nicobar Islands" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
  { code: "38", name: "Ladakh" },
];

export const INDIAN_STATE_NAMES: readonly string[] = INDIAN_STATES.map((s) => s.name);

const norm = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();

export function findState(name: string | null | undefined): IndianState | undefined {
  if (!name) return undefined;
  const n = norm(name);
  return INDIAN_STATES.find((s) => norm(s.name) === n);
}

export function isSameState(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return norm(a) === norm(b);
}

/** "27-Maharashtra" for reports, or the raw name when it is not in the list. */
export function placeOfSupplyLabel(stateName: string | null | undefined): string {
  if (!stateName) return "";
  const s = findState(stateName);
  return s ? `${s.code}-${s.name}` : stateName;
}

export function isValidPincode(value: string): boolean {
  return /^[1-9]\d{5}$/.test(value);
}

/**
 * Normalise an Indian mobile number to "+91XXXXXXXXXX".
 * Accepts 10 digits, or with a leading 0 / 91 / +91, ignoring spaces, dashes and brackets.
 * Returns null when it is not a valid 10-digit mobile (starting 6-9).
 */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

export function isValidGstinFormat(value: string): boolean {
  return /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value);
}

/** HSN codes are 4, 6 or 8 digits. */
export function isValidHsn(value: string): boolean {
  return /^\d{4}(\d{2}(\d{2})?)?$/.test(value);
}

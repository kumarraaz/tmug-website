import test from "node:test";
import assert from "node:assert/strict";
import {
  findState,
  INDIAN_STATES,
  isSameState,
  isValidGstinFormat,
  isValidHsn,
  isValidPincode,
  normalizeIndianMobile,
  placeOfSupplyLabel,
} from "./india";

test("state list has unique codes and names", () => {
  assert.equal(new Set(INDIAN_STATES.map((s) => s.code)).size, INDIAN_STATES.length);
  assert.equal(new Set(INDIAN_STATES.map((s) => s.name)).size, INDIAN_STATES.length);
  assert.equal(findState("maharashtra")?.code, "27");
  assert.equal(placeOfSupplyLabel("Karnataka"), "29-Karnataka");
  assert.equal(placeOfSupplyLabel("Somewhere"), "Somewhere");
});

test("state comparison ignores case, spacing and '&' vs 'and'", () => {
  assert.equal(isSameState("Jammu & Kashmir", "jammu  and kashmir"), true);
  assert.equal(isSameState("Delhi", "Haryana"), false);
  assert.equal(isSameState(null, "Delhi"), false);
});

test("mobile numbers normalise to +91XXXXXXXXXX", () => {
  for (const ok of ["9876543210", "+91 98765 43210", "09876543210", "919876543210", "98765-43210"]) {
    assert.equal(normalizeIndianMobile(ok), "+919876543210", ok);
  }
  for (const bad of ["1234567890", "98765", "+1 415 555 0100", "abcdefghij", ""]) {
    assert.equal(normalizeIndianMobile(bad), null, bad);
  }
});

test("PIN code, GSTIN and HSN format checks", () => {
  assert.equal(isValidPincode("110001"), true);
  assert.equal(isValidPincode("011000"), false);
  assert.equal(isValidPincode("1100"), false);
  assert.equal(isValidGstinFormat("27AAPFU0939F1ZV"), true);
  assert.equal(isValidGstinFormat("27AAPFU0939F1Z"), false);
  assert.equal(isValidGstinFormat("27aapfu0939f1zv"), false);
  assert.equal(isValidHsn("0902"), true);
  assert.equal(isValidHsn("09021000"), true);
  assert.equal(isValidHsn("090"), false);
  assert.equal(isValidHsn("09A2"), false);
});

import test from "node:test";
import assert from "node:assert/strict";
import { allocate, formatPaise, parseRupeesInput, rupeesToPaise, sum } from "./money";

test("rupeesToPaise rounds float noise correctly", () => {
  assert.equal(rupeesToPaise(99), 9900);
  assert.equal(rupeesToPaise(18.9), 1890);
  assert.equal(rupeesToPaise(0.07), 7);
  assert.equal(rupeesToPaise(1.15), 115);
  assert.equal(rupeesToPaise(1299.99), 129999);
});

test("parseRupeesInput accepts plain, grouped and ₹-prefixed amounts", () => {
  assert.equal(parseRupeesInput("99"), 9900);
  assert.equal(parseRupeesInput("99.5"), 9950);
  assert.equal(parseRupeesInput("₹ 1,299.00"), 129900);
  assert.equal(parseRupeesInput(0), 0);
  assert.equal(parseRupeesInput(18.9), 1890);
});

test("parseRupeesInput rejects bad input", () => {
  for (const bad of ["", "abc", "-5", "12.345", ".5", "1e3", "1.2.3", "NaN"]) {
    assert.equal(parseRupeesInput(bad), null, `should reject ${JSON.stringify(bad)}`);
  }
});

test("formatPaise uses Indian grouping with two decimals", () => {
  assert.match(formatPaise(12345650), /1,23,456\.50/);
  assert.match(formatPaise(9900), /99\.00/);
});

test("allocate splits exactly and proportionally", () => {
  assert.deepEqual(allocate(10, [1, 1, 1]), [4, 3, 3]);
  assert.deepEqual(allocate(2880, [9900, 18900]), [990, 1890]);
  assert.deepEqual(allocate(0, [5, 5]), [0, 0]);
  assert.deepEqual(allocate(100, [0, 0]), [0, 0]);
});

test("allocate always sums to the total (randomised)", () => {
  let seed = 12345;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let n = 0; n < 2000; n++) {
    const parts = 1 + Math.floor(rnd() * 8);
    const weights = Array.from({ length: parts }, () => Math.floor(rnd() * 500000));
    const total = Math.floor(rnd() * 400000);
    const out = allocate(total, weights);
    const weightSum = sum(weights);
    if (weightSum === 0 || total === 0) {
      assert.equal(sum(out), 0);
      continue;
    }
    assert.equal(sum(out), total, `weights=${weights} total=${total}`);
    out.forEach((v, i) => {
      const exact = (total * weights[i]) / weightSum;
      assert.ok(Math.abs(v - exact) < 1 + 1e-9, `part ${i} too far from exact share`);
      assert.ok(v >= 0);
    });
  }
});

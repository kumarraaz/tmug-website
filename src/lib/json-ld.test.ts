import test from "node:test";
import assert from "node:assert/strict";
import { jsonLdString } from "./json-ld";

test("jsonLdString never lets text close the script tag", () => {
  const out = jsonLdString({ name: "</script><script>alert(1)</script> Tea", note: "<!-- x -->" });
  assert.ok(!out.includes("<"), "no raw < may remain");
  assert.ok(!out.toLowerCase().includes("</script"));
});

test("jsonLdString output parses back to exactly the same data", () => {
  const data = { "@type": "Product", name: "<b>Tea</b> & \"Co\" ₹99", list: [1, "a<b"], nested: { x: "</script>" } };
  assert.deepEqual(JSON.parse(jsonLdString(data)), data);
});

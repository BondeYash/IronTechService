import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fitImage } from "../src/lib/image-fit.ts";
import { enquirySchema, careerSchema } from "../src/lib/schemas.ts";
import { submissionDelivered } from "../src/lib/submission-result.ts";

for (const [name, width, height, boxWidth, boxHeight] of [
  ["landscape", 1600, 827, 1100, 600],
  ["portrait on mobile", 593, 946, 366, 470],
  ["panorama", 4000, 500, 366, 470],
  ["small source on desktop", 420, 300, 1400, 800],
]) {
  test(`image fits ${name} without crop, stretch or upscale`, () => {
    const result = fitImage(width, height, boxWidth, boxHeight);
    assert.ok(result.width <= boxWidth && result.height <= boxHeight);
    assert.ok(result.scale <= 1 && result.scale > 0);
    assert.ok(Math.abs(result.width / result.height - width / height) < 1e-10);
    assert.equal(result.width, width * result.scale);
  });
}
test("unmeasured/invalid image bounds produce no oversized frame", () => {
  for (const value of [0, -1, NaN, Infinity])
    assert.deepEqual(fitImage(100, 100, value, 200), { width: 0, height: 0, scale: 0 });
});
const enquiry = {
  name: "Test visitor",
  email: "test@example.com",
  message: "A local validation fixture",
};
test("quote scope is optional for both omitted and blank form values", () => {
  assert.equal(enquirySchema.safeParse(enquiry).success, true);
  assert.equal(enquirySchema.safeParse({ ...enquiry, scope: "" }).success, true);
  assert.equal(enquirySchema.safeParse({ ...enquiry, scope: "both" }).success, true);
});
test("invalid scope, email and populated honeypot remain invalid", () => {
  for (const fields of [{ scope: "unexpected" }, { email: "invalid" }, { website: "bot" }])
    assert.equal(enquirySchema.safeParse({ ...enquiry, ...fields }).success, false);
});
test("career form still accepts a blank optional portfolio", () => {
  assert.equal(
    careerSchema.safeParse({
      name: "Test visitor",
      email: "test@example.com",
      role: "trainee",
      experience: "0",
      portfolio: "",
    }).success,
    true,
  );
});
test("only explicit successful delivery is acknowledged", () => {
  for (const value of [
    null,
    {},
    { ok: true },
    { ok: true, delivered: false },
    { ok: false, delivered: true },
  ])
    assert.equal(submissionDelivered(value), false);
  assert.equal(submissionDelivered({ ok: true, delivered: true }), true);
});
test("every project photo has dimensions, and card metadata agrees with actual files", async () => {
  const source = await readFile(new URL("../src/data/projects.ts", import.meta.url), "utf8");
  const metadata = JSON.parse(
    await readFile(new URL("../src/data/image-metadata.json", import.meta.url), "utf8"),
  );
  for (const match of source.matchAll(/"(\/assets\/[^"\n]+)"/g))
    assert.ok(metadata[match[1]], `Missing ${match[1]}`);
  for (const match of source.matchAll(/image: "([^"]+)",\s*width: (\d+),\s*height: (\d+)/g))
    assert.deepEqual(metadata[match[1]], { width: Number(match[2]), height: Number(match[3]) });
});

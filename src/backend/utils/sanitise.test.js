/**
 * Tests for input sanitisation
 */

import { sanitiseNumber } from "./sanitise";

describe("sanitiseNumber", () => {
  test("parses clean number string", () => {
    expect(sanitiseNumber("42")).toBe(42);
  });

  test("strips non-numeric characters", () => {
    expect(sanitiseNumber("12abc")).toBe(12);
  });

  test("strips negative sign and parses remaining digits", () => {
    // regex strips the minus sign: -5 → "5" → 5
    expect(sanitiseNumber("-5", 0, 100)).toBe(5);
  });

  test("clamps above maximum to max", () => {
    expect(sanitiseNumber(200, 0, 100)).toBe(100);
  });

  test("returns 0 for non-numeric string", () => {
    expect(sanitiseNumber("abc")).toBe(0);
  });

  test("handles decimal input", () => {
    expect(sanitiseNumber("12.5")).toBeCloseTo(12.5);
  });
});

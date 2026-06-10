/**
 * Tests for formatting utilities
 */

import { formatCO2, annualToDaily, toEquivalency } from "./formatters";

describe("formatCO2", () => {
  test.each([
    [0, "0 kg CO₂e"],
    [999, "999 kg CO₂e"],
    [1000, "1.00 t CO₂e"],
    [2500, "2.50 t CO₂e"],
    [12345, "12.35 t CO₂e"],
  ])("formats %i correctly as %s", (input, expected) => {
    expect(formatCO2(input)).toBe(expected);
  });
});

describe("annualToDaily", () => {
  test("returns correct daily value", () => {
    expect(annualToDaily(3650)).toBeCloseTo(10, 2);
  });

  test("returns 0 for 0 annual", () => {
    expect(annualToDaily(0)).toBe(0);
  });
});

describe("toEquivalency", () => {
  test("returns a non-empty string for positive input", () => {
    expect(toEquivalency(1000).length).toBeGreaterThan(5);
  });

  test("contains a number and description word", () => {
    const result = toEquivalency(5000);
    expect(result).toMatch(/\d/);
    expect(result.length).toBeGreaterThan(3);
  });
});

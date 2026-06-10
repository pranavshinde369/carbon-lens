/**
 * Tests for carbonCalc utilities
 * Run: npm test
 */

import {
  calcEmission,
  aggregateEmissions,
  compareToBenchmarks,
  formatCO2,
  annualToDaily,
  toEquivalency,
  estimateFromQuiz,
  getPersonalisedTips,
} from "./carbonCalc";
import { ECO_TIPS } from "../data/constants";

// ─── calcEmission ─────────────────────────────────────────────────────────────

describe("calcEmission", () => {
  test("returns correct emission for known activity", () => {
    // car_petrol_medium = 0.192 kg/km
    const result = calcEmission("transport", "car_petrol_medium", 100);
    expect(result).toBeCloseTo(19.2, 1);
  });

  test("returns 0 for unknown category", () => {
    expect(calcEmission("unknown", "foo", 10)).toBe(0);
  });

  test("returns 0 for unknown activity key", () => {
    expect(calcEmission("transport", "hover_board", 10)).toBe(0);
  });

  test("returns 0 for zero quantity", () => {
    expect(calcEmission("food", "beef", 0)).toBe(0);
  });

  test("handles electricity correctly", () => {
    // India grid 0.716 kg/kWh × 100 kWh = 71.6
    const result = calcEmission("energy", "electricity", 100);
    expect(result).toBeCloseTo(71.6, 1);
  });
});

// ─── aggregateEmissions ───────────────────────────────────────────────────────

describe("aggregateEmissions", () => {
  const sampleLog = [
    { category: "transport", activityKey: "metro_rail", quantity: 500 },
    { category: "transport", activityKey: "car_petrol_small", quantity: 200 },
    { category: "food",      activityKey: "chicken",    quantity: 10  },
    { category: "energy",    activityKey: "electricity", quantity: 120 },
  ];

  test("returns correct total", () => {
    const { total } = aggregateEmissions(sampleLog);
    // metro: 0.028*500=14, car: 0.154*200=30.8, chicken: 6.9*10=69, elec: 0.716*120=85.92 → 199.72
    expect(total).toBeCloseTo(199.72, 0);
  });

  test("groups by category", () => {
    const { byCategory } = aggregateEmissions(sampleLog);
    expect(byCategory).toHaveProperty("transport");
    expect(byCategory).toHaveProperty("food");
    expect(byCategory).toHaveProperty("energy");
    expect(byCategory).not.toHaveProperty("shopping");
  });

  test("transport total equals sum of transport entries", () => {
    const { byCategory } = aggregateEmissions(sampleLog);
    expect(byCategory.transport).toBeCloseTo(14 + 30.8, 0);
  });

  test("handles empty log", () => {
    const { total, byCategory } = aggregateEmissions([]);
    expect(total).toBe(0);
    expect(byCategory).toEqual({});
  });
});

// ─── compareToBenchmarks ──────────────────────────────────────────────────────

describe("compareToBenchmarks", () => {
  test("marks excellent for low footprint", () => {
    const result = compareToBenchmarks(1500);
    expect(result.status).toBe("excellent");
  });

  test("marks warning for moderate footprint", () => {
    const result = compareToBenchmarks(3500);
    expect(result.status).toBe("warning");
  });

  test("marks danger for high footprint", () => {
    const result = compareToBenchmarks(7000);
    expect(result.status).toBe("danger");
  });

  test("calculates correct global comparison", () => {
    // 4900 / 4900 = 100%
    const result = compareToBenchmarks(4900);
    expect(result.vsGlobal).toBe(100);
  });

  test("gap to target is negative when under Paris target", () => {
    const result = compareToBenchmarks(1000);
    expect(result.gapToTarget).toBeLessThan(0);
  });
});

// ─── formatCO2 ───────────────────────────────────────────────────────────────

describe("formatCO2", () => {
  test("formats kg under 1000 as kg", () => {
    expect(formatCO2(500)).toContain("kg CO₂e");
  });

  test("formats values over 1000 as tonnes", () => {
    expect(formatCO2(2500)).toContain("t CO₂e");
    expect(formatCO2(2500)).toContain("2.50");
  });

  test("rounds to integers for kg display", () => {
    expect(formatCO2(123.7)).toBe("124 kg CO₂e");
  });
});

// ─── annualToDaily ────────────────────────────────────────────────────────────

describe("annualToDaily", () => {
  test("divides by 365", () => {
    expect(annualToDaily(3650)).toBeCloseTo(10, 1);
  });
});

// ─── toEquivalency ────────────────────────────────────────────────────────────

describe("toEquivalency", () => {
  test("returns non-empty string", () => {
    expect(toEquivalency(1000).length).toBeGreaterThan(0);
  });

  test("uses trees equivalency for large values", () => {
    expect(toEquivalency(2100)).toContain("trees");
  });
});

// ─── estimateFromQuiz ─────────────────────────────────────────────────────────

describe("estimateFromQuiz", () => {
  test("returns a positive number", () => {
    const result = estimateFromQuiz({
      commuteKm: 10,
      commuteMode: "metro_rail",
      monthlyUnits: 120,
      lpgCylinders: 1,
      dietType: "vegetarian",
      shoppingFreq: "average",
    });
    expect(result).toBeGreaterThan(0);
  });

  test("meat-heavy diet > vegan diet", () => {
    const baseAnswers = { commuteKm: 10, commuteMode: "bus", monthlyUnits: 100, lpgCylinders: 1 };
    const meatHeavy  = estimateFromQuiz({ ...baseAnswers, dietType: "meat_heavy",  shoppingFreq: "average" });
    const vegan      = estimateFromQuiz({ ...baseAnswers, dietType: "vegan",       shoppingFreq: "average" });
    expect(meatHeavy).toBeGreaterThan(vegan);
  });

  test("frequent shopper > minimal shopper", () => {
    const baseAnswers = { commuteKm: 5, commuteMode: "metro_rail", monthlyUnits: 80, lpgCylinders: 1, dietType: "mixed" };
    const frequent = estimateFromQuiz({ ...baseAnswers, shoppingFreq: "frequent" });
    const minimal  = estimateFromQuiz({ ...baseAnswers, shoppingFreq: "minimal"  });
    expect(frequent).toBeGreaterThan(minimal);
  });

  test("defaults gracefully with empty answers", () => {
    const result = estimateFromQuiz({});
    expect(result).toBeGreaterThan(0);
    expect(isNaN(result)).toBe(false);
  });
});

// ─── getPersonalisedTips ──────────────────────────────────────────────────────

describe("getPersonalisedTips", () => {
  const breakdown = {
    byCategory: { transport: 800, food: 300, energy: 200, shopping: 50 }
  };

  test("returns all tips", () => {
    const result = getPersonalisedTips(breakdown, ECO_TIPS);
    expect(result.length).toBe(ECO_TIPS.length);
  });

  test("transport tips come first when transport is highest", () => {
    const result = getPersonalisedTips(breakdown, ECO_TIPS);
    const firstCategory = result[0].category;
    expect(firstCategory).toBe("transport");
  });

  test("handles null breakdown gracefully", () => {
    const result = getPersonalisedTips(null, ECO_TIPS);
    expect(result.length).toBe(ECO_TIPS.length);
  });
});

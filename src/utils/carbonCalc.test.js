/**
 * Tests for carbonCalc utilities
 * Run: npm test
 */

import {
  calcEmission,
  aggregateEmissions,
  compareToBenchmarks,
  estimateFromQuiz,
  getPersonalisedTips,
} from "./carbonCalc";
import { ECO_TIPS } from "../data/constants";

// ─── calcEmission ─────────────────────────────────────────────────────────────

describe("calcEmission", () => {
  test("returns correct emission for known activity", () => {
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
    const result = calcEmission("energy", "electricity", 100);
    expect(result).toBeCloseTo(71.6, 1);
  });

  // Boundary condition tests
  test("handles very large quantities without overflow", () => {
    const result = calcEmission("transport", "car_petrol_medium", 1_000_000);
    expect(result).toBe(192000);
    expect(isFinite(result)).toBe(true);
  });

  test("handles floating point quantities correctly", () => {
    const result = calcEmission("food", "rice", 0.5);
    expect(result).toBeCloseTo(1.35, 2);
  });

  test("returns 0 for negative quantity", () => {
    expect(calcEmission("transport", "metro_rail", -10)).toBe(0);
  });

  test("returns 0 for NaN quantity", () => {
    expect(calcEmission("energy", "electricity", NaN)).toBe(0);
  });
});

// ─── aggregateEmissions ───────────────────────────────────────────────────────

describe("aggregateEmissions", () => {
  const sampleLog = [
    { category: "transport", activityKey: "metro_rail", quantity: 500 },
    { category: "transport", activityKey: "car_petrol_small", quantity: 200 },
    { category: "food", activityKey: "chicken", quantity: 10 },
    { category: "energy", activityKey: "electricity", quantity: 120 },
  ];

  test("returns correct total", () => {
    const { total } = aggregateEmissions(sampleLog);
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
    expect(compareToBenchmarks(1500).status).toBe("excellent");
  });

  test("marks warning for moderate footprint", () => {
    expect(compareToBenchmarks(3500).status).toBe("warning");
  });

  test("marks danger for high footprint", () => {
    expect(compareToBenchmarks(7000).status).toBe("danger");
  });

  test("calculates correct global comparison", () => {
    expect(compareToBenchmarks(4900).vsGlobal).toBe(100);
  });

  test("gap to target is negative when under Paris target", () => {
    expect(compareToBenchmarks(1000).gapToTarget).toBeLessThan(0);
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
    const base = { commuteKm: 10, commuteMode: "bus", monthlyUnits: 100, lpgCylinders: 1 };
    const meatHeavy = estimateFromQuiz({ ...base, dietType: "meat_heavy", shoppingFreq: "average" });
    const vegan = estimateFromQuiz({ ...base, dietType: "vegan", shoppingFreq: "average" });
    expect(meatHeavy).toBeGreaterThan(vegan);
  });

  test("frequent shopper > minimal shopper", () => {
    const base = { commuteKm: 5, commuteMode: "metro_rail", monthlyUnits: 80, lpgCylinders: 1, dietType: "mixed" };
    const frequent = estimateFromQuiz({ ...base, shoppingFreq: "frequent" });
    const minimal = estimateFromQuiz({ ...base, shoppingFreq: "minimal" });
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
    byCategory: { transport: 800, food: 300, energy: 200, shopping: 50 },
  };

  test("returns all tips", () => {
    const result = getPersonalisedTips(breakdown, ECO_TIPS);
    expect(result.length).toBe(ECO_TIPS.length);
  });

  test("transport tips come first when transport is highest", () => {
    const result = getPersonalisedTips(breakdown, ECO_TIPS);
    expect(result[0].category).toBe("transport");
  });

  test("handles null breakdown gracefully", () => {
    const result = getPersonalisedTips(null, ECO_TIPS);
    expect(result.length).toBe(ECO_TIPS.length);
  });

  test("never duplicates a tip in the result", () => {
    const result = getPersonalisedTips({ byCategory: { transport: 500 } }, ECO_TIPS);
    const ids = result.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every returned tip has required fields", () => {
    const result = getPersonalisedTips({ byCategory: {} }, ECO_TIPS);
    result.forEach((tip) => {
      expect(tip).toHaveProperty("id");
      expect(tip).toHaveProperty("title");
      expect(tip).toHaveProperty("impact");
      expect(tip).toHaveProperty("category");
    });
  });

  test("handles empty byCategory gracefully", () => {
    expect(() => getPersonalisedTips({ byCategory: {} }, ECO_TIPS)).not.toThrow();
  });

  test("handles tips array with one item", () => {
    const singleTip = [ECO_TIPS[0]];
    const result = getPersonalisedTips({ byCategory: { transport: 100 } }, singleTip);
    expect(result.length).toBe(1);
  });
});

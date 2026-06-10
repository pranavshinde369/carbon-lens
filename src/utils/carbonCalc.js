/**
 * Carbon Footprint Calculation Utilities
 * Pure functions — no side effects, fully testable
 *
 * @module carbonCalc
 */

import { 
  EMISSION_FACTORS, 
  BENCHMARKS,
  WORKING_DAYS_PER_YEAR,
  MONTHS_PER_YEAR,
  BASE_FOOD_MONTHLY_KG_CO2E,
  BASE_SHOPPING_MONTHLY_KG_CO2E,
  DEFAULT_COMMUTE_MONTHLY_KWH,
  DEFAULT_LPG_CYLINDERS
} from "../data/constants";

// Re-export formatters for backward compatibility
export { formatCO2, annualToDaily, toEquivalency } from "./formatters";

/**
 * Calculate emissions for a single activity entry.
 *
 * @param {string} category - Emission category (e.g. "transport")
 * @param {string} activityKey - Activity identifier (e.g. "car_petrol_medium")
 * @param {number} quantity - Amount in the activity's unit (km, kWh, kg, etc.)
 * @returns {number} CO₂e in kg, or 0 for invalid/negative input
 *
 * @example
 *   calcEmission('transport', 'car_petrol_medium', 100) // 19.2
 *   calcEmission('unknown', 'foo', 10)                   // 0
 */
export function calcEmission(category, activityKey, quantity) {
  if (!quantity || quantity < 0 || isNaN(quantity)) return 0;
  const cat = EMISSION_FACTORS[category];
  if (!cat) return 0;
  const activity = cat[activityKey];
  if (!activity) return 0;
  return parseFloat((activity.factor * quantity).toFixed(3));
}

/**
 * Aggregate emissions from an activity log array.
 *
 * @param {Array<{category: string, activityKey: string, quantity: number}>} log
 * @returns {{ total: number, byCategory: Object<string, number> }}
 *
 * @example
 *   aggregateEmissions([{ category: 'transport', activityKey: 'metro_rail', quantity: 500 }])
 *   // { total: 14, byCategory: { transport: 14 } }
 */
export function aggregateEmissions(log) {
  const byCategory = {};
  let total = 0;

  for (const entry of log) {
    const emission = calcEmission(entry.category, entry.activityKey, entry.quantity);
    byCategory[entry.category] = (byCategory[entry.category] || 0) + emission;
    total += emission;
  }

  return {
    total: parseFloat(total.toFixed(2)),
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([k, v]) => [k, parseFloat(v.toFixed(2))])
    ),
  };
}

/**
 * Compare personal footprint to global and India benchmarks.
 *
 * @param {number} annualKgCO2e - Annual footprint in kg CO₂e
 * @returns {{ vsGlobal: number, vsIndia: number, gapToTarget: number, status: string, parisTarget: number }}
 */
export function compareToBenchmarks(annualKgCO2e) {
  const vsGlobal = ((annualKgCO2e / BENCHMARKS.global_avg) * 100).toFixed(1);
  const vsIndia = ((annualKgCO2e / BENCHMARKS.india_urban_avg) * 100).toFixed(1);
  const gapToTarget = annualKgCO2e - BENCHMARKS.paris_target_2030;

  let status = "excellent";
  if (annualKgCO2e > BENCHMARKS.paris_target_2030 * 1.5) status = "warning";
  if (annualKgCO2e > BENCHMARKS.paris_target_2030 * 3) status = "danger";
  if (annualKgCO2e <= BENCHMARKS.paris_target_2030) status = "excellent";

  return {
    vsGlobal: parseFloat(vsGlobal),
    vsIndia: parseFloat(vsIndia),
    gapToTarget,
    status,
    parisTarget: BENCHMARKS.paris_target_2030,
  };
}

/**
 * Estimate annual footprint from a quick quiz.
 *
 * @param {Object} answers - Quiz responses
 * @param {string} [answers.commuteMode] - Transport mode key
 * @param {number} [answers.commuteKm] - One-way commute distance
 * @param {number} [answers.monthlyUnits] - Monthly electricity kWh
 * @param {number} [answers.lpgCylinders] - Monthly LPG cylinders
 * @param {string} [answers.dietType] - Diet classification
 * @param {string} [answers.shoppingFreq] - Shopping frequency
 * @returns {number} Estimated annual kg CO₂e
 */
export function estimateFromQuiz(answers) {
  let total = 0;

  // Transport
  const commuteKm = (answers.commuteKm || 0) * WORKING_DAYS_PER_YEAR;
  total += calcEmission("transport", answers.commuteMode || "bus", commuteKm);

  // Energy
  total += calcEmission("energy", "electricity", (answers.monthlyUnits || DEFAULT_COMMUTE_MONTHLY_KWH) * MONTHS_PER_YEAR);
  total += calcEmission("energy", "lpg", (answers.lpgCylinders || DEFAULT_LPG_CYLINDERS) * MONTHS_PER_YEAR);

  // Food
  const foodMultiplier = { vegan: 0.6, vegetarian: 0.8, mixed: 1.0, meat_heavy: 1.4 };
  total += BASE_FOOD_MONTHLY_KG_CO2E * MONTHS_PER_YEAR * (foodMultiplier[answers.dietType] || 1.0);

  // Shopping
  const shoppingMultiplier = { minimal: 0.6, average: 1.0, frequent: 1.5 };
  total += BASE_SHOPPING_MONTHLY_KG_CO2E * MONTHS_PER_YEAR * (shoppingMultiplier[answers.shoppingFreq] || 1.0);

  return Math.round(total);
}

/**
 * Generate personalised tips based on emission breakdown.
 * Tips are sorted so the highest-emission category's tips appear first.
 *
 * @param {{ byCategory: Object }} breakdown - Aggregated breakdown
 * @param {Array} allTips - Full tips array
 * @returns {Array} Sorted, relevant tips
 */
export function getPersonalisedTips(breakdown, allTips) {
  if (!breakdown?.byCategory) return allTips;

  const sortedCats = Object.entries(breakdown.byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  return [...allTips].sort((a, b) => {
    const rankA = sortedCats.indexOf(a.category);
    const rankB = sortedCats.indexOf(b.category);
    return rankA - rankB;
  });
}

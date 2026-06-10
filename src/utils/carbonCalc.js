/**
 * Carbon Footprint Calculation Utilities
 * Pure functions — no side effects, fully testable
 */

import { EMISSION_FACTORS, BENCHMARKS } from "../data/constants";

/**
 * Calculate emissions for a single activity entry
 * @param {string} category - e.g. "transport"
 * @param {string} activityKey - e.g. "car_petrol_medium"
 * @param {number} quantity - amount (km, kWh, kg, etc.)
 * @returns {number} CO₂e in kg
 */
export function calcEmission(category, activityKey, quantity) {
  const cat = EMISSION_FACTORS[category];
  if (!cat) return 0;
  const activity = cat[activityKey];
  if (!activity) return 0;
  return parseFloat((activity.factor * quantity).toFixed(3));
}

/**
 * Aggregate emissions from an activity log array
 * @param {Array<{category, activityKey, quantity}>} log
 * @returns {{ total: number, byCategory: Object }}
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
 * Compare personal footprint to benchmarks
 * @param {number} annualKgCO2e
 * @returns {{ label, percentileVsIndia, percentileVsGlobal, gap, status }}
 */
export function compareToBenchmarks(annualKgCO2e) {
  const vsGlobal = ((annualKgCO2e / BENCHMARKS.global_avg) * 100).toFixed(1);
  const vsIndia  = ((annualKgCO2e / BENCHMARKS.india_urban_avg) * 100).toFixed(1);
  const gapToTarget = annualKgCO2e - BENCHMARKS.paris_target_2030;

  let status = "excellent";
  if (annualKgCO2e > BENCHMARKS.paris_target_2030 * 1.5) status = "warning";
  if (annualKgCO2e > BENCHMARKS.paris_target_2030 * 3)   status = "danger";
  if (annualKgCO2e <= BENCHMARKS.paris_target_2030)       status = "excellent";

  return {
    vsGlobal: parseFloat(vsGlobal),
    vsIndia:  parseFloat(vsIndia),
    gapToTarget,
    status,
    parisTarget: BENCHMARKS.paris_target_2030,
  };
}

/**
 * Format kg CO₂e for display
 * @param {number} kg
 * @returns {string}
 */
export function formatCO2(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t CO₂e`;
  }
  return `${Math.round(kg)} kg CO₂e`;
}

/**
 * Calculate daily equivalent from annual kg
 */
export function annualToDaily(annualKg) {
  return parseFloat((annualKg / 365).toFixed(2));
}

/**
 * Equivalencies for intuitive context
 * @param {number} kg CO₂e
 * @returns {string} human-readable equivalency
 */
export function toEquivalency(kg) {
  const EQUIVALENCIES = [
    { threshold: 1000, factor: 1 / 0.21,    label: "trees planted for a year" },
    { threshold: 100,  factor: 1 / 2.31,    label: "km in a petrol car" },
    { threshold: 10,   factor: 1 / 0.255,   label: "km of domestic flight" },
    { threshold: 0,    factor: 1 / 0.00011, label: "smartphone charges" },
  ];

  for (const eq of EQUIVALENCIES) {
    if (kg >= eq.threshold) {
      return `≈ ${Math.round(kg * eq.factor).toLocaleString("en-IN")} ${eq.label}`;
    }
  }
  return "";
}

/**
 * Estimate annual footprint from a quick quiz
 * @param {Object} answers - quiz responses
 * @returns {number} estimated annual kg CO₂e
 */
export function estimateFromQuiz(answers) {
  let total = 0;

  // Transport
  const commuteKm = (answers.commuteKm || 0) * 260; // ~260 working days
  total += calcEmission("transport", answers.commuteMode || "bus", commuteKm);

  // Energy
  total += calcEmission("energy", "electricity", (answers.monthlyUnits || 100) * 12);
  total += calcEmission("energy", "lpg", (answers.lpgCylinders || 1) * 12);

  // Food
  const foodMultiplier = {
    vegan:        0.6,
    vegetarian:   0.8,
    mixed:        1.0,
    meat_heavy:   1.4,
  };
  const baseFoodMonthly = 180; // kg CO₂e average
  total += baseFoodMonthly * 12 * (foodMultiplier[answers.dietType] || 1.0);

  // Shopping
  const shoppingMultiplier = {
    minimal:   0.6,
    average:   1.0,
    frequent:  1.5,
  };
  total += 140 * 12 * (shoppingMultiplier[answers.shoppingFreq] || 1.0);

  return Math.round(total);
}

/**
 * Generate personalised tips based on emission breakdown
 * @param {{ byCategory: Object }} breakdown
 * @param {Array} allTips
 * @returns {Array} sorted, relevant tips
 */
export function getPersonalisedTips(breakdown, allTips) {
  if (!breakdown?.byCategory) return allTips;

  const sortedCats = Object.entries(breakdown.byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  // Prioritise tips by highest-emission category first
  return [...allTips].sort((a, b) => {
    const rankA = sortedCats.indexOf(a.category);
    const rankB = sortedCats.indexOf(b.category);
    return rankA - rankB;
  });
}

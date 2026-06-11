/**
 * Formatting Utilities for Carbon Footprint Display
 * Pure presentation functions — no side effects
 *
 * @module formatters
 */

/**
 * Format a CO₂e value for display.
 * Values ≥ 1000 kg are shown in tonnes; below in kg.
 *
 * @param {number} kg - Carbon emission value in kilograms CO₂e
 * @returns {string} Human-readable formatted string (e.g. "124 kg CO₂e" or "2.50 t CO₂e")
 * @example
 *   formatCO2(500)   // "500 kg CO₂e"
 *   formatCO2(2500)  // "2.50 t CO₂e"
 */
export function formatCO2(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t CO₂e`;
  }
  return `${Math.round(kg)} kg CO₂e`;
}

/**
 * Convert annual kg CO₂e to a daily average.
 *
 * @param {number} annualKg - Annual carbon emissions in kg CO₂e
 * @returns {number} Daily average rounded to 2 decimal places
 * @example
 *   annualToDaily(3650) // 10.0
 */
export function annualToDaily(annualKg) {
  return parseFloat((annualKg / 365).toFixed(2));
}

/**
 * Provide intuitive equivalencies for a CO₂e amount.
 * Converts abstract kg values into relatable comparisons.
 *
 * @param {number} kg - Carbon emission value in kilograms CO₂e
 * @returns {string} Human-readable equivalency (e.g. "≈ 4,762 trees planted for a year")
 * @example
 *   toEquivalency(1000) // "≈ 4,762 trees planted for a year"
 *   toEquivalency(50)   // "≈ 196 km of domestic flight"
 */
export function toEquivalency(kg) {
  /** Ordered by threshold — first match wins */
  const EQUIVALENCIES = [
    { threshold: 1000, factor: 1 / 0.21, label: "trees planted for a year" },
    { threshold: 100, factor: 1 / 2.31, label: "km in a petrol car" },
    { threshold: 10, factor: 1 / 0.255, label: "km of domestic flight" },
    { threshold: 0, factor: 1 / 0.00011, label: "smartphone charges" },
  ];

  for (const eq of EQUIVALENCIES) {
    if (kg >= eq.threshold) {
      return `≈ ${Math.round(kg * eq.factor).toLocaleString("en-IN")} ${eq.label}`;
    }
  }
  return "";
}

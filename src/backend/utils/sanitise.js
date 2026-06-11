/**
 * Input Sanitisation Utilities
 *
 * Provides functions for sanitising user input before processing.
 * Prevents injection of invalid data into calculation pipelines.
 *
 * @module sanitise
 */

/**
 * Sanitise a numeric input value.
 * Strips non-numeric characters (except decimal point), clamps to range,
 * and returns 0 for non-parseable input.
 *
 * @param {string|number} value - Raw input value
 * @param {number} [min=0] - Minimum allowed value
 * @param {number} [max=99999] - Maximum allowed value
 * @returns {number} Sanitised, clamped number
 * @example
 *   sanitiseNumber('12abc')     // 12
 *   sanitiseNumber(-5, 0, 100)  // 0
 *   sanitiseNumber(200, 0, 100) // 100
 *   sanitiseNumber('abc')       // 0
 */
export function sanitiseNumber(value, min = 0, max = 99999) {
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return 0;
  return Math.min(Math.max(num, min), max);
}

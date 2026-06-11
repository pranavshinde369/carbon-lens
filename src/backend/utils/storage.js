/**
 * Safe localStorage Wrapper
 *
 * Provides prefixed, size-guarded, error-tolerant access to localStorage.
 * All keys are automatically prefixed with {@link STORAGE_PREFIX} to avoid
 * collisions with other apps on the same origin.
 *
 * @module storage
 */

/** @constant {string} Prefix for all CarbonLens storage keys */
const STORAGE_PREFIX = "cfp_v1_";

/** @constant {number} Maximum serialised value size in bytes (50 KB) */
const MAX_STORAGE_SIZE = 50 * 1024;

/**
 * Read a value from localStorage.
 *
 * @param {string} key - Storage key (without prefix)
 * @param {*} fallback - Value returned when key is missing or JSON is corrupt
 * @returns {*} Parsed value or fallback
 * @example
 *   loadState('activity_log', [])
 */
export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error(`[CarbonLens] Storage read error for key "${key}":`, err);
    return fallback;
  }
}

/**
 * Write a value to localStorage.
 *
 * @param {string} key - Storage key (without prefix)
 * @param {*} value - JSON-serialisable value to store
 * @returns {boolean} true on success, false if value too large or write fails
 * @throws {void} Never throws — errors are caught and logged
 * @example
 *   saveState('activity_log', [{ ... }])
 */
export function saveState(key, value) {
  try {
    const serialised = JSON.stringify(value);
    if (serialised.length > MAX_STORAGE_SIZE) {
      console.warn(
        `[CarbonLens] Storage write skipped: value too large for key "${key}"`
      );
      return false;
    }
    localStorage.setItem(STORAGE_PREFIX + key, serialised);
    return true;
  } catch (err) {
    // QuotaExceededError or SecurityError — fail silently
    console.error(`[CarbonLens] Storage write error for key "${key}":`, err);
    return false;
  }
}

/**
 * Remove a key from localStorage.
 *
 * @param {string} key - Storage key (without prefix)
 * @returns {boolean} true on success, false on error
 */
export function clearState(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

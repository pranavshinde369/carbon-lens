/**
 * useDebounce Hook
 *
 * Debounces a value by delaying updates until after a specified
 * period of inactivity. Useful for preventing excessive recalculations
 * on fast user input (e.g. typing in a quantity field).
 *
 * @module useDebounce
 */

import { useState, useEffect } from "react";

/**
 * @param {*} value - Value to debounce
 * @param {number} [wait=300] - Delay in milliseconds
 * @returns {*} Debounced value
 *
 * @example
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 250);
 *   // debouncedQuery updates 250ms after last setQuery call
 */
export function useDebounce(value, wait = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), wait);
    return () => clearTimeout(timer);
  }, [value, wait]);

  return debounced;
}

/**
 * useReducedMotion Hook
 *
 * Reads the user's `prefers-reduced-motion` OS preference.
 * Returns true when the user has requested reduced motion,
 * allowing components to disable animations accordingly.
 *
 * @module useReducedMotion
 */

import { useState, useEffect } from "react";

/**
 * @returns {boolean} true if user prefers reduced motion
 *
 * @example
 *   const prefersReducedMotion = useReducedMotion();
 *   <AreaChart isAnimationActive={!prefersReducedMotion} />
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

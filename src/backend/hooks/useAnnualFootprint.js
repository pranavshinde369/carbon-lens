/**
 * @hook useAnnualFootprint
 * @description Derives the estimated annual carbon footprint.
 *              Uses actual logged data when ≥3 entries exist (annualised);
 *              falls back to quiz estimate; falls back to India urban average.
 *
 * @param {Array}       log           - Activity log entries
 * @param {number|null} quizEstimate  - Estimate from onboarding quiz (kg/year)
 * @returns {number} Estimated annual footprint in kg CO₂e
 *
 * @example
 * const annualKg = useAnnualFootprint(log, 2800);
 */
import { useMemo } from 'react';
import { aggregateEmissions } from '../utils/carbonCalc';
import { BENCHMARKS, MIN_LOG_ENTRIES_FOR_ESTIMATE, MONTHS_PER_YEAR } from '../data/constants';

export function useAnnualFootprint(log, quizEstimate) {
  return useMemo(() => {
    if (log.length >= MIN_LOG_ENTRIES_FOR_ESTIMATE) {
      return aggregateEmissions(log).total * MONTHS_PER_YEAR;
    }
    return quizEstimate ?? BENCHMARKS.india_urban_avg;
  }, [log, quizEstimate]);
}

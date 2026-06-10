/**
 * SummaryCards — Dashboard summary statistics
 *
 * Displays four key metric cards: annual footprint, daily average,
 * India comparison, and Paris target gap.
 *
 * @component
 * @param {Object} props
 * @param {number} props.annualKg - Annual carbon footprint in kg CO₂e
 * @param {Object} props.breakdown - Aggregated emission breakdown
 * @returns {React.ReactElement}
 *
 * @example
 *   <SummaryCards annualKg={2800} breakdown={breakdown} />
 */

import React from "react";
import PropTypes from "prop-types";
import { BENCHMARKS } from "../../data/constants";
import { compareToBenchmarks } from "../../utils/carbonCalc";
import { formatCO2, annualToDaily, toEquivalency } from "../../utils/formatters";

function SummaryCards({ annualKg, breakdown }) {
  const bench = compareToBenchmarks(annualKg);
  const daily = annualToDaily(annualKg);

  const cards = [
    {
      label: "Your Annual Footprint",
      value: formatCO2(annualKg),
      sub: toEquivalency(annualKg),
      color: "var(--clr-green)",
    },
    {
      label: "Daily Average",
      value: formatCO2(daily),
      sub: "per day",
      color: "var(--clr-blue)",
    },
    {
      label: "vs. India Urban Avg",
      value: `${bench.vsIndia}%`,
      sub: `avg ${formatCO2(BENCHMARKS.india_urban_avg)}/yr`,
      color: "var(--clr-amber)",
    },
    {
      label: "Paris Target Gap",
      value:
        bench.gapToTarget > 0
          ? `+${formatCO2(bench.gapToTarget)}`
          : "✓ Below target",
      sub: "2°C pathway = 2t/yr",
      color: bench.gapToTarget > 0 ? "var(--clr-danger)" : "var(--clr-success)",
    },
  ];

  return (
    <div className="summary-cards" role="region" aria-label="Carbon footprint summary">
      {cards.map((c) => (
        <div className="summary-card" key={c.label}>
          <p className="card-label">{c.label}</p>
          <p className="card-value" style={{ color: c.color }}>
            {c.value}
          </p>
          <p className="card-sub">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

SummaryCards.displayName = "SummaryCards";

SummaryCards.propTypes = {
  /** Annual carbon footprint in kg CO₂e */
  annualKg: PropTypes.number.isRequired,
  /** Aggregated emission breakdown object from aggregateEmissions() */
  breakdown: PropTypes.shape({
    total: PropTypes.number,
    byCategory: PropTypes.object,
  }).isRequired,
};

export default React.memo(SummaryCards, (prev, next) =>
  prev.annualKg === next.annualKg && prev.breakdown === next.breakdown
);

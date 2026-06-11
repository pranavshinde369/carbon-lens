/**
 * @component SummaryCards
 * @description Displays top-level key performance indicators (KPIs)
 *              such as total footprint, daily average, equivalency,
 *              and top emission category.
 *
 * @param {Object} props
 * @param {number} props.annualKg  - Estimated annual footprint in kg
 * @param {Object} props.breakdown - Breakdown of current logged emissions
 * @returns {JSX.Element}
 *
 * @example
 * <SummaryCards annualKg={2800} breakdown={{ total: 50, byCategory: { transport: 50 } }} />
 */

import React from "react";
import PropTypes from "prop-types";
import "./SummaryCards.css";
import { BENCHMARKS } from '../../../backend/data/constants';
import { compareToBenchmarks } from '../../../backend/utils';
import { formatCO2, annualToDaily, toEquivalency } from '../../../backend/utils';

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
  annualKg:  PropTypes.number.isRequired,
  breakdown: PropTypes.shape({
    total:      PropTypes.number,
    byCategory: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
};

export default React.memo(SummaryCards, (prev, next) =>
  prev.annualKg === next.annualKg && prev.breakdown === next.breakdown
);

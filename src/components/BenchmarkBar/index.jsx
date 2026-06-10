/**
 * @component BenchmarkBar
 * @description Visual benchmark comparison against India avg, Global avg, and Paris target.
 *              Renders a responsive scale with marked milestones.
 *
 * @param {Object} props
 * @param {number} props.annualKg - User's annual footprint in kg CO₂e
 * @returns {JSX.Element}
 *
 * @example
 * <BenchmarkBar annualKg={2800} />
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { BENCHMARKS, BENCHMARK_SCALE_MAX_KG } from "../../data/constants";
import { formatCO2 } from "../../utils/formatters";
import "./BenchmarkBar.css";

function BenchmarkBar({ annualKg }) {
  const marks = useMemo(
    () => [
      { label: "You", val: annualKg, color: "#2563eb" },
      { label: "India avg", val: BENCHMARKS.india_urban_avg, color: "#d97706" },
      { label: "Paris 2°C", val: BENCHMARKS.paris_target_2030, color: "#16a34a" },
      { label: "Global avg", val: BENCHMARKS.global_avg, color: "#7c3aed" },
    ],
    [annualKg]
  );

  return (
    <div className="benchmark-bar-wrap" aria-label="Carbon footprint benchmark comparison">
      <div className="bm-track" role="img" aria-label={`Your ${formatCO2(annualKg)} vs benchmarks`}>
        {marks.map((m) => (
          <React.Fragment key={m.label}>
            <div
              className="bm-marker"
              style={{ left: `${(m.val / BENCHMARK_SCALE_MAX_KG) * 100}%`, background: m.color }}
              role="img"
              aria-label={`${m.label}: ${formatCO2(m.val)}`}
              title={`${m.label}: ${formatCO2(m.val)}`}
            />
            <span
              className="bm-label"
              style={{ left: `${(m.val / BENCHMARK_SCALE_MAX_KG) * 100}%`, color: m.color }}
              aria-hidden="true"
            >
              {m.label}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="bm-axis">
        <span>0</span><span>4t</span><span>8t</span><span>12t</span><span>16t</span>
      </div>
    </div>
  );
}

BenchmarkBar.displayName = "BenchmarkBar";
BenchmarkBar.propTypes = { annualKg: PropTypes.number.isRequired };
export default React.memo(BenchmarkBar);

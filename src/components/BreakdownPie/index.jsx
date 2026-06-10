/**
 * @component BreakdownPie
 * @description Renders a donut/pie chart showing the percentage breakdown
 *              of carbon emissions by category. Includes descriptive aria-label
 *              with percentage data for screen readers.
 *
 * @param {Object} props
 * @param {Object} props.byCategory - { transport, energy, food, shopping } emission totals
 * @param {boolean} props.reducedMotion - Whether to disable chart animations
 * @returns {JSX.Element}
 *
 * @example
 * <BreakdownPie byCategory={{ transport: 29, energy: 26, food: 31, shopping: 14 }} />
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORIES } from "../../data/constants";
import "./BreakdownPie.css";

/** @constant Chart colour mapping by category ID */
const CHART_COLORS = {
  transport: "#2563eb",
  energy: "#16a34a",
  food: "#d97706",
  shopping: "#7c3aed",
};

function BreakdownPie({ byCategory, reducedMotion }) {
  /** Memoise pie data transformation and filtering */
  const { data, total } = useMemo(() => {
    const pieData = CATEGORIES.map((c) => ({
      name: c.label,
      value: byCategory[c.id] || 0,
      color: CHART_COLORS[c.id],
      icon: c.icon,
    })).filter((d) => d.value > 0);

    const pieTotal = pieData.reduce((s, d) => s + d.value, 0);
    return { data: pieData, total: pieTotal };
  }, [byCategory]);

  if (!data.length) {
    return <p className="empty-state">Log some activities to see your breakdown.</p>;
  }

  /** Build descriptive label for screen readers */
  const ariaDescription = data
    .map((d) => `${d.name} ${Math.round((d.value / total) * 100)}%`)
    .join(", ");

  return (
    <div
      className="pie-container"
      role="img"
      aria-label={`Pie chart: ${ariaDescription}`}
    >
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            isAnimationActive={!reducedMotion}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`${Math.round(v)} kg CO₂e`, ""]} />
        </PieChart>
      </ResponsiveContainer>

      <div className="pie-legend" role="list">
        {data.map((d) => (
          <div key={d.name} className="legend-row" role="listitem">
            <span className="legend-dot" style={{ background: d.color }} aria-hidden="true" />
            <span className="legend-name">
              {d.icon} {d.name}
            </span>
            <span className="legend-val">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

BreakdownPie.displayName = "BreakdownPie";

BreakdownPie.propTypes = {
  /** Category emission totals: { transport, energy, food, shopping } */
  byCategory: PropTypes.object.isRequired,
  /** Whether to disable chart animations for reduced motion preference */
  reducedMotion: PropTypes.bool,
};

BreakdownPie.defaultProps = {
  reducedMotion: false,
};

export default React.memo(BreakdownPie);

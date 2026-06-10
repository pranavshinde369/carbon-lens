/**
 * @component TrendChart
 * @description Renders a stacked area chart using Recharts showing monthly
 *              emissions across transport, energy, food, and shopping categories.
 *              Includes a hidden data table for screen reader accessibility.
 *
 * @param {Object} props
 * @param {Array<Object>} props.data - Monthly data array with month, transport, energy, food, shopping
 * @param {boolean} props.reducedMotion - Whether to disable chart animations
 * @returns {JSX.Element}
 *
 * @example
 * <TrendChart data={DEMO_MONTHLY_DATA} reducedMotion={false} />
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { CATEGORIES } from "../../data/constants";
import "./TrendChart.css";

/** @constant Chart colour mapping by category ID */
const CHART_COLORS = {
  transport: "#2563eb",
  energy: "#16a34a",
  food: "#d97706",
  shopping: "#7c3aed",
};

function TrendChart({ data, reducedMotion }) {
  /** Memoise chart data transformation */
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        total: d.transport + d.energy + d.food + d.shopping,
      })),
    [data]
  );

  const avg = useMemo(() => {
    if (!data.length) return { transport: 0, energy: 0, food: 0, shopping: 0 };
    const sums = data.reduce((acc, curr) => ({
      transport: acc.transport + curr.transport,
      energy: acc.energy + curr.energy,
      food: acc.food + curr.food,
      shopping: acc.shopping + curr.shopping,
    }), { transport: 0, energy: 0, food: 0, shopping: 0 });
    const len = data.length;
    return {
      transport: sums.transport / len,
      energy: sums.energy / len,
      food: sums.food / len,
      shopping: sums.shopping / len,
    };
  }, [data]);

  return (
    <>
      <div
        className="chart-wrapper"
        role="img"
        aria-label={`Area chart showing monthly carbon footprint. 
          Transport averages ${Math.round(avg.transport)} kg/month, 
          Energy ${Math.round(avg.energy)} kg/month,
          Food ${Math.round(avg.food)} kg/month,
          Shopping ${Math.round(avg.shopping)} kg/month.`}
      >
        <ResponsiveContainer width="100%" height={260} role="img" aria-label="Area chart showing monthly carbon footprint trend">
          <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              {CATEGORIES.map((c) => (
                <linearGradient key={c.id} id={`grad-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[c.id]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[c.id]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit=" kg" width={60} />
            <Tooltip formatter={(v, n) => [`${Math.round(v)} kg CO₂e`, n]} />
            <Legend />
            {CATEGORIES.map((c) => (
              <Area
                key={c.id}
                type="monotone"
                dataKey={c.id}
                name={c.label}
                stroke={CHART_COLORS[c.id]}
                fill={`url(#grad-${c.id})`}
                strokeWidth={2}
                dot={false}
                isAnimationActive={!reducedMotion}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hidden data table for screen readers */}
      <div className="sr-only" aria-label="Monthly trend data table">
        <table>
          <caption>Monthly carbon emissions by category (kg CO₂e)</caption>
          <thead>
            <tr>
              <th>Month</th>
              <th>Transport</th>
              <th>Energy</th>
              <th>Food</th>
              <th>Shopping</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>{row.transport}</td>
                <td>{row.energy}</td>
                <td>{row.food}</td>
                <td>{row.shopping}</td>
                <td>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

TrendChart.displayName = "TrendChart";

TrendChart.propTypes = {
  /** Monthly data array with month, transport, energy, food, shopping keys */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      transport: PropTypes.number.isRequired,
      energy: PropTypes.number.isRequired,
      food: PropTypes.number.isRequired,
      shopping: PropTypes.number.isRequired,
    })
  ).isRequired,
  /** Whether to disable chart animations for reduced motion preference */
  reducedMotion: PropTypes.bool,
};

TrendChart.defaultProps = {
  reducedMotion: false,
};

export default React.memo(TrendChart);

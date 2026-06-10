/**
 * TipsPanel — Personalised eco tips with category filters
 *
 * @component
 * @param {Object} props
 * @param {Object} props.breakdown - Emission breakdown from aggregateEmissions()
 * @param {Array<string>} props.completedTips - IDs of completed tips
 * @param {Function} props.onCompleteTip - Callback receiving tip id
 * @returns {React.ReactElement}
 */

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { CATEGORIES } from "../../data/constants";
import { getPersonalisedTips } from "../../utils/carbonCalc";
import { ECO_TIPS } from "../../data/constants";

function TipsPanel({ breakdown, completedTips, onCompleteTip }) {
  const [filter, setFilter] = useState("all");
  const sorted = useMemo(() => getPersonalisedTips(breakdown, ECO_TIPS), [breakdown]);
  const filtered = filter === "all" ? sorted : sorted.filter((t) => t.category === filter);

  return (
    <section className="tips-panel" aria-labelledby="tips-heading">
      <div className="section-header">
        <h2 id="tips-heading">Personalised Tips</h2>
        <div className="filter-pills" role="group" aria-label="Filter tips by category">
          {["all", ...CATEGORIES.map((c) => c.id)].map((f) => (
            <button
              key={f}
              className={`pill ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f === "all" ? "All" : CATEGORIES.find((c) => c.id === f)?.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="tips-list" aria-label="Eco tips">
        {filtered.map((tip) => {
          const done = completedTips.includes(tip.id);
          return (
            <li key={tip.id} className={`tip-card ${done ? "tip-done" : ""}`}>
              <div className="tip-header">
                <span className="tip-tag">{tip.tag}</span>
                <span className="tip-impact">Saves ~{tip.impact} kg CO₂e/yr</span>
              </div>
              <h3 className="tip-title">{tip.title}</h3>
              <p className="tip-desc">{tip.description}</p>
              <div className="tip-footer">
                <span className={`difficulty diff-${tip.difficulty}`}>{tip.difficulty}</span>
                <button
                  className={`btn ${done ? "btn-done" : "btn-outline"}`}
                  onClick={() => !done && onCompleteTip(tip.id)}
                  aria-label={done ? `${tip.title} marked complete` : `Mark "${tip.title}" as started`}
                  disabled={done}
                >
                  {done ? "✓ Committed" : "I'll try this"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

TipsPanel.displayName = "TipsPanel";
TipsPanel.propTypes = {
  breakdown: PropTypes.shape({ byCategory: PropTypes.object }).isRequired,
  completedTips: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCompleteTip: PropTypes.func.isRequired,
};
export default React.memo(TipsPanel);

/**
 * QuickWins — Dashboard quick tips section
 *
 * Shows the top 3 easy-difficulty personalised tips as quick action cards.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.tips - Sorted tips from getPersonalisedTips()
 * @param {Function} props.onViewMore - Callback to switch to tips tab
 * @returns {React.ReactElement}
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";

/** @constant {number} Maximum quick win cards to display */
const MAX_QUICK_WINS = 3;

function QuickWins({ tips, onViewMore }) {
  const easyTips = useMemo(
    () => tips.filter((t) => t.difficulty === "easy").slice(0, MAX_QUICK_WINS),
    [tips]
  );

  return (
    <section className="section-block quick-wins" aria-labelledby="quick-heading">
      <h2 id="quick-heading">Quick Wins for You</h2>
      <div className="quick-grid">
        {easyTips.map((tip) => (
          <div key={tip.id} className="quick-card">
            <span className="quick-tag">{tip.tag}</span>
            <p className="quick-title">{tip.title}</p>
            <p className="quick-savings">Saves ~{tip.impact} kg/yr</p>
            <button
              className="btn btn-outline"
              onClick={onViewMore}
              aria-label={`View tip: ${tip.title}`}
            >
              Learn more
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

QuickWins.displayName = "QuickWins";
QuickWins.propTypes = {
  tips: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    impact: PropTypes.number.isRequired,
    difficulty: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
  })).isRequired,
  onViewMore: PropTypes.func.isRequired,
};
export default React.memo(QuickWins);

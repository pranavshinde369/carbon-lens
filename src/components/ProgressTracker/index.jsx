/**
 * @component ProgressTracker
 * @description Tracks user's committed carbon reductions over time.
 *              Calculates total potential savings from committed tips
 *              and joined challenges. Shows progress toward Paris target.
 *
 * @param {Object}   props
 * @param {number}   props.annualKg       - Current estimated annual footprint
 * @param {string[]} props.completedTips  - IDs of tips user committed to
 * @param {string[]} props.joinedChallenges - IDs of challenges user joined
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ECO_TIPS, CHALLENGES, BENCHMARKS } from '../../data/constants';
import './ProgressTracker.css';

export default function ProgressTracker({ annualKg, completedTips, joinedChallenges }) {
  const tipsSavings = useMemo(() =>
    ECO_TIPS
      .filter(t => completedTips.includes(t.id))
      .reduce((sum, t) => sum + t.impact, 0),
    [completedTips]
  );

  const challengeSavings = useMemo(() =>
    CHALLENGES
      .filter(c => joinedChallenges.includes(c.id))
      .reduce((sum, c) => sum + c.savingsEstimate, 0),
    [joinedChallenges]
  );

  const totalPotentialSaving = tipsSavings + challengeSavings;
  const projectedFootprint   = Math.max(0, annualKg - totalPotentialSaving);
  const parisTarget          = BENCHMARKS.paris_target_2030;
  const progressPct          = Math.min(100, Math.round(
    ((annualKg - projectedFootprint) / Math.max(1, annualKg - parisTarget)) * 100
  ));

  return (
    <section className="section-block progress-tracker" aria-labelledby="progress-heading">
      <h2 id="progress-heading">My Reduction Journey</h2>
      <div className="progress-stats">
        <div className="p-stat">
          <span className="p-val">{totalPotentialSaving.toLocaleString('en-IN')}</span>
          <span className="p-label">kg CO₂e/yr potential savings</span>
        </div>
        <div className="p-stat">
          <span className="p-val" style={{ color: 'var(--clr-green)' }}>
            {projectedFootprint < parisTarget ? '✓ On Track' : `${Math.round(projectedFootprint / 1000 * 10) / 10}t`}
          </span>
          <span className="p-label">projected footprint</span>
        </div>
        <div className="p-stat">
          <span className="p-val">{completedTips.length + joinedChallenges.length}</span>
          <span className="p-label">actions committed</span>
        </div>
      </div>
      <div className="progress-bar-wrap" aria-label={`${progressPct}% progress toward Paris climate target`}>
        <div className="progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="progress-labels">
          <span>Current: {Math.round(annualKg / 1000 * 10) / 10}t</span>
          <span>Paris target: {parisTarget / 1000}t</span>
        </div>
      </div>
      {completedTips.length === 0 && joinedChallenges.length === 0 && (
        <p className="empty-state" aria-live="polite">
          Commit to tips and join challenges to track your progress here.
        </p>
      )}
    </section>
  );
}

ProgressTracker.displayName = 'ProgressTracker';
ProgressTracker.propTypes = {
  annualKg:          PropTypes.number.isRequired,
  completedTips:     PropTypes.arrayOf(PropTypes.string).isRequired,
  joinedChallenges:  PropTypes.arrayOf(PropTypes.string).isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import SummaryCards from '../SummaryCards';
import TrendChart from '../TrendChart';
import BreakdownPie from '../BreakdownPie';
import BenchmarkBar from '../BenchmarkBar';
import InsightsPanel from '../InsightsPanel';
import ProgressTracker from '../ProgressTracker';
import { DEMO_MONTHLY_DATA } from '../../data/constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Generates a shareable text summary of the user's climate action
 * @param {number}   annualKg       - Annual footprint
 * @param {string[]} completedTips  - Committed tips
 * @param {string[]} joinedChallenges - Joined challenges
 * @returns {string} Formatted share text
 */
function buildShareText(annualKg, completedTips, joinedChallenges) {
  const tonnes = (annualKg / 1000).toFixed(2);
  const actions = completedTips.length + joinedChallenges.length;
  return `🌿 My CarbonLens Climate Report\n\n` +
    `📊 Annual footprint: ${tonnes} t CO₂e\n` +
    `✅ Actions committed: ${actions}\n` +
    `🌍 India avg: 2.2t | Paris target: 2t\n\n` +
    `Track yours free → carbonlens.web.app #ClimateAction #India`;
}

function Dashboard({ annualKg, log, breakdown, completedTips, joinedChallenges }) {
  const prefersReducedMotion = useReducedMotion();
  const displayBreakdown = breakdown?.byCategory?.transport != null
    ? breakdown
    : { total: 2800, byCategory: { transport: 29, energy: 26, food: 31, shopping: 14 } };

  const handleShare = React.useCallback(async () => {
    const text = buildShareText(annualKg, completedTips, joinedChallenges);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Carbon Footprint', text });
      } catch (err) {
        if (err.name !== 'AbortError') await navigator.clipboard.writeText(text);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Report copied to clipboard!");
    }
  }, [annualKg, completedTips, joinedChallenges]);

  return (
    <div role="tabpanel" id="panel-dashboard" aria-labelledby="tab-dashboard" className="tab-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={handleShare} aria-label="Share my carbon footprint progress">
          📤 Share My Progress
        </button>
      </div>

      <SummaryCards annualKg={annualKg} breakdown={displayBreakdown} />
      
      <ProgressTracker 
        annualKg={annualKg} 
        completedTips={completedTips} 
        joinedChallenges={joinedChallenges} 
      />

      <InsightsPanel 
        annualKg={annualKg} 
        breakdown={displayBreakdown} 
      />

      <section className="section-block" aria-labelledby="trend-heading">
        <h2 id="trend-heading" tabIndex="-1">Monthly Trend</h2>
        <TrendChart data={DEMO_MONTHLY_DATA} reducedMotion={prefersReducedMotion} />
      </section>

      <div className="two-col">
        <section className="section-block" aria-labelledby="breakdown-heading">
          <h2 id="breakdown-heading">Category Breakdown</h2>
          <BreakdownPie byCategory={displayBreakdown.byCategory} reducedMotion={prefersReducedMotion} />
        </section>

        <section className="section-block" aria-labelledby="benchmark-heading">
          <h2 id="benchmark-heading">How You Compare</h2>
          <BenchmarkBar annualKg={annualKg} />
        </section>
      </div>
    </div>
  );
}

Dashboard.displayName = 'Dashboard';
Dashboard.propTypes = {
  annualKg: PropTypes.number.isRequired,
  log: PropTypes.array.isRequired,
  breakdown: PropTypes.object,
  completedTips: PropTypes.arrayOf(PropTypes.string).isRequired,
  joinedChallenges: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default React.memo(Dashboard);

/**
 * @component InsightsPanel
 * @description AI-generated personalised carbon reduction insights.
 *              Uses Gemini 1.5 Flash to analyse the user's footprint breakdown
 *              and generate 3 specific, actionable reduction strategies.
 *
 * @param {Object} props
 * @param {number} props.annualKg  - User's estimated annual footprint
 * @param {Object} props.breakdown - Category breakdown object
 */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './InsightsPanel.css';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Generates a prompt for Gemini based on the user's actual footprint data
 * @param {number} annualKg - Annual kg CO₂e
 * @param {Object} byCategory - Emissions per category
 * @returns {string} Structured prompt string
 */
function buildPrompt(annualKg, byCategory) {
  const sorted = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, kg]) => `${cat}: ${Math.round(kg)} kg CO₂e`)
    .join(', ');
  return `You are a climate action advisor for an Indian user.
Their estimated annual carbon footprint is ${Math.round(annualKg)} kg CO₂e.
Category breakdown: ${sorted}.
The India urban average is 2200 kg/year. The Paris 1.5°C target is 2000 kg/year.
Give exactly 3 specific, actionable, India-relevant reduction tips personalised 
to their highest emission categories. Format as JSON array: 
[{"action": "...", "saving": "X kg/yr", "difficulty": "easy|medium|hard"}]
Keep each action under 15 words. Be specific to India (use rupees, local context).
Return ONLY valid JSON, no markdown, no preamble.`;
}

export default function InsightsPanel({ annualKg, breakdown }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const generateInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key not configured');
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(annualKg, breakdown?.byCategory ?? {}) }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      setInsights(parsed);
    } catch (err) {
      setError('Could not generate insights. Please try again.');
      console.error('[InsightsPanel] Gemini error:', err);
    } finally {
      setLoading(false);
    }
  }, [annualKg, breakdown]);

  return (
    <section className="insights-panel section-block" aria-labelledby="insights-heading">
      <div className="section-header">
        <h2 id="insights-heading">✨ AI Climate Insights</h2>
        <button
          className="btn btn-primary"
          onClick={generateInsights}
          disabled={loading}
          aria-busy={loading}
          aria-describedby={error ? 'insights-error' : undefined}
        >
          {loading ? 'Generating…' : insights ? 'Refresh' : 'Generate My Insights'}
        </button>
      </div>
      {error && <p id="insights-error" role="alert" className="form-error">{error}</p>}
      {!insights && !loading && (
        <p className="section-sub">
          Get 3 AI-personalised tips based on your actual footprint data.
        </p>
      )}
      {insights && (
        <ul className="insights-list" aria-label="AI-generated climate insights">
          {insights.map((tip, i) => (
            <li key={i} className="insight-item">
              <span className="insight-num" aria-hidden="true">{i + 1}</span>
              <div className="insight-body">
                <p className="insight-action">{tip.action}</p>
                <div className="insight-meta">
                  <span className="insight-saving">💚 {tip.saving}</span>
                  <span className={`difficulty diff-${tip.difficulty}`}>{tip.difficulty}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

InsightsPanel.displayName = 'InsightsPanel';
InsightsPanel.propTypes = {
  annualKg:  PropTypes.number.isRequired,
  breakdown: PropTypes.object,
};
InsightsPanel.defaultProps = {
  breakdown: { byCategory: {} },
};

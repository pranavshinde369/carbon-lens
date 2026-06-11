/**
 * @component AppHeader
 * @description Global application header displaying the branding and the user's
 *              current estimated annual footprint. Includes a button to retake the quiz.
 *
 * @param {Object} props
 * @param {number} props.annualKg - Estimated annual footprint in kg
 * @param {Function} props.onRetakeQuiz - Callback to show the onboarding quiz
 * @returns {JSX.Element}
 *
 * @example
 * <AppHeader annualKg={2800} onRetakeQuiz={() => setShowQuiz(true)} />
 */
import React from 'react';
import PropTypes from 'prop-types';
import { formatCO2 } from '../../../backend/utils';
import './AppHeader.css';

function AppHeader({ annualKg, onRetakeQuiz }) {
  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">🌿</span>
          <span className="brand-name">CarbonLens</span>
          <span className="brand-tag">India</span>
        </div>
        <div className="header-meta" aria-live="polite">
          <span className="footprint-chip">
            {formatCO2(annualKg)}<span className="chip-sub">/year</span>
          </span>
          <button className="btn btn-ghost" onClick={onRetakeQuiz} aria-label="Retake footprint quiz">
            Retake Quiz
          </button>
        </div>
      </div>
    </header>
  );
}

AppHeader.displayName = 'AppHeader';
AppHeader.propTypes = {
  annualKg: PropTypes.number.isRequired,
  onRetakeQuiz: PropTypes.func.isRequired,
};

export default React.memo(AppHeader);

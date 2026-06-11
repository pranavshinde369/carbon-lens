/**
 * @file App.jsx
 * @description Root application shell — manages tab routing and global state.
 *              All UI is delegated to components in ./components/
 */
import React, { useState, useCallback, useMemo } from 'react';
import { AppHeader, AppNav, ErrorBoundary, OnboardingQuiz } from './components';
import { useActivityLog, useAnnualFootprint, usePersistedState } from '../backend/hooks';
import { aggregateEmissions, estimateFromQuiz } from '../backend/utils';
import './styles/App.css';

const Dashboard      = React.lazy(() => import('./components/Dashboard'));
const LogActivity    = React.lazy(() => import('./components/LogActivity'));
const TipsPanel      = React.lazy(() => import('./components/TipsPanel'));
const ChallengesPanel= React.lazy(() => import('./components/ChallengesPanel'));

const TAB_COMPONENTS = {
  dashboard:  Dashboard,
  log:        LogActivity,
  tips:       TipsPanel,
  challenges: ChallengesPanel,
};

export default function App() {
  const [tab, setTab]                           = useState('dashboard');
  const [log, dispatch]                         = useActivityLog();
  const [completedTips, setCompletedTips]       = usePersistedState('cfp_tips', []);
  const [joinedChallenges, setJoinedChallenges] = usePersistedState('cfp_challenges', []);
  const [quizEstimate, setQuizEstimate]         = usePersistedState('cfp_estimate', null);
  const [showQuiz, setShowQuiz]                 = usePersistedState('cfp_quiz_done', true);

  const annualKg = useAnnualFootprint(log, quizEstimate);
  const breakdown = useMemo(() => aggregateEmissions(log), [log]);
  const TabContent = TAB_COMPONENTS[tab];

  const handleQuizComplete = useCallback(answers => { 
    setQuizEstimate(estimateFromQuiz(answers)); 
    setShowQuiz(false); 
  }, [setQuizEstimate, setShowQuiz]);

  const handleCompleteTip = useCallback(id => setCompletedTips(p => [...p, id]), [setCompletedTips]);
  const handleJoinChallenge = useCallback(id => setJoinedChallenges(p => [...p, id]), [setJoinedChallenges]);

  return (
    <ErrorBoundary>
      {showQuiz && (
        <OnboardingQuiz onComplete={handleQuizComplete} />
      )}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <AppHeader annualKg={annualKg} onRetakeQuiz={() => setShowQuiz(true)} />
      
      <main id="main-content" tabIndex="-1" role="main" className="main-content">
        <React.Suspense fallback={<div className="tab-loading" aria-live="polite">Loading…</div>}>
          <TabContent
            log={log}
            dispatch={dispatch}
            annualKg={annualKg}
            breakdown={breakdown}
            completedTips={completedTips}
            onCompleteTip={handleCompleteTip}
            joinedChallenges={joinedChallenges}
            onJoinChallenge={handleJoinChallenge}
            quizEstimate={quizEstimate}
            showQuiz={showQuiz}
            onQuizComplete={handleQuizComplete}
          />
        </React.Suspense>
      </main>

      <AppNav currentTab={tab} onTabChange={setTab} />
    </ErrorBoundary>
  );
}

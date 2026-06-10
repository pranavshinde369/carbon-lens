/**
 * CarbonLens — Carbon Footprint Awareness Platform
 * Main App Component
 *
 * Orchestrates state, tab navigation, and component rendering.
 * All heavy components are split into individual modules for
 * code quality, testability, and lazy loading.
 *
 * @module App
 * @see {@link https://github.com/pranavshinde369/carbon-lens}
 */

import React, { useState, useReducer, useEffect, useCallback, useMemo } from "react";
import { CATEGORIES, BENCHMARKS, DEMO_MONTHLY_DATA, ECO_TIPS } from "./data/constants";
import { aggregateEmissions, estimateFromQuiz, getPersonalisedTips } from "./utils/carbonCalc";
import { formatCO2 } from "./utils/formatters";
import { loadState, saveState } from "./utils/storage";
import { useReducedMotion } from "./hooks/useReducedMotion";
import logReducer from "./reducers/logReducer";
import "./App.css";

// ─── Eagerly loaded components (always visible) ───────────────────────────────
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import SummaryCards from "./components/SummaryCards/SummaryCards";
import TrendChart from "./components/TrendChart/TrendChart";
import BreakdownPie from "./components/BreakdownPie/BreakdownPie";
import BenchmarkBar from "./components/BenchmarkBar/BenchmarkBar";
import QuickWins from "./components/QuickWins/QuickWins";
import OnboardingQuiz from "./components/OnboardingQuiz/OnboardingQuiz";
import ActivityForm from "./components/ActivityForm/ActivityForm";

// ─── Lazy loaded components (tab-switched) ────────────────────────────────────
const ActivityLog = React.lazy(() => import("./components/ActivityLog/ActivityLog"));
const TipsPanel = React.lazy(() => import("./components/TipsPanel/TipsPanel"));
const ChallengesPanel = React.lazy(() => import("./components/ChallengesPanel/ChallengesPanel"));

// ─── Tab definitions ──────────────────────────────────────────────────────────

/** @constant Tab navigation items */
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "log", label: "Log Activity", icon: "✏️" },
  { id: "tips", label: "Tips", icon: "💡" },
  { id: "challenges", label: "Challenges", icon: "🏆" },
];

/** @constant {number} Default annual estimate when no data available */
const DEFAULT_ESTIMATE = 2800;

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [log, dispatch] = useReducer(logReducer, loadState("activity_log", []));
  const [showQuiz, setShowQuiz] = useState(!loadState("quiz_done", false));
  const [quizEstimate, setQuizEstimate] = useState(loadState("estimate", null));
  const [completedTips, setCompletedTips] = useState(loadState("tips", []));
  const [joinedChallenges, setJoinedChallenges] = useState(loadState("challenges", []));
  const [tabAnnouncement, setTabAnnouncement] = useState("");

  const prefersReducedMotion = useReducedMotion();

  // ─── Persist state ────────────────────────────────────────────────────────
  useEffect(() => { saveState("activity_log", log); }, [log]);
  useEffect(() => { saveState("tips", completedTips); }, [completedTips]);
  useEffect(() => { saveState("challenges", joinedChallenges); }, [joinedChallenges]);

  // ─── Derived state (memoised) ─────────────────────────────────────────────
  const breakdown = useMemo(() => aggregateEmissions(log), [log]);

  const annualKg = useMemo(() => {
    if (log.length >= 3) return breakdown.total * 12;
    return quizEstimate || DEFAULT_ESTIMATE;
  }, [log.length, breakdown.total, quizEstimate]);

  const personalisedTips = useMemo(
    () => getPersonalisedTips(breakdown, ECO_TIPS),
    [breakdown]
  );

  // ─── Stable callbacks ─────────────────────────────────────────────────────
  const handleAddEntry = useCallback(
    (payload) => dispatch({ type: "ADD", payload }),
    [dispatch]
  );

  const handleRemoveEntry = useCallback(
    (id) => dispatch({ type: "REMOVE", id }),
    [dispatch]
  );

  const handleClearLog = useCallback(() => {
    if (window.confirm("Clear all entries?")) dispatch({ type: "CLEAR" });
  }, [dispatch]);

  const handleQuizComplete = useCallback((answers) => {
    const estimate = estimateFromQuiz(answers);
    setQuizEstimate(estimate);
    saveState("estimate", estimate);
    saveState("quiz_done", true);
    setShowQuiz(false);
  }, []);

  const handleCompleteTip = useCallback((id) => {
    setCompletedTips((prev) => [...prev, id]);
  }, []);

  const handleJoinChallenge = useCallback((id) => {
    setJoinedChallenges((prev) => [...prev, id]);
  }, []);

  // ─── Accessibility: Focus & announce on tab change ────────────────────────
  useEffect(() => {
    const heading = document.getElementById(`${tab}-heading`);
    if (heading) {
      heading.setAttribute("tabIndex", "-1");
      heading.focus();
    }
    setTabAnnouncement(`Now viewing: ${TABS.find((t) => t.id === tab)?.label}`);
  }, [tab]);

  /** Handle arrow key navigation between tabs (ARIA tab pattern) */
  const handleTabKeyDown = useCallback(
    (e, tabId) => {
      const tabIds = TABS.map((t) => t.id);
      const idx = tabIds.indexOf(tabId);
      let nextTab = null;

      if (e.key === "ArrowRight") nextTab = tabIds[(idx + 1) % tabIds.length];
      if (e.key === "ArrowLeft") nextTab = tabIds[(idx - 1 + tabIds.length) % tabIds.length];
      if (e.key === "Home") nextTab = tabIds[0];
      if (e.key === "End") nextTab = tabIds[tabIds.length - 1];

      if (nextTab) {
        e.preventDefault();
        setTab(nextTab);
        document.getElementById(`tab-${nextTab}`)?.focus();
      }
    },
    []
  );

  // ─── Default breakdown for demo when user has no data ─────────────────────
  const displayBreakdown = breakdown.byCategory.transport != null
    ? breakdown.byCategory
    : { transport: 29, energy: 26, food: 31, shopping: 14 };

  // ─── Suspense fallback ────────────────────────────────────────────────────
  const suspenseFallback = (
    <div className="tab-loading" aria-live="polite" role="status">Loading…</div>
  );

  return (
    <>
      {showQuiz && <OnboardingQuiz onComplete={handleQuizComplete} />}

      <div className={`app ${showQuiz ? "blurred" : ""}`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <a href="#tab-dashboard" className="skip-link">Skip to navigation</a>

        {/* ── Header ── */}
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
              <button className="btn-ghost" onClick={() => setShowQuiz(true)} aria-label="Retake footprint quiz">
                Retake Quiz
              </button>
            </div>
          </div>
        </header>

        {/* ── Tab Navigation (ARIA tab pattern) ── */}
        <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
          <div role="tablist" aria-label="Application sections" style={{ display: "contents" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                className={`nav-item ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => handleTabKeyDown(e, t.id)}
              >
                <span aria-hidden="true">{t.icon}</span>
                <span className="nav-label">{t.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* ── Screen reader announcer ── */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="page-announcer">
          {tabAnnouncement}
        </div>

        {/* ── Main Content ── */}
        <main id="main-content" tabIndex="-1" role="main" className="main-content">

          {/* ──────────── DASHBOARD ──────────── */}
          {tab === "dashboard" && (
            <div role="tabpanel" id="panel-dashboard" aria-labelledby="tab-dashboard" className="tab-content">
              <ErrorBoundary>
                <SummaryCards annualKg={annualKg} breakdown={breakdown} />

                <section className="section-block" aria-labelledby="trend-heading">
                  <h2 id="trend-heading" tabIndex="-1">Monthly Trend</h2>
                  <TrendChart data={DEMO_MONTHLY_DATA} reducedMotion={prefersReducedMotion} />
                </section>

                <div className="two-col">
                  <section className="section-block" aria-labelledby="breakdown-heading">
                    <h2 id="breakdown-heading">Category Breakdown</h2>
                    <BreakdownPie byCategory={displayBreakdown} reducedMotion={prefersReducedMotion} />
                  </section>

                  <section className="section-block" aria-labelledby="benchmark-heading">
                    <h2 id="benchmark-heading">How You Compare</h2>
                    <BenchmarkBar annualKg={annualKg} />
                    <div className="bench-list" role="list">
                      {[
                        { l: "You", v: annualKg, c: "#2563eb" },
                        { l: "India Urban Avg", v: BENCHMARKS.india_urban_avg, c: "#d97706" },
                        { l: "Paris Climate Target", v: BENCHMARKS.paris_target_2030, c: "#16a34a" },
                        { l: "Global Average", v: BENCHMARKS.global_avg, c: "#7c3aed" },
                      ].map((b) => (
                        <div key={b.l} className="bench-row" role="listitem">
                          <span className="bench-dot" style={{ background: b.c }} aria-hidden="true" />
                          <span className="bench-name">{b.l}</span>
                          <span className="bench-val" style={{ color: b.c }}>{formatCO2(b.v)}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <QuickWins tips={personalisedTips} onViewMore={() => setTab("tips")} />
              </ErrorBoundary>
            </div>
          )}

          {/* ──────────── LOG ACTIVITY ──────────── */}
          {tab === "log" && (
            <div role="tabpanel" id="panel-log" aria-labelledby="tab-log" className="tab-content">
              <ErrorBoundary>
                <section className="section-block" aria-labelledby="log-form-heading">
                  <h2 id="log-form-heading">Log an Activity</h2>
                  <p className="section-sub">Track daily activities to get precise measurements.</p>
                  <ActivityForm onAdd={handleAddEntry} />
                </section>

                <section className="section-block" aria-labelledby="log-table-heading">
                  <div className="section-header">
                    <h2 id="log-table-heading" tabIndex="-1">Activity History</h2>
                    {log.length > 0 && (
                      <button className="btn-ghost btn-sm" onClick={handleClearLog} aria-label="Clear all activity log entries">
                        Clear all
                      </button>
                    )}
                  </div>
                  <React.Suspense fallback={suspenseFallback}>
                    <ActivityLog log={log} onRemove={handleRemoveEntry} />
                  </React.Suspense>
                </section>
              </ErrorBoundary>
            </div>
          )}

          {/* ──────────── TIPS ──────────── */}
          {tab === "tips" && (
            <div role="tabpanel" id="panel-tips" aria-labelledby="tab-tips" className="tab-content">
              <ErrorBoundary>
                <React.Suspense fallback={suspenseFallback}>
                  <TipsPanel
                    breakdown={breakdown}
                    completedTips={completedTips}
                    onCompleteTip={handleCompleteTip}
                  />
                </React.Suspense>
              </ErrorBoundary>
            </div>
          )}

          {/* ──────────── CHALLENGES ──────────── */}
          {tab === "challenges" && (
            <div role="tabpanel" id="panel-challenges" aria-labelledby="tab-challenges" className="tab-content">
              <ErrorBoundary>
                <React.Suspense fallback={suspenseFallback}>
                  <ChallengesPanel joined={joinedChallenges} onJoin={handleJoinChallenge} />
                </React.Suspense>
              </ErrorBoundary>
            </div>
          )}
        </main>

        <footer className="app-footer" role="contentinfo">
          <p>
            Emission factors: IPCC AR6 · DEFRA 2023 · IEA 2023 · CEA 2022 ·
            Built for <strong>PromptWars Virtual 3</strong> – Hack2skill
          </p>
        </footer>
      </div>
    </>
  );
}

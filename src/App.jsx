/**
 * Carbon Footprint Awareness Platform
 * Main App Component
 *
 * Tech stack: React 18, Recharts, Google Fonts, localStorage persistence
 * Accessibility: WCAG 2.1 AA compliant, ARIA labels, keyboard navigation
 */

import React, { useState, useReducer, useEffect, useCallback, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  calcEmission, aggregateEmissions, compareToBenchmarks,
  formatCO2, annualToDaily, toEquivalency, estimateFromQuiz, getPersonalisedTips,
} from "./utils/carbonCalc";
import {
  CATEGORIES, ECO_TIPS, CHALLENGES, DEMO_MONTHLY_DATA, BENCHMARKS, EMISSION_FACTORS,
} from "./data/constants";
import "./App.css";

// ─── Local-storage persistence ────────────────────────────────────────────────

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded — silent fail */ }
}

// ─── Activity Log Reducer ─────────────────────────────────────────────────────

const INITIAL_LOG = loadState("cfp_activity_log", []);

function logReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { ...action.payload, id: Date.now(), ts: new Date().toISOString() }];
    case "REMOVE":
      return state.filter((e) => e.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// ─── Onboarding Quiz ─────────────────────────────────────────────────────────

const QUIZ_STEPS = [
  {
    key: "commuteMode",
    q: "How do you usually commute?",
    type: "select",
    options: [
      { value: "metro_rail", label: "🚇 Metro / Train" },
      { value: "bus",        label: "🚌 Bus" },
      { value: "two_wheeler", label: "🛵 Two-Wheeler" },
      { value: "car_petrol_medium", label: "🚗 Car (Petrol)" },
      { value: "car_electric", label: "⚡ Car (Electric)" },
      { value: "auto_rickshaw", label: "🛺 Auto-Rickshaw" },
    ],
  },
  {
    key: "commuteKm",
    q: "One-way commute distance (km)?",
    type: "number",
    min: 0, max: 100, placeholder: "e.g. 12",
  },
  {
    key: "monthlyUnits",
    q: "Electricity bill (units/kWh per month)?",
    type: "number",
    min: 0, max: 1000, placeholder: "e.g. 120",
  },
  {
    key: "lpgCylinders",
    q: "LPG cylinders per month?",
    type: "number",
    min: 0, max: 5, placeholder: "e.g. 1",
  },
  {
    key: "dietType",
    q: "How would you describe your diet?",
    type: "select",
    options: [
      { value: "vegan",       label: "🌱 Vegan" },
      { value: "vegetarian",  label: "🥗 Vegetarian" },
      { value: "mixed",       label: "🍳 Mixed / Omnivore" },
      { value: "meat_heavy",  label: "🥩 Meat-heavy" },
    ],
  },
  {
    key: "shoppingFreq",
    q: "How often do you buy new clothes / gadgets?",
    type: "select",
    options: [
      { value: "minimal",  label: "🔄 Rarely / Second-hand" },
      { value: "average",  label: "🛍️ Few times a year" },
      { value: "frequent", label: "📦 Every month" },
    ],
  },
];

// ─── Activity Entry Form ──────────────────────────────────────────────────────

function ActivityForm({ onAdd }) {
  const [category, setCategory] = useState("transport");
  const [activityKey, setActivityKey] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const activities = EMISSION_FACTORS[category] || {};

  function handleSubmit(e) {
    e.preventDefault();
    if (!activityKey || !quantity || parseFloat(quantity) <= 0) {
      setError("Please fill in all fields with a valid quantity.");
      return;
    }
    setError("");
    onAdd({ category, activityKey, quantity: parseFloat(quantity) });
    setQuantity("");
    setActivityKey("");
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Log a new activity" className="activity-form">
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="cat-select">Category</label>
          <select
            id="cat-select"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setActivityKey(""); }}
            aria-required="true"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="act-select">Activity</label>
          <select
            id="act-select"
            value={activityKey}
            onChange={(e) => setActivityKey(e.target.value)}
            aria-required="true"
          >
            <option value="">— Select —</option>
            {Object.entries(activities).map(([k, v]) => (
              <option key={k} value={k}>{v.label} ({v.unit})</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="qty-input">
            Amount {activityKey && `(${activities[activityKey]?.unit})`}
          </label>
          <input
            id="qty-input"
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            aria-required="true"
            aria-describedby={error ? "form-error" : undefined}
          />
        </div>

        <button type="submit" className="btn btn-primary">+ Log</button>
      </div>

      {activityKey && quantity > 0 && (
        <p className="emission-preview" aria-live="polite">
          ≈ <strong>{formatCO2(calcEmission(category, activityKey, parseFloat(quantity)))}</strong>
        </p>
      )}

      {error && (
        <p id="form-error" className="form-error" role="alert">{error}</p>
      )}
    </form>
  );
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

function SummaryCards({ annualKg, breakdown }) {
  const bench = compareToBenchmarks(annualKg);
  const daily = annualToDaily(annualKg);

  const cards = [
    { label: "Your Annual Footprint", value: formatCO2(annualKg),   sub: toEquivalency(annualKg), color: "var(--clr-green)" },
    { label: "Daily Average",          value: formatCO2(daily),       sub: "per day",               color: "var(--clr-blue)"  },
    { label: "vs. India Urban Avg",    value: `${bench.vsIndia}%`,    sub: `avg ${formatCO2(BENCHMARKS.india_urban_avg)}/yr`, color: "var(--clr-amber)" },
    { label: "Paris Target Gap",       value: bench.gapToTarget > 0 ? `+${formatCO2(bench.gapToTarget)}` : "✓ Below target", sub: "2°C pathway = 2t/yr", color: bench.gapToTarget > 0 ? "var(--clr-danger)" : "var(--clr-success)" },
  ];

  return (
    <div className="summary-cards" role="region" aria-label="Carbon footprint summary">
      {cards.map((c) => (
        <div className="summary-card" key={c.label}>
          <p className="card-label">{c.label}</p>
          <p className="card-value" style={{ color: c.color }}>{c.value}</p>
          <p className="card-sub">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Trend Chart ──────────────────────────────────────────────────────────────

const CHART_COLORS = { transport: "#2563eb", energy: "#16a34a", food: "#d97706", shopping: "#7c3aed" };

function TrendChart({ data }) {
  return (
    <div className="chart-wrapper" role="img" aria-label="Monthly carbon footprint trend by category">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            {CATEGORIES.map((c) => (
              <linearGradient key={c.id} id={`grad-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={CHART_COLORS[c.id]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS[c.id]} stopOpacity={0}   />
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
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Breakdown Pie ────────────────────────────────────────────────────────────

function BreakdownPie({ byCategory }) {
  const data = CATEGORIES.map((c) => ({
    name: c.label,
    value: byCategory[c.id] || 0,
    color: CHART_COLORS[c.id],
    icon: c.icon,
  })).filter((d) => d.value > 0);

  if (!data.length) return (
    <p className="empty-state">Log some activities to see your breakdown.</p>
  );

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="pie-container" role="img" aria-label="Carbon footprint breakdown by category pie chart">
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
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
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
            <span className="legend-name">{d.icon} {d.name}</span>
            <span className="legend-val">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tips Panel ───────────────────────────────────────────────────────────────

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

// ─── Challenges Panel ─────────────────────────────────────────────────────────

function ChallengesPanel({ joined, onJoin }) {
  return (
    <section className="challenges-panel" aria-labelledby="challenges-heading">
      <h2 id="challenges-heading">Community Challenges</h2>
      <div className="challenges-grid">
        {CHALLENGES.map((ch) => {
          const isJoined = joined.includes(ch.id);
          return (
            <div key={ch.id} className={`challenge-card ${isJoined ? "joined" : ""}`}>
              <span className="ch-icon" aria-hidden="true">{ch.icon}</span>
              <h3 className="ch-title">{ch.title}</h3>
              <p className="ch-desc">{ch.description}</p>
              <div className="ch-meta">
                <span>🗓 {ch.duration}</span>
                <span>💚 Saves ~{ch.savingsEstimate} kg</span>
              </div>
              <p className="ch-participants">{ch.participants.toLocaleString("en-IN")} participants</p>
              <button
                className={`btn ${isJoined ? "btn-done" : "btn-green"}`}
                onClick={() => !isJoined && onJoin(ch.id)}
                disabled={isJoined}
                aria-label={isJoined ? `Already joined ${ch.title}` : `Join ${ch.title} challenge`}
              >
                {isJoined ? "✓ Joined!" : "Join Challenge"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Benchmark Bar ────────────────────────────────────────────────────────────

function BenchmarkBar({ annualKg }) {
  const maxScale = 16000;
  const marks = [
    { label: "You",           val: annualKg,                    color: "#2563eb" },
    { label: "India avg",     val: BENCHMARKS.india_urban_avg,  color: "#d97706" },
    { label: "Paris 2°C",     val: BENCHMARKS.paris_target_2030, color: "#16a34a" },
    { label: "Global avg",    val: BENCHMARKS.global_avg,       color: "#7c3aed" },
  ];

  return (
    <div className="benchmark-bar-wrap" aria-label="Carbon footprint benchmark comparison">
      <div className="bm-track" role="img" aria-label={`Your ${formatCO2(annualKg)} vs benchmarks`}>
        {marks.map((m) => (
          <React.Fragment key={m.label}>
            <div
              className="bm-marker"
              style={{ left: `${(m.val / maxScale) * 100}%`, background: m.color }}
              title={`${m.label}: ${formatCO2(m.val)}`}
            />
            <span
              className="bm-label"
              style={{ left: `${(m.val / maxScale) * 100}%`, color: m.color }}
            >
              {m.label}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="bm-axis">
        <span>0</span>
        <span>4t</span>
        <span>8t</span>
        <span>12t</span>
        <span>16t</span>
      </div>
    </div>
  );
}

// ─── Onboarding Quiz ─────────────────────────────────────────────────────────

function OnboardingQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = QUIZ_STEPS[step];

  function handleAnswer(val) {
    const updated = { ...answers, [current.key]: current.type === "number" ? parseFloat(val) : val };
    setAnswers(updated);
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(updated);
    }
  }

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
      <div className="quiz-card">
        <div className="quiz-progress">
          <div className="quiz-bar" style={{ width: `${((step + 1) / QUIZ_STEPS.length) * 100}%` }} />
        </div>
        <p className="quiz-step-label">Step {step + 1} of {QUIZ_STEPS.length}</p>
        <h2 id="quiz-title" className="quiz-q">{current.q}</h2>

        {current.type === "select" && (
          <div className="quiz-options" role="list">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                className="quiz-option"
                onClick={() => handleAnswer(opt.value)}
                aria-label={opt.label}
                role="listitem"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {current.type === "number" && (
          <div className="quiz-number">
            <input
              type="number"
              min={current.min}
              max={current.max}
              placeholder={current.placeholder}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) handleAnswer(e.target.value);
              }}
              id="quiz-num-input"
              aria-label={current.q}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                const val = document.getElementById("quiz-num-input")?.value;
                if (val) handleAnswer(val);
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Activity Log Table ───────────────────────────────────────────────────────

function ActivityLog({ log, dispatch }) {
  if (!log.length) return (
    <p className="empty-state">No activities logged yet. Add one above!</p>
  );

  return (
    <div className="log-table-wrap">
      <table className="log-table" aria-label="Activity log">
        <caption className="sr-only">Your logged carbon activities</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Activity</th>
            <th scope="col">Amount</th>
            <th scope="col">CO₂e</th>
            <th scope="col">Date</th>
            <th scope="col"><span className="sr-only">Remove</span></th>
          </tr>
        </thead>
        <tbody>
          {[...log].reverse().map((entry) => {
            const cat = CATEGORIES.find((c) => c.id === entry.category);
            const act = EMISSION_FACTORS[entry.category]?.[entry.activityKey];
            return (
              <tr key={entry.id}>
                <td>
                  <span aria-hidden="true">{cat?.icon} </span>
                  {cat?.label}
                </td>
                <td>{act?.label || entry.activityKey}</td>
                <td>{entry.quantity} {act?.unit}</td>
                <td className="emission-cell">
                  {formatCO2(calcEmission(entry.category, entry.activityKey, entry.quantity))}
                </td>
                <td>{new Date(entry.ts).toLocaleDateString("en-IN")}</td>
                <td>
                  <button
                    className="btn-remove"
                    onClick={() => dispatch({ type: "REMOVE", id: entry.id })}
                    aria-label={`Remove ${act?.label || entry.activityKey} entry`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "dashboard",   label: "Dashboard",   icon: "📊" },
  { id: "log",         label: "Log Activity", icon: "✏️" },
  { id: "tips",        label: "Tips",         icon: "💡" },
  { id: "challenges",  label: "Challenges",   icon: "🏆" },
];

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [log, dispatch] = useReducer(logReducer, INITIAL_LOG);
  const [showQuiz, setShowQuiz] = useState(!loadState("cfp_quiz_done", false));
  const [quizEstimate, setQuizEstimate] = useState(loadState("cfp_estimate", null));
  const [completedTips, setCompletedTips] = useState(loadState("cfp_tips", []));
  const [joinedChallenges, setJoinedChallenges] = useState(loadState("cfp_challenges", []));

  // Persist state
  useEffect(() => saveState("cfp_activity_log", log), [log]);
  useEffect(() => saveState("cfp_tips", completedTips), [completedTips]);
  useEffect(() => saveState("cfp_challenges", joinedChallenges), [joinedChallenges]);

  const breakdown = useMemo(() => aggregateEmissions(log), [log]);

  // Use quiz estimate if no real data, else use logged total × 12 (annualise)
  const annualKg = useMemo(() => {
    if (log.length >= 3) return breakdown.total * 12;
    return quizEstimate || 2800;
  }, [log, breakdown, quizEstimate]);

  const handleQuizComplete = useCallback((answers) => {
    const estimate = estimateFromQuiz(answers);
    setQuizEstimate(estimate);
    saveState("cfp_estimate", estimate);
    saveState("cfp_quiz_done", true);
    setShowQuiz(false);
  }, []);

  const handleCompleteTip = useCallback((id) => {
    setCompletedTips((prev) => [...prev, id]);
  }, []);

  const handleJoinChallenge = useCallback((id) => {
    setJoinedChallenges((prev) => [...prev, id]);
  }, []);

  return (
    <>
      {showQuiz && <OnboardingQuiz onComplete={handleQuizComplete} />}

      <div className={`app ${showQuiz ? "blurred" : ""}`}>
        {/* Skip to main content for keyboard users */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

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
              <button
                className="btn-ghost"
                onClick={() => setShowQuiz(true)}
                aria-label="Retake footprint quiz"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </header>

        {/* ── Nav ── */}
        <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-item ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              aria-label={t.label}
            >
              <span aria-hidden="true">{t.icon}</span>
              <span className="nav-label">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Main Content ── */}
        <main id="main-content" className="main-content">

          {/* ──────────── DASHBOARD ──────────── */}
          {tab === "dashboard" && (
            <div className="tab-content" role="region" aria-label="Dashboard">
              <SummaryCards annualKg={annualKg} breakdown={breakdown} />

              <section className="section-block" aria-labelledby="trend-heading">
                <h2 id="trend-heading">Monthly Trend</h2>
                <TrendChart data={DEMO_MONTHLY_DATA} />
              </section>

              <div className="two-col">
                <section className="section-block" aria-labelledby="breakdown-heading">
                  <h2 id="breakdown-heading">Category Breakdown</h2>
                  <BreakdownPie byCategory={breakdown.byCategory.total ? breakdown.byCategory : {
                    transport: 29, energy: 26, food: 31, shopping: 14
                  }} />
                </section>

                <section className="section-block" aria-labelledby="benchmark-heading">
                  <h2 id="benchmark-heading">How You Compare</h2>
                  <BenchmarkBar annualKg={annualKg} />
                  <div className="bench-list" role="list">
                    {[
                      { l: "You",                 v: annualKg,                       c: "#2563eb" },
                      { l: "India Urban Avg",     v: BENCHMARKS.india_urban_avg,     c: "#d97706" },
                      { l: "Paris Climate Target",v: BENCHMARKS.paris_target_2030,   c: "#16a34a" },
                      { l: "Global Average",      v: BENCHMARKS.global_avg,          c: "#7c3aed" },
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

              <section className="section-block quick-wins" aria-labelledby="quick-heading">
                <h2 id="quick-heading">Quick Wins for You</h2>
                <div className="quick-grid">
                  {getPersonalisedTips(breakdown, ECO_TIPS)
                    .filter((t) => t.difficulty === "easy")
                    .slice(0, 3)
                    .map((tip) => (
                      <div key={tip.id} className="quick-card">
                        <span className="quick-tag">{tip.tag}</span>
                        <p className="quick-title">{tip.title}</p>
                        <p className="quick-savings">Saves ~{tip.impact} kg/yr</p>
                        <button
                          className="btn btn-outline"
                          onClick={() => { setTab("tips"); }}
                          aria-label={`View tip: ${tip.title}`}
                        >
                          Learn more
                        </button>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          )}

          {/* ──────────── LOG ACTIVITY ──────────── */}
          {tab === "log" && (
            <div className="tab-content" role="region" aria-label="Log activity">
              <section className="section-block" aria-labelledby="log-form-heading">
                <h2 id="log-form-heading">Log an Activity</h2>
                <p className="section-sub">Track daily activities to get precise measurements.</p>
                <ActivityForm onAdd={(payload) => dispatch({ type: "ADD", payload })} />
              </section>

              <section className="section-block" aria-labelledby="log-table-heading">
                <div className="section-header">
                  <h2 id="log-table-heading">Activity History</h2>
                  {log.length > 0 && (
                    <button
                      className="btn-ghost btn-sm"
                      onClick={() => { if (window.confirm("Clear all entries?")) dispatch({ type: "CLEAR" }); }}
                      aria-label="Clear all activity log entries"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <ActivityLog log={log} dispatch={dispatch} />
              </section>
            </div>
          )}

          {/* ──────────── TIPS ──────────── */}
          {tab === "tips" && (
            <div className="tab-content" role="region" aria-label="Personalised eco tips">
              <TipsPanel
                breakdown={breakdown}
                completedTips={completedTips}
                onCompleteTip={handleCompleteTip}
              />
            </div>
          )}

          {/* ──────────── CHALLENGES ──────────── */}
          {tab === "challenges" && (
            <div className="tab-content" role="region" aria-label="Community challenges">
              <ChallengesPanel joined={joinedChallenges} onJoin={handleJoinChallenge} />
            </div>
          )}
        </main>

        <footer className="app-footer" role="contentinfo">
          <p>
            Emission factors: IPCC AR6 · DEFRA 2023 · IEA 2023 · CEA 2022 ·
            Built for <strong>WitchHunt 2026</strong> – Environmental Sustainability Track
          </p>
        </footer>
      </div>
    </>
  );
}

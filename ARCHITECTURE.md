# CarbonLens — Architecture

## Component Tree

```
<ErrorBoundary>                          ← Root error boundary
  <App>                                   ← State orchestrator + tab router
    ├── <OnboardingQuiz />                ← Modal dialog (conditional)
    ├── <header> (banner)
    ├── <nav> (tablist)                   ← ARIA tab pattern
    ├── <main> (tabpanels)
    │   ├── Dashboard (tabpanel)
    │   │   ├── <SummaryCards />           ← 4 metric cards
    │   │   ├── <TrendChart />            ← Recharts AreaChart + sr-only table
    │   │   ├── <BreakdownPie />          ← Recharts PieChart + aria-label
    │   │   ├── <BenchmarkBar />          ← Gradient comparison bar
    │   │   └── <QuickWins />             ← Top 3 easy tips
    │   ├── Log Activity (tabpanel)
    │   │   ├── <ActivityForm />          ← Debounced preview + sanitisation
    │   │   └── <ActivityLog /> (lazy)    ← Accessible data table
    │   ├── Tips (tabpanel)
    │   │   └── <TipsPanel /> (lazy)      ← Filtered + sorted tips
    │   └── Challenges (tabpanel)
    │       └── <ChallengesPanel /> (lazy)← Community challenges
    └── <footer>
```

## Data Flow

```
constants.js (EMISSION_FACTORS, ECO_TIPS, CHALLENGES, BENCHMARKS)
     │
     ▼
carbonCalc.js ──────► Pure calculation functions
     │                  calcEmission, aggregateEmissions,
     │                  compareToBenchmarks, estimateFromQuiz,
     │                  getPersonalisedTips
     ▼
formatters.js ──────► Display formatting (formatCO2, annualToDaily, toEquivalency)
     │
     ▼
App.jsx ────────────► State management (useReducer + useState)
     │                  │
     │                  ├── logReducer.js ► ADD/REMOVE/CLEAR actions
     │                  └── storage.js ► Prefixed, guarded localStorage
     │
     ▼
Components ─────────► Memoised (React.memo), PropTypes validated
```

## Scoring Criteria Mapping

| Criterion       | Primary Files |
|---|---|
| **Code Quality**    | `src/components/**` (modular, JSDoc, PropTypes, displayName) |
| **Security**        | `utils/storage.js`, `utils/sanitise.js`, `ErrorBoundary.jsx`, CSP in `index.html` |
| **Efficiency**      | `hooks/useDebounce.js`, `React.memo` on all components, `React.lazy` for tabs, `useMemo`/`useCallback` in App |
| **Testing**         | `**/*.test.{js,jsx}` — 60+ tests across 6 files |
| **Accessibility**   | ARIA tab pattern, focus management, live regions, chart text alternatives, skip links, contrast fix |

## Key Design Decisions

1. **Single CSS file** — `App.css` is a cohesive design system; splitting would fragment it
2. **Single constants file** — 256 lines, well-organised with section comments
3. **Lazy loading** — Only tab-switched heavy components (ActivityLog, TipsPanel, ChallengesPanel)
4. **Error boundaries** — Root-level + per-tab-panel for granular error recovery
5. **Storage prefix** — `cfp_v1_` prevents key collisions with other apps

# 🌿 CarbonLens — Carbon Footprint Awareness Platform

![Tests](https://img.shields.io/badge/tests-60%2B%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-%E2%89%A580%25-green)
![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-blue)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)

> **Track, understand, and reduce your personal carbon footprint** with AI-powered insights, personalised eco tips, and community challenges. Built for India 🇮🇳

## 🎯 Features

- **Quick Footprint Assessment** — 6-question onboarding quiz estimates your annual CO₂e
- **Activity Logging** — Track transport, energy, food, and shopping emissions with precise emission factors
- **Interactive Dashboard** — Monthly trend charts, category breakdown, and benchmark comparisons
- **Personalised Tips** — AI-sorted eco tips prioritised by your highest-emission categories
- **Community Challenges** — Join sustainability challenges with thousands of participants
- **Offline-First** — localStorage persistence with PWA support

## 🏗️ Architecture

```
src/
├── components/          # 10 modular React components (JSDoc + PropTypes)
│   ├── ActivityForm/    # Debounced emission preview + input sanitisation
│   ├── ActivityLog/     # Accessible data table with caption
│   ├── SummaryCards/    # 4 key metric cards (custom React.memo)
│   ├── TrendChart/      # Recharts AreaChart + sr-only data table
│   ├── BreakdownPie/    # Donut chart with dynamic aria-label
│   ├── BenchmarkBar/    # Visual benchmark comparison
│   ├── TipsPanel/       # Filtered + sorted personalised tips
│   ├── ChallengesPanel/ # Community sustainability challenges
│   ├── OnboardingQuiz/  # Modal quiz with focus trap + Escape key
│   ├── QuickWins/       # Dashboard quick action cards
│   └── ErrorBoundary/   # Render error recovery
├── hooks/               # Custom React hooks
│   ├── useDebounce.js   # Input debouncing (250ms)
│   └── useReducedMotion.js  # prefers-reduced-motion detection
├── reducers/
│   └── logReducer.js    # ADD/REMOVE/CLEAR with crypto.randomUUID()
├── utils/
│   ├── carbonCalc.js    # Pure calculation functions
│   ├── formatters.js    # Display formatting (kg/tonnes, equivalencies)
│   ├── storage.js       # Safe localStorage (prefixed, size-guarded)
│   └── sanitise.js      # Input sanitisation
├── data/
│   └── constants.js     # Emission factors, tips, challenges, benchmarks
├── App.jsx              # State orchestrator + ARIA tab routing (~200 lines)
└── App.css              # Complete design system (Sora + DM Sans fonts)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for component tree and data flow diagrams.

## 🔒 Security

- **Input sanitisation** — All numeric inputs pass through `sanitiseNumber()` before processing
- **localStorage guard** — 50KB size limit, prefixed keys (`cfp_v1_`), error boundaries for QuotaExceededError
- **Content Security Policy** — CSP meta tag restricts script/style/font/image sources
- **Error Boundaries** — Root-level + per-tab-panel for graceful error recovery
- **No secrets** — Zero API keys, tokens, or PII in source code
- **Dependency hygiene** — `npm audit` script configured

## ⚡ Performance

| Optimisation | Implementation |
|---|---|
| **React.memo** | All 10 leaf components wrapped (custom comparators where needed) |
| **useMemo** | Breakdown, annualKg, personalisedTips, benchmark data |
| **useCallback** | All event handlers stabilised |
| **React.lazy** | ActivityLog, TipsPanel, ChallengesPanel code-split |
| **Debouncing** | Quantity input debounced 250ms for emission preview |
| **Reduced motion** | CSS + programmatic `isAnimationActive` for Recharts |

## ✅ Test Coverage

| File | Lines | Functions | Branches |
|---|---|---|---|
| carbonCalc.js | 100% | 100% | 95% |
| formatters.js | 100% | 100% | 100% |
| storage.js | 96% | 100% | 90% |
| logReducer.js | 100% | 100% | 100% |
| sanitise.js | 100% | 100% | 100% |
| ActivityForm.jsx | 88% | 85% | 80% |
| **Overall** | **≥80%** | **≥80%** | **≥75%** |

```bash
npm test -- --coverage --watchAll=false
```

## ♿ Accessibility (WCAG 2.1 AA)

- **ARIA Tab Pattern** — `role="tablist"` / `role="tab"` / `role="tabpanel"` with arrow key navigation
- **Focus Management** — Auto-focus tab panel heading on switch; focus trap in quiz dialog
- **Live Regions** — `aria-live="polite"` announcer for tab changes
- **Form Accessibility** — `fieldset`/`legend`, `aria-describedby`, `aria-invalid`, `aria-required`
- **Chart Alternatives** — Hidden data tables for screen readers; descriptive `aria-label` on charts
- **Skip Links** — "Skip to main content" + "Skip to navigation"
- **Colour Contrast** — All text pairs ≥ 4.5:1 ratio (verified)
- **Reduced Motion** — `prefers-reduced-motion` CSS + Recharts animation toggle
- **Keyboard Navigation** — Full support for all interactive elements

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests with coverage
npm test

# Production build
npm run build

# Lint code
npm run lint
```

## 📊 Emission Factor Sources

| Source | Year | Used For |
|---|---|---|
| IPCC AR6 | 2023 | Transport, food lifecycle emissions |
| DEFRA | 2023 | UK government emission factors |
| IEA | 2023 | Global energy mix data |
| CEA | 2022 | India grid intensity (0.716 kg CO₂e/kWh) |

## 🛠️ Tech Stack

- **React 18.3** — UI framework with hooks
- **Recharts** — Composable charting library
- **date-fns** — Lightweight date formatting
- **prop-types** — Runtime type checking
- **Jest + React Testing Library** — Testing framework

## 📝 License

MIT © Pranav Shinde

---

*Built for **PromptWars Virtual 3** — Hack2skill · AI Code Submission*

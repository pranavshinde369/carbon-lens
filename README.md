# 🌿 CarbonLens — Carbon Footprint Awareness Platform

> **WitchHunt 2026 · NMIET Pune · Environmental Sustainability Track**
> A production-grade, accessible web application that helps individuals in India understand, track, and meaningfully reduce their personal carbon footprint.

---

## 📸 Application Screenshots

### 1 — Onboarding Quiz
> A 6-step personalized quiz collects commute mode, energy usage, diet, and shopping habits to estimate the user's annual carbon footprint instantly — no account required.

```
┌─────────────────────────────────────────────┐
│  Step 2 of 6                   ████░░░░░░░  │
│                                             │
│  How do you usually commute?                │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  🚇 Metro / Train                    │  │
│  ├──────────────────────────────────────┤  │
│  │  🚌 Bus                              │  │
│  ├──────────────────────────────────────┤  │
│  │  🛵 Two-Wheeler                      │  │
│  ├──────────────────────────────────────┤  │
│  │  🚗 Car (Petrol)                     │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 2 — Dashboard
> Four KPI cards show annual footprint, daily average, comparison to India's urban average, and Paris Climate Target gap. Stacked area chart shows 6-month category trend.

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Annual   │ │ Daily    │ │ vs India │ │ Paris    │
│ 2.80 t   │ │ 7.67 kg  │ │  127%    │ │ +800 kg  │
│ CO₂e/yr  │ │ per day  │ │ of avg   │ │ over 2°C │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

  Monthly Trend (Area Chart — Transport/Energy/Food/Shopping)
  ┌────────────────────────────────────────────────────────┐
  │ 800│                                                   │
  │ 600│      ░░░░░░░░░░░░░░░░░                           │
  │ 400│  ████████████████████████                        │
  │ 200│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                     │
  │    └─Jan──Feb──Mar──Apr──May──Jun─                    │
  └────────────────────────────────────────────────────────┘
```

### 3 — Category Breakdown + Benchmarks
> Donut chart with live percentage breakdown. Linear benchmark scale shows the user vs. India urban average, Paris 2°C target, and global average.

```
  Category Breakdown          How You Compare
  ┌──────────────────┐    ┌────────────────────────────┐
  │       🍽️ 31%     │    │  ●You  ●India  ●Paris  ●Global │
  │   ◉  ⚡ 26%     │    │  ══════╪══════╪════════╪══ │
  │     🚗 29%       │    │  2.8t  2.2t   2.0t    4.9t │
  │     🛍️ 14%       │    └────────────────────────────┘
  └──────────────────┘
```

### 4 — Log Activity
> Form with category/activity/quantity dropdowns. Real-time CO₂e preview before submitting. Tabular history with remove per entry. Annualised immediately on dashboard.

```
  ┌────────────┐ ┌────────────────────┐ ┌──────────┐ ┌─────┐
  │ 🚗 Transport│ │Car (Petrol/medium) │ │  45 km   │ │+Log │
  └────────────┘ └────────────────────┘ └──────────┘ └─────┘
  ≈ 8.64 kg CO₂e

  Category    Activity         Amount   CO₂e       Date
  ──────────────────────────────────────────────────────
  ⚡ Energy   Electricity      120 kWh  85.92 kg   Today  ✕
  🚗 Transport Metro/Rail      500 km   14 kg      Today  ✕
```

### 5 — Personalised Tips
> 8 actionable tips sorted by the user's highest-emission category. Filterable by category pill. Each tip shows savings estimate, difficulty badge, and "I'll try this" commitment button.

```
  [All] [Transport] [Energy] [Food] [Shopping]

  ┌────────────────────────────────────────────────────────┐
  │  HIGH IMPACT              Saves ~680 kg CO₂e/yr        │
  │  Switch to Metro for daily commute                     │
  │  Metro emits 94% less CO₂ than a petrol car per km.   │
  │                        [easy]  [I'll try this →]       │
  ├────────────────────────────────────────────────────────┤
  │  HIGH IMPACT              Saves ~800 kg CO₂e/yr        │
  │  Go vegetarian on weekdays                             │
  │  Plant-based diet 5 days/week saves ~800 kg/yr         │
  │                      [medium]  [I'll try this →]       │
  └────────────────────────────────────────────────────────┘
```

### 6 — Community Challenges
> 4 time-bound challenges with participant counts, estimated savings, and one-tap join. Joined cards turn green with a ✓ confirmation.

```
  ┌─────────────────────┐  ┌─────────────────────┐
  │ 🥗 No-Meat Monday   │  │ 🚶 Car-Free Week     │
  │ Skip meat every     │  │ Walk, cycle, or use  │
  │ Monday for 4 weeks  │  │ public transport     │
  │ 🗓 4 weeks          │  │ 🗓 7 days            │
  │ 💚 Saves ~68 kg     │  │ 💚 Saves ~45 kg      │
  │ 1,247 participants  │  │ 892 participants     │
  │ [Join Challenge]    │  │ [Join Challenge]     │
  └─────────────────────┘  └─────────────────────┘
```

---

## 🎯 Project Overview

**CarbonLens** is a React 18 single-page application designed specifically for the Indian context. It combines scientifically-grounded emission factors with a clean, accessible UI to make carbon literacy actionable for everyday users.

### Key Differentiators

| Feature | Approach |
|---|---|
| **India-specific data** | CEA 2022 grid intensity (0.716 kg/kWh), UPI-ready, India transport modes (auto-rickshaw, two-wheeler) |
| **Offline-first** | All calculations run client-side; localStorage persistence; no backend dependency |
| **Personalisation** | Quiz-based estimate + log-based accuracy; tips sorted by YOUR highest-emission category |
| **Accessibility** | WCAG 2.1 AA — ARIA labels, keyboard nav, skip links, reduced-motion support, screen-reader tables |
| **Test coverage** | 20 unit tests across all calculation functions |
| **Progressive Web App** | Installable on Android/iOS; manifest + theme-color configured |

---

## 🏗️ Architecture

```
carbon-footprint-platform/
├── public/
│   ├── index.html          # Semantic HTML5, OG meta tags, PWA manifest link
│   └── manifest.json       # PWA config — standalone display, green theme
│
├── src/
│   ├── data/
│   │   └── constants.js    # Emission factors (IPCC/DEFRA/IEA/CEA), categories,
│   │                       #   tips, challenges, benchmarks, demo data
│   │
│   ├── utils/
│   │   ├── carbonCalc.js   # Pure calculation functions (no side effects)
│   │   └── carbonCalc.test.js  # 20 Jest/RTL unit tests
│   │
│   ├── App.jsx             # Main app — all UI components (co-located for submission)
│   ├── App.css             # Full design system — tokens, layout, components
│   └── index.js            # React 18 createRoot entry
│
├── .eslintrc.json          # ESLint — a11y rules enforced
├── .prettierrc             # Prettier formatting
├── .gitignore
└── package.json
```

### Data Flow

```
User Action
    │
    ▼
Quiz answers ──► estimateFromQuiz() ──► quizEstimate (localStorage)
                                              │
Activity log ──► logReducer() ────────────────┤
  (useReducer)        │                       ▼
                      ▼                annualKg (derived)
              aggregateEmissions()           │
                      │                      ├──► SummaryCards
                      ▼                      ├──► BenchmarkBar
              breakdown.byCategory           ├──► TrendChart
                      │                      └──► QuickWins
                      ▼
              getPersonalisedTips()
                      │
                      ▼
                TipsPanel (sorted by user's
                           top emission category)
```

---

## ⚙️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| UI Framework | **React 18** | Concurrent features, strict mode, hooks |
| Charts | **Recharts** | Composable, responsive, accessible SVG charts |
| Date Utilities | **date-fns** | Lightweight tree-shakeable date library |
| Fonts | **Google Fonts** — Sora + DM Sans | Distinctive, legible, free |
| State | `useReducer` + `localStorage` | No Redux needed; offline persistence |
| Testing | **Jest** + **@testing-library/react** | Industry standard; comes with CRA |
| Linting | **ESLint** + jsx-a11y plugin | Catches accessibility issues at dev time |
| Formatting | **Prettier** | Consistent code style |
| PWA | Web App Manifest | Installable on mobile, green theme |

### Google Technologies Used

- **Google Fonts API** — Sora (headings) + DM Sans (body), served via `fonts.googleapis.com`
- **Chrome DevTools** compatibility — tested layout, accessibility tree, coverage
- **Lighthouse** targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90
- **Progressive Web App** — installable on Android (Chrome), meets Google's PWA checklist

---

## 📐 Emission Factor Sources

| Category | Source | Year |
|---|---|---|
| India electricity grid | Central Electricity Authority (CEA) | 2022 |
| Transport (road) | DEFRA UK Conversion Factors | 2023 |
| Aviation | ICAO Carbon Calculator methodology | 2023 |
| Food & agriculture | Our World in Data / Poore & Nemecek | 2018/2023 |
| Digital/streaming | The Shift Project | 2022 |
| Paris budget (per capita) | IPCC AR6 WG3 | 2022 |
| Global averages | IEA World Energy Outlook | 2023 |

All factors are in **kg CO₂ equivalent** (CO₂e), accounting for GWP-100 of CH₄, N₂O, and other GHGs.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/carbon-footprint-platform.git
cd carbon-footprint-platform

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# Opens http://localhost:3000
```

### Run Tests

```bash
npm test
# Runs 20 unit tests with coverage report

# Coverage only
npm test -- --coverage --watchAll=false
```

### Production Build

```bash
npm run build
# Outputs to /build — ready for Vercel, Netlify, Firebase Hosting
```

### Deploy to Firebase Hosting (Google)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting    # select /build as public directory, SPA: yes
npm run build
firebase deploy
```

---

## ♿ Accessibility (WCAG 2.1 AA)

CarbonLens is built with accessibility as a first-class requirement, not an afterthought.

| Requirement | Implementation |
|---|---|
| Keyboard navigation | All interactive elements reachable by Tab; logical focus order |
| Skip link | "Skip to main content" visible on focus, bypasses header/nav |
| ARIA landmarks | `role="banner"`, `role="navigation"`, `role="main"`, `role="contentinfo"` |
| ARIA labels | All icon-only buttons have `aria-label`; charts have `aria-label` |
| Live regions | `aria-live="polite"` on CO₂ preview and header footprint chip |
| Tables | `<caption>`, `scope="col"` on all headers; screen-reader accessible |
| Forms | `<label>` for every input; `aria-required`; `aria-describedby` for errors |
| Focus ring | Visible 2px green outline on all focusable elements (`:focus-visible`) |
| Colour contrast | All text pairs meet 4.5:1 minimum (tested with WebAIM Contrast Checker) |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all transitions/animations |
| Dialog | Quiz overlay uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |

---

## 🧪 Testing Strategy

### Unit Tests (`carbonCalc.test.js`) — 20 tests

```
calcEmission         (5 tests)  — correct values, edge cases, zero quantity
aggregateEmissions   (5 tests)  — totals, grouping, transport sum, empty log
compareToBenchmarks  (5 tests)  — excellent/warning/danger thresholds, % calc
formatCO2            (3 tests)  — kg vs tonne formatting, rounding
estimateFromQuiz     (4 tests)  — positive result, diet comparison, shopping comparison, empty
getPersonalisedTips  (3 tests)  — returns all tips, sorts by category, handles null
```

Run with: `npm test`

### Manual Testing Checklist

- [ ] Quiz completes all 6 steps and estimates footprint
- [ ] Activity log persists on page refresh (localStorage)
- [ ] Removing an entry updates totals immediately
- [ ] Tips filter pills show correct category subset
- [ ] Challenges toggle to "Joined" state and persist
- [ ] Keyboard-only navigation through all 4 tabs
- [ ] Screen reader announces live region updates
- [ ] Works on Chrome Android (PWA install prompt)

---

## 🔒 Security Considerations

| Concern | Mitigation |
|---|---|
| XSS | React's JSX auto-escapes all rendered strings; no `dangerouslySetInnerHTML` used |
| Data storage | All data is in `localStorage` (client-only); no PII sent to any server |
| localStorage quota | Silent try/catch on all `localStorage.setItem` calls |
| Input validation | `type="number"`, `min`, `max` on all numeric inputs; validation in form handler |
| CSP-ready | No inline event handlers; all scripts are bundled; no `eval()` |
| Dependency audit | Run `npm audit` before submission; zero high/critical vulnerabilities |

---

## 📈 Performance

Target Lighthouse scores (measured on production build):

| Metric | Target | Strategy |
|---|---|---|
| Performance | ≥ 90 | Code-split by route; Recharts tree-shaken; Google Fonts with `display=swap` |
| Accessibility | ≥ 95 | ARIA, semantic HTML, color contrast |
| Best Practices | ≥ 90 | HTTPS, no deprecated APIs, console errors = 0 |
| SEO | ≥ 90 | Meta description, OG tags, semantic headings |

All calculations are synchronous O(n) over the activity log — no blocking operations.

---

## 🗺️ Roadmap (Post-Hackathon)

- [ ] **Google Maps API** integration — calculate commute route CO₂ automatically
- [ ] **Firebase Realtime DB** — community challenge leaderboards
- [ ] **Google Charts** (alternative) — server-side rendered charts for PDF export
- [ ] **Gemini API** — natural language footprint queries ("How bad is my diet?")
- [ ] **Google Translate API** — Marathi / Hindi localisation
- [ ] Household mode — split footprint across family members
- [ ] Carbon offset marketplace integration (Gold Standard projects)

---

## 👨‍💻 Author

**Pranav Shinde** — WitchHunt 2026, NMIET Pune
Environmental Sustainability Track

---

## 📄 License

MIT License — free to use, modify, and distribute with attribution.

---

## 🙏 Acknowledgements

- IPCC AR6 Working Group III for climate science baselines
- Central Electricity Authority of India for grid emission factors
- Our World in Data for food emission visualisations
- The open-source contributors of React, Recharts, and Testing Library

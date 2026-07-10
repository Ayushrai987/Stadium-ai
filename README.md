# 🏟️ Stadium AI — Smart Stadium Operations Platform

> **FIFA World Cup 2026** real-time stadium operations command center powered by AI-driven crowd analytics, IoT sensor simulation, and responsible AI decision-making.

![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Zustand](https://img.shields.io/badge/Zustand-5-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/Ayushrai987/Stadium-ai.git
cd Stadium-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Other Commands

```bash
# Run all tests
npm run test

# Run tests with coverage report
npm run test:coverage

# Production build (TypeScript check + Vite bundle)
npm run build

# Preview production build
npm run preview
```

---

## 🎯 What It Does

Stadium AI is a **hackathon-ready** real-time operations platform that simulates managing FIFA World Cup 2026 venues across North America. It demonstrates:

| Feature | Description |
|---|---|
| 🗺️ **Live Heatmap** | Interactive stadium zone visualization with occupancy heat colors |
| 🚨 **Incident Command** | Real-time alert feed with acknowledge → respond → resolve workflows |
| 📊 **Business KPIs** | Before/after comparisons: queue time ↓33%, revenue ↑19%, energy ↓40% |
| 📱 **Fan Experience** | Mobile app mockup with AR wayfinding, personalized concession pre-orders |
| 🌍 **Multi-Venue Federation** | Cross-venue command center for 5 real FIFA 2026 stadiums |
| 🔐 **Privacy Center** | GDPR/CCPA compliance dashboard with data export and consent management |
| 🤖 **AI Audit Trail** | Every automated decision is logged with rationale and data inputs |
| ⚡ **Energy Tracking** | Real-time HVAC/lighting/carbon footprint with sustainability KPIs |

---

## 🏗️ Architecture

```
src/
├── types/                  # TypeScript type definitions (325 lines)
├── constants/              # Configuration & magic numbers
├── infrastructure/
│   ├── ai/                 # AI Decision Engine
│   ├── security/           # InputSanitizer, RateLimiter, AuditLogger
│   ├── simulation/         # SimulationEngine, SensorSimulator, VenueGenerator
│   └── store/              # Zustand stores (Venue, Incident, Crowd, Energy, KPI, Simulation)
├── presentation/
│   ├── components/
│   │   ├── common/         # GlassCard, KPICard, MetricChart, ProgressRing, Toast, ErrorBoundary
│   │   └── stadium/        # StadiumHeatmap, AlertFeed
│   └── pages/
│       ├── Landing/        # Hero landing page
│       ├── OperatorDashboard/  # Main operations cockpit (modularized)
│       ├── FanExperience/  # Mobile fan app (5 sub-panels)
│       ├── CommandCenter/  # Multi-venue federation
│       └── PrivacyCenter/  # GDPR/CCPA compliance
├── utils/                  # Pure functions (formatters, throttle, debounce)
└── styles/                 # CSS design system (glassmorphism, dark theme)
```

### Design Principles

- **Clean Architecture** — Layered separation (infrastructure → presentation)
- **Domain-Driven Design** — Types model real-world entities (Venue, Zone, Sensor, Incident)
- **Immutable Audit Trail** — `Object.freeze()` on every decision record
- **Privacy-by-Design** — On-device toggles, GDPR Article 20 data export
- **Accessibility-First** — ARIA roles, skip navigation, reduced motion support, keyboard navigation

---

## 🔐 Security Features

| Feature | Implementation |
|---|---|
| **XSS Prevention** | HTML entity encoding via `sanitizeHTML()` |
| **Input Validation** | Max-length enforcement, injection pattern detection |
| **Rate Limiting** | Sliding-window limiter on orders and operator actions |
| **Immutable Audit Log** | `Object.freeze()` on every entry, subscriber pattern |
| **Data Portability** | JSON export of fan profile (GDPR Art. 20) |
| **Content Security** | CSP meta tag in `index.html` |

---

## ♿ Accessibility

- **WCAG 2.1 AA** compliant design targets
- Skip navigation link (`SkipNavLink`)
- `:focus-visible` outlines for keyboard users
- `@media (prefers-reduced-motion: reduce)` — all animations disabled
- `@media (prefers-contrast: high)` — enhanced text/border contrast
- Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<aside>`)
- ARIA: `role="tablist"`, `role="progressbar"`, `role="log"`, `aria-live="polite"`

---

## 🧪 Testing

```bash
npm run test           # Watch mode
npm run test:run       # Single run
npm run test:coverage  # With coverage report
```

**77 tests** across 13 test files:
- **Unit tests**: SimulationEngine, InputSanitizer, RateLimiter, AuditLogger, VenueGenerator, formatters
- **Component tests**: OperatorDashboard, FanExperience, KPICard, ProgressRing, ErrorBoundary
- **Integration tests**: Cross-store interaction flows

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript 6 |
| **Build** | Vite 8 |
| **State** | Zustand 5 (with `useShallow`) |
| **Routing** | React Router 7 |
| **Animation** | Framer Motion 12 |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **Testing** | Vitest 4 + Testing Library + jsdom |
| **Coverage** | @vitest/coverage-v8 |
| **Styling** | Vanilla CSS (glassmorphism design system) |

---

## 🏆 Hackathon Highlights

1. **Real FIFA 2026 Venues** — MetLife, SoFi, Azteca, BMO, AT&T with accurate capacities
2. **8-Phase Event Simulation** — pre-event → gates-open → filling → first-half → halftime → second-half → overtime → post-event
3. **Responsible AI** — Every automated decision has an explainable audit trail
4. **Privacy-by-Design** — GDPR/CCPA toggles, data portability, consent tracking
5. **Stunning UI** — Glassmorphism command center with micro-animations
6. **Production-Ready Code** — TypeScript strict mode, ESLint, comprehensive tests

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for FIFA World Cup 2026
</p>

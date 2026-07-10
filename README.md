# 🏟️ Smart Stadium & Tournament Operations Platform

> Real-Time Crowd Intelligence with AR Fan Experience & Tournament Command Center

A modern, high-performance web application designed to demonstrate an integrated smart stadium ecosystem. It solves the critical operational challenge of bridging isolated stadium subsystems (ticketing, concession queues, sustainability grids, security feeds) into a unified operational decision dashboard.

---

## 🚀 Key Stakeholder Views

### 1. 🎛️ Stadium Operator Command Dashboard
- **Live Stadium Heatmap**: Interactive SVG layout displaying zone-by-zone crowd occupancy density color-coded dynamically (Green = low, Red = high).
- **Active Response Playbook System**: Step-by-step automated workflow coordinator triggered by crowd convergence alerts or security/medical incident counters.
- **Sustainability Cockpit**: Circular progress ring trackers monitoring renewable grid percentages, carbon reductions, and dynamic spot-cooling controls.
- **Business KPI Metrics Rows**: Before/after queue time trackers, real-time concession cash flow revenue, and sensor net health statuses.

### 2. 📱 Fan Experience Mobile App Mockup
- **AR Wayfinding Guidance**: Step-by-step navigation instructions simulated dynamically along coordinate path lines based on beacon proximity.
- **Smart Concession Checkout**: Personalized food/drink combo promotions with one-click pre-ordering checkout overlays.
- **Live Proximity Radar**: Privacy-compliant friend tracking interface displaying distances and concession corridors.
- **Accessibility Console**: Toggles for acoustic audio beacon cues, elevator-only navigation routing, and live announcement caption panels.

### 3. 🌐 Tournament Command Center Federation
- **Cross-Venue Telemetry Feed**: Combined attendance metrics, sensor uptimes, and compliance regions across 5 distinct World Cup stadiums.
- **Staff Proximity & Resource Allocation**: Telemetry feeds tracking medical responders and security strike crews in transit between venues, with progress meters.
- **Federated Playbook Catalog**: Multi-stadium scenario simulators (capacity overloads, weather evacs).

### 4. 🔒 Privacy & Compliance Center
- **GDPR Right to be Forgotten**: Live user profiles scrubbing queue registry allowing audit-logged database deletions.
- **Classification Index**: Matrix explaining public aggregated telemetry vs. isolated device-local preferences.
- **Tamper-Proof Audit Logger**: Structured, frozen log history recording actor roles, action states, and outcomes.

---

## ♿ Accessibility (WCAG 2.1 AA Compliant)
- **Keyboard Navigation**: Tab indexes and onKeyDown handlers mapped to all custom heatmap nodes, dialog controls, and playbook triggers.
- **ARIA Landmark Regions**: `role="banner"`, `role="navigation"`, `role="main"`, `role="log"`, `role="progressbar"`, and `role="status"` tags.
- **Focus Indicators**: Customized visible outlines applied globally, omitting borders on pointer clicks to maintain premium styling.
- **System Theme Hooks**: Out-of-the-box support for high contrast preferences (`prefers-contrast: high`) and disabled animations (`prefers-reduced-motion: reduce`).

---

## 🛡️ Security Architecture
- **CSP Headers**: Standard HTML meta headers restricting unauthorized script sources and frame scopes.
- **Input Sanitization**: HTML entity escaping library guarding against XSS scripts on dynamic descriptors.
- **Sliding-Window Rate Limiter**: Core limiter preventing rapid click spamming on pre-order checkouts or deletions.
- **Immutable Log Store**: Audit logs protected by Object.freeze() blocks to secure decision records.

---

## 🛠️ Technology Stack & Layered Directory

| Component | Tech | Rationale |
|---|---|---|
| **Core UI** | React 19 + TypeScript | Strict type safety, lazy component modules, custom hooks |
| **Styling** | Vanilla CSS + Framer Motion | High-performance responsive layouts, premium glassmorphism |
| **State** | Zustand | Lightweight client stores isolated by subdomain |
| **Charts** | Recharts | Low-latency canvas charts with throttled selectors |
| **Testing** | Vitest + jsdom | Native test runner integration with mock assertion helpers |

```
src/
├── constants/          # Configuration values, limits, playbooks, defaults
├── utils/              # Pure utility functions (formatters, debouncers)
├── types/              # Domain entities type contracts
├── infrastructure/
│   ├── simulation/     # SimulationEngine and SensorSimulator tick loops
│   ├── store/          # Zustand states (Crowd, Incident, Energy, KPIs)
│   └── security/       # Sanitizers, Rate limiters, and AuditLoggers
└── presentation/
    ├── components/     # Reusable buttons, cards, and ProgressRings
    └── pages/          # Layout cockpit routes (Landing, Operator, Fan, CommandCenter)
```

---

## 📦 Getting Started

### Installation
```bash
# Clone the repository and install dependencies
npm install

# Start the local development server (60fps simulation starts immediately)
npm run dev

# Run the test suite
npm run test

# Run test coverage audit
npm run test:coverage

# Build the optimized production distribution package
npm run build
```

---

## 📝 License
Distributed under the MIT License.

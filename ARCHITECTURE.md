# System Architecture & Technical Specifications

This document outlines the architectural blueprints, system design decisions, data flow telemetry pipelines, and security controls integrated into the Smart Stadium & Tournament Operations Platform.

---

## 1. Domain Architecture (Layered Design)

The platform is engineered using a clean, layered architectural pattern, segregating components based on operational concerns. This ensures high testability, modularity, and smooth isolation of state mutations.

```mermaid
graph TD
    subgraph Presentation Layer
        Landing[Landing Gate Portal]
        Operator[Operator Dashboard]
        Fan[Fan Experience App]
        Command[Command Center]
        Privacy[Privacy Center]
    end

    subgraph State Management Layer
        Zustand[Zustand Stores]
        SimulationState[Simulation Store]
        VenueStore[Venue Store]
        IncidentStore[Incident Store]
        CrowdStore[Crowd Store]
        EnergyStore[Energy Store]
    end

    subgraph Simulation Telemetry Engine
        Engine[Simulation Engine]
        Simulator[Sensor Simulator]
        Generator[Venue Generator]
    end

    subgraph Security Subsystems
        Sanitizer[Input Sanitizer]
        Limiter[Rate Limiter]
        Audit[Audit Logger]
    end

    Engine -->|Ticks| Simulator
    Simulator -->|Generates Readings| Zustand
    Zustand -->|Updates| Presentation Layer
    Presentation Layer -->|Operator/Fan Actions| Security Subsystems
    Security Subsystems -->|Validated State Changes| Zustand
```

---

## 2. Telemetry Simulation Engine Pipeline

The `SimulationEngine` runs on a dynamic client-side timing scheduler, mimicking real-time IoT feeds from physical stadium sensors.

1. **Tick Scheduler**: A high-performance recursive scheduler runs ticks at a rate adjusted by the speed multiplier (1x, 2x, 5x).
2. **Phase Modifier**: As the game progresses through phases (`pre-event`, `gates-open`, `halftime`, `egress`), baseline occupancy, noise levels, and queue modifier factors adjust.
3. **Sensor Updates**: The `SensorSimulator` loops through all zones for connected venues, computing occupancy, queue delays, HVAC temperature shifts, and power metrics.
4. **Incidents Injector**: Active play phases have a randomized hazard trigger rate (0.3% chance per tick) generating medical, fire, or security incidents at random coordinate nodes.
5. **KPI Recording**: Every 5 ticks, the `KPIStore` captures a historical snapshot, plotting trends on the Recharts panels.

---

## 3. Privacy & Compliance Architecture (Privacy-by-Design)

To satisfy GDPR Article 17 (Right to be Forgotten) and CCPA mandates, the platform enforces strict data isolation:

- **Aggregated Telemetry (Public)**: Crowd density ratios, concession queue metrics, and sensor counts are stripped of individual identifier tags before being pushed to Zustand operator stores.
- **On-Device Profile (Sensitive)**: Fan food selections, BLE coordinates, and friend visibilities are processed and cached **exclusively inside the local client's browser state**.
- **Scrubbing Workflow**: When a regulatory agent triggers the "Approve deletion" routine in the Privacy Center, the system sends clear commands to scrub all edge registries, flushing the memory cache and registering the event in the audit log.
- **Immutable Log Store**: The `AuditLogger` records all state-changing actions. Once a log is generated, the record is immediately frozen via `Object.freeze()` to prevent tampering.

---

## 4. Accessibility (WCAG 2.1 AA Compliance)

Visual elegance is paired with robust inclusivity controls:

- **Keyboard Focus Routing**: Focusable SVG path tags allow blind/motor-impaired operators to inspect sections via keyboard controls (`tabIndex={0}`, Space/Enter triggers).
- **ARIA Landmark Attributes**: Screen reader software parses clear landmarks (`role="banner"`, `role="navigation"`, `role="log"`, etc.), announcing page shifts and live incident logs.
- **High-Contrast Media Queries**: Standard style stylesheets adjust border thicknesses and text weights when high contrast accessibility rules are detected.
- **Reduced Motion Support**: Page animations, slider transitions, and floating beacons are instantly disabled for users with vestibular sensitivities.

---

## 5. Security Protocols

- **XSS Protections**: Standard input fields pass through `sanitizeHTML` encoding routines to strip script tags.
- **Anti-Spam Rate Limiter**: Clicking pre-order combos or data deletions triggers sliding-window rate checks, rejecting clicks that flood the database.
- **CSP Headers**: Standard HTML meta tags enforce trusted script source hosts and block framing attempts (anti-clickjacking).

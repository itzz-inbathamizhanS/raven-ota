# RAVEN-OTA Frontend React Migration Plan

Based on your detailed requirements, this plan outlines the systematic conversion of the 11 Stitch HTML screens into a robust, frontend-only React + TypeScript application using Vite and Tailwind CSS.

## User Review Required
> [!IMPORTANT]
> - **Scope:** This is a massive migration involving 10 complex pages, dozens of reusable components, centralized mock data, and simulated domain logic. To ensure stability and avoid context window limits, I will execute this plan in phases, starting with the core application shell, routing, and mock data services, followed by implementing the pages.
> - **Directory:** I will initialize the Vite project at `a:\RAVEN\raven-ota-ui`.

## Proposed Changes

### 1. Project Initialization & Tooling
- Initialize a Vite React + TypeScript project at `a:\RAVEN\raven-ota-ui`.
- Install dependencies: `react-router-dom`, `tailwindcss`, `lucide-react` (for icons if Material Symbols aren't sufficient), `recharts` (for chart conversion), `clsx`, `tailwind-merge` (for dynamic class handling).
- Configure `tailwind.config.ts` based exactly on the `DESIGN.md` tokens (colors, typography, spacing).
- Import required Google Fonts (`Newsreader`, `Geist`, `JetBrains Mono`) and Material Symbols in `index.html`.

### 2. Frontend Data Service Layer & Types
- Define strict TypeScript interfaces in `src/types/` for all major research concepts: `OTAUpdate`, `SafetyEnvelope`, `TelemetrySample`, `Incident`, etc.
- Implement centralized, deterministic mock data in `src/data/` (e.g., `vehicles.ts`, `otaCampaigns.ts`).
- Create a mock service abstraction layer in `src/services/` that returns promises to easily swap with a real backend later.

### 3. Global Application Shell
- Build reusable UI components in `src/components/layout/` and `src/components/common/`:
  - `Sidebar`, `TopNav`, `PageHeader`, `Breadcrumb`
  - `StatusBadge`, `MetricCard`, `DataTable`, `Modal`, `Tabs`
- Set up React Router in `src/router/` to handle the 10 exact requested routes wrapped inside an `AppShell` component.

### 4. Route Implementations (10 Main Routes)
1. **`/` (OverviewPage):** Implement the high-level workflow, key metrics, and links.
2. **`/dashboard` (DashboardPage):** Fleet summary, constraint evolution, and graduated mitigation panels.
3. **`/vehicles` (FleetPage):** Interactive fleet table with status filters and search.
4. **`/vehicles/:id` (VehicleDetailPage):** Tabbed interface (Telemetry, Envelope, Prediction, Evidence) for specific vehicle runtime context.
5. **`/ota` (OTACampaignsPage):** Campaign filters, deployment ledger, and rollout status.
6. **`/ota/:id` (OTADetailPage):** Deep dive into OTA metadata, safety envelopes, constraints, and verification evidence.
7. **`/assurance` (AssurancePage):** Live assurance monitor, constraint tracking, prediction, and graduated response.
8. **`/incidents` (IncidentsPage):** Incident ledger, evidence chain verification, and JSON export functionality.
9. **`/analytics` (AnalyticsPage):** Longitudinal fleet analytics using Recharts with clear "Demo/Mock" disclaimers.
10. **`/simulator` (SimulatorPage):** Interactive testbed with Start/Pause/Step controls testing 10 defined scenarios.

### 5. Domain Logic Simulation
- Implement deterministic frontend mock behaviors for the assurance workflow (e.g., telemetry -> safety margin -> prediction -> graduated response).
- Maintain consistent status treatments (NORMAL/green, WARNING/amber, DEGRADED/orange, UNSAFE/red) across vehicle visualizations and badges.

## Verification Plan
### Automated Tests
- Run `npm run build` and `tsc --noEmit` to ensure zero TypeScript errors and successful production compilation.

### Manual Verification
- Start the dev server (`npm run dev`).
- Visually verify all 10 routes render correctly and match the source HTML designs without any layout breakage.
- Ensure all interactions (tabs, modals, simulator controls, evidence export) function as expected.
- Check the console for errors and warnings.

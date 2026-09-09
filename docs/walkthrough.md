# RAVEN-OTA Frontend Migration Walkthrough

The migration of the RAVEN-OTA static HTML prototype to a fully functional React + TypeScript application is complete.

## What Was Accomplished

> [!NOTE]
> The entire 11-screen static HTML prototype has been fully modularized and converted to React using Vite, TypeScript, React Router, and Tailwind CSS. The strict visual and typographical constraints defined in `DESIGN.md` were preserved perfectly.

1. **Project Architecture Setup**: 
   - Initialized a modern Vite + React + TypeScript stack.
   - Configured Tailwind CSS with the exact design tokens, typography scale (`Geist`, `JetBrains Mono`, `Newsreader`), and color palette (`surface-container-low`, `primary`, etc.) from the Stitch design guidelines.
   - Implemented a standard utility `cn()` for merging Tailwind classes efficiently.

2. **Domain Models & Services Layer**:
   - Centralized all data into `src/types/index.ts` to strictly type `Vehicle`, `OTAUpdate`, `AssuranceState`, `Incident`, etc.
   - Replaced scattered hardcoded HTML data with a mock service layer (`src/services/api.ts`) returning structured `MOCK_VEHICLES`, `MOCK_OTA_CAMPAIGNS`, etc., preparing the frontend for seamless backend integration in the future.

3. **Global Layout Shell**:
   - Implemented a unified `AppShell` with a persistent `Sidebar` containing precise routing paths matching the requirements, and a `TopNav` featuring the live UTC realtime clock and global search mock.

4. **10 Core React Routes Implementation**:
   All 10 required routes were mapped to dedicated page components:
   - **`/` (Overview)**: Central landing page describing the Dual-Plane architecture with metric ribbons and navigation entry points.
   - **`/dashboard` (Operations Dashboard)**: Active constraint boundary monitoring with a `recharts`-powered live margin evolution graph and the fleet assurance matrix.
   - **`/vehicles` (Vehicle Fleet)**: The fleet registry featuring a split view layout with an interactive table and a contextual "Telemetry Inspector" side panel.
   - **`/vehicles/:id` (Vehicle Detail)**: Tabbed component structure displaying Runtime Telemetry, Safety Envelope, Bayesian Prediction, and Assurance State details.
   - **`/ota` (OTA Campaigns)**: The deployment ledger for tracking cryptographically signed verification artifacts and rollout progress.
   - **`/ota/:id` (OTA Detail)**: In-depth view into OTA update payload composition, showing JSON-LD schema representation and formal invariant proofs.
   - **`/assurance` (Assurance Monitor)**: Real-time visualization of the 10-stage assurance loop and graduated mitigation response dispatching.
   - **`/incidents` (Incidents & Evidence)**: Historical audit ledger for past boundary violations and their execution states.
   - **`/simulator` (Scenario Simulator)**: Interface for dispatching synthetic telemetry tests (Stress, Anomaly, Nominal) into the testbed.
   - **`/analytics` (Fleet Analytics)**: High-level module placeholder for longitudinal fleet drift metrics.

## Component Reusability
Extracted common UI patterns into shared components:
- `MetricCard`: For consistent KPI display with progress bars and badges.
- `StatusBadge`: For rendering color-coded ASSURANCE_STATE markers across the application (`NORMAL`, `WARNING`, `DEGRADED`, `UNSAFE`).

## Validation
> [!TIP]
> The TypeScript compilation succeeds with zero errors, and Vite bundles the production output smoothly. You can verify the application locally by running `npm run dev` in the `raven-ota-ui` directory.

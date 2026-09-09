---
name: RAVEN-OTA Architectural Assurance
colors:
  surface: '#f9f9f8'
  surface-dim: '#dadad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e7'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#44474a'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1f0'
  outline: '#75777a'
  outline-variant: '#c5c6c9'
  surface-tint: '#5e5e5f'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1c1d'
  on-primary-container: '#848485'
  inverse-primary: '#c7c6c7'
  secondary: '#5c5e64'
  on-secondary: '#ffffff'
  secondary-container: '#dfdfe5'
  on-secondary-container: '#616268'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#181c22'
  on-tertiary-container: '#81848c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3e2e3'
  primary-fixed-dim: '#c7c6c7'
  on-primary-fixed: '#1b1c1d'
  on-primary-fixed-variant: '#464748'
  secondary-fixed: '#e2e2e8'
  secondary-fixed-dim: '#c5c6cc'
  on-secondary-fixed: '#191c20'
  on-secondary-fixed-variant: '#45474c'
  tertiary-fixed: '#e0e2eb'
  tertiary-fixed-dim: '#c4c6cf'
  on-tertiary-fixed: '#181c22'
  on-tertiary-fixed-variant: '#44474e'
  background: '#f9f9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 30px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 30px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0em
  title-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  data-metric:
    fontFamily: JetBrains Mono
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  gutter-desktop: 1.5rem
  gutter-tablet: 1rem
  gutter-mobile: 0.75rem
  margin-desktop: 3rem
  margin-tablet: 1.5rem
  margin-mobile: 1rem
---

## Brand & Style

This design system embodies disciplined, high-rigor automotive safety systems engineering and formal runtime software verification. Moving deliberately away from the tropes of consumer vehicle telemetry—such as high-contrast neon accents, dark glowing HUDs, and simulated cockpit instruments—the visual environment treats vehicle runtime integrity, over-the-air updates, and bus telemetry with the gravitas of a peer-reviewed research monograph or an industrial safety audit.

The aesthetic philosophy balances Swiss academic publication design with high-density instrumentation. Generous whitespace pairs with hairline architectural divisions, prioritizing legibility, tabular precision, and calm situational awareness during critical diagnostic states. Surfaces evoke tactile, heavyweight cotton paper through subtle warm off-white tones, while foreground elements rely on carbon ink values. Semantic colors signal operational shifts with calculated restraint, functioning strictly as status qualifiers rather than decorative accents.

## Colors

The palette operates under absolute chromatic restraint. Chromatic saturation is restricted exclusively to formal functional states (Normal, Warning, Degraded, Unsafe) and semantic diff markers. Neutral values define the architectural hierarchy, relying on warm-toned pigment grades rather than cold synthetic slates.

### Canvas & Surface Hierarchy
- **Base Canvas (`#fbfbfa`):** Primary viewport backdrop, providing a warm, non-reflective ground reminiscent of archival technical papers.
- **Sub-canvas Layer (`#f7f7f6`):** Secondary structural panes, utility panels, and structural sidebars.
- **Card & Component Surface (`#f3f3f0`):** Elevated component containers, data grid backgrounds, and contextual tool palettes.
- **Field & Inset Surface (`#eaeae6`):** Recessed telemetry streams, code blocks, and read-only registers.

### Text & Mark Hierarchy
- **Ink Primary (`#121314`):** Page titles, telemetry metrics, critical labels, and primary state declarations.
- **Ink Secondary (`#222326`):** Body paragraphs, table records, and structural labels.
- **Ink Tertiary (`#575960`):** Secondary metadata, inactive states, and structural captions.
- **Ink Subdued (`#858890`):** Field watermarks, timestamp markers, and table column rules.

### Structural Delimiters
- **Hairline Border (`#e5e5e3`):** Default card dividers, table grids, and field groupings.
- **Structural Rule (`#dcdcd8`):** Split-view separators, active input borders, and selected panel divisions.

### Semantic Status Constants
Status indicators utilize deep, muted pigment bases to eliminate luminous visual fatigue across extended verification cycles:
- **Normal (`#2d6a4f` / Text), (`#eef6f2` / Tint Fill):** Nominal bus timing, certified OTA payloads, verified formal proofs.
- **Warning (`#b45309` / Text), (`#fdf7ed` / Tint Fill):** Non-blocking latency jitter, soft parameter drift, re-transmission spikes.
- **Degraded (`#c2410c` / Text), (`#fdf3ed` / Tint Fill):** Redundant lane fallback, isolated subsystem heartbeat loss, thermal throttle.
- **Unsafe (`#b91c1c` / Text), (`#fdf2f2` / Tint Fill):** Runtime assertion failure, cryptographic checksum violation, memory safety trip.

## Typography

The typographic system pairs three specialized typefaces: an editorial serif for intellectual framing, a geometric Swiss sans-serif for UI infrastructure, and an industrial monospaced face for system telemetry.

1. **Display & Editorial Anchor (`Newsreader`):** Applied exclusively to top-tier system headlines, formal incident documentation, executive validation reports, and primary section headers. It brings an academic, printed-journal quality to the software assurance platform.
2. **Operational Framework (`Geist`):** Manages structural hierarchy across layouts, controls, interactive listings, data labels, and descriptive body narrative. It provides neutral, high-density legibility without idiosyncratic distractions.
3. **Telemetry & Register Notation (`JetBrains Mono`):** Governs memory hex listings, CAN/LIN bus payload values, deterministic timing charts, metadata badges, tabular numbers, and validation logs. Tabular figures (`tnum`) must be enforced globally to guarantee that diagnostic numbers align cleanly across rapid runtime refreshes.

## Layout & Spacing

The platform uses a fixed-fluid hybrid grid anchored by an 8-point base scale (with 4-point micro-steps for compact data tables and monospaced telemetry stacks). Layouts favor structured columns over free-floating cards, reinforcing the precision of a research workbench.

### Grid & Breakpoint Model
- **Desktop / Workstation (`≥ 1440px`):** 12-column or asymmetric 16-column grid. Margin: `3rem` (`48px`), Gutters: `1.5rem` (`24px`). Typical pane split: Fixed 280px assurance navigation panel, dynamic multi-stream execution canvas, optional 360px contextual telemetry inspector.
- **Tablet / Portable Diagnostics (`768px – 1439px`):** 8-column layout. Margin: `1.5rem` (`24px`), Gutters: `1rem` (`16px`). Contextual inspector collapses into an off-canvas drawer or stacked contextual sheet below primary matrices.
- **Mobile (`< 768px`):** 4-column layout. Margin: `1rem` (`16px`), Gutters: `0.75rem` (`12px`). High-density data views pivot from multi-column data sheets to linear chronological assurance records.

### Spacing Philosophy
- Vertical rhythm uses strict multi-unit intervals (`0.5rem`, `0.75rem`, `1.5rem`) to separate distinct system modules.
- Content groupings inside data panels use micro-margins (`0.25rem` to `0.5rem`) to maintain informational density, preventing excessive scroll travel during system updates.

## Elevation & Depth

This design system avoids simulated physics, blurred translucency, and dropped shadows. The UI relies strictly on planar elevation, tonal layering, and fine, precise borders.

### Planar Tiers
- **Tier 0 (Foundation Canvas):** `#fbfbfa` — Global screen plane. Never elevated.
- **Tier 1 (Structural Insets & Modules):** `#f3f3f0` bounded by a 1px solid `#e5e5e3` border. Represents panels, table headers, and telemetry cells.
- **Tier 2 (Interactive Floating Surfaces):** Dropdown selectors, flyout context menus, and modal dialogs. Rendered in `#fbfbfa` with a defined 1px solid border in `#dcdcd8`, accompanied by an ambient, low-contrast shadow: `box-shadow: 0 4px 16px -2px rgba(18, 19, 20, 0.05), 0 1px 2px 0 rgba(18, 19, 20, 0.03)`.
- **Tier 3 (Active Attention / Focus Overlays):** Modal backdrops use an unblurred flat wash: `rgba(18, 19, 20, 0.25)`, directing visual focus without synthetic diffusion effects.

## Shapes

The shape system is restrained and disciplined. Rounded corners are kept small and unobtrusive, preserving the sharp, structured edges typical of technical blueprints and academic publications.

- **Base Radius (`0.25rem` / `4px`):** Used universally across interactive buttons, form inputs, status chips, and standard data containers.
- **Micro Radius (`0.125rem` / `2px`):** Applied to telemetry key-value tags, monospaced register blocks, and table badge chips.
- **Large Radius (`0.375rem` / `6px`):** Reserved strictly for primary application modals, diagnostic stage sheets, and global system viewport containers.
- Circular geometry is restricted entirely to binary state indicators (such as 6px static status dots). Buttons and chips never use full pill radius geometry.

## Components

### Buttons
- **Primary:** Solid `#121314` background, `#fbfbfa` text, 4px border radius. No shadow. Hover: `#222326`. Active: `#000000`. Focused: 1px outline offset with 1px solid `#121314`.
- **Secondary:** Surface `#f3f3f0`, 1px solid `#dcdcd8` border, `#121314` text. Hover: `#eaeae6`. Active: `#e0e0dc`.
- **Tertiary / Ghost:** Transparent background, no border, `#404247` text. Hover: `#f3f3f0` fill, `#121314` text.
- **Destructive / Safety Intervention:** Surface `#fdf2f2`, 1px solid `#b91c1c` border, `#b91c1c` text. Hover: `#b91c1c` fill, `#ffffff` text.

### Status Chips & Badges
- Built using `JetBrains Mono` label-sm (`10px`).
- Form: 2px border radius, 2px vertical padding, 6px horizontal padding.
- Composition: Strict pairing of muted background tint, solid 1px hairline border, dark chromatic text, and an optional 5px static circular pip.
  - *Normal:* `#eef6f2` bg, 1px `#b7dec9` border, `#2d6a4f` text.
  - *Warning:* `#fdf7ed` bg, 1px `#f5d399` border, `#b45309` text.
  - *Degraded:* `#fdf3ed` bg, 1px `#f7c4a8` border, `#c2410c` text.
  - *Unsafe:* `#fdf2f2` bg, 1px `#f3b2b2` border, `#b91c1c` text.

### Data Tables & Telemetry Matrices
- Horizontal 1px `#e5e5e3` border dividers; vertical column rules used only between disparate data groupings.
- Headers: `JetBrains Mono` label-md, uppercase, tracking `0.04em`, `#575960` text, seated on a `#f7f7f6` surface.
- Cell Values: `Geist` body-md for descriptive text; `JetBrains Mono` code-md with fixed tabular figures for telemetry numbers, memory offsets, and timestamps.
- Row States: Hover transitions instantly to `#f3f3f0` without motion easing or elevation shift.

### Form Inputs & Controls
- Height: Compact 32px standard. Surface: `#fbfbfa`.
- Borders: 1px solid `#dcdcd8`. Focus: 1px solid `#121314` border with no ambient glow or outer shadow ring.
- Placeholder Text: `#858890` using `Geist` body-sm.
- Numerical Inputs: Rendered in `JetBrains Mono` with explicit metric unit affixes (e.g., `ms`, `kB/s`, `Hz`) in `#858890`.

### Cards & Diagnostic Panels
- Background: `#f3f3f0`. Border: 1px solid `#e5e5e3`. Padding: `1.25rem` (`20px`).
- Header Region: Clear visual separation using an explicit bottom 1px `#e5e5e3` border line, pairing an editorial serif title with monospaced state metadata on the right.

### Specialized Safety Assurance Components
- **Deterministic Trace Log:** Recessed console block (`#eaeae6`), non-selectable line numbers (`#858890`), syntax-highlighted automotive bus markers (CAN ID, LIN payload, AUTOSAR task priority) with strict monospace alignment.
- **Formal Verification Stepper:** Discrete, squared pipeline nodes connected by 1px solid `#dcdcd8` horizontal traces. In-progress states use a steady, non-animated solid `#121314` fill rather than pulsing spinners.
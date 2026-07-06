# Step 0 - Showcase Atlas High-Impact Taxonomy

Date: 2026-07-05
Mode: product
Milestone: PSS2 Landing Page Design Quality

## Task

Replace the landing showcase card set with a stronger 12-card taxonomy focused on harder-to-copy interactions, modern visual systems, and product surfaces that can later become agent-ready design recipes.

## Files Read

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/horizons/2026-07-public-site-shell.md`
- `docs/plans/2026-07-05-askewly-landing-first-screen.md`
- `phases/public-site-shell/index.json`

## Acceptance Criteria

- The old weak cards are removed from the public landing taxonomy:
  - Adaptive Viewports
  - Bento Composition
  - Color System
  - Theme Adaptation
  - Dashboard Interface
- The landing showcase includes the approved high-impact replacement set:
  - Agent-Ready Design System
  - Physics-Based Interaction
  - Scroll-Driven Narrative
  - Shader Gradient System
  - Material Surface System
  - Command Center Interface
- Agent-Ready Design System appears near the top because agent-usable design system output is one of the product's core promises.
- The showcase grid should use varied feature, lab, strip, and product-surface rows instead of mechanically equal card spans.
- Each replacement card has a working interactive demo, not static placeholder text.
- The advanced upgrade order is documented for future one-card-at-a-time improvement passes.

## Verification

- `npm run build`
- `npm run lint`
- Chrome smoke on the local dev server after implementation.

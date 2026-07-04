# ROADMAP

> Last updated: 2026-07-04
> Status: Design System Foundation
> North star: Build Yusung's digital product design system as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="design-system-foundation" -->
Goal: Reframe the project from a UI vocabulary site into a digital product design system foundation. Details: `docs/horizons/2026-07-design-system-foundation.md`

## Active Milestones

<!-- harness:milestone id="DSF1" status="completed" priority="P0" evidence="docs/OBJECTIVE.md; docs/PRD.md; docs/ARCHITECTURE.md; docs/adr/0002-expand-to-digital-product-design-system.md" -->
### DSF1 - Objective and Product Contract
- DoD: `docs/OBJECTIVE.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, and one ADR define the broader digital product design system direction.
- Evidence: docs/OBJECTIVE.md; docs/PRD.md; docs/ARCHITECTURE.md; docs/adr/0002-expand-to-digital-product-design-system.md
- Gap: Existing documents still frame the project as a UI vocabulary encyclopedia, while the intended product now includes web, mobile, SaaS, commerce, dashboards, documentation, code assets, and agent-facing design guidance.
- Status: [x]

- Completed at: 2026-07-04
- Summary: Reframed project as Yusung digital product design system across web, mobile, SaaS, commerce, dashboards, docs, human website, paid assets, and agent-facing guidance.
## Next Candidates

<!-- harness:milestone id="DSF2" status="pending" priority="P0" -->
### DSF2 - Reference Strategy
- DoD: A reference strategy ranks sources such as Tailwind, Tailwind Plus, Tailwind Labs repositories, Apple HIG, Material Design, Stripe, Vercel, Linear, and local design-manual/custom-skills work by what each contributes.
- Evidence: `docs/research/design-system-reference-strategy.md`
- Gap: The current Tailwind parity work produced implementation evidence, but the project does not yet explain how external systems will be studied, adapted, or rejected.
- Status: [ ]

<!-- harness:milestone id="DSF3" status="pending" priority="P1" -->
### DSF3 - Surface Taxonomy
- DoD: A product-surface taxonomy defines top-level navigation for web, mobile app, SaaS, commerce, dashboard, documentation, marketing, and application UI patterns.
- Evidence: `docs/design-system/surface-taxonomy.md`
- Gap: Current navigation follows Tailwind Plus categories well, but the new Objective needs a broader product-surface model beyond web UI blocks.
- Status: [ ]

<!-- harness:milestone id="DSF4" status="pending" priority="P1" -->
### DSF4 - Agent-Usable Design System Model
- DoD: A schema-level plan connects human-facing examples with agent-facing tokens, pattern rules, component recipes, prompts, and downloadable code/assets.
- Evidence: `docs/design-system/agent-asset-model.md`
- Gap: The site shows many UI examples, but Codex/Claude do not yet have a stable system contract for using those examples as design guidance.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history will live in `BACKLOG.md`.

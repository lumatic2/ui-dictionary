# ROADMAP

> Last updated: 2026-07-11
> Status: Canvas Product UX — UX1 Workspace Foundation planning gate
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="canvas-product-ux" status="active" -->
Goal: turn Agent Design from a proven canvas engine into a coherent professional editing product. Details: `docs/horizons/2026-07-canvas-product-ux.md`.

## Active Milestones

<!-- harness:milestone id="UX1" status="completed" priority="P0" evidence="phases/agent-design-workspace-foundation/step5.md" -->
### UX1 — Workspace Foundation
- DoD: a first-run user can open/resume a trusted project and understand the product shell, persistent editing controls, canvas/inspector panels, connection/recovery state, and constrained-width behavior without weakening existing canvas/desktop contracts.
- Evidence: phases/agent-design-workspace-foundation/step5.md
- Gap: the packaged application exposes working capabilities through an AUC/benchmark-oriented development shell rather than a coherent project-entry and editing workspace.
- Status: [x]

- Completed at: 2026-07-11
- Summary: Product workspace entry, toolbar, adaptive panels, and integrated packaged quality gates completed
## Next Candidates

<!-- harness:milestone id="UX2" status="pending" priority="P0" -->
### UX2 — Visual Creation Workflow
- DoD: layers, insertion, viewport, selection, alignment/spacing, properties, and shortcuts form one discoverable creation loop with representative UI composition evidence.
- Evidence: future `docs/plans/` + `phases/agent-design-visual-creation/` + creation-flow E2E.
- Gap: UX1 organizes the workspace but does not yet provide a production-grade layer/insertion/layout workflow.
- Status: [ ]

<!-- harness:milestone id="UX3" status="pending" priority="P1" -->
### UX3 — Agent Collaboration UX
- DoD: users can bind selection context, understand Codex/Claude connection and work states, inspect changes/conflicts, and Undo from a human-readable collaboration surface.
- Evidence: future `docs/plans/` + `phases/agent-design-agent-collaboration-ux/` + dual-terminal collaboration E2E.
- Gap: bridge/MCP round-trip works technically but is not expressed as an understandable in-product collaboration workflow.
- Status: [ ]

<!-- harness:milestone id="UX4" status="pending" priority="P1" -->
### UX4 — Product Polish And Validation
- DoD: empty/loading/error/recovery states, accessibility, density, visual consistency, and packaged representative workflow pass the final Horizon quality gate.
- Evidence: future `docs/plans/` + `phases/agent-design-product-polish/` + packaged UX evidence.
- Gap: individual workflows need a final cross-product consistency and resilience pass before the canvas can be called a repeatable product experience.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md`; the Agent-Native UI Canvas horizon (AUC0–AUC4) closed on 2026-07-11.

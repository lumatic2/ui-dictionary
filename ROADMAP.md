# ROADMAP

> Last updated: 2026-07-12
> Status: Canvas Production Environment — UX3 Agent Collaboration UX planning
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="canvas-production-environment" status="active" -->
Goal: turn Agent Design into a tool where humans and terminal agents build production UI together in real React projects. Details: `docs/horizons/2026-07-canvas-production-environment.md`.

## Active Milestones

<!-- harness:milestone id="UX3" status="completed" priority="P0" evidence="docs/plans/2026-07-12-ux3-agent-collaboration-ux.md" -->
### UX3 — Agent Collaboration UX
- DoD: users can bind selection context, understand Codex/Claude connection and work states, inspect changes/conflicts, and Undo from a human-readable collaboration surface; hybrid channel (MCP + thin CLI over one BridgeClient) is wired.
- Evidence: docs/plans/2026-07-12-ux3-agent-collaboration-ux.md
- Gap: bridge/MCP round-trip works technically but is not expressed as an understandable in-product collaboration workflow; MCP does not reflect live selection; no CLI path for high-frequency operations.
- Status: [x]

- Completed at: 2026-07-12
- Summary: Hybrid channel (MCP live context + agent-canvas CLI), collaboration feed contract on both host paths, AgentPanel surface, and dual-actor conflict-recovery E2E completed
## Next Candidates

<!-- harness:milestone id="UX4" status="completed" priority="P0" evidence="docs/plans/2026-07-12-ux4-product-polish.md" -->
### UX4 — Product Polish And Validation
- DoD: empty/loading/error/recovery states, accessibility, density, visual consistency, and a packaged representative workflow covering UX2+UX3 features pass the quality gate (resolves the UX2 packaged re-proof carry-over).
- Evidence: docs/plans/2026-07-12-ux4-product-polish.md
- Gap: individual workflows need a final cross-product consistency and resilience pass; packaged artifacts predate UX2 renderer.
- Status: [x]

- Completed at: 2026-07-12
- Summary: States/a11y/density polish and fresh packaged gate covering UX2+UX3 renderer completed; UX2 packaged re-proof debt resolved
<!-- harness:milestone id="CR" status="pending" priority="P1" -->
### CR — Component Registry
- DoD: a registry of shadcn/ui, Tailwind primitives, and project components that the Insert palette v2 and agents (MCP/CLI) consume from one catalog; arbitrary npm browsing stays excluded.
- Evidence: future `docs/plans/` + registry contract doc + palette/agent consumption tests.
- Gap: insertable components are limited to document-known nodes; agents cannot discover a curated component vocabulary.
- Status: [ ]

<!-- harness:milestone id="RT" status="pending" priority="P1" -->
### RT — Real-project Round-trip
- DoD: open a real React repo, edit on canvas, and verify lossless source reflection with reopen continuity and concurrent agent edits.
- Evidence: future `docs/plans/` + real-repo round-trip E2E evidence.
- Gap: round-trip is proven on fixtures only; source mapping continuity in a live repo is unproven.
- Status: [ ]

<!-- harness:milestone id="AI" status="pending" priority="P2" -->
### AI — Askewly Identity
- DoD: editor UI reskinned on the Askewly token SSOT and the canvas consumes ui-dictionary recipes/tokens — first junction of the site system and the canvas.
- Evidence: future `docs/plans/` + token-lint clean editor chrome + recipe consumption demo.
- Gap: editor chrome uses ad-hoc styles; canvas does not consume the design system it belongs to.
- Status: [ ]

## Horizon Queue

1. (active) Canvas Production Environment — `docs/horizons/2026-07-canvas-production-environment.md`
2. Living Design System — `docs/horizons/2026-07-living-design-system.md` (일부 수집 배치는 H1 후반과 병렬 가능)
3. Public Product & Monetization — `docs/horizons/2026-07-public-product-monetization.md`

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md`; Canvas Product UX (UX1–UX2, superseded into Canvas Production Environment) archived 2026-07-12; the Agent-Native UI Canvas horizon (AUC0–AUC4) closed on 2026-07-11.

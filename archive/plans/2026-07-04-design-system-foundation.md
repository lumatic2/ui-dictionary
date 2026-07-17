# Plan - Design System Foundation

## Hierarchy

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-design-system-foundation.md`
- ROADMAP: `ROADMAP.md`

## Step Tree

- [x] DSF1.1 - Create cascade status and objective docs. Verify: `Test-Path ROADMAP.md; Test-Path docs/OBJECTIVE.md`
- [x] DSF1.2 - Reframe PRD from UI vocabulary encyclopedia to digital product design system. Verify: `Select-String -Path docs/PRD.md -Pattern "digital product design system"`
- [x] DSF1.3 - Reframe architecture around human-facing website and agent-facing design system assets. Verify: `Select-String -Path docs/ARCHITECTURE.md -Pattern "Agent-Facing"`
- [x] DSF1.4 - Record direction change in ADR. Verify: `Test-Path docs/adr/0002-expand-to-digital-product-design-system.md`
- [x] DSF2 - Define reference strategy and research queue. Verify: `Test-Path docs/research/design-system-reference-strategy.md`
- [x] DSF3 - Define cross-surface taxonomy and IA implications. Verify: `Test-Path docs/design-system/surface-taxonomy.md`
- [x] DSF4 - Define agent asset model and access levels. Verify: `Test-Path docs/design-system/agent-asset-model.md`

## Decision Log

- Scope: Include web, mobile apps, SaaS, commerce, dashboards, documentation, marketing, internal tools, and application UI.
- Business model: Keep paid copy/download rights as a future product direction, but do not implement payment in this horizon.
- Reference approach: Tailwind/Tailwind Plus remain important references, but not the final identity.
- Agent approach: Codex and Claude Code are first-class consumers of the design system.
- Reference approach: Tailwind site work comes before Tailwind repo deep dive; mobile and product-system references have their own lanes.
- Taxonomy approach: Tailwind Plus categories become pattern groups under a broader surface model.
- Asset approach: A design-system example is complete only when reference evidence, human preview, implementation asset, and agent recipe are connected.

## Stop Conditions

- Stop before implementing payment, accounts, or license enforcement.
- Stop before importing other local design repos; this horizon only defines the integration direction.
- Stop before deep Tailwind Labs repository analysis; DSF2 should define the reference strategy first.

# Roadmap Gap Review

Date: 2026-07-10

## North Star
Goal: Agent Design를 code-native UI canvas로 만든다 — evidence-based engine bake-off → canonical canvas → direct manipulation → canvas agent/code round-trip → packaged quality gate. Details: `docs/horizons/2026-07-agent-native-ui-canvas.md`.

## Current State
- AUC1: AUC1 — Canonical Canvas Foundation (evidence: docs/plans/2026-07-10-auc1-canonical-canvas-foundation.md)
- AUC0: AUC0 — Canvas Engine Bake-off (evidence: docs/adr/0006-agent-design-layered-dom-webgpu-engine.md)

## Gap
- AUC1 provides a canonical document, operations, renderer planes, and persistence, but the surface has no production direct-manipulation runtime.
- AUC2 must connect pointer/keyboard gestures and property edits to canonical operations without bypassing history or renderer failure boundaries.
- Implementation remains blocked on the AUC2 plan approval gate.

## Proposed Next Milestone
- AUC2 - Direct Manipulation And Property Runtime (existing horizon candidate).
- Plan: `docs/plans/2026-07-10-auc2-direct-manipulation-property-runtime.md`.
- Evidence target: `phases/agent-design-direct-manipulation/` + 5k interaction/accessibility/visual smoke.

## Recommendation
Review the AUC2 step tree and begin implementation only after explicit user plan approval.

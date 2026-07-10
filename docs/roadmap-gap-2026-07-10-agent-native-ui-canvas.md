# Roadmap Gap Review

Date: 2026-07-10

## North Star
Goal: Agent Design를 code-native UI canvas로 만든다 — evidence-based engine bake-off → canonical canvas → direct manipulation → canvas agent/code round-trip → packaged quality gate. Details: `docs/horizons/2026-07-agent-native-ui-canvas.md`.

## Current State
- AUC0: AUC0 — Canvas Engine Bake-off (evidence: docs/adr/0006-agent-design-layered-dom-webgpu-engine.md)

## Gap
- AUC0 fixed the renderer topology, but no canonical document/runtime exists yet.
- AUC1 must establish the shared document, operations, DOM content plane, WebGPU editor plane, and persistence contract before direct manipulation features.
- Implementation remains blocked on the AUC1 plan approval gate.

## Proposed Next Milestone
- AUC1 - Canonical Canvas Foundation (existing approved horizon candidate).
- Plan: `docs/plans/2026-07-10-auc1-canonical-canvas-foundation.md`.
- Evidence target: `phases/agent-design-canvas-foundation/` + document fixtures + real browser smoke.

## Recommendation
Review the AUC1 step tree and begin implementation only after explicit user plan approval.

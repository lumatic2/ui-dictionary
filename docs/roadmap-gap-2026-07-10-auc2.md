# Roadmap Gap Review

Date: 2026-07-10

## North Star
Goal: Agent Design를 code-native UI canvas로 만든다 — evidence-based engine bake-off → canonical canvas → direct manipulation → canvas agent/code round-trip → packaged quality gate. Details: `docs/horizons/2026-07-agent-native-ui-canvas.md`.

## Current State
- AUC2: AUC2 — Direct Manipulation And Property Runtime (evidence: phases/agent-design-direct-manipulation/)
- AUC1: AUC1 — Canonical Canvas Foundation (evidence: docs/plans/2026-07-10-auc1-canonical-canvas-foundation.md)
- AUC0: AUC0 — Canvas Engine Bake-off (evidence: docs/adr/0006-agent-design-layered-dom-webgpu-engine.md)

## Gap
- AUC2 closes direct human manipulation, but the canvas agent still does not edit the same canonical document/code boundary.
- `AUC3` already exists as a same-horizon pending candidate with a complete DoD, evidence path, and gap.
- AUC4 packaging remains downstream of a proven agent/code round-trip.

## Proposed Next Milestone
- `AUC3 — Canvas Agent And Code Round-trip`
- Bind the selected canvas node and project context to DESIGN.md, tokens, recipes, and checks.
- Produce an exact diff, guarded apply, shared CLI/core verification, and React code↔canvas drift evidence.

## Recommendation
Keep the current `agent-native-ui-canvas` horizon and activate existing candidate AUC3 after user approval. Do not start AUC4 productization until the round-trip gate passes.

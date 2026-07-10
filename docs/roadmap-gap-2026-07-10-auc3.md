# Roadmap Gap Review

Date: 2026-07-10

## North Star
Goal: Agent Design를 code-native UI canvas로 만든다 — evidence-based engine bake-off → canonical canvas → direct manipulation → canvas agent/code round-trip → packaged quality gate. Details: `docs/horizons/2026-07-agent-native-ui-canvas.md`.

## Current State
- AUC3: AUC3 — Terminal Agent Live Canvas Round-trip (evidence: changesets/20260710-auc3-step5-dual-cli-proof/README.md)
- AUC2: AUC2 — Direct Manipulation And Property Runtime (evidence: phases/agent-design-direct-manipulation/)
- AUC1: AUC1 — Canonical Canvas Foundation (evidence: docs/plans/2026-07-10-auc1-canonical-canvas-foundation.md)
- AUC0: AUC0 — Canvas Engine Bake-off (evidence: docs/adr/0006-agent-design-layered-dom-webgpu-engine.md)

## Gap
- AUC3 closes the terminal-agent live-canvas loop, but the processes still run as development services.
- The existing AUC4 candidate must package and supervise the bridge, adapter bootstrap, trusted-folder boundary, persistence, crash recovery, diagnostics, and installer E2E.
- AUC4 requires a durable multi-step plan and explicit implementation approval before code changes.

## Proposed Next Milestone
- AUC4 — Desktop Productization And Quality Gate (promoted to active planning gate).
- Plan the Windows host/process lifecycle, trusted project import/sandbox, durable snapshot recovery, installer/update boundary, and packaged performance/security gates.

## Recommendation
Review `docs/plans/2026-07-10-auc4-desktop-productization-quality-gate.md` and explicitly approve it before implementation; do not create a replacement horizon.

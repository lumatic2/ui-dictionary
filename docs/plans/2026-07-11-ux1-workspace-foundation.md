# Plan — UX1 Workspace Foundation

Date: 2026-07-11
Milestone: UX1 (`ROADMAP.md`, active)
Status: approved 2026-07-11 — Step 1 complete; Step 2 in progress

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — a code-native canvas where people and terminal agents edit one production source of truth.
- Horizon: `docs/horizons/2026-07-canvas-product-ux.md`.
- Predecessor: AUC4 packaged desktop productization is complete and ledger-confirmed.
- Outcome: replace the development harness shell with a coherent project-entry and editing workspace without weakening existing canvas, bridge, preview, or security contracts.

## Scope Boundary

- This milestone closes project entry, workspace information architecture, persistent controls/status, panel behavior, and representative packaged UX evidence.
- Layer-tree depth, insertion library, layout tooling, and advanced shortcuts belong to UX2.
- Agent diff/audit workflow belongs to UX3.
- Full state/polish/accessibility sweep belongs to UX4, while UX1 must still meet baseline keyboard and contrast checks.
- Stop on security authority regression, loss of existing packaged round-trip behavior, or a newly required product decision.

## Step Tree

- [x] Step 1 — Workspace shell and visual hierarchy
  - Replace AUC/benchmark-first chrome with a product title bar, global toolbar, left workspace rail, central canvas stage, right inspector, and bottom status surface.
  - Verify: component tests assert landmark order and development controls are outside the primary workspace.

- [ ] Step 2 — Project entry and recent-project flow
  - Add first-run/empty workspace, Open Project primary action, recent project cards, loading/error feedback, and transition into the active workspace using the existing trusted-folder APIs.
  - Verify: renderer tests cover empty, canceled, opened, recent, and host-failure paths.

- [ ] Step 3 — Persistent toolbar and document status
  - Organize selection tools, Undo/Redo, zoom/viewport, preview, save/recovery, bridge state, and current project identity with accessible labels and tooltips.
  - Verify: keyboard/component tests cover toolbar order, disabled states, status semantics, and existing operations.

- [ ] Step 4 — Adaptive panel workspace
  - Make the left/right panels collapsible and width-aware, preserve the canvas stage, and expose stable extension slots for UX2 layers/insertion and UX3 agent activity.
  - Verify: viewport tests cover panel toggles, narrow-window layout, focus restoration, and no canvas interaction regression.

- [ ] Step 5 — Integrated workspace quality proof
  - Run the representative project-open→canvas edit→preview→terminal round-trip→recovery path in the rebuilt shell and capture visual/a11y/performance evidence.
  - Verify: renderer suite + desktop suite + packaged evidence + fresh Chrome screenshots at desktop and constrained widths.

## 결정 로그

- status: resolved

- Workspace model: professional editor shell with project-first entry; confirmed by user on 2026-07-11.
- Priority: editor fundamentals before agent collaboration and final visual polish; confirmed by user.
- Market intake: explicitly skipped for this Horizon; reuse existing Figma/OpenDesign research and current-product audit.
- Panel implementation: CSS/React DOM within the current renderer; no new UI framework or renderer topology change.
- Development diagnostics: retain behind a secondary development/diagnostics surface, not primary navigation.
- No unresolved user-owned decisions are expected during UX1.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  delegation_decision:
    remote_background_agents: skip
    reason: "The current runtime forbids subagents without explicit user request; existing research and local product evidence are sufficient."
    target_roles: []
    execution_path: local_manual
  spec_delta: "Create the Canvas Product UX horizon and make UX1 Workspace Foundation the active product milestone."
  perspectives:
    product: "Make project entry and the editing workspace understandable before adding more canvas capability."
    architecture: "Recompose existing React surfaces without changing canonical document or Electron authority boundaries."
    security: "Do not expose renderer credentials, paths, Node authority, or preview network access through new UX surfaces."
    qa: "Preserve existing unit/package gates and add product-flow, landmark, keyboard, responsive, and screenshot evidence."
    skeptic: "A visual reskin alone does not satisfy UX1; project entry, state comprehension, and repeated workflow must improve."
  role_lanes:
    explorer: "Audit current App, CanvasSurface, PropertyInspector, desktopHost, and packaged evidence."
    planner: "Keep UX2/UX3 scope out of UX1 while leaving explicit extension slots."
    reviewer: "Challenge development-control leakage, duplicated state, and CSS-only claims."
    qa: "Re-run renderer, desktop, package, browser visual, keyboard, and representative flow checks."
    gate: "Compare all five phase steps and evidence paths with UX1 DoD before completion."
  dod:
    - "A first-run user can open or resume a trusted project and enter a coherent workspace."
    - "Existing canvas, preview, bridge, Undo/Redo, recovery, and security contracts remain operational."
    - "Desktop and constrained-width screenshots plus automated landmark/keyboard tests are retained."
```

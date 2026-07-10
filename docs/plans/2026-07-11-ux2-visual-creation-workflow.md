# Plan — UX2 Visual Creation Workflow

Date: 2026-07-11
Milestone: UX2 (`ROADMAP.md`, pending)
Status: awaiting run approval

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — people compose real UI visually while the canonical document and production source stay aligned.
- Horizon: `docs/horizons/2026-07-canvas-product-ux.md`.
- Predecessor: UX1 Workspace Foundation is complete and ledger-confirmed.
- Outcome: turn the organized workspace into a discoverable creation loop spanning structure, insertion, layout, viewport, properties, and keyboard control.

## Scope Boundary

- UX2 owns layers, insertion, structure editing, alignment/distribution, layout controls, viewport navigation, and creation shortcuts.
- The insertion palette v1 includes canonical Frame, Text, Group, and supported code-component/instance entries already known to the document or project registry. Arbitrary npm browsing/import is excluded.
- Every edit composes existing canonical operations or a deterministic pure planning helper; the renderer never mutates document objects directly.
- UX3 owns agent context, activity, diff, conflict, and audit presentation.
- UX4 owns the final cross-product state/accessibility/polish sweep.
- Test failures trigger up to three self-correction passes. Stop only for a new user-owned scope decision, external credential/authority, destructive migration, security regression, or a blocker surviving three corrections.

## Step Tree

- [ ] Step 1 — Canonical creation command layer
  - Add deterministic node factories and planners for insert, duplicate, delete, group, align, distribute, and fit-selection using existing atomic operations and stable IDs.
  - Verify: canvas-core unit tests prove validation, inverse/Undo, subtree duplication, locked-node rejection, deterministic ordering, and no partial mutation.

- [ ] Step 2 — Hierarchical Layers panel
  - Replace the UX1 placeholder with an accessible tree supporting selection sync, expand/collapse, inline rename, visibility/lock, reorder, and valid reparent feedback.
  - Verify: component tests cover tree semantics, canvas↔tree selection, keyboard traversal, rename, drag/drop, invalid targets, and stable focus.

- [ ] Step 3 — Searchable Insert palette
  - Add Insert mode with Frame/Text/Group primitives plus document/project-supported components; insert at the selected container or canvas root with visible placement feedback.
  - Verify: palette search/category tests and creation-flow tests prove correct parent/index/bounds, post-insert selection, Undo, and empty-result behavior.

- [ ] Step 4 — Layout and arrangement controls
  - Add align edges/centers, distribute horizontal/vertical, tidy gap, group/ungroup, layout mode, padding/gap, and sizing controls with multi-selection-aware disabled states.
  - Verify: planner/core tests plus inspector/toolbar tests cover exact bounds, responsive constraints, mixed selection, locked nodes, and one-history-entry commits.

- [ ] Step 5 — Viewport and keyboard creation workflow
  - Add space-drag pan, wheel/pinch zoom around cursor, fit canvas/selection, zoom reset, Delete, duplicate, group, rename, layer traversal, and shortcut help.
  - Verify: pointer/keyboard tests cover focus-safe shortcuts, editable-field exclusions, zoom anchoring, bounded viewport, and accessible shortcut discovery.

- [ ] Step 6 — Representative composition quality proof
  - From a fresh project, insert a frame and components, organize layers, align/distribute, edit properties, navigate by keyboard, Undo/Redo, reload, and verify source/canvas continuity.
  - Verify: core + renderer + desktop suites, creation E2E, 5k interaction budget, packaged security/evidence, and fresh Chrome screenshots at desktop/constrained widths.

## 결정 로그

- status: resolved
- Primitive scope: Frame, Text, and Group are first-class v1 insertions; general vector/path tools remain excluded by the Horizon.
- Component scope: reuse document/project-supported code-component metadata; arbitrary npm discovery/import is deferred.
- Mutation model: UI commands plan canonical operations; no parallel renderer-only state or direct document mutation.
- Layer model: one tree combines hierarchy and selection; separate pages/assets tabs may reuse the rail but do not create a second hierarchy authority.
- Arrangement model: align/distribute/group commands commit one logical history transaction even when composed from multiple atomic operations.
- Shortcut model: desktop-editor conventions are used only when focus is outside editable fields; all commands remain discoverable through visible controls/help.
- No unresolved user-owned decision is expected for this milestone.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  delegation_decision:
    remote_background_agents: skip
    reason: "Current runtime forbids subagents without explicit user request; existing core tests and product evidence expose the relevant boundaries."
    target_roles: []
    execution_path: local_manual
  spec_delta: "Promote UX2 from workspace organization to a complete visual creation workflow without changing canonical or Electron authority boundaries."
  perspectives:
    product: "A user can create and organize a representative interface without discovering operations by accident."
    architecture: "Command planners compose canonical operations; layer tree, canvas, and inspector consume one document state."
    security: "Insertion does not execute arbitrary packages or widen renderer filesystem/network authority."
    qa: "Every command has pure planner tests, UI semantics tests, Undo/reload evidence, and integrated packaged proof."
    skeptic: "A layer panel and buttons alone are insufficient unless a fresh composition can be completed and recovered end to end."
  role_lanes:
    explorer: "Map operation/type/source contracts and identify missing planners before adding UI."
    planner: "Keep component import, vector illustration, and agent collaboration outside UX2."
    reviewer: "Challenge duplicate state, non-atomic command groups, focus loss, and shortcut collisions."
    qa: "Exercise core invariants, tree/palette semantics, pointer/keyboard paths, performance, and packaged regression."
    gate: "Compare the representative composition evidence with all six step contracts and UX2 DoD."
  dod:
    - "A fresh user can insert, organize, arrange, edit, navigate, Undo, and reload a representative UI composition."
    - "Layers, canvas, and properties remain synchronized through one canonical document and history."
    - "Existing bridge, source round-trip, performance, accessibility, recovery, and security gates remain passing."
```


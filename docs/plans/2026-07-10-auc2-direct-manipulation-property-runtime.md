# Plan — AUC2 Direct Manipulation And Property Runtime

Date: 2026-07-10
Milestone: AUC2 (`ROADMAP.md`, active planning gate)
Status: approved; execution in progress

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — 사람이 canvas를 직접 조작하고 agent와 같은 code-native 정본을 편집한다.
- Horizon: `docs/horizons/2026-07-agent-native-ui-canvas.md`
- Predecessor: AUC1 canonical document/operation/history + semantic DOM/WebGPU planes.
- Outcome: pointer, keyboard, text, and property editing을 canonical operations로 승격한다.

## Scope

- AUC1 `packages/canvas-core` operation/history contract를 확장하고 UI에서 우회 mutation을 금지한다.
- single/multi selection, move, resize, reparent, reorder, alignment guides를 구현한다.
- responsive sizing/constraints, typed component props, token bindings, mode/variant를 inspector에서 편집한다.
- Korean text editing은 composition transaction으로 history 한 건에 commit한다.
- agent integration, arbitrary vector path editing, multiplayer, Electron filesystem은 범위 밖이다.

## Step tree

- [x] Step 1 — Hit testing and accessible selection
  - DOM target→stable canvas ID hit-test, click/Shift multi-select, marquee selection, Escape clear를 canonical selection operation으로 연결한다.
  - keyboard traversal과 visible focus/selection을 동일 state에서 파생한다.
  - Verify: overlap/z-order hit tests, multi-select reducer tests, keyboard/accessibility smoke.

- [x] Step 2 — Move/resize manipulation transaction
  - pointer capture 기반 drag/8-handle resize preview와 commit transaction을 구현한다.
  - snap/alignment guide는 WebGPU editor plane에서 파생하고 final bounds만 history operation으로 commit한다.
  - Verify: cancel/revert, min size, zoom-adjusted delta, 1 operation per gesture, undo/redo.

- [x] Step 3 — Reparent/reorder and responsive constraints
  - drag target ancestry로 valid reparent/reorder를 계산하고 cycle/locked-node/invalid instance 경계를 거부한다.
  - fixed/hug/fill 및 horizontal/vertical layout constraint가 resize/reparent 후 deterministic하게 보존되도록 한다.
  - Verify: nested fixtures, invalid drop rejection, structure round-trip, responsive resize cases.

- [x] Step 4 — Typed property, token, mode, variant, Korean text runtime
  - node kind별 typed inspector schema를 만들고 invalid prop/token/variant 입력을 commit 전에 거부한다.
  - compositionstart→update→end를 한 text operation으로 commit하고 composition 중 canvas rerender가 입력을 파괴하지 않게 한다.
  - Verify: property validation, token binding, variant/mode switch, Microsoft IME actual manual pass + synthetic regression.

- [ ] Step 5 — Integrated 5k manipulation and accessibility proof (automated PASS; Microsoft IME manual gate pending)
  - select→move→resize→reparent→property→text→undo/redo→save/reload 흐름을 system Chrome과 실제 Chrome에서 검증한다.
  - 5k pointer-to-visible p95 ≤16ms 3회, keyboard focus order, forced WebGPU fallback, screenshot/reload drift gate를 기록한다.
  - Artifact: `phases/agent-design-direct-manipulation/` + changesets + screenshots/result JSON.

## Quality and stop rules

- Gesture preview는 60fps budget을 지키고 canonical commit은 gesture당 정확히 한 operation이다.
- Renderer DOM을 직접 수정해 정본과 어긋나는 구현은 금지한다.
- WebGPU failure 중에도 selection/manipulation/property editing/save가 DOM fallback으로 지속되어야 한다.
- Korean composition 중 중간 문자열을 history에 쌓거나 focus를 잃으면 Step 4로 복귀한다.
- Reparent가 hierarchy/component-instance invariant를 깨면 UI에서 미리 거부하고 core validator도 최종 방어한다.

## Planning gate

```yaml
planning_gate:
  artifact_contract: product
  output: "canvas-core operations + Agent Design interactions/inspector + phase/evidence"
  delegation: "skip; pointer, IME, and GPU evidence must remain on the same Windows machine"
  predecessor_gate: "AUC1 complete and ledger-confirmed"
  run_boundary: "No AUC2 implementation before explicit user approval of this plan."
```

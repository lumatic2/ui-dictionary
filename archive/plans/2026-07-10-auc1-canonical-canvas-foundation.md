# Plan — AUC1 Canonical Canvas Foundation

Date: 2026-07-10
Milestone: AUC1 (`ROADMAP.md`, active planning gate)
Status: completed — core/app/Chrome gates and harness ledger confirmed

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — canvas와 agent가 같은 code-native 정본을 편집한다.
- Horizon: `docs/horizons/2026-07-agent-native-ui-canvas.md`
- Predecessor: AUC0 bake-off + `docs/adr/0006-agent-design-layered-dom-webgpu-engine.md`
- Milestone outcome: renderer-independent document와 deterministic operation runtime 위에 semantic DOM content plane, WebGPU editor plane, save/reload proof를 세운다.

## Scope and assumptions

- `packages/canvas-core/`: browser/Electron에 종속되지 않는 TypeScript canonical types, validation, reducer, operation log, serialization.
- `apps/agent-design/`: React/Vite 검증 surface. Electron packaging과 filesystem authority는 AUC4로 미룬다.
- Production content는 semantic DOM, editor visuals는 WebGPU + mandatory DOM fallback으로 분리한다.
- AUC1은 select/move/resize UI를 완성하지 않는다. operation runtime과 최소 selection/viewport proof까지만 만든다.
- 저장 proof는 `DocumentStore` contract + deterministic fixture/file adapter로 닫는다. Electron main 대 Node sidecar는 결정하지 않는다.
- 새 외부 계정, secret, 유료 API는 없다.

## Step tree

- [x] Step 1 — Canonical document contract
  - versioned `CanvasDocument`, node union(frame/group/code-component/text/instance), stable IDs, hierarchy, layout constraints, typed props, token/variant/source mappings를 정의한다.
  - JSON fixture 1k/5k와 validator를 만들고 invalid hierarchy, dangling instance/source mapping, schema version failure를 테스트한다.
  - Artifact: `packages/canvas-core/` + `changesets/20260710-auc1-document-contract/`.
  - Verify: core build/test + fixture validate happy/failure paths.

- [x] Step 2 — Deterministic operation and history runtime
  - create/update/reparent/reorder/select/viewport operation schema와 pure reducer를 구현한다.
  - forward apply, inverse, undo/redo, replay, operation serialization이 byte-stable canonical result를 만드는지 검증한다.
  - Artifact: phase step + operation fixtures.
  - Verify: deterministic replay, invalid operation rejection, 1k operation recovery test.

- [x] Step 3 — Semantic DOM content plane
  - canonical nodes를 React DOM으로 렌더하고 `data-canvas-id`/source mapping/semantic role/focus surface를 보존한다.
  - viewport transform과 selection state는 project content DOM 밖에서 소비한다.
  - Artifact: `apps/agent-design/` minimal canvas surface.
  - Verify: document→DOM mapping counts, Korean composition-event test, keyboard focus smoke, 1k/5k render benchmark.

- [x] Step 4 — WebGPU editor plane with DOM fallback
  - selection bounds, guides, viewport diagnostic geometry를 WebGPU plane에 그린다.
  - adapter unavailable, validation error, device loss를 injectable failure로 만들고 같은 state를 DOM overlay로 복구한다.
  - Artifact: renderer adapter contract + GPU/fallback implementations.
  - Verify: actual Chrome WebGPU screenshot, forced fallback screenshot, canonical state equality, console errors 0.

- [x] Step 5 — Persistence and integrated fresh-project proof
  - `DocumentStore` save/load contract, version check, atomic snapshot + operation-log recovery proof를 만든다.
  - fresh fixture를 열어 render → operation apply → save → reload → undo/redo → screenshot diff 흐름을 자동화한다.
  - Artifact: `phases/agent-design-canvas-foundation/` status machine + final changeset.
  - Verify: build/test, 5k p95 ≤16ms, stable IDs/source/token/variant round-trip, reload pixel budget, real browser smoke.

## Quality and stop rules

- 1k/5k viewport/selection p95 ≤16ms on the AUC0 machine profile.
- Canonical serialization and operation replay must be deterministic; a mismatch returns to Step 1/2 rather than being patched in the renderer.
- DOM semantics, focusability, Korean composition surface, and source mappings may not regress from the AUC0 DOM baseline contract.
- WebGPU failure must never block document render, edit state, save, or reload.
- Project code receives no Node/Electron authority; AUC1 does not execute untrusted project modules outside the isolated preview boundary.
- If DOM content itself fails the budget in three repeat runs after isolation/virtualization, stop and evaluate the ADR 0006 native/Wasm threshold instead of silently expanding the GPU renderer.

## Planning gate

```yaml
planning_gate:
  artifact_contract: product
  output: "packages/canvas-core + apps/agent-design + phases/agent-design-canvas-foundation + changesets"
  delegation: "skip; same-machine renderer and GPU evidence must remain sequential"
  user_owned_decisions:
    resolved: "ADR 0006 layered DOM + WebGPU topology"
    deferred: "Electron main vs supervised Node sidecar lifecycle"
  run_boundary: "No AUC1 implementation before explicit user approval of this plan."
```

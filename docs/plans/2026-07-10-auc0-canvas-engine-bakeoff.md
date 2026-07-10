# Plan - AUC0 Canvas Engine Bake-off

Date: 2026-07-10
Milestone: AUC0 (`ROADMAP.md`, active)

## 위계

- Objective: `docs/OBJECTIVE.md` — 이동 축 "탐색·주입 도구 → 캔버스와 에이전트가 같은 정본을 편집하는 제작 환경"
- Horizon: `docs/horizons/2026-07-agent-native-ui-canvas.md`
- Milestone: AUC0 — Canvas Engine Bake-off
- Technology evidence: `references/figma-product-architecture/ANALYSIS.md` + `references/nexu-io-open-design/ANALYSIS.md`
- Decision contract: `docs/adr/0005-agent-design-code-native-canvas.md`

## Scope

이번 milestone은 production canvas를 구현하지 않는다. 동일한 canonical fixture/operation/measurement contract로 네 renderer 후보를 최소 구현하고, code-native UI canvas의 quality bar를 통과할 엔진 조합과 native/Wasm hot-path threshold를 결정한다.

이번 run 범위: benchmark contract → 네 후보 독립 experiment → comparative report → 사용자 engine 선택 → 후속 ADR. AUC1 구현, Electron packaging, agent integration은 범위 밖이다.

중단점:

- 후보가 semantic DOM 또는 deterministic code round-trip을 구조적으로 제공하지 못하면 해당 후보를 조기 탈락시키고 근거를 남긴다.
- 공정한 동일 fixture/측정이 불가능하면 비교 결론을 내리지 않고 benchmark contract로 복귀한다.
- 최종 renderer/engine topology는 사용자 소유 결정이므로 비교 보고 후 반드시 정지한다.

## Step tree

- [ ] Step 1 — benchmark contract + representative fixture corpus: frame/component/text/group/instance/variant/responsive state를 포함한 1k/5k/10k scene과 operation trace, metric JSON schema, screenshot baselines를 만든다. (verify: `npm run benchmark:canvas -- --candidate fixture-contract`가 schema/fixture self-check PASS)
- [ ] Step 2 — DOM/React + editor-overlay baseline experiment. canonical nodes→semantic DOM, overlay selection/hit-test, drag/resize/zoom, source mapping을 측정한다. (artifact: experiment; verify: shared benchmark happy/failure paths + Korean IME + screenshot evidence)
- [ ] Step 3 — DOM/React content + WebGPU viewport/selection/guides experiment. DOM production fidelity를 유지하며 WebGPU가 viewport/overlay 성능을 실제로 개선하는지 측정한다. (artifact: experiment; verify: same fixture/operation trace, WebGPU unavailable fallback 포함)
- [ ] Step 4 — SVG scenegraph + embedded DOM experiment. vector precision/zoom과 interactive UI/IME/accessibility의 경계를 측정한다. (artifact: experiment; verify: same fixture + foreignObject/embedded DOM failure modes)
- [ ] Step 5 — CanvasKit/custom WebGPU mini-engine experiment. geometry/hit-test/render hot path 이득과 text/layout/a11y/source-roundtrip 비용을 측정한다. (artifact: experiment; verify: same fixture + unsupported browser/GPU fallback)
- [ ] Step 6 — comparative report + engine ADR: metric table, qualitative correctness, complexity/security/packaging cost, fit/non-fit, hot-path migration trigger를 종합하고 사용자 선택을 기록한다. (verify: 네 experiment 4/4 + report source links + ADR decision, 결론 전 사용자 gate)

## Quality budgets

- Interaction: target 60fps; pointer-to-visible-update p95 ≤16ms on 1k/5k scenes. 10k is stress evidence, not an unconditional pass threshold until Step 1 calibrates hardware.
- Fidelity: representative React/browser screenshot pixel diff budget을 Step 1에서 고정; tolerance 변경은 report에 기록.
- Round-trip: canonical document→code/render→document cycle에서 stable IDs, hierarchy, typed props, token bindings가 손실되지 않는다.
- Input/a11y: Korean IME composition, keyboard selection/edit, focus order, semantic role/name checks가 최소 fixture에서 작동한다.
- Recovery: experiment reload/crash simulation 후 last committed document와 operation log가 재현된다.
- Security: project code는 host/Node authority가 없는 isolated preview에서 실행된다.

## Decision log

- [확정 2026-07-10, 사용자] 제품은 코드 네이티브 UI 캔버스다.
- [확정 2026-07-10, 사용자] 높은 품질을 위해 C++/WebGPU/vector를 영구 제외하지 않고 AUC0 bake-off로 채택 범위를 결정한다.
- [확정, ADR 0005] canonical document는 renderer와 독립적이며 React code component는 1급 layer다.
- [사용자 소유 — AUC0 종료 gate] renderer 조합, Electron host, Electron-main vs Node-sidecar engine topology, native/Wasm hot-path 범위.
- [AI 기본값] benchmark harness는 가장 작은 React/Vite/TypeScript workspace와 자동 JSON/screenshot capture로 시작하되 후보 공정성을 해치면 교체한다.
- secret·외부 계정·유료 API: 없음.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  delegation_decision:
    remote_background_agents: skip
    reason: "사용자가 별도 agent 위임을 요청하지 않았고, 동일 Windows/GPU 환경에서 순차 실행해야 비교가 공정하다."
    target_roles: []
    execution_path: local_manual
  spec_delta: "Objective/PRD/Architecture/ADR 0005/ROADMAP에 code-native canvas와 benchmark-first engine gate를 반영한다."
  perspectives:
    product: "캔버스 직접 조작과 code round-trip이 제품 정체성이다."
    architecture: "canonical document, renderer, editor overlay, local engine을 분리하고 evidence로 renderer를 선택한다."
    security: "candidate project code는 sandboxed preview에서 실행하고 host authority를 노출하지 않는다."
    qa: "동일 fixture와 operation trace로 성능·정확성·IME·a11y·recovery를 비교한다."
    skeptic: "GPU/native 기술이 품질을 자동 보장하지 않으며 DOM fidelity와 복잡성 비용을 함께 측정한다."
  role_lanes:
    explorer: "Figma/OpenDesign 분석과 후보별 public implementation constraints를 fixture contract에 반영한다."
    planner: "후보 간 동일 조건과 stop rule을 유지한다."
    reviewer: "candidate-specific 최적화가 benchmark 공정성을 깨는지 반박한다."
    qa: "같은 machine/build/fixture/trace로 결과를 재실행한다."
    gate: "4개 experiment 4/4와 사용자 engine 선택 전에는 AUC0 완료를 주장하지 않는다."
  dod:
    - "네 후보가 동일 benchmark artifact를 남긴다."
    - "성능뿐 아니라 code fidelity, IME, a11y, recovery, security failure mode를 확인한다."
    - "최종 선택은 comparative report와 사용자 승인으로 ADR에 기록한다."
```

## Produce → run boundary

Produce 산출물: 이 plan, horizon, Objective/PRD/Architecture/ADR/ROADMAP 정렬. Run은 `experiments/`와 benchmark harness/prototypes를 새로 만들고 로컬 브라우저/GPU 실측을 수행한다. 사용자 `진행` 승인 전 run에 들어가지 않는다.

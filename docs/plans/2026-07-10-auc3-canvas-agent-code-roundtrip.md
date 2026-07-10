# Plan — AUC3 Canvas Agent And Code Round-trip

Date: 2026-07-10
Milestone: AUC3 (`ROADMAP.md`, active planning gate)
Status: awaiting execution approval

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — 사람이 canvas를 직접 조작하고 agent와 같은 code-native 정본을 편집한다.
- Horizon: `docs/horizons/2026-07-agent-native-ui-canvas.md`.
- Predecessor: AUC2 canonical direct manipulation/property/text runtime.
- Outcome: selection-bound agent proposal을 exact diff로 검토하고 guarded apply한 뒤 CLI/core와 React source round-trip으로 검증한다.

## Scope

- 새 pure TypeScript package `packages/agent-design-engine`가 agent context, proposal, diff, apply, verify, React codec 계약을 소유한다.
- AUC3 agent transport는 typed adapter + deterministic fixture로 확정한다. 실제 Codex/Claude 프로세스 invocation과 filesystem authority는 AUC4 Electron host로 미룬다.
- selection context는 stable IDs, hierarchy, source mapping, props/tokens/layout, document revision/signature, Askewly design knowledge references를 포함한다.
- proposal은 canonical operations와 source patch의 before hash/after content를 모두 가져야 하며, base revision/signature가 어긋나면 apply를 거부한다.
- UI는 context visibility, proposal diff, approve/reject/apply, verify result를 한 dock에서 보여준다.
- React round-trip은 명시적 `data-canvas-id`와 지원되는 JSX/style subset만 수용하고 unsupported syntax를 조용히 추정하지 않고 거부한다.

## Step tree

- [ ] Step 1 — Selection-bound agent context pack
  - `packages/agent-design-engine`를 만들고 selection/ancestry/source/design references를 deterministic context로 직렬화한다.
  - Verify: selection order, source mapping, stale/missing selection, byte-identical context tests.

- [ ] Step 2 — Typed adapter and exact proposal diff
  - `CanvasAgentAdapter`와 deterministic fixture adapter, canonical operation diff, source patch hashes, proposal validator를 구현한다.
  - Verify: exact diff stability, invalid operation/file/hash rejection, no direct mutation.

- [ ] Step 3 — Guarded apply state machine and agent dock
  - draft→review→approved/rejected→applied/failed state machine과 context/diff/apply UI를 연결한다.
  - Verify: explicit approval required, stale revision rejection, atomic rollback, undo/redo, accessibility smoke.

- [ ] Step 4 — Shared verification and CLI parity
  - pure source verification rule을 shared engine으로 옮기고 CLI와 canvas proposal이 동일 rule/result를 소비하게 한다.
  - Verify: CLI existing tests, parity fixtures, failing proposal blocks apply, no browser Node/fs authority.

- [ ] Step 5 — React code↔canvas round-trip drift proof
  - supported JSX subset codec와 fresh representative React fixture로 code→document→agent proposal→apply→code/document/browser 흐름을 검증한다.
  - Verify: structure signature equality, exact source diff, screenshot drift threshold, failure-mode evidence, deterministic replay.

## 결정 로그

- Agent transport: **typed adapter + deterministic fixture** (사용자 확정 2026-07-10). Live Codex/Claude transport는 AUC4.
- Apply authority: AUC3는 in-memory canonical apply와 typed host write plan까지만. 실제 filesystem write는 AUC4 trusted host contract.
- Code subset: explicit stable IDs가 있는 representative React JSX subset부터 시작하고 unsupported syntax는 hard rejection.
- Provider/API key: 없음. AUC3는 외부 모델·secret·network 호출을 요구하지 않는다.
- Vector/multiplayer/general chat: 범위 밖.

## Quality and stop rules

- proposal이 base revision, document signature, source before hash 중 하나라도 어긋나면 apply 금지.
- UI button disabled만 믿지 않고 engine validator가 승인·stale·allowed file/source invariant를 최종 방어한다.
- deterministic adapter 결과를 live model 품질 증거로 표현하지 않는다.
- CLI verify logic을 app에 복사하지 않는다. pure rule engine 한 곳을 양쪽이 소비한다.
- unsupported React syntax를 부분 성공으로 변환하지 않는다. 원인과 source range를 반환한다.
- round-trip은 canonical structure와 browser pixel 양쪽을 검증한다.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  delegation_decision:
    remote_background_agents: skip
    reason: "현재 runtime은 사용자 요청 없는 sub-agent spawn을 금지하며, 같은 로컬 fixture/CLI/browser 증거를 한 작업자가 연속 검증해야 한다."
    target_roles: []
    execution_path: local_manual
  spec_delta: "AUC3 typed adapter/diff/apply/verify/React codec boundary를 이 plan과 phase specs에 고정한다."
  perspectives:
    product: "선택된 UI에 agent가 제안하고 사용자가 exact diff를 승인하는 단일 흐름을 만든다."
    architecture: "pure agent engine을 browser/CLI가 공유하고 provider와 filesystem authority는 adapter 뒤에 둔다."
    security: "외부 network/secret/fs write 없음; stale/hash/allowed-file gate를 engine에서 강제한다."
    qa: "unit parity + fresh React round-trip + system Chrome structure/pixel drift로 닫는다."
    skeptic: "deterministic adapter가 live agent처럼 보일 위험을 문서와 UI에서 명확히 제한한다."
  role_lanes:
    explorer: "현재 CLI rule/source mapping과 AUC2 operation contracts를 step별로 재확인한다."
    planner: "provider/host authority가 AUC4 경계를 침범하지 않는지 확인한다."
    reviewer: "direct mutation, duplicated verify logic, weak hash/stale checks를 반박한다."
    qa: "invalid proposal, rollback, unsupported JSX, drift failure를 재현한다."
    gate: "phase evidence와 ledger가 DoD 전체를 지지하는지 최종 대조한다."
  dod:
    - "agent-design-engine/app/CLI tests and builds pass"
    - "fresh React round-trip structure and pixel drift gate passes"
    - "stale/hash/unsupported/failing-verify proposals are rejected without mutation"
```

## Run boundary

이 plan과 `phases/agent-design-canvas-agent/` 내용을 사용자에게 제시하고 명시 승인받기 전 구현하지 않는다.

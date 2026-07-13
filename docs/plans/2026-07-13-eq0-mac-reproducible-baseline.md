# Plan — EQ0 Mac Reproducible Baseline

Date: 2026-07-13
Milestone: EQ0 (`ROADMAP.md`, active)
Status: planned — implementation approval pending

## Hierarchy

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-askewlydesign-editor-quality.md`
- Outcome: fresh-clone Mac에서 한 진입 경로로 app과 test matrix를 재현하고, 제품 shell을 benchmark fixture에서 분리해 EQ1 real rendering의 신뢰할 기준선을 만든다.

## Scope Boundary

- EQ0 소유: root orchestration command, local package build order, Mac test environment, renderer/core/bridge/desktop gate, production/dev fixture 분리, empty/new/open/recent 진입의 최소 상태 계약, 재현 문서와 evidence.
- 제외: actual React renderer(EQ1), snap/auto layout/Undo 구조 변경(EQ2), Assets(EQ3), agent diff UX와 signed/distributable macOS maker(EQ4).
- 기존 source authority와 canonical operation 계약은 변경하지 않는다.

## Step Tree

- [ ] Step 1 — Root bootstrap and command contract
  - root에서 package별 install/build/dev/test 순서를 숨기는 최소 orchestration entry를 만든다. package manager 선택과 lockfile 처리, Node/npm 지원 버전을 문서화한다.
  - Verify: clean dependency state에서 문서화된 단일 bootstrap/launch 경로가 nonblank app을 열고 필요한 local package build를 자동 해결한다.

- [ ] Step 2 — Mac green test matrix
  - renderer의 `localStorage` 환경 오염, bridge timeout, materialization rejection 실패를 각각 재현 테스트로 고정하고 원인을 최소 수정한다. core/renderer/bridge/desktop matrix를 root gate로 묶는다.
  - Verify: 동일 Mac shell에서 core 52+와 renderer/bridge/desktop suite가 연속 green이며 flaky timeout 재실행 3회가 통과한다.

- [ ] Step 3 — Production shell and fixture separation
  - production 기본 진입에서 1,000-node fixture와 dev 계기판을 제거하고, benchmark fixture는 명시적 dev/test route 또는 flag로만 연다. 기존 folder open/recent registry를 보존하면서 empty/new/open/recent 상태의 다음 행동을 명확히 한다.
  - Verify: production launch에 dummy node/dev action leakage가 없고 benchmark mode에서는 기존 1k/5k evidence 경로가 유지된다.

- [ ] Step 4 — Fresh-clone Mac baseline evidence
  - fresh clone에 가까운 조건에서 bootstrap→launch→new/open/recent→shutdown/relaunch smoke를 실행하고 command, duration, screenshot, test summary, 알려진 EQ1 제약을 기록한다.
  - Verify: Chrome/Electron 중 계획된 Mac dev surface에서 재현 evidence가 남고 Windows package gate는 회귀하지 않는다.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: reduction
  delegation_decision:
    remote_background_agents: propose-only
    reason: "Mac 재현과 shell 상태는 현재 머신에서 오케스트레이터가 직접 확인해야 하며, 독립 검토는 test matrix와 fixture leakage에 한정한다."
    target_roles: ["reviewer", "qa"]
    execution_path: codex_subagent_review
  spec_delta: "새 editor-quality horizon과 EQ0 active marker; 제품 구현은 아직 없음"
  perspectives:
    product: "첫 실행에서 benchmark가 아니라 만들기/열기 행동이 보인다"
    architecture: "root orchestration은 package 경계를 숨기되 source authority를 바꾸지 않는다"
    security: "임의 project 실행·npm browsing 범위를 확대하지 않는다"
    qa: "Mac test matrix green, fresh-clone launch, production/dev fixture 분리"
    skeptic: "baseline milestone이 package-manager 리팩터링이나 shell 재설계으로 팽창하지 않게 막는다"
  role_lanes:
    reviewer: "scope와 production fixture leakage 독립 diff 검토"
    qa: "clean-state bootstrap, 3회 test repeat, launch/reopen smoke"
    gate: "오케스트레이터가 각 step evidence와 전체 matrix를 직접 확인"
  dod:
    - "문서화된 단일 Mac entry로 dependency/build/dev launch 재현"
    - "core/renderer/bridge/desktop test matrix green"
    - "production 기본 진입에 benchmark fixture와 dev 계기판 없음"
    - "fresh-clone Mac smoke evidence와 EQ1 known-limit 기록"
```

## Decisions And Risks

- 결정: actual renderer보다 baseline을 먼저 닫는다. 현재 renderer test가 green이 아니면 EQ1 회귀를 판정할 수 없다.
- 결정: root entry는 기존 package lockfile/경계를 가능한 한 유지하는 최소 orchestration으로 시작한다. monorepo 전환은 자동 채택하지 않는다.
- 위험: production shell 정리가 project-entry 재설계로 번질 수 있다. EQ0에서는 기존 desktop registry를 재사용하고 화면 상태의 최소 분리만 허용한다.
- 위험: fresh-clone 증명 중 dependency install이 network 상태에 영향을 받는다. 명령 실패와 package cache 조건을 evidence에 명시한다.
- 사용자 결정 필요: 없음. implementation 시작 승인만 필요하다.

## Stop Points

각 step 완료가 checkpoint다. package manager 변경, source authority 변경, 임의 project code 실행 확대, Windows delivery 회귀, 사용자 소유 UX 결정이 나타나면 즉시 정지한다. EQ0 완료 후 EQ1 plan을 코드 감사 결과로 구체화하고 다시 승인받는다.

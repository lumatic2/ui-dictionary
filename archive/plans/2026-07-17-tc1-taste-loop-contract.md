# Plan - TC1 흡수 계약 개정 (taste loop)

Date: 2026-07-17
Milestone: TC1 (`ROADMAP.md`, active — Taste Corpus 1/4)
Status: approved (2026-07-17 사용자 "ㄱㄱ" — horizon 구성·큐레이션 5종·Dribbble 조건부 승인)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-taste-corpus.md` (active, 1/4)
- Milestone: TC1 — 흡수 계약 개정

## Scope

RL 5단계 루프(`research/reference-loop.md`)에 **taste 경로**를 증설한다: 관찰 단위 계약(관찰→원리 추출→기존 판단과의 diff→자산 갱신 의무), taste ledger 스키마, Dribbble류 콘셉트 소스용 성립성 게이트. RL을 대체하지 않는다 — RL은 커버리지(신규 recipe/term), taste는 판단 갱신이 산출물.

범위 밖: 실제 관찰 배치(TC2~4), RL 절차 본문 개정(포인터 추가만).

## 스캐폴딩 결정

- 작업 유형: tooling (절차 계약 문서 + 장부 스켈레톤)
- source-of-truth: `research/taste-loop.md`(신규 계약)·`research/taste/ledger.md`(신규 장부)
- deploy: 내부 절차 문서 — llms 배포 대상 아님(에이전트 소비는 TC2 산출물인 판단 자산 쪽이 담당). push는 승인에 포함.
- 테스트 표면: 계약 완비 self-check(관찰 스키마 필드·게이트·계수 규칙) + RL 문서와의 상호 포인터 grep

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error / risk_gate.
- Rollback/cleanup: changeset revert.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "계약 문서 1건 + 장부 스켈레톤 — 단일 응집 변경."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "기존 데이터 계약 불변 — RL과 동일하게 절차 레이어 추가."
  perspectives:
    product: "판단 갱신 강제가 이 horizon의 정체성 — 계약이 무르면 관찰이 감상으로 끝남."
    architecture: "RL 증설(대체 아님) — 양쪽 문서 상호 포인터로 관계 명문화."
    security: "로그인 벽 표면은 사용자 브라우저 경유+승인 원칙을 계약에 명시."
    qa: "계약 self-check + 포인터 grep."
    skeptic: "장부 필드가 많으면 배치가 안 돎(RL 실증 교훈) — 관찰 1건 스키마를 7필드 이내로 절제."
  role_lanes:
    gate: "계수 규칙(갱신 없는 관찰=미소화)이 우회 불가능하게 서술됐는지 검수"
  dod:
    - "taste-loop.md: 관찰 스키마(≤7필드)·성립성 게이트·계수 규칙·자산 갱신 대상 4종 명시"
    - "taste/ledger.md 스켈레톤 + reference-loop.md·taste-loop.md 상호 포인터 grep 각 1"
    - "실패 모드: '관찰만 있고 갱신 없음' 행이 ledger에서 미소화로 표기되는 규칙 존재"
```

## Step 트리

- [ ] Step 1 — taste 계약 문서 (changeset)
  - Artifact: changeset
  - Files: `research/taste-loop.md`(신규)
  - Dependencies: 없음
  - Verify: 계약 self-check — 관찰 스키마(≤7필드)·성립성 게이트·계수 규칙·자산 갱신 대상 4종 전부 존재 grep
  - Failure probe: "미소화" 표기 규칙 grep ≥1
  - Commit: `feat(agent): TC1 step 1 — taste absorption contract`
- [ ] Step 2 — 장부 스켈레톤 + RL 상호 배선 (changeset)
  - Artifact: changeset
  - Files: `research/taste/ledger.md`(신규), `research/reference-loop.md`(taste 경로 포인터 1줄 append — Changelog)
  - Dependencies: Step 1
  - Verify: 상호 포인터 grep(reference-loop→taste-loop 1, taste-loop→reference-loop 1) + 커밋·push
  - Failure probe: ledger 헤더가 계약의 관찰 스키마 필드와 1:1 대응하는지 대조
  - Commit: `feat(agent): TC1 step 2 — taste ledger + RL cross-wiring`

## 결정 로그

- [사용자 확정 2026-07-17] 취향 정본 = 큐레이션 5종(Notion·Linear·Codex·Claude·Google), Dribbble 조건부(성립성 게이트), 배치는 좁고 깊게.
- [AI 기본값] taste 경로는 RL 증설로 설계(대체 아님), 관찰 스키마 ≤7필드(장부 피로 방지 — RL 실증 교훈).
- 남은 사용자 소유 결정: 없음 (TC2 표면 좁히기는 TC2 착수 시 확인 — 계획된 상호작용).
- status: resolved

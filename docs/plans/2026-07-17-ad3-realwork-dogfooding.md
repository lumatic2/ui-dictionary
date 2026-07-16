# Plan - AD3 Real-work Dogfooding

Date: 2026-07-17
Milestone: AD3 (`ROADMAP.md`, active — Agent Adoption Loop 3/4, horizon-run 연쇄 승격)
Status: approved (2026-07-17 horizon 승인 연쇄 + 지정 대상 사용자 확정 "bootcamp.askewly.com")

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-agent-adoption-loop.md` (active, 3/4)
- Milestone: AD3 — Real-work Dogfooding

## Scope

실제 프로젝트 디자인 작업을 AD1 라우팅 경유로 수행하고 AD2 시그니처로 판정해 장부화한다. 지정 실작업 2건 = **bootcamp.askewly.com** (사용자 확정 2026-07-17 — 해커톤 산출 "사이즈 번역기", repo `lumatic2/ai-bootcamp-2026`)의 서로 다른 표면 2곳. 기회주의 1~3건은 이후 실제 들어오는 디자인 작업에서 수행(세션 경계를 넘김).

각 건의 기록 계약: 조회 경로(라우팅 발화 여부·fetch 목록) / 시그니처 판정(원칙 5·비선호 5) / 마찰·부족 자산 → `docs/research/dogfooding/ledger.md`.

범위 밖: recipe/token 확장(AD4 — 갭은 기록만), bootcamp 기능 변경(디자인 표면만), bootcamp 배포 push(사용자 승인 지점).

## 스캐폴딩 결정

- 작업 유형: tooling (dogfooding ledger 인프라 + 외부 레포 디자인 작업의 evidence 장부화)
- source-of-truth: `docs/research/dogfooding/ledger.md` (이 레포) — 외부 레포 diff는 각 레포 커밋이 소유
- deploy: bootcamp 변경은 로컬 검증 + 커밋까지, push/배포는 사용자 승인 후 (deploy batching)
- 테스트 표면: bootcamp 로컬 dev 서버 + 브라우저 스크린샷(라이트/다크·모바일) + 시그니처 판정 스크립트 + ledger 항목 완비 확인

## Scope Boundary

- Execution mode: continuous
- 중단점(hard-stop policy): Stop only on ① bootcamp push/배포 승인(decision_required) ② 기회주의 건 대기(blocked — 실작업 유입 전 milestone 미완, 문서화된 열린 상태) ③ bootcamp 레포 접근 불가(blocked) ④ 새 사용자 소유 결정(decision_required) ⑤ risk_gate.
- Rollback/cleanup: bootcamp 변경은 브랜치/커밋 단위 revert(원 레포 소유), 이 레포는 changeset 단위 revert. 클론은 `~/projects/ai-bootcamp-2026`(관례 위치) 유지.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "dogfooding의 목적이 '에이전트가 라우팅을 실사용에서 따르는가' 관측 — 신규 세션 워커(sonnet)가 디자인 작업을 수행해야 라우팅·hook이 실조건으로 발화한다. 게이트(시그니처 판정·브라우저 검증)는 오케스트레이터."
    target_roles: ["worker(bootcamp 디자인 작업 2건, sonnet 신규 세션)", "gate(오케스트레이터 — 판정·ledger)"]
    execution_path: local_manual
  spec_skip_reason: "AD3 계약은 horizon doc·ROADMAP DoD에 기록. bootcamp 제품 스펙은 원 레포 소유 — 디자인 표면만 접촉."
  perspectives:
    product: "실서비스 개선이 그대로 가치 — 장부는 부산물이 아니라 채택 흐름의 실증."
    architecture: "ledger는 이 레포 소유, 외부 diff는 외부 레포 소유 — evidence 포인터로 연결."
    security: "bootcamp 레포에 secret 접촉 없음. push는 사용자 승인."
    qa: "건별 브라우저 실구동 + 시그니처 판정 + ledger 완비."
    skeptic: "워커가 hook 리마인더를 무시하거나 판정을 자화자찬할 수 있음 — 게이트가 fetch 로그와 판정을 독립 재실행."
  role_lanes:
    gate: "건별 조회 경로 로그 검증 + 시그니처 판정 독립 재실행 + ledger 대조 (오케스트레이터)"
  dod:
    - "ledger 인프라 + 지정 2건(bootcamp 표면 상이 2곳) 장부화 — 건별 조회 경로·판정·마찰"
    - "각 건 브라우저 실구동 검증(라이트/다크·모바일) + 시그니처 판정 통과(미통과 시 교정 후 재판정)"
    - "기회주의 1~3건은 유입 시 동일 계약으로 append (milestone은 3건 이상에서 완료 판정)"
    - "실패 모드: 워커 fetch 로그에 라우팅 미발화가 기록되면 그 자체를 마찰로 장부화(은폐 금지)"
```

## Step 트리

- [ ] Step 1 — dogfooding ledger 인프라 (changeset)
  - Artifact: changeset
  - Files: `docs/research/dogfooding/ledger.md`(신규 — 항목 스키마: 날짜/프로젝트/과제/조회 경로/판정/마찰/부족 자산), `changesets/` 인덱스
  - Dependencies: 없음
  - Verify: 스키마가 AD2 판정 형식과 AD4 갭 입력 형식을 담는지 확인
  - Failure probe: 항목 스키마에 '라우팅 미발화' 기록 필드가 있는지(부정 결과도 장부화 가능)
  - Commit: `feat(agent): AD3 step 1 — dogfooding ledger`
- [ ] Step 2 — 지정 작업 ① bootcamp 표면 A (changeset)
  - Artifact: changeset (외부 diff는 ai-bootcamp-2026 커밋, evidence는 ledger 항목)
  - Files: `~/projects/ai-bootcamp-2026`(클론·표면 A 디자인 개선), `docs/research/dogfooding/ledger.md` append
  - Dependencies: Step 1
  - Verify: 워커 신규 세션(sonnet) 수행 → fetch 로그로 라우팅 관측 → 게이트 시그니처 판정 → 브라우저 실구동(라이트/다크·모바일)
  - Failure probe: 판정 FAIL 항목은 교정 후 재판정, 라우팅 미발화면 마찰로 기록
  - Commit: `feat(agent): AD3 step 2 — dogfood #1 bootcamp` (+ 외부 레포 자체 커밋, push 보류)
- [ ] Step 3 — 지정 작업 ② bootcamp 표면 B (changeset)
  - Artifact: changeset
  - Files: `~/projects/ai-bootcamp-2026`(표면 B), `docs/research/dogfooding/ledger.md` append
  - Dependencies: Step 1 (Step 2와 표면 분리)
  - Verify: Step 2와 동일 계약
  - Failure probe: Step 2와 동일
  - Commit: `feat(agent): AD3 step 3 — dogfood #2 bootcamp` (+ 외부 레포 자체 커밋, push 보류)
- [ ] Step 4 — 기회주의 건 장부화 (changeset, 세션 경계 넘김)
  - Artifact: changeset (건당 ledger append)
  - Files: `docs/research/dogfooding/ledger.md`
  - Dependencies: Step 1; 실제 디자인 작업 유입(외부 이벤트)
  - Verify: 유입 건마다 동일 계약(조회 경로·판정·마찰) — 3건 누적 시 milestone 완료 판정
  - Failure probe: 유입 없이 인위 시나리오로 채우지 않기(사용자 확정 위반)
  - Commit: `feat(agent): AD3 step 4 — opportunistic dogfood entries`

## 결정 로그

- [확정 2026-07-17] 지정 대상 = bootcamp.askewly.com (AskUserQuestion Other 응답) — 표면 상이 2곳으로 2건 구성은 AI 기본값.
- [확정 2026-07-17] 혼합 확보: 지정 2건 + 기회주의 1~3건.
- [기존 관례] bootcamp push/배포는 사용자 승인 후 (deploy batching).
- [AI 기본값] 클론 위치 `~/projects/ai-bootcamp-2026`, 워커=sonnet 신규 세션(백그라운드 에이전트 fable 금지 규칙 준수).
- 남은 사용자 소유 결정: 없음 (push 승인은 실행 중 정지점).
- status: resolved

# Plan - TC2 제품 배치: 사용자 큐레이션 5종

Date: 2026-07-17
Milestone: TC2 (`ROADMAP.md`, active — Taste Corpus 2/4)
Status: approved (2026-07-17 사용자 "추천대로 해. 다 해도 돼" — 표면 확정: Notion 에디터+사이드바 / Linear 보드+상세(+마케팅) / Codex 웹 / Claude 챗+아티팩트 / Google=antigravity.google, Chrome 사용 승인)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-taste-corpus.md` (active, 2/4)
- Milestone: TC2 — 제품 배치: 사용자 큐레이션 5종

## Scope

확정 표면 5종을 taste-loop 계약(관찰→원리→diff→갱신, 7필드 장부)으로 정밀 해부한다. 제품당 관찰 2~3건, 총 10건 이상이 taste ledger에 기록되고 판단 자산 2종 이상에 갱신이 배포 반영된다. 로그인 표면은 사용자 Chrome(chrome-ext) 경유 — 승인 획득(2026-07-17). 시그니처 개정 후보는 즉시 반영하지 않고 마감 보고에서 사용자 확인 후 반영.

범위 밖: 신규 recipe 대량 추가(후보 발견 시 RL inbox로), look 복사, Dribbble(TC3)·성문 판단(TC4).

## 스캐폴딩 결정

- 작업 유형: tooling (관찰 장부 + 판단 자산 갱신)
- source-of-truth: `research/taste/ledger.md` + 갱신 자산 4종의 기존 정본
- deploy: 갱신 자산의 기존 경로(generate-llms-txt → push → curl)
- 테스트 표면: 계수 규칙 준수(미소화 표기), 갱신 자산 grep, llms 재생성·배포 curl

## Scope Boundary

- Execution mode: continuous
- 중단점: ① 시그니처 개정 확인(decision_required — 마감 보고로 일괄) ② Chrome 접근 불능·로그인 안 됨(blocked) ③ risk_gate. push·배포 포함 승인.
- Rollback/cleanup: changeset revert. 스크린샷은 changeset evidence로.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "관찰은 사용자 Chrome 실화면 기반 — 위임 불가(로그인 세션·취향 판정은 오케스트레이터 소관)."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "taste-loop 계약(TC1)을 실행하는 배치 — 계약 변경 없음."
  perspectives:
    product: "사용자 취향 정본 5종의 첫 소화 — 판단 상한의 실측 기준선."
    architecture: "갱신은 기존 자산 4종의 기존 형식으로만 — 새 데이터 정본 없음."
    security: "사용자 브라우저 화면에 개인 데이터 노출 가능 — 스크린샷은 UI 구조 중심으로, 개인 콘텐츠 식별 정보는 증거에 담지 않는다."
    qa: "건별 7필드 완비 + 갱신 grep + 배포 curl."
    skeptic: "관찰이 감상으로 흐르는 위험 — 계수 규칙(미소화)이 방어. 원리가 소스 종속 서술이면 반려."
  role_lanes:
    gate: "원리의 소스 독립성·look 복사 여부·계수 규칙 준수 검수 (오케스트레이터)"
  dod:
    - "taste ledger 10건 이상(제품당 2+), 전 건 7필드 완비 + 스크린샷 증거"
    - "판단 자산 2종 이상에 갱신 반영 + llms 배포 curl"
    - "실패 모드: 미소화 건은 사유와 함께 표기(은폐 금지), 시그니처 개정 후보는 사용자 확인 대기로 분리"
```

## Step 트리

- [ ] Step 1 — Notion·Linear 관찰 배치 (changeset)
  - Artifact: changeset
  - Files: `research/taste/ledger.md` append(T-1~), 갱신 자산, 스크린샷 evidence
  - Dependencies: 사용자 Chrome 접근
  - Verify: 건별 7필드 + 원리 소스 독립성 검수 + 갱신 grep
  - Failure probe: 갱신 문구에 특정 제품 색·폰트 값 0(look 복사 금지)
  - Commit: `feat(agent): TC2 step 1 — Notion/Linear taste batch`
- [ ] Step 2 — Codex·Claude 관찰 배치 (changeset)
  - Artifact: changeset
  - Files: ledger append, 갱신 자산, 스크린샷
  - Dependencies: Step 1과 독립(순차는 세션 편의)
  - Verify: Step 1과 동일
  - Failure probe: 동일
  - Commit: `feat(agent): TC2 step 2 — Codex/Claude taste batch`
- [ ] Step 3 — Antigravity 관찰 + 갱신 일괄 배포 (changeset)
  - Artifact: changeset
  - Files: ledger append, 갱신 자산, llms 재생성
  - Dependencies: Step 1·2 (배포 1회 합류)
  - Verify: 총 10건+ 계수 확인 → llms 재생성 → push → 배포 curl(갱신 자산 2종+) + 오경로 404
  - Failure probe: 미소화 건 표기 존재 확인(전 건 흡수 주장 의심 — 정직성 체크)
  - Commit: `feat(agent): TC2 step 3 — Antigravity batch + deploy`

## 결정 로그

- [사용자 확정 2026-07-17] 표면 5종 확정(위 Scope) + Chrome 사용 승인 + Google=antigravity.google.
- [계약 승계] 시그니처 개정은 제안만 수집 → 마감 보고에서 사용자 확인.
- 남은 사용자 소유 결정: 없음 (시그니처 확인은 계획된 마감 상호작용).
- status: resolved

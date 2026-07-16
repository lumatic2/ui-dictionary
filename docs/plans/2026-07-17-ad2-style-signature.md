# Plan - AD2 Style Signature

Date: 2026-07-17
Milestone: AD2 (`ROADMAP.md`, active — Agent Adoption Loop 2/4, horizon-run 연쇄 승격)
Status: approved (2026-07-17 horizon 전체 승인 "진행"의 연쇄 범위 — AD2는 제시된 milestone 트리에 포함)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-agent-adoption-loop.md` (active, 2/4)
- Milestone: AD2 — Style Signature

## Scope

"내 스타일" 판정 기준을 성문화한다 (2026-07-17 사용자 확정: 기존 자산 역산 + 인터뷰 보강). 두 changeset:

1. **역산 초안** — 토큰 SSOT(tokens.css·askewly.tokens.json)·templates 4종·principles·anti-patterns·사이트 실표면·기록된 카피 규약(atlasItems)에서 스타일 특징(컬러 운용·타이포·밀도·radius/border/shadow·모션·카피 톤)을 추출해 `docs/design-system/style-signature.md` 초안(draft 상태) + 사용자 인터뷰 질문지 작성.
2. **인터뷰 확정 + 판정 편입** — 사용자 인터뷰(계획된 상호작용)로 초안을 확정하고 판정 체크리스트를 도출, llms.txt 노출 + entry-protocol 연계, 체크리스트 기반 실판정 1회 구동(AD1 E2E 산출물 재판정으로 갈음).

범위 밖: dogfooding 반복(AD3), recipe 확장(AD4), 사이트 UI 변경. DoD의 "design-qa 스킬 편입"은 로컬 design-qa 스킬 소스 부재(AD1 실사)로 "체크리스트 기반 판정 절차의 프로토콜 편입 + 실판정 1회"로 해석한다(동등 효과 — 판정이 실제로 구동되는 것이 본질).

## Scope Boundary

- Execution mode: continuous
- 중단점(hard-stop policy): Stop only on ① 사용자 인터뷰 대기(decision_required — Step 2 진입 조건, 계획된 상호작용) ② 역산 근거 자산 간 충돌로 초안 구성 불가(blocked) ③ 새 사용자 소유 결정 출현(decision_required).
- Rollback/cleanup: 이 레포 changeset 단위 revert. draft 상태 문서는 인터뷰 확정 전 llms.txt에 노출하지 않는다.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "역산은 이 레포 자산 정독+합성 판단 작업(오케스트레이터 축적 컨텍스트가 유리), 인터뷰는 사용자 상호작용. 위임 이득 없음."
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "AD2 계약은 horizon doc·ROADMAP DoD에 기록됨. 신규 제품 계약 없음."
  perspectives:
    product: "체크리스트가 실제 판정 가능해야 함 — 형용사 나열이 아니라 관측 가능한 기준."
    architecture: "정본은 style-signature.md 하나, llms.txt는 링크만(C-10). 기존 principles/anti-patterns와 역할 중복 금지 — signature는 '유성 취향', principles는 '보편 품질'."
    security: "외부 연동·secret 없음."
    qa: "실판정 1회 구동(AD1 E2E 산출물 재판정) + llms.txt 링크 무결성."
    skeptic: "역산이 '이미 만든 것=취향' 가정에 갇힐 수 있음 — 인터뷰 질문지에 비선호·예외 항목을 반드시 포함."
  role_lanes:
    gate: "완료 전 DoD·실판정 evidence 독립 대조 (오케스트레이터)"
  dod:
    - "style-signature.md 정본(인터뷰 확정) + 판정 체크리스트"
    - "llms.txt 노출 + entry-protocol 연계 + 링크 무결성 PASS"
    - "체크리스트 실판정 1회 구동 evidence (AD1 E2E 산출물 재판정)"
    - "실패 모드: 체크리스트가 명백한 비스타일 산출물(발명 팔레트 등)을 FAIL로 판정하는지 확인"
```

## Step 트리

- [ ] Step 1 — 역산 초안 + 인터뷰 질문지 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/style-signature.md`(신규, draft), `changesets/` 인덱스
  - Dependencies: 없음
  - Verify: 초안이 축별(컬러·타이포·밀도·형태·모션·카피) 관측 가능 기준 + 근거 자산 인용으로 구성, 인터뷰 질문지(선호 확인 + 비선호·예외 발굴) 포함, 사용자에게 제시
  - Failure probe: 각 축 기준이 실제 자산 근거를 인용하는지 대조(무근거 항목 0)
  - Commit: `feat(agent): AD2 step 1 — style signature draft`
- [ ] Step 2 — 인터뷰 확정 + 판정 편입 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/style-signature.md`(확정), `scripts/generate-llms-txt.mjs`, `docs/design-system/entry-protocol.md`(연계 한 줄), `changesets/` 인덱스
  - Dependencies: Step 1 + 사용자 인터뷰 완료
  - Verify: llms.txt 재생성+링크 무결성 + AD1 E2E 산출물(settings.html·onboarding.html) 체크리스트 실판정 1회 + 비스타일 산출물(r1 발명 팔레트본) FAIL 판정
  - Failure probe: 비스타일 산출물이 PASS로 나오면 체크리스트 변별력 부족 — 기준 보강 후 재판정
  - Commit: `feat(agent): AD2 step 2 — style signature finalized + judgment wiring`

## 결정 로그

- [확정 2026-07-17] AD2 방식 = 역산 + 인터뷰 보강 (AskUserQuestion).
- [계획된 상호작용] Step 1→2 사이 사용자 인터뷰 — 새 결정이 아니라 확정된 방식의 실행.
- [AI 기본값] "design-qa 스킬 편입"의 해석(스킬 소스 부재로 프로토콜 편입+실판정으로 갈음 — Scope에 명시).
- 남은 사용자 소유 결정: 없음 (인터뷰 내용 자체가 사용자 입력).
- status: resolved

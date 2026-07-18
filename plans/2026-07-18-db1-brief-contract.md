# Plan - DB1 브리프 계약 정본 + 프로토콜 배선

Date: 2026-07-18
Milestone: DB1 (`ROADMAP.md`, active — Design Brief 1/2)
Status: approved (2026-07-18 — 사용자 AskUserQuestion: 규모 비례 + DESIGN.md 저장 확정)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-design-brief.md` (active, 1/2)
- Milestone: DB1 — 브리프 계약 정본

## Scope

`docs/design-system/design-brief.md` 신설(질문 카탈로그·규모 게이트·DESIGN.md 저장 계약·headless 폴백) + entry-protocol 배선 + llms 배포.

범위 밖: skill 개정·E2E(DB2), DESIGN.md 템플릿 개정.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `docs/design-system/design-brief.md` (본 레포, llms 배포)
- deploy: generate-llms-txt(스크립트에 신규 자산 등재) → push → curl
- 테스트 표면: curl grep, llms.txt에 design-brief 항목 존재

## 결정 로그

- [사용자 확정 2026-07-18] 발동 = 규모 비례: 새 페이지·사이트·화면=풀 브리프 / 컴포넌트 1개·수정=생략(기존 DESIGN.md 파생) / DESIGN.md 있으면 재인터뷰 없음.
- [사용자 확정 2026-07-18] 답변 = 작업 프로젝트 `DESIGN.md`로 저장·재사용 (templates/DESIGN.md.tmpl 정합).
- [AI 기본값] 질문 도메인 7종(정체성·룩 소유권·컬러·타이포·구조·인터랙션 수위·콘텐츠/범위), Claude=AskUserQuestion 묶음·Codex=평문 일괄, 도메인당 추천 1개 제시(전부 주관식 금지), headless=기본값 진행+"브리프 추정" 명시.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — design-brief.md 작성 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/design-brief.md` write
  - Dependencies: 없음
  - Verify: 문서에 규모 게이트·7도메인 질문 카탈로그·DESIGN.md 저장 계약·headless 폴백 4절 전부 존재
  - Failure probe: 질문이 열린 주관식만으로 구성되면 FAIL(도메인당 선택지+추천 의무 — 사용자 피로 방지)
  - Commit: `feat(agent): DB1 step 1 — design brief contract`
- [ ] Step 2 — entry-protocol 배선 + llms 배포 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/entry-protocol.md` write(브리프 단계 삽입), `scripts/generate-llms-txt.mjs`(자산 등재), llms 산출물
  - Dependencies: Step 1
  - Verify: push 후 curl design-brief.md 200 + llms.txt에 항목 grep + entry-protocol에 브리프 단계 grep
  - Failure probe: llms.txt 미등재로 skill이 발견 못 하는 경로 확인(스크립트 등재 누락 시 FAIL)
  - Commit: `feat(agent): DB1 step 2 — protocol wiring + deploy`

## Scope Boundary

- Execution mode: continuous
- 중단점: 새 사용자 소유 결정 / blocked·error
- Rollback/cleanup: changeset revert + llms 재생성

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "문서 2개 + 배포 — 직접 수행 최단"
    target_roles: []
    execution_path: local_manual
  spec_delta: "진입 프로토콜에 브리프 인터뷰 단계 신설 — 무토큰 프로젝트의 룩 소유권을 인터뷰로 생성"
  perspectives:
    product: "사용자 의도가 추정 대신 브리프로 반영 — 진주 만두 실증 직후 수요"
    architecture: "정본 1개 추가, skill은 라우터 유지 — 드리프트 없음"
    security: "secret 없음"
    qa: "curl + grep + 미등재 실패 경로"
    skeptic: "질문 피로 리스크 — 규모 게이트·선택지+추천 의무로 완화"
  dod:
    - "curl design-brief.md 200 + 4절 존재"
    - "entry-protocol에 브리프 단계 배포 반영"
    - "실패 모드: llms.txt 미등재 경로 확인"
```

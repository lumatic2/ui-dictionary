# Plan - ST2 캐스케이드 + 스티키 라이브 미리보기

Date: 2026-07-19
Milestone: ST2 (`ROADMAP.md`, pending — Cascade Studio 2/4)
Status: approved (2026-07-19 — 사용자 승인 + 스크롤 추종 미리보기 추가 지시)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-cascade-studio.md` (active, 2/4)
- Milestone: ST2 — 캐스케이드 프리뷰

## Scope

① **캐스케이드 렌더**: 각 그룹 후보가 "지금까지의 선택 + 아직 안 고른 축은 추천 1순위" 컨텍스트로 렌더 — 배경 선택 시 액센트/타이포/카드 후보가 그 배경 위에서 다시 그려짐(선택 변경 시 하위 그룹 리렌더). ② **스티키 라이브 미리보기**: 우측 고정 패널(모바일 하단 시트)에 미니 사이트(헤더·히어로·카드 3·푸터 축약)가 선택 상태로 실시간 조립 — 스크롤을 따라오며 폭포가 완성되는 사이트를 보여줌. 실구동 검증.

범위 밖: 영상(ST3), 카피 축(ST4 — 미리보기 카피는 임시 더미).

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `templates/brief-studio.html`
- deploy: 레포 커밋 + brief-studio.md 계약 1절(캐스케이드·미리보기) llms
- 테스트 표면: 실구동 — 배경 변경→하위 후보 배경 변화 관측, 미리보기 패널 조립 관측, 스크린샷

## 결정 로그

- [사용자 확정 2026-07-19] 폭포식 + 스크롤 추종 미리보기("폭포들로 점차 완성되는 사이트를 미리보면서").
- [AI 기본값] 컨텍스트 함수 ctx() = 선택값 ?? 추천 1순위. 리렌더는 하위 그룹만(상위 보존). 미리보기는 position:sticky(데스크톱)/하단 고정 바 토글(모바일).
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 캐스케이드 렌더 엔진 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html` (ctx 컨텍스트·하위 리렌더)
  - Dependencies: ST1 완료(레이아웃 확정)
  - Verify: 실구동 — 배경 잉크블랙 선택 → 액센트·타이포·카드 후보가 잉크블랙 위 렌더로 변화(evaluate로 배경값 검증)
  - Failure probe: 상위 재선택 시 하위 기선택이 유지되는지(리렌더가 선택을 지우면 FAIL)
  - Commit: `feat(agent): ST2 step 1 — cascade context rendering`
- [ ] Step 2 — 스티키 라이브 미리보기 + 계약 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html` (미리보기 패널), `docs/design-system/brief-studio.md` (§ 캐스케이드·미리보기), llms
  - Dependencies: Step 1
  - Verify: 실구동 — 선택 6종 진행하며 미리보기 조립 변화 스크린샷 2장 + curl 계약
  - Failure probe: reduced-motion·좁은 뷰포트에서 패널이 콘텐츠를 가리지 않는지
  - Commit: `feat(agent): ST2 step 2 — sticky live preview + deploy`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: 템플릿 revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: expansion
  delegation_decision:
    remote_background_agents: skip
    reason: "단일 파일 렌더 엔진 — 직접 구현·실구동 검증"
    target_roles: []
    execution_path: local_manual
  spec_delta: "스튜디오가 폭포식 + 라이브 조립 미리보기 — 앱 프로토타입 완성형"
  perspectives:
    product: "고를수록 내 사이트가 완성되는 체감 — 사용자 지시 직반영"
    architecture: "ctx 단일 함수·하위 리렌더 한정 — 복잡도 통제"
    security: "로컬만"
    qa: "캐스케이드 실측 + 선택 보존·가림 실패 경로"
    skeptic: "리렌더 성능 — 그룹 단위 부분 렌더로 방어"
  dod:
    - "캐스케이드 evaluate 검증 + 미리보기 조립 스크린샷 2"
    - "실패 모드 2종 확인"
```

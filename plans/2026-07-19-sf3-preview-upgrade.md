# Plan - SF3 미리보기 고도화

Date: 2026-07-19
Milestone: SF3 (`ROADMAP.md`, pending — Studio Finish 3/3)
Status: approved (2026-07-19)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-studio-finish.md` (3/3)
- Milestone: SF3 — 미리보기 고도화 (다크 토글 · 반응형 뷰포트)

## Scope

① 스티키 미리보기 패널에 라이트/다크 토글을 추가하고 다크/접근성 축 선택과 연동 렌더 ② 뷰포트 전환(데스크톱/모바일 폭) 토글을 추가해 반응형 조립을 실물로 확인 + 구성×다크×모바일 조합 E2E. horizon 통합 검증(커스텀 데이터 전 루프 1회)을 여기서 닫는다.

## 스캐폴딩 결정

- source-of-truth: `templates/brief-studio.html`(미리보기 패널) + `docs/design-system/brief-studio.md`(계약 — 미리보기 절)
- 검증: Playwright E2E — 조합 매트릭스(구성 3종 × 라이트/다크 × 데스크톱/모바일) 렌더 실측 + 스크린샷, 프리모템 3 예방
- 배포/운영: llms + 레포 (self-contained 계약 불변)
- 검토 후 제외: 서버·데이터·관측(해당 없음), design(신규 룩 없음 — 기존 다크 축 값 재사용)

## 결정 로그

- [AI 기본값] 다크 토글은 다크/접근성 축의 기존 후보 값(다크 변수)을 미리보기에 적용하는 뷰 토글 — 새 축 추가 아님(범위 제외 준수).
- [AI 기본값] 모바일 뷰포트는 미리보기 패널 내 폭 전환(iframe/컨테이너 폭 380px 급) — 실제 디바이스 에뮬레이션까지 가지 않음(과설계 회피).
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 다크 토글 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html`(미리보기 패널 토글 + 다크 변수 적용)
  - Dependencies: SF1(데이터 경로), SF2 step 1(구성 렌더)
  - Verify: 다크 토글 on → 미리보기 배경·잉크·카드가 다크 값으로 전환됨을 Playwright 실측 (다크 축 선택값과 일치)
  - Failure probe: 다크 축 "선택 안함/라이트 전용" 선택 시 토글 동작 정의(비활성 또는 기본 다크) 확인 — 미정의 상태 0
  - Commit: `feat(agent): SF3 step 1 — preview dark toggle`
- [ ] Step 2 — 반응형 뷰포트 + 통합 E2E (changeset)
  - Artifact: changeset (evidence 포함)
  - Files: `templates/brief-studio.html`(뷰포트 토글), `docs/design-system/brief-studio.md`(미리보기 절 갱신 + 배포), `evidence/studio-finish/`(E2E 로그·스크린샷)
  - Dependencies: Step 1
  - Verify: 조합 매트릭스(구성 3종 × 라이트/다크 × 데스크톱/모바일 = 12조합) 렌더 실측 + 커스텀 데이터 JSON 1건 전 루프(주입→선택→수집) 관측 → horizon Close Criteria 4항 대조
  - Failure probe: 모바일 폭에서 시퀀스 겹침·오버플로 0건 — 발견 시 수정 전 완료 처리 금지
  - Commit: `feat(agent): SF3 step 2 — responsive preview + integrated E2E`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "단일 파일 중심 UI 툴링 — E2E 검증 커맨드 명확"
    target_roles: []
    execution_path: local_manual
  spec_delta: "미리보기가 다크·모바일 상태까지 실물 확인 가능"
  perspectives:
    product: "다크/접근성 축 선택을 눈으로 확인 — 실물 원칙의 잔여 구멍 제거"
    architecture: "뷰 토글만 — 축·데이터 모델 불변"
    security: "-"
    qa: "조합 매트릭스 12조합 실측 (happy-path 금지)"
    skeptic: "조합 렌더 버그 재발 위험 (ST4 ③ 전례 — 매트릭스 실측으로 방어)"
  dod:
    - "조합 매트릭스 12조합 렌더 실측 + 스크린샷"
    - "모바일 오버플로 0건 확인 (실패 모드)"
    - "커스텀 데이터 전 루프 1회 관측 (horizon 통합 검증)"
```

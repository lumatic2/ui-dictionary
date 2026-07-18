# Plan - SF2 구성 패턴 완편

Date: 2026-07-19
Milestone: SF2 (`ROADMAP.md`, pending — Studio Finish 2/3)
Status: proposed

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-studio-finish.md` (2/3)
- Milestone: SF2 — 구성 패턴 완편 (4유형 + 예약형 특수 패턴)
- 리서치: `research/2026-07-19-st4-composition-patterns.md` (12유형 + 예약형 — 출처 완비)

## Scope

① 구성 축에 미편입 4유형(비교표 · 문제-메커니즘-증거 · 커뮤니티 UGC · FAQ 신뢰)을 후보로 추가하고 미리보기 pv 시퀀스 렌더에 반영 ② 예약/티켓형 특수 패턴(히어로 위젯 통합 · 재고/좌석 시각화 · 긴급 신호)을 계약에 편입하고 llms 배포. 긴급 신호에는 "실재 재고 전제" 명시 규칙 포함(리서치 §3 — 가짜 희소성 비판 출처 반영).

## 스캐폴딩 결정

- source-of-truth: `templates/studio-data.default.json`(구성 후보 데이터 — SF1 산출) + `templates/brief-studio.html`(pv 렌더) + `docs/design-system/brief-studio.md`·`docs/design-system/design-brief.md`(계약)
- 검증: 생성 스튜디오 실구동으로 구성 후보 카운트·신규 4종 미리보기 시퀀스 렌더 실측 + curl 배포 확인
- 배포/운영: llms + 레포
- 노출 규칙: 기본 노출 상한 8종 유지, 신규 4종 중 업종 특화(예약형)는 브리프 맥락 일치 시 조건 노출 — 과밀 방지(프리모템 2)
- 검토 후 제외: 서버·데이터·관측(정적 도구 — 해당 없음)

## 결정 로그

- [AI 기본값] 4유형은 구성 축 후보로 추가하되 기본 노출 8종 + 조건 노출로 과밀 방지 (프리모템 2 예방장치).
- [AI 기본값] 예약형 긴급 신호(잔여 수량·카운트다운)는 "실재 데이터 전제" 문구를 계약에 명시 — 다크패턴 방지 (리서치 NBC 출처).
- [의존] SF1 완료가 선행 — 구성 후보 추가는 데이터 JSON 에서 수행(HTML 직접 편집 아님).
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 구성 4유형 편입 + 미리보기 반영 (changeset)
  - Artifact: changeset
  - Files: `templates/studio-data.default.json`(구성 후보 +4), `templates/brief-studio.html`(pv 시퀀스 렌더 4종 추가)
  - Dependencies: SF1
  - Verify: 생성 스튜디오 실구동 — 구성 축에서 신규 4종 각각 선택 시 미리보기 시퀀스가 해당 구성으로 재조립됨을 Playwright 실측 (ST4 버그 ③ 재발 방지)
  - Failure probe: 신규 구성 선택 + 미리보기 미반영 조합 0건 확인 — 미반영 발견 시 렌더 수정 전 완료 처리 금지
  - Commit: `feat(agent): SF2 step 1 — composition 4 types + preview render`
- [ ] Step 2 — 예약형 특수 패턴 편입 + 계약 배포 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/brief-studio.md`·`docs/design-system/design-brief.md`(예약형 절 — 위젯 히어로 통합·재고 시각화·긴급 신호 진실성), `templates/studio-data.default.json`(예약형 구성 후보 — 조건 노출)
  - Dependencies: Step 1
  - Verify: `curl https://ui.askewly.com/llms/docs/design-system/brief-studio.md` 에 예약형 절 존재 + 예약 업종 브리프 가정 시 조건 노출 실측
  - Failure probe: 비예약 업종 데이터에서 예약형 후보가 노출되지 않음(조건 노출 경계) 확인
  - Commit: `feat(agent): SF2 step 2 — booking patterns + deploy`

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
    reason: "기존 리서치 편입 — 데이터·계약 문서 수정, 검증 명확"
    target_roles: []
    execution_path: local_manual
  spec_delta: "구성 축이 리서치 12유형 + 예약형 특수 패턴을 커버"
  perspectives:
    product: "회의적 시장·고관여 서비스·예약형 의뢰에 구성 언어 제공"
    architecture: "SF1 데이터 경로 위에 얹음 — HTML 직접 편집 회귀 금지"
    security: "-"
    qa: "구성×미리보기 반영 전수 실측 + 조건 노출 경계"
    skeptic: "후보 과밀 → 선택 피로 (기본 8종 + 조건 노출로 방어)"
  dod:
    - "신규 구성 4종 미리보기 반영 실측 (전수)"
    - "예약형 절 curl 배포 + 조건 노출·비노출 경계 확인 (실패 모드)"
```

# Plan - SF1 데이터 주도 스튜디오 주입

Date: 2026-07-19
Milestone: SF1 (`ROADMAP.md`, active — Studio Finish 1/3)
Status: approved (2026-07-19)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-studio-finish.md` (1/3)
- Milestone: SF1 — 데이터 주도 스튜디오 주입 (자동화)

## Scope

① `templates/brief-studio.html` 의 AGENT DATA 블록(TILES·AXES·미리보기 카피)을 외부 데이터 JSON 으로 분리하고, 데이터 JSON + 템플릿 → self-contained 스튜디오 HTML 을 산출하는 생성 스크립트 `templates/make-studio.py` 를 만든다 ② 계약 문서(`brief-studio.md`)의 주입 지시를 "블록 직접 편집" → "데이터 JSON 작성 후 1커맨드 생성" 으로 교체하고 llms 배포 + E2E.

## 스캐폴딩 결정

- source-of-truth: `templates/brief-studio.html`(템플릿 정본) + `templates/studio-data.default.json`(기본 데이터 정본) + `docs/design-system/brief-studio.md`(계약)
- 검증: 기본 데이터로 생성한 HTML 의 Playwright 실구동(18축 렌더 동일) + 커스텀 데이터 1건 생성 실측 + 불량 JSON 명시 에러
- 배포/운영: llms(ui.askewly.com) + 레포. 산출 HTML 은 self-contained 유지(단일 파일 열기 계약 불변)
- 데이터: JSON 스키마는 별도 schema 파일 없이 `make-studio.py` 내 필수 필드 검증으로 시작(과설계 회피 — 필요해지면 승격)
- 검토 후 제외: 서버·관측 도메인(정적 로컬 도구 — 해당 없음), design(기존 스튜디오 룩 불변)

## 결정 로그

- [AI 기본값] 분리 형식 = JSON 1파일(TILES+AXES+카피 통합), 생성기 = python 단일 스크립트(기존 fetch-stock.py 관례 따름).
- [AI 기본값] 템플릿 쪽은 `/* AGENT DATA */` 블록을 치환 마커로 유지 — HTML 이 단독으로도 기본 데이터로 열리게(폴백 보존).
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 데이터 분리 + 생성 스크립트 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html`(AGENT DATA → 치환 마커), `templates/studio-data.default.json`(신규), `templates/make-studio.py`(신규)
  - Dependencies: 없음
  - Verify: `python templates/make-studio.py --data templates/studio-data.default.json --out tmp/studio.html` → Playwright 로 열어 18축·타일 4종 렌더 확인(기존과 동일)
  - Failure probe: 필수 필드 누락 JSON → 어떤 필드가 없는지 명시하는 에러 + exit 1 (조용한 폴백 금지)
  - Commit: `feat(agent): SF1 step 1 — studio data JSON + make-studio.py`
- [ ] Step 2 — 계약 교체 + 배포 + E2E (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/brief-studio.md`(주입 절차 절 교체), llms 배포
  - Dependencies: Step 1
  - Verify: 커스텀 데이터 1건(브리프 가정) 생성→Playwright 커스텀 후보 렌더 관측 + `curl .../brief-studio.md` 에 신규 절차 존재 + 구 지시("블록을 교체"류) grep 0
  - Failure probe: CDN 미반영 시 재확인 절차 기록(푸시≠반영 — 영상 로테이션 전례)
  - Commit: `feat(agent): SF1 step 2 — injection contract + deploy + E2E`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: revert (템플릿 폴백 렌더가 보존되므로 부분 실패에도 기존 경로 유지)

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "단일 레포 내부 툴링 — 파일 2~3개, 검증 커맨드 명확"
    target_roles: []
    execution_path: local_manual
  spec_delta: "스튜디오 주입 계약: 수동 편집 → 데이터 JSON + 1커맨드 생성"
  perspectives:
    product: "매 의뢰 반복 작업의 오류·비일관 제거 — 도구화"
    architecture: "템플릿/데이터 분리, self-contained 산출 계약 불변"
    security: "-"
    qa: "동일 렌더 실측 + 불량 JSON 실패 경로"
    skeptic: "분리로 파일 2개 — 구 지시 잔존 시 에이전트 회귀 (프리모템 1, grep 0 으로 방어)"
  dod:
    - "1커맨드 생성 + Playwright 실구동 (기본·커스텀 각 1)"
    - "불량 JSON 명시 에러 (실패 모드)"
    - "계약 배포 curl + 구 지시 grep 0"
```

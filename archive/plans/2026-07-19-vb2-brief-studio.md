# Plan - VB2 브리프 스튜디오

Date: 2026-07-19
Milestone: VB2 (`ROADMAP.md`, pending — Visual Brief 2/4)
Status: approved (2026-07-19 — 사용자 horizon 승인)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-visual-brief.md` (active, 2/4)
- Milestone: VB2 — 브리프 스튜디오

## Scope

풀 브리프의 컬러·타이포·인터랙션 도메인을 실물 선택으로 올리는 로컬 스튜디오: 에이전트가 후보를 채운 단일 HTML(폰트=Google Fonts 스펙시멘 임베드, 컬러=팔레트 후보를 미니 UI 프리뷰에 적용, 인터랙션=살아있는 데모)을 생성·서빙 → 사용자가 브라우저에서 클릭 선택 → 선택값 수집 → DESIGN.md 반영. 정본 계약+템플릿을 llms 배포, skill/프로토콜 배선, 실연 E2E 1회.

범위 밖: 딥 브리프 섹션(VB4), 앱 네이티브 구현, askewly 컬러 페이지 신설.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `docs/design-system/brief-studio.md`(계약) + `templates/brief-studio.html`(템플릿 — 에이전트가 후보 주입)
- deploy: generate-llms-txt 등재 → push → curl
- 테스트 표면: 로컬 스튜디오 실구동(선택→수집), curl, 실연

## 결정 로그

- [사용자 확정 2026-07-19] 폰트=Google Fonts 실물 보기 / 컬러=askewly 컬러 자산 활용·coolors 임시 병행 / 인터랙션=살아있는 데모 선택.
- [AI 기본값] 선택 수집 = 로컬 python 미니 서버(POST /select 수신, 표준 라이브러리 http.server 핸들러) — 외부 의존성 0. 폰트 임베드는 Google Fonts CSS API(온라인 필요, 오프라인이면 시스템 폰트 폴백 명시).
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 스튜디오 템플릿 + 수집 서버 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html` write, `templates/brief-studio-server.py` write
  - Dependencies: VB1 완료(DESIGN.md 양식 확정 후 선택값 매핑)
  - Verify: 로컬 구동 → 3도메인 후보 렌더 → 클릭 선택 → 서버가 selections.json 기록까지 실구동
  - Failure probe: 오프라인(Fonts CSS 차단) 시 시스템 폰트 폴백으로 페이지가 깨지지 않는지 확인
  - Commit: `feat(agent): VB2 step 1 — brief studio template + collector`
- [ ] Step 2 — 계약 문서 + 배선 + 배포 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/brief-studio.md` write, `docs/design-system/design-brief.md`(§2 시각 선택 경로 추가), skill 1줄, generate-llms-txt 등재
  - Dependencies: Step 1
  - Verify: push 후 curl brief-studio.md 200 + design-brief 개정 grep + skill 재배포 grep
  - Failure probe: 스튜디오 없이도 텍스트 인터뷰로 폴백 가능함을 계약에 명시(스튜디오 구동 실패=브리프 중단이면 FAIL)
  - Commit: `feat(agent): VB2 step 2 — studio contract + wiring + deploy`
- [ ] Step 3 — 실연 E2E (changeset)
  - Artifact: changeset (evidence)
  - Files: `evidence/visual-brief/` write
  - Dependencies: Step 2, 사용자 참여(대화형)
  - Verify: 사용자가 스튜디오에서 폰트·컬러·인터랙션을 실물 선택 → DESIGN.md 반영 관측
  - Failure probe: 선택 미수신(서버/브라우저 문제) 시 텍스트 폴백 경로 실작동 확인
  - Commit: `feat(agent): VB2 step 3 — studio live E2E`

## Scope Boundary

- Execution mode: continuous
- 중단점: step-3 대화형 실연은 사용자 참여 시점 대기 가능 / blocked·error
- Rollback/cleanup: 템플릿·계약 revert + llms 재생성

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: expansion
  delegation_decision:
    remote_background_agents: skip
    reason: "템플릿·서버·계약 구현은 단일 세션 직접 수행 — 실구동 검증 포함"
    target_roles: []
    execution_path: local_manual
  spec_delta: "브리프 3도메인이 텍스트 라벨→실물 선택으로 — AskewlyDesign 앱 브리프 화면의 웹 프로토타입"
  perspectives:
    product: "디자인 결정을 눈으로 — 사용자 요청 직반영"
    architecture: "표준 라이브러리만, 정본 llms 배포, 텍스트 폴백 보존"
    security: "로컬호스트 바인딩, 외부 전송 없음"
    qa: "실구동 3도메인 + 오프라인·미수신 실패 경로"
    skeptic: "선택지 큐레이션 품질이 관건 — 후보 생성 규칙을 계약에 명시"
  dod:
    - "스튜디오 실구동: 렌더→선택→수집→DESIGN.md 반영"
    - "curl 배포 + 텍스트 폴백 계약 명시"
    - "실패 모드: 오프라인 폴백·선택 미수신 경로 확인"
```

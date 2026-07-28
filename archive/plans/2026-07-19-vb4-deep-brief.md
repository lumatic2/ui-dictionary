# Plan - VB4 딥 브리프 선택 모드

Date: 2026-07-19
Milestone: VB4 (`ROADMAP.md`, pending — Visual Brief 4/4)
Status: approved (2026-07-19 — 사용자 확정: 기본 7도메인 유지 + 선택 모드)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-visual-brief.md` (active, 4/4)
- Milestone: VB4 — 딥 브리프 선택 모드

## Scope

design-brief.md에 딥 브리프 부록 추가: 컴포넌트 스타일 수준(버튼 형태·카드 스타일·입력 필드 톤) + 헤더/푸터 정보구조(내비 항목·푸터 콘텐츠 블록) 질문 카탈로그. **발동 = 사용자 요청 또는 대규모 프로젝트(화면 3개 이상)에서 제안** — 기본 풀 브리프에는 미포함. 스튜디오 딥 섹션 연동(후보 실물 보기), 배포 + 게이트 검증.

범위 밖: 기본 7도메인 변경, 컴포넌트 recipe 신설.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `docs/design-system/design-brief.md` 부록 + `templates/brief-studio.html` 딥 섹션
- deploy: llms 재생성 → push → curl
- 테스트 표면: curl, 게이트 판정 시나리오(소형=미발동) 확인

## 결정 로그

- [사용자 확정 2026-07-19] 딥 브리프 = 선택 모드(기본 아님) — 질문 피로 방지.
- [AI 기본값] 대규모 판정 기준 = 화면 3개 이상 또는 사용자 명시. 딥 질문도 선택지+추천 형식 유지.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 딥 브리프 부록 + 스튜디오 딥 섹션 (changeset)
  - Artifact: changeset
  - Files: `docs/design-system/design-brief.md`(부록), `templates/brief-studio.html`(딥 섹션)
  - Dependencies: VB2 완료(스튜디오 존재)
  - Verify: 부록에 컴포넌트·IA 카탈로그 + 발동 규칙 존재, 스튜디오 딥 섹션 로컬 렌더
  - Failure probe: 소형 작업 시나리오에서 딥 브리프가 제안되지 않는 게이트 문구 확인
  - Commit: `feat(agent): VB4 step 1 — deep brief appendix + studio section`
- [ ] Step 2 — 배포 + 검증 (changeset)
  - Artifact: changeset
  - Files: llms 산출물, `evidence/visual-brief/`
  - Dependencies: Step 1
  - Verify: push 후 curl 부록 grep + 게이트 양방향(발동 제안/미발동) 판정 기록
  - Failure probe: CDN 미반영 폴링
  - Commit: `feat(agent): VB4 step 2 — deploy + gate check`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: changeset revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "문서 부록 + 템플릿 섹션 — 직접 수행"
    target_roles: []
    execution_path: local_manual
  spec_delta: "브리프에 선택형 딥 모드 — 기본 게이트 불변"
  perspectives:
    product: "정밀함은 원할 때만 — 피로 방지 유지"
    architecture: "부록 형태, 기본 계약 불변"
    security: "secret 없음"
    qa: "게이트 양방향 판정"
    skeptic: "딥 모드가 기본을 침식하지 않는지 발동 규칙 명문화"
  dod:
    - "curl 부록 배포 확인"
    - "게이트 양방향 판정 기록"
    - "실패 모드: 소형 시나리오 미발동 확인"
```

# PLAN — TPS3 브라우저 템플릿 스튜디오

> 생성: 2026-07-19 · 갈래: product · scope 결정: JSON 장면의 브라우저 렌더·기본 편집·내보내기까지
Status: proposed (awaiting run approval)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집 가능한 템플릿 제작 시스템 (← `plans/horizons/2026-07-template-production-system.md`)
- **milestone**: TPS3 — 렌더 표면과 편집/내보내기 표면을 나누고 브라우저 통합검증을 수행한다.

## Scope Boundary
- **결정**: 새 `apps/template-studio` Vite/React 앱을 만들되 기존 agent-design 앱과 캔버스 런타임을 복제하지 않고 core 패키지만 소비한다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: 앱 디렉터리와 changeset별 연결을 독립 revert; Playwright 서버/산출물 정리.

## 스캐폴딩 결정
- source-of-truth: 장면은 `CanvasDocument`; UI는 편집 draft만 보유하고 저장 시 core operation으로 반영한다.
- 검증: Vitest DOM tests, Vite build, Playwright desktop/mobile smoke와 JSON round-trip.
- 배포/운영: 로컬 브라우저 앱만; 공개 hosting과 기존 사이트 navigation 편입은 제외한다.
- 화면: `DESIGN.md` token을 따르는 캔버스·레이어 목록·속성 패널·형식/fixture 선택기.
- 내보내기: scene JSON, self-contained HTML, SVG. PNG/PDF는 제외한다.
- 검토 후 제외: 인증·DB·협업·결제·라이브 AI — 독립 편집 루프 검증에 불필요.

## 결정 로그
- status: resolved
- 기존 `apps/agent-design`는 범용 코드 네이티브 캔버스다. 템플릿 스튜디오는 좁은 제품 표면으로 분리하고 같은 core를 공유한다.

## Step 트리
- [ ] **step-1 — scene-renderer-and-shell**
  - Artifact: `apps/template-studio`가 fixture 장면을 HTML/CSS/SVG로 렌더하고 레이어/토큰 정보를 표시한다.
  - Files: `DESIGN.md`, `apps/agent-design` 관례, `apps/template-studio/{package.json,src/**,tests/**}`.
  - Dependencies: TPS2 complete
  - Verify: app test/build + Playwright에서 세 fixture nonblank·overlap smoke.
  - Failure probe: invalid document가 빈 화면 대신 진단 패널을 표시한다.
  - Commit: changeset `template-studio-renderer`.
- [ ] **step-2 — edit-and-export-loop**
  - Artifact: 텍스트/이미지/semantic token 변경과 HTML/SVG/JSON 내보내기, 재가져오기 왕복.
  - Files: `apps/template-studio/src/{editor,exporters,components/**}`, integration tests.
  - Dependencies: step-1
  - Verify: Playwright로 편집→내보내기→재가져오기 후 장면 signature/표시값 일치.
  - Failure probe: 깨진 JSON·지원하지 않는 asset scheme·필수 슬롯 삭제를 내보내기 전에 차단한다.
  - Commit: changeset `template-studio-edit-export`.

## 검증/DoD
- **DoD**: 사용자가 세 fixture를 브라우저에서 보고 수정하고 세 포맷으로 내보낸 뒤 JSON 왕복으로 동일 편집 상태를 복원한다.

## finding 큐
- 범용 agent-design 앱과의 UI 통합은 장면 계약이 안정된 뒤 별도 후보로 둔다.

## 진행 로그
- 2026-07-19 계획 작성, 구현 승인 대기.

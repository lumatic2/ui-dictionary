# QA2 Dogfooding 체크리스트 — AskewlyDesign 설치본

Date: 2026-07-12
Milestone: QA2 Step 2 (evidence)
Build: changeset #84 재패키징 산출물 (미서명 dev 인스톨러). 구동: 설치본(`%LOCALAPPDATA%\askewly_design`)을 CDP(remote debugging)로 사람 시나리오 순서대로 조작. 콘솔 에러는 전 구간 0.

## 설치 lifecycle (Step 1 evidence)

- [x] 인스톨러 실행 → `%LOCALAPPDATA%\askewly_design` 설치
- [x] 시작 메뉴/바로가기 이름 = AskewlyDesign (`Programs\Askewly\AskewlyDesign.lnk` + 바탕화면)
- [x] 첫 실행 성공 (`docs/research/assets/qa2-step1-installed-launch.png`)
- [x] 언인스톨 → 잔여물 관측 (lifecycle 스크립트 PASS — squirrel tombstone만 허용 목록 내)
- [x] 재설치 → 정상 실행 (영구 설치본)

## Dogfooding 시나리오 (Step 2)

- [x] 첫 실행 UX: onboarding 히어로("Turn your React project into a visual canvas" + Open project) 노출 — 단 배후 캔버스·상태바는 결함 #4/#6 참조
- [x] 프로젝트 trust·열기 — trust는 `trusted-projects.json` 시드로 수행(네이티브 폴더 픽커는 OS 다이얼로그라 자동화 불가 → **사용자 수동 확인 항목**). 신뢰된 프로젝트는 재실행 시 자동 오픈 (`qa2-step2-project-open.png`)
- [x] 모바일 뷰포트 preset 전환 — Viewport → mobile, revision 0→1 정상
- [x] Insert palette recipe 노출 — recipe 35종 전부 팔레트에 노출
- [ ] **recipe 삽입 — 실패 (결함 #1)**: primitive/registry/recipe 모든 삽입이 "unsupported canvas operation"으로 거부
- [x] 노드 속성 편집 → 캔버스 반영 (label 편집, revision 3, `qa2-step2-edited-saved.png`)
- [ ] **Undo/Redo 왕복 — 실패 (결함 #2)**: 버튼이 데스크톱 브리지 모드에서 항상 disabled
- [x] 저장 — persistence "saved 392072 bytes"
- [x] 앱 재시작 → 문서 연속성: "desktop ready · recovered", revision 3·편집 라벨 유지 (`qa2-step2-restart-continuity.png`)
- [x] 에러 표면: 프로젝트 폴더 소실 후 재실행 — **에러 없음, 조용한 폴백 (결함 #3)** (`qa2-step2-missing-project-fallback.png`)

## 결함 목록 (심각도: blocker / major / minor / polish)

| # | 심각도 | 표면 | 증상 | 라우팅 |
|---|--------|------|------|--------|
| 1 | major | 캔버스 삽입 | 팔레트 삽입(primitive·registry·recipe) 전부 "unsupported canvas operation" 거부. 원인: `apps/agent-design-desktop/src/contract.ts:249` operation 화이트리스트에 UX2 `batch` 타입 누락 — dev 브라우저(브리지 없음)에서만 검증돼 갭이 숨어 있었음 | **해소 — QA2 Step 6** (changeset #88): batch 계약 확장 + packaged E2E registry 조립 시나리오로 상시 회귀 방어. 설치본도 수정 빌드로 갱신 재설치 |
| 2 | major | 편집 히스토리 | 데스크톱 브리지 모드에서 Undo/Redo 버튼 항상 disabled — 사람 편집이 transaction으로 브리지에 적용되고 로컬 히스토리가 채워지지 않음 | 유지보수 신규 (ROADMAP 후보 등재; Step 5 undo 시맨틱과 인접) |
| 3 | major | 에러 표면 | 신뢰 프로젝트 폴더가 사라져도 안내 없음 — 조용히 offline 데모 캔버스로 폴백, 사용자는 프로젝트가 왜 안 열리는지 알 수 없음 | 유지보수 신규 (ROADMAP 후보 등재) |
| 4 | major | 첫 실행/프로덕션 셸 | 설치 제품의 기본 문서가 1,000-node 벤치마크 fixture이고 dev 계기판(fixture-size·editor-plane-mode·Apply demo operation·Instance 버튼 다수)이 그대로 노출 | 유지보수 신규 (ROADMAP 후보 등재) |
| 5 | minor | 프로필 이관 | 구 "Agent Design" 프로필(`%APPDATA%\Agent Design`)이 리네임 후 미이관 — 기존 워크스페이스 연속성 없음 (현재 실사용자 0이라 영향 없음) | 기록만 |
| 6 | polish | 상태바 | onboarding 빈 상태에서 상태바가 "1,000 nodes · Offline" 표시 (#4 파생) | #4에 흡수 |

## 관측 노트

- 정상 동작 확인: trust 자동 오픈, 모바일 preset, 속성 편집→저장, 재시작 복구(recovered), 언인스톨 lifecycle, 콘솔 에러 0.
- 결함 #1은 dev(vite, 브리지 없는 로컬 문서)와 desktop(브리지 canonical 문서) 검증 경로 차이가 만든 갭 — "웹 E2E 통과 ≠ 데스크톱 동작"의 실증. 이후 창작 기능은 packaged E2E에 함께 태워야 함 (Step 6의 존재 이유).
- 계획 결정대로 이 milestone에서는 결함을 고치지 않고 목록화·라우팅만 수행 (#1만 Step 6 범위에 원래 포함).
- 네이티브 폴더 픽커·SmartScreen 경고 화면은 자동화 밖 — 사용자가 직접 앱을 열어볼 때 확인 권장.
- SmartScreen 실패 모드 관측 결과: 로컬 빌드 인스톨러는 Mark-of-the-Web이 없어 SmartScreen이 발동하지 않음(정상). 웹 배포 다운로드 경로에서는 미서명 경고가 예상되며, 이는 배포 horizon(H3)의 서명 결정과 함께 재관측한다.
- Step 6 완료 후 설치본은 batch 계약 수정이 포함된 빌드로 갱신 재설치됨 — 팔레트 삽입이 설치본에서도 동작 (packaged E2E로 관측).

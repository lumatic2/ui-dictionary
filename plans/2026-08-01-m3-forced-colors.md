# PLAN — M3: forced-colors(고대비 모드) 대응 (다크 이월 2/3)

> 생성: 2026-08-01 · 갈래: product 기능/화면(접근성 렌더링 모드) · scope: 사이트 셸이 `@media (forced-colors: active)` 에서 판독·조작 가능하도록 감사→수리. goal `dark-carryover` 2번 milestone.
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M2→M3→M4 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 디자인 시스템 정본 사이트가 접근성 렌더링 모드를 스스로 통과한다. DM1 이 정본화한 "다크모드(선호) ≠ forced-colors(접근성) — 별도 처리" 원칙의 실구현.
- **goal**: `dark-carryover` · **milestone**: M3 (M2 완료 후 연쇄 — 신설 토큰이 수리 재료가 된다).
- **리서치 입력**: `research/2026-08-01-dark-carryover-goal-inventory.md` §B + `research/2026-07-31-dark-mode-goal-dark-mode.md` §High contrast.

## Scope Boundary
- **포함**: ① forced-colors 에뮬레이션으로 셸 주요 표면(홈·용어 상세·docs·검색·topbar/사이드바·테마 토글·Pro 잠금·다이얼로그/시트) 감사 — 포커스 링·경계·선택 상태·오버레이·아이콘 판독성 결함 목록 ② `@media (forced-colors: active)` CSS·`forced-color-adjust`·시스템 색 키워드로 수리 ③ 색 견본(colors-page 스와치)처럼 색이 곧 정보인 요소의 `forced-color-adjust: none` 판정.
- **제외**: 데모 콘텐츠 내부(marketing-section-preview·variation-demos — 콘텐츠는 감사 대상 아님) · Windows 실물 고대비 테마 전수 매트릭스(에뮬레이션이 자동화 게이트 정본, 실물은 스팟 1회) · 라이트/다크 팔레트 변경.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 수리는 forced-colors 미디어 블록 안에 격리(일반 렌더링 무영향이 원칙) — 커밋 단위 revert. 일반 모드 회귀는 스크린샷 대조로 잡는다.

## 스캐폴딩 결정
- source-of-truth: 결함 판정 정본 = step-1 감사 장부(evidence). 구현 기법 정본 = MDN(forced-colors·forced-color-adjust·system-color — step-1 에서 본문 확인·접근일 기록).
- 검증: Playwright `emulateMedia({ forcedColors: 'active' })` 순회 스크린샷 + 키보드 포커스 순회에서 포커스 표시 전 표면 확인 + 일반(라이트/다크) 모드 스크린샷 무손실 + build·lint PASS.
- 배포/운영: push·배포는 goal 마감(M4) 시 일괄. M3 는 로컬 검증까지.
- 자기선언 도메인 — **일반 모드 무영향 계약**: 수리는 `@media (forced-colors: active)` 블록·투명 outline 등 forced-colors 에서만 발현하는 수단을 우선한다. 일반 모드 픽셀이 바뀌는 수단(예: box-shadow → outline 전환)은 라이트/다크 대조로 무손실 확인 후에만 채택.
- 검토 후 제외: prefers-contrast(more/less) 대응 — forced-colors 와 다른 축, 이번 goal 범위 밖(finding 후보).

## 결정 로그
- status: resolved
- **범위 = 셸만** (기술 결정 — 데모 콘텐츠는 per-example 격리 원칙 기존 확정과 동일 논리): 감사·수리 모두 사이트 셸 표면. 콘텐츠 내부 결함은 finding 큐로만.
- **기술 결정**: ① 자동화 게이트 = Playwright 에뮬레이션(재현 가능), Windows 실물은 마감 전 스팟 1회 ② 포커스 링 수리는 투명 outline 병행 방식 우선(box-shadow 는 forced-colors 에서 소멸) ③ 색-정보 요소(스와치·브랜드 로고)는 `forced-color-adjust: none`.
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [ ] **step-1 — 감사: 에뮬레이션 순회 + 결함 장부**
  - Artifact: MDN 3문서 본문 확인(접근일 기록, research §B 갱신) + Playwright forced-colors 에뮬레이션으로 셸 표면 순회 스크린샷 + 키보드 포커스 순회 → 결함 목록(요소·증상·수리 수단)을 `evidence/dark-carryover/m3-forced-colors.md` 에 장부화.
  - Files: write evidence/dark-carryover/m3-forced-colors.md, research/2026-08-01-dark-carryover-goal-inventory.md(§B 접근일 갱신). read src/index.css, src/components/*(순회 표면).
  - Risk: 기계적 (읽기 전용 감사)
  - Dependencies: 없음
  - Verify: 순회 표면 전 항목에 스크린샷 증거 + 결함마다 수리 수단 후보 명시(빈 증상 서술 금지).
  - Failure probe: 에뮬레이션이 실제 강제 팔레트와 다르게 렌더하는 표본 1건을 Windows 실물 고대비로 교차 확인 — 어긋나면 감사 신뢰도에 기록.
  - Commit: changeset `m3-forced-colors` (README 절: step-1).

- [ ] **step-2 — 수리 + 게이트 (M3 마감)**
  - Artifact: 결함 전건 수리 — `@media (forced-colors: active)` 블록(시스템 색 키워드)·투명 outline 포커스 링·`forced-color-adjust: none` 판정 적용 + 에뮬레이션 재순회로 잔여 0 + evidence 마감.
  - Files: write examples/ui-vocabulary-site/src/index.css, (필요 시) 해당 컴포넌트 파일, evidence/dark-carryover/m3-forced-colors.md. read step-1 장부.
  - Risk: 위험 (전역 CSS 수정 — 일반 모드 무영향 계약, 라이트/다크 스크린샷 대조로 격리)
  - Dependencies: step-1
  - Verify: 에뮬레이션 재순회 결함 잔여 0 + 라이트/다크 일반 모드 스크린샷 무손실 + 키보드 포커스 순회 전 표면 포커스 가시 + build·lint PASS. **+ 사람 핸드오프 게이트 1회**: Windows 실물 고대비(OS 설정 토글)는 에이전트가 못 켠다 — 사용자에게 켜는 법 안내 후 스팟 관측 요청(예정된 정지점, M4 시안 관측과 같은 성격).
  - Failure probe: 다크모드(.dark)와 forced-colors 가 동시 활성일 때 규칙 충돌(specificity)로 판독 불가 지점 — 다크+forced 조합 1순회 확인.
  - Commit: changeset `m3-forced-colors` (README 절: step-2).

## 검증/DoD
- **DoD**: forced-colors 에뮬레이션에서 셸 주요 표면이 판독·조작 가능(포커스 가시·경계 유지·선택 상태 구분·색-정보 요소 보존)하고, 일반 라이트/다크 모드 무손실이 확인된다. 실패 모드: 다크+forced 동시 활성 조합도 확인한다.
- **Evidence**: `evidence/dark-carryover/m3-forced-colors.md`
- **회귀 게이트**: 라이트/다크 스크린샷 무손실 + build·lint PASS + Playwright 콘솔 0에러.

## finding 큐
- (실행 중 발견 — 데모 콘텐츠 내부 forced-colors 결함은 여기로만)

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — M2: status.* 그룹 신설(accent 충돌 회피)·DESIGN.md 재생성 부작용·llms 별도 커맨드 명시·destructive-foreground 승격 근거, M4: og:image 셸 단일 전제 정정, M3: 실물 고대비 사람 핸드오프 명시.

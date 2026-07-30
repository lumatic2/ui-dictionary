# PLAN — DM3: 다크모드 활성화 (다크모드 정비 3/3)

> 생성: 2026-07-31 · 갈래: product 기능/화면(전역 테마) · scope: 3-상태 토글 재배선 + FOUC 방지 + 다크 품질 점검 + 실배포·사람 관측. goal `dark-mode` 3번 milestone.
Status: approved (사용자 승인 2026-07-31 "ㄱㄱ" — 연쇄 DM1→DM2→DM3 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 성공 모습의 "화면 게이트 = 상태·다크모드"를 자기 사이트가 통과한다.
- **goal**: `dark-mode` · **milestone**: DM3 (DM2 완료 후 — 셸 토큰화가 선행 조건. 2026-07-28 차단 사유가 DM2 로 제거된 뒤에만 켠다).
- **리서치 입력**: `research/2026-07-31-dark-mode-goal-dark-mode.md` §A-3(3-상태)·§C(FOUC·color-scheme·theme-color·트랜지션·이미지)·§B-3(WCAG 테마별 재검증).

## Scope Boundary
- **포함**: ① `.dark` 강제 제거 useEffect 삭제 + `SiteThemeToggle` 3-상태(라이트/다크/시스템) 재배선(localStorage `askewly-theme`·matchMedia change 리스너) + topbar 노출 ② FOUC 방지 인라인 스크립트(`index.html` head — 프리렌더 셸 템플릿이라 전 754 라우트 적용) + `color-scheme` 선언 + `meta theme-color` 테마 분기 ③ 데모 프리뷰 "system" 기준을 사이트 전역 테마 추종으로 교체(사용자 확정 2026-07-31) ④ 다크 표면 품질 점검 — 주요 화면 순회·WCAG 대비 재검증·이미지/미니목 어색 지점 수리 ⑤ 통합 검증 + 실배포 + 사람 관측 1회.
- **제외**: 데모 콘텐츠(marketing-section-preview) 내부 색 변경 · DESIGN.md 다크 토큰 값 전면 재설계(기존 `themes.dark` 기반 미세 조정만 — 전면 재설계가 필요하면 blocked 로 정지) · forced-colors 대응(finding 후보) · 다크 전용 이미지 에셋 제작(어색 지점은 finding 큐 — 스코프 판단 후).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / 사람 관측 대기(push 후 사용자 왕복)
- rollback/cleanup: 토글 배선은 커밋 단위 revert. 최악 시 2026-07-28 차단 useEffect 복원 한 줄로 라이트 고정 원상복구 가능 — 안전한 되돌림 경로 존재.

## 스캐폴딩 결정
- source-of-truth: 다크 토큰 정본 = `DESIGN.md` `themes.dark` → `src/tokens.css` `.dark`(generate-tokens.mjs — 값 수정은 DESIGN.md 에서 시작해 재생성) · 테마 상태 정본 = `<html>` 클래스 + localStorage `askewly-theme`(3-상태: "light"/"dark"/없음=시스템) · FOUC 스크립트 정본 = `index.html` head 인라인(Tailwind 공식 스니펫 기반).
- 검증: build·lint(스캐너 포함) PASS + Playwright 라이트/다크 각각 주요 5화면 콘솔 0에러 + WCAG 대비 — 디자인 lint contrast 단계가 `themes.dark` 쌍을 검사하는지 확인, 안 하면 다크 쌍 검사 추가 + 실배포 스팟 체크 + **사람 관측 1회(DoD — 취향 게이트)**.
- 배포/운영: push = Cloudflare Pages 자동 배포. **push 전 세션 단위 일괄 사전 보고 후 사용자 승인**(deploy-batching + authoring workflow 규약 — 승인 없이 push 금지). 라우트 무변경.
- 자기선언 도메인 — **FOUC/prerender 정합**: 754 프리렌더 라우트 전부에서 첫 페인트 전 테마가 결정되어야 한다(인라인 스크립트가 head 에서 동기 실행). 검증은 다크 상태 강제 후 하드 리로드 + 프리렌더 산출물(dist) HTML 에 스크립트 포함 여부 확인.
- 검토 후 제외: 테마 전환 view-transition 등 전환 연출 — 리서치 C-7(토글 시에만 transition) 최소 준수, 연출 고도화는 범위 밖.

## 결정 로그
- status: resolved
- **토글 패턴 (사용자 확정 2026-07-31)**: 3-상태 라이트/다크/시스템 — localStorage 명시 저장, 시스템 = 키 제거 + matchMedia 추종.
- **데모 연동 (사용자 확정 2026-07-31)**: 데모 프리뷰의 "system" 기본값이 OS 가 아니라 사이트 전역 테마를 추종. per-example 개별 토글 오버라이드는 유지.
- **기술 결정**: ① 기존 `SiteThemeToggle`(App.tsx:2285 — 미배선 구현체)을 3-상태로 손봐 재사용, 위치는 topbar ② `useSystemPreviewTheme` 훅을 "사이트 전역 테마 해석값" 기준으로 교체(OS matchMedia 직독 제거) ③ theme-color 는 `media` 속성 이중 meta(정적) — 프리렌더 스크립트 수정 불요 ④ 초기 로드 페이드 방지: 테마 transition 은 토글 클릭 시에만 일시 활성(리서치 C-7).
- 그 외 새 사용자 소유 결정: 없음. (다크 시각 취향 최종 판단 = 사람 관측 1회)

## Step 트리

- [x] **step-1 — 3-상태 테마 배선 + FOUC 방지**
  - Artifact: 차단 useEffect(App.tsx:102-107) 제거 → 3-상태 테마 상태 훅(명시 선택 localStorage·시스템 추종 matchMedia change 리스너) + `SiteThemeToggle` 재배선·topbar 노출 + `index.html` head FOUC 인라인 스크립트 + `color-scheme: light dark` + theme-color 이중 meta + 데모 프리뷰 전역 추종 교체(`useSystemPreviewTheme` 대체).
  - Files: write examples/ui-vocabulary-site/src/App.tsx, src/lib/preview-theme.ts, index.html. read src/tokens.css, scripts/prerender-ui-vocabulary.ts(셸 치환이 head 스크립트를 보존하는지).
  - Risk: 위험 (전역 상태 + 첫 페인트 경로 — FOUC 는 스크린 레코딩/하드 리로드로 검증, revert 경로 확보)
  - Dependencies: 없음 (DM2 완료가 milestone 선행 조건)
  - Verify: 토글 3-상태 순환 동작 + 새로고침 유지 + 시스템 선택 시 OS 변경 실시간 반영 + 하드 리로드 시 다크 FOUC 없음(육안) + `npm run build` 후 dist HTML 에 인라인 스크립트 존재.
  - Failure probe: ① localStorage 에 구 값·쓰레기 값("askewly-theme" 과거 삭제 로직의 잔재)이 있을 때 정상 폴백 ② 프리렌더 meta 치환 정규식이 head 스크립트를 훼손하지 않는지 dist 1라우트 실측.
  - Commit: changeset `dm3-dark-mode-activation` (README 절: step-1).

- [x] **step-2 — 다크 표면 품질 점검·수리**
  - Artifact: 다크 상태로 주요 표면 순회(홈·용어 상세·패턴·docs·검색·Get Started·Pro 잠금) — 깨지는 지점(대비 미달·라이트 전제 이미지·미니목·그림자 elevation) 수리. WCAG 대비: 다크 쌍 검사는 **이미 존재**(fresh 검증자 실측 — `scripts/lint-tokens.mjs:140-158` light/dark 양쪽 AA 4.5:1, `scripts/lint/index.js` 테마별 순회) — 통과 확인만, 신규 구현 금지. 수리 불가·스코프 밖 지점은 finding 큐.
  - Files: write 수리 대상 컴포넌트(순회 후 확정), scripts/lint/(다크 대비 검사 추가 시), DESIGN.md·재생성(토큰 값 조정 시). read research 문서 §B.
  - Risk: 위험 (다크 시각 품질 — 화면 실관측 기반, 파일 단위 커밋)
  - Dependencies: step-1
  - Verify: 기존 다크 대비 lint(lint-tokens·design-lint) PASS + 주요 7표면 다크 스크린샷 육안 점검 통과 + 라이트 무회귀(스크린샷 대조).
  - Failure probe: ① Pro 잠금 오버레이·코드 블록 등 어두운 요소가 다크에서 배경과 뭉개지는 지점 ② 데모 카드 경계 — 전역 다크 + 데모 라이트 오버라이드 혼합 화면이 성립하는지.
  - Commit: changeset `dm3-dark-mode-activation` (README 절: step-2).

- [ ] **step-3 — 통합 검증 + 실배포 + 사람 관측 (DM3·goal 마감)**
  - Artifact: 통합 검증 + `evidence/dark-mode/dm3-activation.md` + **사용자 사전 보고·승인 후** push·실배포 스팟 체크 + 사람 관측 요청(다크/라이트/시스템 전환·모바일 포함).
  - Files: write evidence/dark-mode/dm3-activation.md. 실행: build·lint·스캐너·Playwright(라이트/다크 × 5화면)·push(승인 후)·실배포 확인.
  - Risk: 기계적 (검증·기록·배포 확인 — push 는 승인 게이트 뒤)
  - Dependencies: step-2
  - Verify: 전 게이트 PASS + 실배포에서 토글 동작·FOUC 없음·프리렌더 라우트 직접 진입(용어 상세 1건) 다크 정상 + 사람 관측 1회 통과.
  - Failure probe: ① 시크릿 창(localStorage 없음)+OS 다크 — 첫 페인트부터 다크인지 ② 오너 로그인 세션 회귀 — 테마 상태가 로그인 상태·Pro 언락과 간섭 없는지.
  - Commit: changeset `dm3-dark-mode-activation` (README 절: step-3).

## 검증/DoD
- **DoD**: 실배포 사이트에서 3-상태 다크모드가 FOUC 없이 동작하고(프리렌더 라우트 직접 진입 포함), 다크 대비 lint 와 주요 표면 점검을 통과하며, 사람 관측 1회 통과.
- **Evidence**: `evidence/dark-mode/dm3-activation.md`
- **회귀 게이트**: 라이트 모드 무회귀(스크린샷 대조) + 오너 언락·검색·내비 무회귀 + Playwright 콘솔 0에러 + 스캐너 셸 0 유지.

## 수치 출처
- 인프라 현황(.dark 토큰·토글 구현체·차단 useEffect 위치) = 2026-07-31 Explore 실측. FOUC·3-상태·color-scheme 규격 = research 문서 §C(출처 전건).

## finding 큐
- (실행 중 발견 항목을 여기 적는다 — 다크 전용 이미지 에셋·forced-colors 대응 등 스코프 밖 후보 포함)
- 홈 히어로 장식 낙하 블록: 토큰화로 다크에서 밝은 블록으로 인버스 — 의도적 대비 장식으로 성립한다고 판정, 최종은 사람 관측.
- step-2 수리 0건 — DM2 셸 토큰화가 다크 품질을 이미 확보(8표면 순회·기존 다크 대비 lint 2종 PASS). forced-colors 대응·다크 전용 og-image 는 스코프 밖 후보 유지.

## 진행 로그
- 2026-07-31 작성.
- 2026-07-31 fresh 검증자(sonnet) 반영 — 다크 대비 검사 기존 존재 확인(신규 구현 컷). SiteThemeToggle 미배선·프리렌더 head 보존·preview-theme 단일 호출부 전제 전부 실측 검증됨.

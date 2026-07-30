# PLAN — DM2: 사이트 셸 토큰 치환 + 하드코딩 색 스캐너 (다크모드 정비 2/3)

> 생성: 2026-07-31 · 갈래: product 기능/화면(사이트 셸 색 체계) · scope: 셸 하드코딩 리터럴 색 → semantic 토큰 치환(라이트 시각 무손실) + 재발 방지 스캐너 게이트. goal `dark-mode` 2번 milestone.
Status: approved (사용자 승인 2026-07-31 "ㄱㄱ" — 연쇄 DM1→DM2→DM3 일괄 승인)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "모든 색은 시맨틱 토큰을 거친다"(Primer 원칙, 레포 3-tier 규칙)를 자기 사이트가 먼저 지킨다.
- **goal**: `dark-mode` · **milestone**: DM2 (DM1 완료 후 연쇄). 2026-07-28 다크 차단 사유("카탈로그 하드코딩 색과 충돌")의 원인 제거가 이 milestone 이다.
- **리서치 입력**: `research/2026-07-31-dark-mode-goal-dark-mode.md` §B-4(시맨틱 토큰 강제)·§E(실측: 셸 하드코딩 455건+α, 게이트 갭).

## Scope Boundary
- **포함**: ① 하드코딩 리터럴 색 클래스 스캐너(셸 스코프) 신설 + 게이트 배선 ② 셸 파일 치환 — `App.tsx`(183)·`home-page.tsx`(177)·`article-documentation-layout.tsx`(95)·`term-visual.tsx`(21)·잔여 소수(colors-page 등 1~2건 파일) → `bg-background`/`text-foreground` 등 semantic 토큰 클래스, **라이트 모드 시각 무손실**(다크 활성화는 DM3).
- **제외**: `marketing-section-preview.tsx`(1,925건 — 데모 콘텐츠 자체, per-example 테마로 이미 격리) · `variation-demos/`(이미 토큰 기반) · 다크모드 활성화·토글(DM3) · tokens.css/DESIGN.md 토큰 값 변경.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 기존 파일 수정 중심 — 커밋 단위 revert. 치환은 시각 무손실 계약이므로 스크린샷 대조 실패 시 해당 파일 단위로 되돌린다.

## 스캐폴딩 결정
- source-of-truth: semantic 토큰 정본 = `DESIGN.md` → `src/tokens.css`(generate-tokens.mjs 생성물) → Tailwind `@theme inline` 매핑(`src/index.css`). 치환 대상 판정 정본 = 신설 스캐너의 스코프 목록(셸 파일 명시 + 데모 파일 allowlist).
- 검증: 스캐너 셸 스코프 위반 0 + `npx @askewly/design verify` 비악화 + site build·lint PASS + 라이트 모드 스크린샷 대조(주요 5화면: 홈·용어 상세·패턴·docs·검색 — 데스크톱 1440px·모바일 390px) + Playwright 콘솔 0에러.
- 배포/운영: push·배포는 DM3 마감 시 일괄. DM2 는 로컬 검증까지 — 시각 무손실이라 단독 배포 가치도 없음.
- 자기선언 도메인 — **시각 무손실 계약**: DM2 는 라이트 모드 픽셀 변화가 목적이 아니다. `bg-white`→`bg-background` 치환은 라이트에서 동일 색으로 해석되어야 하며, 매핑이 1:1 이 아닌 지점(예: slate-100 vs surface.muted 미세 차)은 finding 큐에 적고 시각 대조로 사용자 감지 가능 여부를 판단한다.
- 검토 후 제외: 스캐너의 verify(@askewly/design) 통합 — 배포된 외부 패키지 개편은 이 goal 범위 밖. 로컬 스크립트 + npm script 게이트로 충분, verify 통합은 finding 후보.

## 결정 로그
- status: resolved
- **범위 (탐색 실측 기반)**: 치환 = 셸 파일만, 데모 콘텐츠(marketing-section-preview·variation-demos) 제외 — 데모는 per-example 테마 prop 으로 이미 격리(2026-07-31 탐색 §E). 사용자 확정한 데모 연동 방식(전역 추종)은 DM3 소관.
- **기술 결정**: ① 스캐너는 정규식 기반 로컬 스크립트(`scripts/lint-hardcoded-colors.mjs` 계열) — 대상 패턴: `bg|text|border|ring|divide|from|via|to|fill|stroke`-`white|black|slate|gray|zinc|neutral|stone|red|...` 리터럴 팔레트 클래스 + hex 리터럴, 스코프 = src 전체에서 allowlist(데모 파일) 제외 ② 치환 중 semantic 토큰에 대응 없는 색(예: 포인트 컬러 계열)은 tokens 추가가 아니라 finding 큐 — 토큰 신설은 DESIGN.md 소관이라 별도 판단 ③ 파일 단위 커밋(App.tsx / home-page / article+잔여)으로 revert 격리.
- 그 외 새 사용자 소유 결정: 없음. (시각 무손실 최종 판단은 스크린샷 대조 — 어긋나면 관측에서 잡힌다)

## Step 트리

- [ ] **step-1 — 하드코딩 색 스캐너 + baseline**
  - Artifact: `examples/ui-vocabulary-site/scripts/lint-hardcoded-colors.mjs` 신설 — 리터럴 팔레트 클래스·hex 검출, allowlist(marketing-section-preview.tsx·variation-demos 등 데모 콘텐츠) 명시, 파일별 건수 리포트 + `--max` 임계 exit code. package.json script(`lint:colors`) 등록, 현재 baseline 기록.
  - Files: write examples/ui-vocabulary-site/scripts/lint-hardcoded-colors.mjs, examples/ui-vocabulary-site/package.json. read src/(대상 파일 목록 실측).
  - Risk: 기계적 (읽기 전용 스캐너 — 오탐은 baseline 대조로 즉시 드러남)
  - Dependencies: 없음
  - Verify: 스캐너 실행 — 셸 파일 건수가 탐색 실측(App 183·home 177·article 95·term-visual 21)과 동일 자릿수로 일치 + allowlist 파일 미포함 + exit code 동작(임계 초과 시 1).
  - Failure probe: `dark:bg-slate-900` 같은 variant 클래스·주석 안 문자열 오탐 여부 — 표본 3건 수동 대조.
  - Commit: changeset `dm2-shell-tokenization` (README 절: step-1).

- [ ] **step-2 — App.tsx·home-page.tsx 토큰 치환**
  - Artifact: 두 파일의 리터럴 색 클래스(183+177건)를 semantic 토큰 클래스로 치환 — 라이트 시각 무손실. 1:1 대응 없는 색은 finding 큐 기록 후 현상 유지.
  - Files: write examples/ui-vocabulary-site/src/App.tsx, src/components/home-page.tsx. read src/tokens.css, src/index.css(@theme 매핑).
  - Risk: 위험 (사이트 최상위 표면 대량 수정 — 스크린샷 대조 + 파일 단위 커밋으로 격리. 실건수가 추정을 크게 웃돌아 한 pass 로 안 닫히면 파일 단위(App.tsx / home-page.tsx)로 쪼개 진행 — 커밋 경계는 이미 파일 단위라 재승인 불요)
  - Dependencies: step-1
  - Verify: 스캐너 두 파일 잔여 0(finding 등재분 제외) + build·lint PASS + dev 스크린샷 대조(홈·검색·topbar/사이드바 1440px·390px) 라이트 무손실 + 콘솔 0에러.
  - Failure probe: 카카오 로그인 버튼 hex(`#fee500` — SQ3 finding 잔존)·Pro 배지 등 브랜드 고정색이 semantic 으로 잘못 흡수돼 색이 바뀌는 지점 — 치환 전후 diff 에서 브랜드색 라인 수동 검수.
  - Commit: changeset `dm2-shell-tokenization` (README 절: step-2).

- [ ] **step-3 — article layout·잔여 파일 치환 + 게이트 통합 (DM2 마감)**
  - Artifact: `article-documentation-layout.tsx`(95)·`term-visual.tsx`(21)·잔여 소수 파일 치환 + `lint:colors` 를 lint 파이프라인(npm run lint 또는 build 전 훅)에 배선 — 셸 스코프 위반 0 게이트화 + `evidence/dark-mode/dm2-shell-tokenization.md`.
  - Files: write src/components/article-documentation-layout.tsx, src/components/term-visual.tsx, 잔여 1~2건 파일, package.json, evidence/dark-mode/dm2-shell-tokenization.md.
  - Risk: 기계적 (step-2 와 동일 절차의 잔여분 + 게이트 배선)
  - Dependencies: step-2
  - Verify: 스캐너 셸 스코프 전체 0(finding 등재분 제외) + build·lint(스캐너 포함) PASS + verify 비악화 + docs/용어 상세 스크린샷 대조 + Playwright 5화면 콘솔 0에러.
  - Failure probe: term-visual 은 용어 미니목 시각 — 치환이 미니목 색 의미(예: 의도된 대비 표현)를 죽이는지 상세 3종 육안 확인.
  - Commit: changeset `dm2-shell-tokenization` (README 절: step-3).

## 검증/DoD
- **DoD**: 셸 파일 하드코딩 색이 semantic 토큰으로 치환되어 스캐너 셸 스코프 위반 0 이 게이트로 걸리고, 라이트 모드 시각 무손실(스크린샷 대조)이 확인된다.
- **Evidence**: `evidence/dark-mode/dm2-shell-tokenization.md`
- **회귀 게이트**: 라이트 스크린샷 대조 무손실 + verify 비악화 + build·lint PASS + Playwright 콘솔 0에러.

## 수치 출처
- 하드코딩 건수(4,983/14파일, 셸 455+α) = 2026-07-31 Explore 실측(rg 카운트). **예비 추정치다** — fresh 검증자 재측정은 정규식에 따라 App 279·home 214·article 145 로 갈렸다. **정확한 건수의 정본 = step-1 신설 스캐너의 실행 결과**이며, 리서치 수치를 목표치로 취급하지 않는다. 다크 차단 결정문 = `src/App.tsx:102-107`(2026-07-28).

## finding 큐
- (실행 중 발견 항목을 여기 적는다 — 특히 semantic 대응 없는 색·의도적 고정색)

## 진행 로그
- 2026-07-31 작성.
- 2026-07-31 fresh 검증자(sonnet) 반영 — baseline 수치는 예비 추정 명시(스캐너 결과가 정본), step-2 실건수 초과 시 파일 단위 분할 명시.

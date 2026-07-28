# PLAN — SQ1: 디자인 verify 위반 정리 (사이트 품질 1/4)

> 생성: 2026-07-28 · 갈래: product 기능/화면(기존 데모 코드 정비) · scope: `src/components` 디자인 verify 위반 전량 해소 + VI8 이월 finding 2건(쇼케이스 하드코딩 hex·oklch→hex 유틸). goal `site-quality` 1번 milestone.
Status: approved (사용자 승인 2026-07-28 — "사이트 품질 milestone 4개 규모 작업을 먼저" · SQ1 선착수, 새 사용자 소유 결정 없음)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "사람이 둘러보는 공개 웹사이트" 축의 품질. 자기 사이트가 자기 디자인 게이트를 통과 못 하는 상태의 해소.
- **goal**: `site-quality` — 사이트 품질 (사용자 확정 2026-07-28: ③ 순서 → 이번 세션 선착수 확정) · **milestone**: SQ1.
- **리서치 입력**: 조사 = 이 세션 실측 (별도 research 문서 불요 — 검사기 1회 실행으로 전수 파악됨). `npx @askewly/design verify src/components --ext tsx` 실측(2026-07-28): **위반 79건** = hex-literal 26 · raw-color-fn 46 · typography-scale-exceeded 7. 파일 분포: marketing-section-preview 34 · home-page 20 · term-visual 15 · watercolor-pointer-field 3 · 기타 5개 파일 각 1 (three-object-scene-impl·term-page·shader-gradient-surface·recipe-gallery·landing-hero·colors-page·article-documentation-layout). UE2 시점 77건에서 +2 는 이후 추가 파일분.

## Scope Boundary
- **포함**: ① oklch→hex 정규화 재사용 유틸 추출 + 쇼케이스 ShaderGradientDemo 토큰 판독 전환(VI8 finding 2건) ② 색 위반 72건(hex-literal+raw-color-fn) 시맨틱 토큰화 — 장식 그라디언트는 시각 보존을 전제로 토큰 참조 CSS 변수/유틸리티로 치환 ③ 타이포 단계 초과 7건 정리 ④ 통합 검증(verify 0·build·lint·브라우저 스모크·전/후 스크린샷).
- **제외**: 다크모드 토글 재배선(④ 다크모드 goal 소관 — 단 이번 시맨틱화가 그 전제를 깐다) · O5~O9 구조 결함(SQ2·SQ3) · SSG(SQ4) · 신규 데모 추가 · 토큰 팔레트 자체 변경.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 기존 파일 수정 중심 — 커밋 단위 revert 로 원복. 시각 회귀는 전/후 스크린샷으로 즉시 판별.

## 스캐폴딩 결정
- source-of-truth: 색·타이포는 사이트 토큰 SSOT(semantic CSS 변수) — 컴포넌트 하드코딩 금지. 검사기 = `@askewly/design verify`(있는 그대로 — 규칙 수정 없음).
- 검증: verify 위반 0(불가피 예외는 검사기가 지원하는 명시 수단으로만, 장부 기록) + build·lint + Playwright 스모크(홈·용어 상세·recipe 갤러리) + 대표 표면 전/후 스크린샷 비교.
- 배포/운영: push 세션 말 일괄(Cloudflare Pages 자동 배포) → 실배포 스팟 체크.
- 자기선언 도메인 — **시각 보존 의무**: 이 milestone 은 "보이는 것을 바꾸지 않고 표현 방식을 토큰화"하는 작업이다. 장식 그라디언트·생성 아트(watercolor)는 삭제·단순화가 아니라 토큰 유래 색으로 재표현한다. 판별은 전/후 스크린샷.
- 검토 후 제외: 검사기 규칙 완화(--typography-threshold 상향 등) — 게이트를 낮춰 통과하는 것은 정리가 아니다. 미니어처 목업의 초소형 텍스트는 폰트 축소 대신 transform scale 등 구조적 해법 우선.

## 결정 로그
- status: resolved
- **범위 = 사용자 확정 큐 그대로**(2026-07-28 "사이트 품질 먼저" — SQ1은 finding 큐의 verify 위반 항목 + VI8 이월 2건). 새 사용자 소유 결정 없음 — 색 치환은 시각 보존 전제의 기술 결정, 취향 판단 발생 시(치환 불가능한 시각 변화) 중단점.
- **기술 결정**: 알파 있는 장식색은 `color-mix(in srgb, var(--token) N%, transparent)` 계열 토큰 참조로 치환 · canvas/셰이더처럼 CSS 를 못 읽는 표면은 getComputedStyle 판독(+oklch→hex 유틸) · 미니어처 타이포는 scale 구조 해법 우선.
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — oklch→hex 유틸 추출 + 쇼케이스 셰이더 토큰화 (VI8 finding 해소)**
  - Artifact: `examples/ui-vocabulary-site/src/lib/css-color.ts`(cssColorToHex — shader-gradient-surface 에서 추출, 재사용 유틸) + `home-page.tsx` ShaderGradientDemo 하드코딩 hex 5색 → 토큰 판독 전환 + `shader-gradient-surface.tsx` 가 유틸 참조.
  - Files: write examples/ui-vocabulary-site/src/lib/css-color.ts, src/components/home-page.tsx(ShaderGradientDemo 한정), src/components/shader-gradient-surface.tsx. read recipes/marketing/shader-gradient-surface.md.
  - Risk: 기계적 (신규 유틸 + 좁은 치환 — 렌더 확인으로 격리)
  - Dependencies: 없음
  - Verify: build PASS + 쇼케이스 셰이더 데모 브라우저 렌더·콘솔 0에러.
  - Failure probe: 토큰 미로딩 시점(SSR/초기)엔 getComputedStyle 이 빈 문자열 — 기존 recipe 와 같은 폴백 상수 유지.
  - Commit: changeset `sq1-design-verify-cleanup` (README 절: step-1).

- [ ] **step-2 — 색 위반 72건 시맨틱 토큰화**
  - Artifact: hex-literal 26 + raw-color-fn 46 해소 — marketing-section-preview·home-page·term-visual 중심, 장식 그라디언트는 토큰 참조 CSS 변수(color-mix)로 재표현, watercolor 생성 아트는 토큰 유래 기준색으로.
  - Files: write examples/ui-vocabulary-site/src/components/{marketing-section-preview,home-page,term-visual,watercolor-pointer-field,three-object-scene-impl,term-page,recipe-gallery,landing-hero,colors-page,article-documentation-layout}.tsx. read src/index.css(토큰 정의).
  - Risk: 위험 (넓은 시각 표면 — 전/후 스크린샷 비교로 격리, 커밋 revert 가능)
  - Dependencies: step-1
  - Verify: verify 색 위반(hex-literal·raw-color-fn) 0 + build·lint PASS + 대표 표면(홈·marketing preview·용어 상세) 전/후 스크린샷 육안 대조 기록.
  - Failure probe: color-mix 미지원 구형 브라우저 — 사이트 타깃(모던 에버그린) 기준 index.css 에 이미 쓰는 문법인지 확인 후 채택, 아니면 rgb 변수 병행.
  - Commit: changeset `sq1-design-verify-cleanup` (README 절: step-2).

- [ ] **step-3 — 타이포 초과 정리 + 통합 검증 (SQ1 마감)**
  - Artifact: typography-scale-exceeded 7건 해소(미니어처 목업은 scale 구조 해법) + 통합 검증 + `evidence/site-quality/sq1-verify-cleanup.md`.
  - Files: write examples/ui-vocabulary-site/src/components/(타이포 위반 파일들), evidence/site-quality/sq1-verify-cleanup.md. 실행: verify 전체·build·lint·Playwright 스모크(홈·/terms/accordion·/recipes)·스크린샷.
  - Risk: 기계적 (좁은 수치 치환 + 검증 실행)
  - Dependencies: step-2
  - Verify: `npx @askewly/design verify src/components --ext tsx` 위반 0 · build·lint PASS · Playwright 3라우트 렌더·콘솔 0에러 · 전/후 스크린샷 기록.
  - Failure probe: 축소 목업을 실제 폰트 크기로 올리면 카드가 깨짐 — transform scale 적용 시 레이아웃 박스(공간 점유) 확인.
  - Commit: changeset `sq1-design-verify-cleanup` (README 절: step-3).

## 검증/DoD
- **DoD**: 디자인 verify 위반 79→0(불가피 예외는 검사기 지원 수단 + 장부 명시) + 시각 보존(대표 표면 전/후 스크린샷) + VI8 이월 finding 2건 해소 + build·lint·브라우저 스모크 PASS.
- **Evidence**: `evidence/site-quality/sq1-verify-cleanup.md`
- **회귀 게이트**: Playwright 스모크(홈·용어 상세·recipe 갤러리 — 콘솔 0에러) + build·lint.

## 수치 출처
- 위반 79건·규칙별(26/46/7)·파일별 분포 = 2026-07-28 본 세션 `npx @askewly/design verify src/components --ext tsx` 실측. 구 77건 = `archive/reports/2026-07-27-ue2-variation-gallery.md`.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 (goal `site-quality` 개설 — 사용자 확정 순서 ③ 선착수).

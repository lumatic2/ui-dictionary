# PLAN — SQ2: 구조 결함 O5·O6·O7 수리 (사이트 품질 2/4)

> 생성: 2026-07-28 · 갈래: product 기능/화면(내비·랜딩 구조) · scope: UE1 관측 이월 구조 결함 3건 — Get Started 착지(O5)·Docs 랜딩 역할(O6)·좌측 내비 IA(O7). goal `site-quality` 2번 milestone.
Status: approved (사용자 승인 2026-07-28 "ㄱㄱ" — 결정 3건 매듭 + fresh 검증자 반영본)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "사람이 둘러보는 공개 웹사이트" 축. 들어온 사람이 시작 지점·문서 입구·기본 컴포넌트를 찾을 수 있어야 한다.
- **goal**: `site-quality` · **milestone**: SQ2 (SQ1 완료 후 연쇄).
- **리서치 입력**: 조사 = 이 세션 실측 (별도 research 문서 불요 — 결함 3건의 현재 상태를 코드에서 전수 확인). ① O5: 히어로 primary CTA("Get Started")와 착지 `/download` 가 노출 정책 게이트(`SHOW_UNFILLED`)로 프로덕션에서 통째로 숨김 — 히어로에 primary CTA 없음. ② O6: `/docs` 랜딩 = "Getting set up"(사용 절차 문서) 직행 — Docs 전체 소개·허브 없음. ③ O7: 좌측 내비 = Marketing·Application UI·Ecommerce·Documentation 4축 Tailwind Plus 컬렉션 트리 — 기본 컴포넌트 용어(accordion·tabs 등, UE2 바리에이션 갤러리 보유)로 가는 사이드바 경로 없음(Docs > Elements > Disclosure 간접 도달뿐). 원 관측: `archive/plans/2026-07-27-ue1-encyclopedia-navigation.md` finding 큐 O5~O7. **fresh 검증자 보정(2026-07-28)**: ⓐ Pages Functions 는 레포 루트 `functions/` 가 정본(`functions/{patterns,terms,docs,recipes}/[[path]].js` 실재) ⓑ `/docs` 에는 이미 미배선 허브 `DocsCatalogLanding`(filter=docs-all 에서만 렌더, 구 vocabulary 시대 목업 콘텐츠)이 존재 — 신규 파일이 아니라 이것의 재작성+기본 착지 전환이 맞다 ⓒ 사이드바 항목은 전부 filter 드릴다운이라 용어 직행은 새 항목 타입(term 링크) 도입이 필요 — 기술 결정으로 계획에 선기록.

## Scope Boundary
- **포함**: ① Get Started 를 실콘텐츠 시작 가이드 착지로 재정의(신규 최상위 경로 + 히어로 primary CTA 부활 + SPA 폴백 함수) ② Docs 랜딩 신설(소개 + 문서 그룹 허브, Getting set up 은 그 안의 한 문서로) ③ Application UI 축에 Components 그룹 신설(기본 컴포넌트 용어 직행) ④ 통합 검증(verify 비악화·build·lint·스모크·실배포 확인) + 사람 관측 1회.
- **제외**: `/download` 노출(게이트 뒤 현행 유지) · O9 검색 결과 UI(SQ3) · SSG(SQ4) · 사이드바 4축 대개편(축 추가·재명명) · 신규 용어·바리에이션 콘텐츠 제작 · 다크모드.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / 사람 관측 대기(push 후 사용자 왕복)
- rollback/cleanup: 신규 페이지·내비 항목은 커밋 단위 revert 로 원복. 라우트 추가는 routes/url-mapping/functions 3면이 한 커밋에 묶여야 부분 원복 사고가 없다.

## 스캐폴딩 결정
- source-of-truth: 라우트 스킴 정본 = `src/lib/url-mapping.ts` · 노출 정책 = `docs/design-system/site-blueprint.md` "Production Exposure Policy"(Get Started 는 실콘텐츠 착지라 게이트 비대상, `/download` 는 게이트 유지) · 내비 구조 정본 = `src/lib/navigation-model.ts` + App.tsx `uiBlockSections` · 신규 페이지 색·타이포 = 사이트 토큰 SSOT.
- 검증: 디자인 verify 비악화(색 위반 0 유지·타이포 7 초과 금지) + build·lint + Playwright 스모크(홈·/get-started·/docs·용어 상세) + 실배포 스팟 체크 + 사람 관측 1회(DoD — 취향 게이트).
- 배포/운영: push 는 완료 절차 일부(Cloudflare Pages 자동 배포). **신규 최상위 경로는 Pages Functions SPA 폴백 추가 필수**(`docs/ui-vocabulary/deployment.md` §SPA — UE5 이월 규약).
- 자기선언 도메인 — **노출 정책 준수**: 새 표면은 실콘텐츠만 나열(빈 약속·Coming soon 금지). Components 그룹 목록도 실제 상세 페이지가 있는 용어만.
- 검토 후 제외: 사이드바 축 구조 변경(새 최상위 축·축 재명명) — O7 은 Application UI 내 Components 그룹 신설로 한정(사용자 확정 2026-07-28), 전면 IA 개편은 관측이 요구할 때 별도.

## 결정 로그
- status: resolved
- **O5 (사용자 확정 2026-07-28)**: Get Started = 시작 가이드로 재정의 — 앱 다운로드가 아니라 "이 사이트를 어떻게 쓰는가" 실콘텐츠 착지(패턴 탐색·용어 사전·Docs·에이전트 llms.txt 경로 안내). 정책 위반 없이 primary CTA 부활. `/download` 는 게이트 뒤 유지.
- **O6 (사용자 확정 2026-07-28)**: Docs 랜딩 = 소개 + 허브 결합 — 상단 Askewly Design 짧은 소개, 아래 문서 그룹(Getting started·Elements·Foundations·Vocabulary·Agent Recipes) 카드 허브. Getting set up 은 그 안의 한 문서로 내려간다.
- **O7 (사용자 확정 2026-07-28)**: 기본 컴포넌트 도달 경로 = Application UI 축 안 "Components" 그룹 신설 — 기존 4축 유지, Tailwind Plus 문법 정합.
- **기술 결정**: ① 신규 페이지 디자인은 기존 사이트 문법(토큰·기존 카드/섹션 패턴) 내에서 구성 — 시각 취향의 최종 게이트는 사람 관측 1회. ② O6 은 신규 파일이 아니라 기존 `DocsCatalogLanding`(docs-all) 재작성 — 구 vocabulary 목업 콘텐츠(가짜 탭·ui-docs.config.ts 목)를 소개+허브 실콘텐츠로 교체하고 `/docs` 기본 착지(getDefaultFilterForPage)를 docs-all 로 전환. ③ O7 사이드바 Components 항목은 filter 드릴다운이 아니라 **term 링크 타입**(클릭 = 용어 상세 라우트 이동) — 그룹 렌더러에 term 항목 분기를 추가한다.
- 그 외 **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — O5: Get Started 시작 가이드 착지**
  - Artifact: 신규 `/get-started` 페이지(시작 가이드 — 사이트 탐색 경로 안내: Patterns·Terms 검색·Docs·Colors/Recipes·에이전트 진입 llms.txt) + 히어로 primary CTA "Get Started" 게이트 해제·배선 전환 + 라우트 3면(routes.tsx·url-mapping.ts·Pages Functions SPA 폴백).
  - Files: write examples/ui-vocabulary-site/src/components/get-started-page.tsx(신규), src/components/landing-hero.tsx, src/App.tsx(PageMode·렌더 분기), src/routes.tsx, src/lib/url-mapping.ts, src/lib/page-meta.ts, src/lib/search-suggestions.ts, functions/get-started/[[path]].js(신규 — 레포 루트 functions/ 가 Pages Functions 정본). read src/lib/exposure.ts, docs/ui-vocabulary/deployment.md.
  - Risk: 위험 (신규 최상위 라우트 + 배포면 SPA 폴백 — 실배포 스팟 체크로 격리)
  - Dependencies: 없음
  - Verify: build PASS + dev 브라우저에서 히어로 CTA → /get-started 착지·새로고침 직접 진입·콘솔 0에러 + 신규 파일 디자인 verify 위반 0.
  - Failure probe: 프로덕션 직접 URL 진입(SPA 폴백) — 함수 누락 시 404. 배포 후 `/get-started` 직접 요청 200 확인으로 검출.
  - Commit: changeset `sq2-structural-defects` (README 절: step-1).

- [x] **step-2 — O6: Docs 랜딩 소개+허브**
  - Artifact: `/docs`(slug 없음) 착지 = 기존 `DocsCatalogLanding`(docs-all) 재작성 — 구 vocabulary 목업 콘텐츠를 걷어내고 Askewly Design 소개 문단 + 문서 그룹 카드 허브(docsNavGroups 파생)로 교체. `/docs` 기본 필터를 docs-all 로 전환, 상단 내비 "Docs"·히어로 "Open Docs"·시작 가이드의 Docs 링크가 허브로 착지. Getting set up 은 그룹 안 문서로.
  - Files: write examples/ui-vocabulary-site/src/App.tsx(DocsCatalogLanding 재작성·getDefaultFilterForPage·siteTopNav·selectPrimaryAxis documentation 분기), src/components/landing-hero.tsx(Open Docs 배선), src/lib/page-meta.ts. read src/lib/documentation-pages.ts, src/lib/url-mapping.ts(docs-all ↔ bare /docs 매핑 확인 — 이미 지원).
  - Risk: 기계적 (기존 /docs 라우트 내 착지 변경 — 문서 본문 무변경, revert 용이)
  - Dependencies: step-1
  - Verify: build PASS + dev 브라우저에서 /docs 허브 렌더·카드 → 각 문서 착지·기존 /docs/:slug 딥링크 무회귀·콘솔 0에러 + 신규 파일 디자인 verify 위반 0.
  - Failure probe: 구 쿼리 URL(?page=docs&filter=…) 리다이렉트 경로가 허브가 아닌 문서로 정확히 착지하는지 — legacy 리다이렉트 1건 실측.
  - Commit: changeset `sq2-structural-defects` (README 절: step-2).

- [x] **step-3 — O7: Components 그룹 + 통합 검증 (SQ2 마감)**
  - Artifact: Application UI 축에 "Components" 그룹 신설 — 사이드바 그룹 렌더러에 **term 링크 항목 타입**(클릭 = `/terms/:id` 이동)을 추가하고, 실제 상세 페이지가 있는 기본 컴포넌트 용어(accordion·tabs 등 UE2 갤러리 보유 우선 + 핵심 컴포넌트 용어)를 나열 + 통합 검증 + `evidence/site-quality/sq2-structural-defects.md` + push·실배포 확인 + 사람 관측 요청.
  - Files: write examples/ui-vocabulary-site/src/App.tsx(uiBlockSections Components 그룹 + StaticUiBlockGroup term 링크 분기), evidence/site-quality/sq2-structural-defects.md. 실행: verify 전체·build·lint·Playwright 스모크(/ · /get-started · /docs · /terms/accordion)·push·실배포 스팟 체크.
  - Risk: 기계적 (내비 항목 추가 — 기존 트리 무변경 유지)
  - Dependencies: step-2
  - Verify: 사이드바 Components → /terms/accordion 실브라우저 도달 + `npx @askewly/design verify src/components --ext tsx` 색 0·타이포 ≤7 + build·lint PASS + Playwright 4라우트 콘솔 0에러 + 실배포에서 /get-started 200·/docs 허브 확인.
  - Failure probe: 노출 정책 — Components 목록에 상세 콘텐츠 없는 용어가 끼면 빈 착지. 목록 전 항목 실페이지 렌더 확인.
  - Commit: changeset `sq2-structural-defects` (README 절: step-3).

## 검증/DoD
- **DoD**: Get Started 착지(O5)·Docs 랜딩 역할 정의(O6)·좌측 내비 IA 재정리(O7)가 라우트 구조 위에서 수리되고 **사람 관측 1회 통과**. 디자인 verify 비악화(색 0 유지)·build·lint·스모크 PASS·실배포 확인.
- **Evidence**: `evidence/site-quality/sq2-structural-defects.md`
- **회귀 게이트**: 기존 라우트 무회귀(용어 상세·패턴·docs 딥링크·legacy 리다이렉트) + Playwright 스모크 콘솔 0에러.

## 수치 출처
- 결함 3건 원 관측 = `archive/plans/2026-07-27-ue1-encyclopedia-navigation.md` finding 큐(관측 1회차 2026-07-27). 현재 상태 실측 = 2026-07-28 본 세션 코드 판독(exposure.ts·App.tsx·documentation-pages.ts·navigation-model.ts).

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 — 사용자 결정 3건(O5 시작 가이드 재정의·O6 소개+허브 결합·O7 Application UI 내 Components 그룹) AskUserQuestion 으로 매듭.
- 2026-07-28 fresh 계획 검증자(sonnet) 지적 3건 실측 확인·반영 — functions 경로 레포 루트 보정 · O6 은 기존 DocsCatalogLanding 재작성으로 전환 · O7 term 링크 항목 타입을 기술 결정으로 선기록.
- 2026-07-28 승인("ㄱㄱ") → step-1·2·3 연속 실행 완료, 커밋 3건(18ebf5d·680ab10·55a7a93) push. 발견·수정: O6 허브가 docs-all 용어 수백 행 덤프에 묻힘 → 랜딩에서 목록 억제. 남은 게이트 = 실배포 스팟 체크(폴링 중) + **사람 관측 1회(DoD — 사용자 왕복 대기)**.

# PLAN — QA1: 한/영 혼용 카피 정책 정본화 + 셸 적용 (사이트 다듬기 1/2)

> 생성: 2026-07-31 · 갈래: 정책 문서 + 사이트 카피 전환 · scope: 한/영 혼용 정책을 정본 문서로 박고, 사이트 셸 표면의 자기-목소리 카피를 한국어(해요체)로 전환. goal `site-polish` 1번 milestone.
Status: approved (사용자 승인 2026-07-31 "ㄱㄱ" — 결정 3건 매듭 + fresh 검증자 반영본, 연쇄 QA1→QA2)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 사람이 둘러보는 공개 웹사이트. 이식 가능한 제품이 되려면 사이트가 자기 언어 정책부터 일관해야 한다. 현재는 전부 영어라 1차 독자(한국어 사용자)에게 덜 직관적.
- **goal**: `site-polish` (신규 — 수동 QA 다듬기) · **milestone**: QA1 (연쇄: QA1 → QA2).
- **리서치**: 조사 불요 — 대상 표면 실측(get-started·home-page·App.tsx 구조 확인 2026-07-31)으로 충분. 정책 내용은 사용자 결정 3건이 재료.

## Scope Boundary
- **포함**: ① 카피 언어 정책 문서 신설(`docs/design-system/copy-language.md`) + `scripts/generate-llms-txt.mjs` 배선 ② 랜딩 표면(home-page.tsx 사이트 보이스·landing-hero.tsx) 한국어 전환 ③ 내비·허브·인트로 표면(topbar-search.tsx 검색 문자열, App.tsx docs 허브 크롬, colors-page.tsx·recipe-gallery.tsx 인트로) 한국어 전환. 검색 UI 일부(추천 결과 라벨)는 이미 한국어 — 잔여 영어만 전환(fresh 검증자 실측 2026-07-31).
- **제외**: 데모 콘텐츠 내부 텍스트(예시 UI 가 표현하는 제품 문구 — 영어 유지가 정책 그 자체) · 용어 상세 본문 562건 · docs 아티클 본문(`documentation-pages.ts` 등) · page examples · get-started 페이지(QA2 소관 — 이중 손질 방지) · SEO 메타 대량 전환(`page-meta.ts` — finding 큐로 보내 별도 판단).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 신규 문서 1건 + 카피 문자열 치환 — 커밋 단위 revert 로 완전 복구. 로직·토큰 무변경.

## 스캐폴딩 결정
- source-of-truth: 정책 정본 = `docs/design-system/copy-language.md` (llms 로 에이전트에게도 배포 — 이후 에이전트가 사이트 카피를 쓸 때 이 정책을 따른다). 카피 자체의 정본 = 각 컴포넌트 소스(별도 문자열 파일 신설하지 않음 — 현행 구조 유지, i18n 아님).
- 검증: site `npm run build`·`npm run lint`(lint:colors --max 0 게이트 무회귀) → dev 브라우저 스모크(랜딩·검색·docs 허브·colors — 라이트/다크 양쪽) → llms 재생성 diff(기존 목록 무손실 +1).
- 배포/운영: push·실배포는 goal 마감 시 일괄(deploy-batching — 사전 보고 후). QA1 은 로컬 검증까지.
- 자기선언 도메인 — **카피 규약**: 문체 = 해요체(사용자 확정 2026-07-31). em dash 금지·콤팩트(기존 Showcase 카피 규칙과 정합). 번역이 아니라 재작성 — 영어 원문 직역투 금지.
- 검토 후 제외: i18n 프레임워크·라우트 분리(/ko/) — 사용자가 혼용 정책 채택으로 기각(2026-07-31). ko/en 분리는 장기 후보로만.

## 결정 로그
- status: resolved
- **언어 방향 (사용자 확정 2026-07-31)**: 혼용 정책 — UI 용어·고유명·코드·데모 콘텐츠 = 영어, 사이트 자기-목소리(설명문·안내문) = 한국어. ko/en 분리 기각.
- **문체 (사용자 확정 2026-07-31)**: 해요체.
- **기술 결정**: ① 내비 라벨·페이지명(Patterns·Docs·Colors·Get Started)은 제품 고유 명사로 영어 유지, CTA·안내문은 한국어 속에 영어 명사를 안는 형태("Patterns 둘러보기") ② 정책 문서에 표면별 판정표(무엇이 자기-목소리이고 무엇이 데모 콘텐츠인지)를 포함 — 이후 세션·에이전트가 재판정하지 않게 ③ 문자열 추출 없이 컴포넌트 인라인 유지(i18n 인프라 금지 — 단순성 우선).
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — 카피 언어 정책 문서 + llms 배선**
  - Artifact: `docs/design-system/copy-language.md` 신설 — 원칙(혼용: 영어=UI 용어·고유명·코드·데모 콘텐츠 / 한국어=자기-목소리), 문체(해요체·em dash 금지·직역투 금지), 표면 판정표(랜딩 히어로=자기-목소리 / 데모 카드 내부=콘텐츠 / 내비=고유명 등), CTA 혼용 형태 예시. + `scripts/generate-llms-txt.mjs` 등재, llms 재생성.
  - Files: write docs/design-system/copy-language.md, scripts/generate-llms-txt.mjs. read docs/design-system/entry-protocol.md(형식 관례), CLAUDE.md(Showcase 카피 규칙 정합 확인).
  - Risk: 기계적 (신규 문서 + 등재 1줄)
  - Dependencies: 없음
  - Verify: llms 재생성 → 산출물에 copy-language 노출 + 기존 목록 무손실(diff).
  - Failure probe: 등재 경로 오타 시 재생성이 실패를 감지하는지 1회 확인 후 원복(DM1 실측 절차 재사용).
  - Commit: changeset `qa1-copy-language` (README 절: step-1).

- [ ] **step-2 — 랜딩 표면 한국어 전환**
  - Artifact: home-page.tsx 의 사이트 보이스(히어로·섹션 헤딩·설명문·푸터 안내문)와 landing-hero.tsx 를 정책 문서 기준 한국어(해요체)로 재작성. 데모 콘텐츠(쇼케이스·데모 카드 내부 텍스트)는 무변경.
  - Files: write examples/ui-vocabulary-site/src/components/home-page.tsx, examples/ui-vocabulary-site/src/components/landing-hero.tsx. read docs/design-system/copy-language.md.
  - Risk: 위험 (home-page.tsx 3200줄에 데모 콘텐츠와 자기-목소리 혼재 — 판정표 기준 자기-목소리만 치환, 위임 시 데모 내부 텍스트·주석 삽입 금지 명시로 DM2 마커 사고 재발 방지)
  - Dependencies: step-1
  - Verify: tsc·`npm run build`·`npm run lint` PASS(colors 게이트 무회귀) + dev 브라우저 랜딩 전 스크롤 순회(다크 게이트 교훈: 대표 1장 아님) 라이트/다크 양쪽 + 데모 콘텐츠 영어 잔존 확인(정책 준수의 증거).
  - Failure probe: 치환이 JSX 구조를 건드렸는지 — 랜딩 인터랙티브(쇼케이스 데모 1종) 동작 확인. 콘솔 0 에러.
  - Commit: changeset `qa1-copy-language` (README 절: step-2).

- [ ] **step-3 — 내비·허브·인트로 표면 한국어 전환**
  - Artifact: topbar-search.tsx 잔여 영어 문자열(검색 입력창 힌트 문구 등 — 추천 결과 라벨은 이미 한국어), App.tsx docs 허브 크롬(docsHubGroupDescriptions 5건·허브 헤딩·인트로), colors-page.tsx 인트로, recipe-gallery.tsx(RecipeGalleryIndex) 인트로를 한국어(해요체)로 재작성.
  - Files: write examples/ui-vocabulary-site/src/components/topbar-search.tsx, examples/ui-vocabulary-site/src/App.tsx, examples/ui-vocabulary-site/src/components/colors-page.tsx, examples/ui-vocabulary-site/src/components/recipe-gallery.tsx. read docs/design-system/copy-language.md.
  - Risk: 기계적 (인트로·크롬 문자열 국소 치환 — 로직 무변경, 대상 위치는 fresh 검증자 실측: App.tsx:1791-1813·recipe-gallery.tsx:31-37·colors-page.tsx:183-190·topbar-search.tsx:177)
  - Dependencies: step-1
  - Verify: tsc·`npm run build`·`npm run lint` PASS + dev 브라우저 스모크 — 검색 열기·docs 허브·colors·recipes, 라이트/다크 양쪽.
  - Failure probe: 검색 입력창 힌트 문구 전환 후 검색 동작(입력→결과) 무회귀 확인. 콘솔 0 에러.
  - Commit: changeset `qa1-copy-language` (README 절: step-3).

## 검증/DoD
- **DoD**: 정책 문서가 llms 에 배선되어 존재하고, 셸 표면의 자기-목소리가 한국어(해요체)로 전환되며, 데모 콘텐츠는 영어로 남고, build·lint·브라우저 스모크(라이트/다크)를 통과한다.
- **Evidence**: `evidence/site-polish/qa1-copy-language.md`
- **회귀 게이트**: lint:colors --max 0 무회귀 + llms 기존 목록 무손실 + 랜딩 인터랙티브 무회귀.

## 수치 출처
- 표면 실측 = get-started-page.tsx 전문·home-page.tsx/App.tsx 라인 수(3227/6410) wc 실측 2026-07-31. 카피 소재지(recipe-gallery.tsx:31-37·topbar-search.tsx:177·App.tsx:1791-1813·colors-page.tsx:183-190) = fresh 검증자 실측 2026-07-31. llms 등재 = FIXED_ASSETS 배열 항목 1개 추가(generate-llms-txt.mjs:24-107, 존재 검증·broken-link 체크 내장).

## finding 큐
- page-meta.ts SEO 메타(제목·설명) 한국어 전환 여부 — 검색 유입 언어 전략과 묶어 별도 판단.

## 진행 로그
- 2026-07-31 작성 — 결정 3건(혼용 정책·문체 해요체·i18n 기각) AskUserQuestion 매듭.
- 2026-07-31 fresh 검증자(sonnet) 반영 — recipes 인트로 소재지 정정(recipe-gallery.tsx), 검색 문자열 소재지 정정(topbar-search.tsx — 일부 이미 한국어), 과대 응집 step-2 를 랜딩/내비·허브 2개 step 으로 분리.

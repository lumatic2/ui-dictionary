# PLAN — QA2: Get Started 카드 직관화 (사이트 다듬기 2/2)

> 생성: 2026-07-31 · 갈래: 화면 개편 · scope: /get-started 카드 6개(탐색 4 + 안내 2)를 라이브 미니 프리뷰 썸네일 + 명사형 제목 + 간결한 영어 설명으로 개편. goal `site-polish` 2번 milestone.
Status: approved (사용자 승인 2026-07-31 "ㄱㄱ" — 결정 2건 매듭. 2026-07-31 QA1 회귀로 카피 언어를 한국어→영어 단일로 수정, 그 외 계약 불변)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 공개 웹사이트의 정문. 현재 카드가 텍스트+아이콘뿐이라 각 목적지에서 뭘 보게 되는지 눈에 안 보인다(사용자 관측 2026-07-31).
- **goal**: `site-polish` · **milestone**: QA2 (연쇄: QA1 → QA2 — QA1 회귀로 카피 기준 = 영어 단일, `docs/design-system/copy-language.md`).
- **리서치**: 조사 불요 — get-started-page.tsx 전문 실측(2026-07-31)이 재료. 미니 프리뷰는 사이트 기존 데모 컴포넌트 자산 재사용.

## Scope Boundary
- **포함**: ① 탐색 카드 4종(Patterns·Docs·Colors·Recipes) 라이브 미니 프리뷰 썸네일 컴포넌트 ② 카드 제목 명사화("Study the colors"→"Colors" 계열) + 설명 영어 재작성(더 콤팩트·직관적으로) + 안내 카드 2개(용어 검색·에이전트)는 카피 현행 유지 ③ 라이트/다크 양 테마 성립.
- **제외**: get-started 외 페이지 · 카드 구성 자체의 증감(6개 유지) · 목적지 라우팅 변경 · 새 일러스트 에셋 제작(라이브 렌더로 대체 — 사용자 확정).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: get-started-page.tsx + 신규 프리뷰 컴포넌트 1파일 — 커밋 단위 revert 로 완전 복구.

## 스캐폴딩 결정
- source-of-truth: 카드 데이터 = get-started-page.tsx 의 `explorePaths` 배열 유지(구조 확장 — thumbnail 필드 추가). 썸네일 = 신규 `get-started-previews.tsx` 1파일에 4종 수납(폴더당 항목 수 절약).
- 검증: tsc·`npm run build`·`npm run lint`(colors --max 0 — 프리뷰가 리터럴 색 쓰면 토큰 위반이 잡히는 게 정상, 데모 성격이면 allowlist 대신 토큰 우선) → dev 브라우저에서 /get-started 라이트/다크 확인 → 프리뷰 4종 렌더·비인터랙티브 확인.
- 배포/운영: push·실배포는 goal 마감 시 일괄. QA2 종료 시 사람 관측 왕복(goal 마감 게이트).
- 자기선언 도메인 — **접근성**: 썸네일은 장식 — `aria-hidden` + `pointer-events-none`, 카드 접근 이름은 제목 텍스트 유지. 모션 있는 프리뷰(Recipes)는 `prefers-reduced-motion` 존중.
- 검토 후 제외: 스크린샷·정적 일러스트 트랙 — 사용자가 라이브 미니 프리뷰 채택으로 기각(2026-07-31).

## 결정 로그
- status: resolved
- **썸네일 형태 (사용자 확정 2026-07-31)**: 라이브 미니 프리뷰 — 실제 컴포넌트 축소 렌더.
- **제목 (사용자 방향 2026-07-31)**: 동사구→명사형 — Patterns / Docs / Colors / Recipes. 안내 카드 2개 제목도 같은 원칙으로 콤팩트하게.
- **기술 결정**: ① 프리뷰는 무거운 실데모 임베드가 아니라 각 목적지의 시각 요지를 토큰 기반으로 소형 재구성(패턴=섹션 블록 축소, 컬러=램프 스트립, 독스=아티클 골격, 레시피=그라디언트·모션 조각) — 번들·성능 영향 최소화 ② 카드 레이아웃은 썸네일 상단 배치(기존 아이콘 자리 확장), 그리드 2열 유지 ③ 안내 카드 2개는 썸네일 없이 카피만 전환(탐색 카드와 위계 구분 유지).
- 그 외 새 사용자 소유 결정: 없음.

## Step 트리

- [x] **step-1 — 미니 프리뷰 컴포넌트 4종**
  - Artifact: `src/components/get-started-previews.tsx` 신설 — PatternsPreview·DocsPreview·ColorsPreview·RecipesPreview. 전부 semantic 토큰 기반, aria-hidden·pointer-events-none, 라이트/다크 성립, Recipes 모션은 reduced-motion 존중.
  - Files: write examples/ui-vocabulary-site/src/components/get-started-previews.tsx. read src/index.css(토큰)·colors-page.tsx(램프 참조)·marketing-section-preview.tsx(축소 문법 참조).
  - Risk: 위험 (컬러 램프 스트립이 리터럴 색 유혹 표면 — 토큰·기존 팔레트 데이터 참조로 해결하고 allowlist 추가 금지)
  - Dependencies: 없음
  - Verify: tsc PASS + `npm run lint`(colors --max 0 통과 = 토큰 준수 증거) + dev 임시 렌더로 4종 라이트/다크 확인.
  - Failure probe: OS reduced-motion 에뮬레이션에서 Recipes 프리뷰 모션 정지 확인.
  - Commit: changeset `qa2-get-started-cards` (README 절: step-1).

- [x] **step-2 — 카드 개편 적용**
  - Artifact: get-started-page.tsx 개편 — explorePaths 에 thumbnail 연결·제목 명사화(Patterns/Docs/Colors/Recipes)·설명 영어 재작성(콤팩트), 안내 카드 2개는 구조·카피 유지, CTA 는 현행 영어 유지.
  - Files: write examples/ui-vocabulary-site/src/components/get-started-page.tsx. read docs/design-system/copy-language.md(영어 단일 정책), get-started-previews.tsx.
  - Risk: 기계적 (단일 페이지 컴포넌트, 라우팅 무변경 — 카피 기준은 영어 단일 정책 문서)
  - Dependencies: step-1
  - Verify: `npm run build`·`npm run lint` PASS + dev /get-started 라이트/다크 전 카드 확인 + 카드 클릭 4방향 목적지 라우팅 무회귀 + 콘솔 0 에러.
  - Failure probe: 키보드 탐색 — Tab 으로 카드 포커스·Enter 이동 성립(썸네일이 포커스 순서를 오염시키지 않는지).
  - Commit: changeset `qa2-get-started-cards` (README 절: step-2).

## 검증/DoD
- **DoD**: /get-started 카드 6개가 명사형 제목 + 간결한 영어 설명이고, 탐색 4카드에 라이브 미니 프리뷰가 라이트/다크 양쪽에서 성립하며, build·lint·라우팅·접근성(포커스·reduced-motion) 무회귀. goal 마감 전 사람 관측 1회 통과.
- **Evidence**: `evidence/site-polish/qa2-get-started-cards.md`
- **회귀 게이트**: lint:colors --max 0 무회귀(신규 allowlist 0) + 카드 목적지 4방향 라우팅 무회귀.

## 수치 출처
- 현행 카드 구성(탐색 4+안내 2)·파일 구조 = get-started-page.tsx 전문 실측 2026-07-31.

## finding 큐
- 2026-07-31 사람 관측 1회차 **기각** — ① 미니 프리뷰(스켈레톤 조립) 품질 미달 ② 인트로 설명문("A visual library of product UI...")의 필요성 의문 ③ 단순 카드 나열 구조 자체 재검토. 사용자 지시: 레퍼런스 조사 먼저 → 페이지 설계 재제시.

## 진행 로그
- 2026-07-31 작성 — 결정 2건(라이브 미니 프리뷰·제목 명사화) 매듭.
- 2026-07-31 QA1 회귀 반영 — 카드 설명·CTA 언어를 한국어→영어 단일로 수정(사용자 확정), 안내 카드 2개는 현행 카피 유지로 축소.
- 2026-07-31 관측 2회차 기각("그냥 캡처한거야? 글자도 안 보이고 AI slop") → 사용자가 크롬으로 레퍼런스 직접 순회 후 **primer.style 확정**("쭉 다 캡처해서 따라 만들자") → 전체 캡처·구조 해독(`research/2026-07-31-qa2-primer-structure.md`) → 3차 재구현: 센터 헤딩+비대칭 2카드 히어로(Patterns 실물 크기 조각 콜라주·Colors 스와치 6타일)+풀폭 Recipes(mesh 실물+모션 칩)+More ways in 3소카드(Docs·Vocabulary·Agents). 교훈: 썸네일은 축소가 아니라 실물 크기 조각의 콜라주 — 모든 글자가 원래 크기로 읽혀야 한다.
- 2026-07-31 관측 1회차 기각 → 레퍼런스 조사(`research/2026-07-31-qa2-get-started-references.md`, 10곳 실측) → 구조 B(실물 썸네일 그리드, Tailwind Plus) 사용자 확정 → 재구현: 스켈레톤 폐기, 실데모 축소 렌더(MarketingSectionPreview hero-centered·ArticleDocumentationLayoutDemo·ColorPaletteGeneratorDemo·MeshGradientSurfaceDemo, 전부 lazy), 인트로 문단 삭제(헤딩만), 카드 = 썸네일+제목+실데이터 개수(31 articles·13 palettes·47 recipes), 안내 2블록 소형화.

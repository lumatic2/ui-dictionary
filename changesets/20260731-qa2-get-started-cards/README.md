# changeset: qa2-get-started-cards

- Milestone: QA2 — Get Started 카드 직관화 (plan: `plans/2026-07-31-qa2-get-started-cards.md`)
- Date: 2026-07-31

## step-1 — 미니 프리뷰 컴포넌트 4종

- `src/components/get-started-previews.tsx` 신설 — PatternsPreview(내비+히어로+3열 스켈레톤)·DocsPreview(사이드바+아티클 골격)·ColorsPreview(paletteSeedLibrary 램프 3줄)·RecipesPreview(토큰 그라디언트 블롭+모션). 공통 PreviewFrame: aria-hidden·pointer-events-none·h-28·semantic 토큰만.
- 모션은 `motion-safe:`/`motion-reduce:animate-none` — emulateMedia(reduce) 프로브로 spin→none 확인.

## step-2 — 카드 개편 적용

- `get-started-page.tsx` — explorePaths 에 preview 연결(아이콘 칩 대체), 제목 명사화(Browse patterns→Patterns 등 4종), 설명 영어 콤팩트 재작성, 안내 카드 2개 현행 유지.
- 검증: tsc·lint(colors 0)·build(755) PASS, 라우팅 4방향·키보드 Enter·콘솔 0 에러, 라이트/다크 풀페이지 스크린샷.

## 재작업 — 관측 1회차 기각 → 구조 B (실물 썸네일 그리드)

- 기각 사유: 스켈레톤 썸네일 품질·인트로 3문장·카드 나열 구조 의문. 레퍼런스 10곳 실측(`research/2026-07-31-qa2-get-started-references.md`) 후 사용자 B안 확정(Tailwind Plus 방식 — 레포 1차 IA 레퍼런스와 정합).
- `get-started-previews.tsx` 재작성: ScaledFrame(축소 렌더 클리핑) + 실데모 4종 lazy 로드 — MarketingSectionPreviewLazy(hero-centered)·ArticleDocumentationLayoutDemo·ColorPaletteGeneratorDemo·MeshGradientSurfaceDemo.
- `get-started-page.tsx`: 인트로 문단 삭제(헤딩만), 카드 = 실물 썸네일 + 제목 + 실데이터 메타(31 articles·13 curated palettes·47 live-rendered recipes), 안내 2블록 소형화(1행 컴팩트).

## 재작업 2 — 관측 2회차 기각 → Primer 문법 (사용자 확정)

- 기각 사유: 축소 렌더 = "그냥 캡처, 글자 안 보임, AI slop". 사용자가 크롬에서 레퍼런스 7곳 순회 후 primer.style 확정.
- 구조: 센터 헤딩+서브 → 비대칭 2카드 히어로(좌 Patterns: 커넥터 선화+토스트+태그+툴바+스펙 박스 실물 크기 콜라주 / 우 Colors: paletteSeedLibrary 실데이터 스와치 6타일+hex 라벨) → 풀폭 Recipes(MeshGradientSurface 실물 우측 블리드+모션 칩) → "More ways in" 3소카드(Docs 31·UI Vocabulary 562/Ctrl F·Agents llms.txt).
- 원칙: 일러스트는 실물 크기 UI 조각의 겹침·잘라내기 — 축소 없음, 모든 글자 원래 크기. 토큰 전용(colors lint 0), 이전 라운드 파일(축소 ScaledFrame·lazy 데모 import) 전량 대체.

## 재작업 3 — 생성 일러스트 세트 (사용자 지시: codex exec + imagegen)

- 관측 지적: Recipes 카드의 mesh gradient 가 "뭔지 모르겠다" + 코드 콜라주 일부 slop 감.
- `codex exec --full-auto`(codex-cli 0.145.0, 내장 imagegen)로 카드 3장 일러스트 생성(1536×1024 PNG, 무텍스트·화이트 그라운드·보라 계열 한 세트) → sharp-cli 로 1200w webp 변환(28~52KB) → `public/assets/get-started/{patterns,colors,recipes}.webp`.
- `get-started-previews.tsx` 를 이미지 기반으로 교체(aria-hidden·empty alt·rounded 액자 프레임). 다크에선 흰 아트 타일이 액자로 성립.
- 원본 PNG 보존: `patterns-source-1536.png` (1536×1024 imagegen 원본 — 배포본은 `public/assets/get-started/patterns.webp`. colors·recipes 원본은 미보존.)

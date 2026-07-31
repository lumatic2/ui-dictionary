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

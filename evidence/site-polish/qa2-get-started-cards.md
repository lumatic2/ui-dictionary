# QA2 evidence — Get Started 카드 직관화

- 2026-07-31 · plan: `plans/2026-07-31-qa2-get-started-cards.md`

## step-1 — 미니 프리뷰 4종

| 항목 | 결과 |
|---|---|
| tsc / lint(colors --max 0) | PASS — 신규 allowlist 0 (컬러 램프는 paletteSeedLibrary 데이터 inline style, 크롬은 semantic 토큰) |
| 라이트/다크 렌더 | PASS — vite preview(4322) /get-started 풀페이지 스크린샷 양 테마 확인 |
| reduced-motion probe | PASS — emulateMedia(reduce)에서 Recipes 블롭 animationName spin→none |

## step-2 — 카드 개편 적용

| 항목 | 결과 |
|---|---|
| build(프리렌더 755) / lint | PASS |
| 라우팅 4방향 | PASS — Open Patterns→/patterns/marketing · Docs→/docs · Colors→/colors · Recipe Gallery→/recipes |
| 키보드 | PASS — 카드 focus 후 Enter 로 /patterns/marketing 이동(썸네일은 aria-hidden·pointer-events-none·비포커스) |
| 콘솔 | 0 에러 (세션 전체) |
| 제목 | 명사화 — Patterns / Docs / Colors / Recipes, 설명 영어 콤팩트 재작성, 안내 카드 2개 현행 유지 |

- 잔여 게이트: 사람 관측 1회 (goal 마감 전).

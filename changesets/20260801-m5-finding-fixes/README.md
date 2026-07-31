# Changeset — M5: finding 소수리 (search title + llms 정합 게이트)

- Milestone: M5 (goal `finding-cleanup`, plan: `plans/2026-08-01-m5-finding-fixes.md`)
- Date: 2026-08-01

## step-1 — /search 런타임 title 정합

- 원인: `/search` 는 URL 스킴상 plus|docs 모드 + query 로 표현(url-mapping) — page-meta 에 search 유형이 없어 Patterns 라벨 상속.
- 수리: page-meta 에 `search` 유형(라벨 "Search") 추가 + App usePageMeta 에서 `isSearchView`(plus|docs + query 비공백) 분기 — prerender 정적 문구와 동일한 title·description.
- Verify: 실브라우저 — /search?q=button "Search — Askewly Design" + patterns/docs/term 무회귀. build+prerender PASS.

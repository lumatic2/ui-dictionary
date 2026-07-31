# Changeset — SX1: 임팩트 레이아웃 2종

- Plan: `plans/2026-07-28-sx1-impact-layouts.md` · cross-repo: custom-skills

## step-1·2 — hero-motion + svg-filter-scene (custom-skills `c267570`)

- 4면 동시 갱신: layout-meta(18종)·schema enum·static.mjs 렌더러 2건·css.mjs(전용 스타일+키프레임+reduced-motion 규칙 확장 — 기존 `.effect-*` 스코프 한계 보강).
- svg-filter-scene: turbulence(기본)/liquid(variant) 자작 SVG, SMIL + reduced-motion 시 pauseAnimations 스크립트. 필터 영역 확장 수리(기본 110% 클리핑 적발).
- fixture `impact-layouts-smoke` 4장(신규 2종 3장 + 대조군).

## step-3 — 문서·카탈로그·배포 (custom-skills `0a0fdf6`)

- layouts.md §13·14 계약, layout-selection 표 2행, SKILL §5 "정적 14종", smoke-runner catalogSlides 2장.
- smoke 전체 exit 0 · `--skill` 단일 배포 · 배포본 재검증 PASS.
- Playwright emulateMedia로 reduced-motion 양쪽 분기 실측 (계획 failure probe 이행).

# 표현 스택 계보 리서치 정본화 (VI1 Step 1)

- Date: 2026-07-17
- Milestone: VI1 Step 1 (plan: `docs/plans/2026-07-17-vi1-expressive-stack-map.md`)
- Scope: `docs/research/2026-07-17-expressive-stack-genealogy.md`(신규 — 4티어 기법 계보 + 자체 쇼케이스 12종 역산)

## What

- 백그라운드 리서처 2기(sonnet) 병렬 조사: 티어 ①②(CSS·SVG 8기법 + 모션 7기법) / 티어 ③④(Canvas·물리 5기법 + WebGL·three.js 7기법 + React 통합·번들 전략 3항목) — 전 항목 출처 URL+접근일.
- 오케스트레이터 게이트: 자체 쇼케이스 12종을 실코드 grep으로 티어 역산 — Shader Gradient가 이미 WebGL(Paper Shaders)임을 적발(기존 추정 canvas 2D 정정), Coverflow는 CSS 3D transform(진짜 3D 씬 아님)으로 판별.
- 핵심 발견: 사이트에 4티어가 이미 혼재하나 ④ WebGL이 가장 얇음(three.js 미도입) — VI4 근거. three.js gzip ~155KB 실측 → lazy-load 필수 조건 뒷받침.

## Verification

- [x] 전 기법 항목 출처 URL+접근일 존재 (무출처 항목 0 — 리서처 지시로 원천 차단)
- [x] 출처 무작위 3건 실 curl 200 (joshwcomeau/brm.io/gsap.com)
- [x] 쇼케이스 역산 전 항목 실코드 라인 근거 (home-page.tsx grep)

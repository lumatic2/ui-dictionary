# 완료 — SX1 임팩트 레이아웃 2종

> 완료: 2026-07-28 · SX1 (goal `slide-expressive`) · 배치: `docs/reports/` (이 레포 특례 — archive/ gitignore)
> **짧게 쓴다.**

## 1. 결과

발표 슬라이드에 임팩트 장면 레이아웃 2종이 생겼다. `hero-motion` — 그라디언트 블롭이 흐르는 풀블리드 히어로, 제목·부제·칩 단계 등장(CSS 티어). `svg-filter-scene` — feTurbulence 일렁임(기본)과 liquid 병합(variant)의 자작 SVG 필터 배경, 텍스트는 필터 밖 스택으로 가독 보호. 둘 다 reduced-motion 완전 정지·exportFallback 의무. presentation-slides-yusung 정적 레이아웃이 12→14종이 되고 배포까지 완료 — 이후 만드는 모든 덱에서 즉시 사용 가능.

## 2. 이슈와 해결

- SVG 필터 기본 영역(110%)이 displacement 변위를 직선으로 잘라먹는 결함을 브라우저 실검증에서 적발 — 필터 영역 확장으로 수리.
- fresh 검증자 선반영 3건이 실제로 유효했다: css.mjs reduced-motion 스코프 한계(신규 클래스 규칙 추가), smoke 카탈로그 수기 목록(2장 등재), 표준 직행 예외(결정 로그 기록 — SX3 실사용 판정 예정).
- DoD 잔여 없음.

## 3. 증거

- changeset: `changesets/20260728-sx1-impact-layouts` (custom-skills c267570·0a0fdf6)
- 검증: evidence `evidence/slide-expressive/sx1-layouts.md` — DoD 7항 전부 PASS, smoke 전체 exit 0.
- 크기 회고: changeset 1개(cross-repo 커밋 2)로 닫힘 — 독립 응집 변경 3개(레이아웃 2·문서/카탈로그)라 정합.
- 실표면: 브라우저에서 fixture 실조작 — 블롭 드리프트·단계 등장·일렁임·liquid 병합 실렌더 스크린샷 3매, Playwright emulateMedia로 reduced-motion 양쪽 분기 실측(reduce: 애니메이션 none + pauseAnimations true / normal: hmTitleIn 동작). 배포본에서 재확인.
- 재현: `cd ~/.claude/skills/presentation-slides-yusung/fixtures/impact-layouts-smoke && node ../../templates/validate-slides.mjs && node ../../templates/build-slides.mjs` 후 브라우저에서 01~03 열기

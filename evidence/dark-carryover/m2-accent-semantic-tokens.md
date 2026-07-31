# Evidence — M2: 강조·상태색 시맨틱 토큰 신설 + "토큰 부재" 마커 전수 해소

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m2-accent-semantic-tokens.md` · Changeset: `changesets/20260801-m2-accent-semantic-tokens/`

## step-1 — 토큰 신설 + 재생성 배선

| 검증 | 결과 |
|---|---|
| SSOT 추가분 | primitive 4램프(indigo 7·skyx 7·emerald 4·rose 5) + `askewly.violet-deep` · semantic `emphasis.*` 6종(on-solid 는 step-2 추가)·`status.*` 10종·`action.primary-hover`·`text.on-destructive` |
| 값 무손실 대조 | primitive 값 = `node_modules/tailwindcss/theme.css` 추출값 그대로 등재 (예: indigo-50 `oklch(0.962 0.018 272.314)` = Tailwind `oklch(96.2% .018 272.314)`) — 라이트 픽셀 동일 by construction |
| 재생성 diff | tokens.css `:root`+`.dark` 신설 변수만 추가, 기존 값 무변경 · DESIGN.md frontmatter 갱신 · llms 사본 `diff` identical ("llms copy identical") |
| 배선 | generate-tokens.mjs COLOR_MAPPINGS 18변수(+on-solid) · index.css `@theme inline` 18매핑 |
| build | vite build + prerender 755 routes PASS |
| 커밋 | `e9e4a30` |

## step-2 — 마커 전수 치환·제거

| 검증 | 결과 |
|---|---|
| "토큰 부재" 마커 잔여 | **0** — App.tsx 8건·article-documentation-layout.tsx 6건·ui/button·ui/badge·bottom-tab-bar 3건 치환. 장식 아바타 5색 1건은 콘텐츠 재판정(사유 정정 잔존 — finding 큐) |
| `#5f22a8` 리터럴 | 소멸 → `primary-hover` 토큰 (라이트 violet-deep / 다크 orchid) |
| lint:colors | 0 violations (allowlist 6) |
| dist CSS | 신설 유틸리티(bg-emphasis-surface·hover:bg-danger-solid-hover 등) 전수 방출 확인 |
| 다크 실렌더 | vite preview + Playwright — `.dark` 에서 CSS 변수 다크값 해석(`--emphasis-surface: oklch(25.7% .09 281.288)` 등) + docs 다크 스크린샷 회귀 없음 + 콘솔 0에러 |
| 커밋 | `5ef6115` |

## step-3 — 토큰 문서 표면 + 통합 검증

| 검증 | 결과 |
|---|---|
| 문서 표면 | docs Foundations Color 아티클(documentation-pages.ts)의 primitive·semantic 수기 열거에 신설 램프·`emphasis.*`·`status.*`·`primary-hover`·`on-destructive` 반영 (colors-page 는 팔레트 라이브러리 — 토큰 문서 아님 판정) |
| npm run lint | PASS (스캐너 0 violations 포함) |
| npm run build | PASS (prerender 755) |
| @askewly/design verify | **PASS — 90 files, no color literals, no file over 7 type sizes** (비악화) |
| llms 정합 | tokens json 사본 identical (step-2 재생성 후 유지) |
| Playwright | docs 라이트/다크 스크린샷 + 콘솔 0에러 (step-2 절 참조) |

## DoD 판정

"토큰 부재" 사유 마커 0 · 3-tier 토큰(라이트+다크) 승격 · SSOT→생성물→llms 정합 · 라이트 무손실(값 동일 승격) · 다크 대비 확인 · 게이트 전 PASS → **충족**.

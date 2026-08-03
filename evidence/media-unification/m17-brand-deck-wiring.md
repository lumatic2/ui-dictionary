# M17 — DESIGN.md→슬라이드 테마 자동 배선 Evidence

- Date: 2026-08-04 · Plan: `plans/2026-08-04-m17-slide-theme-generator.md` · Changeset: `changesets/20260804-m17-slide-theme-generator/`

## E2E 관측 2케이스 (human gate)

배선 절차(SKILL.md §6 브랜드 탐지 → 변환 → custom 트랙 빌드)를 그대로 밟아 프리뷰 덱을 생성, 실브라우저 렌더 후 사용자 관측.

| 케이스 | 양식 | 변환 | 대비(본문/보조/희미) | 관측 |
|---|---|---|---|---|
| ui-dictionary | 3-tier (tokens: semantic) | 29변수 전건, Geist 폰트 매핑 | 18.60 / 15.36 / 6.82 | **PASS** (사용자 "좋아" 2026-08-04) |
| 3d-repolis-portfolio | flat (Stitch colors) | 29변수 전건, 다크그린+골드 유지 | 16.94 / 10.45 / 8.83 | **PASS** (동일) |

- 관측 자료: `m17-shots/` 4장(생성 2케이스 3장 + 비교용 현행 askewly 1장) + Artifact 비교 페이지(claude.ai/code/artifact/7ca9d500-…)로 제시.
- 브라우저 콘솔 에러 0 (favicon 404 1건 — 덱 무관, 정적 서버 루트 사정).
- 워크플로우 실발화 증명: step-2 가 배선한 탐지→변환→custom 트랙 절차를 이 E2E 가 그대로 밟음(만들었다≠호출된다 방어).

## 실패 모드 실측 (조용한 기본값 금지 계약)

- **askew-app**: DESIGN.md 가 frontmatter 없는 표 기반(전체 20개 중 3개 이탈 양식) — 변환기가 "frontmatter 를 찾지 못했다"로 exit 1. 계획 failure probe 의 예정 대응대로 flat 케이스를 3d-repolis 로 교체.
- **대비 위반 차단**: self-test 픽스처(저대비 ink)가 WCAG 검사에서 exit 1 — DoD 실패 모드 요건 충족.

## 도구·배선 증거

- 변환기 확장: custom-skills `487bfea` (3-tier 파서·참조 해석·oklch→hex·필수 3원천+파생 fallback·self-test 6/6).
- 워크플로우 배선·경계 정정: custom-skills `55890eb` (SKILL.md §6 탐지 단계 + §7-5 + style-system.md 경계 revised).
- 기존 표면 무변경: canonical 테마 3종·css.mjs·custom-theme-smoke validate 회귀 PASS.

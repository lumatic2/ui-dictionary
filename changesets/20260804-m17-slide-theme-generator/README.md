# changeset: m17-slide-theme-generator

- Milestone: M17 — DESIGN.md→슬라이드 테마 자동 배선 (plan: `plans/2026-08-04-m17-slide-theme-generator.md`)
- Date: 2026-08-04

## step-1 — 변환기 확장 (custom-skills `487bfea`)

- `pt/scripts/design-md-to-theme.mjs` 확장: ① 3-tier tokens 구조 판독(들여쓰기 경로 파서 + `{참조}` 재귀 해석(순환 가드 8) + oklch→sRGB 변환 내장 + typography.font 매핑) ② 필수 원천을 3개(배경·본문·액센트)로 좁히고 나머지는 파생 fallback(mix 정적 근사 — 대비 계산 가능) ③ WCAG AA 대비 자기검사(본문 4.5:1·보조 3:1, FAIL=exit 1) ④ `--self-test` 6항 ⑤ flat 파서 camelCase 정규화·bare accent/primary/secondary 수집.
- Verify: self-test 6/6 PASS · 실물 3-tier(ui-dictionary DESIGN.md → 29변수, 대비 18.6/15.4/6.8) · 실물 flat(3d-repolis-portfolio → 29변수, 대비 16.9/10.5/8.8) · custom-theme-smoke validate 회귀 PASS.
- Failure probe 실현: askew-app DESIGN.md 는 frontmatter 없는 표 기반(20개 중 3개 이탈) — 변환기가 계약대로 실패 표면화(조용한 기본값 금지). **관측 flat 케이스를 3d-repolis-portfolio 로 교체**(plan step-3 probe 의 예정된 대응).

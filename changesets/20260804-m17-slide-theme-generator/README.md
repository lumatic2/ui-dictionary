# changeset: m17-slide-theme-generator

- Milestone: M17 — DESIGN.md→슬라이드 테마 자동 배선 (plan: `plans/2026-08-04-m17-slide-theme-generator.md`)
- Date: 2026-08-04

## step-1 — 변환기 확장 (custom-skills `487bfea`)

- `pt/scripts/design-md-to-theme.mjs` 확장: ① 3-tier tokens 구조 판독(들여쓰기 경로 파서 + `{참조}` 재귀 해석(순환 가드 8) + oklch→sRGB 변환 내장 + typography.font 매핑) ② 필수 원천을 3개(배경·본문·액센트)로 좁히고 나머지는 파생 fallback(mix 정적 근사 — 대비 계산 가능) ③ WCAG AA 대비 자기검사(본문 4.5:1·보조 3:1, FAIL=exit 1) ④ `--self-test` 6항 ⑤ flat 파서 camelCase 정규화·bare accent/primary/secondary 수집.
- Verify: self-test 6/6 PASS · 실물 3-tier(ui-dictionary DESIGN.md → 29변수, 대비 18.6/15.4/6.8) · 실물 flat(3d-repolis-portfolio → 29변수, 대비 16.9/10.5/8.8) · custom-theme-smoke validate 회귀 PASS.
- Failure probe 실현: askew-app DESIGN.md 는 frontmatter 없는 표 기반(20개 중 3개 이탈) — 변환기가 계약대로 실패 표면화(조용한 기본값 금지). **관측 flat 케이스를 3d-repolis-portfolio 로 교체**(plan step-3 probe 의 예정된 대응).

## step-2 — 워크플로우 배선 (custom-skills `55890eb`)

- SKILL.md §6 "프로젝트 브랜드 탐지" 신설(덱 대상 프로젝트 루트 DESIGN.md → custom 테마 기본 제안, 실패 시 표면화+canonical 폴백, G4 포함) + §7-5 제작 흐름 연결.
- style-system.md Custom Brand Theme 절 갱신(2양식·필수 3원천·대비 자기검사) + Boundary 정정(자기 프로젝트 DESIGN.md=정본 브랜드, 타 브랜드 복사 금지 유지 — 결정 2).
- Verify: 배포본-소스 diff 0 · 탐지 단계 grep 2건 · 구 경계 문구 잔존 0.

## step-3 — E2E 관측 2케이스 + 기록

- 관측 PASS 2건(사용자 2026-08-04 "좋아") — ui-dictionary(3-tier)·3d-repolis(flat), Artifact 비교 페이지로 제시. 상세: `evidence/media-unification/m17-brand-deck-wiring.md` + `m17-shots/` 4장.
- slide-spec §5 구현 완료 정정(범용 배선·기존 테마 존치·결함 해소 의미 명시) + §6 미구현 항목 해소 + llms 재생성.

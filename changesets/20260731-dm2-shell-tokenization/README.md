# changeset: dm2-shell-tokenization

- Milestone: DM2 — 사이트 셸 토큰 치환 + 하드코딩 색 스캐너 (plan: `plans/2026-07-31-dm2-shell-tokenization.md`)
- Date: 2026-07-31

## step-1 — 하드코딩 색 스캐너 + baseline

- `examples/ui-vocabulary-site/scripts/lint-hardcoded-colors.mjs` 신설 — 리터럴 팔레트 Tailwind 클래스(전 prefix × 팔레트/white/black, variant 접두 포함)+hex 검출. allowlist(marketing-section-preview·variation-demos), 줄/직전줄 `hardcoded-color-ok` opt-out, `--max N` 게이트(초과 exit 1)·`--list`.
- `package.json` `lint:colors` 등록.
- baseline 실측: **998건/21파일** — App 360·home-page 321·article-layout 170·palette-generator 68(콘텐츠 데이터)·term-visual 55 등. 오탐 표본 검수 3건(주석 제외·데이터 hex 진성 검출) PASS, `--max 900` 게이트 exit 1 동작 확인.

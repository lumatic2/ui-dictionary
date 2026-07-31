# Evidence — M6: 타이포 스케일 전수 등재 + Tailwind 배선

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m6-typography-scale.md` · Changeset: `changesets/20260801-m6-typography-scale/`

## step-1 — SSOT 확장 + 배선

| 검증 | 결과 |
|---|---|
| SSOT | typography.scale 5→10항목(2xs/xs/3xl/5xl/7xl 신규 — rem, Tailwind v4 기본값 그대로. xl 28 "미사용" 기록) |
| 값 대조 | `--font-size-{xs,3xl,5xl,7xl}` = Tailwind `--text-*` 기본값 전건 일치(.75/1.875/3/4.5rem) |
| 배선 실증 | 번들 `.text-5xl{font-size:var(--font-size-5xl); line-height:…--text-5xl--line-height}` — SSOT 경유 + 행간 쌍 보존 |
| computed 무손실 | colors h1 72/72 · get-started h1 48/48 · recipes h1 36/40(미배선 4xl 무변화) · terms h1 48/48 |
| rem 채택 근거 | px 강제 시 사용자 루트 폰트 확대 설정에서 렌더 변화(접근성 회귀) — 기본 상태 무손실 + rem 의미 보존 |

## step-2 — 문서·치환·통합 검증

| 검증 | 결과 |
|---|---|
| text-2xs | 셸 6파일 `text-[10px]` → `text-2xs` 치환, computed 10px 실측. 콘텐츠 데모 구간(면제 4파일·App 스니펫 크롬)은 유지 |
| Typography 아티클 | 9단계·배선 원칙·xl 기록 상태 반영(lead·본문·코드 표) |
| verify | **PASS — 90 files, no color literals, no file over 7 type sizes** (위반 0·면제 4 유지 — 비악화) |
| lint 체인 | oxlint·lint:colors(0)·lint:llms(PASS — M5 게이트가 M6 재생성 정합을 실감시) |
| build | prerender 755 PASS · 콘솔 0에러 |

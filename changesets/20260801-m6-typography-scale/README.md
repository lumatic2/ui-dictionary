# Changeset — M6: 타이포 스케일 전수 등재 + Tailwind 배선

- Milestone: M6 (goal `finding-cleanup`, plan: `plans/2026-08-01-m6-typography-scale.md`)
- Date: 2026-08-01

## step-1 — SSOT 확장 + 재생성 + @theme 배선

- typography.scale 5→10항목: 신규 2xs(.625rem)/xs(.75rem)/3xl(1.875rem)/5xl(3rem)/7xl(4.5rem) — **rem 단위로 Tailwind v4 기본값 그대로**(px 강제 시 사용자 폰트 확대 설정에서 렌더가 달라져 rem 채택 — 무손실 계약의 엄밀 해석). xl(28) "실화면 미사용" 기록.
- FONT_SIZE_MAPPINGS 10변수 확장 → tokens.css·DESIGN.md 재생성 → `@theme inline` --text-{2xs,xs,3xl,5xl,7xl} 배선(lg 20·2xl 40 은 Tailwind 동명 기본값과 달라 미배선).
- Verify: SSOT↔Tailwind 값 표 대조 전건 일치 · 번들 `.text-5xl{font-size:var(--font-size-5xl); line-height:…--text-5xl--line-height}` — SSOT 경유 + 행간 쌍 무손 · computed 표본(colors h1 72/72·get-started h1 48/48·recipes h1 36/40 무변화·10px 요소 존재) · build+prerender 755 PASS.

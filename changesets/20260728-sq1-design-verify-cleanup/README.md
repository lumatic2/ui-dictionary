# changeset — SQ1: 디자인 verify 위반 정리

> Milestone: SQ1 (goal `site-quality`) · Plan: `plans/2026-07-28-sq1-design-verify-cleanup.md`

## step-1 — oklch→hex 유틸 추출 + 쇼케이스 셰이더 토큰화

- `src/lib/css-color.ts` 신설 — `cssColorToHex`(1×1 canvas sRGB 정규화)·`readCssVarsAsHex` 재사용 유틸 (VI8 finding: shader-gradient-surface 에서 추출).
- `shader-gradient-surface.tsx` — 유틸 참조로 전환. hex 폴백 상수 삭제: 정적 폴백을 CSS `var(--primary/--accent/--muted)` 직접 참조로 재설계(항상 깔리는 베이스 층), 셰이더는 토큰 판독 성공 시에만 위에 마운트.
- `home-page.tsx` ShaderGradientDemo — 하드코딩 hex 5색 제거. 브랜드 프리미티브 4종(`--askewly-violet/orchid/mint/sky`) + 컨테이너 실배경(getComputedStyle) 판독으로 동일 조합 재현.
- 검증: tsc·build PASS, verify 79→77(-2), 브라우저 실렌더 canvas 1·콘솔 0에러.

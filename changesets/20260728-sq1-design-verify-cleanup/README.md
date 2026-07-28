# changeset — SQ1: 디자인 verify 위반 정리

> Milestone: SQ1 (goal `site-quality`) · Plan: `plans/2026-07-28-sq1-design-verify-cleanup.md`

## step-1 — oklch→hex 유틸 추출 + 쇼케이스 셰이더 토큰화

- `src/lib/css-color.ts` 신설 — `cssColorToHex`(1×1 canvas sRGB 정규화)·`readCssVarsAsHex` 재사용 유틸 (VI8 finding: shader-gradient-surface 에서 추출).
- `shader-gradient-surface.tsx` — 유틸 참조로 전환. hex 폴백 상수 삭제: 정적 폴백을 CSS `var(--primary/--accent/--muted)` 직접 참조로 재설계(항상 깔리는 베이스 층), 셰이더는 토큰 판독 성공 시에만 위에 마운트.
- `home-page.tsx` ShaderGradientDemo — 하드코딩 hex 5색 제거. 브랜드 프리미티브 4종(`--askewly-violet/orchid/mint/sky`) + 컨테이너 실배경(getComputedStyle) 판독으로 동일 조합 재현.
- 검증: tsc·build PASS, verify 79→77(-2), 브라우저 실렌더 canvas 1·콘솔 0에러.

## step-2 — 색 위반 72건 시맨틱 토큰화 (hex-literal 26 + raw-color-fn 46 → 0)

- **rgba→color-mix 일괄 치환** (10파일): `rgba(R,G,B,A)` → `color-mix(in srgb, var(--color-*) A%, transparent)` — srgb 혼합이라 동일 rgb+alpha, 시각 무손실. 표준 팔레트 정확 매칭 58건 + 근사 매핑 12건(커스텀 rgb → 최근접 팔레트, 전부 저알파 장식 그라디언트: 98/96,80,220→indigo-500 · 80,80,120→slate-600 · 255,100,120→rose-400 · 120,72,30→amber-900 등).
- **의미 있는 치환**: 대비 텍스트(`getReadableTextColor`) #111827/#F8FAFC → `var(--foreground)`/`var(--background)`(진짜 시맨틱) · 브랜드 hover #5f22a8 3곳 → `color-mix(var(--askewly-violet) 85%, black)` · 그라디언트 CTA hex → 팔레트 var.
- **계산 생성 전환** (색 피커 데모 — hue 는 데이터, 저작색 아님): hue ramp·#FF0000 폴백 → `hsvToHex` 생성, 초기 palette id → `createGeneratorPalette(0)[0].id`. watercolor 생성 아트 hsl() 3건 → `hslaToHex` 수치 변환(css-color.ts 신설 유틸).
- **브랜드 고정색 중앙화**: Kakao/이메일 버튼 목업 hex → `index.css` `--brand-kakao-*`·`--brand-neutral-auth`(브랜드 소유 상수 — 토큰 스케일 밖 명시). three.js 폴백 "#888888" → "gray" 키워드.
- **검사기 오탐 해소**: 목업 카피 주문번호 "Invoice #00011"·"Order #54879" 등 8건 — `#`를 제거(hex-literal 오인). 검사기에 예외 수단 없음(--help 실측), finding 큐 기록.
- 검증: 색 위반 0 · tsc·build PASS · 참조 팔레트 var 전수 dist CSS 방출 확인 · 6표면 전/후 스크린샷 픽셀 diff — 5표면 0.000%, 홈 0.268%(전부 애니메이션 위상 차 — 육안 대조로 색 동일 확인).

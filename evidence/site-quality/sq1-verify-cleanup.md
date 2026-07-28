# SQ1 — 디자인 verify 위반 정리 evidence (2026-07-28)

> Milestone: SQ1 (goal `site-quality`) · Plan: `plans/2026-07-28-sq1-design-verify-cleanup.md` · Changeset: `changesets/20260728-sq1-design-verify-cleanup/`

## 1. 위반 감소 실측

`npx @askewly/design verify src/components --ext tsx`:

| 시점 | hex-literal | raw-color-fn | typography | 계 |
|---|---|---|---|---|
| 착수 (2026-07-28) | 26 | 46 | 7 | 79 |
| 마감 | **0** | **0** | 7 | 7 |

- 색 위반 72건 전량 해소. 타이포 7건은 규칙 구조 충돌(반응형 쌍 2계수·멀티 데모 파일·미니어처)로 **사용자 결정(2026-07-28): 게이트 보정 후 처리** — SQ1 범위에서 명시 이월.

## 2. 시각 보존 (전/후 스크린샷 픽셀 diff)

6개 대표 표면(홈·pattern hero/cta/bento·term accordion/badge), 1280px 풀페이지:

- 5표면 변화 픽셀(Δ>8) **0.000%**, 홈 0.268% — 육안 대조로 전부 애니메이션 위상 차(물리 칩 위치·커버플로 프레임) 확인, 색 변화 0.
- 근사 매핑 12건(커스텀 rgb→최근접 팔레트)은 전부 저알파 장식 그라디언트 — diff 에 나타나지 않음.

## 3. 회귀 게이트

- tsc·build(1.05s)·lint exit 0 · 참조한 팔레트 CSS 변수 전수 dist 방출 확인(누락 0).
- Playwright 스모크 4라우트(/ · /terms/accordion · /recipes · /patterns/marketing-hero-sections) 렌더 PASS · 콘솔 에러 0.
- 쇼케이스 셰이더 데모 실렌더(canvas 마운트 = 토큰 판독 성공 경로) PASS.

## 4. VI8 이월 finding 해소

- `src/lib/css-color.ts` 신설 — `cssColorToHex`(oklch→sRGB hex 재사용 유틸)·`readCssVarsAsHex`·`hslaToHex`.
- 쇼케이스 ShaderGradientDemo 하드코딩 hex 5색 → 브랜드 토큰 4종 + 컨테이너 실배경 판독.

## 5. 적발·기록 (finding 큐 → plan doc)

- 검사기 hex-literal 오탐 8건(목업 주문번호) — 카피 수정으로 해소, 검사기 개선 후보 기록.
- home-page MeshGradient eager import(티어④ lazy 위반) · watercolor-pointer-field 데드 코드 — finding 큐.
- 타이포 5단계/파일 규칙 보정 필요 — ROADMAP 유지보수 후보 등재.

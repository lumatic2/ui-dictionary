# 선언 티어 표면 질감 recipe 3종 — mesh/glass/grain (VI2 Step 1)

- Date: 2026-07-17
- Milestone: VI2 Step 1 (plan: `docs/plans/2026-07-17-vi2-css-svg-recipes.md`)
- Scope: `recipes/marketing/mesh-gradient-surface.md`·`recipes/overlays/glass-panel.md`·`recipes/marketing/grain-texture-overlay.md` + code_asset 3종 + gallery 배선 2파일

## What

- VI1 결정 표의 실무용 ① 티어 기법 3종을 recipe + live 데모로 계약화. 전부 의존성 0(CSS/SVG data URI만), 색은 `color-mix(in oklch, var(--token))` 파생 — 리터럴 0.
- 각 recipe에 티어 판정 근거(왜 ①인가·티어 상승 금지 조건)와 시그니처 접점(정적 기본, 애니메이션은 수동 opt-in) 명시.
- 데모 합성 구조: glass·grain 데모가 mesh를 배경으로 재사용 — 기법 조합 사용례 자체가 데모.

## Verification

- [x] validate-recipes PASS (39)
- [x] site build PASS
- [x] 브라우저 실구동: mesh 4레이어+color-mix computed, glass backdrop-filter blur(12px)+translucent fill, grain soft-light+pointer-events:none+opacity 0.28
- [x] 라이트/다크 스크린샷 3장 (mesh-light·glass-light·grain-mesh-dark) — 다크에서 텍스트 대비 유지
- [x] 시그니처 자가 판정: 원칙 5/5(토큰 파생·절제·정적 기본), 비선호 0(break-keep 적용·리터럴 0·헤비 섀도 없음)

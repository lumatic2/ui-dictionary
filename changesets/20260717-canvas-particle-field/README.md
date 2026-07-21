# Canvas Particle Field recipe (VI4 Step 1)

- Date: 2026-07-17
- Milestone: VI4 Step 1 (plan: `plans/2026-07-17-vi4-canvas-webgl-tier.md`)
- Scope: `recipes/application-ui/canvas-particle-field.md` + code_asset + gallery 배선

## What

- ③ 티어 대표 recipe — 60개 점을 DOM 없이 2D 픽셀 버퍼에 드로우. 계약의 핵심 3가지: ① reduced-motion에서 정지 프레임만(JS 루프는 미디어쿼리로 자동 억제 안 됨을 명문화) ② rAF 언마운트 cleanup ③ aria-hidden + pointer-events:none 장식 계약.
- 점 색은 토큰 커스텀 프로퍼티(--primary) 판독 — 드로우 루프에 하드코딩 0.

## Verification

- [x] validate-recipes PASS (45) + build PASS
- [x] 브라우저 실구동: 픽셀 드로우 확인 + 600ms 간격 알파섬 변화(애니메이션 구동) + pointer-events none/aria-hidden computed
- [x] failure probe: reduced-motion 분기 코드(matchMedia → draw 1회 후 return), hex 리터럴 0

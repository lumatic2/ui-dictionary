# Lazy three.js Object Scene recipe (VI4 Step 2)

- Date: 2026-07-17
- Milestone: VI4 Step 2 (plan: `plans/2026-07-17-vi4-canvas-webgl-tier.md`)
- Scope: `three`+`@react-three/fiber`(+`@types/three` dev) 도입, `recipes/application-ui/lazy-three-object-scene.md` + code_asset 2모듈(lazy 경계) + gallery 배선, llms 재생성(56 assets)

## What

- ④ 티어 recipe — 계약의 핵심은 전달 방식: three.js(~155KB gzip 고정비)는 dynamic import 뒤에만 존재. "lazy 경계는 최적화가 아니라 패턴"(knowledge 판정 절차 4).
- Suspense 로딩 스켈레톤 + WebGL 실패 error boundary(정적 폴백 — 깨진 캔버스 금지) + reduced-motion 시 자동회전 정지(JS 분기) + 머티리얼 색 토큰 판독.

## Verification

- [x] 빌드 청크 분리 실측: three-object-scene-impl 881.80kB(gzip 234.26) 별도 청크, 메인 청크 3224.21→3229.80kB(gzip +2.4KB ≤ 5KB probe) — 사용자 GO 조건(비악화) 충족
- [x] 브라우저 실구동: 상세 진입 시에만 impl 청크 요청(lazy 실증, performance entries) → WebGL 캔버스 렌더(446×254) → 토큰 컬러 조명 오브젝트 스크린샷(three-scene.png)
- [x] validate-recipes PASS + generate-llms-txt PASS (56 assets)
- [x] 배포 curl: 2 recipe 200 + 오경로 404 (push 후 기록)

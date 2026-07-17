# Motion 도입 + magnetic/spring recipe 2종 (VI3 Step 1)

- Date: 2026-07-17
- Milestone: VI3 Step 1 (plan: `docs/plans/2026-07-17-vi3-motion-recipes.md`)
- Scope: `motion` 의존성(사용자 확정), `recipes/marketing/magnetic-hover-button.md`·`recipes/application-ui/spring-drag-snap-card.md` + code_asset 2종 + gallery 배선

## What

- ② 티어 대표 2패턴 계약화. magnetic hover는 **수동 opt-in**(시그니처 원칙 5)을 recipe Intent에 볼드로 박음 — 제품 전역 기본값 금지. spring drag는 중단 가능성(re-grab 시 재타게팅)이 실무 기본값인 이유를 가르치는 형태.
- 양쪽 다 `useReducedMotion` 분기(기울임 제거/즉시 복귀) + 키보드 계약 무손상(자석은 focus에 무반응, 기능 동일).

## Verification

- [x] validate-recipes PASS (42) + site build PASS
- [x] 번들 전후: 3092.79→3224.21 kB (gzip 710.33→753.29, +42.96KB — 예상 30~50KB 범위 내)
- [x] 브라우저 실구동: 자석 — 코너 호버 시 translate ~9.8px → 이탈 시 원점 복귀(transform none) / 드래그 — -97.8px 이동·held scale 1.04 → 릴리즈 후 스프링 원점 복귀·scale 리셋
- [x] failure probe: 데모 hex 리터럴 0, focus-visible ring 유지(버튼 계약 무손상)

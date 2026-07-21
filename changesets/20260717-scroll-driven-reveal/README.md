# Scroll-Driven Reveal recipe + VI2 배포 (VI2 Step 2)

- Date: 2026-07-17
- Milestone: VI2 Step 2 (plan: `docs/plans/2026-07-17-vi2-css-svg-recipes.md`)
- Scope: `recipes/marketing/scroll-driven-reveal.md` + code_asset + gallery 배선, llms 재생성(51 assets)

## What

- CSS view-progress timeline(`animation-timeline: view()`) 기반 스크롤 진입 리빌 — 리스너·IntersectionObserver 없음(① 티어).
- 안전 설계가 계약의 핵심: 숨김 초기 상태는 `@supports (animation-timeline: view())` 안에만 존재 — 미지원 브라우저·reduced-motion에서 콘텐츠는 항상 가시(리빌 실패 ≠ 콘텐츠 소실).
- 티어 상승 경계 명시: 핀·스크럽·시퀀싱이 필요하면 ② GSAP ScrollTrigger로 (결정 표 인용).

## Verification

- [x] validate-recipes PASS (40) + generate-llms-txt PASS (51 assets)
- [x] site build PASS
- [x] 브라우저 실구동: CSS.supports(view()) true 환경에서 폴드 아래 opacity 0 → 스크롤 후 1 전환 관측, 중간 스크롤 스크린샷
- [x] failure probe: 숨김 상태가 @supports 게이트 내부에만 존재(코드 계약) + prefers-reduced-motion에서 animation:none
- [x] 배포 curl: 신규 recipe 4종 200 + 오경로 404 (push 후 기록)

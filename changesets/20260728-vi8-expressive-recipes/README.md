# changeset — VI8 실증 확장

- Milestone: VI8 (goal `visual-impact-consolidation`)
- Plan: `plans/2026-07-28-vi8-expressive-recipes.md`
- 승인: VI7 영수증 `--chain VI8` 연쇄 집행, VI8 영수증 등록 2026-07-28

## step-1 — pinned-scroll-sequence recipe (② GSAP)

- gsap ^3.15.0 신규 의존성 — dynamic import 격리, 별도 청크 69.94kB(gzip 27.41kB), 메인 청크 미증가.
- `recipes/marketing/pinned-scroll-sequence.md` + 데모 컴포넌트(스코프드 scroller·pin+scrub 3단계·reduced-motion 정적 분기·gsap.context revert cleanup).
- validate-recipes 적발 2건(필수 섹션 Code/Agent notes 누락) 교정 후 PASS.

## step-2 — shader-gradient-surface recipe (④ Paper Shaders)

- 기존 의존성 재사용(@paper-design/shaders-react), lazy 경계 + Suspense/reduced-motion/WebGL 실패가 전부 같은 정적 토큰 그라디언트 폴백으로 수렴.
- 색은 시맨틱 토큰 CSS 변수 판독(--primary/--accent/--muted) — 쇼케이스의 하드코딩 hex 를 교정한 정본. validate-recipes 적발(프리미티브 토큰 직접 참조 금지) 교정 후 PASS(recipes ok: 47).
- 갤러리 데이터·데모 레지스트리에 2종 등재.

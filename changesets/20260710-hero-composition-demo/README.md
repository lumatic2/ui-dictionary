# 20260710 Hero Composition Demo (CF2 선반)

## Target

- ROADMAP milestone: CF2 - Showcase Atlas Source-Quality 카드 (선반 작업 — CF2 활성화 시 이어받음)
- Horizon: `docs/horizons/2026-07-content-fill.md`

## Scope

- `src/components/home-page.tsx`: Showcase Atlas `landing` 카드를 placeholder에서 `HeroCompositionDemo` 실데모로 교체 — `recipes/marketing/landing-hero.md` 레시피의 Anatomy/Variants 파생 3개 컴포지션(Centered/Proof surface/Compact), 실사 mock 카피, 탭 전환 + 5.2s 자동 순환, semantic 토큰만 사용(색 리터럴 grep 0).
- `src/index.css`: `hero-composition-fade` keyframes 1건 (기존 관례 준수).
- **프로덕션 게이트 무변** — `placeholderAtlasItemIds` 유지, 카드 공개는 CF2 milestone 게이트에서 일괄.

## Verification

- [x] `npm run lint` PASS, `npm run build` PASS.
- [x] dev: 탭 전환·자동 순환 동작, 다크 모드 토큰 반전 확인 (구현 에이전트).
- [x] reduced-motion fallback: `usePrefersReducedMotion` 조기 반환 + 정적 렌더 (소스 검증).
- [x] prod preview: landing 카드 여전히 비노출 (8카드 그대로).

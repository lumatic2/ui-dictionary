# SMC3 - 컴포넌트 레시피 + 안티패턴 첫 배치 구현 계획

Date: 2026-07-07
Status: active
Milestone: SMC3 (horizon `system-model-core`)
설계 입력: `docs/design-system/recipe-format.md` (확정 계약), `docs/research/smc3-recipe-format-draft.md`

## Step 트리

- [ ] Step 1 - 포맷 계약 확정: `docs/design-system/recipe-format.md`. (verify: 초안 게이트 메모 3건 반영 — kind 어휘 재사용, dependencies 평탄화, Button=forms)
- [ ] Step 2 - 검증기 `scripts/validate-recipes.py`: recipe-format §검증 계약 8항목. (verify: 빈 recipes/에서 PASS + 고의 위반 시 FAIL)
- [ ] Step 3 - 첫 배치 레시피 5개 (병렬 작성, 각 1파일):
  - recipes/forms/button.md (ui/button.tsx — component 토큰 3-tier 체인 실증)
  - recipes/navigation/topbar-command-search.md (topbar-search.tsx — 키보드 상호작용)
  - recipes/marketing/landing-hero.md (home-page.tsx 상단)
  - recipes/application-ui/showcase-card.md (인터랙티브 쇼케이스 카드 — motion 안티패턴)
  - recipes/overlays/popover.md (ui/popover.tsx — topbar가 참조하는 2-depth 체인)
  (verify: validate-recipes.py 5/5 PASS + component_refs 체인 popover←topbar 해석)
- [ ] Step 4 - 공용 소비 데모: sonnet 에이전트에게 레시피 1개(landing-hero)만 주고 독립 미니 페이지를 구현시켜 ① tokens_used만 사용(hex 0) ② lint-tokens 어휘로 검증 ③ Chrome 렌더 확인 — "사이트 페이지와 에이전트 구현이 같은 소스에서 파생"의 증명. (verify: 데모 산출물 + Chrome 스크린샷 + hex grep 0)
- [ ] Step 5 - ROADMAP/plan 동기화 + 커밋/push.

## 결정 로그

1. kind는 term kind 6종 어휘 재사용 (신조어 금지) — 확정.
2. Button의 pattern_group = forms — 확정.
3. 코드는 code_asset 포인터 + 발췌만 (단일 markdown 내장 대안 기각 — drift) — 확정.
4. 사이트에서 레시피 렌더링(Pattern 페이지화)은 이번 milestone 밖 — 후속.
5. 데모 산출물은 `tmp/` 아닌 `docs/research/assets/smc3-recipes-2026-07-07/`에 증거로 보존.

## 중단점

- Step 4 데모가 실패(에이전트가 토큰 어휘를 벗어남)하면 레시피 Agent notes를 보강해 1회 재시도, 재실패 시 정지·보고.

## Changelog

- 2026-07-07: 최초 작성.

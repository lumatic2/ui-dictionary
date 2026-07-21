# SMC3 - 컴포넌트 레시피 + 안티패턴 첫 배치 구현 계획

Date: 2026-07-07
Status: completed 2026-07-07 (SMC3 closed — 포맷 계약 + 검증기 + 레시피 5개 + 공용 소비 데모 성공. 데모 발견 갭: fontFamily 미방출→즉시 수정, hero pill 버튼 모순→레시피에 deviation 기록·제품 표면 pass에서 정합화, 컨테이너 폭/버튼 규격 토큰 부재→SSOT 확장 후속 큐)
Milestone: SMC3 (horizon `system-model-core`)
설계 입력: `docs/design-system/recipe-format.md` (확정 계약), `docs/research/smc3-recipe-format-draft.md`

## Step 트리

- [x] Step 1 - 포맷 계약 확정: `docs/design-system/recipe-format.md`. (verify: 게이트 메모 3건 반영 ✓, f66bf47)
- [x] Step 2 - 검증기 `scripts/validate-recipes.py`. (verify: 14종 위반 검출 + 빈 트리 PASS ✓)
- [x] Step 3 - 첫 배치 레시피 5개 — `recipes ok: 5`, popover←topbar 체인 해석 ✓ (04ec1e8):
  - recipes/forms/button.md (ui/button.tsx — component 토큰 3-tier 체인 실증)
  - recipes/navigation/topbar-command-search.md (topbar-search.tsx — 키보드 상호작용)
  - recipes/marketing/landing-hero.md (home-page.tsx 상단)
  - recipes/application-ui/showcase-card.md (인터랙티브 쇼케이스 카드 — motion 안티패턴)
  - recipes/overlays/popover.md (ui/popover.tsx — topbar가 참조하는 2-depth 체인)
  (verify: validate-recipes.py 5/5 PASS + component_refs 체인 popover←topbar 해석)
- [x] Step 4 - 공용 소비 데모: 에이전트가 레시피·토큰만으로(원본 코드 접근 금지) 자립형 hero HTML 구현 — `docs/research/assets/smc3-recipes-2026-07-07/hero-demo.html` + 렌더 스크린샷. :root 밖 색 리터럴 0, var 24개 전부 tokens.css 실존. 부수 성과: 레시피 갭 3건 발견(fontFamily 방출 수정 완료 / hero pill 모순 기록 / 컨테이너·버튼 규격 토큰 부재 후속). (verify: Chrome 렌더 ✓ + 리터럴 grep ✓)
- [x] Step 5 - ROADMAP/plan 동기화 + 커밋/push.

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

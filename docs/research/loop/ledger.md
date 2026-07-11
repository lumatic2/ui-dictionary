# Reference Loop Ledger

Date: 2026-07-12
지위: RL 배치 장부. 절차는 [reference-loop.md](../reference-loop.md)가 정본이다. 한 배치 = 한 행.

| batch | date | surface | collected | duplicates_filtered | promoted (artifacts) | verification | amendments |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 20260712-commerce | 2026-07-12 | commerce | 10 | 4 (`address-form-autocomplete` dropped — behaviorally broader than existing `address-autocomplete` single input, no alias added; `sticky-order-total-bar` no new term — added `related` on `cart-summary-bar`→`cart-summary` noting the checkout-stage sticky total must match; `product-gallery` duplicate of existing `image-gallery` term (same base gallery+thumbnail concept, group `data-commerce-billing`) — added EN alias "Product gallery" / KO alias "상품 이미지 갤러리"; `category-filter-facets` duplicate of existing `faceted-filter` term — added EN alias "Category filter facets" / KO alias "카테고리 필터") | recipes: `cart-drawer`, `shipping-method-selector` (both new `code_asset` implementations under `examples/ui-vocabulary-site/src/components/`); terms: `reviews-summary-block`, `order-history-list`, `product-quickview-modal`, `incentive-trust-strip` | `node scripts/audit-recipe-candidates.mjs --input <batch>` pre-promotion: exit 0, 4 warnings (as given). `python scripts/validate-recipes.py`: exit 0, "recipes ok: 15". `python scripts/validate-ui-vocabulary.py`: exit 0, "terms ok: 540". `node scripts/generate-llms-txt.mjs`: exit 0, both new recipes auto-listed under `## Recipes` (glob-discovered, no `FIXED_ASSETS` edit needed/possible — see amendments). `npm run build` (site): exit 0, 540 terms generated, no TS errors. `npm run lint` (site): exit 0, only pre-existing shadcn `only-export-components` warnings. CLI `npm run build:data`: exit 0, "terms=540 recipes=15" (new content confirmed present in `packages/cli/data/recipes.json`). | `reference-loop.md` §llms.txt 등록 절차가 stale: `generate-llms-txt.mjs`의 `## Recipes` 섹션은 `recipes/**/*.md`를 glob으로 자동 발견하고 있어(코드 확인, 71번째 줄 `collectRecipes()`), `FIXED_ASSETS`는 recipe가 아닌 원칙/토큰/taxonomy/계약 문서 전용이다. RL 절차의 "신규 recipe는 FIXED_ASSETS에 수동 추가" 지시는 현재 스크립트와 맞지 않으므로 다음 절차 갱신 시 반영 필요 (본 배치에서는 reference-loop.md를 직접 수정하지 않음, 오케스트레이터 fold 대상). 또한 dedup 스테이지 순서 관련: `audit-recipe-candidates.mjs`를 promotion 이후 재실행하면 방금 승격한 항목과 자기 자신이 매치되어 의도적으로 에러가 뜬다 — 이는 정상이며, 절차상 dedup은 adapt 이전에 1회만 통과 확인하면 되고 promotion 후 재실행 대상이 아니라는 점을 절차 문서에 명시하면 좋겠다. |

## Changelog

- 2026-07-12: 초판. 아직 배치 기록 없음.
- 2026-07-12: 첫 실증 배치(`20260712-commerce`) 기재 — RL Step 3 완료.

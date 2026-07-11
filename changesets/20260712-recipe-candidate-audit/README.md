# Recipe Candidate Audit — Dedup/Schema Tool

Target: milestone RL (`docs/plans/2026-07-12-rl-reference-loop-pipeline.md`, Step 2)

## Outcome

- Added `scripts/audit-recipe-candidates.mjs`, a Node script (no new npm deps — reuses the `yaml` package already resolved via `examples/ui-vocabulary-site`) that audits a reference-loop candidate inbox document (default `docs/research/loop/inbox.yml`, override with `--input <path>`).
- Schema checks: required candidate fields present (`id`, `name`, `pattern_group`, `proposed_artifact`, `source`, `summary`, `anatomy`, `transferable`, `non_transferable`, `dedup_hints`), kebab-case id, `pattern_group` against the 10 taxonomy values (`docs/design-system/pattern-taxonomy.md`), `surface` (top-level) against the 7 surface ids, `proposed_artifact` in `recipe|term|alias|related`, `source.tier` in 0-3, `source.url` http(s), `source.accessed` as `YYYY-MM-DD`.
- Duplicate-risk checks reuse the `audit-ui-vocabulary-candidates.mjs` approach: normalized-name/id substring matching plus Jaccard token-overlap similarity (score ≥ 0.6 is a risk).
  - Exact id/name/alias overlap against existing `recipes/*/*.md` frontmatter (`id`, `name`) and `docs/ui-vocabulary/terms.yml` (`id`, `en.name`/`ko.name`, `en.aliases`/`ko.aliases`) is always reported as an error.
  - Near-matches against recipes/terms are reported as warnings by default; `--strict-duplicates` promotes them to errors.
  - Intra-batch duplicates (two candidates in the same inbox too similar to each other) use the same exact/near-match logic and are also promoted to errors under `--strict-duplicates`.
- Exit code: 0 when there are no errors (warnings alone don't fail the run), 1 when any error is present.
- Fixtures added under `scripts/fixtures/reference-loop/`:
  - `inbox-clean.yml` — 3 valid candidates (commerce surface) that don't collide with existing recipes/terms.
  - `inbox-duplicate.yml` — 3 candidates: one with an id/name that exactly matches the existing `recipes/commerce/checkout-order-summary.md` recipe, one whose name (`Order summary`) exactly matches an alias of the existing `cart-summary` term, and one with multiple planted schema violations (invalid `pattern_group`, invalid `source.tier`/`url`/`accessed`, empty `name`/`summary`, empty list fields).

This is a pure addition: no existing files were modified, no data was promoted, no `git commit`/`push` was run.

## Verification

- `node scripts/audit-recipe-candidates.mjs --input scripts/fixtures/reference-loop/inbox-clean.yml` → exit 0. Output: `recipe candidate inbox ok: 3 candidates` plus 5 non-fatal duplicate-risk warnings (near-matches against existing terms like `switch`, `feature-comparison`, `plan-card`, `select`, `time-picker`) — done, observed.
- Same command with `--strict-duplicates` → exit 1, the 5 warnings above are promoted to errors (`errors: 5`) — done, observed.
- `node scripts/audit-recipe-candidates.mjs --input scripts/fixtures/reference-loop/inbox-duplicate.yml` → exit 1. All 3 planted problems reported:
  - `ERROR: checkout-order-summary: exact overlap with existing recipe checkout-order-summary (id "checkout-order-summary" matches)`
  - `ERROR: cart-summary-duplicate: exact overlap with existing term cart-summary (name "Order summary" matches alias)`
  - `ERROR: this-candidate-is-broken: name must be non-empty text` (plus 7 more schema errors on the same candidate: summary, invalid pattern_group, anatomy/transferable/non_transferable lists, source.tier/url/accessed)
  - (bonus, not planted) an intra-batch exact-overlap error between `checkout-order-summary` and `cart-summary-duplicate` since both fixture candidates independently collide with the same real "order summary" concept.
  - done, observed — 12 errors, 5 warnings total.

## Result

All three verification commands were run and produced the exit codes and planted-problem detections described above. No pre-existing files were touched.

## 오케스트레이터 게이트 수정 (2026-07-12)

워커 산출을 독립 재검증하는 과정에서 두 가지를 수정했다 (fixture 3케이스 + 실수집 배치 `collect-commerce.yml`로 재검증):

1. **스키마 정합**: `transferable`/`non_transferable`은 정본 스키마(`docs/research/reference-loop.md`)상 문자열인데 스크립트가 리스트만 허용했다 → `checkTextOrList`로 문자열/리스트 겸용. `dedup_hints`는 빈 리스트 허용(근접 항목 없는 후보가 정상)으로 완화.
2. **dedup_hints 오염 제거**: 후보 비교 문구에 `dedup_hints`(기존 항목 포인터)가 별칭처럼 합쳐져 (a) 힌트를 공유한 후보끼리 허위 intra-batch exact overlap, (b) 힌트 대상과의 동어반복 duplicate-risk(1.00)가 발생 → intra-batch·vs-repo 양쪽 비교에서 제외.

수정 후 재검증: clean fixture exit 0 (warnings 5→2), duplicate fixture exit 1 (계획된 3문제 전부 검출 유지, errors 11), 실배치 commerce 10후보 exit 0 + 유의미 경고 4건만 잔존 (`address-form-autocomplete` vs 기존 `address-autocomplete` 등 — Step 3 적응 단계에서 판정할 실신호).

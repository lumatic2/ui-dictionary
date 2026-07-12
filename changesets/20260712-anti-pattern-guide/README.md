# Anti-Pattern Guide — Unified Agent Checklist

Target: SD (`docs/plans/2026-07-12-sd-surface-depth.md`, Step 5)

## Outcome

- Added `docs/design-system/anti-patterns.md`: an agent-facing, Korean-language checklist that distills the `## Anti-patterns` sections of all 35 `recipes/*/*.md` files into 12 general clusters (금액·총액 정직성, 파괴적 동작 보호, 접근 가능한 상호작용 경로 보장, 상태 신호는 색상 단독 금지, 빈 상태·영 결과 원인 구분, 파생 상태 단일 출처, 토큰 시스템 우회 금지, 컴포넌트 계약 혼용 금지, 구조화된 데이터 평탄화 금지, 레이아웃·스크롤 메커니즘 충돌 방지, 부분 완료를 완료로 제시하지 않는다, 과제 없는 기능·카드 전체 노출 금지). Each cluster is: 원칙 → 왜 → 위반 예(recipe pointer links only, no body text copied) → 에이전트 지시형 문구 (a prompt-ready imperative sentence).
- The guide is a distillation, not a concatenation — every recipe's Anti-patterns bullets were read and clustered by underlying failure mode rather than surface/category. All 35 recipes contribute at least one pointer; several recipes contribute to more than one cluster where their anti-patterns span more than one failure mode.
- The doc explicitly states it does not duplicate `docs/design-system/principles.md` (the more abstract 8-principle SSOT) — it is scoped to more tactical, recipe-corpus-specific failure patterns, and defers to principles.md on conflict.
- Registered the new doc in `scripts/generate-llms-txt.mjs`'s `FIXED_ASSETS` under the `Principles` section (same section as `principles.md`, since both are cross-cutting agent guidance rather than a single recipe/token/taxonomy asset).
- Added `changesets/20260712-anti-pattern-guide/README.md` (this file).

No recipe, term, package, app, or reference-loop file was touched. No git commit/push was run.

## Verification

- `node scripts/generate-llms-txt.mjs` → exit 0. Output: `wrote examples/ui-vocabulary-site/public/llms.txt (42 assets copied to examples/ui-vocabulary-site/public/llms/)` — done, observed.
- Confirmed the new doc appears in the generated index: `grep -n "anti-patterns" examples/ui-vocabulary-site/public/llms.txt` returns the `docs/design-system/anti-patterns.md` entry under the `## Principles` section, and `examples/ui-vocabulary-site/public/llms/docs/design-system/anti-patterns.md` exists (200 lines, raw copy) — done, observed.
- Recipe link integrity: extracted every `` `recipes/<group>/<id>.md` `` reference from the new guide with `grep -oE` + `sort -u` (29 unique paths after de-dup across 12 clusters), checked each with a `[ -f "$f" ]` loop — all resolved. Then diffed the referenced-file set against the full `find recipes -name "*.md"` list (35 files) with `comm -23` to confirm zero recipes were left uncovered — first pass found 5 recipes not yet pointed to (`product-detail-purchase-stack`, `pull-to-refresh-list-pattern`, `mobile-signup-field-stack`, `doc-search-cmdk-grouped-results-panel`, `large-title-collapsing-header`); added one pointer bullet each to the most relevant existing cluster (cost integrity, accessible-interaction, accessible-interaction, structure-flattening, component-contract respectively) and re-ran the same `comm -23` check — empty diff, confirming all 35/35 recipes now have at least one pointer — done, observed.
- `cd examples/ui-vocabulary-site && npm run build` → exit 0 (prebuild `build:data` regenerated `terms.generated.ts` unrelated to this change; `tsc -b && vite build` succeeded, producing `dist/`) — done, observed. This confirms the changed `llms.txt`/`public/llms/` output does not break the site build.

## Result

All four verification commands were run and produced the exit codes described above, including the recipe-link integrity check that caught and fixed an initial 5-recipe coverage gap before the final pass. Source-recipe coverage: 35/35 recipes contributed at least one Anti-patterns bullet to the guide, distilled into 12 clusters.

Note: `git status` at the time of this work showed unrelated pre-existing uncommitted changes to `DESIGN.md` and `tokens/askewly.tokens.json` (SD gen2 token-gap additions, dated 2026-07-12, apparently left uncommitted from a prior step in this same milestone). This changeset did not create, modify, or revert those files.

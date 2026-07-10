# 20260710 Recipes Integration

## Target

- ROADMAP milestone: SCD2 - 레시피 커버리지 배치, Step 5
- Plan: `docs/plans/2026-07-10-scd2-recipe-coverage.md`

## Scope

- Regenerate `public/llms.txt`, copied raw recipe assets, and CLI bundled recipe data for 13 recipes.
- Run recipe validation, llms failure-mode check, CLI tests, and fresh-target `init → add → verify` smoke for two new recipes.
- Rebuild/lint the public site and verify deployed human/agent assets after push.

## Contract

- Recipe Markdown files remain SSOT; public llms copies and CLI `data/recipes.json` are generated.
- No CLI command behavior, runtime UI, or recipe wording changes in this integration changeset.
- Fresh targets must receive compilable excerpts, required token files, Checks, and Anti-pattern notes without color-literal violations.

## Verification

- [x] `validate-recipes.py` reports `recipes ok: 13`; independent enumeration reports 13 recipes / 10 groups.
- [x] `generate-llms-txt.mjs` copies 19 assets, `llms.txt` contains 13 recipe links, and missing-source probe exits 1.
- [x] CLI `npm run build` bundles `terms=536 recipes=13`; `npm test` passes 21/21.
- [x] Fresh target A: `init` + `add interactive-data-table` + `verify` PASS (4 generated files; temp target removed).
- [x] Fresh target B: `init` + `add checkout-order-summary` + `verify` PASS (4 generated files; temp target removed).
- [x] Site `npm run lint` and `npm run build` PASS (existing Fast Refresh and bundle-size warnings only).
- [x] Cloudflare deployment `15a65241-1d81-4ba4-b8a6-373ac73b2862` succeeded for source `71d88f2`; `ui.askewly.com/llms.txt` has 13 recipe links and both new table/checkout raw assets resolve with matching IDs.

## Result

- All local, CLI-consumption, and production discovery gates pass.

# 20260710 Recipes Data Display

## Target

- ROADMAP milestone: SCD2 - 레시피 커버리지 배치, Step 2
- Plan: `docs/plans/2026-07-10-scd2-recipe-coverage.md`

## Scope

- Add `interactive-data-table` and `stat-summary-grid` under `data-display`.
- Distill the shipped table selection/sort/responsive behavior and dashboard stat hierarchy.

## Contract

- Existing `App.tsx` and `home-page.tsx` implementations remain code SSOT.
- Recipes follow the eight-section format, semantic tokens, approved Principles, and existing terms.
- Out of scope: UI changes, feedback/commerce recipes, llms/CLI regeneration.

## Verification

- [x] Both files have valid frontmatter and eight sections (8/8 each).
- [x] References resolve through `validate-recipes.py`.
- [x] Validator reports `recipes ok: 10`.
- [x] Targeted diff is limited to recipes and changeset records.

## Result

- The `data-display` group now has table and stat-summary recipes; coverage is 8/10 groups and 10 recipes.

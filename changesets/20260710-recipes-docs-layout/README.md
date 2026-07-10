# 20260710 Recipes Docs And Layout

## Target

- ROADMAP milestone: SCD2 - 레시피 커버리지 배치, Step 1
- Plan: `docs/plans/2026-07-10-scd2-recipe-coverage.md`

## Scope

- Add `article-documentation-layout` under `docs`.
- Add `sidebar-application-shell` and `responsive-content-grid` under `layout`.
- Distill only behavior already implemented in `App.tsx`; no UI source changes.

## Contract

- `docs/design-system/recipe-format.md` defines frontmatter and eight required sections.
- `App.tsx` remains code SSOT; recipes contain bounded excerpts and implementation constraints.
- Every recipe must follow approved Principles, semantic/component tokens, existing term IDs, and real code assets.
- Out of scope: other pattern groups, llms/CLI regeneration, deployment.

## Verification

- [x] All three recipe files contain valid frontmatter and eight required sections (8/8 each).
- [x] Every token, term, component, and code asset reference resolves through the validator.
- [x] `python scripts/validate-recipes.py` reports `recipes ok: 8`.
- [x] Targeted diff contains only the three recipes and changeset records (`git status --short`).

## Result

- The `docs` and `layout` pattern groups now have implementation-backed recipes; total coverage is 7/10 groups and 8 recipes.

# Plan - Public Site Shell

## Hierarchy

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-public-site-shell.md`
- ROADMAP: `ROADMAP.md`
- Blueprint: `docs/design-system/site-blueprint.md`

## Scope

This run implements the first public website shell for `ui.askewly.com/`.

It does not finish every child page. It creates the correct homepage and top-level entry paths so existing work can be reorganized under the new site structure.

## Step Tree

- [x] Step 0 - Implement homepage and top-level IA entry points. Verify: `cd examples/ui-vocabulary-site && npm run build`
- [x] Step 1 - Verify app build/lint, update phase and ROADMAP status. Verify: `cd examples/ui-vocabulary-site && npm run lint`

## Decision Log

- Homepage means `https://ui.askewly.com/`, not an internal docs index.
- Existing Tailwind-derived `Plus` and `Docs` work stays accessible; it becomes content under the new site IA.
- The first implementation uses one `home` page mode in the current Vite React app rather than introducing a full router migration.
- No payment, account system, or license enforcement is implemented in this run.

## Risks

- `App.tsx` is large and currently owns many local components. Keep changes surgical: add a separate `HomePage` component and only minimal page-mode/navigation wiring in `App.tsx`.
- Existing query/filter URLs should continue working for `plus`, `docs`, and `term` pages.
- Homepage must not hide all existing work behind dead links; CTAs should route to existing filters where possible.

## Run Impact

- New product phase under `phases/public-site-shell/`.
- New React component `examples/ui-vocabulary-site/src/components/home-page.tsx`.
- Minimal app wiring in `examples/ui-vocabulary-site/src/App.tsx`.
- ROADMAP current horizon changes to Public Site Shell.

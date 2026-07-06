# Step 1: docs-data-model-and-article-renderer-extraction

## Read First

- `phases/tailwind-plus-documentation-depth/step0.md` - why: defines the capture evidence produced before implementation.
- `docs/research/tailwind-plus-documentation-depth-ledger.md` - why: provides the page structures and local route mapping that this step must support.
- `examples/ui-vocabulary-site/src/App.tsx` - why: contains the current Documentation route renderer and shallow page data.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` - why: defines navigation collections and local page ids.
- `examples/ui-vocabulary-site/src/components/topbar-search.tsx` - why: current search behavior must keep expanding to docs routes.

## Work

Restructure the Documentation article implementation so 15 deep pages can be
maintained without bloating the route shell.

Preferred shape:

- Extract docs page data to a dedicated `src/lib/*documentation*` module.
- Extract or isolate the docs article renderer if it becomes reusable.
- Keep the existing side-nav route ids stable.
- Preserve the topbar search entry points for every docs page.

## Acceptance Criteria

```powershell
cd examples\ui-vocabulary-site
npm run build
```

The Documentation shell still renders all 15 nav items, the default
Documentation primary route opens Getting set up, and no raw search fallback
appears for docs routes.

## Verification Procedure

1. Run the build command.
2. Open at least one Getting started route and one Elements route in Chrome.
3. Confirm article content still renders after extraction.
4. Update `phases/tailwind-plus-documentation-depth/index.json` step 1 status.

## Do Not

- Do not rename existing nav ids unless the search/navigation model is updated
  in the same step.
- Do not introduce a new router framework.
- Do not change unrelated UI Blocks visual parity code.

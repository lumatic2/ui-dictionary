# Step 5: cross-page-docs-qa

## Read First

- `docs/research/tailwind-plus-documentation-depth-ledger.md` - why: this is the completeness checklist for the phase.
- `docs/plans/2026-07-03-tailwind-plus-documentation-depth-plan.md` - why: defines phase DoD and stop points.
- `examples/ui-vocabulary-site/src/App.tsx` - why: confirms route dispatch and article rendering after all content batches.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` - why: confirms docs routes and search navigation are aligned.

## Work

Run a final Documentation QA pass across all 15 routes.

Checks:

- Every depth ledger row has Tailwind desktop/mobile evidence and local
  desktop/mobile evidence.
- Every docs route renders a real article, not a search fallback or placeholder.
- Side-nav active state matches the open page.
- Topbar search can open representative docs pages.
- Desktop and 390px mobile layouts have no horizontal overflow or incoherent
  text overlap.
- Console errors are empty during smoke.

## Acceptance Criteria

```powershell
cd examples\ui-vocabulary-site
npm run build
npm run lint
python ..\..\scripts\validate-ui-vocabulary.py
npm run audit:visuals
```

Record only pre-existing lint warnings if they remain unchanged.

## Verification Procedure

1. Run all AC commands.
2. Run Chrome desktop/mobile smoke across all 15 docs nav ids.
3. Update the depth ledger final status.
4. Update `phases/tailwind-plus-documentation-depth/index.json` step 5 status.

## Do Not

- Do not close the phase if any docs route still uses template filler.
- Do not mark stale screenshots as fresh evidence.
- Do not ignore new console errors or overflow just because build passes.

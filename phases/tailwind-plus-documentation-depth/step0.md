# Step 0: reference-capture-matrix-and-content-ledger

## Read First

- `docs/plans/2026-07-03-tailwind-plus-documentation-depth-plan.md` - why: defines the 15-page Documentation scope, capture rules, and stop points.
- `docs/research/tailwind-plus-documentation-capture-ledger.md` - why: contains the earlier shallow capture pass and superseded notes to avoid duplicating wrong evidence.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` - why: confirms the local nav ids that each reference page maps to.
- `examples/ui-vocabulary-site/src/App.tsx` - why: shows the current Documentation shell and shallow article placeholders that later steps will replace.

## Work

Create `docs/research/tailwind-plus-documentation-depth-ledger.md` and populate
all 15 Tailwind Plus Documentation leaves.

For each leaf:

- Open the public Tailwind URL in Chrome.
- Capture desktop and 390px mobile screenshots into
  `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/`.
- Record the page title, side-nav active item, visible heading structure,
  code/example blocks, tables, warnings/callouts, related links, and any
  public/private boundary.
- Record the local nav id and local route query used for future smoke.

## Acceptance Criteria

```powershell
Test-Path docs\research\tailwind-plus-documentation-depth-ledger.md
Get-ChildItem docs\research\assets\tailwind-plus-documentation-depth-2026-07-03 -File | Measure-Object
```

The ledger must list all 15 pages and every row must have Tailwind desktop and
mobile screenshot paths, or an explicit blocker note.

## Verification Procedure

1. Confirm the ledger has exactly 15 leaf rows.
2. Confirm every non-blocked row has two Tailwind screenshot files.
3. Do not edit implementation files in this step.
4. Update `phases/tailwind-plus-documentation-depth/index.json` step 0 status.

## Do Not

- Do not copy Tailwind prose or source code.
- Do not use the older Tailwind CSS `/docs` captures as current evidence.
- Do not mark a page captured without opening the live Tailwind Plus page.

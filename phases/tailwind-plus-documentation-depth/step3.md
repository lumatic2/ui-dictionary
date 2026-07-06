# Step 3: elements-batch-a

## Read First

- `docs/research/tailwind-plus-documentation-depth-ledger.md` - why: identifies the reference structure for the first Elements batch.
- Documentation data/renderer files produced by step 1 - why: this step fills the element records.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` - why: confirms route ids and related term mappings.

## Work

Replace shallow content for:

- Introduction
- Autocomplete
- Command palette
- Copy button
- Dialog

Each element page should include page-specific material:

- What the element solves
- Interaction anatomy
- Keyboard and focus behavior where relevant
- Composition checklist
- Example implementation notes
- Failure modes and anti-patterns
- Related UI Dictionary terms

Use tables for API/state/slot details when they improve scanning.

## Acceptance Criteria

```powershell
cd examples\ui-vocabulary-site
npm run build
python ..\..\scripts\validate-ui-vocabulary.py
```

Chrome smoke must confirm all five batch-A pages render article content on
desktop and 390px mobile with no console errors and no horizontal overflow.

## Verification Procedure

1. Run the AC commands.
2. Capture local desktop and mobile screenshots for the five pages.
3. Update the depth ledger with local screenshot paths and completion notes.
4. Update `phases/tailwind-plus-documentation-depth/index.json` step 3 status.

## Do Not

- Do not collapse distinct components into the same template paragraph.
- Do not claim accessibility behavior that the local article does not describe.
- Do not change unrelated term definitions unless validation requires it.

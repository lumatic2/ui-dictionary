# Step 4: elements-batch-b

## Read First

- `docs/research/tailwind-plus-documentation-depth-ledger.md` - why: identifies the reference structure for the second Elements batch.
- Documentation data/renderer files produced by step 1 - why: this step fills the remaining element records.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` - why: confirms route ids and related term mappings.

## Work

Replace shallow content for:

- Disclosure
- Dropdown menu
- Popover
- Select
- Tabs

Each page should include page-specific material:

- Appropriate use cases
- Anatomy and state model
- Keyboard/focus behavior
- Responsive behavior
- Example implementation notes
- Pitfalls and common confusions with nearby patterns
- Related UI Dictionary terms

Use comparison callouts where terms are commonly confused, such as popover vs
dialog, dropdown menu vs select, and disclosure vs tabs.

## Acceptance Criteria

```powershell
cd examples\ui-vocabulary-site
npm run build
python ..\..\scripts\validate-ui-vocabulary.py
```

Chrome smoke must confirm all five batch-B pages render article content on
desktop and 390px mobile with no console errors and no horizontal overflow.

## Verification Procedure

1. Run the AC commands.
2. Capture local desktop and mobile screenshots for the five pages.
3. Update the depth ledger with local screenshot paths and completion notes.
4. Update `phases/tailwind-plus-documentation-depth/index.json` step 4 status.

## Do Not

- Do not use generic component marketing copy.
- Do not use Tailwind source snippets as the local source of truth.
- Do not let mobile article tables overflow horizontally.

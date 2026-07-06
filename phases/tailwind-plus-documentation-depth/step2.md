# Step 2: getting-started-pages

## Read First

- `docs/research/tailwind-plus-documentation-depth-ledger.md` - why: identifies the reference structure for the five Getting started pages.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` - why: confirms stable route ids for the pages.
- Documentation data/renderer files produced by step 1 - why: this step fills those records with page-specific content.

## Work

Replace shallow Getting started content with original UI Dictionary docs for:

- Getting set up
- Using HTML
- Using React
- Using Vue
- Assets

Each page should include page-specific sections rather than a shared template:

- Overview and intended user
- Setup or usage flow
- Implementation example or configuration snippet where useful
- Common pitfalls
- Accessibility or asset-quality notes where relevant
- Related terms or next-page links

## Acceptance Criteria

```powershell
cd examples\ui-vocabulary-site
npm run build
```

Chrome smoke must confirm all five Getting started pages render article content
on desktop and 390px mobile with no console errors and no horizontal overflow.

## Verification Procedure

1. Run build.
2. Capture local desktop and mobile screenshots for all five pages.
3. Update the depth ledger with local screenshot paths and completion notes.
4. Update `phases/tailwind-plus-documentation-depth/index.json` step 2 status.

## Do Not

- Do not leave any page as generic "overview / implementation / next steps"
  placeholder prose.
- Do not copy Tailwind text verbatim.
- Do not add decorative imagery unless the local docs page genuinely needs it.

# Description Lists hero-level rework

Date: 2026-07-01
Scope: Application UI / Data Display / Description Lists

## Why this was reworked

The previous local Description Lists page exposed the six Tailwind example
names, but every preview reused one generic `description-list-page` renderer.
That showed key-value data, but it missed the reference's layout differences:
wide left-aligned rows, card inset, dark striped rows, two-column layout, inline
actions, and a narrow hidden-label receipt card.

## Reference and local evidence

- Tailwind desktop: `docs/research/assets/data-display-description-lists-hero-level-rework-2026-07-01/tailwind-description-lists-desktop.png`
- Tailwind mobile: `docs/research/assets/data-display-description-lists-hero-level-rework-2026-07-01/tailwind-description-lists-mobile.png`
- Tailwind full desktop: `docs/research/assets/data-display-description-lists-hero-level-rework-2026-07-01/tailwind-description-lists-full-desktop.png`
- Local desktop after: `docs/research/assets/data-display-description-lists-hero-level-rework-2026-07-01/local-description-lists-desktop.png`
- Local mobile after: `docs/research/assets/data-display-description-lists-hero-level-rework-2026-07-01/local-description-lists-mobile.png`
- Local full desktop after: `docs/research/assets/data-display-description-lists-hero-level-rework-2026-07-01/local-description-lists-full-desktop.png`

Before captures are also preserved in the same folder:

- `local-description-lists-before-desktop.png`
- `local-description-lists-before-mobile.png`

## Image policy

This leaf does not require generated bitmap assets. The Tailwind reference is
structured text, borders, links, dark surfaces, and small icons only. No
imagegen asset was created for this pass.

## Variant mapping

| Tailwind example | Local variant |
| --- | --- |
| Left-aligned | `description-list-left` |
| Left-aligned in card | `description-list-card` |
| Left-aligned striped | `description-list-striped` |
| Two-column | `description-list-two-column` |
| Left-aligned with inline actions | `description-list-inline-actions` |
| Narrow with hidden labels | `description-list-narrow-hidden-labels` |

## Reusable parity rule

Description list leaves need layout-level parity, not just visible key-value
pairs:

- Preserve row labels, values, attachment rows, and link/action affordances.
- Distinguish regular, card inset, dark striped, two-column, inline-action, and
  narrow hidden-label variants.
- On mobile, labels stack above values and long attachment filenames truncate
  inside the card while keeping the action link visible.
- Use generated assets only if a future description-list reference includes
  real imagery; this pass had none.

## Verification

- `npm run build`
- `npm run lint` (passes with existing shadcn fast-refresh warnings only)
- `python scripts\validate-ui-vocabulary.py`
- `npm run audit:visuals`
- Chrome smoke: found all 6 example headings and horizontal overflow false.

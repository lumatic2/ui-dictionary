# Card Headings hero-level rework

Date: 2026-07-01
Scope: Application UI / Headings / Card Headings

## Why this was reworked

The previous local Card Headings page matched the six Tailwind example names,
but every preview reused the generic page-heading renderer. That missed the
visual contract of this leaf: compact card headers attached to faint job-list
content, with light and dark card surfaces, actions, avatars, descriptions, and
a dropdown-style author row.

## Reference and local evidence

- Tailwind desktop: `docs/research/assets/headings-card-headings-hero-level-rework-2026-07-01/tailwind-card-headings-desktop.png`
- Tailwind mobile: `docs/research/assets/headings-card-headings-hero-level-rework-2026-07-01/tailwind-card-headings-mobile.png`
- Tailwind full desktop: `docs/research/assets/headings-card-headings-hero-level-rework-2026-07-01/tailwind-card-headings-full-desktop.png`
- Local desktop after: `docs/research/assets/headings-card-headings-hero-level-rework-2026-07-01/local-card-headings-desktop.png`
- Local mobile after: `docs/research/assets/headings-card-headings-hero-level-rework-2026-07-01/local-card-headings-mobile.png`
- Local full desktop after: `docs/research/assets/headings-card-headings-hero-level-rework-2026-07-01/local-card-headings-full-desktop.png`

Before captures are also preserved in the same folder:

- `local-card-headings-before-desktop.png`
- `local-card-headings-before-mobile.png`

## Generated assets

- `examples/ui-vocabulary-site/public/assets/card-headings/tom-cook.png`
  - Source: `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_005b696942416f61016a44c67ff0208191984c7ceb37a73483.png`
  - Usage: `With avatar and actions`
- `examples/ui-vocabulary-site/public/assets/card-headings/chelsea-hagon.png`
  - Source: `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_005b696942416f61016a44c6d2a25881918659fd9a7fe50984.png`
  - Usage: `With avatar, meta, and dropdown`

These are leaf-specific imagegen outputs. Do not reuse them on other preview
leaves unless that leaf is intentionally representing the same person.

## Variant mapping

| Tailwind example | Local variant |
| --- | --- |
| Simple | `card-heading-simple` |
| With action | `card-heading-action` |
| With avatar and actions | `card-heading-avatar-actions` |
| With description and action | `card-heading-description-action` |
| With description | `card-heading-description` |
| With avatar, meta, and dropdown | `card-heading-avatar-meta-dropdown` |

## Reusable parity rule

Card heading leaves should preserve the compact card-header rhythm:

- The preview is a card surface, not a full page heading.
- The header row changes by variant, while the supporting list/table body stays
  faint and subordinate.
- Light and dark variants need separate contrast, border, and background
  treatment.
- Avatar variants should use preview-specific generated portraits.
- Mobile keeps the title, action, metadata, and row badges inside the card
  without horizontal overflow.

## Verification

- `npm run build`
- `npm run lint` (passes with existing shadcn fast-refresh warnings only)
- `python scripts\validate-ui-vocabulary.py`
- `npm run audit:visuals`
- Chrome smoke: found all 6 example headings, confirmed both generated avatar
  images loaded, horizontal overflow false.

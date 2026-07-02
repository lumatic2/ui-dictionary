# Section Headings hero-level rework

Date: 2026-07-01
Scope: Application UI / Headings / Section Headings

## Why this was reworked

The previous local Section Headings page matched the ten Tailwind example names,
but every preview reused the generic page-heading renderer. That made section
headings look like full page headers instead of compact section bars.

Tailwind's reference leaf is built from low-height section header variants:
simple title rows, description rows, dark action rows, single action rows,
input groups, tabs, inline tabs, labels, and badge/dropdown metadata.

## Reference and local evidence

- Tailwind desktop: `docs/research/assets/headings-section-headings-hero-level-rework-2026-07-01/tailwind-section-headings-desktop.png`
- Tailwind mobile: `docs/research/assets/headings-section-headings-hero-level-rework-2026-07-01/tailwind-section-headings-mobile.png`
- Tailwind full desktop: `docs/research/assets/headings-section-headings-hero-level-rework-2026-07-01/tailwind-section-headings-full-desktop.png`
- Local desktop after: `docs/research/assets/headings-section-headings-hero-level-rework-2026-07-01/local-section-headings-desktop.png`
- Local mobile after: `docs/research/assets/headings-section-headings-hero-level-rework-2026-07-01/local-section-headings-mobile.png`
- Local full desktop after: `docs/research/assets/headings-section-headings-hero-level-rework-2026-07-01/local-section-headings-full-desktop.png`

Before captures are also preserved in the same folder:

- `local-section-headings-before-desktop.png`
- `local-section-headings-before-mobile.png`

## Image policy

This leaf does not require generated bitmap assets. The Tailwind reference is
text, buttons, inputs, tabs, badges, and borders only. No imagegen asset was
created for this pass.

## Variant mapping

| Tailwind example | Local variant |
| --- | --- |
| Simple | `section-heading-simple` |
| With description | `section-heading-description` |
| With actions | `section-heading-actions` |
| With action | `section-heading-action` |
| With input group | `section-heading-input-group` |
| With tabs | `section-heading-tabs` |
| With actions and tabs | `section-heading-actions-tabs` |
| With inline tabs | `section-heading-inline-tabs` |
| With label | `section-heading-label` |
| With badge and dropdown | `section-heading-badge-dropdown` |

## Reusable parity rule

Section heading leaves must stay compact:

- Use low-height section bars, not full page-heading cards.
- Preserve the dominant row pattern: title or title+description on the left,
  optional action/input/tabs metadata on the right or below.
- Dark variants need separate background, border, and button contrast.
- Tabs and inline tabs must show a selected underline state.
- Mobile can stack controls, but must not create horizontal overflow or
  incoherent overlaps.

## Verification

- `npm run build`
- `npm run lint` (passes with existing shadcn fast-refresh warnings only)
- `python scripts\validate-ui-vocabulary.py`
- `npm run audit:visuals`
- Chrome smoke: found all 10 example headings and horizontal overflow false.

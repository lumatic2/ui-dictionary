# Stats hero-level rework

Date: 2026-07-01
Scope: Application UI / Data Display / Stats

## Why this was reworked

The previous local Stats page exposed the five Tailwind example names, but every
preview reused one generic `app-stats-page` renderer. That matched the count but
missed the visual differences between financial trend rows, dark operational
metrics, light card metrics, brand-icon cards, and shared-border dark metrics.

## Reference and local evidence

- Tailwind desktop: `docs/research/assets/data-display-stats-hero-level-rework-2026-07-01/tailwind-stats-desktop.png`
- Tailwind mobile: `docs/research/assets/data-display-stats-hero-level-rework-2026-07-01/tailwind-stats-mobile.png`
- Tailwind full desktop: `docs/research/assets/data-display-stats-hero-level-rework-2026-07-01/tailwind-stats-full-desktop.png`
- Local desktop after: `docs/research/assets/data-display-stats-hero-level-rework-2026-07-01/local-stats-desktop.png`
- Local mobile after: `docs/research/assets/data-display-stats-hero-level-rework-2026-07-01/local-stats-mobile.png`
- Local full desktop after: `docs/research/assets/data-display-stats-hero-level-rework-2026-07-01/local-stats-full-desktop.png`

Before captures are also preserved in the same folder:

- `local-stats-before-desktop.png`
- `local-stats-before-mobile.png`

## Image policy

This leaf does not require generated bitmap assets. The Tailwind reference is
metric text, trend indicators, borders, dark surfaces, and icon blocks only. No
imagegen asset was created for this pass.

## Variant mapping

| Tailwind example | Local variant |
| --- | --- |
| With trending | `app-stats-trending` |
| Simple | `app-stats-simple` |
| Simple in cards | `app-stats-cards` |
| With brand icon | `app-stats-brand-icon` |
| With shared borders | `app-stats-shared-borders` |

## Reusable parity rule

Stats leaves need metric-specific layout fidelity:

- Financial trend rows keep label, value, and colored delta in one tile.
- Dark simple stats use shared dark surface and dividers.
- Card variants distinguish plain cards from brand-icon cards with footer links.
- Shared-border variants keep the dark container and inline delta pills.
- Mobile stacks metric tiles vertically without clipping large numbers.

## Verification

- `npm run build`
- `npm run lint` (passes with existing shadcn fast-refresh warnings only)
- `python scripts\validate-ui-vocabulary.py`
- `npm run audit:visuals`
- Chrome smoke: found all 5 example headings and horizontal overflow false.

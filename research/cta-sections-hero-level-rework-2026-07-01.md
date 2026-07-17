# CTA Sections hero-level rework evidence

Date: 2026-07-01

## Scope

CTA Sections was reworked using the Feature Sections hero-level workflow:
capture first, then rebuild preview height, image provenance, and section-level
rhythm. This pass replaces compact generic CTA previews with CTA-specific
section layouts for all 11 visible Tailwind examples.

## Reference

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/cta-sections`
- Local route: `/?filter=nav%3Aplus-marketing-cta-sections`

## Evidence

- Tailwind desktop: `docs/research/assets/cta-sections-hero-level-rework-2026-07-01/tailwind-cta-sections-desktop.png`
- Tailwind mobile: `docs/research/assets/cta-sections-hero-level-rework-2026-07-01/tailwind-cta-sections-mobile.png`
- Local desktop: `docs/research/assets/cta-sections-hero-level-rework-2026-07-01/local-cta-sections-desktop.png`
- Local mobile: `docs/research/assets/cta-sections-hero-level-rework-2026-07-01/local-cta-sections-mobile.png`
- Generated assets:
  - `examples/ui-vocabulary-site/public/assets/cta-sections/dark-app-screenshot.png`
  - `examples/ui-vocabulary-site/public/assets/cta-sections/split-workspace-image.png`
  - `examples/ui-vocabulary-site/public/assets/cta-sections/two-column-photo.png`
  - `examples/ui-vocabulary-site/public/assets/cta-sections/image-tiles-collage.png`

## What changed

- Added a CTA-specific renderer with generous section `min-height` values rather
  than compact card-driven height.
- Rebuilt the dark app screenshot CTA as a large rounded dark panel with the app
  screenshot placed on the right, matching the Tailwind first-preview rhythm.
- Rebuilt simple stacked, centered, dark panel, gradient, brand, justified, and
  subtle-brand variants as full CTA sections with button rhythm and spacious
  vertical padding.
- Rebuilt image-backed variants with unique generated assets instead of reused
  placeholders.

## CTA Sections asset ledger

| Preview | Reference image role | Local asset | Prompt intent |
| --- | --- | --- | --- |
| Dark panel with app screenshot | Product proof inside dark CTA panel | `dark-app-screenshot.png` | Dark SaaS app UI with deployment/activity table, sidebar, search, and purple glow |
| Split with image | Editorial/workspace image beside CTA copy | `split-workspace-image.png` | Warm modern workspace table with laptop, notes, and soft daylight |
| Two columns with photo | Tall editorial photo paired with CTA copy | `two-column-photo.png` | Portrait workspace collaboration scene with sketches and laptop |
| With image tiles | Collage of usage/team moments | `image-tiles-collage.png` | Six rounded warm photo tiles in one cohesive collage |

Non-image CTA examples use layout, color, copy, and button rhythm only:
`Simple stacked`, `Centered on dark panel`, `Simple centered`, `Simple centered
with gradient`, `Simple centered on brand`, `Simple justified`, and `Simple
justified on subtle brand`.

## Repeatable parity rule

For CTA-like leaves, treat each preview as a full conversion section. Do not let
copy height collapse the preview. Record:

- Section minimum height.
- CTA button alignment and spacing.
- Whether the reference is centered, justified, split, dark, brand-colored, or
  image-backed.
- Per-preview image provenance for every meaningful screenshot/photo/collage.
- Desktop and mobile capture paths after implementation.

## Verification

- `npm run build` passed.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run lint` passed with the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed.
- Local desktop and mobile captures were saved after implementation.

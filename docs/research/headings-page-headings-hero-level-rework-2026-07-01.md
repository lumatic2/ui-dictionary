# Page Headings hero-level rework

Date: 2026-07-01
Scope: Application UI / Headings / Page Headings

## Why this was reworked

The previous local page exposed the same nine example names, but most examples
shared one generic `heading-page` preview. That matched inventory, not visual
parity. Tailwind's Page Headings leaf uses different heights and structures per
example: a large empty app canvas, a short dark action bar, breadcrumb rows,
banner imagery, avatar/logo variants, stats, and filter controls.

## Reference and local evidence

- Tailwind desktop: `docs/research/assets/headings-page-headings-hero-level-rework-2026-07-01/tailwind-page-headings-desktop.png`
- Tailwind mobile: `docs/research/assets/headings-page-headings-hero-level-rework-2026-07-01/tailwind-page-headings-mobile.png`
- Local desktop after: `docs/research/assets/headings-page-headings-hero-level-rework-2026-07-01/local-page-headings-desktop.png`
- Local mobile after: `docs/research/assets/headings-page-headings-hero-level-rework-2026-07-01/local-page-headings-mobile.png`

## Generated asset

- Local asset: `examples/ui-vocabulary-site/public/assets/page-headings/banner-office.png`
- Source generation: `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_05cb686fb1a2f0c3016a44c39d81008197b452d49a05c58323.png`
- Usage: only the `With banner image` preview.

For future leaves, do not reuse an existing generated image just because it
fits the aspect ratio. If a Tailwind preview contains a photo, screenshot,
product image, background image, or illustration, generate a new image that
fits that exact preview's subject and composition.

## Variant mapping

| Tailwind example | Local variant |
| --- | --- |
| With meta and actions | `heading-meta-actions` |
| With actions | `heading-actions` |
| With actions and breadcrumbs | `heading-actions-breadcrumbs` |
| With banner image | `heading-banner-image` |
| With avatar and actions | `heading-avatar-actions` |
| Card with avatar and stats | `heading-card-avatar-stats` |
| With meta, actions, and breadcrumbs | `heading-meta-actions-breadcrumbs` |
| With filters and action | `heading-filters-action` |
| With logo, meta and actions | `heading-logo-meta-actions` |

## Reusable parity rule

Page heading leaves must encode the heading-level differences, not just the
example title list. Match the visible reference traits:

- Preview height: large app canvas vs short header vs card surface.
- Content modules: meta row, action buttons, breadcrumbs, avatar, logo, stats,
  filters, and banner image.
- Mobile behavior: controls wrap without horizontal overflow and the heading
  remains readable.
- Image-backed preview: generate a leaf/example-specific asset and record it in
  this document or the leaf ledger note.

## Verification

- `npm run build`
- `npm run lint` (passes with existing shadcn fast-refresh warnings only)
- `python scripts\validate-ui-vocabulary.py`
- `npm run audit:visuals`
- Chrome smoke: found all 9 example headings, confirmed
  `/assets/page-headings/banner-office.png` loaded, horizontal overflow false.

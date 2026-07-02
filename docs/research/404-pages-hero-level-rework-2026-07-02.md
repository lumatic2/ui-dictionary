# 404 Pages hero-level rework

Date: 2026-07-02
Leaf: Marketing / Feedback / 404 Pages
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/feedback/404-pages`
Local route: `/?filter=nav%3Aplus-marketing-404-pages`

## Reference

- Desktop capture: `docs/research/assets/404-pages-hero-level-rework-2026-07-02/tailwind-404-pages-desktop.png`
- Mobile 390px capture: `docs/research/assets/404-pages-hero-level-rework-2026-07-02/tailwind-404-pages-mobile-390.png`
- Reference metadata: `docs/research/assets/404-pages-hero-level-rework-2026-07-02/tailwind-404-pages-reference.json`
- Section crops: `tailwind-404-pages-crop-simple.png`, `tailwind-404-pages-crop-split.png`, `tailwind-404-pages-crop-popular.png`, `tailwind-404-pages-crop-background.png`, `tailwind-404-pages-crop-navbar-footer.png`

Observed visible examples:

- Simple
- Split with image
- With popular pages
- With background image
- With navbar and footer

## Implementation

The old local renderer used a compact generic 404 placeholder. This pass rebuilt `not-found-*` variants as page-scale preview canvases:

- `not-found-simple`: centered 404 content with Tailwind-like white space and primary/support actions.
- `not-found-split`: left content, bottom support/status links, right full-height desert image.
- `not-found-popular`: centered logo/title plus four recovery links with icons.
- `not-found-background-image`: full background landscape image with centered white recovery content.
- `not-found-navbar-footer`: top nav, large recovery body, and footer recovery context.

Image policy applied:

- `Split with image` uses a new preview-specific generated asset: `examples/ui-vocabulary-site/public/assets/404-pages/split-desert-v2.png`.
- `With background image` uses a separate new preview-specific generated asset: `examples/ui-vocabulary-site/public/assets/404-pages/background-mountains-v2.png`.
- The two images are not reused from each other or from any prior leaf.
- `Simple`, `With popular pages`, and `With navbar and footer` are UI/text/icon previews, so no decorative imagegen asset was added.

Provenance: `docs/research/assets/404-pages-hero-level-rework-2026-07-02/404-pages-imagegen-provenance.md`

## Verification

- Local desktop after: `docs/research/assets/404-pages-hero-level-rework-2026-07-02/local-404-pages-after-desktop.png`
- Local mobile after: `docs/research/assets/404-pages-hero-level-rework-2026-07-02/local-404-pages-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/404-pages-hero-level-rework-2026-07-02/local-404-pages-smoke.json`

Smoke result:

- Desktop expected example names: 5/5 present.
- Mobile expected example names: 5/5 present.
- Desktop image count: 2 preview-specific 404 images loaded.
- Mobile image count: 2 preview-specific 404 images loaded.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.

# About Pages hero-level rework

Date: 2026-07-02
Leaf: Marketing / Page Examples / About Pages
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/page-examples/about-pages`
Local route: `/?filter=nav%3Aplus-marketing-about-pages`

## Reference

- Desktop capture: `docs/research/assets/about-pages-hero-level-rework-2026-07-02/tailwind-about-pages-desktop.png`
- Mobile 390px capture: `docs/research/assets/about-pages-hero-level-rework-2026-07-02/tailwind-about-pages-mobile-390.png`
- Reference metadata: `docs/research/assets/about-pages-hero-level-rework-2026-07-02/tailwind-about-pages-reference.json`
- Section crops:
  - `tailwind-about-pages-crop-image-tiles.png`
  - `tailwind-about-pages-crop-timeline-stats.png`
  - `tailwind-about-pages-crop-two-column-description.png`

Observed visible examples:

- With image tiles
- With timeline and stats
- With two column description

## Implementation

The previous renderer used a compact placeholder card. This pass rebuilt `about-*` page examples as long page-scale canvases:

- `about-image-tiles`: light company page with nav, large left hero copy, staggered photo tiles, mission/stat section, wide team banner, and values grid.
- `about-timeline-stats`: light founder/story page with hero portrait, timeline, dark stats panel, and people collage section.
- `about-two-column-description`: dark creator company page with centered intro, two-column body copy, stats, wide office image, values grid, and team portrait row.

Image policy applied:

- `With image tiles`: `examples/ui-vocabulary-site/public/assets/about-pages/image-tiles-office-v2.png` and `examples/ui-vocabulary-site/public/assets/about-pages/image-tiles-banner-v2.png`
- `With timeline and stats`: `examples/ui-vocabulary-site/public/assets/about-pages/timeline-founders-v2.png` and `examples/ui-vocabulary-site/public/assets/about-pages/timeline-lounge-v2.png`
- `With two column description`: `examples/ui-vocabulary-site/public/assets/about-pages/two-column-office-v2.png` and `examples/ui-vocabulary-site/public/assets/about-pages/two-column-portrait-v2.png`

All six assets are fresh About-specific generated images. No image is shared across different About previews or other leaves.

Provenance: `docs/research/assets/about-pages-hero-level-rework-2026-07-02/about-pages-imagegen-provenance.md`

## Verification

- Local desktop after: `docs/research/assets/about-pages-hero-level-rework-2026-07-02/local-about-pages-after-desktop.png`
- Local mobile after: `docs/research/assets/about-pages-hero-level-rework-2026-07-02/local-about-pages-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/about-pages-hero-level-rework-2026-07-02/local-about-pages-smoke.json`

Smoke result:

- Desktop expected example names: 3/3 present.
- Mobile expected example names: 3/3 present.
- Desktop image count: 13 About image sources, 6 unique.
- Mobile image count: 13 About image sources, 6 unique.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.

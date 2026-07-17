# Landing Pages hero-level rework

Date: 2026-07-02
Leaf: Marketing / Page Examples / Landing Pages
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/page-examples/landing-pages`
Local route: `/?filter=nav%3Aplus-marketing-landing-pages`

## Reference

- Desktop capture: `docs/research/assets/landing-pages-hero-level-rework-2026-07-02/tailwind-landing-pages-desktop.png`
- Mobile 390px capture: `docs/research/assets/landing-pages-hero-level-rework-2026-07-02/tailwind-landing-pages-mobile-390.png`
- Reference metadata: `docs/research/assets/landing-pages-hero-level-rework-2026-07-02/tailwind-landing-pages-reference.json`
- Section crops:
  - `tailwind-landing-pages-crop-screenshots-stats-exact.png`
  - `tailwind-landing-pages-crop-large-screenshot-testimonial-exact.png`
  - `tailwind-landing-pages-crop-background-hero-pricing-exact.png`
  - `tailwind-landing-pages-crop-mobile-screenshot-testimonials-exact.png`

Observed visible examples:

- With screenshots and stats
- With large screenshot and testimonial
- With background image hero and pricing section
- With mobile screenshot and testimonials grid

## Implementation

The previous renderer used a compact shared landing card. This pass rebuilt `landing-*` page examples as long page-scale canvases:

- `landing-screenshots-stats`: dark launch hero, dashboard screenshot, logo cloud, feature section.
- `landing-large-screenshot-testimonial`: light hero, large dashboard screenshot, logo/testimonial strip.
- `landing-bg-hero-pricing`: image-backed dark hero, logo strip, dark screenshot, pricing cards.
- `landing-mobile-testimonials`: light app hero, phone screenshot, logo strip, dark testimonial/CTA panel.

Image policy applied:

- `With screenshots and stats`: `examples/ui-vocabulary-site/public/assets/landing-pages/dark-dashboard-v2.png`
- `With large screenshot and testimonial`: `examples/ui-vocabulary-site/public/assets/landing-pages/light-dashboard-v2.png`
- `With background image hero and pricing section`: `examples/ui-vocabulary-site/public/assets/landing-pages/office-hero-v2.png` and `examples/ui-vocabulary-site/public/assets/landing-pages/pricing-dashboard-v2.png`
- `With mobile screenshot and testimonials grid`: `examples/ui-vocabulary-site/public/assets/landing-pages/mobile-dashboard-v2.png` and `examples/ui-vocabulary-site/public/assets/landing-pages/testimonial-dashboard-v2.png`

All six assets are fresh Landing-specific generated images. No image is shared across different Landing previews.

Provenance: `docs/research/assets/landing-pages-hero-level-rework-2026-07-02/landing-pages-imagegen-provenance.md`

## Verification

- Local desktop after: `docs/research/assets/landing-pages-hero-level-rework-2026-07-02/local-landing-pages-after-desktop.png`
- Local mobile after: `docs/research/assets/landing-pages-hero-level-rework-2026-07-02/local-landing-pages-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/landing-pages-hero-level-rework-2026-07-02/local-landing-pages-smoke.json`

Smoke result:

- Desktop expected example names: 4/4 present.
- Mobile expected example names: 4/4 present.
- Desktop image count: 6 landing image sources, 6 unique.
- Mobile image count: 6 landing image sources, 6 unique.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.

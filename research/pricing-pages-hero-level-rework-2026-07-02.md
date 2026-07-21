# Pricing Pages hero-level rework

Date: 2026-07-02
Leaf: Marketing / Page Examples / Pricing Pages
Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/page-examples/pricing-pages`
Local route: `/?filter=nav%3Aplus-marketing-pricing-pages`

## Reference

- Desktop capture: `docs/research/assets/pricing-pages-hero-level-rework-2026-07-02/tailwind-pricing-pages-desktop.png`
- Mobile 390px capture: `docs/research/assets/pricing-pages-hero-level-rework-2026-07-02/tailwind-pricing-pages-mobile-390.png`
- Reference metadata: `docs/research/assets/pricing-pages-hero-level-rework-2026-07-02/tailwind-pricing-pages-reference.json`
- Section crops:
  - `tailwind-pricing-pages-crop-four-tiers.png`
  - `tailwind-pricing-pages-crop-comparison-table.png`
  - `tailwind-pricing-pages-crop-three-tiers-testimonials.png`

Observed visible examples:

- With four tiers
- With comparison table
- With three tiers and testimonials

## Implementation

The old local `pricing-*-page` renderer was unreachable because the generic `pricing-*` section renderer caught page variants first. This pass fixed the branch order by excluding `-page` variants from the generic pricing renderer, then rebuilt the page-example renderer as three page-scale pricing compositions:

- `pricing-four-tiers-page`: light nav, centered pricing hero, four pricing cards, logo strip, testimonial panel, FAQ.
- `pricing-comparison-table-page`: dark pricing hero, three pricing cards, feature comparison table, FAQ.
- `pricing-three-tiers-testimonials-page`: dark three-tier pricing, testimonial pair, FAQ, footer/newsletter.

Image policy applied:

- No imagegen asset was generated for this leaf.
- Tailwind reference previews use pricing cards, comparison tables, text testimonials, FAQ, and footer UI. They do not visibly depend on photos, product screenshots, or background images.

## Verification

- Local desktop after: `docs/research/assets/pricing-pages-hero-level-rework-2026-07-02/local-pricing-pages-after-desktop.png`
- Local mobile after: `docs/research/assets/pricing-pages-hero-level-rework-2026-07-02/local-pricing-pages-after-mobile-390.png`
- Smoke JSON: `docs/research/assets/pricing-pages-hero-level-rework-2026-07-02/local-pricing-pages-smoke.json`

Smoke result:

- Desktop expected example names: 3/3 present.
- Mobile expected example names: 3/3 present.
- Preview image assets: 0. Smoke sees only the site favicon.
- Desktop horizontal overflow: false.
- Mobile 390px horizontal overflow: false.

# Ecommerce Incentives Hero-Level Rework - 2026-07-02

## Scope

Leaf: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/incentives`

Local route: `/?filter=nav%3Aplus-ecommerce-incentives`

Goal: replace the previous shared `commerce-promo-page` reuse with eight Incentives-specific variants, using current Tailwind desktop/mobile reference captures, local desktop/mobile captures, and one fresh split-header image generated for this leaf.

## Tailwind Reference

- Full desktop: `docs/research/assets/ecommerce-incentives-hero-level-rework-2026-07-02/tailwind-incentives-full-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-incentives-hero-level-rework-2026-07-02/tailwind-incentives-mobile-390.png`

Observed examples:

1. 3-column with illustrations and split header
2. 4-column with illustrations
3. 3-column with illustrations and header
4. 3-column with illustrations and centered text
5. 3-column with illustrations and heading
6. 2x2 grid with illustrations
7. 3-column with icons and supporting text
8. 3-column with icons

## Local Implementation

Added eight dedicated preview variants:

1. `commerce-incentives-split-header`
2. `commerce-incentives-four-column`
3. `commerce-incentives-header`
4. `commerce-incentives-centered`
5. `commerce-incentives-heading-band`
6. `commerce-incentives-two-by-two`
7. `commerce-incentives-icons-supporting`
8. `commerce-incentives-icons`

Local captures:

- Desktop: `docs/research/assets/ecommerce-incentives-hero-level-rework-2026-07-02/local-incentives-desktop.png`
- Mobile 390px: `docs/research/assets/ecommerce-incentives-hero-level-rework-2026-07-02/local-incentives-mobile-390.png`

## Asset Note

Only the split-header reference uses a photo-like image region, so this pass generated one fresh leaf-specific imagegen asset for that preview:

- `examples/ui-vocabulary-site/public/assets/ecommerce-incentives/support-desk.png`

The remaining examples are illustration/icon driven in the Tailwind reference, so they use code-native Lucide icons plus small HTML/SVG-style decorative shapes rather than bitmap placeholders.

## Verification

- `npm run build`: passed, Vite large chunk warning only.
- `python scripts\validate-ui-vocabulary.py`: passed, 527 terms.
- `npm run audit:visuals`: passed, 527 terms/variants, fallback variants 6, generic renderer variants 0, shared variants 0.
- `npm run lint`: passed with existing shadcn Fast Refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- Mobile CDP smoke at 390px: all eight expected titles present, incentive asset images 1, unique incentive assets 1, incomplete incentive assets 0, `scrollWidth=390`, `bodyScrollWidth=390`, offenders `[]`.

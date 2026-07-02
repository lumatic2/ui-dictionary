# Pricing Sections hero-level rework evidence

Date: 2026-07-01

## Scope

Pricing Sections was reworked as the next repeatable sample after Feature
Sections and CTA Sections. This pass replaces the compact shared pricing
placeholder with a pricing-specific renderer for all 12 visible Tailwind
examples.

## Reference

- Tailwind URL: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/pricing`
- Local route: `/?filter=nav%3Aplus-marketing-pricing-sections`

## Evidence

- Tailwind desktop: `docs/research/assets/pricing-sections-hero-level-rework-2026-07-01/tailwind-pricing-sections-desktop.png`
- Tailwind mobile: `docs/research/assets/pricing-sections-hero-level-rework-2026-07-01/tailwind-pricing-sections-mobile.png`
- Local desktop: `docs/research/assets/pricing-sections-hero-level-rework-2026-07-01/local-pricing-sections-desktop.png`
- Local mobile: `docs/research/assets/pricing-sections-hero-level-rework-2026-07-01/local-pricing-sections-mobile.png`

## What changed

- Replaced the flat `pricing-*` placeholder renderer with a pricing-specific
  full-section renderer.
- Restored Tailwind-like preview depth with section `min-height` values around
  the plan-card content, instead of allowing text placeholders to collapse the
  preview.
- Added real plan card structure: plan name, price, cadence, description,
  action, and checked feature lists.
- Added variant-specific states for emphasized left/right tiers, dark
  enterprise tier, single-price, four-tier, dividers, toggle controls, logo
  strip, extra enterprise tier, and comparison tables.
- Kept this leaf layout-only because the reference pricing sections do not use
  preview photos or screenshots. Future image-backed previews still require a
  fresh per-preview generated asset.

## Pricing Sections variant ledger

| Preview | Local structure |
| --- | --- |
| Two tiers with emphasized right tier | Two large plan cards, right card dark/emphasized |
| Two tiers with emphasized left tier | Two large plan cards, left card tinted/emphasized |
| Three tiers with logos and feature comparison | Logo strip, three plan cards, comparison table |
| Two tiers with extra tier | Two cards plus enterprise sales panel |
| Single price with details | One centered detailed plan card |
| Three tiers | Three standard cards |
| Three tiers with dividers | Three cards in one divided panel |
| Three tiers with emphasized tier | Three cards with middle recommended card |
| Three tiers with toggle | Billing toggle above three cards |
| Four tiers with toggle | Billing toggle above four compact cards |
| With comparison table | Three plan cards plus comparison table |
| Three tiers with feature comparison | Three plan cards plus comparison table |

## Repeatable parity rule

For pricing-like leaves, capture the reference first and record:

- Number of pricing tiers per preview.
- Which tier is emphasized and whether it is dark, tinted, or only bordered.
- Whether the preview includes a billing toggle, logo row, extra sales tier, or
  comparison table.
- Section and card height, especially for first-screen desktop and 390px mobile.
- Whether any image/screenshot/photo appears. If yes, generate a unique
  per-preview asset; do not reuse images across previews.

## Verification

- `npm run build` passed.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run lint` passed with the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed.
- Chrome route smoke passed: 12 pricing example headings, horizontal overflow
  false.
- Local desktop and mobile captures were saved after implementation.

# FAQs hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/faq-sections`
- Local route: `/?filter=nav%3Aplus-marketing-faqs`
- Target depth: `hero-level-rework`
- Visible examples: 7

## Reference capture

- Desktop: `docs/research/assets/faqs-hero-level-rework-2026-07-02/tailwind-faqs-desktop.png`
- Desktop tall: `docs/research/assets/faqs-hero-level-rework-2026-07-02/tailwind-faqs-desktop-tall.png`
- Mobile 390px: `docs/research/assets/faqs-hero-level-rework-2026-07-02/tailwind-faqs-mobile-390.png`

Tailwind visible examples confirmed through Chrome:

1. Offset with supporting text
2. Centered accordion
3. Side-by-side
4. Three columns
5. Three columns with centered introduction
6. Two columns
7. Two columns with centered introduction

## Implementation changes

- Replaced the previous shallow FAQ skeleton renderer in `examples/ui-vocabulary-site/src/App.tsx` with dedicated branches for all 7 FAQ examples.
- Matched Tailwind's FAQ-specific treatments:
  - offset supporting text plus answer list.
  - dark centered accordion with one expanded row.
  - side-by-side question/answer rows.
  - three-column dense grid.
  - dark centered-intro three-column grid.
  - two-column grid.
  - centered-intro two-column grid.

## Image policy

No imagegen assets were generated. The Tailwind reference is text, accordion, and column-layout based, not image-backed.

## Local captures

- Before desktop: `docs/research/assets/faqs-hero-level-rework-2026-07-02/local-faqs-before-desktop.png`
- Before mobile 390px: `docs/research/assets/faqs-hero-level-rework-2026-07-02/local-faqs-before-mobile-390.png`
- After desktop: `docs/research/assets/faqs-hero-level-rework-2026-07-02/local-faqs-after-desktop.png`
- After mobile 390px: `docs/research/assets/faqs-hero-level-rework-2026-07-02/local-faqs-after-mobile-390.png`

## Verification

- `npm run build` passed from `examples/ui-vocabulary-site`.
- `npm run audit:visuals` passed.
- `npm run lint` passed with only the pre-existing shadcn fast-refresh warnings.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome DOM smoke confirmed all 7 FAQ headings, zero FAQ image assets, 2 dark panels, and desktop horizontal overflow false.
- Mobile was verified by fresh 390px Chrome CLI capture.

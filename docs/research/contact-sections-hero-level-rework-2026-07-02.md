# Contact Sections hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/contact-sections`
- Local route: `/?filter=nav%3Aplus-marketing-contact-sections`
- Target depth: `hero-level-rework`
- Visible examples: 7

## Reference capture

- Desktop: `docs/research/assets/contact-sections-hero-level-rework-2026-07-02/tailwind-contact-sections-desktop.png`
- Desktop tall: `docs/research/assets/contact-sections-hero-level-rework-2026-07-02/tailwind-contact-sections-desktop-tall.png`
- Mobile 390px: `docs/research/assets/contact-sections-hero-level-rework-2026-07-02/tailwind-contact-sections-mobile-390.png`

Tailwind visible examples confirmed through Chrome:

1. Centered
2. Side-by-side grid
3. Split with pattern
4. Simple four-column
5. Simple centered
6. With testimonial
7. Split with image

## Implementation changes

- Replaced the previous shared Contact renderer in `examples/ui-vocabulary-site/src/App.tsx` with dedicated branches for all 7 Contact examples.
- Matched Tailwind's contact-specific surfaces:
  - centered sales form on a subtle pink/white background.
  - side-by-side contact cards plus locations grid.
  - dark split layout with patterned left panel and dark form.
  - simple four-column office list.
  - centered support contact list.
  - dark project contact form with testimonial.
  - split form with a large office image.
- Added one fresh Contact-specific generated image for `Split with image`.
- Did not generate images for the other six previews because the Tailwind reference uses form/card/pattern surfaces only.

## Local captures

- Before desktop: `docs/research/assets/contact-sections-hero-level-rework-2026-07-02/local-contact-sections-before-desktop.png`
- Before mobile 390px: `docs/research/assets/contact-sections-hero-level-rework-2026-07-02/local-contact-sections-before-mobile-390.png`
- After desktop: `docs/research/assets/contact-sections-hero-level-rework-2026-07-02/local-contact-sections-after-desktop.png`
- After mobile 390px: `docs/research/assets/contact-sections-hero-level-rework-2026-07-02/local-contact-sections-after-mobile-390.png`

## Verification

- `npm run build` passed from `examples/ui-vocabulary-site`.
- `npm run audit:visuals` passed.
- `npm run lint` passed with only the pre-existing shadcn fast-refresh warnings.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome DOM smoke confirmed all 7 Contact headings, 1 unique `/assets/contact-sections/` image source, and desktop horizontal overflow false.
- Mobile was verified by fresh 390px Chrome CLI capture.

## Repeatability note

Image-backed previews get fresh leaf-specific assets. Form, card, testimonial, or pattern-only previews should be implemented directly in HTML/CSS and documented as no-image-needed.

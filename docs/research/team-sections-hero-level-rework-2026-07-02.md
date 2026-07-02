# Team Sections hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/team-sections`
- Local route: `/?filter=nav%3Aplus-marketing-team-sections`
- Target depth: `hero-level-rework`
- Visible examples: 9

## Reference capture

- Desktop: `docs/research/assets/team-sections-hero-level-rework-2026-07-02/tailwind-team-sections-desktop.png`
- Desktop tall: `docs/research/assets/team-sections-hero-level-rework-2026-07-02/tailwind-team-sections-desktop-tall.png`
- Mobile 390px: `docs/research/assets/team-sections-hero-level-rework-2026-07-02/tailwind-team-sections-mobile-390.png`

Tailwind visible examples confirmed through Chrome:

1. With small images
2. With large images
3. Grid with round images
4. Large grid with cards
5. With image and short paragraph
6. With vertical images
7. Full width with vertical images
8. Grid with large round images
9. With medium images

## Implementation changes

- Replaced the previous repeated gradient placeholder Team renderer in `examples/ui-vocabulary-site/src/App.tsx` with dedicated branches for all 9 Team examples.
- Added a fresh Team-specific 12-person portrait asset set.
- Matched Tailwind's team-specific visual patterns:
  - small avatar rows beside intro copy.
  - dark large-image grid.
  - dense round avatar grid.
  - dark card grid with circular portraits.
  - image-and-paragraph grid.
  - vertical image list.
  - full-width vertical image grid.
  - large round leadership grid.
  - dark medium image grid.
- Images are reused only within this Team leaf as a coherent team roster; no previous leaf assets were reused.

## Local captures

- Before desktop: `docs/research/assets/team-sections-hero-level-rework-2026-07-02/local-team-sections-before-desktop.png`
- Before mobile 390px: `docs/research/assets/team-sections-hero-level-rework-2026-07-02/local-team-sections-before-mobile-390.png`
- After desktop: `docs/research/assets/team-sections-hero-level-rework-2026-07-02/local-team-sections-after-desktop.png`
- After mobile 390px: `docs/research/assets/team-sections-hero-level-rework-2026-07-02/local-team-sections-after-mobile-390.png`

## Verification

- `npm run build` passed from `examples/ui-vocabulary-site`.
- `npm run audit:visuals` passed.
- `npm run lint` passed with only the pre-existing shadcn fast-refresh warnings.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome DOM smoke confirmed all 9 Team headings, 12 unique `/assets/team-sections/` image sources, and desktop horizontal overflow false.
- Mobile was verified by fresh 390px Chrome CLI capture.

## Repeatability note

Team/image-heavy leaves should use a leaf-specific roster of generated images. Reuse is allowed inside the same leaf when the reference represents the same people across different team layouts, but not across leaves.

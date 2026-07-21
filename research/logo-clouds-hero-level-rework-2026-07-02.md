# Logo Clouds hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/logo-clouds`
- Local route: `/?filter=nav%3Aplus-marketing-logo-clouds`
- Target depth: `hero-level-rework`
- Visible examples: 6

## Reference capture

- Desktop: `docs/research/assets/logo-clouds-hero-level-rework-2026-07-02/tailwind-logo-clouds-desktop.png`
- Desktop tall: `docs/research/assets/logo-clouds-hero-level-rework-2026-07-02/tailwind-logo-clouds-desktop-tall.png`
- Mobile 390px: `docs/research/assets/logo-clouds-hero-level-rework-2026-07-02/tailwind-logo-clouds-mobile-390.png`

Tailwind visible examples confirmed through Chrome:

1. Simple with heading
2. Simple with call-to-action
3. Simple left-aligned
4. Split with logos on right
5. Simple
6. Grid

## Implementation changes

- Replaced the previous generic bordered logo chips in `examples/ui-vocabulary-site/src/App.tsx` with dedicated branches for all 6 Logo Cloud examples.
- Implemented compact wordmark-style logo treatments directly in CSS/HTML, matching the reference's simple icon plus wordmark rhythm.
- Matched the Tailwind visual patterns:
  - centered heading plus logo row.
  - logo row plus rounded customer-story CTA pill.
  - dark left-aligned logo cloud.
  - split copy with logos on the right.
  - simple logo-only row.
  - dark bordered logo grid.
- Fixed mobile dark-grid layout by using a 1-column layout at 390px and expanding at larger breakpoints.

## Image policy

No imagegen assets were generated. The Tailwind reference is wordmark/icon-based, not image-backed. Implementing logos as native CSS/HTML is the correct repeatable path for this leaf.

## Local captures

- Before desktop: `docs/research/assets/logo-clouds-hero-level-rework-2026-07-02/local-logo-clouds-before-desktop.png`
- Before mobile 390px: `docs/research/assets/logo-clouds-hero-level-rework-2026-07-02/local-logo-clouds-before-mobile-390.png`
- After desktop: `docs/research/assets/logo-clouds-hero-level-rework-2026-07-02/local-logo-clouds-after-desktop.png`
- After mobile 390px: `docs/research/assets/logo-clouds-hero-level-rework-2026-07-02/local-logo-clouds-after-mobile-390.png`

## Verification

- `npm run build` passed from `examples/ui-vocabulary-site`.
- `npm run audit:visuals` passed.
- `npm run lint` passed with only the pre-existing shadcn fast-refresh warnings.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome DOM smoke confirmed all 6 Logo Cloud headings, zero logo-cloud image assets, logo wordmarks present, and desktop horizontal overflow false.
- Mobile was verified by fresh 390px Chrome CLI capture after fixing the dark-grid layout.

# Footers hero-level rework

Date: 2026-07-02

## Scope

- Tailwind reference: `https://tailwindcss.com/plus/ui-blocks/marketing/sections/footers`
- Local route: `/?filter=nav%3Aplus-marketing-footers`
- Target depth: `hero-level-rework`
- Visible examples: 7

## Reference capture

- Desktop: `docs/research/assets/footers-hero-level-rework-2026-07-02/tailwind-footers-desktop.png`
- Desktop tall: `docs/research/assets/footers-hero-level-rework-2026-07-02/tailwind-footers-desktop-tall.png`
- Mobile 390px: `docs/research/assets/footers-hero-level-rework-2026-07-02/tailwind-footers-mobile-390.png`

Tailwind visible examples confirmed through Chrome:

1. 4-column with company mission
2. 4-column with call-to-action
3. 4-column simple
4. 4-column with newsletter
5. 4-column with newsletter below
6. Simple centered
7. Simple with social links

## Implementation changes

- Replaced the previous shallow footer placeholder renderer in `examples/ui-vocabulary-site/src/App.tsx` with dedicated branches for all 7 Footer examples.
- Matched Tailwind's footer-specific treatments:
  - dark company mission footer with link columns and social icons.
  - light CTA footer with centered conversion band and lower link columns.
  - dark four-column simple footer.
  - light four-column footer with newsletter form on the right.
  - dark footer with newsletter below the link columns.
  - simple centered footer.
  - compact dark social-link footer.
- Adjusted newsletter forms to stack at 390px so button/input rows do not overflow.

## Image policy

No imagegen assets were generated. The Tailwind reference is link, CTA, newsletter, and social-icon based, not image-backed.

## Local captures

- Before desktop: `docs/research/assets/footers-hero-level-rework-2026-07-02/local-footers-before-desktop.png`
- Before mobile 390px: `docs/research/assets/footers-hero-level-rework-2026-07-02/local-footers-before-mobile-390.png`
- After desktop: `docs/research/assets/footers-hero-level-rework-2026-07-02/local-footers-after-desktop.png`
- After mobile 390px: `docs/research/assets/footers-hero-level-rework-2026-07-02/local-footers-after-mobile-390.png`

## Verification

- `npm run build` passed from `examples/ui-vocabulary-site`.
- `npm run audit:visuals` passed.
- `npm run lint` passed with only the pre-existing shadcn fast-refresh warnings.
- `python scripts\validate-ui-vocabulary.py` passed.
- Chrome DOM smoke confirmed all 7 Footer headings, zero Footer image assets, newsletter/CTA buttons present, social icons present, and desktop horizontal overflow false.
- Mobile was verified by fresh 390px Chrome CLI capture after stacking newsletter forms.

# Step 158 - Pricing Pages page parity pass

Status: completed
Started: 2026-07-04T21:19:00+09:00
Completed: 2026-07-04T21:38:00+09:00

Scope:

- Local `plus-marketing-pricing-pages` leaf and its 3 Pricing Page preview variants.
- Tailwind Plus Marketing / Page Examples / Pricing Pages reference page.
- Captures and smoke artifacts are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/`.

Implementation:

- Captured the canonical Tailwind Plus `/marketing/page-examples/pricing-pages` reference page and confirmed the 3 example names.
- Added explicit `data-pricing-page-theme` and `data-pricing-page-variant` markers to every Pricing Page preview root.
- Made all Pricing Page variants respond to the preview Light/Dark theme controls instead of staying fixed to their default shell.
- Added stable accessible labels, `aria-pressed` selected state, focus rings, hover/press motion, and animated visible feedback to pricing nav, login, billing cycle, plan selection, proof logos, case study, comparison table cells, FAQ toggles, and newsletter subscription.
- Strengthened pricing FAQ controls with `aria-expanded` and `aria-controls`.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - page title `Pricing Pages`.
  - all 3 example headings.
  - 3 Pricing Page roots and 91 pricing action buttons.
  - annual billing, plan, proof logo, case study, comparison column, comparison row, and newsletter feedback.
  - selected action `aria-pressed` state after interaction.
  - all 3 Dark controls set all 3 Pricing roots to `data-pricing-page-theme="dark"`.
  - all 3 Light controls set all 3 Pricing roots to `data-pricing-page-theme="light"`.
  - zero horizontal overflow and no console errors.
- Mobile 390px smoke verified:
  - 3 roots and 91 pricing action buttons.
  - representative annual billing, plan, proof logo, case study, comparison, and newsletter feedback.
  - all 3 Dark controls set all 3 Pricing roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed before recording.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/tailwind-pricing-pages-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/local-pricing-pages-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/local-pricing-pages-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/local-pricing-pages-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/tailwind-capture-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/local-capture-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/pricing-pages/mobile-smoke-after.json`

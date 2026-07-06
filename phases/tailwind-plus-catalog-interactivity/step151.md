# Step 151 - FAQs page parity pass

Status: completed
Started: 2026-07-04T19:09:00+09:00
Completed: 2026-07-04T19:25:00+09:00

Scope:

- Local `plus-marketing-faqs` leaf and its 7 FAQ preview variants.
- Tailwind Plus Marketing / Page Sections / FAQs reference page.
- Captures and smoke artifacts are stored in `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/`.

Implementation:

- Confirmed Tailwind's canonical FAQ URL is `/marketing/sections/faq-sections`; `/marketing/sections/faqs` returns a 404.
- Kept the local FAQs page aligned to the 7 Tailwind example names.
- Added explicit `data-faq-section-theme` and `data-faq-section-variant` markers to every FAQ preview root.
- Made all FAQ variants respond to the preview Light/Dark theme controls, including the previously fixed-dark centered variants.
- Converted static FAQ question blocks into real buttons where appropriate, with stable accessible labels, `aria-pressed` selected state, hover/press motion, focus rings, and animated visible feedback.
- Strengthened accordion questions with `aria-expanded`, `aria-controls`, rotating icons, and animated answer reveal.

Verification:

- `npm run build` passed with only the existing Vite chunk-size warning.
- Chrome extension desktop smoke verified:
  - page title `FAQs`.
  - all 7 example headings.
  - 7 FAQ roots and 41 FAQ action buttons.
  - toggle/open feedback for accordion and grid-style FAQ variants.
  - accordion questions exposing `aria-expanded="true"` after interaction.
  - all 7 Dark controls set all 7 FAQ roots to `data-faq-section-theme="dark"`.
  - all 7 Light controls set all 7 FAQ roots to `data-faq-section-theme="light"`.
  - zero horizontal overflow.
- Mobile 390px smoke verified:
  - 7 FAQ roots and 41 FAQ action buttons.
  - representative toggle/open feedback.
  - all 7 Dark controls set all 7 FAQ roots to dark.
  - no console/page errors and no positive horizontal overflow.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts/validate-ui-vocabulary.py` passed.
- `python -m json.tool phases/tailwind-plus-catalog-interactivity/index.json` passed.

Evidence:

- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/tailwind-faqs-reference-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/local-faqs-desktop-before-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/local-faqs-desktop-after-viewport.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/local-faqs-mobile-after.png`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/capture-notes-before.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/chrome-smoke-after.json`
- `docs/research/assets/tailwind-plus-page-parity-2026-07-03/faqs/mobile-smoke-after.json`

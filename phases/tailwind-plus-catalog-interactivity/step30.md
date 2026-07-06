# Step 30 - Ecommerce checkout footer and promo action sweep

Date: 2026-07-03

## Scope

- Ecommerce Checkout Page footer category links that still rendered as static text.
- Ecommerce Promo Section offer rows where `Apply` looked clickable but was a static span.

## Implementation

- Converted Checkout Page footer category links (`Bags`, `Tees`, `Objects`, `Accessories`) into buttons with hover/press motion and visible feedback.
- Converted Promo Section offer `Apply` labels into buttons with hover/press motion and visible feedback.
- Kept explanatory labels and status text unchanged.

## Verification

- Targeted static scan confirmed the old checkout footer `<p>` links and static promo `Apply` span are gone.
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified:
  - Checkout Pages footer `Bags` feedback.
  - Promo Sections offer `Apply` feedback.
  - No horizontal overflow or severe console warnings.

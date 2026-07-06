# Step 14: pseudo-button-span-cta-feedback-sweep

## 읽어야 할 파일
- examples/ui-vocabulary-site/src/App.tsx - 왜: Remaining standalone span/div CTAs in Marketing and Ecommerce previews are rendered here.

## 작업
- Convert standalone CTA-looking `span`/`div` controls to real buttons with visible feedback.
- Cover Marketing pricing, CTA, promo/fallback previews, and Ecommerce newsletter/footer CTAs where they appear as clickable controls.
- Ignore decorative labels inside an already-clickable parent button.

## Acceptance Criteria
```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
cd ../..
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site
npm run audit:visuals
```

## 검증 절차
1. Run AC commands.
2. Scan for standalone CTA-looking spans/divs.
3. Chrome-smoke representative Marketing CTA/pricing, Ecommerce promo/cart, and fallback preview routes.
4. Update phase index and ledger.

## 결과
- Marketing pricing `Contact sales` is now a real button with inline feedback.
- Marketing CTA section `Get started` and `Learn more` controls are now real buttons with feedback.
- Ecommerce promo `Shop collection` controls are now real buttons with feedback.
- Ecommerce cart/checkout newsletter footer email and signup controls now expose visible focus/signup feedback.
- Fallback preview `Browse Plus` and `Read Docs` controls are now real buttons.
- Decorative labels inside an already-clickable card and status badges were left as non-buttons.

## 검증 결과
- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `python scripts/validate-ui-vocabulary.py` passed: 527 terms.
- `npm run audit:visuals` passed: 527 variants, existing six fallback variants unchanged.
- Chrome click smoke passed for `plus-marketing-cta-sections`, `plus-marketing-pricing-sections`, `plus-ecommerce-promo-sections`, and `plus-ecommerce-page-examples-shopping-cart-pages`.
- Mobile 390px overflow checks returned 0.
- Chrome console error check returned no errors.

## Evidence
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step14/desktop_marketing_cta_started.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step14/desktop_pricing_contact_sales.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step14/desktop_ecommerce_promo_collection.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step14/mobile_cart_newsletter_signup.png`

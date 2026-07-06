# Step 16: application-ecommerce-leaf-code-flow-reference-pass

## 읽어야 할 파일
- examples/ui-vocabulary-site/src/App.tsx - 왜: Catalog leaf renderer, code tab flow, and locked-code modal are implemented here.
- examples/ui-vocabulary-site/src/lib/navigation-model.ts - 왜: Representative Application and Ecommerce leaf nav ids are defined here.
- docs/research/tailwind-plus-catalog-interactivity-ledger.md - 왜: Reference observations and verification evidence are recorded here.

## 작업
- Compare live Tailwind Plus Application UI and Ecommerce leaf pages against our shared catalog leaf renderer.
- Generalize the renderer so every leaf exposes first-example `Preview / Code / HTML / React / Vue` behavior instead of only Marketing `hero-centered`.
- Replace Marketing-specific fallback/copy with category-neutral leaf copy.
- Smoke-test representative Application and Ecommerce leaves through actual clicks.

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
2. Chrome-smoke `plus-forms-form-layouts` and `plus-ecommerce-product-overviews`.
3. Verify first example has a working Code tab and language selector.
4. Verify second example opens locked-code modal with the selected example metadata.
5. Verify mobile 390px horizontal overflow is 0.
6. Update phase index and ledger.

## 결과
- Observed Tailwind Plus `Form Layouts` and `Product Overviews` live leaves.
- Confirmed both reference leaves expose Code controls only for the first example and locked `Get the code` CTAs for later examples.
- Local shared leaf renderer now treats `exampleIndex === 0` as public-code capable.
- Header fallback and info notice copy are no longer Marketing-specific.
- Locked-code modal now says the first public example in each leaf is available in Code view.

## 검증 결과
- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `python scripts/validate-ui-vocabulary.py` passed: 527 terms.
- `npm run audit:visuals` passed: 527 variants, existing six fallback variants unchanged.
- Chrome DOM smoke for `plus-forms-form-layouts` passed:
  - `Form Layouts` visible.
  - one `Code` button visible.
  - three `Get the code` buttons visible.
  - `Example 01` through `Example 04` badges visible.
  - Code tab opened and showed `export function Stacked()`.
  - language selector switched to `html`.
  - locked modal opened for `Two-column` with generic first-example copy and tags.
  - mobile 390px overflow returned 0.
- Chrome DOM smoke for `plus-ecommerce-product-overviews` passed:
  - `Product Overviews` visible.
  - one `Code` button visible.
  - four `Get the code` buttons visible.
  - `Example 01` through `Example 05` badges visible.
  - Code tab opened and showed `export function WithImageGrid()`.
  - language selector switched to `html`.
  - locked modal opened for `With tiered images` with generic first-example copy and tags.
  - mobile 390px overflow returned 0.
- Chrome console log contained only React DevTools info messages.
- Chrome screenshot saving timed out for live Tailwind reference, so reference comparison is recorded as DOM observation evidence.

## Evidence
- Live reference URL: `https://tailwindcss.com/plus/ui-blocks/application-ui/forms/form-layouts`
- Live reference URL: `https://tailwindcss.com/plus/ui-blocks/ecommerce/components/product-overviews`
- Local smoke route: `http://127.0.0.1:5181/?filter=nav%3Aplus-forms-form-layouts`
- Local smoke route: `http://127.0.0.1:5181/?filter=nav%3Aplus-ecommerce-product-overviews`

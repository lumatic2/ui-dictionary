# Step 11: ecommerce-quickview-order-history-inert-action-sweep

## 읽어야 할 파일
- examples/ui-vocabulary-site/src/App.tsx - 왜: Quickview, order summary, order history, and storefront page previews are implemented here.
- docs/research/tailwind-plus-catalog-interactivity-ledger.md - 왜: Prior sweep evidence and remaining gaps are tracked here.

## 작업
- Convert rendered Ecommerce quickview `Size guide` and `View full details` anchors to stateful buttons.
- Convert rendered Ecommerce order summary/history `View invoice`, `Continue shopping`, `View product`, `Buy again`, and `Manage order` anchors to stateful buttons.
- Convert StoreHeader category nav anchors to stateful buttons.
- Keep code-string examples untouched.

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
1. Run the AC commands.
2. Chrome-smoke quickview, order summary/history, and storefront/order-history page routes.
3. Update phase index and ledger with evidence.

## 결과
- Quickview `Size guide` and `View full details` anchors are now stateful buttons with feedback.
- Product-list `View product` and `Add to bag` actions now produce visible feedback.
- Order summary/history actions now use buttons for invoice, continue shopping, view product, buy again, manage order, and shop similar.
- StoreHeader category navigation now uses stateful buttons.
- Rendered `href="#"` scan now only finds code/documentation snippets, not preview controls.

## 검증 결과
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome smoke verified quickview, product-list, order-summary, order-history, and order-history page actions.
- Mobile 390px order-history overflow was 0.
- Evidence screenshots saved under `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step11/`.

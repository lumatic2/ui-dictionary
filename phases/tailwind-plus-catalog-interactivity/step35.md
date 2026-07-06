# Step 35: ecommerce sort and store navigation control sweep

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Ecommerce Category Filters와 Store Navigation preview renderer가 구현되는 파일.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: smoke 대상 leaf route id 확인에 필요.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이 product phase의 step 상태 정본.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 반복 sweep 근거와 검증 결과 ledger.

## 작업

Ecommerce leaf에서 nav/control처럼 보였지만 static text였던 affordance를 실제 feedback controls로 정리한다.

- Category Filters `Sort by newest` label을 feedback button으로 교체한다.
- Store Navigation top bar의 primary links, `Search`, `Cart`를 feedback buttons로 교체한다.
- Store Navigation variants에 공통 feedback pill을 추가해 top bar actions가 보이게 한다.
- Store Navigation mobile bottom nav `Shop`, `Search`, `Bag`, `Account`를 feedback buttons로 교체한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
cd examples/ui-vocabulary-site && npm run lint
cd examples/ui-vocabulary-site && npm run audit:visuals
cd ../.. && python scripts/validate-ui-vocabulary.py
```

추가 smoke:

- `nav:plus-ecommerce-category-filters`에서 `Sort by newest` 클릭 후 feedback 확인.
- `nav:plus-ecommerce-store-navigation`에서 `Search`, `Cart`, primary nav link 클릭 후 feedback 확인.
- Store Navigation mobile 390px에서 bottom nav `Search` 클릭 후 feedback 확인.
- desktop/mobile 390px에서 horizontal overflow와 severe console warning이 없어야 한다.

## 검증 결과

- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts\validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Category Filters sort feedback, Store Navigation search/cart/nav feedback, and mobile bottom nav feedback.
- Desktop and mobile 390px overflow checks returned no positive horizontal overflow.
- Severe console warning/error scan returned empty.

## 금지사항

- Do not treat labels inside already-clickable cards as separate nested buttons.
- Do not convert decorative product captions like `Shop now` unless the parent card lacks an action.

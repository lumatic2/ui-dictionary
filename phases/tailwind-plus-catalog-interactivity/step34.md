# Step 34: description list and textarea residual action sweep

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Description Lists, Textareas, Ecommerce category/storefront previews가 구현되는 파일.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: smoke 대상 leaf route id 확인에 필요.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이 product phase의 step 상태 정본.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 반복 sweep 근거와 검증 결과 ledger.

## 작업

남아 있던 residual static action affordance를 실제 동작 또는 검증된 parent action으로 정리한다.

- Description Lists attachment `Download`와 inline-action `Remove`를 feedback 가능한 buttons로 교체한다.
- Description Lists renderer에 feedback pill을 추가해 attachment actions가 보이게 한다.
- Textarea title pill footer의 `Attach a file` affordance를 feedback 가능한 button으로 교체한다.
- Ecommerce category detail overlay의 `Shop collection`은 parent card button이 이미 click/feedback을 소유하므로 중첩 button을 만들지 않고 smoke로 parent action을 검증한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
cd examples/ui-vocabulary-site && npm run lint
cd examples/ui-vocabulary-site && npm run audit:visuals
cd ../.. && python scripts/validate-ui-vocabulary.py
```

추가 smoke:

- `nav:plus-data-display-description-lists`에서 `Download`와 `Remove` 클릭 후 feedback 확인.
- `nav:plus-forms-textareas`에서 `Attach a file` 클릭 후 feedback 확인.
- `nav:plus-ecommerce-page-examples-storefront`에서 `Shop collection` 클릭 후 parent card feedback 확인.
- desktop/mobile 390px에서 horizontal overflow와 severe console warning이 없어야 한다.

## 검증 결과

- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts\validate-ui-vocabulary.py` passed.
- Targeted static scan confirmed old `Download`, `Remove`, and `Attach a file` spans are gone.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Description Lists download/remove feedback, Textareas attach feedback, and Storefront parent card feedback.
- Desktop and mobile 390px overflow checks returned no positive horizontal overflow.
- Severe console warning/error scan returned empty.

## 금지사항

- Do not create nested buttons inside card buttons.
- Do not convert decorative price/shipping/status labels into controls.

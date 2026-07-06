# Step 36: flyout and store menu item sweep

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Marketing Flyout Menus와 Ecommerce Store Navigation preview renderer가 구현되는 파일.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: smoke 대상 leaf route id 확인에 필요.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이 product phase의 step 상태 정본.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 반복 sweep 근거와 검증 결과 ledger.

## 작업

메뉴 항목처럼 보였지만 static text였던 flyout/store navigation 내부 list를 실제 menu controls로 바꾼다.

- Flyout Menus 상단 desktop nav `Product`, `Features`, `Marketplace`, `Company`, `Log in`을 feedback buttons로 교체한다.
- Flyout Menus item list cards, recent resource links, simple profile menu rows를 feedback buttons로 교체한다.
- Store Navigation menu column items를 feedback buttons로 교체한다.
- 기존 shared feedback pill을 활용해 클릭 결과가 같은 preview 안에 보이게 한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
cd examples/ui-vocabulary-site && npm run lint
cd examples/ui-vocabulary-site && npm run audit:visuals
cd ../.. && python scripts/validate-ui-vocabulary.py
```

추가 smoke:

- `nav:plus-marketing-flyout-menus`에서 flyout item, recent resource, desktop nav item 클릭 후 feedback 확인.
- `nav:plus-ecommerce-store-navigation`에서 menu column item 클릭 후 feedback 확인.
- desktop/mobile 390px에서 horizontal overflow와 severe console warning이 없어야 한다.

## 검증 결과

- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts\validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Flyout Menus item/resource/nav feedback and Store Navigation menu column feedback.
- Desktop and mobile 390px overflow checks returned no positive horizontal overflow.
- Severe console warning/error scan returned empty.

## 금지사항

- Do not convert purely decorative captions inside already-clickable cards.
- Do not create nested buttons inside card buttons or nav buttons.

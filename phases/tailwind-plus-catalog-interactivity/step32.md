# Step 32: radio color picker interaction sweep

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Radio Groups preview renderer와 color picker variant가 구현되는 파일.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: Radio Groups leaf route id 확인에 필요.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이 product phase의 step 상태 정본.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 반복 sweep 근거와 검증 결과 ledger.

## 작업

Application UI Radio Groups leaf의 `Color picker` 예시를 실제 radio group처럼 작동하게 만든다.

- 정적인 색상 swatch `span`을 `role="radio"` button으로 교체한다.
- 선택 상태를 `aria-checked`, selected ring, hover scale, active scale로 표시한다.
- 클릭 후 visible feedback pill을 렌더한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
cd ../.. && python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run lint
cd examples/ui-vocabulary-site && npm run audit:visuals
```

추가 smoke:

- `nav:plus-forms-radio-groups`에서 `Emerald color` radio 클릭 후 `Emerald color selected` feedback 확인.
- 클릭 후 `Emerald color`의 `aria-checked`가 `true`, `Indigo color`의 `aria-checked`가 `false`인지 확인.
- desktop/mobile 390px에서 horizontal overflow와 severe console warning이 없어야 한다.

## 검증 결과

- `npm run build` passed.
- `python scripts\validate-ui-vocabulary.py` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified color selection feedback and ARIA checked state.
- Desktop and mobile 390px overflow checks returned no positive horizontal overflow.
- Severe console warning/error scan returned empty.

## 금지사항

- Do not treat decorative badges or status labels as actions.
- Do not change unrelated Radio Group variants unless smoke finds a concrete issue.

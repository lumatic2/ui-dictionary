# Step 33: textarea and action panel affordance sweep

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Textareas와 Action Panels preview renderer가 구현되는 파일.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: smoke 대상 leaf route id 확인에 필요.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이 product phase의 step 상태 정본.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 반복 sweep 근거와 검증 결과 ledger.

## 작업

Textareas와 Action Panels leaf에서 여전히 static span으로 남아 있던 action-looking affordance를 실제 control로 바꾼다.

- Textarea avatar actions의 attach/suggest icon affordance를 accessible buttons로 교체한다.
- Textarea title pill actions의 `Assign`, `Label`, `Due date` chips를 feedback 가능한 buttons로 교체한다.
- Action Panel toggle의 visual state가 실제 on/off 상태를 반영하도록 만들고 `aria-label`/`aria-pressed`를 제공한다.
- Action Panel input 예시의 email field와 `Invite` affordance를 feedback 가능한 buttons로 교체한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
cd examples/ui-vocabulary-site && npm run lint
cd examples/ui-vocabulary-site && npm run audit:visuals
cd ../.. && python scripts/validate-ui-vocabulary.py
```

추가 smoke:

- `nav:plus-forms-textareas`에서 `Attach file`과 `Assign` 클릭 후 feedback 확인.
- `nav:plus-forms-action-panels`에서 hiring availability toggle, email field, `Invite` 클릭 후 feedback 확인.
- Action Panel toggle은 accessible name과 `aria-pressed`를 가져야 한다.
- desktop/mobile 390px에서 horizontal overflow와 severe console warning이 없어야 한다.

## 검증 결과

- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts\validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Textareas `Attach file`/`Assign` feedback and Action Panels toggle/email/invite feedback.
- Desktop and mobile 390px overflow checks returned no positive horizontal overflow.
- Severe console warning/error scan returned empty.

## 금지사항

- Do not convert decorative badges or plain status text into controls.
- Do not change unrelated textarea/action-panel variants unless smoke finds a concrete issue.

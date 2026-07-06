# Step 18: form-input-button-table-action-feedback-sweep

## 읽어야 할 파일
- examples/ui-vocabulary-site/src/App.tsx - 왜: Remaining actual rendered button candidates live in the shared preview renderer.
- phases/tailwind-plus-catalog-interactivity/index.json - 왜: Step status and summaries are tracked here.
- docs/research/tailwind-plus-catalog-interactivity-ledger.md - 왜: Smoke evidence and verification notes are appended here.

## 작업
- Continue the inert-action sweep by separating code-snippet button text from rendered preview buttons.
- Add visible feedback and hover/press motion to remaining actual rendered form, input group, auth, button, button group, dropdown, and drawer controls.
- Verify representative routes in Chrome.

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

## 결과
- Form layout Save/Cancel controls now show feedback.
- Input group trailing Sort control now opens visible feedback.
- Auth/social form Sign in and social provider buttons now show feedback.
- Textarea create action now shows feedback.
- Basic button variants and button-group variants now respond with feedback and press/hover motion.
- Dropdown triggers now toggle menu visibility, animate the panel, and expose clickable menu rows.
- Drawer profile Message and upload controls now show feedback.

## 검증 결과
- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, and `tabs.tsx`.
- `python scripts/validate-ui-vocabulary.py` passed: 527 terms.
- `npm run audit:visuals` passed: 527 variants, existing six fallback variants unchanged.
- Chrome smoke passed on representative routes:
  - `plus-forms-form-layouts`: `Save` -> exact `Form layout saved`.
  - `plus-forms-input-groups`: `Sort` feedback.
  - `plus-application-elements-buttons`: `Button text` -> `Button size 1 clicked`.
  - `plus-application-elements-button-groups`: `Months` -> `Months selected`.
  - `plus-overlays-drawers`: `Message` -> `Message composer opened`.
  - All checked desktop and mobile 390px routes returned horizontal overflow 0.
- Chrome console log contained only React DevTools info messages.

## Evidence
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-forms-form-layouts`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-forms-input-groups`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-application-elements-buttons`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-application-elements-button-groups`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-overlays-drawers`

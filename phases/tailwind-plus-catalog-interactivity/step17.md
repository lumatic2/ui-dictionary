# Step 17: residual-preview-action-feedback-sweep

## 읽어야 할 파일
- examples/ui-vocabulary-site/src/App.tsx - 왜: Remaining preview action controls and shared preview state live here.
- phases/tailwind-plus-catalog-interactivity/index.json - 왜: Step status and handoff summary are tracked here.
- docs/research/tailwind-plus-catalog-interactivity-ledger.md - 왜: Reference and verification evidence are appended here.

## 작업
- Sweep remaining rendered preview controls that looked clickable but did not visibly respond.
- Add feedback and hover/press motion without changing the broader preview architecture.
- Verify by clicking representative Marketing, Application UI, and list/feed routes in Chrome.

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
- Marketing footer/newsletter/contact/content CTAs now show feedback and press/hover motion.
- Marketing header, flyout, and banner controls now expose click feedback, mobile menu state, and dismiss/accept/register feedback.
- Application calendar controls now support Today/Add event feedback.
- Generic Application shell, data, form, nav, overlay previews now support active nav, export, save/cancel, toggle, apply/cancel/open flows.
- Grid list contact actions and feed comment actions now show visible feedback.

## 검증 결과
- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `badge.tsx`, `button.tsx`, and `tabs.tsx`.
- `python scripts/validate-ui-vocabulary.py` passed: 527 terms.
- `npm run audit:visuals` passed: 527 variants, existing six fallback variants unchanged.
- Chrome smoke passed on representative routes:
  - `plus-marketing-flyout-menus`: `Watch demo` -> `Watch demo opened`.
  - `plus-marketing-banners`: `Register now` -> `Register now clicked`.
  - `plus-data-display-calendars`: `Add event` -> `Event draft opened`.
  - `plus-forms`: `Save` -> `Profile saved`.
  - `plus-overlays`: `Apply` and `Open overlay` -> overlay flow works with `Changes applied`.
  - `plus-application-lists-grid-lists`: `Email` -> `Email opened`.
  - `plus-application-lists-feeds`: `Comment` -> `Comment posted`.
  - All checked desktop and mobile 390px routes returned horizontal overflow 0.
- Chrome console log contained only React DevTools info messages.

## Evidence
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-marketing-flyout-menus`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-marketing-banners`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-data-display-calendars`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-forms`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-overlays`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-application-lists-grid-lists`
- Local route: `http://127.0.0.1:5181/?filter=nav%3Aplus-application-lists-feeds`

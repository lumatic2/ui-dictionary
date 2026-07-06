# Step 9: application-template-page-interactivity-batch

## 읽어야 할 파일
- examples/ui-vocabulary-site/src/App.tsx - 왜: Tailwind Plus catalog previews, Application UI page examples, and template demos are rendered here.
- phases/tailwind-plus-catalog-interactivity/index.json - 왜: This product phase records current step status and completion evidence.
- CLAUDE.md - 왜: UI Vocabulary authoring and Tailwind reference parity conventions are defined here.

## 작업
Application UI detailed page examples and template previews must behave like interactive Tailwind-style leaf examples, not static shells.

- Upgrade `app-example-dashboard`, `app-example-settings`, `app-example-detail`, `app-example-list`, `app-example-auth`, and `app-example-onboarding` with stateful controls, visible feedback, and motion.
- Upgrade home/detail/settings screen examples so nav items, tabs, rows, metric cards, invoice actions, settings rows, toggles, and save/update actions are clickable.
- Fix remaining command palette awkward line wrapping in card rows/footer/preview.
- Keep changes scoped to preview behavior and visual quality. Do not rewrite navigation data or unrelated term content.

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
1. AC 커맨드 실행.
2. Chrome desktop smoke representative Application UI routes and click at least one nav/tab/action per route.
3. Chrome mobile 390px overflow smoke for Application UI routes.
4. Update this step and `index.json` with pass/fail evidence.

## 결과
- `app-example-dashboard`, `app-example-settings`, `app-example-detail`, `app-example-list`, `app-example-auth`, `app-example-onboarding` now render stateful controls with feedback and motion.
- Home, detail, and settings screen examples now expose clickable navigation, tabs, row selection, metric cards, save/update actions, toggles, and contextual feedback.
- Command palette row/footer/preview text uses truncation and no-wrap rules to avoid awkward card-internal line breaks.

## 검증 결과
- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Chrome desktop smoke passed for Application UI home/detail/settings/dashboard routes and Auth/Onboarding templates.
- Chrome mobile 390px overflow smoke passed for Application UI home/detail/settings/dashboard routes.
- Evidence screenshots saved under `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step9/`.

## 금지사항
- Do not replace working Ecommerce/Marketing interactions from earlier steps.
- Do not add broad abstractions or split files unless required by build/type errors.

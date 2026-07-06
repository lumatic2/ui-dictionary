# Step 13: docs-marketing-static-button-feedback-sweep

## 읽어야 할 파일
- examples/ui-vocabulary-site/src/App.tsx - 왜: Remaining static Docs preview and Marketing hero preview controls are rendered here.

## 작업
- Add visible state feedback to old Docs preview buttons for autocomplete, dropdown menu, copy button, dialog, popover, and select examples.
- Add visible state feedback to Marketing hero preview navigation, CTA, announcement, and image tile controls.
- Keep edits scoped to rendered preview behavior; do not refactor catalog data or unrelated pages.

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
2. Chrome-smoke representative Docs and Marketing routes.
3. Update phase index and ledger.

## 결과
- Legacy Docs autocomplete, dropdown menu, copy button, dialog, disclosure, popover, select, and tabs previews now expose stateful interactions.
- Marketing hero preview nav, primary/secondary CTAs, announcement buttons, GitHub/demo/read-more links, and collage image tiles now update visible feedback.
- Topbar Sign in, Get full access, and mobile More options now update visible feedback.
- Rendered `<button type="button">` scan for missing `onClick` returned no matches.

## 검증 결과
- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `python scripts/validate-ui-vocabulary.py` passed: 527 terms.
- `npm run audit:visuals` passed: 527 variants, existing six fallback variants unchanged.
- Chrome click smoke passed for Docs autocomplete/dropdown/copy/dialog/select, Marketing hero CTA, and topbar Sign in.
- Mobile 390px overflow checks returned 0 for Marketing hero and Docs dropdown/autocomplete.
- Chrome console error check returned no errors.

## Evidence
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step13/desktop_docs_dropdown_options.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step13/desktop_marketing_hero_feedback.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step13/desktop_topbar_signin_feedback.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step13/mobile_docs_autocomplete.png`

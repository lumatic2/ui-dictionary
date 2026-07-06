# Step 6: application-commerce-page-shell-interactivity-batch

## 읽어야 할 파일
- `examples/ui-vocabulary-site/src/App.tsx` - 왜: remaining Application UI overview shells and Ecommerce broad page examples are implemented here.
- `phases/tailwind-plus-catalog-interactivity/index.json` - 왜: this step's lifecycle and summary are recorded here.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` - 왜: verification evidence and bugs are appended here.

## 작업
Convert the remaining shell-like overview page examples into stateful previews:
- Application form overview pages should save/discard, select options, toggle settings, and show feedback.
- Application data overview pages should export, select dates/rows, and show active context.
- Application element overview pages should expose clickable primitives instead of inert spans.
- Ecommerce broad page examples should support CTA, product option, cart quantity, checkout step, review, and order actions.

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
2. Smoke representative Application UI and Ecommerce page example routes on desktop and mobile.
3. Save screenshots under `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step6/`.
4. Complete this step in `index.json` and append the ledger.

## 금지사항
- Do not replace the catalog taxonomy or route IDs.
- Do not touch unrelated dirty files.

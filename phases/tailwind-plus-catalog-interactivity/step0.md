# Step 0: controls-heavy-preview-interactivity-batch

## 읽어야 할 파일
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Marketing/Application/Ecommerce catalog pages and preview variants are rendered here.
- `docs/PRD.md` — 왜: UI Dictionary must teach names, shapes, usage, and AI-promptable UI behavior.
- `docs/ARCHITECTURE.md` — 왜: Vite/React/Tailwind client-only architecture and verification commands are defined here.

## 작업
- Identify preview variants in Marketing, Application UI, and Ecommerce where visible controls imply interaction but currently render static states.
- Implement the first batch of controls-heavy previews with local React state inside the preview renderer.
- Add transitions or animated feedback where controls open, select, toggle, apply, add, remove, or switch panels.
- Preserve existing visual style and avoid unrelated refactors.

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
2. Use browser smoke on representative Marketing, Application UI, and Ecommerce pages to click/toggle/select the new controls and confirm no horizontal overflow.
3. Update `phases/tailwind-plus-catalog-interactivity/index.json` with completed status and evidence summary.

## 금지사항
- Do not turn this into a design-only pass; examples must respond to user actions.
- Do not change unrelated data model or navigation behavior unless a bug blocks this step.

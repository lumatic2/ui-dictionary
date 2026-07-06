# Step 4: heading-list-table-interactivity-batch

## 읽어야 할 파일
- `examples/ui-vocabulary-site/src/App.tsx` - 왜: Tailwind Plus catalog preview variants and reusable preview state live here.
- `phases/tailwind-plus-catalog-interactivity/index.json` - 왜: this product phase status machine records the active step and completion summary.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` - 왜: completed evidence and mismatches are appended here for the parity loop.

## 작업
Card headings, section headings, vertical navigation, stacked lists, and table/list previews should stop being static shells. Representative buttons, tabs, row actions, menus, and selection controls must update visible state, preserve layout, and include small motion/hover affordances.

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
1. Run the AC commands.
2. Use browser smoke on representative desktop and mobile routes for card headings, section headings, vertical navigation, stacked lists, and tables.
3. Save screenshots under `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step4/`.
4. Update `phases/tailwind-plus-catalog-interactivity/index.json` with completed status and append the ledger.

## 금지사항
- Do not replace existing preview taxonomy or navigation IDs; this step only upgrades behavior and polish.
- Do not remove unrelated dirty worktree changes.

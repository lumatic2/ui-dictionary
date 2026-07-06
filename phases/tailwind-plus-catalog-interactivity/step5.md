# Step 5: tabs-command-popover-interactivity-batch

## 읽어야 할 파일
- `examples/ui-vocabulary-site/src/App.tsx` - 왜: tabs, command palette, popover, and docs disclosure previews are implemented here.
- `phases/tailwind-plus-catalog-interactivity/index.json` - 왜: this step's status and completion summary are recorded here.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` - 왜: evidence and remaining mismatch notes are appended here.

## 작업
Upgrade the leaf examples the user called out: tabs, command palettes, popovers, and disclosure. The previews should be interactive, responsive, and animated. Command palette rows must avoid awkward wrapping in cards and should support typing/filtering plus selection. Popover leaf examples should not all share the same static shell.

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
2. Smoke `plus-navigation-tabs`, `plus-navigation-command-palettes`, `plus-overlays-popovers`, and a docs disclosure page in desktop and mobile width.
3. Save screenshots under `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step5/`.
4. Mark this step completed and append the ledger.

## 금지사항
- Do not broaden into Marketing/Application/Ecommerce page-example interactivity yet; this step only closes the called-out leaf examples.
- Do not replace the existing Tailwind Plus taxonomy.

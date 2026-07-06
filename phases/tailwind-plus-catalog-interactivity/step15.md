# Step 15: marketing-leaf-density-reference-pass

## 읽어야 할 파일
- examples/ui-vocabulary-site/src/App.tsx - 왜: Marketing leaf renderer and examples are implemented here.
- docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step15/tailwind_cta_sections_reference.png - 왜: Live Tailwind Plus CTA Sections reference capture for layout rhythm.

## 작업
- Compare Tailwind Plus `CTA Sections` leaf structure against our Marketing leaf renderer.
- Add breadcrumb/category context, license/info notice, example count, per-example description/tags, and clearer locked-code feedback.
- Keep the renderer generic so Marketing, Application, Ecommerce template leaves benefit without hand-editing every example.

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
2. Chrome-smoke `plus-marketing-cta-sections` for metadata, locked-code feedback, and mobile overflow.
3. Save local evidence screenshots.
4. Update phase index and ledger.

## 결과
- Captured Tailwind Plus `CTA Sections` live reference.
- Marketing leaf pages now show breadcrumb/category context and an info notice modeled after the Tailwind Plus leaf rhythm.
- Each example header now includes example numbering, description, and tags.
- The right rail now exposes the example count and example title list.
- Locked-code modals now show the requested example title, description, and tags.

## 검증 결과
- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `python scripts/validate-ui-vocabulary.py` passed: 527 terms.
- `npm run audit:visuals` passed: 527 variants, existing six fallback variants unchanged.
- Chrome DOM smoke for `plus-marketing-cta-sections` passed:
  - info notice visible.
  - example tags visible.
  - `Example 01` badge visible.
  - `Get the code` modal visible and includes example metadata.
  - mobile 390px overflow returned 0.
- Chrome screenshot saving timed out for modal/mobile states, so those states are recorded as DOM smoke evidence.

## Evidence
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step15/tailwind_cta_sections_reference.png`
- `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step15/local_cta_sections_density_desktop.png`

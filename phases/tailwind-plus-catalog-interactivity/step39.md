# Step 39: residual-chip-input-receipt-feedback-sweep

## 읽어야 할 파일
- `CLAUDE.md` — 왜: Tailwind/Tailwind Plus reference-backed UI Vocabulary workflow와 검증 규칙을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: catalog preview renderer의 residual static affordance를 수정한다.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이전 sweep 상태와 다음 step 번호를 이어받는다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 이번 sweep의 범위와 검증 증거를 이어서 기록한다.

## 작업
- 실제 JSX로 렌더되는 residual action-looking `span`/`p`/chip 후보를 스캔한다.
- 코드 snippet 내부 `href="#"`와 이미 parent button 안에 있는 decorative copy는 제외한다.
- Description Lists narrow receipt download, Section Headings input-group search/sort, Ecommerce Product Overview color/size chips를 실제 버튼, selected state, feedback, press motion으로 전환한다.

## Acceptance Criteria
```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
npm run audit:visuals
cd ../..
python scripts\validate-ui-vocabulary.py
```

## 검증 절차
1. AC 커맨드를 실행한다.
2. Standalone Playwright로 `http://127.0.0.1:5174`에서 다음 route를 smoke한다:
   - `nav:plus-data-display-description-lists`
   - `nav:plus-application-headings-section-headings`
   - `nav:plus-ecommerce-product-overviews`
3. `Download receipt +`, `Search candidates`, `Sort`, color chip, size chip이 클릭 후 visible feedback을 남기는지 확인한다.
4. Product Overviews와 Description Lists 모바일 390px에서 positive horizontal overflow가 없는지 확인한다.
5. severe console error가 없는지 확인한다.
6. 성공 시 `index.json` step 39를 completed로 기록하고 ledger에 검증 결과를 append한다.

## 금지사항
- 코드 예시 문자열의 `href="#"`를 실제 렌더 affordance로 오판해 수정하지 않는다.
- parent button 내부 안내문구인 `Shop now` 같은 decorative copy를 중첩 버튼으로 바꾸지 않는다.
- 기존 broad Tailwind parity 변경을 되돌리지 않는다.

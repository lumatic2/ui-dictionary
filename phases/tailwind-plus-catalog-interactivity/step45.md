# Step 45: storefront-review-card-and-copy-quality-sweep

## 읽어야 할 파일
- `CLAUDE.md` - 왜: Tailwind/Tailwind Plus reference-backed UI Vocabulary workflow와 검증 규칙을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` - 왜: Ecommerce storefront/product/review previews와 remaining copy quality issues를 수정한다.
- `phases/tailwind-plus-catalog-interactivity/index.json` - 왜: 이전 sweep 상태와 이번 step 상태를 이어받는다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` - 왜: 이번 sweep의 범위와 검증 증거를 이어서 기록한다.

## 작업
- Ecommerce Storefront page examples의 customer story/detail cards를 clickable feedback cards로 전환한다.
- Ecommerce Product page review cards를 clickable feedback cards로 전환한다.
- Incentives와 table examples에 남아 있는 placeholder/filler copy를 우리 사이트 톤에 맞게 교체한다.

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
   - `nav:plus-ecommerce-page-examples-storefront-pages`
   - `nav:plus-ecommerce-page-examples-product-pages`
   - `nav:plus-ecommerce-incentives`
   - `nav:plus-application-lists-tables`
3. Storefront story/detail card와 product review card가 visible feedback을 남기는지 확인한다.
4. 주요 filler-copy scan이 통과하는지 확인한다.
5. 네 route의 mobile 390px에서 positive horizontal overflow가 없는지 확인한다.
6. severe console error가 없는지 확인한다.

## 금지사항
- image-only layout proof와 decorative quote text를 무조건 control로 바꾸지 않는다. 카드처럼 반복되고 선택 가능한 surface만 전환한다.
- 이미 ProductTile/CategoryTile처럼 button인 컴포넌트는 중첩 button으로 감싸지 않는다.
- 기존 Tailwind parity 구조와 이전 step의 feedback 동작을 되돌리지 않는다.

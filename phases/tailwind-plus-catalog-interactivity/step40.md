# Step 40: product-list-order-progress-social-feedback-sweep

## 읽어야 할 파일
- `CLAUDE.md` — 왜: Tailwind/Tailwind Plus reference-backed UI Vocabulary workflow와 검증 규칙을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: catalog preview renderer의 residual static affordance를 수정한다.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이전 sweep 상태와 다음 step 번호를 이어받는다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 이번 sweep의 범위와 검증 증거를 이어서 기록한다.

## 작업
- 실제 렌더 후보 중 control-looking static labels를 추가 스캔한다.
- Decorative initials/status dots/code snippets/parent button 내부 copy는 제외한다.
- Product Lists card detail size chips, Order Summaries progress step labels, Marketing 404 social labels를 실제 button/feedback/motion으로 전환한다.

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
   - `nav:plus-ecommerce-product-lists`
   - `nav:plus-ecommerce-order-summaries`
   - `nav:plus-marketing-404-pages`
3. Product Lists `Card with full details` size chip이 클릭 후 feedback을 남기는지 확인한다.
4. Order Summaries `With progress bars` step label이 클릭 후 progress state와 feedback을 갱신하는지 확인한다.
5. Marketing 404 `With navbar and footer` social label이 클릭 후 feedback을 남기는지 확인한다.
6. 세 route의 mobile 390px에서 positive horizontal overflow가 없는지 확인한다.
7. severe console error가 없는지 확인한다.

## 금지사항
- decorative initials, status dots, code snippet 문자열을 실제 control로 오판하지 않는다.
- parent card button 내부 `Shop now` 같은 copy에 nested button을 만들지 않는다.
- 기존 broad Tailwind parity 변경을 되돌리지 않는다.

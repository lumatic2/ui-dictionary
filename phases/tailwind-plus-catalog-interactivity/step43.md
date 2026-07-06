# Step 43: application-ecommerce-static-card-feedback-sweep

## 읽어야 할 파일
- `CLAUDE.md` - 왜: Tailwind/Tailwind Plus reference-backed UI Vocabulary workflow와 검증 규칙을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` - 왜: Application Grid Lists/Data Display와 Ecommerce review/order-history page examples의 residual static affordance를 수정한다.
- `phases/tailwind-plus-catalog-interactivity/index.json` - 왜: 이전 sweep 상태와 이번 step 상태를 이어받는다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` - 왜: 이번 sweep의 범위와 검증 증거를 이어서 기록한다.

## 작업
- Application Grid Lists에서 프로젝트 카드, horizontal link card, shared action card, image detail card가 실제 click feedback과 motion을 갖게 한다.
- Application Data Display의 metric/table 예시를 실제 selectable cards/rows로 바꾸고 table 구조를 더 자연스럽게 정리한다.
- Ecommerce Reviews와 Order History Pages에서 static review/order summary/footer affordance를 실제 feedback buttons로 전환한다.
- 내부 버튼이 이미 있는 product/order rows에는 nested button을 만들지 않는다.

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
   - `nav:plus-application-lists-grid-lists`
   - `nav:plus-application-ui-data-display`
   - `nav:plus-ecommerce-page-examples-order-history-pages`
   - `nav:plus-ecommerce-page-examples`
3. Grid list card, metric/table row, review card, order summary/footer link가 visible feedback을 남기는지 확인한다.
4. 네 route의 mobile 390px에서 positive horizontal overflow가 없는지 확인한다.
5. severe console error가 없는지 확인한다.

## 금지사항
- 이미 내부 버튼이 있는 product/order line을 통째로 button으로 감싸지 않는다.
- decorative image/logo/status badge를 control로 오판하지 않는다.
- 기존 Tailwind parity 구조와 이전 step의 feedback 동작을 되돌리지 않는다.

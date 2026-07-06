# Step 44: bento-description-incentive-affordance-sweep

## 읽어야 할 파일
- `CLAUDE.md` - 왜: Tailwind/Tailwind Plus reference-backed UI Vocabulary workflow와 검증 규칙을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` - 왜: Marketing Bento, Application Description Lists, Ecommerce Incentives preview renderer를 수정한다.
- `phases/tailwind-plus-catalog-interactivity/index.json` - 왜: 이전 sweep 상태와 이번 step 상태를 이어받는다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` - 왜: 이번 sweep의 범위와 검증 증거를 이어서 기록한다.

## 작업
- Marketing Bento integration rows를 실제 selectable buttons로 바꾸고 feedback/motion을 추가한다.
- Application Description List inline `Update` affordance를 버튼으로 바꾸고 visible feedback을 남긴다.
- Ecommerce Incentives benefit cards/icon rows를 stateful buttons로 바꾸고 section-level feedback을 추가한다.

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
   - `nav:plus-marketing-bento-grids`
   - `nav:plus-application-ui-data-display-description-lists`
   - `nav:plus-ecommerce-incentives`
3. Bento integration row, description list update action, incentive benefit card/icon row가 visible feedback을 남기는지 확인한다.
4. 세 route의 mobile 390px에서 positive horizontal overflow가 없는지 확인한다.
5. severe console error가 없는지 확인한다.

## 금지사항
- chart bars, decorative logo marks, image-only proof 영역을 control로 오판하지 않는다.
- 이미 button인 parent/card 안에 nested button을 만들지 않는다.
- 기존 Tailwind parity 구조와 이전 step의 feedback 동작을 되돌리지 않는다.

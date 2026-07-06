# Step 7: ecommerce-detailed-page-variant-interactivity-batch

## 읽어야 할 파일
- CLAUDE.md - 왜: Tailwind Plus IA reference와 UI Vocabulary 검증 규칙을 따른다.
- CLAUDE.local.md - 왜: 이전 세션의 Tailwind parity/handoff와 Chrome 검증 기준을 이어받는다.
- examples/ui-vocabulary-site/src/App.tsx - 왜: Ecommerce 상세 page examples의 preview variants가 구현된 단일 화면 파일이다.
- phases/tailwind-plus-catalog-interactivity/index.json - 왜: Step 0-6 완료 요약과 이번 step 상태 전이를 기록한다.

## 작업
Ecommerce 상세 page example variants를 껍데기에서 상태가 있는 예시로 끌어올린다.

- storefront variants: hero/category/product CTA를 버튼으로 전환하고 hover/press/selection feedback을 추가한다.
- product page variants: color, size, add-to-bag, expandable details, tabs, related products를 조작 가능하게 만든다.
- category page variants: filter chips/sidebar, sort, pagination, product selection을 조작 가능하게 만든다.
- cart page variants: 수량 변경, remove/restore, summary total, related product add, checkout feedback을 연결한다.
- checkout variants: pay/confirm/continue actions, stepper selection, mobile summary overlay를 조작 가능하게 만든다.
- order detail/history variants: invoice, tracking, buy again, shop similar, product row 선택을 조작 가능하게 만든다.

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
1. AC 커맨드를 실행한다.
2. Chrome에서 desktop과 390px mobile로 대표 Ecommerce 상세 routes를 직접 클릭해 feedback, overlay, overflow를 확인한다.
3. evidence screenshots를 `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step7/` 아래에 남긴다.
4. 성공 시 `phases/tailwind-plus-catalog-interactivity/index.json` Step 7을 completed로 갱신한다.

## 금지사항
- Tailwind 레퍼런스 parity와 무관한 전역 리팩터링 금지.
- 사용자/이전 step의 dirty changes를 되돌리지 않는다.
- 표시만 있는 컨트롤을 추가로 만들지 말고, 새 컨트롤은 최소한 visible state나 feedback을 남긴다.

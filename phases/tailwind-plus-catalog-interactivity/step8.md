# Step 8: marketing-page-example-interactivity-batch

## 읽어야 할 파일
- CLAUDE.md - 왜: Tailwind Plus page example parity와 검증 규칙을 따른다.
- examples/ui-vocabulary-site/src/App.tsx - 왜: Marketing landing/pricing/about page example variants가 구현된 파일이다.
- phases/tailwind-plus-catalog-interactivity/index.json - 왜: Step 7 이후 이어지는 반복 작업 상태를 기록한다.

## 작업
Marketing Page Examples의 완성 페이지 variants를 정적인 목업에서 조작 가능한 예시로 끌어올린다.

- Landing pages: nav links, CTA, feature cards, logo/case-study links가 feedback을 남기고 hover/press motion을 갖는다.
- Pricing pages: monthly/annual billing toggle, plan selection, buy plan buttons, comparison cells, FAQ accordion이 작동한다.
- About pages: nav, stat blocks, value cards, timeline/value sections가 선택 상태와 feedback을 보여준다.

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
2. Chrome desktop/mobile 390px에서 landing/pricing/about page examples를 클릭해 feedback과 overflow를 확인한다.
3. evidence screenshots를 `docs/research/assets/tailwind-plus-catalog-interactivity-2026-07-03/step8/` 아래에 남긴다.
4. 성공 시 `index.json` Step 8을 completed로 갱신한다.

## 금지사항
- Marketing page example 외의 대형 리팩터링 금지.
- 사용자가 만든 기존 dirty changes를 되돌리지 않는다.
- 새 컨트롤은 표시만 하지 말고 클릭 후 visible state나 feedback을 남긴다.

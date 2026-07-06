# Step 38: tabs-command-docs-residual-quality-sweep

## 읽어야 할 파일
- `CLAUDE.md` — 왜: Tailwind/Tailwind Plus reference-backed UI Vocabulary authoring workflow와 검증 규칙을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: catalog preview renderer와 docs element preview 구현이 이 파일에 있다.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이전 interactivity sweep의 완료 범위와 다음 step 번호를 이어받는다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 이번 sweep의 범위와 검증 증거를 이어서 기록한다.

## 작업
- Popover, Disclosure, Tabs, Command Palette 관련 leaf/page examples를 다시 탐색한다.
- 탭처럼 보이지만 정적이거나 일반 문구만 바뀌는 예시는 실제 tab 버튼, selected state, tab-specific content, feedback, press motion을 갖게 한다.
- Command Palette 카드 내부 row는 모바일과 좁은 카드에서 줄바꿈/overflow 없이 truncate와 shortcut slot이 안정적으로 보이게 한다.
- Popover와 Disclosure는 실제 route smoke로 open/select/overflow를 확인하고, 새 결함이 있으면 같은 step에서 고친다.

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
   - `nav:plus-ecommerce-product-features`
   - `nav:plus-ecommerce-page-examples-product-pages`
   - `nav:plus-navigation-command-palettes`
   - `nav:docs-elements-popover`
   - `nav:docs-elements-disclosure`
3. Product Features/Product Pages tabs가 클릭 후 tab-specific content와 feedback을 렌더링하는지 확인한다.
4. Command Palettes 모바일 390px에서 positive horizontal overflow와 row overflow가 없는지 확인한다.
5. Popover/Disclosure route에서 severe console error와 모바일 overflow가 없는지 확인한다.
6. 성공 시 `index.json` step 38을 completed로 기록하고 ledger에 검증 결과를 append한다.

## 금지사항
- Tailwind Plus 원문 copy를 그대로 복제하지 않는다. 구조와 상호작용만 참고하고 내용은 UI Dictionary 맥락으로 쓴다.
- 이미 사용자/이전 step이 만든 broad 변경을 되돌리지 않는다.
- 문서 snippet 안의 code-like 문자열을 실제 UI affordance로 오판해 바꾸지 않는다.

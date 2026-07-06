# Step 41: footer-heading-filter-feed-tag-feedback-sweep

## 읽어야 할 파일
- `CLAUDE.md` — 왜: Tailwind/Tailwind Plus reference-backed UI Vocabulary workflow와 검증 규칙을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: catalog preview renderer의 residual static affordance를 수정한다.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이전 sweep 상태와 다음 step 번호를 이어받는다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 이번 sweep의 범위와 검증 증거를 이어서 기록한다.

## 작업
- Link/chip/filter/tag처럼 보이는 residual static labels를 실제 route 기준으로 선별한다.
- Decorative status dots, initials, chart bars, code snippets는 제외한다.
- Marketing Footers centered nav links, Application Page Headings job filter chips, Ecommerce Category Filters sort/grid labels, Application Feeds tags를 실제 buttons/selected state/feedback/motion으로 전환한다.

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
   - `nav:plus-marketing-footers`
   - `nav:plus-application-headings-page-headings`
   - `nav:plus-ecommerce-category-filters`
   - `nav:plus-application-lists-feeds`
3. Footer centered nav link, heading filter chip, category sort/grid controls, feed tag button이 각각 visible feedback을 남기는지 확인한다.
4. 네 route의 mobile 390px에서 positive horizontal overflow가 없는지 확인한다.
5. severe console error가 없는지 확인한다.

## 금지사항
- decorative initials, status dots, chart marks, code snippet 문자열을 실제 control로 오판하지 않는다.
- parent card/button 내부 copy에 nested button을 만들지 않는다.
- 기존 broad Tailwind parity 변경을 되돌리지 않는다.

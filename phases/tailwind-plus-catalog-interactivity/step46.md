# Step 46: marketing-generic-copy-quality-sweep

## 읽어야 할 파일
- `CLAUDE.md` - 왜: Tailwind/Tailwind Plus reference-backed UI Vocabulary workflow와 검증 규칙을 확인한다.
- `examples/ui-vocabulary-site/src/App.tsx` - 왜: Marketing preview renderer의 residual generic copy를 수정한다.
- `phases/tailwind-plus-catalog-interactivity/index.json` - 왜: 이전 sweep 상태와 이번 step 상태를 이어받는다.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` - 왜: 이번 sweep의 범위와 검증 증거를 이어서 기록한다.

## 작업
- Marketing Feature/Footer/Content/Logo Cloud/Landing/Pricing/404 previews에 남은 Tailwind식 generic copy를 UI Dictionary 맥락의 copy로 교체한다.
- 이미 button으로 동작하는 CTA는 기존 feedback 동작을 유지한다.
- placeholder 용어 자체가 UI 용어인 `placeholder`, avatar placeholder, skeleton placeholder 등은 false positive로 보고 유지한다.

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
2. Targeted scan으로 이번에 제거한 generic copy가 남지 않았는지 확인한다.
3. Standalone Playwright로 `http://127.0.0.1:5174`에서 다음 route를 smoke한다:
   - `nav:plus-marketing-feature-sections`
   - `nav:plus-marketing-footers`
   - `nav:plus-marketing-content-sections`
   - `nav:plus-marketing-logo-clouds`
   - `nav:plus-marketing-page-examples-landing-pages`
   - `nav:plus-marketing-pricing-sections`
   - `nav:plus-marketing-404-pages`
4. 각 route의 대표 CTA가 feedback을 남기고 mobile 390px에서 positive horizontal overflow가 없는지 확인한다.
5. severe console error가 없는지 확인한다.

## 금지사항
- `placeholder`가 UI 용어 자체로 쓰이는 input/avatar/skeleton 문맥은 제거하지 않는다.
- 기존 interactive button을 정적 span으로 되돌리지 않는다.
- Tailwind parity 구조와 이전 step의 feedback 동작을 되돌리지 않는다.

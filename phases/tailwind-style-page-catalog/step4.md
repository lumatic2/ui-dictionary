# Step 4: Template page sections

## 읽어야 할 파일

- `docs/ui-vocabulary/terms.yml` — 왜: page-level template terms and metadata source.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: Template section path and termIds source.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: category page rendering and section copy source.
- `docs/research/assets/tailwind-templates-viewport.png` — 왜: complete template catalog reference.

## 작업

Templates 하위 페이지를 완성 페이지 예시만 보여주는 구조로 만든다.

Target behavior:

- `Dashboard Screens`, `Auth Screens`, `Ecommerce Screens`, `Onboarding Screens` 각각이 page example list로 보인다.
- block/component term이 섞여 있으면 canonical 위치를 옮기고, 필요하면 `also_appears_in`만 남긴다.
- 각 template row/page에는 화면 목적, 포함되는 주요 블록, 적합한 사용 상황이 보인다.

## Acceptance Criteria

```powershell
cd examples/ui-vocabulary-site
npm run build
npm run audit:visuals
```

Chrome smoke:

- `?page=plus&filter=nav%3Aplus-templates-dashboard-screens`
- `?page=plus&filter=nav%3Aplus-templates-auth-screens`
- `?page=plus&filter=nav%3Aplus-templates-ecommerce-screens`
- `?page=plus&filter=nav%3Aplus-templates-onboarding-screens`

## 검증 절차

1. 각 Template filter가 page-level term만 보여주는지 확인한다.
2. Visual audit fallback이 새로 늘지 않는지 확인한다.
3. step 상태를 갱신한다.

## 금지사항

- `checkout-step`, `cart-summary-bar`, `metric-card` 같은 partial term을 Templates canonical로 두지 마라.
- Tailwind template의 고유 상품명 방식을 그대로 복사하지 마라. 우리 쪽은 generic page pattern name을 쓴다.

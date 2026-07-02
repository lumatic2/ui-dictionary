# Step 1: Complete-page Template taxonomy

## 읽어야 할 파일

- `docs/ui-vocabulary/terms.yml` — 왜: template page term과 navigation metadata의 원본이다.
- `docs/ui-vocabulary/schema.md` — 왜: YAML term schema와 navigation 필드 설명을 확인한다.
- `scripts/build-ui-vocabulary-data.mjs` — 왜: navigation/type generation validation이 여기 있다.
- `scripts/validate-ui-vocabulary.py` — 왜: Docs/Plus/Index path validation이 여기 있다.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: Plus Templates 하위 path와 termIds를 맞춰야 한다.

## 작업

Templates는 완성 페이지 단위로만 정리한다.

추천 하위 섹션:

- `Dashboard Screens`: overview, analytics, team, settings, billing, report screens
- `Auth Screens`: login, signup, password reset, MFA, invite acceptance
- `Ecommerce Screens`: storefront, product listing, product detail, cart, checkout, order status
- `Onboarding Screens`: welcome, choice, checklist, setup progress, consent review

`dashboard-grid`, `checkout-step`, `cart-summary-bar`처럼 부분 조각은 Templates canonical로 두지 않는다. 필요한 경우 `also_appears_in`으로만 연결한다.

## Acceptance Criteria

```powershell
node scripts/build-ui-vocabulary-data.mjs
python scripts/validate-ui-vocabulary.py
```

## 검증 절차

1. `terms.yml`의 Templates canonical path가 page-level term에만 붙었는지 확인한다.
2. partial block/component는 UI Blocks 또는 UI Kit canonical을 유지한다.
3. navigation-model의 template termIds와 YAML navigation이 충돌하지 않는지 확인한다.
4. step 상태를 갱신한다.

## 금지사항

- Template에 block과 component를 섞지 마라. 이유: Tailwind Templates는 완성품 선택 모드다.
- 같은 term을 여러 canonical path에 두지 마라. 이유: 검색/필터 중복이 다시 생긴다.

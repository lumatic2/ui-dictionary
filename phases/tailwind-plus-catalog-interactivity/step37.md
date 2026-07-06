# Step 37: marketing headers nav affordance sweep

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Marketing Headers preview renderer와 `HeaderLink` helper가 구현되는 파일.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: smoke 대상 leaf route id 확인에 필요.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이 product phase의 step 상태 정본.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 반복 sweep 근거와 검증 결과 ledger.

## 작업

Marketing Headers leaf에서 nav link처럼 보였지만 static span이던 `HeaderLink` affordance를 실제 feedback control로 바꾼다.

- `HeaderLink`를 span에서 button으로 교체한다.
- hover/press motion을 추가한다.
- 문자열 children은 해당 label로 feedback을 남기고, 복합 children은 fallback feedback을 남긴다.
- 기존 `HeaderShell` feedback pill을 사용해 클릭 결과가 같은 preview 안에 보이게 한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
cd examples/ui-vocabulary-site && npm run lint
cd examples/ui-vocabulary-site && npm run audit:visuals
cd ../.. && python scripts/validate-ui-vocabulary.py
```

추가 smoke:

- `nav:plus-marketing-headers`에서 `Product`, `Company`, `Log in ->` 클릭 후 feedback 확인.
- desktop/mobile 390px에서 horizontal overflow와 severe console warning이 없어야 한다.

## 검증 결과

- `npm run build` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- `python scripts\validate-ui-vocabulary.py` passed.
- Standalone Playwright smoke on `http://127.0.0.1:5174` verified Marketing Headers product/company/login feedback.
- Desktop and mobile 390px overflow checks returned no positive horizontal overflow.
- Severe console warning/error scan returned empty.

## 금지사항

- Do not alter header layout density or route model.
- Do not create nested buttons inside existing CTA buttons.

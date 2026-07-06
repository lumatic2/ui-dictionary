# Step 31: residual stats footer avatar feedback sweep

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Stats, Marketing Footers, Avatars preview renderer와 visible feedback 상태가 구현되는 파일.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: smoke 대상 leaf route id를 확인하는 navigation model.
- `phases/tailwind-plus-catalog-interactivity/index.json` — 왜: 이 product phase의 step 상태 정본.
- `docs/research/tailwind-plus-catalog-interactivity-ledger.md` — 왜: 반복 sweep 근거와 검증 결과 ledger.

## 작업

잔여 static/pseudo-action처럼 보이는 UI를 실제 feedback 가능한 control로 정리한다.

- Application UI Stats `With brand icon` card의 `View all` controls가 클릭 피드백을 남기게 한다.
- Marketing Footer newsletter email/subscribe/privacy controls가 버튼으로 작동하고 feedback을 남기게 한다.
- Application UI Avatar `With text` 예시의 `View profile` control이 feedback을 실제로 렌더하도록 한다.
- 기존 Tailwind Plus leaf 리듬과 충돌하지 않게 hover/press transition과 compact feedback pill을 사용한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
cd ../.. && python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run lint
cd examples/ui-vocabulary-site && npm run audit:visuals
```

추가 smoke:

- `nav:plus-data-display-stats`에서 `View all` 클릭 후 `details opened` feedback 확인.
- `nav:plus-marketing-footers`에서 `Enter your email`과 `Subscribe` 클릭 후 newsletter feedback 확인.
- `nav:plus-application-elements-avatars`에서 `View profile` 클릭 후 `Tom Cook profile opened` feedback 확인.
- desktop/mobile 390px에서 horizontal overflow와 severe console warning이 없어야 한다.

## 검증 결과

- `npm run build` passed.
- `python scripts\validate-ui-vocabulary.py` passed.
- `npm run lint` passed with only existing shadcn fast-refresh warnings in `button.tsx`, `badge.tsx`, and `tabs.tsx`.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Targeted static scan confirmed old static `View all`, `View profile`, newsletter spans are gone.
- Standalone Playwright smoke on `http://127.0.0.1:5174` passed for Stats, Footers, and Avatars feedback.
- Desktop and mobile 390px overflow checks returned no positive horizontal overflow.
- Severe console warning/error scan returned empty.

## 금지사항

- Documentation code snippet strings and decorative status labels are not action controls; do not convert them during this sweep.
- Do not change unrelated Tailwind Plus page density or navigation model semantics in this step.

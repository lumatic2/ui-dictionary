# Step 2: Plus catalog page shell

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Plus landing과 filter state가 구현되어 있다.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: Plus category tree의 source다.
- `docs/research/assets/tailwind-plus-viewport.png` — 왜: Plus landing density와 section hierarchy reference다.
- `docs/research/assets/tailwind-ui-blocks-viewport.png` — 왜: UI Blocks category/page structure reference다.
- `docs/research/assets/tailwind-templates-viewport.png` — 왜: Templates page-level catalog reference다.
- `docs/research/assets/tailwind-ui-kit-viewport.png` — 왜: UI Kit component-system reference다.

## 작업

`PlusCatalogLanding`을 boxed card cluster에서 Tailwind-like catalog page로 바꾼다.

Target behavior:

- 상단: Plus가 무엇인지 짧게 설명하고 `UI Blocks / Templates / UI Kit`을 같은 페이지 안의 큰 section으로 나눈다.
- 각 section: 카드 대신 heading, description, text-row category links, count를 사용한다.
- `Templates` section은 완성 페이지 단위임을 명확히 보인다.
- 대표 term은 작은 보조 영역으로 낮추고, 페이지의 주 구조가 되지 않게 한다.

## Acceptance Criteria

```powershell
cd examples/ui-vocabulary-site
npm run build
```

Chrome smoke:

- `http://127.0.0.1:5181/?page=plus`
- UI Blocks, Templates, UI Kit가 section heading으로 보인다.
- 대표 term이 12개 이하로만 보인다.
- console error 0개.

## 검증 절차

1. Build 실행.
2. Chrome에서 Plus landing screenshot/DOM 확인.
3. 모바일 폭에서 horizontal overflow가 없는지 확인.
4. step 상태를 갱신한다.

## 금지사항

- section 전체를 또 카드 안에 넣지 마라. 이유: 사용자가 이미 카드형 구조가 남아 있다고 지적했다.
- Tailwind Plus의 유료/가격 UX를 복사하지 마라. 이유: 우리 Plus는 실전 예시 카탈로그라는 의미다.

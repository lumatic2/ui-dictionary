# Step 2: Confusing Term Data Depth

## 읽어야 할 파일

- `docs/ui-vocabulary/terms.yml` — 왜: related 비교와 anti-use 문장을 보강할 source of truth다.
- `docs/ui-vocabulary/sources.md` — 왜: 보강하는 source id가 등록되어 있는지 확인한다.
- `examples/ui-vocabulary-site/src/lib/term-ux.ts` — 왜: explicit relation fallback과 YAML `related` 중 어느 경계를 쓸지 결정한다.
- `scripts/validate-ui-vocabulary.py` — 왜: related data shape 검증을 추가할지 판단한다.

## 작업

헷갈리는 핵심 용어쌍을 우선 보강한다.

필수 비교 그룹:

- `select` / `combobox` / `dropdown-menu`
- `dialog` / `modal` 계열 / `drawer` / `side-sheet`
- `toast` / `snackbar` / `banner`
- `tabs` / `segmented-control` / `toggle-group`
- `checkbox` / `switch` / `radio-group`
- 가능하면 `menu` / `popover` / `tooltip`도 포함한다.

각 그룹에서 최소한 다음을 보강한다.

- `related` relation과 note.
- `anti_use`의 "이럴 땐 다른 용어" 문장.
- 필요한 경우 `prompt_phrases`에 더 구체적인 표현.

## Acceptance Criteria

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run build
```

## 검증 절차

1. AC 커맨드 실행.
2. 관련 용어 detail에서 비교 카드가 fallback이 아니라 명시 note 중심으로 보이는지 확인.
3. `phases/ui-vocabulary-term-detail-reference-depth/index.json`의 step 2를 completed로 갱신.

## 금지사항

- 미묘한 style variant를 새 term으로 추가하지 마라. 이유: 이번 step은 depth 보강이지 batch expansion이 아니다.
- 공식 출처와 다른 정의를 단정하지 마라. 이유: 비교 문장은 실무적 판단으로, canonical definition은 source를 따른다.

# Step 1: Origin UI Form/Input Batch

## 읽어야 할 파일

- `phases/external-ui-ecosystem-vocabulary/step0.md` — 왜: Step 0에서 확정한 source section과 중복 제외 목록을 이어받는다.
- `docs/ui-vocabulary/terms.yml` — 왜: form/input 후보를 승격하기 전에 기존 input/form-pattern 항목과 중복을 비교한다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: 새 항목은 fallback 없는 mini visual을 가져야 한다.
- `examples/ui-vocabulary-site/src/data/terms.generated.ts` — 왜: `build:data`가 갱신하는 generated output이다.

## 작업

Origin UI/coss ui에서 form, input, field composition, validation, inline action 계열 후보를 20개 내외로 추려 중복을 제외한 뒤 `terms.yml`에 승격한다.

각 승격 항목은 다음을 가져야 한다:

- source-backed note
- 기존 용어와의 중복/related 경계
- `asset.variant`
- `term-visual.tsx` 전용 renderer

## Acceptance Criteria

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run build:data && npm run build && npm run lint
cd ../..
node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates
```

## 검증 절차

1. AC 커맨드 실행
2. Chrome smoke로 새 form/input 항목 검색 및 visual 렌더 확인
3. step 1 상태 갱신

## 금지사항

- 이미 있는 `text-field`, `input-group`, `field-group`, `react-hook-form-pattern`과 같은 의미면 새 term을 만들지 않는다.
- 라이브러리 구현 API 이름만으로 term을 만들지 않는다. 사용자에게 설명 가능한 UI 개념이어야 한다.

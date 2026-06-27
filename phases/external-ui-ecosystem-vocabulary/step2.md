# Step 2: Origin UI Navigation/Disclosure Batch

## 읽어야 할 파일

- `phases/external-ui-ecosystem-vocabulary/index.json` — 왜: Step 1 완료 summary와 현재 status를 확인한다.
- `docs/ui-vocabulary/terms.yml` — 왜: navigation/menu/disclosure 후보와 기존 navigation 계열 term을 비교한다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: 새 항목의 visual renderer를 추가한다.

## 작업

Origin UI/coss ui에서 navigation, menu, command, disclosure, overlay trigger 계열 후보를 20개 내외로 추려 승격한다.

특히 다음 기존 항목과의 경계를 명확히 한다:

- `dropdown-menu`
- `context-menu`
- `navigation-menu`
- `command-palette`
- `popover`
- `tooltip`
- `disclosure`

## Acceptance Criteria

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run build:data && npm run build && npm run lint
cd ../..
node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates
```

## 검증 절차

1. AC 커맨드 실행
2. Chrome smoke로 새 navigation/disclosure 항목 검색 및 visual 렌더 확인
3. step 2 상태 갱신

## 금지사항

- 단순 dropdown의 모양 변형을 별도 term으로 만들지 않는다.
- 접근 방식이 다른 컴포넌트는 `related`와 `anti_use`로 비교를 남긴다.

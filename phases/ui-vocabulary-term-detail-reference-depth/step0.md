# Step 0: Source Registry And Generated Types

## 읽어야 할 파일

- `docs/ui-vocabulary/sources.md` — 왜: source id, label, tier, URL의 canonical registry가 여기 있다.
- `docs/ui-vocabulary/schema.md` — 왜: `sources` 필드 계약과 source id 규칙을 확인한다.
- `scripts/validate-ui-vocabulary.py` — 왜: unknown source id 검증을 유지하면서 registry 검증을 확장해야 한다.
- `scripts/build-ui-vocabulary-data.mjs` — 왜: React 앱이 쓸 typed source metadata를 생성할 위치다.
- `examples/ui-vocabulary-site/src/data/terms.generated.ts` — 왜: generated type shape와 import surface를 맞춰야 한다.

## 작업

Source metadata를 앱에서 직접 쓸 수 있게 생성 파이프라인을 확장한다.

- `sources.md`에서 source id, display label, URL, tier를 안정적으로 추출하거나, 필요하면 `docs/ui-vocabulary/source-registry.yml` 같은 명시 데이터 파일을 추가한다.
- `terms.generated.ts`에 `sourceRegistry` 또는 동등한 typed export를 추가한다.
- `VocabularyTerm.sources[].source_id`가 registry에 없는 경우 build와 validation 모두 실패하게 유지한다.
- Markdown 문서 표현이 조금 바뀌어도 source id 검증이 깨지지 않도록 추출 규칙을 좁고 명확하게 둔다.

## Acceptance Criteria

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run build:data
```

## 검증 절차

1. AC 커맨드 실행.
2. `terms.generated.ts`에 source registry type/export가 생성됐는지 확인.
3. `phases/ui-vocabulary-term-detail-reference-depth/index.json`의 step 0을 completed로 갱신.

## 금지사항

- 브라우저 런타임에서 외부 reference URL을 fetch하지 마라. 이유: 사전은 정적 배포여야 한다.
- source id 검증을 느슨하게 만들지 마라. 이유: 출처 오타를 배포 전에 잡아야 한다.

# Step 5: mobile-content-commerce-and-audit

## 작업

Batch 5 후보를 추가하고 전체 모바일 확장 audit를 수행한다. 기존 terms와의 중복은 삭제보다 related/alias/anti-use로 우선 정리한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

- feed/story/media/map/commerce/onboarding 후보가 추가된다.
- 검색 fixture 모바일 query가 expected top ids를 반환한다.
- duplicate/category audit 결과가 `docs/ui-vocabulary/`에 남는다.


# Step 1: mobile-app-shell-and-navigation

## 작업

Batch 1 후보를 `terms.yml`에 추가하고, 공통 phone-frame visual wrapper와 navigation/app-shell variants를 구현한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

- 새 app shell/navigation 용어가 검색된다.
- 모바일 viewport smoke에서 카드 grid와 detail panel이 가로 overflow 없이 보인다.
- 새 `asset.variant`가 fallback 없이 렌더링된다.


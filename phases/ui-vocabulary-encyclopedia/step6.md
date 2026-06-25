# Step 6: remaining-planned-candidates

## 읽어야 할 파일

- `docs/ui-vocabulary/component-expansion-plan.md` — 왜: 남은 기존 후보와 이미 승격된 후보를 구분한다.
- `docs/ui-vocabulary/terms.yml` — 왜: canonical dataset이며 id 중복을 피해야 한다.
- `docs/ui-vocabulary/sources.md` — 왜: source_id는 여기에 정의된 신뢰 출처만 사용한다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: 새 `asset.variant`마다 interactive mini visual을 추가한다.
- `examples/ui-vocabulary-site/src/lib/search.ts` — 왜: 새 category가 필요하면 label map을 갱신해야 한다.
- `phases/ui-vocabulary-encyclopedia/index.json` — 왜: step 상태를 전이 이벤트마다 기록한다.

## 작업

`component-expansion-plan.md`에 남아 있는 기존 후보를 먼저 `terms.yml`에 추가하고, 각 항목의 mini visual을 클릭/입력/선택/열기/닫기 등 관측 가능한 상호작용으로 구현한다. 기존 6개 카테고리로 분류하되 억지 분류가 보이면 step 12 audit에 기록한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. step 6을 `in_progress`로 바꾼다.
2. YAML 데이터 추가 후 `npm run build`로 schema와 TypeScript를 검증한다.
3. `npm run lint`를 실행한다.
4. 렌더 smoke에서 전체 count가 증가했는지 확인한다.
5. 성공하면 step 6을 `completed`로 갱신한다.

## 금지사항

- source_id를 임의로 만들지 않는다. 이유: `sources.md`가 신뢰 출처 목록이다.
- visual fallback에 의존하지 않는다. 이유: 이번 step의 핵심은 새 항목의 recognizable interactive visual이다.
- 기존 완료 step summary를 삭제하지 않는다.


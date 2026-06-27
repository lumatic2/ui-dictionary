# UI Vocabulary Visual Quality Workflow

UI Dictionary의 각 카드는 용어를 몰라도 생김새를 보고 이해할 수 있어야 한다. 따라서 `asset.variant`는 단순 placeholder가 아니라 용어의 고유 구조, 상태, 사용 맥락을 드러내는 미니 visual이어야 한다.

## Goal

모든 기존 카드와 새로 추가되는 카드가 다음 기준을 통과하게 한다.

- 카드만 봐도 용어의 종류를 구분할 수 있다.
- 같은 renderer를 공유하더라도 의도적으로 같은 시각 구조일 때만 공유한다.
- page/block/form-pattern은 generic skeleton 대신 도메인 라벨과 대표 sub-section을 보여준다.
- visual-effect/motion-pattern/visual-treatment는 이름만 적힌 카드가 아니라 효과 자체를 보여준다.
- detail drawer에서도 같은 visual이 커져도 어색하지 않다.

## Audit Command

```bash
cd examples/ui-vocabulary-site
npm run audit:visuals
```

엄격 모드:

```bash
node ../../scripts/audit-ui-vocabulary-visuals.mjs --strict
```

감사 결과는 세 부류를 본다.

- `fallback variants`: `term-visual.tsx`에 명시 renderer가 없어 `FallbackVisual`로 떨어질 가능성이 있는 variant.
- `generic renderer variants`: renderer는 있지만 서로 다른 용어가 같은 generic mock으로 보이는 variant.
- `shared variants`: 여러 용어가 같은 `asset.variant`를 쓰는 경우. 의도한 공유인지 확인한다.

## Review Loop

1. `npm run audit:visuals`로 후보를 뽑는다.
2. `fallback variants`가 있으면 우선 새 renderer를 추가한다.
3. `generic renderer variants`는 10개 내외 batch로 고른다.
4. 각 variant에 대해 `visual_anatomy`의 visible parts가 실제 mini mock에 보이는지 확인한다.
5. page/block/form-pattern은 실제 화면 단위의 구성을 넣는다.
6. effect/motion/treatment는 라벨보다 효과 자체를 우선한다.
7. `npm run build`, `npm run lint`, Chrome smoke를 통과한다.
8. 개선한 batch를 커밋하고 다음 batch로 넘어간다.

## Visual Acceptance Criteria

각 visual은 아래 중 최소 3개 이상을 만족해야 한다.

- 용어의 핵심 구조가 보인다.
- 대표 상태가 보인다.
- 다른 유사 용어와 구별되는 부분이 보인다.
- 사용 맥락이 보인다.
- card size와 detail size 모두에서 읽힌다.
- 클릭 가능한 visual이면 눈에 보이는 상태 변화가 있다.

## New Term Gate

새 용어를 `terms.yml`로 승격할 때는 기존 authoring workflow에 더해 아래를 확인한다.

- `asset.variant`가 `FallbackVisual`로 떨어지지 않는다.
- 같은 variant를 재사용한다면 `visual_anatomy`가 기존 용어와 사실상 같은지 확인한다.
- 새 renderer가 필요한 경우 `term-visual.tsx`에 variant 분기를 추가한다.
- `npm run audit:visuals` 결과에서 새 항목이 `fallback variants`나 부적절한 `generic renderer variants`에 들어가지 않는다.

## Changelog

- 2026-06-28: Initial visual quality loop and audit command.

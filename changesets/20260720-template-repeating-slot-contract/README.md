# changeset: 반복 유닛 계약

- Date: 2026-07-20
- Plan: TH2 step 1 (`plans/2026-07-20-th2-blueprint-archetypes.md`)

청사진이 "같은 구조의 유닛 N개"를 표현할 수 있게 타입·컴파일러 계약을 확장했다.

## 왜 필요했나

리서치(`research/2026-07-20-...-format-layout-taxonomy.md`)가 도출한 인포그래픽의 결정 축은 **단일 초점 vs 다중 병렬 반복 유닛**이다. 그런데 기존 계약으로는 두 번째를 표현할 수 없었다:

- `TemplateBlueprint.slots`는 평평한 고정 목록 — 유닛 개수가 데이터에 따라 변할 수 없다.
- `TemplateRequest.content`는 `Record<string, string>` — 배열을 담지 못한다.

즉 좌표를 아무리 조정해도 다중 병렬 아키타입은 만들 수 없었다. 이 계약이 그 구조 차이를 표현한다.

## 무엇을 바꿨나

- **`TemplateRepeatGroup`** 신설 — `listKey`·`bounds`·`axis`·`gap`·`minUnits`/`maxUnits`·`unitSlots`(유닛 로컬 좌표).
- **`TemplateRequest.lists?`** — `Record<string, Array<Record<string, string>>>`. 목록 데이터의 자리.
- **`TemplateBlueprint.gridColumns`** — 그리드 열 수. 같은 포맷의 두 청사진을 가르는 구조 축 중 하나로, step 2의 구별 검증이 이 값을 읽는다.
- **컴파일러 반복 확장** — 목록 길이만큼 유닛을 만들고 유닛 로컬 좌표를 절대 좌표로 옮긴다. 유닛 크기는 `(span - gap*(n-1)) / n`.
- **오류 코드 3종 추가** — `REPEAT_LIST_MISSING`, `REPEAT_COUNT_OUT_OF_RANGE`, `REPEAT_FIELD_MISSING`.

## Verification

- [x] `npm --prefix packages/template-core test` — **21 tests PASS** (기존 14 + 신규 7)
- [x] `npm --prefix packages/template-core run build` — tsc PASS
- [x] **서명 불변** — TH1 기준선 3종 그대로 통과. `gridColumns`는 blueprint 필드라 project 서명(request·assets·scene)에 들어가지 않는다 — 의도한 설계.
- [x] **실패 경로 3종** (happy path만 확인하지 않음)
  - 목록 누락 → `REPEAT_LIST_MISSING`
  - 유닛 1개(min 2 미만) / 5개(max 4 초과) → `REPEAT_COUNT_OUT_OF_RANGE`
  - 유닛 항목이 공백 문자열 → `REPEAT_FIELD_MISSING`
- [x] **배치 검증** — 유닛 3개가 축을 따라 겹치지 않고 정확히 `unitSpan + gap = 347px` 간격으로 배치됨을 수치로 확인. root `childIds`에 중복 없이 등록됨.

## finding 큐

- 유닛 텍스트도 `fontSize = max(18, round(height*0.45))` 휴리스틱을 그대로 쓴다 — TH1이 적발한 인포그래픽 오버플로와 같은 뿌리다. TH3 토큰 기반 조판에서 함께 고친다.

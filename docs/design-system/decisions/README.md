# Decisions — 군집 인덱스

> 계약: `docs/design-system/decision-format.md` · 검증: `python scripts/validate-decisions.py`
> 이 폴더는 **후보들 사이를 가르는 축**을 담는다. 용어 사전은 각 용어의 자기 시점 경계만 갖기 때문에, 아무리 모아도 "그럼 A인가 B인가"는 답해지지 않는다.

## 어떻게 쓰나

1. 요구가 요소를 특정하지 않으면 이 인덱스에서 해당 군집을 찾는다.
2. 그 군집 파일의 `axes` 질문에 답한다 — 답할 수 없는 축이 있으면 **사용자에게 그 질문을 그대로 되묻는다.**
3. `rules`를 위에서 아래로 평가해 첫 일치가 답이다. 아무것도 안 맞으면 `default`.
4. 고른 근거(갈린 축과 값)와 기각한 대안을 보고에 남긴다.

**규칙 순서 자체가 판정이다.** 표면·형태를 정하는 축이 양을 재는 축보다 먼저 온다.

## 군집

| 군집 | 후보 | 담은 임계값 |
|---|---|---|
| [펼침류](disclosure-family.md) | accordion · tabs · disclosure · disclosure-card · stepper · drawer | 개수 × 분량, 동시 열람, 순서 강제, 맥락 유지 |
| [오버레이 표면](overlay-surfaces.md) | dialog · drawer · side-sheet · modal-bottom-sheet · full-screen-dialog | **분량이 표면을 바꾼다** — 스크롤이 필요하면 dialog 가 아니다 |
| [단일 선택 입력](single-choice-input.md) | radio-group · select · segmented-control · switch · combobox | **공간이 개수보다 먼저 걸린다** — 자리가 있으면 전부 노출 |
| [기다림과 비어 있음](waiting-and-absence.md) | skeleton · spinner · progress-bar · empty-state | **범위가 형태를 바꾼다** — 조각 하나면 스피너 |
| [내비게이션 범위](navigation-scope.md) | breadcrumb · sidebar-nav · navigation-drawer · tabs · anchor-nav | 범위가 먼저 — 화면 안 이동과 제품 전체 이동은 다른 문제 |
| [카드형 펼침](card-vs-list-expand.md) | disclosure-card · accordion · card · expandable-row | 항목이 제각각이면 경계가 필요하다 |

## 만들지 않은 군집과 그 사유

판별 파일이 없다는 것은 빠뜨렸다는 뜻이 아니다. 두 가지 이유로 **의도적으로 만들지 않았다.**

### ① 이미 맞히는 군집 (8개)

VL1 기준선 측정(`evidence/vocabulary-in-use/vl1-baseline.md`)에서 현행 자산만 쥔 에이전트가 **만점**을 받은 군집이다. 판별 축을 달아도 향상이 없고 유지 비용만 는다.

펼침류(별도 이유로 작성) · 온오프 입력 · 목록 표시 · 더 불러오기 · 찾기 · 알림 · 긴 폼 · 모바일 뷰 전환

> 다른 상황에서는 틀릴 수 있다. 그때는 케이스를 추가해 기준선을 다시 재고, 실제로 틀리면 그때 만든다 — 지금 지어서 채우지 않는다.

### ② 정답 라벨의 외부 원문을 확보하지 못한 군집

근거 없는 축은 통념의 배포처가 된다. 원문을 못 찾으면 만들지 않는다.

| 군집 | 상태 |
|---|---|
| 많은 선택지 (combobox / select / radio) | **흡수 완료** — 단일 선택 입력 군집의 `option-count: 20+`과 `option-set-known: open-ended`(Carbon 근거)가 덮는다. 별도 군집 불필요 |
| "더보기" 절단 펼침 | **확인 실패** — "이 상황이면 절단 후 더보기를 쓰라"는 조건부 긍정 서술을 신뢰할 만한 출처에서 못 찾았다. 검색 엔진 AI 요약이 NN/G 발로 제시한 문장은 실제 페이지에서 확인되지 않아 인용하지 않았다. 상세: `card-vs-list-expand.md` |

내비게이션 범위와 카드형 펼침은 VL5에서 **긍정 라벨을 확보해 만들었다**(NN/G Flat vs. Deep Hierarchy, Material 3 Navigation drawer, NN/G Cards). 다만 두 군집 모두 VL1 케이스 세트에 없었으므로 **기준선이 없다** — VL7 향상 폭 대조에서 제외된다.

## 검증

```
python scripts/validate-decisions.py
```

필수 필드 · candidates가 `terms.yml` 실존 · 축의 출처와 confidence · 규칙 정합 · 기본값 · **교차 군집 모순**을 검사한다.

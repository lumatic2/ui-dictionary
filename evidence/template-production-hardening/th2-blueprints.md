# TH2 — 청사진 6종 실재화 (증거)

- 완료: 2026-07-20
- Plan: `plans/2026-07-20-th2-blueprint-archetypes.md`
- Changesets: `20260720-template-repeating-slot-contract`, `20260720-template-six-blueprints`, `20260720-template-print-spec-validation`
- 리서치 입력: `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md`

## DoD 대조

| DoD 항목 | 선언 | 실측 | 판정 |
|---|---|---|---|
| 6개 청사진 명시 선언 | 파생 생성기 없이 | `formatPackCatalog` 6개, `-split` 0개, id 중복 0 | PASS |
| 구조적 구별 기계 검증 | 슬롯 개수 또는 그리드 열 수가 다름 | 세 포맷 전부 통과, 좌표 clone은 FAIL 확인 | PASS |
| 인쇄 규격·안전영역 명시 거부 | 위반 시 exit≠0 | `x=30` probe에서 `SAFE_AREA_VIOLATION`, exit 1 | PASS |

## 6청사진 구조 실측 (verify manifest)

```
business-card-minimal        cols=3 slots=5 rep=0  spec=us-business-card-3.5x2
business-card-vertical       cols=2 slots=5 rep=0  spec=kr-business-card-90x50
product-poster-hero          cols=1 slots=5 rep=0  spec=null
product-poster-editorial     cols=2 slots=6 rep=0  spec=null
infographic-stats            cols=1 slots=5 rep=0  spec=null
infographic-comparison       cols=3 slots=3 rep=1  spec=null
```

포맷별 구별 축이 수치로 드러난다 — 명함은 열 3↔2, 포스터는 열 1↔2 및 슬롯 5↔6, 인포그래픽은 열 1↔3 및 반복 그룹 0↔1.

## 실패 경로 확인 (optimistic-path 금지)

이 milestone은 실패 경로를 **6종** 확인했다.

| # | 무엇을 훼손했나 | 결과 |
|---|---|---|
| 1 | 반복 목록 누락 | `REPEAT_LIST_MISSING` |
| 2 | 유닛 1개(min 2 미만) | `REPEAT_COUNT_OUT_OF_RANGE` |
| 3 | 유닛 5개(max 4 초과) | `REPEAT_COUNT_OUT_OF_RANGE` |
| 4 | 유닛 필수 항목 공백 | `REPEAT_FIELD_MISSING` |
| 5 | 카탈로그에 좌표만 옮긴 clone 투입 | 구별 테스트 FAIL — "슬롯 5/5, 열 3/3" |
| 6 | 필수 슬롯을 규격 안전영역 안쪽으로(x=30) | verify exit 1, `SAFE_AREA_VIOLATION` |

**#5가 프리모템 2의 예방 장치다.** "청사진 B안이 또 좌표 변형으로 퇴화한다"는 시나리오를 실제로 재현했더니 게이트가 막았다.

**#6은 두 번 시도했다.** 첫 probe(`x=12`)는 구 24px 일반 검사가 먼저 잡아 새 규격 게이트를 특정하지 못했다. 24px는 통과하고 36px만 위반하는 `x=30`으로 다시 해야 새 게이트의 단독 작동이 증명됐다 — probe를 느슨하게 잡으면 검증한 척만 하게 된다.

## 적발 사항

### 가로 명함은 한국 규격이 아니다

`business-card-minimal`의 비율은 1.750으로, 한국 두 표준(1.800 / 1.545) 어느 쪽도 아닌 **미국 3.5×2in**이다. 허용 오차를 늘려 한국 규격에 맞추는 대신 미국 프리셋을 추가해 정직하게 대응시켰다.

### 비교형 인포그래픽이 안 쓰는 필드를 요구받고 있었다

`validateFormatIntegrity`가 인포그래픽이면 무조건 `stat`/`unit`을 요구해, `stat` 슬롯이 없는 비교형도 그 필드를 채워야 통과했다. 장면에 `stat` 슬롯이 있을 때만 요구하도록 청사진 인지형으로 교정했다. 출처(`source`)는 구조와 무관하게 계속 필수다.

## 서명 관련 주의

`e2e-manifest.json`의 서명이 TH1 시점과 다르다. 원인은 의도된 변경 둘이다 — request id가 `e2e-<format>`에서 `e2e-<blueprintId>`로 바뀌었고(한 포맷에 청사진이 2개라 format 기준 id가 충돌), request에 `lists`가 추가됐다.

**TH1 불변식은 `signature-lock.test.ts`가 계속 지킨다.** 그 테스트는 고정된 자체 request를 쓰므로 verify 스크립트 변경에 영향받지 않고, 기준선 3종(`tpl-a5add834`/`tpl-e523954b`/`tpl-f864dd3b`)을 그대로 통과한다. drift가 아니다.

## 크기 회고

changeset 3개(선언 `changesets>=3`) — 라벨 정합. 테스트 14 → 41개.

# 통설은 근거 등급을 달고 옵트인으로 들어온다

> 2026-07-22 · milestone DOG5 step-2 · changeset #262

## 왜

슬라이드에서 가장 널리 통용되는 세 규칙이 전부 1차 실증이 없다.

| 규칙 | 실제 출처 | 등급 |
|---|---|---|
| 안전영역 90/93% | **TV 방송 표준**(SMPTE ST 2046-1:2009). 슬라이드 전용 1차 출처 없음 | `inferred` |
| 본문 24pt 하한 | Guy Kawasaki 10/20/30 규칙 — 저자는 특정되나 "왜 30인가"의 실증 없음 | `folklore` |
| 6×6 | 창안자·1차 연구 특정 실패. 방향성만 인지부하 이론이 지지 | `folklore` |

인쇄물 안전영역(3mm)조차 "재단 오차라는 **같은 물리 현상**의 유추"라는 연결고리가 있는데, 슬라이드 안전영역은 그 고리마저 약하다 — 원출처가 TV다.

## 무엇을

`checkSlideHeuristics(regions, options)` — **기본값 꺼짐**, 켜도 `severity: 'warning'`만 반환하고 예외를 던지지 않는다.

모든 violation이 `evidenceGrade`와 `basis`(출처와 그 한계)를 **값으로** 들고 다닌다. 문서 각주가 아니라 데이터다 — 문서는 안 읽히지만 반환값은 읽힌다.

## 왜 기본을 껐나

근거 없는 임계값을 항상 켜두면 성가셔서 무시당한다. 그리고 **무시가 습관이 되면 근거 있는 검사(대비·비율)까지 함께 무시당한다.** 통설 하나를 켜자고 확정 사실의 신뢰도를 깎는 거래다.

horizon 결정 3("차단이 아니라 경고로 시작")보다 한 단계 더 보수적이다 — 그건 "차단이냐 경고냐"의 축이고, 이건 "항상 켜진 경고냐 옵트인 경고냐"라는 별개 축이다. 사용자가 뒤집고 싶으면 `enable` 기본값 한 줄이다. 설계가 그 전환을 위해 갈라져 있다.

## 두 함수를 합치지 않은 이유

`validateSlideDeclaration`(확정 사실)과 이 함수를 하나로 만들면, **통설이 확정 사실인 척 슬며시 켜진다.** 리서치가 지목한 이 계약의 가장 큰 위험이 정확히 그것이다. 타입도 갈라 뒀다 — `SlideHeuristicViolation.evidenceGrade`는 `Exclude<EvidenceGrade, 'confirmed'>`라서 이 경로로는 `confirmed`를 낼 수 없다.

## Failure probe

| probe | 조작 | 결과 |
|---|---|---|
| C | `enable` 분기 제거(항상 실행) | **1건 실패** — "기본값에서는 아무것도 보고하지 않는다" |
| D | 모든 `evidenceGrade`를 `confirmed`로 위조 | **2건 실패** — "확정 사실인 척 나가지 않는다" + 등급 구분 |

D가 이 step의 존재 이유를 정확히 지킨다.

## 사고 기록

probe 원복에 `git checkout <file>`을 써서 **아직 커밋되지 않은 step-2 구현을 통째로 날렸다**(HEAD가 step-1이었다). 재작성으로 복구했고 결과는 동일하다. 미커밋 상태에서 probe를 되돌릴 때 `git checkout`은 되돌리기가 아니라 삭제다.

## Contract

- source of truth: `research/2026-07-22-design-output-gates-slide-spec.md` §2·§3·§4
- 호출부 없음 — DOG6이 마무리 절차에서 부를지 정한다
- out of scope: 문서·등재(step-3)

## 검증

- [x] `slide-spec.test.ts` 17 tests PASS (11 → +6)
- [x] `packages/template-core` 214 tests PASS
- [x] `tsc --noEmit` exit 0 · 루트 `npm run verify` exit 0
- [x] Failure probe C·D 실행 후 원복

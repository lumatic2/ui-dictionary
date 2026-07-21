# changeset: VL4 step-1 — 판별 데이터 계약

- Date: 2026-07-21 · Plan: VL4 step-1

`docs/design-system/decision-format.md` 신설. 군집 판별 파일의 정본 계약(frontmatter 스키마·축/규칙 레코드·본문 구조).

## 두 가지를 못 박았다

**① 군집은 분류가 아니다.** surface/pattern_group/group은 분류 체계지만 군집은 **실제로 오판이 나는 후보들의 묶음**이다. 한 군집의 후보가 서로 다른 category에 흩어져 있는 게 정상이다(펼침류: accordion=data-display, tabs=selection, drawer=structure). 그래서 별도 네임스페이스를 쓴다.

**② 모델이 이미 아는 구분은 적지 않는다.** VL1 기준선 84.4%·8군집 만점이 근거다. 틀린 3건은 전부 임계값 규칙이었다. 축의 값어치는 "어떤 요소가 있는지"가 아니라 "어디서 갈리는지"에 있다.

## 검증

- 필수 필드·축 레코드·규칙 레코드가 전부 정의됨
- `pattern-taxonomy.md` 용어와 충돌하는 신조어 0 (군집을 별도 네임스페이스로 분리)
- 펼침류 후보 6종을 계약대로 표현 가능함을 step-3에서 실증

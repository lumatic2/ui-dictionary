# changeset: VL6 step-3 — 자산 분기 + 결정 기록 형식

- Date: 2026-07-21 · Plan: VL6 step-3

N-3 자산 획득 분기(코드 자산 > 레시피 > 폴백) + `요소 결정` 보고 블록을 프로토콜과 `decision-format.md` 양쪽에 규정.

## C 분기의 열린 끝을 메웠다

기존 C-1은 `Fetch the matching recipe if one exists`로 끝나 **"없으면"이 없었다**(VL1 실사 지적). 이제 없으면 `no-asset-fallback.md`로 흐른다.

## 보고 블록

```
요소 결정: <term id> (군집: <cluster id>)
- 갈린 축: <axis>=<value> → <왜 이 답인가>
- 기각: <대안> — <왜 아닌가>
- 자산: <code asset | recipe | 폴백>
```

요소가 지정된 작업은 `해당 없음 — 요소 지정됨`이 **정당한 값**이다(빈 칸과 다르다). 근거: 리서치가 확인한 실패 모드는 "결정 트리를 만들어도 눈에 안 보이면 안 쓴다".

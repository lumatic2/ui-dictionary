# changeset: SVG 여러 줄 출력 + 넘침 게이트

- Date: 2026-07-20
- Plan: TH9 step 3 (`plans/2026-07-20-th9-text-fitting.md`)

SVG가 여러 줄을 낸다. 그리고 넘침을 기계로 잡는 게이트를 세웠다 — **무의미한 게이트를 세울 뻔한 것을 probe가 잡았다.**

## 무엇을 바꿨나

- **SVG `<tspan>` 줄 출력** — `<text>`는 자동 줄바꿈이 없어 한 줄로 뻗는다. 화면과 **같은 `wrapLines` 함수**로 줄을 나눠 `tspan`으로 낸다. 문서에 줄 나눔을 저장하지 않는 계획 결정을 지킨다(편집 후 재계산과 어긋나지 않게).
- **`scripts/check-text-overflow.mjs` 신설** — 청사진 6 × 토큰 세트 2 × 내용 변주 4 = **48조합**을 훑는다.

## 게이트가 무의미할 뻔했다

처음 게이트는 **기본 문구만** 검사했다. 실제로 청사진 폭을 1000 → 240으로 좁혀 찔러봤더니 **통과했다** — 컴파일러가 좁아진 상자에 맞춰 글자를 줄이므로 넘칠 수가 없었다. 컴파일러 출력만 보는 게이트는 컴파일러와 동어반복이다.

그래서 **내용 변주**로 훑도록 다시 썼다. 각 조합은 둘 중 하나여야 한다 — 넘치지 않고 들어가거나, `TEXT_DOES_NOT_FIT`으로 **명시 거부**되거나. **잘린 채 통과하는 제3의 길은 없어야 한다.**

변주 4종: `default` / `long-korean`(긴 한국어 문장) / `long-latin`(긴 라틴·이메일) / `short`(한 글자).

## Verification

- [x] `node scripts/check-text-overflow.mjs` — **PASS (조합 48건 — 맞춤 46, 명시 거부 2, 잘림 0)**
- [x] `npm --prefix packages/template-core test` — 154 PASS
- [x] `node scripts/verify-template-production-system.mjs` — exit 0
- [x] `node scripts/check-line-length.mjs` — PASS
- [x] **SVG 12장 재생성 후 브라우저 육안 확인 — 잘림 0**

### Failure probe — 게이트가 실제로 막는가

`fitSlotText`를 예전 규칙(`height × 0.45` 고정)으로 되돌렸다.

```
text-overflow: FAIL — 잘린 채 통과한 텍스트 34건
  infographic-stats / long-latin / explanation:  font=189 높이+3270 (15줄)
  product-poster-editorial / long-korean / headline: font=126 높이+540 (5줄)
  business-card-minimal / long-latin / name:     font=41  높이+16  (2줄)
  ... (34건)
exit=1
```

**34건**이다. 예전 규칙이 기본 문구에서는 2건만 드러났지만 실제 내용 범위에서는 훨씬 광범위하게 깨져 있었다. 되돌린 뒤 PASS·154 tests 재확인.

### 산출물 육안 확인 (전후)

| 청사진 | 전 (TH7) | 후 |
|---|---|---|
| product-poster-editorial | 헤드라인 우측 잘림 | **2줄로 접힘**, 캔버스 안 |
| infographic-stats | 설명문 우측 잘림 | **3줄로 접힘**, 캔버스 안 |

증거: `evidence/template-production-hardening/th9/exports-after-fitting.png` (12장 대조 시트).

## finding 큐

- 게이트의 내용 변주 4종은 손으로 고른 것이다. 실제 의뢰 문구 분포와 다를 수 있다 — TH6 실사용 실연에서 나온 문구를 변주에 추가할 대상.
- HTML 내보내기는 브라우저가 알아서 줄바꿈하므로 SVG와 줄 수가 다를 수 있다. 현재 계약은 "둘 다 넘치지 않는다"까지이고 줄 수 일치는 보장하지 않는다.
- `tspan`의 `dy`는 `lineHeight`를 그대로 쓴다. 첫 줄 baseline 계산과 합쳐지면 여러 줄 블록이 슬롯 하단으로 밀릴 수 있다 — 세로 정렬 규약이 아직 없다.

# changeset: A계열 규격 프리셋 + 인쇄판 청사진

- Date: 2026-07-20
- Plan: TH11 step 2 (`plans/2026-07-20-th11-print-spec-mm.md`)
- 리서치: `research/2026-07-20-template-production-hardening-print-spec.md`

step-1이 "청사진이 자기 규격을 선언한다"를 세웠는데, 선언할 규격이 명함 3종뿐이었다. 포스터·인포그래픽에는 고를 수 있는 인쇄 규격이 아예 없어 `hasPrintSpecs`가 `business-card`만 `true`였다.

## 무엇을 바꿨나

- **A계열 프리셋 4종** — A4 210×297 · A3 297×420 · A2 420×594 · A1 594×841mm. 도련 3mm(명함과 공통, 리서치 4.2).
- **인쇄판 청사진 2종** — `product-poster-print-a3`(1169×1654), `infographic-print-a4`(827×1169). 논리 px는 A계열을 100dpi로 잡은 값이고 인쇄 시 300dpi로 환산된다.
- **소셜 청사진 보존** — `product-poster-hero`/`editorial`(1080×1350, 4:5)은 그대로 화면용이다. 4:5(0.800)와 A계열(0.707)은 비율이 달라 **같은 판을 두 매체가 공유할 수 없다.** 소셜 산출물도 실사용 대상이라 인쇄로 개조하지 않고 인쇄판을 따로 뒀다.
- **`postingMarginMm` 필드 분리** — 게시 여백 15mm(리서치 4.3)를 안전영역 3mm와 **다른 필드**로 둔다. 목적이 다르다: 안전영역은 재단 오차 대비, 게시 여백은 액자·클립에 가려지는 대비. 한 값으로 뭉개면 명함을 15mm로 조이거나 포스터를 3mm로 방치한다. 재단 검증에는 쓰지 않는다.
- **`hasPrintSpecs`가 카탈로그를 읽는다** — `format === 'business-card'` 상수는 이 변경으로 거짓말이 되므로 답을 데이터에서 가져온다.

## 인포그래픽의 규격 차용을 산문에서 코드로

인포그래픽에는 **고유 인쇄 규격이 없다**(리서치 5.1). 전에는 그 사실이 청사진의 `reason` 문자열에 산문으로만 있었다 — 기계가 검사할 수 없다. 이제 `infographic-print-a4`가 `printSpecId: 'iso-a4'`로 A계열 표를 직접 가리키고, 테스트가 그 동일성(`matchPrintSpec(print) === printSpecs['iso-a4']`)을 검사한다.

## 출처 없는 값은 유추라고 적었다

A계열 `safeAreaMm: 3`은 **유추다.** 포스터 전용 안전영역의 1차 출처를 찾지 못했다(리서치 4.4 "출처 확인 실패"). 명함의 "재단선 안쪽 3mm"가 재단 오차라는 같은 물리 현상에서 나오므로 그대로 옮겼고, 그 사실을 `aSeriesSpecs()` 주석에 남겼다. 발주 전 인쇄소 확인 대상이다.

## 구별 검증의 단위가 (포맷 → 포맷×매체)로 바뀌었다

`blueprint-distinctness`는 "같은 포맷의 두 청사진은 슬롯 개수 또는 그리드 열 수가 달라야 한다"를 강제한다. 인쇄판은 **새 아키타입이 아니라 같은 아키타입의 다른 지면**이라 그 계수에 넣으면 존재하지 않는 세 번째 아키타입을 지어내게 된다. 그래서 구별 요구를 같은 매체 안으로 좁히고, 대신 "포맷마다 인쇄판이 있다"를 새 요구로 추가했다. 좌표만 옮긴 변주를 막는 원래 게이트는 그대로 산다.

## 실측

```
A계열 300dpi: A3 3508×4961px · A4 2480×3508px   (297/25.4×300 = 3507.87)

product-poster-print-a3   print   iso-a3   1169×1654 논리 | 여백 12px(3mm)
infographic-print-a4      print   iso-a4    827×1169 논리 | 여백 12px(3mm)
product-poster-hero       screen  -         1080×1350 (4:5 소셜) | 여백 24px
```

내보내기 산출물이 18개 → **24개**(청사진 8 × 3포맷)로 늘었고 전부 파싱을 통과한다.

## Verification

- [x] `npm --prefix packages/template-core test` — **185 PASS** (172 + 신규 13)
- [x] `npm run verify` — 4단계 exit 0, 산출물 24개
- [x] `npm --prefix apps/agent-design test` — 98 PASS (무회귀)
- [x] 서명 기준선에 인쇄판 2종 추가(기존 3종 값 무변경 — 재기준선 아님)

### Failure probe

| 무엇을 훼손했나 | 결과 |
|---|---|
| A3 치수를 297×400으로(1:√2 이탈) | **4 failed** — `iso-a3: expected 1.3468 to be close to 1.4142`, `{width:3508,height:4724} to deeply equal {…,height:4961}`, 그리고 인쇄판 청사진이 `SPEC_RATIO_MISMATCH`로 거부됨 |
| 카탈로그에서 인포그래픽 인쇄판 제거 | **5 failed** — `infographic에 인쇄용 청사진이 없다: expected false to be true` |

첫 probe가 **네 곳에서** 잡힌 게 중요하다: 프리셋 데이터 자체, 300dpi 환산 결과, 그리고 그 규격을 선언한 청사진의 비율 검증. step-1의 `validateSpecDeclaration`이 새 프리셋에도 그대로 작동한다는 뜻이다.

## finding 큐

- 인쇄판이 화면판의 재배치라 슬롯 좌표가 손으로 옮긴 값이다 — A계열 비율에 맞춘 조판을 검증하는 건 눈이지 테스트가 아니다. step-3에서 렌더해 확인한다.
- `postingMarginMm`은 아직 아무 검증에도 쓰이지 않는다. 게시용 포스터 조판 규칙이 생길 때 소비처가 생긴다.
- A2·A1 프리셋은 정의만 있고 쓰는 청사진이 없다.

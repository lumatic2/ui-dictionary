# changeset: 절대 mm 계약

- Date: 2026-07-20
- Plan: TH11 step 1 (`plans/2026-07-20-th11-print-spec-mm.md`)
- 리서치: `research/2026-07-20-template-production-hardening-print-spec.md`

**방향이 뒤집혔다.** 그전에는 청사진 px가 정본이고 규격을 종횡비로 역추론했다. 이제 청사진이 자기 규격을 선언하고 px가 거기서 파생된다.

## 왜 — 종횡비 추론은 답을 낼 수 없는 질문이 있다

`business-card-vertical`(600×1050, 비율 0.5714)은 **두 규격 오차 안에 동시에 들어온다**:

| 규격 | 세로 비율 | 오차 |
|---|---|---|
| `kr-business-card-90x50` | 0.5556 | 0.0159 |
| `us-business-card-3.5x2` | 0.5714 | **0.0000** |

허용 오차 0.02 안에 둘 다다. 종횡비로는 **고를 수 없고**, 옛 코드는 객체 순서상 먼저 오는 걸 돌려줬다. 우연히 선언과 일치했을 뿐이다.

그래서 300dpi 인쇄 px를 계산할 방법이 없었다 — 90mm인지 88.9mm인지 코드가 모르니까.

## 무엇을 바꿨나

- **`BlueprintOutput` 선언** — 모든 청사진이 인쇄용(`printSpecId`)인지 화면용(`reason` + `safeMarginPx`)인지 **반드시** 말한다. 타입이 강제하므로 침묵할 수 없다.
- **`mmToPrintPx(mm, dpi)`** — 절대 환산의 유일한 출처. `mm / 25.4 × dpi` (리서치 6.2, 2개 출처 일치).
- **`printPixelSize` · `orientedTrim` · `mmPerLogicalPx` · `mmToLogicalPx`** — 논리 px ↔ mm ↔ 인쇄 px가 명시적 함수가 됐다. 세로 청사진은 규격 치수를 방향에 맞춰 뒤집는다.
- **`validateSpecDeclaration`** — 선언이 정본이 된 만큼 거짓 선언을 잡는다. 종횡비는 이제 규격을 **고르는** 근거가 아니라 선언을 **검증하는** 수단이다.
- **`catalog.ts`의 `SAFE_AREA_INSET = 24` 제거** — 포맷·규격 무관 단일 px 상수였다. 명함 안전영역(3mm)과 포스터 게시 여백(15mm)이 5배 차이인데 하나로는 둘 다 틀린다. 그리고 24가 어떤 mm 근거인지 코드에 없었다(리서치 8.1).

## 실측

```
mm→px 검증: 85mm = 1004 / 55mm = 650   (리서치 예시 1004×650 — 일치)

business-card-minimal    print   us-business-card-3.5x2   여백 38px | 300dpi 1050×600px (88.9×50.8mm)
business-card-vertical   print   kr-business-card-90x50   여백 36px | 300dpi  591×1063px (50×90mm)
product-poster-hero      screen  -                        여백 24px
infographic-stats        screen  -                        여백 24px
```

**안전 여백이 24px 고정에서 38/36px로 바뀌었다** — 규격 mm에서 나온 값이다. 화면용은 청사진이 선언한 24px를 그대로 쓴다.

`business-card-minimal`의 300dpi 크기가 논리 px와 정확히 같은 것(1050×600)은 우연이 아니다 — 88.9mm × 11.811px/mm = 1050px. 그 청사진은 처음부터 300dpi US 규격이었는데 코드가 그걸 몰랐다.

## Verification

- [x] `npm --prefix packages/template-core test` — **172 PASS** (162 + 신규 10)
- [x] `npm run verify` — 4단계 exit 0
- [x] `npm --prefix apps/agent-design test` — 98 PASS (무회귀)
- [x] mm→px가 리서치 검증 예시와 일치 (85×55mm → 1004×650px, A4 → 2480×3508px)

### Failure probe

| 무엇을 되돌렸나 | 결과 |
|---|---|
| 규격 판정을 종횡비 추론으로 | **1 failed** — `expected 'kr-business-card-90x50' to be 'us-business-card-3.5x2'` |
| 안전 여백을 24px 고정으로 | **1 failed** — `expected 24 to be 38` |
| 청사진에서 `output` 선언 제거 | **컴파일 거부** (TS2741: Property 'output' is missing) |

**첫 probe는 처음에 통과했다.** 기존 청사진이 우연히 전부 종횡비로도 맞아떨어졌기 때문이다 — 계약의 필요성을 증명하지 못하는 테스트였다. 같은 치수에 다른 규격을 선언하면 다른 인쇄 px가 나온다는 테스트를 추가하고 나서야 probe가 걸렸다. **TH9의 동어반복 교훈이 여기서도 반복됐다.**

## finding 큐

- `hasPrintSpecs`는 아직 `business-card`만 `true`다 — A계열 확장은 step-2.
- 인쇄 px와 논리 px가 다른 청사진(`business-card-vertical`: 600×1050 논리 / 591×1063 인쇄)의 렌더 스케일 규약은 아직 없다. step-3 내보내기에서 다룬다.
- `blueprintOf`가 노드 id 접두사(`<청사진 id>:`)로 청사진을 되찾는다 — 규약 의존이다. 못 찾으면 `BLUEPRINT_UNKNOWN`으로 실패하지 조용히 넘어가지 않는다.

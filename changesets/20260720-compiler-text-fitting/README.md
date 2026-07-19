# changeset: 컴파일러 텍스트 맞춤

- Date: 2026-07-20
- Plan: TH9 step 2 (`plans/2026-07-20-th9-text-fitting.md`)

`fontSize = 슬롯높이 × 0.45`를 없앴다. 이제 글자 크기가 **폭과 줄 수를 함께 보고** 정해진다.

## 무엇을 바꿨나

- **`fitSlotText` 신설** — 슬롯의 글자 크기·행간을 `fitText`로 정한다. 상한은 예전 규칙(`height × 0.45`)을 그대로 둬서 **짧은 텍스트는 지금 크기를 유지하고 긴 것만 줄어든다**.
- **`TemplateSlot.maxLines`** — 청사진이 허용 줄 수를 선언할 수 있다. 미선언이면 슬롯 높이가 허용하는 만큼.
- 반복 유닛 슬롯에도 같은 규칙을 적용했다.

## 넘침 해소 실측

| 청사진 / 슬롯 | 전 | 후 |
|---|---|---|
| product-poster-editorial / headline | 126px, 필요폭 1216 > 920 **잘림** | 108px, **2줄**, 넘침 0 |
| infographic-stats / explanation | 189px, 필요폭 4404 > 1000 **잘림** | 104px, **3줄**, 넘침 0 |
| business-card-minimal / name·role·contact | 41 / 22 / 20px | **동일** (짧아서 상한 유지) |

6청사진의 텍스트 노드 **24개 전부 넘침 0**이다.

## Verification

- [x] `npm --prefix packages/template-core test` — **154 PASS** (151 + 신규 3)
- [x] `npm --prefix apps/agent-design test` — 90 PASS (무회귀)
- [x] `node scripts/verify-template-production-system.mjs` — exit 0
- [x] `node scripts/check-line-length.mjs` — PASS

### Failure probe — 안 들어가는 텍스트가 잘린 채 통과하는가

명함의 연락처 슬롯(가로 640 × 세로 44)에 최소 크기로도 안 들어가는 긴 한국어 문장을 넣었다 → `TextFitError(TEXT_DOES_NOT_FIT)`. 잘린 채 컴파일되지 않는다.

긴 헤드라인 probe: 같은 청사진에서 헤드라인을 길게 주면 글자 크기가 **실제로 작아진다**(테스트가 부등식으로 단언).

### 회귀 방어

`6청사진 어디에도 넘치는 텍스트가 없다` 테스트가 24개 노드 전부를 `measureOverflow`로 검사한다. 청사진 좌표를 좁히거나 기본 문구를 늘리면 여기서 먼저 터진다.

## 서명 기준선 갱신 (2회차)

글자 크기가 바뀌었으므로 서명도 바뀐다. 레이아웃 좌표는 무변경.

```
business-card-minimal  tpl-bb88ad00 → tpl-767d040e
product-poster-hero    tpl-40154e67 → tpl-09040c7f
infographic-stats      tpl-c1cb1877 → tpl-5a75b937
```

`signatures.json`의 `rebaselines`에 두 번째 항목으로 근거를 남겼다. TH1의 서명 잠금이 이번에도 변경을 막아섰고, 근거를 적고 통과시켰다.

## finding 큐

- 명함 `name`이 41px 그대로인 것은 **상한을 예전 규칙으로 뒀기 때문**이다. 상한 자체가 타당한지(슬롯 높이의 45%가 적정 비율인지)는 검증한 적 없다 — 타이포 스케일 설계는 별도 주제(hallmark 이식 후보 2순위와 겹친다).
- `maxLines`를 선언한 청사진이 아직 없다. 헤드라인이 3줄로 접히는 것을 막고 싶으면 선언해야 한다.
- 줄 나눔 결과는 문서에 저장하지 않는다(계획 결정) — 렌더·내보내기가 각자 같은 함수로 다시 계산한다. step-3에서 SVG가 이 계산을 쓴다.

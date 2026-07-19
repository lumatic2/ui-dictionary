# changeset: 인쇄 규격·도련·안전영역 검증

- Date: 2026-07-20
- Plan: TH2 step 3 (`plans/2026-07-20-th2-blueprint-archetypes.md`)

명함 규격 프리셋과 도련(bleed)·안전영역(safe area) 규칙을 검증으로 인코딩하고, verify 게이트에 실제로 연결했다.

## 무엇을 바꿨나

- **`print-spec.ts`** 신설 — 규격 프리셋 3종, mm→논리 px 환산, 위반 검사.
- **verify 게이트 연결** — `validatePrintSpec` 위반 시 스크립트가 exit≠0. manifest에 `gridColumns`·`slotCount`·`repeatGroups`·`printSpec`을 실측값으로 기록해 구조 차이가 산출물에서 보이게 했다.

### 규격 프리셋

| id | 재단 | 비율 | 도련/안전영역 |
|---|---|---|---|
| `kr-business-card-90x50` | 90×50mm | 1.800 | 3mm |
| `kr-business-card-85x55` | 85×55mm | 1.545 | 3mm |
| `us-business-card-3.5x2` | 88.9×50.8mm | 1.750 | 3.175mm |

규격은 **방향 축과 직교**한다 — 가로/세로 어느 쪽이든 같은 규격을 쓸 수 있으므로 청사진을 늘리는 축으로 쓰지 않고 검증 규칙으로만 인코딩했다.

### 적발: 우리 가로 명함은 한국 규격이 아니었다

`business-card-minimal`은 1050×600, 비율 **1.750**이다. 한국 두 표준(1.800 / 1.545) 어느 쪽도 아니고 **미국 3.5×2in** 규격이다. 리서치가 그 규격도 기록했으므로 프리셋에 추가해 정직하게 대응시켰다 — 허용 오차를 늘려 한국 규격에 억지로 맞추지 않았다.

`business-card-vertical`(600×1050, 0.571)은 한국 90×50을 세운 것(0.556)에 대응된다.

## 검사 규칙

- **안전영역** — 필수 텍스트·이미지 슬롯은 인셋 안에 들어와야 한다(재단 오차로 잘림). 선택 슬롯은 대상 아님 — full-bleed 인물 밴드 같은 의도적 재단을 막지 않기 위해서다.
- **도련** — 캔버스의 90% 이상을 덮으려는 배경 도형은 재단선까지 완전히 덮어야 한다(안 그러면 흰 띠). accent rail 같은 부분 도형은 대상 아님.

## Verification

- [x] `npm --prefix packages/template-core test` — **41 tests PASS** (기존 31 + 신규 10)
- [x] `npm --prefix packages/template-core run build` — tsc PASS
- [x] `node scripts/verify-template-production-system.mjs` — exit 0, 6청사진 규격 검사 통과
- [x] `node scripts/check-line-length.mjs` — PASS

### Failure probe — 규격 게이트가 실제로 막는가

`business-card-vertical`의 `name` 슬롯을 안쪽으로 밀어 두 단계로 확인했다:

1. `x=12` → exit 1. 단 구 일반 검사(`SAFE_AREA` 24px)가 먼저 잡았다 — **규격 게이트를 특정하지 못한 probe**였다.
2. `x=30` → exit 1, `business-card-vertical: SAFE_AREA_VIOLATION`. 구 24px 검사는 통과하고 **90×50 규격의 36px 인셋만 위반**하는 값이라, 새 게이트가 단독으로 작동함이 확인됐다.

되돌린 뒤 exit 0 / 41 tests PASS.

## finding 큐

- 구 `catalog.ts`의 `SAFE_AREA_INSET = 24`(px 고정)와 새 규격 기반 인셋이 공존한다. 전자는 규격이 없는 포맷(포스터·인포그래픽)의 기본값 역할이라 남겼으나, 포스터·인포그래픽 규격 프리셋이 생기면 통합 대상이다.
- 포스터·인포그래픽은 아직 규격 프리셋이 없어 `matchPrintSpec`이 `null`을 낸다 — 인쇄 발주를 다루게 되면 추가한다.

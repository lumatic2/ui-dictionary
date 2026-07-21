# changeset: Codex imagegen 소재 공급자

- Date: 2026-07-20
- Plan: TH5 step 1 (`plans/2026-07-20-th5-codex-imagegen-provider.md`)

`codex exec`의 내장 `image_gen`으로 소재를 얻는 공급자. **API 키를 쓰지 않는다.**

## 계약 셋

1. **생성물이 정말 PNG인지 파일 헤더로 확인한다** — 요청한 치수를 믿지 않는다. PNG 시그니처 8바이트 + 첫 청크가 IHDR인지까지 본다. (출처: PNG Specification, W3C — https://www.w3.org/TR/png/ , 접근 2026-07-20)
2. **실제 치수를 기록한다** — Codex는 정확 치수를 보장하지 않는다(2026-07-20 실측: 정사각 요청에 1254×1254, 16의 배수도 아님). 요청 치수가 아니라 파일이 말하는 치수가 매니페스트에 들어간다.
3. **cover 잘림이 한도를 넘으면 거부한다** — 조용히 잘린 소재를 넘기지 않는다.

## 왜 종횡비 차이가 아니라 "잘림 비율"인가

종횡비 차이 0.2가 어느 정도 손해인지는 숫자만 봐서 설명이 안 된다. 반면 **"원본의 32%가 잘린다"**는 바로 판단된다. 그래서 임계를 잘림 면적 비율로 정의했다 — 한도는 **1/3**이고, 근거는 관례가 아니라 "원본의 3분의 1 이상이 사라지면 그 이미지를 쓴 것이라 보기 어렵다(피사체가 프레임 밖으로 나가고 생성 프롬프트의 의도가 남지 않는다)"는 판단이다. 규칙이 설명 가능해야 사후 조정도 근거를 갖는다.

리사이즈 라이브러리는 들이지 않았다. 렌더는 기존 `node.fit`(objectFit cover)이 그대로 수행하고, 공급자는 **받아들일지 거부할지만** 정한다.

## 실행기를 주입 가능하게 둔 이유

계약 검증이 라이브 호출에 의존하면 재현이 불가능해진다. horizon 프리모템 4번("imagegen 비결정성이 E2E를 흔들었다")의 예방 장치 — 계약 테스트는 조립한 고정 바이트로 돌고, 라이브 호출은 step-2에서 분리해 1회만 한다.

## Verification

- [x] `npm --prefix packages/template-image-provider-codex test` — **15 PASS**
- [x] `npm --prefix packages/template-image-provider-codex run build` — tsc exit 0
- [x] `packages/template-image-provider-openai/RETIRED.md` 추가 (제거는 step-3)

### Failure probe

| 무엇을 훼손했나 | 결과 |
|---|---|
| 잘림 한도 검사를 `if (false)`로 무력화 | **1 failed** (`CROP_LOSS_TOO_LARGE` 미발생) |
| 실제 치수 대신 **요청 치수**를 기록하도록 되돌림 | **1 failed** (1254×1003 기대에 1000×800) |

둘 다 되돌린 뒤 15 PASS 재확인. 두 번째 probe가 중요한 이유: 요청 치수를 기록하는 건 **구 OpenAI 어댑터가 하던 짓**이고, 그래서 실제와 다른 값이 매니페스트에 박혔다.

계약 테스트가 커버하는 거부 경로 4종: 파일 없음(`IMAGE_NOT_READABLE`) · 이미지 아님(`NOT_A_PNG`) · 잘림 초과(`CROP_LOSS_TOO_LARGE`) · 실행 실패(`CODEX_RUN_FAILED`).

## finding 큐

- `spawnCodexRunner`는 아직 라이브에서 돌려본 적 없다 — step-2가 그 증명이다.
- 생성물 URI를 파일 경로로 둔다(data URI 아님). 큰 PNG를 base64로 문서에 싣지 않기 위해서인데, 그러면 문서가 파일 시스템에 의존한다 — 왕복·배포 시 경로 규약이 필요하다.
- PNG만 받는다. Codex가 webp·jpeg를 낼 수 있는지는 미확인.

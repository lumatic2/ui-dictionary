# 인쇄 계약을 문서로 승격 — 손으로 옮기지 않고 생성한다

> 2026-07-22 · milestone DOG4 step-1 · changeset #258

## 왜

인쇄 규격 계약은 `packages/template-core/src/print-spec.ts`에 **이미 실재했다** — 명함 3규격, ISO A계열 4규격, 도련·안전영역·게시 여백·300dpi 환산까지.

그런데 에이전트가 실제로 fetch하는 경로(`docs/design-system/` → `llms.txt`) **밖에** 있었다. 직전 horizon의 VL2와 같은 구조다: 용어 562개가 사전 파일에는 있었지만 llms.txt 밖에 있었다. 갭의 정체는 "지식이 없다"가 아니라 **"지식이 에이전트 경로 밖에 있다"**이다.

## 무엇을

`docs/design-system/print-spec.md`를 신설한다. 단 **손으로 쓴 사본이 아니다.**

`scripts/generate-print-spec-doc.mjs`가 컴파일된 `packages/template-core/dist/index.js`를 import해 `printSpecs`·`PRINT_DPI`·`MM_PER_INCH`·`mmToPrintPx()`에서 값을 직접 뽑는다. 표의 300dpi 픽셀 열도 문서가 계산하지 않고 정본 함수를 부른다.

**사본이면 코드가 바뀐 뒤에도 문서는 옛 숫자를 말한다. 그리고 에이전트가 읽는 것은 문서다.**

문서가 옮기는 것 중 값이 아닌 것 둘 — 둘 다 **근거의 한계**라서 옮겼다:

- A계열 안전영역 3mm는 **유추다**. 포스터 전용 수치의 1차 출처를 못 찾았고, 명함의 재단 오차 원칙을 그대로 옮긴 것이다. 발주 전 인쇄소 확인 대상.
- 재단 표시 선 길이는 **출처가 없다**. 도련 폭을 기준으로 삼았을 뿐이다.

근거 없는 수치를 근거 있는 것처럼 문서에 실으면, 그걸 읽은 에이전트가 인쇄 발주를 낸다.

## 드리프트 방지

`--check`가 재생성 결과와 커밋본을 대조해 다르면 exit 1. CRLF 체크아웃에서도 오작동하지 않게 줄끝만 정규화해 비교한다.

## Failure probe

| 조작 | 결과 |
|---|---|
| `bleedMm: 3` → `5` 후 재빌드 | `--check` **exit 1** (`DRIFT:` 메시지) |
| 원복 후 재빌드 | `--check` **exit 0** |

왕복이 성립해야 "생성물"이 증명된다 — 실패만 보면 검사기가 항상 실패하는 경우와 구분되지 않는다.

## 바로잡은 것

plan의 Verify 커맨드 `npm run build --workspace packages/template-core`는 **이 레포에서 동작하지 않는다.** 루트 `package.json`이 workspaces를 선언하지 않는다(의도적 — "하위 packages는 각자 package.json을 유지한다"). `npm --prefix packages/template-core run build`로 대체했다.

## Contract

- source of truth: `packages/template-core/src/print-spec.ts` (불변 — 이 changeset은 코드 값을 바꾸지 않는다)
- 생성물: `docs/design-system/print-spec.md` — 손으로 고치지 않는다
- deploy/sync target: 아직 없음 — `llms.txt` 등재는 step-3
- out of scope: 매체 분류 축(step-2), 등재·배포 검증(step-3), 인쇄 파이프라인 기능

## 검증

- [x] `npm --prefix packages/template-core run build` 성공 후 생성 — 7 specs
- [x] `--check` exit 0
- [x] 표에 `printSpecs` 실제 키 7개 전부 등장, 값이 소스 리터럴과 일치
- [x] 환산 예시 85mm → 1004px — 리서치 검증 예시(85×55mm → 1004×650px)와 일치
- [x] Failure probe 왕복 (exit 1 → 원복 → exit 0)

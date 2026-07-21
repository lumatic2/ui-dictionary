# TH4 — 검증 실체화 (증거)

- 완료: 2026-07-20
- Plan: `plans/2026-07-20-th4-verification-materialization.md`
- Changesets: `20260720-export-artifact-parsing`, `20260720-export-input-derived-assertions`, `20260720-verify-manifest-materialization`

## DoD 대조

| DoD 항목 | 선언 | 실측 | 판정 |
|---|---|---|---|
| exporter 실제 실행 + 18개 산출물 파싱 검사 | 6청사진 × 3형식 | 18개 생성·파싱 PASS, 바이트·해시 기록 | PASS |
| 훼손 3종 각각 exit≠0 | 색·내용·자산 | SVG·HTML 각각 6건 검출 (+형식 4건) | PASS |
| probe 무력화 시 전체 실패 | 자기검사 상주 | probe 무력화 → exit 1 실측 | PASS |
| 매니페스트에 손으로 적은 선언 필드 없음 | — | `exports`·`negativePaths` 둘 다 실행 결과 | PASS |

## 게이트가 실제로 잡은 결함

**`exportHtml`이 글꼴 스택을 이스케이프하지 않았다.**

값이 `Georgia, "Noto Serif KR", serif`인데 `style="..."`에 날것으로 들어가, 따옴표에서 **속성이 그 자리에서 끊겼다.** 파서는 style을 앞부분만 읽는다 — 글꼴·크기·굵기·행간이 통째로 사라진다. 즉 **HTML 내보내기의 타이포그래피가 전부 무효**였다.

- SVG는 `esc()`를 거치고 있었다. HTML만 빠져 있었다.
- 테스트 155개가 통과한 상태였다. TH7의 육안 확인도 못 잡았다 — 브라우저가 깨진 속성을 조용히 무시하기 때문이다.
- 이 결함은 **파서로 읽었기 때문에** 드러났다. 정규식으로 문자열을 훑었다면 `font-family:Georgia`가 있으니 통과시켰을 것이다.

## 무엇이 선언이었고 무엇이 측정이 됐나

| 필드 | 전 | 후 |
|---|---|---|
| `exports` | `['json','html','svg']` 문자열 | 형식별 바이트 수 + sha256 (18건) |
| `negativePaths` | 6종 문자열 목록 | 5종 실행 결과 + 실제 에러 코드 |

**6종이 5종으로 줄었다.** `provider-invalid-mime-size`는 **구현이 존재하지 않았다** — `LocalFallbackProvider`는 mime·크기를 검사하지 않고 요청을 그대로 되돌려준다. 선언만 있고 코드가 없는 경로를 목록에서 지웠다. 숫자가 준 것이 후퇴가 아니라, 없는 것을 있다고 적던 상태의 해소다.

## 실패 경로 확인

| # | 무엇을 훼손했나 | 결과 |
|---|---|---|
| 1 | SVG를 400자에서 자름 / `</svg>` 삭제 | well-formed 실패로 거부 |
| 2 | HTML `<div>` 하나 삭제 / JSON 마지막 문자 삭제 | 구조·파싱 실패로 거부 |
| 3 | 토큰 색 hex를 `#ff00ff`로 치환 (SVG·HTML) | 검출 |
| 4 | 요청 문자열 삭제 (SVG·HTML) | 검출 |
| 5 | 자산 URI 삭제 (SVG·HTML) | 검출 |
| 6 | `invalid-token` probe를 no-op으로 무력화 | verify **exit 1** |
| 7 | 넘침 게이트를 항상 실패시킴 | `npm run verify` **exit 1**, 이후 단계 미실행 |

## 동어반복을 피한 방법

TH9의 첫 넘침 게이트는 컴파일러 출력만 봐서 동어반복이었다. TH4는 같은 함정 위에 있었다 — exporter가 만든 문자열을 exporter의 규칙으로 검사하면 항상 통과한다.

두 장치로 끊었다.

1. **구조 판정을 남에게 맡긴다** — `fast-xml-parser`·`parse5`는 우리 코드를 모른다. 글꼴 이스케이프 결함이 여기서 나왔다.
2. **단언의 근거를 입력에서 가져온다** — 텍스트는 청사진 `contentKey` → 요청 내용, 색·글꼴은 `tokenBindings` → `tokens.ts`, 치수는 청사진 선언. exporter가 무엇을 냈는지는 보지 않는다.

**기대값이 0개인 것도 실패로 친다.** 색·문자열·자산 기대가 비면 probe가 조용히 사라지므로, 그 상태를 명시적으로 miss로 기록한다.

## 크기 회고

changeset 3개(선언 `changesets>=2`) — 선언보다 1개 많다. 파싱 계층·입력 유래 단언·매니페스트 실측화가 각각 독립 검증을 가져 쪼갠 것이 타당했다.

테스트: template-core 154 → **155**(이스케이프 회귀 1). 게이트: `npm run verify` 4단계 연쇄 신설.

## finding 큐

- 검사는 "값이 산출물 **어딘가에** 있다"까지다. 어느 노드에 붙었는지는 보지 않으므로 **색이 서로 뒤바뀐 경우는 못 잡는다**.
- `role`·`contact` 슬롯은 `fontFamily` 바인딩이 없어 `system-ui`로 떨어진다 — 의도인지 누락인지 미판정(TH8 타이포 스케일과 겹침).
- 공급자 계약 검증(mime·크기)은 실재하지 않는다 — TH5에서 세운다.
- SVG 화면 요소 수는 backdrop `<rect>` 1개를 빼서 센다. 내보내기가 backdrop 규약을 바꾸면 이 상수를 함께 고쳐야 한다.
- 매니페스트가 닫힌 horizon 경로(`evidence/template-production-system/`)에 쓰인다 — 경로 이전 미착수.

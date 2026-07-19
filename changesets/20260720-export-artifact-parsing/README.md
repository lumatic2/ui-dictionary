# changeset: 내보내기 산출물 실제 실행 + 파싱 검사

- Date: 2026-07-20
- Plan: TH4 step 1 (`plans/2026-07-20-th4-verification-materialization.md`)

exporter를 **실제로 돌린다.** 18개 산출물을 만들어 디스크에 쓰고 범용 파서로 읽어 검사한다.

## 무엇을 바꿨나

- **루트 `package.json` 신설** — 게이트 실행기. `check:lines` / `check:overflow` / `check:exports` / `verify`. 하위 apps·packages는 각자 package.json을 유지하며 workspaces는 선언하지 않는다.
- **`scripts/check-export-artifacts.mjs` 신설** — 청사진 6 × 형식 3 = **18개** 산출물 생성·파싱.
  - SVG: `fast-xml-parser`의 `XMLValidator`로 **well-formed 여부**를 본다.
  - HTML: `parse5`로 문서를 세워 `<main>` 프레임과 자식 요소를 센다.
  - JSON: 파싱 + 필수 필드 + 노드 수.
- **줄 길이 가드에 두 게이트 스크립트 추가** — `check-text-overflow.mjs`·`check-export-artifacts.mjs`가 감시 밖에 있었다.

## 왜 범용 파서인가

exporter가 만든 문자열을 exporter와 같은 정규식으로 되읽으면 그 검사는 동어반복이다 — TH9의 넘침 게이트가 컴파일러 출력만 봐서 무의미했던 것과 같은 함정이다. 그래서 구조 판정은 우리 코드를 모르는 파서에 맡긴다.

요소 개수도 exporter 출력끼리 비교하지 않는다. **장면(`scene.nodes`)에서 그려야 할 노드 수를 유도**해 산출물과 대조한다.

## Verification

- [x] `node scripts/check-export-artifacts.mjs` — **PASS (산출물 18개 생성·파싱, 자기검사 4건 통과)**
- [x] `node scripts/check-line-length.mjs` — PASS (감시 대상 2개 추가 후)
- [x] `node scripts/check-text-overflow.mjs` — PASS
- [x] `node scripts/verify-template-production-system.mjs` — exit 0
- [x] `tmp/th4-exports/`에 18개 파일 실재 확인 (gitignored)

### Failure probe — 검사기가 훼손을 잡는가 (게이트 안에 상주)

probe를 별도 파일로 빼지 않고 **게이트 안 `selfCheck()`로 상주**시켰다. 밖에 두면 안 도는 채로 썩는다 — 은퇴한 경로를 가리킨 채 죽어 있던 `check-line-length.mjs` 선례가 있다.

| 훼손 | 검사기 반응 |
|---|---|
| SVG를 400자에서 자름 | well-formed 실패로 거부 |
| `</svg>` 삭제 | well-formed 실패로 거부 |
| HTML `<div>` 하나 삭제 | 자식 요소 수 불일치로 거부 |
| JSON 마지막 문자 삭제 | 파싱 실패로 거부 |

넷 중 하나라도 통과시키면 게이트 전체가 exit 1을 내고 산출물 검사는 시작조차 하지 않는다.

## finding 큐

- HTML은 오류 관용 문법이라 파서가 거의 실패하지 않는다 — 구조 단언(프레임·자식 수)이 실질 방어선이다.
- SVG 화면 요소 수는 backdrop `<rect>` 1개를 빼서 센다. 내보내기가 backdrop 규약을 바꾸면 이 상수를 함께 고쳐야 한다.
- 토큰 값·요청 문자열 대조는 아직 없다 — step-2 몫이다.

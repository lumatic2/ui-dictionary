# PLAN — DOG1 검사기가 맞는 것만 잡는다

> 생성: 2026-07-22 · 갈래: tooling · scope 결정: 색 검사 규칙 엔진만 고친다 — 배포·타이포·스킬 배선은 다른 milestone
Status: approved (2026-07-22 — 사용자가 horizon `design-output-gates` 6 milestone 묶음을 승인, horizon 전체 연쇄. horizon `design-output-gates` 승인 범위에 포함된 DOG1)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로 (← `plans/horizons/2026-07-design-output-gates.md`)
- **milestone**: DOG1 — 검사기가 맞는 것만 잡는다. 색 검사기가 SVG 내부와 주석 안의 색 리터럴을 위반으로 보고하지 않고, 한 줄에 여러 위반이 있으면 전부 보고한다.
- **리서치 입력**: horizon 문서 "실사로 나온 진짜 결함" 표 결함 1·2·3, `research/2026-07-20-design-output-static-linter-brief.md` §5 Step 1(SVG 예외를 브리프가 이미 명시)

## 왜 이게 먼저인가

horizon 착수 실사(2026-07-22, 실행 관측)가 `packages/cli/src/verify.ts`를 실제로 돌려서 세 가지를 확인했다.

1. `<svg><path fill="#000000"/></svg>` — 색 검사기가 SVG 내부 색 리터럴을 위반으로 보고한다. 브리프 §5가 이미 "SVG는 예외"라고 명시했는데 `verify.ts`에는 그 예외가 없다.
2. `// design ref: #FF0000 was the old brand color` — 주석 안 색 리터럴도 위반으로 보고한다. 사람이 참조용으로 남긴 텍스트가 실제 하드코딩 색과 같은 취급을 받는다.
3. `const a = "#111" + "rgb(1,2,3)"` — `verifyDir`의 검사 루프(`verify.ts:45-50`)가 `HEX_RULE.test(text) ? "hex-literal" : COLOR_FN_RULE.test(text) ? "raw-color-fn" : null` 형태의 **삼항 분기**라, 한 줄에 두 규칙이 다 걸려도 `hex-literal` 하나만 기록되고 `raw-color-fn`은 조용히 유실된다.

DOG6(마무리 절차 배선)이 이 검사기를 스킬에 물리기 전에, 검사기 자체가 신뢰할 만해야 한다. 오탐이 남은 채로 불려 들어가면 horizon 프리모템 2번("오탐이 쌓여 검사기가 무시당했다")이 그대로 실현된다.

## Scope Boundary
- **포함**: `packages/cli/src/verify.ts`의 색 검사 규칙 엔진(SVG/주석 예외, 줄 단위 다중 매치), `packages/cli/test/verify.test.ts` 및 신설 회귀 fixture 코퍼스.
- **제외**:
  - 타이포 검사기 신설 — DOG3.
  - `@askewly/design` npm 배포 — DOG2.
  - `SKILL.md`/entry-protocol에 `verify` 호출 배선 — DOG6. 이 milestone이 끝나도 마무리 절차는 여전히 검사기를 안 부른다.
  - anti-patterns 12클러스터를 정규식 규칙으로 옮기는 것 — horizon 비목표.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. fixture 코퍼스는 회귀 자산이므로 되돌릴 때 규칙 변경과 fixture를 함께 되돌린다(둘이 갈라지면 회귀 게이트 자체가 거짓 PASS를 낸다).

## 스캐폴딩 결정
- source-of-truth: 색 검사 규칙의 정본은 `packages/cli/src/verify.ts`의 정규식 상수(`HEX_RULE`·`COLOR_FN_RULE`)와 예외 목록(`SKIP_DIRS`·`SKIP_FILES`)이다. 이번 milestone은 이 파일 하나에 SVG/주석 예외 로직과 다중 매치 로직을 추가한다 — 새 규칙 저장소를 만들지 않는다.
- 검증: 회귀 fixture 코퍼스(`packages/cli/test/fixtures/verify-regression/`)를 정본 삼아 대조한다. 코드가 아니라 fixture의 기대 결과가 "무엇이 위반인가"의 실측 기준이다 — fixture를 규칙에 맞춰 고치지 않고, 규칙을 fixture의 의도(브리프 §5·horizon 실사)에 맞춘다.
- 배포/운영: 해당 없음 — 로컬 CLI 라이브러리, 이번 milestone은 npm 배포를 다루지 않는다(DOG2). 서버·시크릿 무관.
- 자기선언 도메인 — **회귀 안전성**: 예외를 넓히면 SVG/주석 밖의 진짜 위반까지 놓칠 위험이 이 milestone의 핵심 리스크(horizon 프리모템 2·기준 1의 반대짝). 기존 `verify.test.ts` 3건("hex/rgb 검출", "clean 파일 통과", "node_modules/dist 스킵")을 전부 계속 통과시키는 것을 예외 로직의 필요조건으로 둔다.
- 자기선언 도메인 — **정규식 성능**: 줄 단위 다중 매치로 바꾸면 `test()` 대신 `matchAll`류 반복 탐색이 필요하다. 대상 파일이 소스 코드 텍스트(수백 줄 단위)라 성능 영향은 무시 가능 — 별도 벤치마크를 만들지 않는다.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션·관측·디자인(화면 UI) — 전부 해당 없음. 이 milestone은 CLI 내부 규칙 엔진만 건드리고 화면을 만들지 않는다.

## 결정 로그
- status: none-required
- 사용자 결정 필요 항목: 없음 — DOG1의 범위·DoD·step 구성은 horizon 승인 시 이미 확정됐다(horizon 문서 결정 로그 확정 1~4번, DOG1은 그 아래 실행 항목).

## Step 트리

- [ ] **step-1 — 지금 상태를 실측해 고정한다**
  - Artifact: `packages/cli/test/fixtures/verify-regression/` 아래 4개 fixture 파일(현재 오탐 2종·누락 1종 + 정상 통과 1종)과, 그 fixture를 지금 코드로 돌린 **있는 그대로의 잘못된 출력**을 기록한 evidence 초안.
  - Files: write `packages/cli/test/fixtures/verify-regression/svg.tsx`, `packages/cli/test/fixtures/verify-regression/comment.tsx`, `packages/cli/test/fixtures/verify-regression/oneline.tsx`, `packages/cli/test/fixtures/verify-regression/clean.tsx`, `evidence/design-output-gates/dog1-linter-precision.md`(신설, step-1 관측 섹션만 채움).
  - Dependencies: 없음
  - Verify: 4개 fixture 각각에 대해 `verifyDir()`을 지금 코드로 실행한 결과를 evidence에 그대로 옮긴다 — `svg.tsx` FAIL(오탐), `comment.tsx` FAIL(오탐), `oneline.tsx`가 위반 1건만 보고(`hex-literal`, `raw-color-fn` 유실), `clean.tsx` PASS. 이 네 결과가 정확히 horizon 문서 "실사로 나온 진짜 결함" 표 1·2·3번과 일치하는지 대조한다.
  - Failure probe: 이 step은 코드를 바꾸지 않으므로 실패 조건은 "기록한 출력이 실제 실행 결과와 다르다"는 것 하나다 — fixture를 다시 돌려 evidence의 숫자·판정이 재현되지 않으면 이 step은 무효다.
  - Commit: changeset `linter-regression-corpus`.

- [ ] **step-2 — SVG 내부·주석 예외**
  - Artifact: `verifyDir()`이 `<svg>...</svg>` 블록 내부와 `//`·`/* */`·JSX(`{/* */}`) 주석 내부의 색 리터럴을 위반에서 제외한다. 그 외 위치의 동일한 리터럴은 여전히 잡는다.
  - Files: write `packages/cli/src/verify.ts`, `packages/cli/test/verify.test.ts`, `packages/cli/test/fixtures/verify-regression/svg.tsx`(필요 시 예외 밖 위반도 섞어 추가), `packages/cli/test/fixtures/verify-regression/comment.tsx`(동일).
  - Dependencies: step-1
  - Verify: `svg.tsx`·`comment.tsx`가 PASS로 뒤집힌다(step-1에서 기록한 FAIL → PASS). 기존 `verify.test.ts` 3건(hex/rgb 검출·clean 통과·node_modules/dist 스킵)이 계속 PASS한다. **누락 방지**: `<svg>` 태그 밖에 하드코딩 hex가 있는 fixture(예: `svg.tsx`에 `<svg>` 블록과 별개로 `const border = "#123456"`를 추가)를 새로 넣고, 그 줄은 여전히 위반으로 잡히는지 확인한다.
  - Failure probe: SVG·주석 예외를 되돌리면 `svg.tsx`·`comment.tsx` 테스트가 다시 FAIL로 돌아간다. 예외를 파일 전체 스킵으로(블록 단위가 아니라) 잘못 구현하면 새로 넣은 "SVG 밖 위반" 테스트가 실패해 과도한 예외 확장을 잡는다.
  - Commit: changeset `linter-false-positives`.

- [ ] **step-3 — 한 줄 다중 위반 전수 보고**
  - Artifact: `verifyDir()`이 한 줄에서 매칭되는 **모든** 규칙을 보고한다 — 삼항 분기(`HEX_RULE.test(text) ? ... : COLOR_FN_RULE.test(text) ? ... : null`)를 각 규칙 독립 검사로 바꾼다.
  - Files: write `packages/cli/src/verify.ts`, `packages/cli/test/verify.test.ts`, `packages/cli/test/fixtures/verify-regression/oneline.tsx`.
  - Dependencies: step-2
  - Verify: `oneline.tsx`(`const a = "#111" + "rgb(1,2,3)"`)의 위반 수가 step-1 기록의 1건 → 2건(`hex-literal`+`raw-color-fn`, 같은 줄 번호)으로 바뀐다. 기존 3건 + step-2에서 추가한 테스트가 전부 계속 PASS.
  - Failure probe: 다시 삼항 분기로 되돌리면 `oneline.tsx` 위반 수가 2 → 1로 줄어 새 테스트가 실패한다.
  - Commit: changeset `linter-multi-violation`.

## 검증/DoD
- **DoD**: 색 검사기가 SVG 내부와 주석 안의 색 리터럴을 위반으로 보고하지 않고, 한 줄에 여러 위반이 있으면 전부 보고한다(horizon 닫는 기준 1·2와 동일 문구).
- **Evidence**: `evidence/design-output-gates/dog1-linter-precision.md` — step-1의 "고치기 전" 실측과 step-2·3의 "고친 후" 대조를 `선언 / 실측 / 판정` 형식으로 남긴다.
- **회귀 게이트**: `npm run verify` + `npm run typecheck` + `packages/cli` 테스트(`cd packages/cli && npm test`) 전부 PASS.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-22 작성.

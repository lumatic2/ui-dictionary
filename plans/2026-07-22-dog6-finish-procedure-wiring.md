# PLAN — DOG6 마무리 절차가 셋을 다 부른다

> 생성: 2026-07-22 · 갈래: tooling · scope 결정: 매체별 게이트 분기 + 검사기 호출 배선 + 스킬 문서 정합. 검사 규칙 자체(DOG1)·npm 배포 자체(DOG2)·타이포 계수(DOG3)는 손대지 않는다
Status: approved (2026-07-22 — 사용자가 horizon `design-output-gates` 6 milestone 묶음을 승인, horizon 전체 연쇄. horizon `design-output-gates` 승인 범위에 포함된 DOG6. 실행 착수는 DOG1·DOG2 완료 후 — 아래 결정 로그·Scope Boundary 참조)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로 (← `plans/horizons/2026-07-design-output-gates.md`)
- **milestone**: DOG6 — 마무리 절차가 셋을 다 부른다. 마무리 절차가 매체(화면/인쇄/슬라이드)에 따라 다른 게이트를 지시하고, 검사기를 호출해 위반을 에이전트가 받아 고친 뒤 다시 잰다.
- **리서치 입력**: horizon 문서 "실사로 나온 진짜 결함" 표 결함 5·7, 닫는 기준 6·7, "리서치가 이미 바꾼 것"(Kraft 자가 수정 루프), [프롬프트 한 줄로 화면이 나오는 시대, '당근스러운 화면'을 만드는 법](https://medium.com/p/0bc268f819c7)(SeieunYoo, medium.com/daangn, 2026-04-30, 접근 2026-07-22)

## 왜 이게 먼저인가

horizon 착수 실사(2026-07-22, 실행 관측)가 두 결함을 확인했다.

- **결함 5**: `~/projects/custom-skills/promoted/askewly-design/SKILL.md`의 마무리 절차 3단계에 검사기(`askewly-design verify`) 호출이 **없다.** 검사기가 있어도(DOG1·DOG2가 손보는 그 검사기) 에이전트 경로에서 안 불린다 — 직전 horizon VL8과 **같은 병리**: 자산은 있는데 에이전트 경로 밖에 있다.
- **결함 7**: `SKILL.md`의 description이 *"그 경우의 게이트는 전역 CLAUDE.md §askewly-design 적용 범위를 따른다"* 라고 적는데, horizon 문서(비목표 절)에 따르면 그 절은 사용자 판단으로 제거된 상태다 — 스킬이 없는 문서를 가리킨다. 같은 description이 슬라이드·PDF를 "이 스킬의 대상이 아니다"라고 배제하는데, Objective가 2026-07-22 확장되며 그 매체들이 범위에 들어왔다 — description 자체가 낡았다.

이 둘을 그냥 고치면 "검사기를 부르되 사람에게 보고를 첨부"하는 형태로 끝나기 쉽다. 하지만 Kraft 원문은 채점기가 CI도 사람 리포트도 아닌 **에이전트 파이프라인의 Verify 단계**에서 돌고, 낮은 점수가 *"에이전트가 스스로 어디가 문제인지 피드백을 받아 수정하는 루프"*를 만든다고 명시한다. 그래서 이 milestone의 목적지는 "보고 첨부"가 아니라 **자가 수정 루프**로 잡는다(horizon "리서치가 이미 바꾼 것" 절, 닫는 기준 7과 동일 문구).

## Scope Boundary
- **포함**: `docs/design-system/entry-protocol.md`의 매체별 게이트 분기 신설, `~/projects/custom-skills/promoted/askewly-design/SKILL.md`의 마무리 절차에 검사기 호출 배선 + 낡은 서술 2건(결함 7) 정정 + 배포(`setup.sh`) + 배포본 확인, 의도적 위반 fixture로 자가 수정 루프 1회 실증.
- **제외**:
  - 색 검사 규칙 자체 변경(오탐·누락 수정) — DOG1. 이 milestone은 DOG1이 고친 검사기를 **부르기만** 한다.
  - `@askewly/design` npm 배포 자체 — DOG2. 이 milestone의 검사기 호출은 DOG2가 확정한 실행 경로(`npx @askewly/design verify`)를 그대로 쓴다 — 새 배포 경로를 만들지 않는다.
  - 타이포 단계 계수 규칙 신설 — DOG3.
  - 인쇄·슬라이드 규격 값 자체(도련·안전영역·16:9 그리드 등 구체 수치) 신설 — DOG4·DOG5. 이 milestone은 "매체를 판정해 다른 게이트로 분기한다"는 **틀**만 entry-protocol에 넣는다. 분기가 가리키는 인쇄·슬라이드 규격 본문은 DOG4·DOG5 산출물을 참조한다(선행이 아직 안 끝났으면 참조 대상이 "리서치 문서" 단계일 수 있음을 evidence에 명시한다).
  - `SKILL.md` 본문에 entry-protocol 규칙을 복제하는 것 — horizon 비목표. 매체 분기 규칙 본문은 원격(`docs/design-system/entry-protocol.md`)에만 두고, `SKILL.md`는 그 문서를 따르라고 가리키기만 한다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. **step-2는 두 레포에 걸친다** — `~/projects/custom-skills/promoted/askewly-design/SKILL.md`(원본)와 `~/.claude/skills/askewly-design/SKILL.md`(배포본, `setup.sh` 산출물)가 갈라지면 배포본만 되돌려서는 안 되고 원본→재배포 순서로 되돌린다. step-3의 fixture는 `evidence/` 밑 임시 산출물이라 폐기만 하면 된다.

## 스캐폴딩 결정
- source-of-truth: 매체 분기 규칙의 정본은 `docs/design-system/entry-protocol.md`(이 레포, llms.txt로 배포). 검사기 호출 절차의 정본은 `~/projects/custom-skills/promoted/askewly-design/SKILL.md`(다른 레포) — `setup.sh` 배포 전까지는 `~/.claude/skills/askewly-design/SKILL.md`가 실제 실행 경로를 반영하지 않는다.
- 검증: 배포본 확인이 이 milestone의 핵심 검증 표면이다 — 원본만 고치고 배포본을 안 보면 결함 5가 형태만 바뀐 채(자산은 고쳐졌는데 에이전트가 읽는 배포본은 그대로) 재발한다. `~/.claude/skills/askewly-design/SKILL.md`를 원본과 diff 없음으로 대조하는 것을 각 step의 필요조건으로 둔다.
- 배포/운영: 이 milestone의 핵심 도메인이다. `setup.sh` 배포(원본 `custom-skills` → 배포본 `~/.claude/skills`)와 npm 패키지 의존(`npx @askewly/design verify` 호출이 DOG2의 배포 성공을 전제)이라는 두 배포 표면이 겹친다. DOG2가 아직 안 끝난 상태(2026-07-22 기준 `npm view @askewly/design` E404, `plans/2026-07-22-dog2-cli-publication.md` step-2 미착수)에서 이 milestone의 step-2를 실행하면 배선된 호출이 남의 프로젝트에서 즉시 깨진다 — 그래서 step-2는 DOG1·DOG2 완료를 전제 조건으로 명시한다(아래 각 step 참조).
- **자기선언 도메인 — 정본 드리프트 방지**: horizon 비목표가 "스킬 본문에 규칙 복제 금지"를 명시한다. `SKILL.md` 수정은 절차 배선(무엇을 호출하는가·어디를 가리키는가)만 건드리고, 매체별 게이트의 구체 기준(래스터화 방법·페이지 수·타이포 임계치 등)은 전부 `entry-protocol.md` 쪽에 쓴다.
- 검토 후 제외: 인증·시크릿·마이그레이션·관측 — 걸리지 않음. 화면 UI(디자인 판정) — 이 milestone은 절차 문서·라우터 스킬 배선만 다루고 화면을 만들지 않으므로 해당 없음(`askewly-design` 스킬 호출 대상 아님).

## 결정 로그
- status: none-required
- 사용자 결정 필요 항목: 없음 — DOG6의 범위·DoD·step 구성은 horizon 승인 시 이미 확정됐다(horizon 문서 결정 로그 확정 1~4번과 담을 milestone 표, DOG6은 그 아래 실행 항목).
- **참고(사용자 결정 아님, 이미 확정된 사실)**: 검사기가 경고인지 차단인지는 horizon 결정 로그 확정 3에서 이미 정해졌다 — **경고로 시작**하고, DOG7(사람 관측 milestone)에서 실세션 경험을 바탕으로 차단 승격 여부를 판정한다. 이 milestone은 경고 배선까지만 하고 승격 판정은 하지 않는다.

## Step 트리

- [ ] **step-1 — entry-protocol 매체별 분기**
  - Artifact: `docs/design-system/entry-protocol.md`에 매체 판정 단계와 매체별 게이트를 넣는다. 화면(기본값, 현행 유지) = 상태(hover/focus/active/disabled/loading/error)·라이트/다크 스크린샷. 인쇄·슬라이드 = **최종 형식 그대로 래스터화해 확인** — PDF라면 HTML 스크린샷이 아니라 PDF 페이지 자체를 래스터화(PyMuPDF 등)하고, 첫 페이지·중간 페이지·마지막 페이지 최소 3면을 본다. 그 다음에야 사람 확인 게이트(기존 5단계)로 이어진다. 매체 판정 로직은 기존 "Before the task branches" 절(N-1~N-3, 요소 결정)과 같은 자리 — 절차 초반에서 한 번 정해 이후 단계에 흘려보낸다.
  - Files: write `docs/design-system/entry-protocol.md`.
  - Dependencies: 없음
  - Verify: 문서에 화면/인쇄/슬라이드 3매체 각각의 게이트 항목이 명시적으로 다르게 적혀 있고(화면 항목에 "래스터화"가 없고, 인쇄·슬라이드 항목에 "hover/focus 상태"가 없음 — 서로의 기준을 베끼지 않았는지 대조), `https://ui.askewly.com/llms/docs/design-system/entry-protocol.md`를 fetch한 배포본에도 같은 절이 반영돼 있다(VL2 규율 — 로컬 파일 존재가 아니라 배포본 fetch로 확인).
  - Failure probe: 매체 판정 단계를 지우고 화면 게이트만 남기면, 인쇄·슬라이드 작업에서도 여전히 "라이트/다크 스크린샷"만 지시하게 돼 horizon 닫는 기준 6(매체별 분기)이 관측 불가능해진다 — 그 상태가 되돌림 여부의 판정 기준이다.
  - Commit: changeset `protocol-medium-branch`.

- [ ] **step-2 — 검사기 호출 배선 + 스킬 정합**
  - ⚠ **착수 전제**: DOG1(검사기 오탐 제거)·DOG2(npm 배포) 완료. 오탐이 남았거나 `npx @askewly/design`이 아직 E404인 상태에서 이 leaf를 실행하면 배선된 호출이 남의 프로젝트에서 신뢰를 잃거나 즉시 깨진다(horizon 프리모템 2·의존 규칙).
  - Artifact: 마무리 절차(entry-protocol 5단계 직전, 또는 `SKILL.md` 마무리 절차 3단계)에 `npx @askewly/design verify <대상 디렉터리>` 호출을 넣는다. 동시에 `~/projects/custom-skills/promoted/askewly-design/SKILL.md`의 description에서 낡은 서술 2건을 고친다 — ① *"그 경우의 게이트는 전역 CLAUDE.md §askewly-design 적용 범위를 따른다"*(삭제된 절 참조 — 제거하고 entry-protocol의 매체 분기 절을 가리키도록 대체), ② *"단, 상호작용 없이 읽기만 하는 산출물(인쇄물·PDF·문서·리포트·슬라이드 배포본)은 이 스킬의 대상이 아니다 — 판정 항목 대부분이 해당 없음이 되고 지면 조판 결함을 잡지 못한다"*(Objective 2026-07-22 확장으로 슬라이드·PDF도 대상에 들어왔으므로 "대상이 아니다"를 "매체별로 다른 게이트를 따른다"로 정정). 원본은 `~/projects/custom-skills/promoted/askewly-design/`에서 고치고 `bash ~/projects/custom-skills/setup.sh`로 배포한 뒤 **배포본**(`~/.claude/skills/askewly-design/SKILL.md`)까지 확인한다(Judge 규약).
  - Files: write `~/projects/custom-skills/promoted/askewly-design/SKILL.md`(**이 레포 밖** — `custom-skills` 레포), `docs/design-system/entry-protocol.md`(검사기 호출 배선 지점 추가), 실행 `bash ~/projects/custom-skills/setup.sh`(배포 스크립트, 파일 수정 아님), read-check `~/.claude/skills/askewly-design/SKILL.md`(배포본, 파일 수정 아님 — 대조만).
  - Dependencies: step-1
    - 외부 선행(이 문서의 leaf가 아님): DOG1·DOG2 완료 — horizon 의존 규칙("오탐 있는 검사기를 마무리 절차에 꽂지 않는다")에 따른 milestone 간 순서.
  - Verify: 배포본 `~/.claude/skills/askewly-design/SKILL.md`를 grep해 결함 7의 두 낡은 문장이 **사라졌고**, `npx @askewly/design` 호출 문자열이 **추가돼** 있으며, 원본과 배포본이 **동일**하다(diff 없음). `https://ui.askewly.com/llms.txt` 경유 fetch로 entry-protocol 배포본에도 step-1의 호출 배선 지점이 반영돼 있다.
  - Failure probe: `setup.sh`를 안 돌리고 원본만 고치면 배포본 grep에서 낡은 문장이 여전히 나온다(원본-배포본 동일성 검사가 그 누락을 잡는다). 검사기 호출 문자열을 빼먹으면 결함 5가 형태만 바뀐 채 재발한다 — step-3에서 실행해보면 재측정이 아예 안 일어나 즉시 드러난다.
  - Commit: changeset `skill-verify-wiring`.

- [ ] **step-3 — 자가 수정 루프 실증**
  - Artifact: 의도적 위반(하드코딩 hex 색 리터럴 등, DOG1이 정의한 회귀 fixture 코퍼스 형태 참고)이 든 임시 fixture 프로젝트를 하나 만들어, step-2에서 배선한 마무리 절차를 **실제로 1회 통과시킨다.** 1차 실행에서 위반이 잡히고, 그 목록을 받아 고친 뒤, 2차 실행(재측정)에서 위반이 0이 되는 것을 로그로 남긴다. "절차에 적혀 있다"가 아니라 "돌렸더니 재측정이 일어났다"를 증명하는 것이 이 leaf의 유일한 목적이다(horizon 프리모템 1 예방).
  - Files: write `evidence/design-output-gates/dog6-wiring.md`(신설 — fixture 위치·1차 실행 로그·수정 diff·2차 실행 로그 전부 기록), fixture 파일 자체(예: `evidence/design-output-gates/dog6-fixture/` 밑, 커밋 대상 임시 산출물).
  - Dependencies: step-2
  - Verify: evidence에 1차 실행의 위반 건수(0보다 큼)와 2차 실행의 위반 건수(정확히 0)가 나란히 기록돼 있고, 그 사이에 실제 파일 수정이 있었다는 것(수정 전/후 diff)이 함께 남아 있다. 이 세 가지(1차>0, 수정 발생, 2차=0)가 전부 있어야 "자가 수정 루프"이지, 2차만 0이면 그냥 "처음부터 위반이 없었다"와 구분이 안 된다.
  - Failure probe: fixture를 고치지 않고 그대로 재실행하면 2차 위반 건수가 1차와 같게 나온다(재측정이 실제로 다른 입력에 다른 값을 낸다는 것의 반대증명 — 이 결과가 나오면 이 leaf는 실패). 2차 실행을 생략하고 "고쳤으니 통과할 것"이라고만 적으면 이 Verify를 충족하지 못한다.
  - Commit: changeset `self-correction-loop`.

## 검증/DoD
- **DoD**: 마무리 절차가 매체(화면/인쇄/슬라이드)에 따라 다른 게이트를 지시하고, 검사기를 호출해 위반을 에이전트가 받아 고친 뒤 다시 잰다(horizon 닫는 기준 6·7과 동일 문구).
- **Evidence**: `evidence/design-output-gates/dog6-wiring.md` — step-1의 배포본 대조, step-2의 원본·배포본 diff-없음 확인, step-3의 1차/수정/2차 실행 로그를 전부 `선언 / 실측 / 판정` 형식으로 남긴다.
- **회귀 게이트**: `npm run verify` + `npm run typecheck` 전부 PASS. (이 milestone은 문서·스킬 배선이 중심이라 앱 코드 테스트 스위트 변경은 없다 — 회귀 게이트는 기존 코드가 안 깨졌다는 확인용.)

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-22 작성. 착수는 DOG1·DOG2 완료 후 — step-2에 명시된 착수 전제 참조.

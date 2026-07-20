# PLAN — ED3 프로토콜 배선

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: entry-protocol 결정 단계 삽입 + 결정 기록 형식 + llms.txt 등재까지 (실배포 push 제외)
> milestone-레벨 durable plan doc.

Status: 승인 대기

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 요소 결정 계층 (← `plans/horizons/2026-07-element-decision-layer.md`)
- **milestone**: ED3 — 데이터가 있어도 프로토콜이 안 부르면 안 읽힌다. 프로토콜 문서·기록 형식·배포 생성기 3개 표면을 건드리고 통합검증은 "생성된 llms.txt에서 모든 경로가 실존하는가". milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3. 실제 `git push ui-dictionary main`은 이 milestone 밖 — 세션 단위 배포 승인 규약(`CLAUDE.md`)을 따른다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: `entry-protocol.md`는 기존 문서 수정이므로 diff 단위 revert. llms.txt는 생성물이라 생성기 revert 후 재생성.

## 스캐폴딩 결정

- source-of-truth: 프로토콜 정본 = `docs/design-system/entry-protocol.md`. 배포 인덱스 정본 = `scripts/generate-llms-txt.mjs`의 `FIXED_ASSETS`(생성물 `llms.txt`는 파생물이지 정본이 아님).
- 검증: `node scripts/generate-llms-txt.mjs` 재생성 후 ① 결정 섹션 존재 ② 등재된 모든 경로가 레포에 실존(경로 해석 스크립트) ③ 기존 섹션 회귀 없음(생성 전후 diff가 추가분에만 국한).
- 배포/운영: 배포 채널은 기존 `ui.askewly.com` 정적 배포 그대로 — 새 인프라 없음. **push는 사용자 승인 지점**이라 이 milestone에서 실행하지 않는다.
- 프로토콜 배선 위치: 결정 단계를 "Always" 절이 아니라 **"By task type" A/B/C 분기 직전**에 삽입한다. 근거: A(새 화면)는 분류→레시피로 직행하고 C(단일 컴포넌트)는 이미 요소가 정해진 상태로 들어오는데, 결정이 필요한 건 정확히 그 갈림 앞이다. Always에 넣으면 컴포넌트 수정 작업에서도 매번 발화해 노이즈가 된다.
- 결정 기록 형식: 에이전트 보고에 `요소 결정` 블록 의무 — 고른 요소·소속 군집·갈린 축과 값·기각한 대안과 사유. 근거: 리서치에서 확인된 실패 모드는 "결정 트리를 만들어도 눈에 안 보이면 안 쓴다"(Smashing/Friedman) — 기록 의무가 가시성 장치다.
- 검토 후 제외: 서버·데이터스토어·관측 — 정적 문서·생성기만 건드린다. 화면 — 사이트 UI는 horizon 범위 밖.

## 결정 로그

- 삽입 위치(Always vs 태스크 분기 앞): **태스크 분기 앞 확정**(위 근거). 사용자 결정 불요 — 프로토콜 구조에서 도출.
- 배포 실행: **사용자 소유** — 이 milestone은 로컬 생성·검증까지만 하고 push는 세션 단위 배포 보고에 포함해 승인받는다. 이 경계 때문에 실행 중 정지는 발생하지 않는다.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — entry-protocol 결정 단계**
  - Artifact: `entry-protocol.md`에 "요소 결정" 단계 신설 — 언제 발화하나(요구가 요소를 특정하지 않을 때), 무엇을 fetch하나(`decisions/README.md` → 해당 군집), 판정 절차, 결정 못 하면 어떻게 하나(축이 안 가르면 사용자에게 한 줄 질문)
  - Files: 읽기 `docs/design-system/entry-protocol.md`·`decision-format.md`·`decisions/README.md` / 쓰기 `entry-protocol.md`
  - Dependencies: none
  - Verify: A/B/C 분기 각각에서 결정 단계로 가는 경로가 명시됨 + 기존 단계 번호 참조가 깨지지 않음(문서 내 상호참조 grep)
  - Failure probe: 우회 경로 점검 — "새 화면" 태스크를 문서대로 따라가며 결정 단계를 **건너뛸 수 있는 읽기 경로가 있는지** 찾는다. 있으면 그 분기에도 삽입한다
  - Commit: changeset `<n>-entry-protocol-decision-step`
- [ ] **step-2 — 결정 기록 형식**
  - Artifact: `entry-protocol.md`의 보고 계약에 `요소 결정` 블록 추가 + `decision-format.md`에 블록 스키마(고른 것·군집·갈린 축=값·기각 대안과 사유) 명시
  - Files: 쓰기 `docs/design-system/entry-protocol.md`·`docs/design-system/decision-format.md`
  - Dependencies: step-1
  - Verify: 자기 적용 — 이 레포의 실제 UI 작업 한 건(임의 선정)에 대해 블록을 직접 작성해보고, 필드가 전부 채워지는지 확인
  - Failure probe: 요소가 처음부터 정해진 작업("이 버튼 색 고쳐")에 블록을 강제하면 빈 칸이 나온다 — 그 경우 "해당 없음 — 요소 지정됨"이 정당한 값임을 계약에 명시했는지 확인
  - Commit: changeset `<n>-decision-record-format`
- [ ] **step-3 — llms.txt 등재**
  - Artifact: `generate-llms-txt.mjs`에 `Decisions` 섹션 추가(군집 인덱스 + 개별 군집 파일) + 재생성된 `llms.txt`
  - Files: 읽기 `scripts/generate-llms-txt.mjs` / 쓰기 같은 파일 + 생성물
  - Dependencies: step-2
  - Verify: `node scripts/generate-llms-txt.mjs` 실행 후 산출물에 `## Decisions` 존재 + 등재 경로 전부가 레포에 실존(경로 해석 검사) + 기존 섹션 항목 수 불변
  - Failure probe: 존재하지 않는 경로를 고의로 등재해 경로 해석 검사가 잡는지 확인. 못 잡으면 검사를 추가한다 — 죽은 URL은 `entry-protocol.md` 0번 규칙("fetch 실패하면 멈춰라")을 발화시켜 에이전트를 세운다
  - Commit: changeset `<n>-llms-decisions-section`

## 검증/DoD

- **DoD**: 생성된 `llms.txt`에 결정 섹션이 있고 등재 경로가 전부 실존하며, `entry-protocol.md`의 A/B/C 어느 경로로 들어와도 요소가 미정이면 결정 단계를 지나가고, 보고에 `요소 결정` 블록이 요구된다.
- Evidence: `evidence/element-decision-layer/ed3-protocol-wiring.md`

## finding 큐

- (실행 중 append)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성

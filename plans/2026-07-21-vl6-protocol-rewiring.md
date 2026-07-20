# PLAN — VL6 프로토콜 재배선

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 용어 조회·요소 결정·자산 폴백 3단계 삽입 + 결정 기록 형식 + 등재까지
> milestone-레벨 durable plan doc.

Status: 승인 대기

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 용어가 실제로 쓰이는 흐름 (← `plans/horizons/2026-07-vocabulary-in-use.md`)
- **milestone**: VL6 — 자산이 다 있어도 프로토콜이 안 부르면 안 읽힌다. VL2~VL5가 만든 것을 하나의 경로로 꿰는 자리다. 프로토콜 문서·기록 형식·배포 생성기 3개 표면이고 통합검증은 "우회 경로 0". milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~4. 실제 `git push`는 이 milestone 밖 — 세션 단위 배포 승인 규약(`CLAUDE.md`)을 따른다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: `entry-protocol.md`는 기존 문서 수정이라 diff 단위 revert. 생성물은 생성기 revert 후 재생성.

## 스캐폴딩 결정

- source-of-truth: 프로토콜 정본 = `docs/design-system/entry-protocol.md`. 배포 인덱스 정본 = `scripts/generate-llms-txt.mjs`의 자산 목록.
- 검증: ① 문서 추적으로 A/B/C 어느 분기에서도 우회 경로가 없음 ② 자기 적용 1건으로 기록 형식이 실제로 채워짐 ③ 생성기 재실행 후 경로 전부 실존.
- 배포/운영: 기존 정적 배포 그대로. push는 사용자 승인 지점이라 여기서 실행하지 않는다.
- 삽입 위치: 세 단계를 **"By task type" A/B/C 분기 직전**에 넣는다. 근거: A(새 화면)는 분류에서 레시피로 직행하고 C(단일 컴포넌트)는 요소가 정해진 채로 들어오는데, 판단이 필요한 지점이 정확히 그 갈림 앞이다. "Always" 절에 넣으면 버튼 색 고치는 작업에서도 매번 발화해 노이즈가 된다.
- 단계 순서: **용어 조회 → 요소 결정 → 자산 획득(없으면 폴백)**. 근거: 요구가 서술적일 때 먼저 어휘로 번역해야 후보군이 나오고, 후보가 있어야 판별 축이 갈리며, 요소가 정해져야 자산을 찾는다. 역순은 성립하지 않는다.
- 결정 기록 형식: 보고에 `요소 결정` 블록 의무 — 고른 요소·소속 군집·갈린 축과 값·기각한 대안과 사유·사용한 자산(또는 폴백). 근거: 리서치가 확인한 실패 모드는 "결정 트리를 만들어도 눈에 안 보이면 안 쓴다"(Smashing/Friedman) — 기록 의무가 가시성 장치다.
- 검토 후 제외: 서버·데이터스토어·관측 — 정적 문서·생성기만 건드린다. 화면 — 사이트 UI는 horizon 범위 밖.

## 결정 로그

- 삽입 위치(Always vs 태스크 분기 앞): **태스크 분기 앞 확정**(위 근거). 프로토콜 구조에서 도출 — 사용자 결정 불요.
- 3단계를 한 단계로 뭉칠 것인가: **분리 확정**. 근거: 뭉치면 요소가 이미 정해진 작업에서도 용어 조회가 강제되고, 반대로 자산이 없는 경우의 분기가 묻힌다.
- 배포 실행: **사용자 소유** — 로컬 생성·검증까지만 하고 push는 세션 단위 배포 보고에 포함해 승인받는다. 이 경계 때문에 실행 중 정지는 발생하지 않는다.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 용어 조회 단계**
  - Artifact: `entry-protocol.md`에 "용어 조회" 단계 신설 — 서술적 요구를 어휘로 번역하는 절차, VL2 조회 규약으로 진입하는 경로, 사전에 없는 개념일 때의 처리
  - Files: 읽기 `docs/design-system/entry-protocol.md`·`vocabulary-lookup.md`·`evidence/vocabulary-in-use/vl1-flow-audit.md` / 쓰기 `entry-protocol.md`
  - Dependencies: none
  - Verify: VL1 갭 장부의 "여기서 용어 사전이 등장하는가" 항목이 전부 예로 바뀜 — 장부와 나란히 대조 기록
  - Failure probe: 사전에 없는 개념을 요구로 넣어 프로토콜이 **막히지 않고 폴백으로 흐르는지** 확인. 조회 실패가 작업 중단이 되면 배선이 잘못된 것
  - Commit: changeset `<n>-protocol-vocabulary-lookup`
- [ ] **step-2 — 요소 결정 단계**
  - Artifact: `entry-protocol.md`에 "요소 결정" 단계 신설 — 언제 발화하나(요구가 요소를 특정하지 않을 때), 무엇을 fetch하나(군집 인덱스에서 해당 군집으로), 판정 절차, 축이 안 갈릴 때 사용자에게 한 줄 되묻는 경로
  - Files: 읽기 `docs/design-system/decision-format.md`·`docs/design-system/decisions/README.md` / 쓰기 `entry-protocol.md`
  - Dependencies: step-1
  - Verify: A/B/C 분기 각각에서 결정 단계로 가는 경로가 명시되고 기존 단계 번호 참조가 깨지지 않음(문서 내 상호참조 대조)
  - Failure probe: 우회 경로 추적 — 새 화면 태스크를 문서대로 따라가며 결정 단계를 **건너뛸 수 있는 읽기 경로가 있는지** 찾는다. 있으면 그 분기에도 삽입한다
  - Commit: changeset `<n>-protocol-element-decision`
- [ ] **step-3 — 자산 획득·폴백 분기 + 결정 기록 형식**
  - Artifact: 자산 있음/없음 분기를 프로토콜에 명시(있으면 코드 자산 우선, 없으면 VL3 폴백 규약) + 보고 계약에 `요소 결정` 블록 추가 + `decision-format.md`에 블록 스키마
  - Files: 쓰기 `docs/design-system/entry-protocol.md`·`docs/design-system/decision-format.md`
  - Dependencies: step-2
  - Verify: 자기 적용 — 이 레포의 실제 UI 작업 1건에 대해 세 단계를 전부 밟고 블록을 작성해, 필드가 전부 채워지는지 확인
  - Failure probe: 요소가 처음부터 정해진 작업에 블록을 강제하면 빈 칸이 나온다 — "해당 없음 — 요소 지정됨"이 정당한 값임을 계약에 명시했는지 확인
  - Commit: changeset `<n>-protocol-asset-branch-and-record`
- [ ] **step-4 — 배포 등재 + 회귀 확인**
  - Artifact: 신설 문서 전부를 llms.txt에 등재 + 재생성 + VL1 계측을 다시 돌려 경로가 바뀐 것을 확인
  - Files: 쓰기 `scripts/generate-llms-txt.mjs` + 생성물
  - Dependencies: step-3
  - Verify: 재생성 후 등재 경로 전부 실존 + `node scripts/audit-vocabulary-reach.mjs` 여전히 끊긴 참조 0 + 기존 섹션 항목 수 불변
  - Failure probe: 프로토콜이 길어져 앞 단계가 묻히지 않았는지 검사 — 문서 길이 증가분과 "Always" 절 위치를 확인하고, 새 단계가 기존 필수 단계(자가 판정·사람 확인)를 밀어내지 않았는지 대조한다
  - Commit: changeset `<n>-protocol-publication`

## 검증/DoD

- **DoD**: 요소가 미정인 요구가 A/B/C 어느 경로로 들어와도 용어 조회·요소 결정·자산 획득(또는 폴백)을 지나고, 우회 경로가 0이며, 보고에 `요소 결정` 블록이 요구되고, 등재 경로가 전부 실존한다.
- Evidence: `evidence/vocabulary-in-use/vl6-protocol-rewiring.md`

## finding 큐

- (실행 중 append)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성

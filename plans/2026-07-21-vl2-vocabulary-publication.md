# PLAN — VL2 어휘 배포

> 생성: 2026-07-21 · 갈래: tooling · scope 결정: 샤딩 생성기 · 조회 규약 · llms 등재까지
> milestone-레벨 durable plan doc.

Status: approved 2026-07-21 (horizon 전체 연쇄 승인)

## 북극성 → horizon → milestone → step (위계)

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (← `OBJECTIVE.md`)
- **horizon**: 용어가 실제로 쓰이는 흐름 (← `plans/horizons/2026-07-vocabulary-in-use.md`)
- **milestone**: VL2 — 562개 680KB를 에이전트가 감당할 수 있는 형태로 배포한다. 샤딩 생성기·조회 규약 문서·배포 등재 3개 표면이고 통합검증은 "임의 용어 조회가 3 fetch 이내에 끝나는가". milestone 규모.

## 중단점 · run 전 scope 결정 (확정)

- **결정**: step-1~3. 실제 `git push`는 이 milestone 밖 — 세션 단위 배포 승인 규약(`CLAUDE.md`)을 따른다.
- execution mode: `continuous`
- **중단점(stop points)**: completed / 증거 있는 blocked / decision_required / risk_gate / user_stopped
- **진행 보고**: commentary only.
- rollback/cleanup: 생성기는 changeset 단위 revert, 생성물은 생성기 revert 후 재생성. 기존 llms 자산은 건드리지 않으므로 회귀 위험이 낮다.

## 스캐폴딩 결정

- source-of-truth: 용어 원본은 계속 `docs/ui-vocabulary/terms.yml` 하나. 배포용 샤드는 **파생물**이며 생성기가 정본(손으로 편집 금지 — 기존 `generate-llms-txt.mjs`와 같은 규약).
- 검증: `node scripts/generate-vocabulary-shards.mjs` 후 ① 샤드 합집합이 원본 562개와 일치 ② 각 샤드 크기가 상한 이하 ③ 인덱스에서 임의 용어까지 3 fetch 이내 도달 ④ 등재 경로 전부 실존.
- 배포/운영: 기존 `ui.askewly.com` 정적 배포 그대로. 새 인프라 없음. push는 사용자 승인 지점이라 여기서 실행하지 않는다.
- 샤딩 축: `groups.yml`의 57 그룹이 이미 배포되어 있고 모든 용어가 그룹을 갖는다 — 그룹을 샤드 경계로 쓴다. 새 분류를 발명하지 않는다.
- 조회 규약: 에이전트가 ① 용어 인덱스(id·이름·한 줄 정의만, 경량) → ② 해당 그룹 샤드 → ③ 필요시 개별 항목 순으로 좁힌다. 인덱스는 "이름으로 찾기"와 "그룹으로 좁히기" 둘 다 지원해야 한다.
- 크기 상한: 샤드 하나가 40KB를 넘지 않게 한다. 근거: 원본 680KB ÷ 57그룹 ≈ 12KB 평균이나 편차가 크므로, 상한 초과 그룹은 하위 분할한다. 상한을 넘는 샤드는 생성기가 명시 에러로 거부한다.
- 검토 후 제외: 화면·서버·데이터스토어·관측·디자인 — 정적 생성물과 문서만 추가한다.

## 결정 로그

- 통짜 배포 vs 샤딩: **샤딩 확정**. 근거: 680KB를 통째로 fetch하면 컨텍스트의 상당량을 사전으로 채우고 정작 구현할 여력을 잃는다(프리모템 시나리오 1). 사용자 결정 불요 — 비용에서 도출.
- 샤드 경계: **그룹(57종) 확정**. 근거: 이미 배포된 축이고 모든 용어가 갖고 있다. 새 축을 만들면 `pattern-taxonomy.md`와 드리프트한다.
- 포맷: 샤드는 YAML(원본과 동일), 인덱스는 마크다운. 근거: 샤드는 기계가 파싱하고 인덱스는 에이전트가 훑는다.
- 그 외 사용자 소유 결정: 없음.
- status: resolved

## Step 트리

- [ ] **step-1 — 샤딩 생성기**
  - Artifact: `scripts/generate-vocabulary-shards.mjs` — `terms.yml`에서 그룹별 샤드 + 경량 인덱스를 생성, 크기 상한 초과 시 명시 에러
  - Files: 읽기 `docs/ui-vocabulary/terms.yml`·`groups.yml`·`scripts/generate-llms-txt.mjs`(생성기 관례) / 쓰기 생성기 + 생성물
  - Dependencies: none
  - Verify: 실행 후 샤드 합집합 id 집합이 원본 562개와 정확히 일치 + 모든 샤드가 크기 상한 이하 + 인덱스 항목 수 562
  - Failure probe: 손실 검사 — 원본에서 용어 1개를 임시로 그룹 없이 만들어 생성기가 **조용히 누락하지 않고 명시 에러로 거부**하는지 확인한다. 조용한 누락은 사전에서 용어가 사라지는 최악의 실패다
  - Commit: changeset `<n>-vocabulary-shard-generator`
- [ ] **step-2 — 조회 규약 문서**
  - Artifact: `docs/design-system/vocabulary-lookup.md` — 에이전트가 용어를 찾는 절차(이름으로 / 그룹으로 / 요구 문장으로), 각 단계의 fetch 대상, 못 찾았을 때의 처리, 인덱스/샤드/항목 3층 구조 설명
  - Files: 읽기 `docs/design-system/entry-protocol.md`·`agent-asset-model.md` / 쓰기 조회 규약 문서
  - Dependencies: step-1
  - Verify: 임의 용어 3개(서로 다른 그룹)를 규약대로 따라가 각각 3 fetch 이내에 항목 본문에 도달 — 실제 fetch 수를 세어 문서에 기록
  - Failure probe: 전체 파일을 받아야만 답이 나오는 경로가 남아 있는지 검사 — 규약 어느 단계에서도 `terms.yml` 원본 전체를 요구하지 않아야 한다. 요구한다면 인덱스 설계가 부족한 것
  - Commit: changeset `<n>-vocabulary-lookup-contract`
- [ ] **step-3 — llms.txt 등재**
  - Artifact: `generate-llms-txt.mjs`에 `Vocabulary` 섹션 추가(조회 규약 + 인덱스 + 그룹 샤드) + 재생성된 `llms.txt` + 배포 복사본
  - Files: 읽기 `scripts/generate-llms-txt.mjs` / 쓰기 같은 파일 + 생성물
  - Dependencies: step-2
  - Verify: 재생성 후 `## Vocabulary` 존재 + 등재 경로 전부가 배포 디렉터리에 실존 + 기존 섹션 항목 수 불변(회귀 없음)
  - Failure probe: 죽은 경로를 고의로 등재해 경로 해석 검사가 잡는지 확인. 못 잡으면 검사를 추가한다 — 죽은 URL은 `entry-protocol.md` 0번 규칙을 발화시켜 에이전트를 세운다
  - Commit: changeset `<n>-llms-vocabulary-section`

## 검증/DoD

- **DoD**: 562개 용어가 손실 없이 샤드로 배포되고, 조회 규약대로 임의 용어가 3 fetch 이내에 도달하며, 어느 경로에서도 원본 전체 fetch를 요구하지 않는다.
- Evidence: `evidence/vocabulary-in-use/vl2-publication.md`

## finding 큐

- (실행 중 append)

## 진행 로그 (append-only)

- 2026-07-21 plan 작성

# PLAN — M35: Figma 브리지 후속 3건

> 생성: 2026-08-06 · 갈래: goal `queue-drain` (4/4) · scope: M14 가 이월한 브리지 부채 3건을 닫는다 —
> ① 스냅숏 청크 옵션화 ② 계약 §2.2 변수 `description` 복사(7월부터 미구현) ③ M14 이후 신설 토큰 sync 재실행.
Status: approved (사용자 승인 2026-08-06 "ㄱㄱ" — goal `queue-drain` 연쇄 M32→M33→M34→M35 일괄 승인. 계획 검증자 1회 반영 완료)

## 이월 경위 (착수 전 실사)

- `docs/reports/2026-08-02-m14-figma-return-path-relaunch.md:16` — "finding 큐 이월: 스냅숏 청크 옵션화 ·
  계약 §2.2 변수 description 복사 미구현(7월부터 잔존) — M15/후속."
- **① 청크**: M14 에서 `use_figma` 대형 반환이 **20kb 에서 절단**돼 102노드 스냅숏을 한 번에 못 받았고,
  **손으로 3회 분할**해 우회했다(같은 보고서 §2). 지금 `scripts/figma-push-snapshot.mjs` 는 루트 1개만 받고
  분할 인자가 없다(실측 — `process.argv[2]` = rootId, `[3]` = outPath 뿐).
- **② description**: 계약은 `docs/design-system/figma-bridge-contract.md` §2.2 마지막 줄에
  "변수 `description` 에 SSOT 의 `$description` 요지를 복사한다 (MCP search 신호)" 라고 적혀 있는데,
  `scripts/generate-figma-variables-sync.mjs` 에 `description` 문자열이 **0건**(grep 실측 2026-08-06) — 미구현.
- **③ 신규 토큰**: M14 의 재동기화(primitive 73·semantic 39)는 2026-08-02 기준이다. 그 뒤 M31 이
  `color.semantic.surface.scrim` 과 primitive `black` 을 신설했다(2026-08-06). **얼마나 벌어졌는지는 추정하지 않고
  step-3 에서 실측한다.**

## 북극성 → milestone → step (위계)

북극성의 **"제작 표면 왕복 — 사람은 Figma 에서 그리고 그 결과가 정본 토큰을 거쳐 코드로 무손실 왕복한다"** 축이다.
왕복은 M14 에서 한 번 닫혔지만(회수 0/0/0), 그 랩이 **손 우회 1건과 미구현 계약 1건**을 남겼고
정본 토큰은 그 뒤로 앞서 나갔다. 브리지는 쓰지 않으면 조용히 낡는 종류의 배선이다.

## run 전 scope 결정

- **포함**: ① 청크 옵션화(스크립트 인자 + 조립) ② §2.2 `description` 복사 구현 ③ 드리프트 실측 후 sync 재실행
  + idempotent 2차 확인 + evidence.
- **제외**: 새 표면 승격(ShowcaseAtlas 외 신규 섹션) · "사용자 변경 → 코드 반영" 구간의 신규 실증
  (M14 가 partial 로 남긴 구간 — 변경이 실제로 생겨야 성립) · Code Connect 매핑 · Figma 파일 구조 개편 ·
  `figma-codex-workflow` 스킬 개편.
- **연쇄**: 없음 — goal `queue-drain` 의 마지막.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped.
  **human gate 1개** — step-3 의 **Figma 실파일 쓰기 직전 승인**(사용자 소유 외부 시스템 변경).
- rollback/cleanup: 스크립트는 커밋 단위 revert. **Figma 쪽 되돌림은 자동이 아니다** —
  upsert 는 이름 키로 값만 갱신하므로 잘못 쓰면 이전 값을 다시 밀어야 한다. 그래서 step-2 에서
  **변수 읽기(dry-run) 모드를 먼저 만들고**, step-3 은 그것으로 쓰기 전 상태를 받아 둔다.
  ⚠ 현행 도구로는 이 스냅숏을 **뜰 수 없다**(검증자 C5) — `figma-push-snapshot.mjs` 는 노드 서브트리 속성용이고
  (`figma.getNodeByIdAsync`·fills/x/y/width) 변수를 읽지 않으며, 동기화 생성기에도 읽기 모드가 없다.
  그래서 읽기 모드 신설이 step-2 의 범위에 들어간다. 임시 페이로드는 `tmp/`(gitignored).

## 스캐폴딩 결정

- source-of-truth: 토큰 SSOT = `tokens/askewly.tokens.json`. 브리지 규약 정본 =
  `docs/design-system/figma-bridge-contract.md`(§2.2 가 이번 ② 의 계약). 동기화 페이로드는
  `scripts/generate-figma-variables-sync.mjs` 산출물이고 Figma 는 **소비처**다.
- 검증: 스크립트 self-test(픽스처) + 실행 결과 수치(created/updated/removed) + **2차 실행 no-op**(계약 §2.4 DoD).
  통합 검증 = Figma 실파일에서 변수 표본을 열어 이름·값·**description** 이 실린 것을 사람이 확인.
- 배포/운영: npm·CF Pages 무관. 외부 시스템 = 사용자의 Figma 실파일(어스큐리 팀). 채널은
  `docs/design-system/figma-bridge-contract.md` §1 의 실행 채널을 그대로 따른다.
- 자기선언 도메인 — **인증은 창을 띄우는 것까지 에이전트가 한다**: 원격 Figma MCP 재인증이 필요하면
  묻지 말고 실행해 브라우저를 띄운다. 다만 **기존 credential 을 덮어쓰는 재인증이면 config 를
  scratchpad 에 백업한 뒤** 실행하고, 스코프를 늘리는 경우 기존 스코프를 전부 나열해 재로그인한다(전역 규약).
- 자기선언 도메인 — **쓰기는 승인 지점**: 값 upsert 는 사용자 소유 파일을 바꾸는 되돌리기 어려운 동작이라
  step-3 에서 **무엇을 몇 개 쓰는지 수치로 제시하고 승인 후** 실행한다.
- 자기선언 도메인 — **청크는 "몇 개씩"이 아니라 "어디부터 어디까지"로 자른다**: 노드 수 기반 분할은
  트리가 바뀌면 경계가 밀려 이어붙이기가 깨진다. 자식 인덱스 구간(`--from`/`--to`)으로 자르고
  조립 시 중복·누락을 id 집합으로 검사한다.
  ⚠ **직속 자식 수가 충분하다는 것은 아직 미확인 가정이다**(검증자 C7 — 실파일 미접속). 그래서 인자를
  **두 벌**로 만든다: ① 자식 인덱스 구간 ② **명시 노드 id 목록**(`--roots <id,id>`). 자식이 1~2개뿐이라
  인덱스 분할로 20kb 아래로 못 자르는 경우 ② 로 내려가면 되고, 어느 쪽을 썼는지는 evidence 에 적는다.
- 검토 후 제외: `use_figma` 반환 한도 자체를 늘리는 시도(우리 소유 아님) · 스냅숏 포맷 변경(회수 diff 가 의존) ·
  Code Connect.

## 결정 로그

- status: resolved

- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① **청크 인자 = 자식 인덱스 구간**(위 자기선언). 기본값은 현행과 동일한 단일 페이로드라
    **기존 호출 방식이 깨지지 않는다**.
  - ② **description 은 `$description` 요지를 그대로**, 없으면 **필드를 생략**한다(빈 문자열로 덮어쓰지 않는다 —
    사람이 Figma 에서 적어 둔 설명을 지울 수 있다).
  - ③ **sync 재실행은 드리프트 실측 후**. "scrim·black 2건"으로 미리 적지 않는다 — 생성기를 돌려
    현재 페이로드와 Figma 현 상태를 대조한 수치가 근거다.
  - ④ **삭제는 "안 한다"가 아니라 "먼저 보여주고 고른다"** (검증자 C6 로 초안 정정). 초안은 "이번 실행에서
    삭제하지 않는다"였으나 **현행 페이로드에 삭제가 이미 박혀 있고**(`generate-figma-variables-sync.mjs:114-116`,
    `:161-163` 의 `v.remove()`), 계약 §2.4 도 자기 컬렉션 orphan 삭제를 **규정**한다. 즉 "안 함"은
    코드·계약 양쪽과 어긋난다. 그래서 ⓐ 생성기에 `--no-remove` 스위치를 추가하고(기본값은 계약대로 삭제)
    ⓑ step-3 에서 **삭제 후보 목록을 먼저 실측해 제시**한 뒤 사용자가 고른 대로 실행한다.
  - ⑤ **"2차 실행 no-op" 의 정확한 기준은 `0/0/0` 또는 updated-only** — 계약 §2.4 원문이 그렇고, 기존 변수는
    매 실행 `updated++` 되므로 `0/0/0` 을 게이트로 걸면 정상 실행이 실패로 판정된다(검증자 m8).
- **위임 결정**: **skip** — 외부 시스템 쓰기와 사람 관측이 섞여 있어 위임 이득이 없다.

## 재생성 장벽

- **step-3**: 동기화 페이로드는 `node scripts/generate-figma-variables-sync.mjs` 산출물이고,
  ② 가 반영된 뒤에 생성해야 description 이 실린다 → **step-2 → step-3 순서 고정**.

## Step 트리

- [x] **step-1 — 스냅숏 청크 옵션화**
  - Artifact: 큰 서브트리를 인자만으로 나눠 받고, 합쳐서 원본과 같은 집합이 된다
  - Files: `scripts/figma-push-snapshot.mjs`(`--from`/`--to` + `--roots <id,id>` 두 벌 + 조립 검사) ·
    self-test 확장(`figma-return-diff.mjs --self-test` 관례에 맞춰 배치)
  - Dependencies: 없음
  - Verify: **편집 전 기준 페이로드를 `git show HEAD:scripts/figma-push-snapshot.mjs` 실행분으로 먼저 확보**한 뒤,
    인자 없이 실행하면 **바이트 동일**(회귀 없음) · 픽스처 트리를 2분할해 조립하면 노드 id 집합이 단일 실행과
    **일치**(중복 0·누락 0) · 잘못된 구간(역순·범위 초과) 명시 실패 ·
    `node scripts/figma-return-diff.mjs --self-test` PASS(포맷 무변경 확인)
  - Failure probe: 경계에서 1개를 **일부러 빠뜨린** 조립을 만들어 검사가 누락을 잡는지.
    ⚠ **원래 결함(20kb 절단) 해소의 증명은 여기서 끝나지 않는다** — 로컬 픽스처는 절단을 재현하지 못한다.
    실증은 step-3 의 라이브 회수로 넘긴다(검증자 C7)
  - Risk: 기계적 (페이로드 포맷을 건드리면 회수 diff 가 깨진다 — 포맷 무변경을 Verify 로 고정)
  - Commit: `feat(figma): 스냅숏 페이로드 구간 분할 옵션 (M35 step-1)`

- [x] **step-2 — `description` 복사 구현 + 읽기(dry-run) 모드 + `--no-remove`**
  - Artifact: 페이로드가 `description` 을 싣고, **쓰기 전에 현재 상태를 읽을 수단**과 삭제를 끌 스위치가 생긴다
  - Files: `scripts/generate-figma-variables-sync.mjs`(① description ② 변수 읽기 페이로드 생성 모드
    ③ `--no-remove`) · `docs/design-system/figma-bridge-contract.md`(§2.2 구현 상태·빈 값 처리 + §2.4 에
    `--no-remove` 의 존재와 기본값 명시) · `research/figma-variables-sync-2026-07.md` Changelog
  - Dependencies: 없음
  - Verify: 생성 페이로드에 `description` 이 실림 · SSOT 에 `$description` 이 **없는** 토큰은 필드 자체가
    생략됨(빈 문자열 아님) · 페이로드가 유효 JS 로 파싱됨(따옴표·줄바꿈 이스케이프 — M14 의 U+2028 함정 계열) ·
    **읽기 모드가 쓰기 호출을 하나도 포함하지 않음**(`setValueForMode`·`remove`·`create` 문자열 0건 — grep 으로 확인) ·
    `--no-remove` 로 생성한 페이로드에 `v.remove()` **0건** · 생성기 2회 실행 산출 동일(멱등)
  - Failure probe: `$description` 에 따옴표·줄바꿈·유니코드 줄구분자를 넣은 픽스처로 페이로드를 만들어
    **파싱이 깨지지 않는지** 확인(M14 가 실제로 밟은 함정)
  - Risk: 위험 (빈 description 으로 사람이 적어 둔 설명을 덮어쓰면 조용한 데이터 손실 — 생략 규칙이 그 방어)
  - Commit: `feat(figma): 변수 description 복사 — 계약 §2.2 구현 (M35 step-2)`

- [x] **step-3 — 드리프트 실측 + sync 재실행 + 청크 회수 라이브 실증 (human gate)**
  - Artifact: Figma 변수가 SSOT 와 다시 같아지고 description 이 실리며, **큰 서브트리를 절단 없이 회수**한다
  - Files: `evidence/queue-drain/m35-figma-followups.md` · `research/figma-variables-sync-2026-07.md` Changelog ·
    `changesets/20260806-m35-figma-followups/README.md`
  - Dependencies: step-2 (재생성 장벽 — description 이 실린 페이로드여야 한다)
  - Verify: **쓰기 전** step-2 읽기 모드로 현재 변수 상태 스냅숏 확보(롤백 근거) ·
    드리프트 수치 제시(신규 N·갱신 M·**삭제 후보 K 를 이름 목록으로**) → **사용자 승인 후 실행**
    (삭제를 원치 않으면 `--no-remove`) · 실행 결과 created/updated/removed 기록 ·
    **2차 실행이 `0/0/0` 또는 updated-only**(계약 §2.4 원문 기준 — `0/0/0` 만으로 걸지 않는다) ·
    Figma 실파일에서 표본 변수 3종의 이름·값·**description** 을 사람이 확인(스크린샷) ·
    **청크 실증** — M14 가 절단당한 그 서브트리(102노드 규모, 노드 35:3)를 step-1 의 분할 인자로 **실제 회수**해
    조립하고, 조립 결과 노드 수·id 집합이 기대와 일치하며 어느 인자(인덱스 구간 / `--roots`)를 썼는지 기록
  - Failure probe: ① description 이 **없는** 토큰 1종을 표본에 포함해 기존 설명이 지워지지 않았는지 확인
    ② 청크를 **일부러 1구간 빠뜨려** 조립해 누락 검사가 발동하는지 라이브 데이터로 확인
  - Risk: 위험 (사용자 소유 외부 파일 쓰기 — 승인 게이트·사전 스냅숏·삭제 금지 3중 방어, 재인증 전 credential 백업)
  - Commit: `docs(m35): Figma 재동기화 evidence + changeset`

## 검증/DoD

**DoD**: ① 스냅숏 스크립트가 구간 분할을 지원하고 조립 결과가 단일 실행과 동일하며 **기본 호출은 무변경**,
그리고 **M14 가 절단당한 서브트리를 라이브에서 실제로 나눠 회수**한다 ② 동기화 페이로드가 계약 §2.2 대로
`description` 을 싣고 빈 값으로 기존 설명을 덮지 않으며, **쓰기 전 읽기(dry-run)** 수단과 `--no-remove` 가 존재한다
③ M14 이후 드리프트가 실측 수치로 보고되고 **삭제 후보는 이름 목록으로 승인**받으며, 반영 후
**2차 실행이 `0/0/0` 또는 updated-only** 이고, 사람이 Figma 실파일에서 표본 3종을 확인한다.

**실패 모드 5항**:
1. 포맷 변경으로 회수 diff 파손 → step-1 Verify(기본 호출 바이트 동일 + self-test)
2. 빈 description 덮어쓰기 → 필드 생략 규칙 + step-3 probe ①
3. 페이로드 파싱 파손(따옴표·U+2028) → step-2 probe (M14 실측 함정)
4. **승인 문구와 코드 동작 불일치** → "삭제 안 함"으로 승인받고 페이로드가 삭제하는 사고(검증자 C6).
   `--no-remove` 실물 + 페이로드 grep 으로 방어
5. **절단 문제가 안 고쳐진 채 전 게이트 통과** → step-3 의 라이브 청크 회수가 유일한 실증(검증자 C7)

**E2E 표면**: API/외부 시스템 — 실제 Figma 파일에 쓰고, 2차 실행 no-op 을 확인하고, 사람이 실파일에서 관측.

## 수치 출처

- 이월 문구 — `docs/reports/2026-08-02-m14-figma-return-path-relaunch.md:16`
- 20kb 절단·손 3분할 — 같은 보고서 §2
- M14 동기화 규모(primitive 73·semantic 39, 2차 0/0) — 같은 보고서 §1·§3
- §2.2 description 계약 — `docs/design-system/figma-bridge-contract.md` §2.2
- description 미구현 — `scripts/generate-figma-variables-sync.mjs` grep 0건 (2026-08-06)
- 현행 인자 2개뿐 — `scripts/figma-push-snapshot.mjs:11`·`:20`
- 페이로드에 삭제가 박혀 있음 — `scripts/generate-figma-variables-sync.mjs:114-116`·`:161-163`(`v.remove()`)
- "2차 실행 = 0/0/0 **또는 updated-only**" — `docs/design-system/figma-bridge-contract.md` §2.4
- M14 이후 토큰 신설(scrim·black) — `docs/reports/2026-08-06-m31-dark-inversion-cleanup.md` (**수량은 step-3 실측**)

## finding 큐

(실행 중 발견분을 여기 append)

## 진행 로그

- 2026-08-06 작성 — goal `queue-drain` 연쇄 4/4.
- **step-1 완료 (2026-08-06)** — `--from/--to` + `--roots` + `--assemble` + `--self-test`(7/7).
  기준 페이로드를 편집 전에 확보해 **바이트 동일** 확인(cmp), `figma-return-diff --self-test` 4항 PASS.
  실측 버그 1건 자체 적발: `--assemble` 이 후속 플래그에서 안 끊겨 `--expect 4` 의 값을 파일로 읽었다.
- **step-2 완료 (2026-08-06)** — description 복사 + `--read`(쓰기 호출 0건 grep 확인) + `--no-remove`(`v.remove()` 0건).
  **Failure probe 성립** — `$description` 에 따옴표·LF·U+2028·U+2029·백슬래시를 넣으니 수정 전엔 **날것 U+2028 이 페이로드에 실렸고**,
  직렬화 이스케이프 후 날것 0건 + 값 무손실 복원. 74종 중 5종만 description 보유(69종 생략), 빈 문자열 0건.
- **step-3 완료 (2026-08-06, 사용자 승인 "ㄱㄱㄱ")** — 드리프트 수치를 먼저 제시하고 승인 후 실행.
  primitive `1/73/0`, semantic `1/39/0 · unresolved 0` — **예고와 정확히 일치**. 2차 실행 `0/74/0`·`0/40/0` = **updated-only**
  (계약 §2.4 기준 — `0/0/0` 만 걸면 정상 실행이 실패로 판정된다). 실파일 표본 4종 확인: scrim·primary-hover 는 description 실림,
  `black`·`surface/base` 는 **(없음)** 으로 남아 생략 규칙 실증(probe ①). 총 114종 중 description 23종 — 예측치 일치.
  ⚠ **계획의 실증 대상이 사라졌다** — M14 가 절단당한 `35:3`(102노드)이 파일에 **없다**(`node not found`).
  전 페이지를 훑어도 최대 서브트리가 26노드(`6:3`)라 20kb 절단이 재현되지 않는다. 그래서 청크 실증은
  `6:3` 으로 대체했다: 단일 26 → `0..0`=13 + `1..1`=13 → 조립 **26 unique·중복 0**, 범위 초과는 라이브에서 거부,
  청크 하나 빼면 조립 FAIL(probe ②). **"절단을 넘겼다"는 증명되지 않았고 evidence·changeset 에 그대로 적었다.**
- 2026-08-06 계획 검증자 반영 — 치명 3건(변수 읽기 수단 부재 → step-2 로 신설 · 삭제 D④ 가 코드/계약과 정반대 →
  `--no-remove` + 목록 승인으로 정정 · 절단 해소 실증 부재 → step-3 라이브 청크 회수 추가) + 경미 2건
  (`no-op` 기준 정정 · 기준 바이트 사전 확보).

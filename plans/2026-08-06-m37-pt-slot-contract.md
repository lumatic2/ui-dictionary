# PLAN — M37: `/pt` 레이아웃 슬롯 계약을 생성 시점 강제로

> 생성: 2026-08-06 · 갈래: goal `findings-sweep` (2/2) · scope: M33 Presenton 벤치의 유일한 A 판정 —
> "레이아웃을 먼저 고르고 그 레이아웃의 스키마를 출력 계약으로 준다"는 원리를 `/pt` 의 G2→G3 에 흡수한다.
> 코드 복사가 아니라 원리 차용 (`research/2026-08-06-m33-presenton-bench.md` §4-①).
Status: on-hold (2026-08-06 사용자 — "/pt 건드는 건 따로 작업하자, 왜 건드는지 맥락을 모르겠다".
승인되지 않음 — 재상정 시 M33 벤치 §4-① 맥락(레이아웃 스키마를 생성 계약으로)을 먼저 공유하고 논의부터.
milestone 번호 M37 은 재상정 시점의 순번으로 다시 받는다)

## 북극성 → milestone → step (위계)

북극성의 "슬라이드 디자인" 축 + "에이전트용 디자인 시스템" 축. 현재 `/pt` 의 `slides.json` 스키마는
슬라이드를 **범용 객체 1종**으로 검증한다(`slides.schema.json:125` `additionalProperties: true`, 필수는
`no/slug/section/layout/title` 5개뿐) — 레이아웃이 19종인데 어느 레이아웃이든 같은 계약을 받는다.
레이아웃별 제약은 `layout-meta.json` 의 `maxItems` 류가 **warning** 으로만 발화한다(`validate-slides.mjs:202`).
그래서 G3 문구 작성 시점에 "이 레이아웃이 어떤 슬롯을 몇 개 요구하는가"가 계약이 아니라 관례로만 존재하고,
빈 슬롯·과잉 슬롯이 렌더 단계에서야 드러난다. Presenton 은 이걸 생성 계약으로 앞당겼고, 그 원리만 가져온다.

## run 전 scope 결정

- **포함**: ① 19종 레이아웃별 슬롯 계약 데이터(필수/허용 필드·items 범위) 신설 + `validate-slides.mjs` 가
  계약 위반을 **error** 로 발화 + 기존 fixture 15종 무파괴 ② SKILL.md G2→G3 절차 배선(구성안 확정 시
  슬롯 계약을 초안 작성 계약으로 제시, G3 제시 전 validate 통과 의무) + 배포 + evidence + findings §H 정리.
- **제외**: 자동 레이아웃 배분(§4-② — D1) · 새 레이아웃 추가 · 렌더러(`build-slides.mjs`) 변경 ·
  Presenton 코드 차용(원리만 — Apache-2.0 이라 가능하지만 불필요, §4-① 판정문) · 오버플로 체커·린트 변경.
- **연쇄**: 없음 (goal 마지막). 완주 시 `/harness-done`.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. human gate 없음
  (UI 산출물 무변경 — 검증 층·절차 문서만 변경).
- rollback/cleanup: 커밋 단위 revert (custom-skills 레포). 배포본은 `setup.sh` 재실행으로 동기화.
  cross-repo 주의(M30 선례): 소스 = `~/projects/custom-skills/promoted/pt/`, 배포본 `~/.claude/skills/pt/`
  **직접 편집 금지** — `bash ~/projects/custom-skills/setup.sh` 로만.

## 스캐폴딩 결정

- source-of-truth: 슬롯 계약 정본 = `promoted/pt/templates/layout-meta.json` 의 레이아웃 항목에 `slots` 절 신설
  (별도 파일을 만들지 않는다 — 레이아웃 메타는 이미 이 파일 1곳이고, enum 동기 게이트가
  `validate-slides.mjs:151` 에 이미 있다). 검증 정본 = `validate-slides.mjs`. 절차 정본 = `SKILL.md` §3(게이트 표)·§7(제작 흐름).
- 검증: 기존 fixture 15종(`fixtures/`) 전건 validate PASS(소급 무파괴) + 음성 probe(계약 위반 덱이 error) +
  `smoke-runner.mjs` + 배포본 재검증·소스↔배포본 hash 대조(M30 선례). **통합 검증** = 실덱 1개를 새 절차로
  G2→G3 순서로 만들어 계약이 실제로 초안을 구속하는지 확인(자기 시연 — 사용자 승인 게이트는 스킬 사용 시의
  것이므로 이 milestone 에서는 fixture 급 미니 덱으로 충분).
- 배포/운영: `custom-skills` 커밋 + `setup.sh` 배포 + 배포본에서 validate 재확인. ui-dictionary 쪽은
  evidence·findings·changeset 문서 커밋. push 는 세션 일괄.
- 자기선언 도메인 — **계약은 실측에서 출발한다**(M32 원리 재사용): 19종 각각의 필수/허용 필드와 items 범위는
  머리로 짓지 않고 **fixture 15종 + 렌더러 실체(`templates/src/renderers/static.mjs`·`interactive.mjs`·
  `builder-core.mjs`)가 실제로 읽는 필드**를 실측해 도출한다(`build-slides.mjs` 는 진입점뿐 — 검증자 실측).
  렌더러가 안 읽는 필드를 요구하는 계약, fixture 가 위반하는 계약은 둘 다 오류다.
- 자기선언 도메인 — **error 는 구조 위반만**: 필수 슬롯 부재·미허용 필드·items 범위 이탈 = error.
  길이·밀도·문구 품질은 기존 warning(폴리시)·거장 린트에 남긴다 — 계약과 취향을 섞지 않는다.
- 자기선언 도메인 — **G2→G3 배선의 형태**: G2 구성안 승인 직후, 확정된 각 슬라이드의 레이아웃 슬롯 계약을
  표로 제시하고 그 계약 안에서 문구를 작성한다. G3 제시 전 `validate-slides.mjs` 통과가 의무(현행 §9 검증은
  빌드 전 1회 — 이를 G3 앞으로 당긴다). 스키마 자체를 레이아웃별 19벌로 쪼개지 않는다 — 계약 데이터는
  layout-meta 1곳, 검증기 1곳이 원리(스키마 allOf 19분기는 유지비만 늘린다).
- 검토 후 제외: JSON Schema `allOf/if-then` 레이아웃 분기(위) · 자동 배분(§4-②) ·
  계약의 LLM 프롬프트 자동 생성(절차 문서로 충분 — 스킬은 에이전트가 읽는다).

## 결정 로그

- status: resolved
- (사용자 소유 D1 은 추천안으로 사전 소진 — 승인 제시에 병기해 확정받는다)

- **D1 — §4-② 자동 레이아웃 배분 "후보 3안 제시" 포함 여부 [사용자 소유]**: **제외 (추천)**.
  근거: M33 판정 B(관찰만) + "전면 자동화는 구성안 사람 승인 게이트를 무의미하게 만든다"(§4-② 원문).
  후보 제시 수준도 G2 게이트의 판단을 선점하는 면이 있어, 슬롯 계약이 자리잡은 뒤 재평가가 싸다.
  finding 은 보류 사유·날짜를 달아 유지.
- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① 계약 데이터는 `layout-meta.json` 확장, 검증은 `validate-slides.mjs` — 새 파일·새 스키마 분기 없음.
  - ② 계약은 fixture+렌더러 실측 기반 — 소급 무파괴가 도출 조건이다(fixture 를 계약에 맞추는 방향 금지;
    fixture 가 드러낸 실사용이 계약의 하한이다).
  - ③ error/warning 경계는 구조/취향 — 구조 위반만 error.
  - ④ SKILL.md 는 G2→G3 사이에 "슬롯 계약 제시 + 계약 내 작성 + G3 전 validate" 3문장 급으로 최소 배선 —
    절차 비대화 금지(스킬 문서는 매 세션 로드된다).
  - ⑤ findings §H 정리: ①번(이 milestone)·③번(stale 정정 — 이 계획서가 실측 19종·standalone 보유를 인용함으로써
    소비 지점이 갱신됨)을 `[x]` + 닫은 milestone 표기, ②번(자동 배분)은 D1 결과를 날짜와 함께 병기.
- **위임 결정**: **skip** — 표면이 스킬 1개에 좁고, 계약 도출이 실측 기계 작업이다. 계획 검증자 1회는 승인 전 수행.

## 재생성 장벽

- **step-2**: `setup.sh` 배포 후 **배포본에서** validate·fixture 재확인 + 소스↔배포본 hash 대조
  (배포 누락 시 다음 `/pt` 세션이 옛 계약으로 돈다 — M30 probe ⓐ 재사용).

## Step 트리

- [ ] **step-1 — 슬롯 계약 실측 도출 + validate error 발화**
  - Artifact: 19종 레이아웃 각각에 실측 기반 슬롯 계약(`slots`: 필수/허용 필드·items 범위)이 선언되고,
    위반이 validate 에서 error 로 잡히며, 기존 fixture 15종은 전건 통과한다
  - Files: `~/projects/custom-skills/promoted/pt/templates/layout-meta.json` ·
    `~/projects/custom-skills/promoted/pt/templates/validate-slides.mjs`
  - Dependencies: 없음
  - Verify: fixture 15종 전건 validate PASS · 음성 probe — 필수 슬롯 제거 덱·미허용 필드 덱·items 초과 덱
    3종이 각각 error(exit 1) · 계약 커버리지 19/19(계약 없는 레이아웃 0 — 검증기가 자기검사로 발화) ·
    렌더러 실측 대조(계약이 요구하는 필드를 렌더러 실체 — `templates/src/renderers/static.mjs`·
    `interactive.mjs`·`builder-core.mjs` — 가 실제로 읽는다; `build-slides.mjs` 는 4줄 진입점뿐, 검증자 실측)
  - Failure probe: fixture 1개에서 필수 필드를 지워 error 가 나는 것 + 되돌리면 PASS 인 것을 왕복 확인 —
    한 방향만 확인하면 "항상 통과하는 계약"(no-op)을 못 잡는다
  - Risk: 기계적 (실측 도출 — 판단 여지는 items 범위의 하한 정도, 렌더러가 정본)
  - Commit: (custom-skills) `feat(pt): 레이아웃별 슬롯 계약 실측 도출 + validate error 발화`

- [ ] **step-2 — G2→G3 절차 배선 + 배포 + findings 정리**
  - Artifact: SKILL.md 가 "구성안 확정 → 슬롯 계약 제시 → 계약 내 문구 작성 → G3 전 validate" 를 절차로 갖고,
    배포본이 소스와 일치하며, findings §H 가 정리된다
  - Files: `~/projects/custom-skills/promoted/pt/SKILL.md`(§3·§7·§9 최소 배선) ·
    `docs/findings.md`(§H ①③ `[x]`·② 보류 병기) · `evidence/findings-sweep/m37-pt-slot-contract.md` ·
    `changesets/20260806-m37-pt-slot-contract/README.md`
  - Dependencies: step-1
  - Verify: 미니 실덱 1개를 새 절차(G2 구성안→계약 표→문구→validate→빌드)로 통과 · `smoke-runner.mjs` PASS ·
    `bash ~/projects/custom-skills/setup.sh` 배포 후 배포본 validate 재확인 + 소스↔배포본 hash 일치 ·
    findings §H diff 가 ①③ close·② 병기뿐임을 확인
  - Failure probe: 배포 전 배포본(`~/.claude/skills/pt/`)에서 옛 validate 로 계약 위반 덱이 **통과**하는 것을
    먼저 기록 → 배포 후 같은 덱이 error — 배포가 실제로 갈아끼웠다는 증거
  - Risk: 기계적
  - Commit: (custom-skills) `docs(pt): G2→G3 슬롯 계약 배선` · (ui-dictionary) `docs(m37): changeset + evidence + findings 정리`

## 검증/DoD

**DoD**: 19종 레이아웃 전부에 실측 기반 슬롯 계약이 선언되고, 구조 위반이 validate error 로 발화하며,
기존 fixture 15종은 무파괴다. SKILL.md 절차가 G3 앞에 계약 제시·validate 를 배선하고, 배포본이 소스와
일치한다. findings §H 가 정리된다(①③ close, ② 보류 병기).

**실패 모드 4항**:
1. 항상 통과하는 계약(no-op) — step-1 probe 왕복 확인
2. fixture 소급 파괴 — 계약 도출 조건 자체가 실측(fixture 하한), 15종 전건 게이트
3. 렌더러가 안 읽는 필드를 요구 — 렌더러 실측 대조를 Verify 에 포함
4. 배포 누락으로 옛 계약 운행 — step-2 probe(배포 전후 대조) + hash 대조

**E2E 표면**: CLI/스크립트 — validate 실행 exit code + 미니 실덱 1개의 절차 통과(구성안→계약→문구→validate→빌드).

## 수치 출처

- 레이아웃 **19종** — `layout-meta.json` 실측 (2026-08-06; `research/2026-07-31-html-upgrade-goal-refs.md` §0 의
  "18종"은 stale — findings §H 정정 승계)
- 단일 HTML 배포 **보유** — `templates/export-standalone.mjs` 실물 (같은 stale 정정 승계)
- 스키마 필수 5개·`additionalProperties: true` — `slides.schema.json:125-133` 실측
- maxItems 가 warning — `validate-slides.mjs:202` · enum 동기 게이트 — `:151`
- fixture **15종** — `fixtures/` ls 실측 (2026-08-06)
- A 판정 원문 — `research/2026-08-06-m33-presenton-bench.md` §4-① · 등록 — `docs/findings.md` §H

## finding 큐

(실행 중 발견분을 여기 append)

## 진행 로그

- 2026-08-06 작성 — goal `findings-sweep` 연쇄 2/2.
- 2026-08-06 계획 검증자 반영 — 경미 1건: 렌더러 실측 대상을 `build-slides.mjs`(4줄 진입점)에서
  실체(`src/renderers/static.mjs`·`interactive.mjs`·`builder-core.mjs`)로 정정. 나머지 인용 수치는 전건 일치 판정.

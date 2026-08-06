# PLAN — M33: Presenton 정밀 벤치마크

> 생성: 2026-08-06 · 갈래: goal `queue-drain` (2/4) · scope: 2025 등장한 AI-우선 오픈소스 덱 생성기
> [presenton/presenton](https://github.com/presenton/presenton) 을 **실물로** 우리 `/pt` 트랙과 대조하고,
> 차용/기각을 항목별로 판정해 남긴다. 구현은 이번 범위 밖(사용자 확정).
Status: approved (사용자 승인 2026-08-06 "ㄱㄱ" — goal `queue-drain` 연쇄 M32→M33→M34→M35 일괄 승인. 계획 검증자 1회 반영 완료)

## 이 건의 출처와 의도 (착수 전 실사)

- 등록 지점: `research/2026-07-31-html-upgrade-goal-refs.md` §1 — "목적이 우리와 가장 가까운 최근 진입자 →
  벤치마크 대상", §4 **D2 "Presenton 벤치마크 정밀 조사 (별도 리서치 후보)"**.
- 이월 경로: `archive/plans/2026-07-31-hu4-live-proof.md` finding 큐 → `evidence/html-upgrade/hu4-live-proof.md`
  goal 마감 이월분 → 핸드오프 큐 ②.
- **소비처는 이 레포가 아니라 `/pt` 스킬**(`~/projects/custom-skills/promoted/pt/`)이다. 산출물은 이 레포
  `research/` 에 남고, 채택분은 별도 milestone 으로 `/pt` 에 반영한다.
- `research/` 선조회(2026-08-06): Presenton 을 다룬 문서는 위 §1 한 문단이 **전부**다 — 재조사가 아니라 신규.

## 북극성 → milestone → step (위계)

북극성의 **"슬라이드 디자인"** 축이다. 우리 덱 트랙은 게이트 G1~G7·토큰 SSOT·export 3트랙을 이미 갖고 있고
(`research/2026-07-31-html-upgrade-goal-refs.md` §0), 부족한 쪽은 *생성 자동화의 폭*이다.
Presenton 은 그 폭을 정면으로 겨냥한 최근 진입자라, "우리가 뭘 이미 앞서 있고 뭘 안 갖고 있나"를
**추정이 아니라 실물로** 확정할 유일한 대상이다.

## run 전 scope 결정

- **포함**: ① 레포 실사(아키텍처·라이선스·생성 파이프라인·템플릿 모델) + **실구동 시도**로 산출물 확보
  ② `/pt` 트랙과 항목별 대조표 + 차용/기각 판정 + finding 등록.
- **제외**: 채택분의 실제 구현·`/pt` 스킬 수정·배포(사용자 확정 — 별도 milestone 후보) ·
  reveal.js Auto-Animate 등 D2 밖 차용 후보 · 이 레포 코드 변경.
- **연쇄**: **M34 → M35** (goal `queue-drain` 잔여).
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped.
  **risk gate 1개** — 실구동에 LLM API 키가 필요하면 **키를 쓰지 않고** 멈춘다(아래 D1).
- rollback/cleanup: 산출물은 `research/` 문서 1건이라 revert 로 끝. **실구동 잔재 정리 의무** —
  컨테이너·로컬 서버·클론은 scratchpad 에 두고 종료 시 제거(`docker ps` → 정지, 포트 점유 확인).

## 스캐폴딩 결정

- source-of-truth: 벤치 대상의 정본은 **upstream 레포 실물**(클론 tag/commit 고정 — 문서에 SHA 기록).
  우리 기준선의 정본은 `/pt` 스킬 소스(`~/projects/custom-skills/promoted/pt/`)이며
  `research/2026-07-31-html-upgrade-goal-refs.md` §0 은 그 요약이므로 **대조 시 소스를 다시 본다**.
- 검증: 대조표의 각 행이 **출처(파일 경로 또는 URL+접근일)** 를 갖는다. 실구동 산출물은 스크린샷으로 남긴다.
  통합 검증 = **같은 주제로 양쪽 덱을 1편씩 만들어 나란히 본다**(우리 것은 기존 산출물 재사용 가능).
- 배포/운영: 배포 없음. 산출물 = `research/2026-08-06-m33-presenton-bench.md` + `docs/findings.md` 갱신.
- 자기선언 도메인 — **인용 규칙 엄수**: 외부 사실은 전부 출처 URL/경로 + 접근일. star 수·버전 등
  수치를 기억으로 적지 않는다(전 레포 규칙). 확인 못 한 항목은 "미확인"으로 남긴다.
- 자기선언 도메인 — **라이선스 먼저**: 코드 차용 후보가 나오면 라이선스를 먼저 확인하고
  `docs/design-system/absorption-criteria.md` 의 A/B/C 어휘로 판정한다(재서술 열화 금지 조항 포함).
- 검토 후 제외: 채택분 구현 · Presenton 이외 생성기 재조사(§1 표는 2026-07-31 실사로 충분) ·
  우리 덱 트랙의 개선 실행.

## 결정 로그

- status: resolved

- **D1 — Presenton 범위 [사용자 소유 · 확정 2026-08-06]**: **정밀 벤치 리서치까지.** 차용 구현은 별도.
- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① **실구동은 "무료 경로에 한해" 시도한다** — 로컬 모델(Ollama)·무료 티어·데모 사이트 순으로 시도하고,
    **유료 API 키 투입이 필요하면 실행하지 않고** 공개 산출물 샘플로 대체한 뒤 그 사실을 **partial 로 명시**한다.
    근거: 크리덴셜·과금은 사용자 소유이고, 벤치의 핵심 질문(아키텍처·템플릿 모델·산출 품질)은
    공개 산출물로도 대부분 답이 된다.
    - **폴백 시 1:1 대조 방법도 여기서 확정한다(실행 중 재질문 없음)**: 공개 샘플은 주제를 우리가 못 정하므로,
      **그 샘플의 주제에 맞춰 우리 `/pt` 로 덱 1편을 만들어** 나란히 본다(우리 쪽은 생성이 가능하다).
      그것도 불가하면 대조를 **주제 무관 항목**(타이포 위계·레이아웃 밀도·이미지 처리·코드 산출 형태)으로
      좁히고 그 축소를 문서에 적는다.
  - ② **대조 축은 우리 게이트 구조를 그대로 쓴다** — 원본(single source)·레이아웃 모델·테마/토큰·
    생성 파이프라인·검증 게이트·export 트랙·확장성. 새 평가 프레임을 발명하지 않는다.
  - ③ **판정 어휘는 A/B/C**(absorption-criteria) 를 그대로 쓴다.
- **위임 결정**: **use (조사 1회, 하위 모델)** — 레포 실사는 넓게 읽고 요약하는 작업이라 위임 이득이 크다.
  단 **대조표 작성과 판정은 부모가 한다**(판단 밀도가 높고 틀리면 하류 milestone 을 오염시킨다).
  child 결과는 부모가 파일 경로 표본으로 재확인한 뒤에만 문서에 싣는다.

## Step 트리

- [x] **step-1 — 레포 실사 + 산출물 확보**
  - Artifact: Presenton 이 무엇을 어떻게 만드는지가 출처와 함께 정리되고, 실제 산출물 1편이 손에 있다
  - Files: `research/2026-08-06-m33-presenton-bench.md`(§1 실사 · §2 산출물) ·
    (클론·구동 잔재는 scratchpad — 레포에 두지 않는다)
  - Dependencies: 없음
  - Verify: 레포 클론 commit SHA 기록 · 라이선스 파일 실물 확인 · 생성 파이프라인의 진입점 파일 경로 명시 ·
    산출물 1편(실구동 또는 공개 샘플)의 스크린샷 확보 · 실구동 여부와 그 이유를 문서에 명시
  - Failure probe: 실구동이 유료 키를 요구하는지 **먼저 확인**하고, 요구하면 그 지점에서 멈춰 대체 경로로
    전환한 사실을 기록한다(조용히 키를 쓰지 않는다)
  - Risk: 위험 (설치·구동이 시간을 삼킨다 — 무료 경로 3회 실패 시 대체 경로로 전환해 partial 로 진행, 복귀 없음)
  - Commit: `docs(research): Presenton 레포 실사 + 산출물 확보 (M33 step-1)`

- [x] **step-2 — `/pt` 대조표 + 차용 판정**
  - Artifact: 항목별로 "우리가 앞선 것 / 뒤진 것 / 차용 후보"가 근거와 함께 갈린다
  - Files: `research/2026-08-06-m33-presenton-bench.md`(§3 대조표 · §4 판정 · §5 후속 후보) ·
    `docs/findings.md`(차용 후보 등록)
  - Dependencies: step-1
  - Verify: 대조표 전 행이 **양쪽 출처**를 가짐(우리 쪽 = `/pt` 소스 파일 경로, 상대 쪽 = 레포 경로/URL+접근일) ·
    판정이 A/B/C 어휘 · **덱 1:1 육안 대조** 1회(스크린샷 양쪽 — 실구동이면 같은 주제, 폴백이면 D1 ① 의 대체 방법) ·
    `research/2026-07-31-html-upgrade-goal-refs.md` §4-D2 에 백링크 · 채택 후보는 finding 으로 등록
  - Failure probe: 우리 기준선을 §0 요약이 아니라 **`/pt` 소스에서** 재확인 — 요약이 낡아 "이미 보유"로
    적힌 항목이 실제로는 없거나 반대인 경우를 표본 3항으로 검사한다
  - Risk: 위험 (기억으로 우리 능력을 과대평가하는 것이 이 종류 문서의 상습 실패다 — Failure probe 가 그 지점)
  - Commit: `docs(research): Presenton 대조표·차용 판정 (M33 step-2)`

## 검증/DoD

**DoD**: `research/2026-08-06-m33-presenton-bench.md` 가 ① 레포 실사(commit SHA·라이선스·파이프라인 진입점)
② 실물 산출물 1편(실구동 또는 공개 샘플 — 어느 쪽인지 명시) ③ `/pt` 와의 항목별 대조표(양쪽 출처 필수)
④ A/B/C 판정과 근거 ⑤ 후속 후보의 finding 등록을 갖는다. 유료 크리덴셜은 사용하지 않는다.
실구동을 못 했으면 결과는 **partial** 로 적는다.

**실패 모드 3항**:
1. 우리 능력 과대평가 → 기준선을 `/pt` 소스에서 표본 재확인(step-2 probe)
2. 유료 키 요구 → risk gate 로 멈추고 대체 경로 + partial 명시
3. 수치 발명 → 인용 규칙(출처 URL/경로 + 접근일). 확인 못 하면 "미확인" 그대로

**E2E 표면**: CLI/스크립트 — Presenton 을 실제로 구동(또는 구동 불가 사유 + 공개 산출물 확보)하고
양쪽 덱을 실물로 나란히 본다.

## 수치 출처

- D2 등록 문구 — `research/2026-07-31-html-upgrade-goal-refs.md` §4-D "D2 Presenton 벤치마크 정밀 조사"
- 우리 트랙 기준선(게이트 G1~G7·레이아웃 18종·export 3트랙) — 같은 문서 §0 (**step-2 에서 소스 재확인 대상**)
- 이월 경로 — `archive/plans/2026-07-31-hu4-live-proof.md:61` · `evidence/html-upgrade/hu4-live-proof.md:20`

## finding 큐

(실행 중 발견분을 여기 append)

## 진행 로그

- 2026-08-06 작성 — goal `queue-drain` 연쇄 2/4.

- **step-1·2 완료 (2026-08-06)** — 산출물이 문서 1개라 커밋을 합쳤다(계획은 step 별 커밋이었다 — 드리프트 1건 기록).
  **실구동 성공(partial 아님)** — 유료 키 0. 지원 제공자 16종 중 `ollama` 로 로컬 `gemma4:12b`, 이미지 제공자
  **미설정으로도 생성 완료**(README 예시는 전부 pexels 키를 붙이지만 필수 아님 — 실측). 아웃라인 43초·슬라이드 6분,
  5장 덱 실물 + 스크린샷 확보. D1 ① 의 폴백 경로는 발동하지 않았다.
  ⚠ **배포 문서에 없는 함정 1건** — 앱이 컨테이너 안에서 **루프백에만 바인딩**해 `-p` 매핑이 통하지 않는다
  (호스트 000 / 내부 200). `--network host` 로도 `/` 가 500. 컨테이너 안에 Node TCP 포워더를 띄워 열었다.
  ⚠ **Docker Desktop 을 띄웠다** — 그 부작용으로 사용자의 기존 컨테이너(n8n·supabase)가 자동 기동됐다.
  내 컨테이너 2개만 제거했고 **사용자 것은 건드리지 않았다**. 이미지 5.27GB 는 남겨 뒀다(재실행 대비 — 지울지는 사용자 몫).
  **step-2 Failure probe 성립** — 기준선을 `/pt` 소스에서 재확인해 요약의 stale **2건**을 잡았다:
  `§0 레이아웃 18종` → 실측 **19종**(`templates/layout-meta.json`), `§1 단일 HTML 배포 미보유` → 실제 **보유**
  (`templates/export-standalone.mjs`). record 동결 규약대로 원문은 안 고치고 findings 에 정정을 남겼다.
  **판정**: A 1건(레이아웃 스키마로 LLM 출력 강제) · B 4건 · C 1건. 1:1 육안 대조는 우리 쪽 exemplar 재사용이라
  **주제가 다르다**는 한계를 문서에 명시했다.
  커밋 `docs(research): Presenton 정밀 벤치`.
- 2026-08-06 계획 검증자 반영.

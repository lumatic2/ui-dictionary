# PLAN — ECT5 판단 가능성 재관측

> 생성: 2026-07-21 · 갈래: product · scope 결정: 관측 기록 + 관측이 낸 결함(어휘) 마감 + 재관측까지
Status: approved (2026-07-21 — 사용자가 "이슈들 해결하면서 진행해"로 승인. 제기한 이슈 2건(보고서 유실 경로·ROADMAP 예산 초과)을 범위에 포함)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기에서 색이 색으로 보이고, 바꿔진다 (← `plans/horizons/2026-07-editor-color-and-token-editing.md`)
- **milestone**: ECT5 — 사람이 사전 설명 없이 색을 바꿀 수 있는가. **이 horizon의 존재 이유**
- **리서치 입력**: 관측 자체가 입력이다(2026-07-21 실시). 직전 horizon `evidence/editor-legibility/eu5-judgeability.md`가 규약 선례

## 이 milestone의 출처

직전 horizon `editor-legibility`가 닫는 기준 6항 중 5항을 통과하고 **판단 가능성 하나를 미달**로 남겼다.
그 미달의 근거가 사용자 한 문장이었다 — *"요소 고르고 크기 바꾸는건 알겠는데 색은 어떻게 바꾸는지 모르겠네"*.
이 horizon 전체가 그 문장에서 개설됐고, ECT5는 **같은 방식으로 다시 물어 닫는 자리**다.

## 관측 결과 (2026-07-21 실시 — 이 plan의 입력)

ECT1~ECT4 완료분 위에서 사용자가 브라우저(`127.0.0.1:5174`)로 직접 관측했다.

| 과업 | 결과 | 근거 |
|---|---|---|
| ① 색 토큰 변경 | **성공** — 사전 설명 없이 | 사용자 발화: *"우측 네비게이션에서 배경 색이라는 걸 바꾸니까 네모 하나의 색이 바뀌더라고"* |
| ② 미바인딩 노드에 색 묶기 | **미실시** — 과업 문장 자체를 이해 못 함 + 화면에 진입점 없음 | 사용자 발화: *"색을 묶으라는게 무슨 말이지? 색을 붙인다는 건 뭐고?"* |
| ③ 원시 색으로 벗어나기 | **미실시**(사람) / 동작은 확인(에이전트 구동) | 관측 중단 |

### 관측이 낸 결함

1. **어휘가 안 통한다 (주 결함).** 사용자가 "묶다/풀다/벗어나다"를 이해하지 못했다. 이 말은 에이전트가 지어낸 설명이 아니라 **화면에 그대로 박혀 있는 문구**다(`토큰에서 풀기`·`배경 색 묶기`·`토큰에서 벗어난 색이다`). 즉 과업 설명의 문제가 아니라 **제품의 문제**다.
2. **과업 ②의 진입점이 관측 환경에 없다.** 씨앗 fixture 1,000노드를 전수 조사한 결과 **미바인딩 노드 0개**(`surface.raised` 260 · `surface.muted` 257 …). 사용자가 아무리 찾아도 나올 수 없었다.
   - 단 **과업 자체는 수행 가능하다** — Insert ▸ Frame으로 새 요소를 넣으면 즉시 `배경 색 묶기`가 뜬다(실행 확인). 없는 건 기능이 아니라 **관측 환경의 진입점**이다.
3. **관측 진행 방식이 틀렸다(에이전트 측).** 에이전트가 화면을 못 보는 상태로 "설명 없이 해보라"만 반복해 사용자에게 부담을 넘겼다. 사용자 지적: *"작업 방식이 잘못된거 같아. 너가 어딜 말하는지, 뭘 원하는지 모르겠어."* → 이후 에이전트가 브라우저를 직접 구동해 픽셀로 재는 방식으로 전환했고, 그 즉시 나머지가 판정됐다.

### 실측으로 기각된 가설

- **"견본이 비어 보인다 = 색이 안 보인다"** → **기각.** 견본색·노드색·토큰 해석값이 셋 다 `oklch(0.95 0.015 270)`로 정확히 일치했다. `surface.muted`가 원래 명도 0.95의 near-white라 어두운 패널에서 빈 칸처럼 읽힌 것이다. 닫는 기준 2는 충족된다.
- **"색 없는 요소가 존재하지 않는다"** → **기각.** 씨앗 fixture에만 없고, Insert 경로로 즉시 만들어진다. (읽어서 내린 실사가 이 horizon에서 틀린 **4번째** 사례 — 실행해서 재는 규율이 다시 옳았다.)

## Scope Boundary
- **포함**: 관측 기록 정본화 / 관측이 낸 어휘 결함 마감(사용자 결정 반영) / 고친 문구로 과업 ②③ 재관측 / horizon 닫는 기준 7항 대조.
- **제외**:
  - **씨앗 fixture 교체·프로덕션 셸 정리** — 이미 ROADMAP 유지보수 후보(QA2 결함 #4)로 별도 등재돼 있다. 관측 진입점 문제는 여기에 **기록만** 하고 고치지 않는다.
  - 토큰 정의 생성·편집 — horizon 비목표(결정 2).
  - 새 색 기능·새 어포던스 — ECT2·ECT3이 만든 것의 **말투만** 바꾼다. 동작·구조 변경 금지.
  - 에이전트 대면 문서(`docs/design-system/`·`llms.txt`)의 "토큰" 어휘 — 사용자 결정상 기계 어휘는 유지한다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
  - **step-3은 설계된 정지다** — 사람 관측이 필요하므로 step-2 완료 후 사용자에게 제시하고 멈춘다.
- rollback/cleanup: step별 독립 revert. 문구 교체는 문자열·테스트만 건드리므로 되돌림이 국소적이다. 관측 중 편집기에 남긴 변경은 저장하지 않는다(Undo 또는 새로고침).

## 스캐폴딩 결정
- source-of-truth: 사용자 대면 문구의 정본은 `apps/agent-design/src/PropertyInspector.tsx`의 문자열 리터럴 그대로다. 이번에 문구 상수 테이블을 신설하지 않는다 — 대상이 6건이고, 추상화가 문제를 안 푼다(전역 원칙 2: 요청 없는 추상화 금지). 다만 `COLOR_BINDING_LABELS`의 DEV 게이트 선례처럼 **테스트가 문구를 고정**한다.
- 검증: `PropertyInspector.test.tsx`가 새 문구를 검사한다(기존 테스트가 옛 문구를 검사 중이라 동반 수정 필수) + 실표면 구동(Playwright MCP로 dev 서버 `127.0.0.1:5174` 세 상태 확인) + `npm run verify`·`npm run typecheck`·전체 테스트.
- 배포/운영: 해당 없음 — 로컬 편집기. 배포면 변경 없음.
- **자기선언 도메인 — 어휘 정책**: 사람 UI는 "직접 지정" 축, 기계·문서는 "토큰" 유지. **둘이 갈리는 것은 의도된 분리**이며, 그 사실을 코드 주석에 한 줄 남겨 다음 사람이 "불일치"로 오인해 되돌리지 않게 한다.
- **자기선언 도메인 — 접근성**: 문구 교체 대상에 `aria-label` 3건이 포함된다. 화면 텍스트만 고치고 aria를 옛말로 두면 **스크린리더 사용자에게만 옛 어휘가 남는다**. 시각 문구와 aria를 같은 축으로 함께 바꾼다.
- **자기선언 도메인 — 관측 규약**: 재관측(step-3)은 **에이전트가 브라우저를 직접 구동한 상태**에서 진행한다. 사용자에게 화면 위치를 되묻지 않는다(이번 관측의 실패 원인).
- 검토 후 제외: 인증·결제·시크릿·데이터·서버·마이그레이션·시각 회귀(색·레이아웃 변경 없음, 문자열만) — 걸리지 않음.

## 결정 로그
- status: resolved
1. **어휘 축 = "토큰 유지, 동사만 교체"** (2026-07-21 사용자 확정). `토큰`이라는 말은 화면에 남기고 `묶다/풀다/벗어나다`만 쉬운 말로 바꾼다. 제품 전체(DESIGN.md·에이전트 문서)와 어휘가 하나로 유지된다.
2. **범위 = 인접 문구까지** (2026-07-21 사용자 확정). 관측에서 실제로 막힌 4건뿐 아니라, 같은 결함(내부 용어 노출)인 해석 실패 안내문·상단 선택기 라벨·입력칸 라벨까지 같은 축으로 통일한다.
3. 확정 문구(위 두 결정의 적용 결과):
   | 위치 | 지금 | 바꿀 말 |
   |---|---|---|
   | `:358` detach 버튼 | `토큰에서 풀기` | `직접 색 지정` |
   | `:406` bind 버튼 | `〈속성이름〉 묶기` | `색 고르기` (aria: `〈속성이름〉 고르기`) |
   | `:478` 벗어남 안내 | `토큰에서 벗어난 색이다. 견본을 눌러 다시 묶을 수 있다.` | `토큰을 쓰지 않고 직접 지정한 색입니다. 견본을 누르면 토큰으로 돌아갑니다.` |
   | `:464` 벗어남 aria | `— 토큰에서 벗어남, 눌러서 다시 묶기` | `— 직접 지정한 색, 눌러서 토큰으로 되돌리기` |
   | `:348` 해석 실패 안내 | `이 토큰은 지금 문서의 토큰 세트에서 해석되지 않는다.` | `이 이름의 토큰이 지금 문서에 없습니다.` |
   | `:342` 해석 실패 aria | `해석되지 않음` | `없는 토큰` |
   | `:472` 입력칸 aria | `〈속성이름〉 원시 값` | `〈속성이름〉 직접 지정 값` |
- 사용자 결정 필요 항목: **step-3 재관측 결과에 따른 추가 조치**(문구를 또 못 알아들으면 축을 다시 고른다) — 그 시점에 확인.

## Step 트리

- [x] **step-0 — 보고서가 추적 밖으로 새지 않는다**
  - Artifact: ECT1~ECT4 완료 보고서 4건이 `archive/reports/`(gitignore)에서 `docs/reports/`로 이관돼 추적된다.
  - Files: write `docs/reports/2026-07-21-ect{1,2,3,4}-*.md`(이동), `changesets/20260721-ect-report-relocation/README.md`, `changesets/README.md`.
  - Dependencies: 없음
  - Verify: `git ls-files docs/reports/` 에 ECT 보고서 4건이 나온다. `archive/reports/` 에 남은 파일이 없다. 다른 기기가 옮긴 VL 보고서 7건과 같은 디렉터리에 나란히 선다(총 11건).
  - Failure probe: `git check-ignore docs/reports/<파일>` 이 아무것도 반환하지 않아야 한다(무시되지 않음을 증명). `archive/reports/` 경로는 여전히 무시돼야 한다.
  - Commit: changeset `20260721-ect-report-relocation` (#243).

- [x] **step-1 — 관측이 기록된다**
  - Artifact: `evidence/editor-color-and-token-editing/ect5-judgeability.md` — 과업 3건의 성공/실패·막힌 지점·**발화 인용**, 실측으로 기각된 가설 2건, 진입점 부재 finding.
  - Files: write `evidence/editor-color-and-token-editing/ect5-judgeability.md`, `changesets/20260721-ect5-observation/README.md`, `changesets/README.md`(인덱스 행).
  - Dependencies: 없음
  - Verify: 과업 3건이 각각 성공/실패/미실시 중 하나로 판정돼 있고 **사용자 발화 인용**이 붙어 있다. 기각된 가설 2건에 실측값(픽셀·전수 조사 수치)이 적혀 있다. 진입점 finding이 ROADMAP 유지보수 후보(QA2 #4)로 백링크된다.
  - Failure probe: 판정 없이 서술만 있는 과업이 있으면 실패로 본다 — EU5 evidence 형식과 대조해 확인한다.
  - Commit: changeset `20260721-ect5-observation` (#244).

- [x] **step-2 — 화면이 알아들을 수 있는 말을 쓴다**
  - Artifact: 결정 로그 3의 문구 7건이 전부 교체되고, 테스트가 새 문구를 고정한다.
  - Files: write `apps/agent-design/src/PropertyInspector.tsx`, `apps/agent-design/src/PropertyInspector.test.tsx`, `changesets/20260721-color-wording/README.md`, `changesets/README.md`.
  - Dependencies: step-1
  - Verify: ① 결정 로그 3 표의 7건이 코드에서 새 문구로 나온다 ② 화면 문구와 `aria-label`이 **같은 축**이다(옛말이 aria에만 남지 않는다) ③ `npm test`(agent-design 204+) PASS ④ `npm run typecheck` 0 ⑤ `npm run verify` 0 ⑥ **실표면 구동** — dev 서버에서 세 상태(바인딩·미바인딩·직접지정)를 실제로 띄워 문구를 DOM에서 읽어 대조.
  - Failure probe: 옛 문구(`묶기`·`풀기`·`벗어난`)를 사용자 대면 문자열에서 grep 했을 때 0건이어야 한다. 한 건이라도 되살리면 테스트가 실패한다.
  - Commit: changeset `20260721-color-wording` (#245).

- [x] **step-3 — 사람이 다시 해본다 (설계된 정지)**
  - Artifact: 고친 문구로 과업 ②③ 재관측 결과가 `ect5-judgeability.md`에 추가되고, horizon 닫는 기준 7항이 `선언/실측/판정`으로 대조된다.
  - Files: write `evidence/editor-color-and-token-editing/ect5-judgeability.md`(추가), `changesets/20260721-ect5-reobservation/README.md`, `changesets/README.md`.
  - Dependencies: step-2
  - Verify: 과업 ②③이 각각 성공/실패로 판정되고 막힌 지점이 기록된다. 닫는 기준 7항 전부에 `선언/실측/판정` 한 줄이 붙는다. 미달 항목이 있으면 **미달로 명시**한다(직전 두 horizon의 규율).
  - Failure probe: 사용자가 새 문구도 이해 못 하면 → `decision_required`로 정지하고 어휘 축을 다시 고른다. 이 경우 step-3은 완료가 아니라 재설계 입력이 된다.
  - Commit: changeset `20260721-ect5-reobservation` (#246).
  - **정지**: step-2 완료 시점에 사용자에게 제시하고 멈춘다. 사람 관측 없이 이 step을 완료 처리하지 않는다.

## 검증/DoD
- **DoD**: 사람이 사전 설명 없이 화면만 보고 과업 3건(색 토큰 변경·미바인딩 노드에 색 묶기·원시 색으로 벗어나기)을 수행한다. 과업별 성공/실패와 막힌 지점을 기록한다.
- **Evidence**: `evidence/editor-color-and-token-editing/ect5-judgeability.md`
- **회귀 게이트**: `npm run verify` + `npm run typecheck` + 전체 테스트(canvas-core 108 · template-core 197 · agent-design 204+) PASS
- **완료 경계에서 함께 해소할 이슈**(사용자 지시 "이슈들 해결하면서 진행해", 2026-07-21):
  - 보고서 유실 경로 → step-0에서 마감.
  - `ROADMAP.md` 182줄 > 150 예산 → 완료 hook ⑤ `roadmap_sync.py compact --max-lines 150 --backlog docs/BACKLOG.md`로 해소하고, 완료된 ECT1~ECT5 블록을 `docs/BACKLOG.md`로 압축 아카이브한다.
  - 활성 horizon 2개 병존(`editor-color-and-token-editing` + `vocabulary-in-use`) → 이 horizon을 닫으면 1개로 정리된다. VL8은 **다른 horizon의 사람 관측 대기**라 이 milestone에서 건드리지 않고, 완료 보고에서 다음 차례로 제시한다.

## finding 큐
- **씨앗 fixture에 미바인딩 노드가 0개** — 관측 진입점 부재. ROADMAP 유지보수 후보 "프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거"(QA2 결함 #4)와 같은 뿌리. 이 milestone에서는 기록만 한다.
- **활성 horizon이 둘이다** — 다른 기기에서 `vocabulary-in-use`(VL1~VL8)가 병렬로 돌아 origin이 31커밋 앞서 있었다. VL8도 똑같이 사람 관측 대기 중. ROADMAP 182줄로 150 예산 초과 — horizon close 시 compact 필요.

## 진행 로그
- 2026-07-21 관측 실시 → 결과를 이 plan의 입력으로 작성.

## 주의 — 크기 회고 대상

이 milestone은 leaf 4개다. 완료 시 changeset이 2개 미만이면 **step 크기였다**는 뜻이므로
§A1 인플레 적발 규칙에 따라 완료 보고에 한 줄 남긴다.

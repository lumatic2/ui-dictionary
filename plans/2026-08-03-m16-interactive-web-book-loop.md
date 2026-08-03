# PLAN — M16: 장별 동행 흡수 루프 가동 (『인터랙티브 웹 애니메이션』 1장부터)

> 생성: 2026-08-03 · 갈래: reference 흡수(RL 배치) + 흡수 계약 확장 · scope: 사용자가 읽는 장을 구술로 받아 정리·설명하고 4갈래(knowledge·recipes·kg·ts·sb)로 착지시키는 **대화 주도 루프**를 1장으로 실제로 한 바퀴 돌린 뒤, 그 실측으로 절차와 계약을 고정한다. goal `interactive-web-book` 1번 milestone.
Status: approved (사용자 승인 2026-08-04 "ㄱㄱ")

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "레퍼런스 흡수: 외부 시스템과 로컬 디자인 작업을 근거 기반으로 흡수하면서도 잡동사니 스크랩북이 되지 않는다".
- **goal**: `interactive-web-book` (신규 — 『프론트엔드 개발자를 위한 인터랙티브 웹 애니메이션』(김영민, 영진닷컴) 12장을 사용자 독서와 동행하며 흡수) · **milestone**: M16 (단일 — 2장 이후는 독서 진도 종속이라 pending 후보로만 등재).
- **소스 정본**: `https://github.com/Youngjin-com/interactive_web` (main, 최종 갱신 2026-01-05, 303 blob / 그중 173 = `public/` 공용 에셋).

## 이 루프의 모양 (설계 요지)

**대화가 먼저 돌고, 기계는 뒤따른다.** 한 장의 사이클은:

```
사용자가 장을 읽고 구술  →  에이전트가 정리·설명(되읽기로 이해 확인)
  →  해당 장 소스코드 대조(구술로 안 나온 기법·구조 보강)
  →  4갈래 라우팅 판정  →  착지 + 기록  →  다음 장
```

라우팅 판정은 **기존 `absorption-criteria.md` 3분기(A 정본화 / B 링크참조 / C 보류)** 를 그대로 쓴다. 갈래별 착지:

| 갈래 | 무엇이 가는가 | 판정 기준 |
|---|---|---|
| `recipes/` | 재사용 가능한 구현 기법 | A + 구현물이 곧 가치 |
| `knowledge/` | "무엇이 좋은가"의 판정 규칙 | A + 원리로만 남음 |
| `kg` | 레포 밖에서도 쓰는 일반 지식 | 디자인 시스템 종속이 아님 |
| `ts` | 책에서 만난 도구·서비스 | 도구 실체가 있음 |
| `sb` | 내 독서 기록·저자의 "왜" | 항상 (모든 장) |
| 없음 | 교육용 boilerplate | C — 기록만 남기고 흡수 안 함 |

**"없음" 판정도 산출물이다.** 12장짜리 입문서를 전부 흡수하면 북극성이 금지한 「잡동사니 스크랩북」이 된다. 흡수하지 않기로 한 판정과 그 근거를 남기는 게 이 루프의 절반이다.

## Scope Boundary
- **포함**: ① 1장을 위 사이클로 실제 한 바퀴 — 구술 수신 → 정리·설명 → 소스 대조 → 라우팅 판정 → 착지·기록 ② 그 실측으로 루프 절차문 고정 + 교재류 소스가 기존 흡수 계약에 걸릴 자리 뚫기 ③ 12장 예비 라우팅 판정표(어느 장이 어느 갈래로 갈 가능성이 큰가 — 독서 순서 판단용, 확정 아님).
- **제외**: 2장 이후 흡수(독서 진도 종속 — 다음 run) · 책 본문(prose) 재서술(저작권·접근 불가 — 흡수 대상은 코드에서 관측되는 기법과 사용자가 구술하는 판단뿐) · 사이트 IA/디자인 변경 · 책 코드 그대로 벤더링.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. **추가**: step-1 은 사용자 구술이 입력이라 구술 수신 지점에서 자연 대기한다(blocked 아님 — 설계된 대화 지점).
- rollback/cleanup: 문서·데이터 추가 위주 — 커밋 단위 revert. 클론은 레포 밖(`~/projects/reference/`)이라 레포 상태에 영향 없음.

## run 전 scope 결정
- **그릇**: M16 단일(1장 + 절차 고정). 연쇄를 안 펼치는 이유 — 2장 이후는 **사용자 독서 진도가 입력**이라 지금 분해하면 근거 없는 계획이 된다. M16 이 닫히면 이후 장은 고정된 절차로 `/harness-run` 재진입 1회씩.
- **1장의 특수성**: 1장은 작업환경 준비(브라우저·Node.js·VS Code)라 **레포 산출물(recipes/knowledge)이 안 나올 가능성이 높고, `ts` 카드와 `sb` 로그가 주 착지**다. 이건 결함이 아니라 파일럿으로 오히려 적절하다 — 정본 데이터(`terms.yml`·`recipes/`)를 건드리지 않고 루프 전체를 한 바퀴 돌려볼 수 있다. **repo-artifact 경로(recipes/knowledge 승격)의 실증은 4장 도달 시**로 미루고, M16 DoD 에 넣지 않는다.
- **중단 예상 지점**: step-2 검증 PASS 후 완료.

## 스캐폴딩 결정
- source-of-truth: 흡수 절차 정본 = `research/reference-loop.md`(RL 5단계) · 편입 판정 = `docs/design-system/absorption-criteria.md`(A/B/C 3분기) · 소스 티어링·Capture Protocol 8필드 = `research/design-system-reference-strategy.md` · recipe 계약 = `docs/design-system/recipe-format.md` · 지식 판정 규칙 = `knowledge/`. **새 계약을 발명하지 않는다** — 교재라는 소스 종류가 들어갈 자리만 기존 문서에 뚫는다.
- 검증: 1장은 정본 데이터 무변경이라 전 검증 체인이 필요 없다. step-2 의 문서 변경에 대해 `check-llms-sync.mjs` PASS + 기존 ledger 행 무손실. **recipes/knowledge 승격이 발생하는 장부터** dedup audit → validate → 재생성 → build·lint → 실브라우저 스모크 전 체인 적용(절차문에 명문화).
- 배포/운영: **push 없음.** 이 워크트리(`인터랙티브-웹-책` 브랜치)는 로컬까지. main 반영은 goal 마감 시 `/merge-worktree` + 사용자 승인 후 일괄(배포 배칭 관례).
- 자기선언 도메인 — **교재류 소스 착지 규칙**: 기존 tier 표(Tier 0 운영 레퍼런스 / 1 플랫폼 규범 / 2 제품 예시 / 3 로컬 작업)에 교재·튜토리얼이 들어갈 칸이 없다. step-2 가 이 칸을 만든다(빈 값 = FAIL).
- 검토 후 제외: **책 전용 신규 inbox/ledger 파일** — 기존 `docs/research/loop/` 를 `source` 축으로 재사용한다. 소스마다 장부를 새로 파면 총괄이 갈라진다(M7 이 이미 source 열을 뚫어둠).

## 결정 로그
- status: resolved
- **사용자 확정(2026-08-04 "ㄱㄱ")**: D1 시작 장 = 1장 · D2~D5 추천안 채택(D2·D3 는 예비값 — 실판정은 해당 장 도달 시) · D6 = 서브에이전트 **미허용 기본값 유지**(승인 응답이 계획 승인에 대한 것이라 명시 허용으로 읽지 않음 — 필요 시 사용자가 그 시점에 허용).
- **사용자 소유 결정**:
  - **D1 시작 장 = 1장** — 사용자 확정(2026-08-03, 현재 독서 위치). 이후 장은 독서 순서대로.
  - **D2 기본기 장(2·3·5장) 정책** — 추천 **레포 산출물 비대상, sb 로그만**. 근거: 태그·선택자·JS 문법 예제는 교육용 boilerplate 로, 48 recipe·9 knowledge 를 가진 시스템에 넣으면 정확히 「잡동사니 스크랩북」. 단 **판정은 그 장에 도달했을 때 실제로 내린다** — 지금은 예비값이고, 구술 중 예상 밖 인사이트가 나오면 뒤집는다.
  - **D3 12장(WebGL 게임) 처지** — 추천 **예상 C 또는 kg 전용**. 근거: 게임 루프·물리·충돌은 "사람이 보고 쓰는 제품 UI" 범위 밖. WebGL 원리·성능 예산만 일반 지식으로 kg 승격 후보. 실판정은 그 장에서.
  - **D4 소스 클론 위치** — 추천 **`~/projects/reference/interactive_web`**(글로벌 규약: 참고용 클론은 top 에 두지 않는다). 11·12장은 Vite 앱이라 실제 구동해야 기법이 확인되므로 클론 필요.
  - **D5 4갈래 반영 시점** — 추천 **ts 카드는 도구를 만난 즉시 · sb 로그는 장마다 · knowledge/recipes 는 장 마감 시 · kg 승격은 goal 마감에 일괄**. 근거: kg 는 레포 밖이라 매 장 왕복하면 배치 비용만 늘고, ts/sb 는 기록이 늦으면 소실된다.
  - **D6 서브에이전트 사용 여부** — 세션 시스템 프롬프트에 "요청 없이 AgentTool 호출 금지"가 주입돼 있다(사용자 설정 파일에는 없음 — 실측 0건). 사용자가 허용하면 글로벌 `CLAUDE.md` "위임은 기본값"으로 복귀하고 멀티스텝 계획에 fresh 검증자를 붙인다.
- **기술 결정 (에이전트 소유, 확정)**: ① 교재는 **신규 Tier 4 — 교재·튜토리얼 소스**로 등재. 가치가 "제품 완성도"(T2)도 "플랫폼 규범"(T1)도 아니라 **기법의 구현 경로**라서 기존 칸에 안 들어간다. ② 교재류 A 판정의 기본 착지 = `recipes/`(기법이 곧 구현물). 원리로만 남는 건 `knowledge/`. ③ 흡수 대상은 코드에서 관측되는 구조·기법이며 **책 코드 그대로 벤더링·본문 재서술 금지** — 승격물은 Askewly 토큰·recipe-format 으로 재작성(스타일 복사 금지 불변식). ④ 저자의 "왜"를 인용할 때는 출처(책·장·쪽)를 붙인다(리서치·인용 규칙). ⑤ knowledge 신설 파일은 `generate-llms-txt.mjs` 의 `FIXED_ASSETS` 수동 등재가 있어야 노출된다(조용한 실패 경로).

## Step 트리

- [ ] **step-1 — 1장 동행 흡수 (루프 첫 바퀴)**
  - Artifact: ① 사용자 구술 수신 → 정리·설명(핵심을 되읽어 이해 확인, 틀린 이해는 그 자리에서 교정) ② 1장 소스 대조 — 책 repo 에 `chapter_1` 폴더가 없음을 확인하고 그 사실을 기록(환경 준비 장이라 코드 없음) ③ 4갈래 라우팅 판정 — 만난 도구(브라우저·Node.js·VS Code·확장 등)를 `ts` 카드로, 독서 기록과 저자의 "왜"를 `sb` 로그로, 레포 적용 판정(예상 "없음")과 **그 근거**를 기록 ④ 흡수 노트 `research/2026-08-03-book-ch01-onboarding.md` — 구술 요지 + 라우팅 판정 + 근거.
  - Risk: 기계적 (레포 정본 데이터 무변경 — 신규 문서 + 레포 밖 ts/sb 기록)
  - Files: write `research/2026-08-03-book-ch01-onboarding.md`. write(레포 밖) toolshelf 카드·vault 학습 로그. read 책 repo 트리(1장 코드 부재 확인).
  - Dependencies: none (사용자의 1장 구술을 입력으로 대기하는 설계된 대화 지점 — blocked 아님)
  - Verify: 흡수 노트에 ① 구술 요지 ② 도구 목록과 ts 처리 결과 ③ 갈래별 판정(착지처 또는 "없음"+근거)이 전부 채워져 있다. `ts` 카드는 `shelf card <name>` 으로 조회되고, `sb` 로그는 vault 경로에 실재한다(경로 `ls` 검증).
  - Failure probe: **"1장은 흡수할 게 없다"로 끝나는 것이 정상 결과인지 확인** — 그렇다면 노트에 "없음" 판정 근거가 남아야 하고, 아무것도 안 남으면 루프가 돈 게 아니다. 또한 도구를 `ts` 에 넣을 때 **이미 있는 카드인지 먼저 `shelf recall`** — 중복 카드 생성은 셸프 오염이다.
  - Commit: changeset `m16-interactive-web-book-loop` (README 절: step-1).

- [ ] **step-2 — 1장 실측으로 절차·계약 고정 (M16 마감)**
  - Artifact: ① `research/design-system-reference-strategy.md` 에 **Tier 4 — 교재·튜토리얼 소스** 절 신설(Primary use / What to capture / What not to copy — "교육용 boilerplate·본문 서술·예제 코드 그대로"는 비흡수) ② `docs/design-system/absorption-criteria.md` 에 §교재류 소스 착지 규칙 + 실측 후보 표에 이 책 행 ③ `research/reference-loop.md` 에 **장별 동행 변형** 명문화 — "교재 소스는 1 batch = 1 chapter", 사이클 순서(구술→정리→소스 대조→라우팅→착지), 검증 체인은 recipes/knowledge 승격이 발생하는 장에만 전면 적용 ④ `research/2026-08-03-interactive-web-book-scan.md` — 12장 예비 라우팅 판정표(장별 코드 실체 + 기존 48 recipe·9 knowledge 대비 신규성 + 예상 갈래) + 흡수 기준 커밋 SHA 동결 ⑤ `references/interactive-web/ANALYSIS.md` 소스 구조 노트 ⑥ `evidence/interactive-web-book/m16-loop-boot.md`. 각 계약 문서 Changelog 1줄.
  - Risk: 기계적 (문서 절 추가 — 기존 계약 본문 무변경, 확장만)
  - Files: write `research/design-system-reference-strategy.md`, `docs/design-system/absorption-criteria.md`, `research/reference-loop.md`, `research/2026-08-03-interactive-web-book-scan.md`, `references/interactive-web/ANALYSIS.md`, `evidence/interactive-web-book/m16-loop-boot.md`. read `docs/research/loop/inbox.yml`·`ledger.md`(스키마·source 축 확인), `recipes/**`, `knowledge/**`, 클론 전 장 소스.
  - Dependencies: step-1 (1장 실측이 절차문 문구의 근거 — 겪지 않고 쓰면 추측이 된다)
  - Verify: `node scripts/check-llms-sync.mjs` PASS(재생성 필요 시 재생성 후) + 판정표가 12장 전건을 덮고 각 행에 근거 파일 경로 ≥1 + 기존 ledger 행 무손실.
  - Failure probe: **① `inbox.yml`/audit 의 `source` 값이 enum 으로 고정**돼 있으면 Tier 4 스테이징이 나중 장에서 튕긴다 — `audit-recipe-candidates.mjs` 의 source 검증 로직을 먼저 읽고, 고정이면 값 추가를 이 step 에 포함. **② 11장이 기존 3D recipe 3종과 중복**일 가능성 — 중복이면 판정표에 "신규 recipe" 가 아니라 **기존 recipe 보강**으로 갈래를 적는다.
  - Commit: changeset `m16-interactive-web-book-loop` (README 절: step-2).

## 검증/DoD
- **DoD**: 장별 동행 루프가 실제로 한 바퀴 돌았고 재실행 가능한 절차로 고정됐다 — ① 1장 흡수 노트에 갈래별 판정("없음" 포함)이 근거와 함께 전건 기록 ② `ts`·`sb` 착지물 실재 확인 ③ 계약 3곳에 교재류 자리 + 12장 예비 판정표 ④ `check-llms-sync` PASS + 기존 ledger 무손실. **실패 모드 확인**: "1장은 흡수할 게 없다"가 기록 없이 지나가면 루프가 돈 게 아니다(step-1 probe) + `source` enum 고정으로 후속 장이 튕기는 조용한 실패(step-2 probe).
- **Evidence**: `evidence/interactive-web-book/m16-loop-boot.md`
- **회귀 게이트**: 기존 ledger 행 무손실 + 정본 데이터(`terms.yml`·`recipes/`) 무변경 확인(`git diff --stat` 에 등장하지 않아야 한다).
- **명시적 비-DoD**: recipes/knowledge 승격 경로의 실증은 M16 범위 밖 — 4장 도달 시 다음 milestone.
- **크기 회고**: changeset 1개로 닫히면 그건 step 이었다 — 완료 보고에 라벨 정합 한 줄.

## 수치 출처
- **12장 / 303 blob / public 173** — `gh api 'repos/Youngjin-com/interactive_web/git/trees/main?recursive=1' --jq '.tree[]|select(.type=="blob")|.path' | awk -F/ '{print $1}' | sort | uniq -c | sort -rn` (2026-08-03 실행). 장 폴더 11개(`chapter_2`~`chapter_12`) + 1장은 환경 준비라 코드 폴더 없음 = 책 목차 12장.
- **기존 48 recipe** — `find recipes -name '*.md' | wc -l` → 48 (2026-08-03).
- **기존 9 knowledge 노드** — `ls knowledge/ | wc -l` → 9 (2026-08-03).
- **기존 3D recipe 3종** — `grep -rilE 'three\.js|three-fiber|webgl|r3f' recipes/` → `application-ui/lazy-three-object-scene.md`·`marketing/mesh-gradient-surface.md`·`marketing/shader-gradient-surface.md` (2026-08-03).
- **서브에이전트 제약 발신처 미확인** — `grep -rn "Do not call the AgentTool\|Do not use workflows" ~/.orca ~/.claude` → 0건 (2026-08-03). `~/.claude/settings.json`·`settings.local.json`·레포 `.claude/`·`CLAUDE.local.md`·Orca logs·프로세스 `--append-system-prompt` 모두 해당 없음.

## finding 큐
- (실행 중 발견 항목)

## 진행 로그
- 2026-08-03 작성 — 초안은 인프라(계약 배선·12장 스캔) 선행 + 파일럿 4장이었으나, 사용자 지적으로 **대화 주도 루프**로 재설계(1장 즉시 시작 → 실측 후 절차 고정). 순서를 뒤집은 이유: 겪지 않은 절차를 먼저 쓰면 추측이 된다.
- 2026-08-04 승인 등록 — plan gate PASS(risk 기계적 2) · `approve_harness_plan.py` 로 승인 receipt + active work 원자 등록 · ROADMAP 에 goal `interactive-web-book` active + M16 active 등재.
- 2026-08-04 세션 종료 (step 0/2). **다음 세션 재개점 = step-1 의 입력 대기 지점** — 사용자가 1장을 구술하면 거기서 바로 시작한다. 사전 준비 완료분: ① 책 repo 실사(12장 중 `chapter_1` 폴더 없음 = 환경 준비 장이라 코드 없음, 흡수 기준 커밋 미동결 — step-2 에서) ② `shelf recall` 3건 실행 — VS Code·Node.js·DevTools 카드 **부재** 확인. 판정 방향: 이들은 "발견해 꺼내 쓰는 도구"가 아니라 이미 굴러가는 기반이라 **C(카드 없음)가 기본값**이고, 책에서 처음 본 확장·설정·CLI 만 선별 등재한다(셸프 희석 방지). 이 판정은 구술을 듣고 건별로 확정.
- 2026-08-04 주의 — 이 워크트리 base 는 `c64a0dd` 인데 main 은 `a49696f` 로 앞서 있다(다른 세션 작업). goal 마감 시 `/merge-worktree` 전에 rebase/merge 필요 여부를 확인할 것.

# askewly-design 에 결정론적 산출물 검사기가 없다 — 작업 브리프

- 작성: 2026-07-20
- 대상 레포: `~/projects/ui-dictionary` (askewly-design 정본이 여기서 `ui.askewly.com` 으로 배포됨)
- 계기: 당근 Kraft 글 분석 — https://medium.com/daangn/...0bc268f819c7 (SeieunYoo, 2026-04-30, 접근 2026-07-20)
- 관련 KG 노드: `prompt-to-code-intermediate-representation`, `agent-harness-control-plane-pattern`
- **반입: 2026-07-21** — 레포 밖(Desktop)에서 작성된 브리프를 `research/` 장부로 옮겼다. 소비처 = `CANDIDATES.md` 4번 후보 `design-output-static-linter`. 내용은 반입 시점 그대로 동결한다.
- ⚠ **인용 결손 1건** — 계기 URL이 축약형(`.../...0bc268f819c7`)이라 그대로는 열리지 않는다. 이 후보를 실제로 착수할 때 전체 URL을 복원해야 한다(레포 인용 규약: 출처 URL + 접근일).
- 실사 확인(2026-07-21): §2 표의 검사기 7종과 §부록 경로가 현재 레포에 실재한다. `scripts/` 20개 항목 중 해당 파일들, `custom-skills/askewly-design/SKILL.md` 43줄 모두 대조 일치.
- ⚠ **정정 부착 (2026-07-22, 착수 실사)** — 본문은 기록으로 동결하고 정정만 여기 붙인다. ① 인용 결손 **해소**: 전체 URL은 https://medium.com/p/0bc268f819c7 (해시 대조로 검증, 접근 2026-07-22). 원문 확인 사항(채점기 11개 명칭·타이포 임계 4단계·**Verify 단계 실행 = 자가 수정 루프**)은 `plans/horizons/2026-07-design-output-gates.md` 리서치 절에 있다. ② **§1·§2의 핵심 판정이 틀렸다**: "산출물 코드를 보는 검사기가 하나도 없다"는 사실이 아니다 — `packages/cli/src/verify.ts` + `askewly-design verify` 가 이미 hex·`rgb/hsl/oklch()` 를 잡고 exit 1을 낸다. §2 표가 `scripts/` 만 훑고 `packages/cli` 를 안 본 결과다. 실제 갭은 검사기 부재가 아니라 **오탐 2종(SVG·주석)·누락 1종(줄 단위 첫 매치)·npm 미배포·마무리 절차 미배선**이다. 그래서 §5 "Step 1 — 검사기 하나 만들기"는 **"있는 검사기 고치기"** 로 대체됐다.

---

## 1. 한 줄 요약

askewly-design 의 품질 게이트는 **모델의 자가 판정 + 사람 눈**으로만 닫힌다. 기계가 결정론적으로 잴 수 있는 항목(하드코딩 hex, 토큰 밖 색상, 타이포 단계 수)까지 모델 판단에 맡기고 있다.

## 2. 지금 있는 것 (실측 2026-07-20)

레포에 검사기가 **없는 게 아니다.** 다만 전부 다른 대상을 본다.

| 검사기 | 대상 | 무엇을 보나 |
|---|---|---|
| `scripts/lint-tokens.mjs` | `tokens/askewly.tokens.json` | alias 해석(누락·순환), 티어 방향(component→semantic→primitive 일방·건너뛰기 금지), 고아 primitive, WCAG AA 4.5:1 본문 대비(라이트+다크) |
| `scripts/lint/` → `.design/lint.json` | 프로젝트 `DESIGN.md` | parse / schema / alias / contrast 4스테이지 |
| `scripts/check-line-length.mjs` | 레포 산출물 | 줄 300자 초과 가드 |
| `scripts/check-text-overflow.mjs`, `check-export-artifacts.mjs`, `validate-recipes.py`, `verify-template-production-system.mjs` | 레포 자산 | 템플릿·레시피 위생 |

**공통점: 전부 "스펙과 레포 자산"을 본다.** 세션 중 에이전트가 남의 프로젝트에 실제로 뱉은 **UI 코드**를 보는 검사기는 하나도 없다.

`docs/design-system/anti-patterns.md`(18섹션 = 12클러스터 + 사용법 등)가 산출물 판정을 담당하는데, 이건 실행되는 검사기가 아니라 **모델이 읽고 스스로 훑는 체크리스트**다. `SKILL.md` 마무리 절차도 "시그니처 자가 판정 + 스크린샷 + 사람 확인"으로 끝난다.

## 3. Kraft 의 채점기 11개와 대조

Kraft 는 생성 코드를 11개 scorer 로 채점한다 — **코드 정적분석 7 + LLM 4**. 분할 기준이 명확하다: 결정론적으로 잴 수 있으면 코드로, 정성 판단이 필요하면 LLM 으로.

| Kraft 코드 채점기 | askewly-design 현황 | 판정 |
|---|---|---|
| `color-tokens` (hex 하드코딩 vs 시맨틱 토큰) | 토큰 파일은 린트하나 **산출물 코드는 미검사** | **갭 — 1순위** |
| `typography` (화면 내 텍스트 단계가 논리적인가) | 미검사 | **갭 — 2순위** |
| `spacing-rules` (spacing 토큰이 맥락에 맞나) | 미검사 | 갭 (단, "맥락에 맞나"는 결정론 경계가 애매) |
| `layout-structure` (VStack/HStack 사용이 패턴에 맞나) | 미검사 | **해당 없음** — askewly 는 특정 레이아웃 프리미티브를 강제하지 않는다 |
| `component-compliance` (컴포넌트 props 올바른 사용) | 미검사 | 부분 해당 — 레지스트리 42개 JSON 자산에 한해 가능 |
| `icon-usage` | 미검사 | **해당 없음** — 전용 아이콘 라이브러리 없음 |
| `animation-stability` | 미검사 | 보류 — `expressive-stack.md` 와 겹침, 규칙부터 정해야 |

**LLM 채점기 4개(ux-patterns·interaction-quality·flow-patterns·form-patterns)는 새로 만들 필요 없다.** anti-patterns 12클러스터가 이미 그 역할이고, 오히려 더 구체적이다(금액·총액 정직성, 파괴적 동작 보호 등). 이건 기계로 잴 수 있는 종류가 아니다.

**따라서 실제 작업 대상은 7개가 아니라 2~3개다.** 이 문서의 제목이 "채점기 7개 이식"이 아닌 이유다.

## 4. 왜 이게 중요한가 (근거)

Kraft 가 이 문제에 도달한 경로가 그대로 적용된다.

> "같은 프롬프트를 두 번 넣으면 다른 화면이 나왔어요. 첫 번째는 SEED 토큰을 잘 쓰다가, 두 번째는 hex 값을 하드코딩하고." — 원문

프롬프트에 "토큰을 써라"라고 적는 것으로는 이게 안 닫힌다. **잴 수 있는 것은 재야 한다.** 사람 눈은 라이트/다크 스크린샷에서 `#3B82F6` 과 `var(--color-accent)` 를 구분하지 못한다 — **렌더 결과가 똑같기 때문이다.** 지금 게이트의 구조적 사각지대가 정확히 여기다.

## 5. 제안 범위 (최소부터)

**Step 1 — 색상 하드코딩 검사기 하나.**
- 입력: 파일 경로 또는 glob (에이전트가 방금 만든 파일들)
- 검사: CSS/JSX/TSX 안의 `#rgb`/`#rrggbb`/`rgb()`/`hsl()` 리터럴 중 토큰 정의 파일 밖에 있는 것
- 예외: 토큰 정의 파일 자체, `<svg>` 내부, 주석
- 출력: 위반 목록(파일:줄, 발견값) + exit code
- 배선: `SKILL.md` 마무리 절차 3단계에 "스크린샷 캡처" 앞에 끼운다

**Step 2 — 타이포 단계 수 검사기.** 한 화면에서 쓰인 font-size 고유값 개수를 세고 임계 초과 시 경고. 임계값은 사람이 정해야 한다(Kraft 는 4단계).

**Step 3 — 판단.** Step 1~2 를 실제 세션 3회에 물려보고, 위반이 잡히는지 / 오탐이 성가신지 보고 나서 확장 여부를 정한다. 미리 7개를 다 만들지 않는다.

## 6. 먼저 정해야 할 것 (사람 결정)

1. **검사기가 어디서 도는가** — ui-dictionary 의 `scripts/` 에 두고 원격 fetch? 아니면 `npx` 로 배포? askewly-design 은 **남의 프로젝트에서 실행**되므로 `scripts/` 에 두면 손이 안 닿는다. 이게 가장 큰 설계 질문이다.
2. **차단인가 경고인가** — 위반 시 완료를 막을 것인지, 보고에 첨부만 할 것인지.
3. **타이포 단계 임계값** — 4? 5? askewly 토큰 체계에 맞는 수를 정해야 한다.
4. **적용 대상 파일 범위** — 에이전트가 만진 파일만? 프로젝트 전체? 후자면 기존 코드의 기존 위반이 쏟아진다.

## 7. 하면 안 되는 것

- **anti-patterns 12클러스터를 코드 검사기로 옮기려 들지 말 것.** "금액 정직성", "파괴적 동작 보호"는 의미 판단이다. 정규식으로 재려 하면 오탐만 쌓이고 원본 체크리스트의 신뢰가 깎인다.
- **스킬 본문에 규칙을 복제하지 말 것.** `SKILL.md` 는 43줄 라우터이고 정본은 원격이다. 검사기 규칙도 원격 문서에 두고 스킬은 호출만 한다.
- **Judge 규약**: 스킬·런타임 변경은 targeted test/smoke 증거 없이 완료 보고 금지. 배포본(`~/.claude/skills`)까지 확인한다. 원본 수정은 `~/projects/custom-skills` 에서, 배포는 `setup.sh`.

## 8. 검증 기준 (착수 시 이걸로 닫는다)

- [ ] 하드코딩 hex 가 든 파일에 대해 검사기가 exit 1 + 정확한 파일:줄 보고
- [ ] 토큰만 쓴 파일에 대해 exit 0 (오탐 없음)
- [ ] 토큰 정의 파일 자체를 위반으로 잡지 않음
- [ ] 실제 askewly-design 세션 1회에 물려서 마무리 절차가 끊기지 않음
- [ ] `SKILL.md` 변경분이 `setup.sh` 배포 후 `~/.claude/skills` 에 반영됨

---

## 부록 — 근거 파일 경로

- 스킬 원본: `~/projects/custom-skills/askewly-design/SKILL.md` (43줄, 얇은 라우터)
- 원격 정본 인덱스: `https://ui.askewly.com/llms.txt` — 문서 15개 + 레시피 55개 + 구현 JSON 42개
- 자가 판정 체크리스트: `~/projects/ui-dictionary/docs/design-system/anti-patterns.md`
- 기존 토큰 린트: `~/projects/ui-dictionary/scripts/lint-tokens.mjs`
- 기존 DESIGN.md 린트 결과: `~/projects/ui-dictionary/.design/lint.json`
- 레포 verify 파이프라인: `~/projects/ui-dictionary/package.json` → `npm run verify`

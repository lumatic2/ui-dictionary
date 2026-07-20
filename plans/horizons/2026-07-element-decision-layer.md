# HORIZON — 요소 결정 계층 (element-decision-layer)

> 생성: 2026-07-21 · ROADMAP marker: `harness:goal id="element-decision-layer"` · 상태: active
> cascade 중간(Horizon). 위계: Objective(`OBJECTIVE.md`) → **Horizon**(이 문서) → Milestone(`plans/<date>-<id>-<slug>.md`) → Step.
> 진행 상태의 정본은 `ROADMAP.md` marker — 이 문서의 체크박스는 milestone boundary 에서만 동기화.

## 목표

에이전트가 **"무엇을 만들지"에서 "무엇을 쓸지"로 넘어가는 다리**를 놓는다. 사용자가 "정보가 많은데 펼치고 접혔으면 좋겠다"고 말하면, 시스템이 accordion·tabs·disclosure·stepper·drawer 중 무엇인지 **판별 축으로 갈라 고르고, 고른 근거와 기각한 대안을 기록한 뒤** 레시피/코드로 인계한다.

- **무감독 분량: 승인 후 최소 3 무감독 세션** (직전 horizon `editor-legibility` 실측 = 5 milestone·13 changeset·3 세션. 같은 그릇 크기를 유지한다.)

## 왜 지금

1. **데이터는 이미 있는데 판정이 없다.** `terms.yml` 562항목이 `when_to_use`/`anti_use`/`related`를 갖고 있으나, 각 용어가 *자기 시점의 금지*만 말한다 — `accordion.anti_use: 항상 비교해야 하는 정보는 접지 않는다`. **후보들 사이를 가르는 축**이 스키마에 없다.
2. **프로토콜이 결정 단계를 건너뛴다.** `entry-protocol.md` A(새 화면)는 `pattern-taxonomy` 분류 → 레시피 fetch로 직행한다. "이 상황에 어떤 요소인가"를 묻는 자리가 없어 에이전트가 조용히 고르고 근거를 남기지 않는다.
3. **선례가 비어 있다.** 리서치 결과 컴포넌트 선택을 기계 판독 데이터로 표현한 표준은 **존재하지 않는다**(DTCG는 토큰 값 교환만). 공식 시스템은 개별 페이지 산문에 흩뿌리고, 가로지르는 비교는 서드파티(uxpatterns.dev)와 사내 결정 트리(Lyft·Doctolib·Workday)에만 있다. Askewly Design의 포지셔닝("에이전트에 디자인 *판단력*을 주입")이 정확히 겨냥하는 공백이다. 근거: `research/2026-07-21-element-decision-layer-selection-guidance-prior-art.md`
4. **직전 horizon이 남긴 교훈.** `editor-legibility` 닫는 기준 6은 probe 11건과 브라우저 계측이 전부 놓친 결함을 **사람이 한 번 만져서** 잡았다. 이 horizon도 마지막에 사람 관측 게이트를 둔다.

## 범위 밖 (non-goals)

- **공개 사이트 표면** — "이럴 땐 뭘 쓰나" 비교 페이지는 이 horizon에 담지 않는다. 데이터가 정본화된 뒤 별도 horizon.
- **AskewlyDesign 앱 표면** — 편집기 안에서 에이전트가 후보를 제시하는 UX도 후속.
- **562개 전수 커버** — 애초에 헷갈리지 않는 용어에 판별 축을 다는 것은 비용 대비 효과가 없다. 군집 10~15개로 한정.

## 담을 milestone — 설계 번들 인덱스

| milestone | 제목 (왜 milestone 규모인가) | plan doc | 승인 | 리서치 입력 |
|---|---|---|---|---|
| **ED1** | 판별 데이터 계약 — 포맷·검증기·첫 군집 (스키마 + validator + 첫 데이터 = 3 독립 changeset, 통합검증=validator가 첫 군집을 통과) | `plans/2026-07-21-ed1-decision-data-contract.md` | 대기 | `research/2026-07-21-element-decision-layer-…md` §3·§4 |
| **ED2** | 군집 채우기 — 헷갈리는 10~15군 (군집별 근거 조사 + 작성 + terms.yml 상호참조 무결성 = ≥3 changeset, 통합검증=전 군집 validator PASS + 참조 무결성) | `plans/2026-07-21-ed2-cluster-corpus.md` | 대기 | 같은 파일 §5 + 미열람 소스 마저 확인 |
| **ED3** | 프로토콜 배선 — entry-protocol 결정 단계 + llms.txt 배포 (프로토콜 문서 + 생성기 + 배포 확인 = ≥2 changeset, 통합검증=배포 URL fetch로 실제 도달) | `plans/2026-07-21-ed3-protocol-wiring.md` | 대기 | 없음 |
| **ED4** | 분리력 검증 — 판정이 실제로 갈리는가 (판정 케이스 세트 + 실행 + 오판 보정 = ≥2 changeset, 통합검증=케이스 정답률 수치) | `plans/2026-07-21-ed4-separation-gate.md` | 대기 | ED2 산출 데이터 |
| **ED5** | 사람 관측 게이트 — 요구 한 문장에서 구현까지 (관측 준비 + 실행 + 발견 결함 마감 = ≥2 changeset, 통합검증=사용자 과업 성공/실패 기록) | `plans/2026-07-21-ed5-human-observation.md` | 대기 | 없음 |

## 닫는 기준 (선언 대 실측)

1. **판별 데이터가 기계 검증된다** — 관측: `python scripts/validate-decisions.py` exit 0, 군집 수 ≥10.
2. **모든 후보가 실존 용어를 가리킨다** — 관측: validator의 참조 무결성 검사에서 `terms.yml`에 없는 id 0건.
3. **모든 판별 축에 출처가 붙어 있다** — 관측: 축 레코드 중 `source` 누락 0건. 근거 없는 임계값(3자 사이트 수치 등)은 `confidence: low` 명시.
4. **에이전트가 읽는 경로에 실려 있다** — 관측: `node scripts/generate-llms-txt.mjs` 산출물에 결정 섹션 존재 + 등재된 모든 경로가 레포에 실존(로컬 관측). 실배포 URL fetch 확인은 세션 단위 push 승인 후 별건 — 배포 승인은 사용자 소유(`CLAUDE.md` 배포 규약).
5. **판정이 갈린다** — 관측: ED4 케이스 세트 정답률 수치. 기준선 = 결정 계층 없이 같은 케이스를 돌렸을 때와 대조(향상 폭을 수치로).
6. **사람이 한 문장을 던져 요소 판정 + 근거 + 구현까지 왕복한다** — 관측: ED5 과업 기록. 성공/실패와 막힌 지점을 그대로 적는다(미달이면 미달로 닫는다).

## 미리 쓰는 실패 회고 (프리모템)

**시나리오 1 — 문서만 늘고 아무도 안 읽는다.** 결정 문서 15개를 잘 써놓고 `entry-protocol`에 한 줄 링크만 걸어, 에이전트가 실제로는 여전히 분류→레시피로 직행한다. 레포엔 산출물이 쌓였는데 행동은 안 변한다.
→ 예방: 닫는 기준 4(배포본 fetch 실측)와 5(정답률 대조)를 **문서 존재가 아니라 행동 변화**로 걸었다. ED3에서 결정 단계를 프로토콜의 "Always" 절이 아니라 **A/B/C 태스크 분기 앞**에 삽입해 우회 경로를 없앤다.

**시나리오 2 — 판별 축이 실제로 안 가른다.** 축을 "항목 수·비교 필요성"처럼 그럴듯하게 적었으나, 실제 요구 문장을 넣으면 두 후보 모두 조건을 만족해 판정이 안 갈린다. 결국 에이전트가 예전처럼 감으로 고른다.
→ 예방: ED4를 별도 milestone으로 세웠다. 케이스 세트로 **분리력을 수치로 측정**하고, 안 갈리는 축은 그 자리에서 보정한다. 기준선 대조 없이 통과 선언 금지.

**시나리오 3 — 근거 없는 숫자를 정본화한다.** "탭은 2~7개" 같은 3자 사이트 수치를 그대로 박아, Askewly Design이 출처 없는 통념의 배포처가 된다.
→ 예방: 닫는 기준 3(축마다 출처 필수, 약한 근거는 `confidence: low`)을 validator가 기계 검사한다. 리서치 파일에 이미 이 함정을 ⚠로 표시해뒀다.

**시나리오 4 — 스키마가 데이터보다 커진다.** 포맷 설계에 세션을 다 쓰고 군집은 2~3개만 채운 채 horizon이 끝난다.
→ 예방: ED1은 **첫 군집(펼침류) 1개를 실제로 채워야** 닫힌다 — 스키마만으로 완료 불가. 군집 채우기는 ED2가 따로 진다.

## Objective 임팩트 (close 시 기록)

- (close 시 작성)

## 링크

- 위(Objective): `OBJECTIVE.md`
- 리서치: `research/2026-07-21-element-decision-layer-selection-guidance-prior-art.md`
- 아래(Milestone plans): 위 설계 번들 인덱스 표

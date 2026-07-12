# Reference Loop (RL) — 표준 배치 절차

Date: 2026-07-12
Milestone: RL (`docs/plans/2026-07-12-rl-reference-loop-pipeline.md`)
지위: pattern/recipe 레퍼런스 흡수의 표준 반복 절차. `docs/ui-vocabulary/authoring-workflow.md`의 용어 흡수 루프 구조를 recipe/term 흡수로 이식한 절차 문서다. 데이터 계약(agent-asset-model, recipe-format, pattern-taxonomy)은 변경하지 않는다 — 이 문서는 그 계약들을 소비하는 순서를 정의할 뿐이다.

## 목적

`docs/research/*-ledger.md` 계열의 레퍼런스 흡수는 지금까지 배치마다 절차를 새로 정하는 일회성 작업이었다. RL은 이를 vocabulary 쪽과 동일한 반복 가능한 루프로 표준화한다: 수집 → 중복 필터 → 적응 → 검증 → 흡수. 매 배치가 같은 5단계, 같은 도구, 같은 장부 포맷을 따르면 새 표면(surface)을 열 때마다 절차를 재발명하지 않는다.

## 배치 정의

- **1 batch = 좁은 표면/주제 1개.** `docs/design-system/pattern-taxonomy.md` §2의 surface 7종 중 하나 또는 그 하위 좁은 주제(예: "commerce 결제 흐름").
- **후보 규모**: recipe 후보 ~10개 수집 → 그중 recipe로 승격되는 것은 1~2종. 나머지는 용어 후보로 전환되거나 제외된다.
- **용어 후보**: 배치당 10~20개 (authoring-workflow.md의 "좁은 주제 1개, 후보 20개 내외" 관례를 그대로 따른다 — 용어 축은 별도 배치를 새로 만들지 않고 같은 표면 조사에서 부산물로 수집한다).
- 서로 다른 카테고리를 한 배치에 섞지 않는다. dedup 판정이 약해진다.

## 5단계 절차

### 1. 수집 (Collect)

- 표면 1개를 정하고 `docs/research/design-system-reference-strategy.md`의 tier 순서를 따라 레퍼런스를 조사한다 (아래 tiering 표).
- 후보를 `docs/research/loop/inbox.yml`에 스테이징한다. 후보는 이미 그럴듯한 신규 recipe/term이어야 하며, 조사 중 나온 모든 것을 다 담지 않는다.
- 각 후보는 `design-system-reference-strategy.md`의 Capture Protocol 8필드(source/accessed/surface/observed structure/transferable/non-transferable/implementation target/verification)를 `inbox.yml` 스키마 필드로 압축해 채운다.
- 산출물: `docs/research/loop/inbox.yml`에 채워진 `candidates` 배열.

### 2. 중복 필터 (Dedup)

- 실행: `node scripts/audit-recipe-candidates.mjs` (기존 `scripts/audit-ui-vocabulary-candidates.mjs`와 동일한 역할을 recipes/`terms.yml` 양쪽 대비로 수행한다).
- **1회만, 적응 전에.** dedup은 적응(승격) 시작 전에 한 번 통과 확인하고 그 출력을 캡처해둔다. 승격 후 재실행하면 방금 승격한 항목이 자기 자신과 매치되어 에러가 뜨는데 이는 정상이며 회귀가 아니다 (20260712-commerce/internal-tools 배치 실측).
- **alias 문구도 이웃과 대조한다.** audit은 후보 vs 기존 항목만 검사하고 기존 용어들의 alias 목록끼리는 비교하지 않는다 — 같은 계열의 자매 용어(예: FAB 계열)에 새 alias 문구를 붙일 때는 이웃 용어의 alias를 직접 읽어 문구 충돌을 피한다 (20260712-mobile-input 배치 실측: "확장 FAB"가 이미 `speed-dial`에 점유).
- **자동 audit은 표현이 다른 동개념을 놓친다.** 토큰/부분문자열 휴리스틱은 `product-gallery`↔`image-gallery` 같은 다른 어휘의 중복을 못 잡는다 — 적응 단계에서 후보의 이웃 `terms.yml` 항목(같은 group/category)을 직접 읽어 수동 대조하는 것이 필수다 (20260712-commerce 배치에서 2건 수동 적발).
- 검사 대상: 후보 `id`/`name`/`pattern_group`이 기존 `recipes/**/*.md` frontmatter, `docs/ui-vocabulary/terms.yml`과 겹치는지, 유사도 기반 duplicate-risk가 있는지.
- 판정 규칙은 authoring-workflow.md §3과 동일하게 따른다: 같은 개념이면 신규 항목 대신 alias/related로 흡수, 상태 차이만이면 신규 항목 생략, 행동이 다르면 `related` 비교 추가, 애매하면 이번 배치에서 제외.
- 산출물: 클린 후보만 남은 `inbox.yml` (dedup 통과 후보에 표시), 또는 audit 실패 리포트.

### 3. 적응 (Adapt)

- dedup을 통과한 후보 중 recipe 승격 대상은 `docs/design-system/recipe-format.md` 계약대로 `recipes/<pattern_group>/<id>.md`를 작성한다 (frontmatter 필수 필드 8개, 본문 8개 고정 섹션).
- `tokens_used`는 `tokens/askewly.tokens.json`의 semantic/dimension/typography 경로만 참조한다 (primitive 직접 참조·hex 리터럴 금지 — recipe-format.md 계약 그대로).
- `code_asset`은 실제 코드 SSOT 경로를 가리켜야 하며, 레시피 본문에 전체 코드를 내장하지 않는다.
- 용어 승격 대상은 authoring-workflow.md 절차(§5 Promote Clean Terms)를 그대로 따라 `terms.yml`에 반영한다. 이 문서는 그 절차를 재서술하지 않는다 — 포인터만 남긴다.
- `terms.yml` 편집 시 unquoted YAML flow-sequence 항목 안에 따옴표 문자를 넣지 않는다(파싱 실패 — 20260712-internal-tools 배치에서 2회 실측). 필요하면 문장을 바꿔 쓴다.
- 산출물: 신규/갱신 `recipes/<pattern_group>/<id>.md`, `terms.yml` 갱신.

### 4. 검증 (Verify)

배치마다 다음 체인을 순서대로 실행한다:

```bash
python scripts/validate-recipes.py
python scripts/validate-ui-vocabulary.py
node scripts/generate-llms-txt.mjs
cd examples/ui-vocabulary-site && npm run build && npm run lint
npm run build:data   # CLI 쪽 (repo root 또는 CLI 패키지 — 기존 CLI 스크립트 계약 그대로)
```

- `validate-recipes.py`는 recipe-format.md §검증 계약 8개 항목을 검사한다 (frontmatter 필수값, id/파일명 일치, pattern_group/kind/surface_refs 대조, tokens_used 실존·리터럴 금지, 8개 섹션 존재, code_asset/component_refs/term_refs 실존).
- `validate-ui-vocabulary.py`는 신규/갱신 term의 category/kind/group 정합을 검사한다.
- `generate-llms-txt.mjs`는 llms.txt 재생성과 함께 신규 recipe가 링크에 반영됐는지 확인한다 (등록 방식은 §llms.txt 등록 참조).
- 실패 시 authoring-workflow.md와 동일하게: 새 에러는 승격을 막고, 기존에 알려진 경고(예: 기존 shadcn lint 경고)는 통과로 본다.
- 산출물: 4개 명령의 PASS 로그 (ledger의 `verification` 컬럼에 요약 기록).

### 5. 흡수 (Absorb)

- 검증을 통과한 배치 결과를 `docs/research/loop/ledger.md`에 한 행으로 기록한다 (스키마는 아래 §ledger 규약).
- 신규 recipe는 `generate-llms-txt.mjs`가 glob으로 자동 발견하므로 별도 등록이 없다 (§llms.txt 등록 참조).
- 배포(git push)는 이 단계에 포함되지 않는다 — §배포 게이트 참조.

## Source Tiering

전체 근거와 원칙은 `docs/research/design-system-reference-strategy.md`가 정본이다. 이 문서는 배치 수집 시 참조 순서만 요약한다:

| Tier | 분류 | 대표 소스 |
| --- | --- | --- |
| Tier 0 | Operating References | Tailwind CSS/Plus 사이트, Tailwind Labs GitHub |
| Tier 1 | Platform Design Systems | Apple HIG, Material Design 3 |
| Tier 2 | Product-System Exemplars | Vercel/Geist, Stripe, Linear, Radix, Around |
| Tier 3 | Local Design-System Work | `design-manual`, `claude-design-manual`, custom-skills 계열 |

- 표면별 우선순위는 고정이 아니다 — `design-system-reference-strategy.md`의 Adaptation Rules대로 "현재 갭이 무엇인가"로 재정렬한다 (예: commerce 배치는 Tier 2 Stripe/Tailwind Plus Ecommerce가 먼저, internal-tools는 Tier 2 Linear/Vercel이 먼저).
- Evidence 필드(Source/Accessed date/Surface/Observed structure/Transferable/Non-transferable/Implementation target/Verification)는 `design-system-reference-strategy.md` Capture Protocol과 동일하다. 중복 서술하지 않는다.

## inbox 스키마

`docs/research/loop/inbox.yml`은 vocabulary 쪽 `docs/ui-vocabulary/inbox.yml`과 같은 성격의 단기 스테이징 버퍼다 — 배치가 끝나면 승격된 항목은 제거한다.

필드 의미:

- `batch`: `<YYYYMMDD>-<surface>` 형식. 배치 식별자이자 ledger 조인 키.
- `surface`: `pattern-taxonomy.md` §2 surface 7종 중 하나.
- `candidates[].id`: kebab-slug. recipe로 승격되면 `recipe-format.md`의 `id`/파일명이 된다.
- `candidates[].pattern_group`: `pattern-taxonomy.md` §3 10종 중 하나.
- `candidates[].proposed_artifact`: `recipe | term | alias | related` — 이 배치 조사에서 어떤 산출물이 될 후보인지 미리 표시. 최종 승격 결과와 다를 수 있다 (dedup에서 alias/related로 강등될 수 있음).
- `candidates[].source`: `{ tier, url, accessed }` — tier는 위 tiering 표의 0~3.
- `candidates[].summary`/`anatomy`/`transferable`/`non_transferable`: Capture Protocol 필드의 축약형.
- `candidates[].dedup_hints`: 조사자가 미리 인지한 근접 기존 recipe/term id — audit 도구 실행 전에도 수집자가 의심되는 후보를 표시해두는 용도.

## ledger 규약

`docs/research/loop/ledger.md`는 배치 단위 장부다. 한 배치 = 한 행. 컬럼:

| 컬럼 | 의미 |
| --- | --- |
| `batch` | inbox의 `batch` 값과 동일 (조인 키) |
| `date` | 흡수 완료일 |
| `surface` | 배치 표면 |
| `collected` | 수집 후보 수 (recipe 후보 + 용어 후보) |
| `duplicates_filtered` | dedup 단계에서 제외/강등된 수 |
| `promoted (artifacts)` | 실제 승격된 recipe id/term id 목록 |
| `verification` | §4 검증 체인 실행 결과 요약 (PASS/FAIL + 명령별 핵심 수치) |
| `amendments` | 이 배치에서 드러난 절차 수정 사항 (있으면 본 문서 Changelog에도 반영) |

## llms.txt 등록

(2026-07-12 정정 — 20260712-commerce 배치에서 실측) `scripts/generate-llms-txt.mjs`의 recipe 섹션은 `collectRecipes()`가 `recipes/**/*.md`를 glob으로 **자동 발견**한다. `FIXED_ASSETS`는 원칙/토큰/taxonomy/계약 문서 전용 고정 목록이다. RL 범위에서는:

- 신규 recipe 승격 시 llms.txt 등록 작업이 **필요 없다** — `node scripts/generate-llms-txt.mjs` 재실행으로 자동 반영된다.
- 신규 *비-recipe* SSOT 문서(원칙·taxonomy 급)를 llms.txt에 노출하려면 그때만 `FIXED_ASSETS`에 수동 추가한다.
- 캔버스 component-registry 배선 등 그 밖의 자동 공급은 이 milestone 범위 밖이며 FW milestone으로 유보한다 (계획서 Scope 참조).

## 배포 게이트

- 배치 완료(§5 흡수까지)는 배포 승인이 아니다. `authoring-workflow.md` §8~9와 동일하게, 로컬 검증·smoke 결과를 보고한 뒤 배포 여부를 사용자에게 확인받는다.
- git push는 배치 단위가 아니라 **세션 단위 일괄** + 사전 요약 보고 + 사용자 승인 후에만 수행한다 (기존 관례, `deploy-batching` 메모리 규약과 동일).

## Changelog

- 2026-07-12: 초판. vocabulary 흡수 루프를 pattern/recipe 흡수로 이식하는 5단계 절차, inbox 스키마, ledger 규약, llms.txt 수동 등록 절차를 확정.
- 2026-07-12: 3배치 실증 회고 fold — ① llms.txt recipe 등록은 glob 자동 발견으로 정정(FIXED_ASSETS는 비-recipe 문서 전용) ② dedup은 적응 전 1회 실행·출력 캡처, 승격 후 자기 매치는 정상 ③ 자동 audit이 놓치는 이형 표현 중복은 이웃 terms.yml 수동 대조로 잡는다 ④ terms.yml unquoted flow-sequence 내 따옴표 금지.

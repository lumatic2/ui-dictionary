# Pattern Taxonomy — 정본 분류 체계

Date: 2026-07-07
Milestone: SMC2 (plan: `docs/plans/2026-07-07-pattern-taxonomy.md`)
지위: **분류 용어와 축의 단일 출처.** surface-taxonomy.md, site-blueprint.md, tailwind-reference-model.md, agent-asset-model.md의 분류 관련 서술이 이 문서와 어긋나면 이 문서가 이긴다.

## 1. 용어 정의 (통일)

기존 문서 4개가 "패턴"을 서로 다른 의미로 썼다. 이제부터:

| 용어 | 정의 | 데이터 위치 |
|---|---|---|
| **surface** | 제품 표면 대분류 (7종) — 사용자가 만드는 "제품의 종류" | 이 문서 §2 |
| **pattern_group** | 목적 기반 패턴 카테고리 (10종) — 사이트 `/patterns/*` 경로와 agent-asset-model `pattern.pattern_group` 필드의 공용 어휘 | 이 문서 §3 |
| **pattern** | 재사용 가능한 UI 컴포지션 정의 — agent-asset-model의 `pattern` 엔티티(anatomy/states/use_when/...) 를 가리키는 말로만 쓴다. "전형 패턴 나열"이나 "URL 카테고리"를 pattern이라 부르지 않는다 | agent-asset-model.md |
| **term** | UI Vocabulary 사전 항목 (527+) — category/kind/group 3축으로 분류 | `docs/ui-vocabulary/terms.yml` |
| **group** | term의 미세 분류 (~74종, category 하위) — 구 search.ts categoryGroups를 데이터로 승격한 것 | `docs/ui-vocabulary/groups.yml` |
| **collection** | 사이트 네비게이션 뷰 (~216종) — 분류 체계가 **아니라** category/kind/group/termIds 조합으로 정의되는 화면 단위 | `navigation-model.ts` (코드) |

## 2. Surface (7종)

surface-taxonomy.md의 Top-Level Surfaces를 그대로 정본화한다:
`websites`, `mobile-apps`, `saas-dashboards`, `commerce`, `documentation`, `internal-tools`, `components-primitives`.

- 상세 서술(하위 유형, 전형 요소, agent cue)은 surface-taxonomy.md가 보유한다 — 그 문서는 surface의 *내용* 출처, 이 문서는 *목록과 지위*의 출처.
- 사이트 `/patterns/surfaces/*`는 `components-primitives`를 제외한 6종을 노출한다 (components는 별도 최상위).

## 3. Pattern Group (10종 — 확정)

agent-asset-model의 필드값 10종을 정본으로 채택한다 (문서별 7~10개 드리프트 종결):

`marketing`, `application-ui`, `commerce`, `docs`, `data-display`, `forms`, `navigation`, `overlays`, `feedback`, `layout`

- site-blueprint의 sitemap(9종)·홈페이지 섹션(7종)은 이 10종의 **부분 노출**이다 — 사이트가 전부를 노출할 의무는 없지만, 이름은 반드시 이 목록에서 가져온다 (`ecommerce` 표기는 `commerce`로 수렴).
- Tailwind Plus의 Marketing/Application UI/Ecommerce/Documentation 축은 이 목록으로 매핑된 레퍼런스 원본이다 (매핑 표의 정본은 surface-taxonomy.md Migration Notes 하나로 통일 — tailwind-reference-model.md의 중복 표는 포인터로 대체).

## 4. Term 3축 (category × kind × group)

| 축 | 값 | 강제 |
|---|---|---|
| `category` | 9종: input, selection, action, structure, feedback, data-display, style, layout-rendering, accessibility | terms.yml 필수 필드, validator |
| `kind` | 6종: component, block, form-pattern, visual-effect, motion-pattern, visual-treatment | 선택 (기본 component) |
| `group` | ~74종, category 하위 미세 분류 | terms.yml 필수 필드 (SMC2부터), `groups.yml` 대조 validator |

- group의 정본은 `docs/ui-vocabulary/groups.yml` — `{ id, category, label }`. term→group 배정은 각 term의 `group` 필드.
- 사이트 코드는 group을 하드코딩하지 않고 생성 데이터에서 읽는다.
- category 편중(accessibility 8 vs data-display 106) 재설계는 의도적으로 보류 — 후속 milestone 재료.

## 5. 축 간 관계

```
surface (7)                      ← 제품 종류. 사이트 /patterns/surfaces/*
pattern_group (10)               ← 목적 카테고리. 사이트 /patterns/*, pattern 엔티티의 필드
  └─ pattern (agent-asset-model) ← 컴포지션 정의. component_refs / example_refs / agent_recipe_ref 로 하위 연결
term (527+)                      ← 어휘 사전. category × kind × group
collection (~216)                ← 사이트 뷰. 위 축들의 조합 필터 (분류 아님)
```

- pattern ↔ term: pattern의 `component_refs`가 term id를 참조할 수 있다 (pattern은 조합, term은 어휘).
- **토큰 연결**: pattern·term의 시각 스펙은 `tokens/askewly.tokens.json`의 semantic 토큰 이름으로 서술한다 (SMC1 규약 — hex/리터럴 금지).
- **레시피 연결**: pattern의 `agent_recipe_ref`가 SMC3 레시피 파일을 가리킨다 (레시피 포맷은 SMC3에서 확정).
- **예시 연결**: pattern·term의 `example_refs`/`navigation`이 사이트 페이지를 가리킨다.

## 6. 검증 계약

- `scripts/validate-ui-vocabulary.py`: 모든 term에 `group` 존재 + `groups.yml`의 id와 일치 + group.category == term.category.
- `groups.yml`에 있으나 어떤 term도 참조하지 않는 group은 경고.
- 사이트 빌드는 생성 데이터의 group으로 기존 categoryGroups와 동일한 화면을 만든다.

## Changelog

- 2026-07-07: 최초 작성 (SMC2 Step 1). pattern_group 10종 확정, group 축 데이터 승격 선언.

# Recipe Format — 레시피 포맷 계약

Date: 2026-07-07
Milestone: SMC3 (plan: `docs/plans/2026-07-07-component-recipes.md`)
지위: 레시피 파일의 정본 계약. 초안·근거: `docs/research/smc3-recipe-format-draft.md` (Fable 게이트 수정 반영해 확정).

## 파일 위치와 이름

```
recipes/<pattern_group>/<id>.md
```

- `<pattern_group>`: pattern-taxonomy.md §3의 10종 고정 어휘. 새 폴더명 금지.
- `<id>`: kebab-case, 전역 유일, **파일명 = frontmatter `id`**.

## Frontmatter (배열은 스칼라만 — frontmatter만 파싱해도 검색 가능해야 함)

```yaml
---
id: topbar-command-search
name: "Topbar Command Search"
pattern_group: navigation        # 10종 중 하나
kind: block                      # term kind 6종 재사용: component|block|form-pattern|visual-effect|motion-pattern|visual-treatment
status: draft                    # draft | stable | deprecated
surface_refs: [websites, saas-dashboards]   # surface 7종
tokens_used:                     # semantic/dimension/typography 경로만. color.primitive.* 직접 참조 금지, hex/px 리터럴 금지
  - color.semantic.surface.overlay
  - color.semantic.border.focus
  - dimension.radius.lg
code_asset: examples/ui-vocabulary-site/src/components/topbar-search.tsx   # 실존 경로. 코드 SSOT는 이 파일 — 레시피에 전체 코드를 내장하지 않는다
component_refs: [popover, input] # 다른 레시피 id (있으면)
term_refs: [command-palette, autocomplete]  # terms.yml id (있으면)
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-07
---
```

## 본문 — 8개 고정 섹션 (헤더 이름 정확 일치, 순서 권장·비강제)

`## Intent` / `## Anatomy` / `## States` / `## Variants` / `## Code`(핵심 20~40줄 발췌만 — 전체는 code_asset) / `## Checks` / `## Anti-patterns`(AI 생성 실수 2~4개와 이유) / `## Agent notes`(prompt_phrases, fallbacks)

## 검증 계약 (`scripts/validate-recipes.py`)

1. frontmatter 필수: id, name, pattern_group, kind, status, surface_refs, tokens_used, code_asset
2. id ↔ 파일명 일치 + 전역 유일
3. pattern_group 10종 / kind 6종 / surface_refs 7종 대조 (pattern-taxonomy 정본)
4. tokens_used 각 항목이 `tokens/askewly.tokens.json`에 실존 + `color.semantic.*`·`color.component.*`·`dimension.*`·`typography.*`만 허용 (`color.primitive.*` 에러)
5. 본문 코드 블록에 색상 hex 리터럴 금지
6. 필수 섹션 8개 존재
7. code_asset 경로 실존; component_refs가 레시피 id로 실존; term_refs가 terms.yml에 실존
8. 미참조·고아 검사는 하지 않음 (레시피는 소비 진입점)

## 소비 규약

- 에이전트: frontmatter로 필터(grep `^id:` / pattern_group / tokens_used) → 필요 시 본문 섹션 정규식 추출 → code_asset Read.
- 사이트: 후속 milestone에서 레시피를 페이지로 렌더 (이번 범위 밖).

## Changelog

- 2026-07-07: 초안 확정 (kind는 term 어휘 재사용, dependencies 평탄화: code_asset/component_refs 최상위).

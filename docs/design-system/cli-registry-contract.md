# CLI Registry Contract — @askewly/design

Date: 2026-07-10
Milestone: CLI1 (plan: `docs/plans/2026-07-10-cli1-core-query.md`)
지위: CLI 데이터 번들과 후속 `add`/`init`(CLI2)의 입력 계약. 자산 자체의 정본은 각 SSOT 파일이며, 이 문서는 CLI가 그것을 소비하는 규약만 정의한다.

## 1. 소스 자산 → 번들 매핑

CLI 패키지는 publish 시점에 레포 SSOT를 `data/`로 번들한다 (`packages/cli/scripts/build-data.mjs`, `prepack`에서 자동 실행). 오프라인 동작이 기본이고, 원격 fetch는 없다.

| 번들 파일 | 소스 (SSOT) | 내용 |
|---|---|---|
| `data/terms.json` | `docs/ui-vocabulary/terms.yml` | 용어 536+ — id/category/group/ko/en/one_liner/description/when_to_use/anti_use/prompt_phrases 등 조회 필드 |
| `data/tokens.json` | `tokens/askewly.tokens.json` | DTCG 토큰 트리 원본 (3-tier color + dimension + typography) |
| `data/tokens.css` | `examples/ui-vocabulary-site/src/tokens.css` | 생성 CSS (custom properties + `.dark` 블록) — 손 수정 금지, `scripts/generate-tokens.mjs`가 정본 생성기 |
| `data/recipes.json` | `recipes/<pattern_group>/<id>.md` | frontmatter(id/pattern_group/tokens_used/code_asset/term_refs) + `body`(markdown) + `source_path` |

규칙:
- 번들은 파생물이다 — 커밋하지 않는다(`data/`는 gitignore). SSOT가 바뀌면 `npm run build:data`로 재생성.
- build-data는 소스가 없거나 비었으면 exit≠0으로 실패한다 (조용한 빈 번들 금지).

## 2. 버전 규약

- 패키지 semver가 곧 데이터 스냅숏 버전이다. 데이터만 갱신돼도 publish 시 patch 버전을 올린다.
- 레시피 frontmatter의 `last_verified`와 term의 `status`를 번들에 보존해 소비자(에이전트)가 신선도를 판단할 수 있게 한다.

## 3. shadcn registry-item 스키마 대응 (CLI2 `add` 입력 계약)

shadcn의 `registry-item.json` 필드와 우리 레시피 frontmatter의 대응:

| shadcn registry-item | Askewly recipe | 비고 |
|---|---|---|
| `name` | `id` | 커맨드 인자 (`add button`) |
| `type` (registry:component 등) | `kind` + `pattern_group` | 10종 고정 어휘 (pattern-taxonomy §3) |
| `files[]` (복사할 소스) | `code_asset` | CLI2에서 code_asset 파일을 프로젝트로 복사 주입 |
| `dependencies` | 없음 (v1) | 우리 레시피는 외부 npm 의존을 강제하지 않음 |
| `cssVars` / `tailwind` | `tokens_used` | 주입 시 semantic/component 토큰 참조가 유지되는지 검증하는 근거 |
| (없음) | `body`의 Checks / Anti-patterns | shadcn 대비 확장 — 주입물과 함께 에이전트에게 전달할 판정 기준 |

CLI2 `add`의 계약: ① `code_asset` 실존 파일을 대상 프로젝트로 복사 ② `tokens_used`가 가리키는 토큰이 대상의 tokens.css에 존재하는지 확인(없으면 `init` 안내) ③ Anti-patterns를 stdout 노트로 출력.

## 4. 커맨드 표면 (CLI1 확정분)

```
askewly-design terms search <query> [--json] [--limit n]
askewly-design terms show <id> [--json]
askewly-design tokens [--tier primitive|semantic|component] [--format json|css]
askewly-design recipes list [--json]
askewly-design recipes show <id> [--json]
```

- `--json`은 에이전트 소비용 기계 출력. 사람용 출력과 동일 데이터.
- 실패 계약: 없는 id/tier/format, 결과 0건 → stderr 메시지 + exit 1.
- `--tier`는 color 3-tier에만 적용된다 (dimension/typography는 tier 구분이 없음 — Foundations Tokens 문서 참조).

## Changelog

- 2026-07-10: 최초 작성 (CLI1 Step 3).

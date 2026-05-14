# Research Findings — Design Harness 설계 근거 (2026-05-14)

> 4개 병렬 에이전트가 수집한 외부 자료의 통합. 다음 액션은 본 문서 하단의 **결정 사항** 참고.

---

## A. 선례 메타 레포 (별 많이 받은 것들)

| 레포 | ★ | 핵심 패턴 | 차용할 것 |
|---|---|---|---|
| [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | 77.8k | 브랜드별 `design-md/<brand>/DESIGN.md` 단순 카탈로그 | brand taxonomy, contribution scraper |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | 39.4k | 풀스택 alt — `skills/`+`design-systems/`+`prompt-templates/` 삼분 | **AGENTS.md + CLAUDE.md 듀오**, 멀티에이전트 호환 매트릭스 |
| [google-labs-code/design.md](https://github.com/google-labs-code/design.md) | 13.3k | 캐논 spec, `docs/spec.md` + `skills-lock.json` + `examples/` | spec-first 룰, examples-as-tests |
| [rohitg00/awesome-claude-design](https://github.com/rohitg00/awesome-claude-design) | 555 | **aesthetic family** 그룹핑 (brutalist/editorial/glass/…) + recipes + prompts | 본 레포의 conceptual core 로 차용 |
| [VoltAgent/awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) | 2.2k | 단일 README inspiration gallery | badge UX |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 114k | "ship code, not deps" 레지스트리 | `components.json` 레지스트리 스키마 |
| [style-dictionary](https://github.com/style-dictionary/style-dictionary) | 4.6k | 토큰 빌드 파이프라인 | DESIGN.md → CSS/iOS/Android 컴파일 |

**굳어진 5개 패턴**:
1. DESIGN.md = lingua franca (YAML frontmatter tokens + markdown rationale, 9 섹션 캐논)
2. 두 분류 공존: by-brand(고증) + by-aesthetic-family(아이디에이션) — 성숙한 레포는 둘 다
3. `skills/` + `recipes/` + `prompts/` 삼분
4. `AGENTS.md` + `CLAUDE.md` 동시 배포 (멀티에이전트 호환)
5. spec + examples-as-tests + skills-lock.json (재현성)

---

## B. 토큰 표준 (DTCG)

- **DTCG Format Module v2025.10** (2025-10-28) 첫 stable. de-facto 표준
- Style Dictionary v4 = DTCG first-class. Tokens Studio = 2026 기본 export 가 DTCG
- 3-tier 네이밍 합의: **primitive → semantic → component**, 색은 OKLCH, dimension 은 단위 포함 문자열
- 권장: DESIGN.md frontmatter **DTCG-shape 로 저장하되 `$` 없는 `value`/`type` 허용 → 빌드 시 prefix 부여**. 변환 레이어 0, Figma↔SD round-trip 가능
- 테마(light/dark)는 path 에 인코딩 X — `$extensions` 또는 token-set 파일 머지

근거: [DTCG draft](https://www.designtokens.org/tr/drafts/format/), [SD DTCG docs](https://styledictionary.com/info/dtcg/), [Tokens Studio format docs](https://docs.tokens.studio/manage-settings/token-format)

---

## C. QA 도구 맵 (Fail-fast 순서)

| 단계 | 도구 | JSON | 비용 |
|---|---|---|---|
| 1. DESIGN.md 파싱 | `gray-matter` + `remark` + `ajv` | ✓ | ms |
| 2. 토큰 검증 | `@terrazzo/cli` (DTCG-native) | ✓ | ms |
| 3. CSS/Tailwind lint | `stylelint`(+`stylelint-design-tokens`) ∥ `eslint-plugin-tailwindcss` | ✓ | <1s |
| 4. 토큰 contrast | `@adobe/leonardo-contrast-colors` + `apca-w3` (pre-render) | ✓ | <1s |
| 5. 렌더 a11y | `axe-core` CLI on built HTML/Storybook | ✓ | 수 초 |
| 6. 시각 회귀 | Playwright `toHaveScreenshot` (OSS first), `odiff` 대안 | ✓ | 수십 초 |
| 7. 집계 | `.design-qa/design-qa-report.json` (에이전트 가독) | ✓ | — |

1-4 가 5초 안에 끝나야 게이팅 의미 있음. SaaS(Chromatic/Percy) 는 opt-in 만.

---

## D. 부트스트랩 하네스 형태

- 단일 사용자·로컬 전용 → **bash + `envsubst` + `templates/` 디렉토리**가 최적. cookiecutter/plop/hygen 은 over-engineering
- 핵심 3 규칙:
  1. **Idempotent**: 존재 파일은 건드리지 않음 (`[[ -f ]]` 가드)
  2. **Hash-tracked sync**: 타겟에 `.design-harness.json` 저장 → 템플릿 갱신 시 사용자 미수정 파일만 자동 갱신, 수정된 파일은 3-way diff 출력 후 skip
  3. **Real-runnable templates**: `create-next-app --example` 식 — 플레이스홀더 최소화, 실행 가능한 진짜 파일이 템플릿
- 기존 `~/projects/agent-orchestration/scripts/init-ai-readiness.sh` 의 골격 그대로 차용 + hash 추적만 추가
- shadcn 의 "ship code, not deps" 가 디자인에도 그대로 적용됨

---

## 결정 사항 — 본 레포(desing-manual) 의 최종 형태

**Layout** (rohitg00 의 aesthetic-family core + google-labs 의 spec rigor + nexu-io 의 멀티에이전트):

```
desing-manual/
├── CLAUDE.md
├── AGENTS.md                       # Codex/Cursor 용 미러
├── README.md
├── ROADMAP.md
├── docs/
│   ├── spec.md                    # 우리 DESIGN.md 스펙(DTCG 호환)
│   └── architecture.md
├── methodology/                    # 방법론(글)
│   ├── 00-INDEX.md
│   ├── research-findings.md       # (이 파일)
│   ├── design-md-guide.md
│   ├── prompt-patterns.md
│   └── verify-loop.md
├── knowledge/                      # 지식(글)
│   ├── typography.md / color.md / spacing.md / components.md
├── design-md/                      # by-aesthetic-family 카탈로그
│   ├── minimal/ editorial/ brutalist/ glass/ terminal/ playful/ ...
│   └── each contains DESIGN.md (+ optional preview.png)
├── prompts/                        # 재사용 프롬프트 (3-designer-debate 등)
├── recipes/                        # 워크플로우 (figma→design-md, repo→system, ...)
├── examples/                       # 풀 예시(스펙 conformance test 겸함)
├── templates/                      # init-design.sh 가 복사하는 진짜 파일들
│   ├── DESIGN.md.tmpl              # envsubst 변수 ${PROJECT}, ${STYLE}
│   ├── claude-design-section.md.tmpl
│   └── hooks/design-lint.sh
├── scripts/
│   ├── init-design.sh              # 신규 프로젝트 부트스트랩
│   ├── propagate.sh                # 템플릿 변경분 기존 프로젝트 전파
│   └── lint/                       # DESIGN.md 파서 + ajv schema + reporter
├── schema/
│   └── design-md.schema.json       # ajv 가 검증할 JSON Schema (DTCG 호환)
├── harness/                        # 스킬 드래프트 (custom-skills 로 승격 전)
└── archive/  tmp/                  # gitignored
```

**Tokens**: DESIGN.md frontmatter 는 DTCG-shape (no-`$` 약식 허용), 빌드 시 `.tokens.json` 출력. Style Dictionary v4 호환.

**QA pipeline**: 위 C 표 7단계. 1-4 가 pre-commit hook, 5-7 가 CI/수동.

**Bootstrap**: `bash ~/projects/desing-manual/scripts/init-design.sh <target> --style <family>` — D 의 스크립트 스켈레톤 채택. `.design-harness.json` 으로 sync 추적.

**스킬 연동**: 기존 글로벌 `/design-consultation`, `/design-system`, `/design-qa`, `/design-export` 가 본 레포의 `templates/`·`schema/`·`scripts/lint/` 를 단일 출처로 참조하도록 묶음. 안정화되면 `harness/` 드래프트를 `~/projects/custom-skills/` 로 승격.

---

## 다음 액션 (우선순위 순)

1. `docs/spec.md` 작성 — DTCG 호환 9-섹션 캐논 정의
2. `schema/design-md.schema.json` — ajv 검증용
3. `templates/DESIGN.md.tmpl` + 첫 aesthetic family 4종(minimal, editorial, brutalist, glass)
4. `scripts/init-design.sh` + `propagate.sh` 구현 (D 의 skeleton 기반)
5. `scripts/lint/` — 1-4 단계 검증기 (Node, JSON 리포터)
6. `AGENTS.md` + `CLAUDE.md` 업데이트
7. `methodology/design-md-guide.md`, `prompt-patterns.md`, `verify-loop.md` 본문 채우기
8. `harness/design-consult/` 스킬 드래프트 → 검증 → 승격

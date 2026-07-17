# ui-dictionary

> 유성의 디지털 제품 디자인 시스템 — 사람이 탐색하는 UI reference website + Codex/Claude Code가 활용하는 agent-facing design system

## 목적

웹사이트, 모바일 앱, SaaS, 커머스, 대시보드, 문서 사이트, 운영 도구 등 디지털 제품 UI를 직접 보고, 비교하고, 재사용할 수 있는 디자인 시스템으로 구축한다.

- **Website**: 사람이 UI surfaces, components, patterns, colors, typography, layout, motion, page examples를 탐색하는 공개 사이트
- **AskewlyDesign App**: 사람이 실제 React UI를 코드 네이티브 캔버스에서 구성·직접 조작하고, 선택 영역에 결합된 에이전트와 함께 코드로 왕복하는 데스크톱 편집기
- **Assets**: 향후 결제 사용자에게 더 자유로운 코드 복사, 에셋 다운로드, implementation pack 제공
- **Agent System**: Codex, Claude Code가 AI 티가 덜 나는 제품 UI를 만들 수 있도록 tokens, pattern recipes, component guidance, prompts, anti-patterns 제공
- **Reference Loop**: Tailwind/Tailwind Plus, Tailwind Labs repo, Apple HIG, Material Design, 고품질 SaaS/모바일 앱, 기존 `design-manual`/custom skills 작업을 근거 기반으로 흡수

## Tech Stack

- **문서**: Markdown (Obsidian Flavored 허용 — wikilink/callout)
- **데모 프론트엔드** (필요 시): Vite + React + TypeScript + Tailwind (가벼움 우선). Shadcn/ui 또는 토큰만 손으로 정의
- **디자인 토큰 포맷**: `DESIGN.md` (Google Stitch 오픈 포맷) — YAML frontmatter(tokens) + Markdown body(rationale)
- **검증**: WCAG contrast / token reference linter, Playwright 스크린샷 (스킬 `browse`)
- **캔버스 엔진**: 정본 document/scenegraph와 renderer를 분리한다. ADR 0006에 따라 production content=semantic DOM, editor plane=WebGPU+DOM fallback, vector islands=SVG, native/Wasm=측정 임계치 기반 hot path로 구현한다.

## Structure

```
ui-dictionary/
├── CLAUDE.md                # (이 파일) 프로젝트 지침
├── README.md                # 외부용 진입점
├── ROADMAP.md               # 마일스톤
├── OBJECTIVE.md             # 디자인 시스템 북극성 (사용자 소유 — 루트)
├── DESIGN.md                # 본 레포 자체 디자인 토큰
├── docs/
│   ├── PRD.md               # 제품 계약
│   ├── ARCHITECTURE.md      # 구조 계약
│   ├── design-system/       # agent-facing design system 원본 (entry-protocol, style-signature 등)
│   ├── horizons/            # active horizon plans
│   ├── plans/               # milestone plans
│   ├── research/            # reference capture ledgers/evidence (dogfooding 장부 포함)
│   └── ui-vocabulary/       # original vocabulary source data
├── methodology/             # 방법론 — "어떻게 지시하는가" (00-INDEX.md가 목차)
├── knowledge/               # 지식 — "무엇이 좋은 디자인인가" (현재 motion-references.md)
├── templates/               # 부트스트랩용 템플릿 (DESIGN.md.tmpl, claude-design-section 등)
└── examples/                # glass-landing, ui-vocabulary-site (current React website)
```

> agent-facing 자산의 정본은 `docs/design-system/` 이며 `https://ui.askewly.com/llms.txt` 로 배포된다.
> 본 레포는 스킬이 호출하거나 참조할 수 있는 디자인 시스템 자산, 문서, 예시, 검증 증거를 갖는다.

## Conventions

- **단일 출처**: 디자인 지식은 `knowledge/`, 실행 가이드는 `methodology/`. 중복 시 methodology 가 knowledge 를 인용 (wikilink)
- **DESIGN.md 우선**: 모든 데모/예시는 DESIGN.md 한 장으로 출발. 토큰을 코드에 하드코딩하지 말 것
- **3-tier 토큰**: primitive(`color.gray.50`) → semantic(`surface.muted`) → component(`button.bg`). 컴포넌트는 semantic 만 참조
- **변경 이력**: 템플릿/방법론은 파일 하단에 `## Changelog` 짧게 유지 (세션 간 혼동 방지)
- **레이아웃 규칙**: 깊이 ≤5, 폴더당 ≤10 항목 (글로벌 규칙 준수)
- **임시 산출물**: `tmp/` (gitignored). archive 는 `archive/` (gitignored)

## 작업 패턴

1. **새 디자인 시스템 의뢰** → `templates/DESIGN.md.tmpl` 에서 출발 → DESIGN.md 작성 (`methodology/design-md-guide.md` 참조)
2. **기존 UI 비평** → `design-qa` 스킬 (WCAG + 토큰 lint + 스크린샷 diff)
3. **새 방법론 발견** → `methodology/` 에 글로 정리 → 패턴이 굳어지면 `~/projects/custom-skills/<new-skill>/SKILL.md` 작성 → `bash ~/projects/custom-skills/setup.sh` 배포

## UI Vocabulary Authoring Workflow

UI Vocabulary는 이제 전체 제품의 하위 capability다. 용어 데이터와 미니 컴포넌트는 계속 유지하되, 최종 목표는 웹 UI만이 아니라 모바일 앱, SaaS, 커머스, 대시보드, 문서 사이트 등 디지털 제품 surfaces를 포괄하는 디자인 시스템이다.

UI Dictionary 용어 추가는 긴 검토 대기열이 아니라, 수집 단계에서 기존 데이터와 중복을 먼저 걸러낸 뒤 로컬 검증까지 끝내고 배포 직전에만 사용자 확인을 받는 워크플로우로 운영한다. 자세한 절차는 [docs/ui-vocabulary/authoring-workflow.md](docs/ui-vocabulary/authoring-workflow.md)를 따른다.

### UI Vocabulary IA Reference

UI Vocabulary 사이트의 정보구조, 사이드 네비게이션, 용어 설명 방식, 예시 카드 흐름은 Tailwind CSS / Tailwind Plus 공식 사이트를 1차 레퍼런스로 삼는다.

- 레퍼런스 URL: `https://tailwindcss.com/`, `https://tailwindcss.com/plus/ui-blocks`
- 핵심 원칙: 사용자가 만들고 싶은 화면 맥락을 먼저 보여주고, 그 안에서 UI 단위와 예시를 단계적으로 좁힌다.
- Tailwind Plus의 큰 축(`Marketing`, `Application UI`, `Ecommerce`)처럼 우리 사이트도 사용자가 이해하기 쉬운 상위 맥락을 우선한다.
- Tailwind Plus의 하위 축(`Page Sections`, `Forms`, `Navigation`, `Overlays`, `Components`, `Page Examples`)처럼 실제 UI 덩어리 이름을 세부 탐색 단위로 사용한다.
- Tailwind CSS docs의 설명 방식처럼 용어 설명은 짧은 정의, 사용 이유, 실제 예시, 관련 상태/반응형/토큰 개념으로 이어지게 한다.
- `주제별/형태별/상황별` 같은 내부 분류명은 Tailwind식 사용자 언어로 재검토한다. 추상 축이 사용자를 헷갈리게 하면 `Marketing`, `Application UI`, `Ecommerce`, `Docs/Concepts`처럼 목적 기반 축으로 재구성한다.

기본 흐름:

```text
topic -> collect around 20 candidates -> duplicate prefilter
-> terms.yml promotion -> visual renderer check
-> validate/build/lint/smoke -> ask before deploy
```

- 한 번의 수집 배치는 좁은 주제 1개에 후보 20개 내외를 목표로 한다.
- `docs/ui-vocabulary/inbox.yml`은 현재 수집 배치의 임시 버퍼로만 사용한다.
- 승격 전 `node scripts/audit-ui-vocabulary-candidates.mjs`와 `node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates`로 기존 `terms.yml` 대비 id/name/source/alias overlap과 duplicate-risk를 확인한다.
- `node scripts/generate-ui-vocabulary-inbox-review.mjs`는 후보 설명, visual anatomy, duplicate-risk를 사람이 빠르게 보는 보조 리포트다.
- 승격 후 `cd examples/ui-vocabulary-site && npm run audit:visuals`로 visual fallback/generic renderer를 확인한다. 자세한 기준은 [docs/ui-vocabulary/visual-quality-workflow.md](docs/ui-vocabulary/visual-quality-workflow.md)를 따른다.
- 기존 용어와 의미가 같으면 새 항목 대신 alias를 추가한다.
- 기존 용어와 헷갈리지만 행동이나 맥락이 다르면 `related` 비교를 추가한다.
- 단순 상태나 변형이면 새 항목으로 만들지 않는다.
- 승격 후에는 `python scripts/validate-ui-vocabulary.py`, `npm run build`, `npm run lint`, 브라우저 smoke를 통과한다.
- 배포는 최종 승인 지점이다. 로컬 검증 결과를 보고한 뒤 사용자 승인 없이 `git push ui-dictionary main`을 실행하지 않는다.

## Showcase Atlas 카드 카피 (`home-page.tsx` `atlasItems`)

- 카드 `copy`는 데모가 화면에서 뭘 하는지 서술하지 않는다. **`title`(용어) 자체를 정의하는 한 문장**이어야 한다 — 예: "Motion Choreography" → "Sequencing multiple motion cues into one coherent, readable rhythm." (O), "One primitive falls, bursts into shapes, and orbits." (X, 데모 내용 서술)
- em dash 금지, 콤팩트하게 (한 문장, 명사구 위주)
- 카드 폴리싱 세션마다 이 원칙을 매번 다시 설명하지 않기 위해 여기 기록함 (2026-07-08)

## 참고 — DESIGN.md 란?

Google Labs(Stitch) 가 오픈소스화한 포맷. 코딩 에이전트가 디자인 시스템을 "지속적·구조적"으로 이해하도록 하는 단일 markdown 파일. 자세한 가이드는 [methodology/design-md-guide.md](methodology/design-md-guide.md) 참조.

## Related

- 에이전트 진입 경로: `https://ui.askewly.com/llms.txt` → `docs/design-system/entry-protocol.md` (로컬 design-bootstrap 스킬 소스는 없음 — AD1 실사 2026-07-17)
- 글로벌 디자인 스킬 (기존, 별도 출처): `/design`, `/design-system`, `/design-qa`, `/design-export`, `/design-flow`, `/design-full`
- 프론트엔드 코드 생성: `frontend-design:frontend-design` 스킬
- UI 용어 사전 배포: [docs/ui-vocabulary/deployment.md](docs/ui-vocabulary/deployment.md)

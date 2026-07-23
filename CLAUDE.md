# ui-dictionary

> 유성의 디자인 시스템 정본 레포 — 사람이 탐색하는 reference website + Codex/Claude Code가 활용하는 agent-facing design system + 사람이 직접 만드는 AskewlyDesign 앱

## 북극성 — 사용자 소유, 승인 없이 수정 금지

> 이 절은 **사용자 소유**다. 에이전트는 문구 후보를 제안하고, 대화에서 확정 문구를 되읽어 **명시 승인을 받은 뒤에만** 그대로 기록한다. 승인 전 자율 수정 금지. 갱신은 **방향 자체가 바뀔 때만** — Milestone 완료는 여기를 바꾸지 않는다.
> 2026-07-23 하네스 재조립(C4)으로 구 OBJECTIVE 문서를 이 절로 흡수했다. 계획 계층이 Objective→Horizon→Milestone→Step 4단에서 **2계층**(이 문서 = 방향+규칙 / 작업 단위 계획서)으로 줄었다.

### 북극성

Askewly Design은 모든 형태의 디자인을 총괄하는 시스템이다 — 프로덕트 디자인, 슬라이드 디자인, 프론트엔드 디자인을 비롯해 사람이 보고 쓰는 결과물 전반. `ui-dictionary`는 그 정본 레포이고, `/askewly-design` 스킬이 공통 진입점이다.

세 개의 얼굴로 나간다: 사람이 둘러보고 비교하고 배우는 공개 웹사이트, Codex와 Claude Code가 실제로 사용하는 에이전트용 디자인 시스템, 그리고 기존 제작 도구와 코드 사이를 잇는 왕복 경로.

범위는 웹 페이지에 그치지 않는다. 웹사이트, 모바일 앱, SaaS 제품, 커머스 플로우, 대시보드, 문서 사이트, 마케팅 페이지, 내부 운영 도구, 애플리케이션 UI 패턴, 그리고 슬라이드·인쇄물처럼 상호작용 없이 읽히는 지면 산출물까지가 범위다.

### 성공 모습

- 사람이 여러 제품 표면에 걸친 UI 패턴, 컬러 시스템, 타이포그래피, 레이아웃, 상태, 인터랙션, 완성된 페이지 예시를 시각 라이브러리로 둘러볼 수 있다.
- 결제 사용자는 일반 방문자보다 더 완전한 코드 복사, 에셋 다운로드, 예시 재사용을 제약 없이 할 수 있다.
- Codex와 Claude Code가 시스템의 토큰, 패턴 규칙, 컴포넌트 레시피, 안티패턴을 읽고 "일반적인 AI 결과물"이 아니라 의도적으로 디자인된 느낌의 UI를 만들어낸다.
- 사람이 Figma 같은 익숙한 제작 표면에서 디자인하고, 그 결과가 정본 토큰·문서를 거쳐 production code로 무손실 왕복한다.
- Tailwind, Tailwind Plus, Tailwind Labs 레포, Apple HIG, Material Design, 고품질 SaaS 제품, 모바일 앱, 기존 Askewly design-manual/custom-skills 작업물을 근거 기반으로 흡수하면서도 잡동사니 스크랩북이 되지 않는다.
- 화면 UI든 슬라이드·지면 산출물이든, 같은 토큰 SSOT에서 출발하되 매체별 게이트(화면=상태·다크모드, 지면=최종 형식 그대로 렌더해 확인)를 각각 통과한다.

### 움직이는 축

- 용어 사전 조회에서 → 재사용 가능한 제품 디자인 시스템으로.
- 웹 전용 예시에서 → 표면을 가로지르는 디지털 제품 패턴으로.
- 시각적 영감에서 → 구현 가능한 코드, 에셋, 에이전트 가이드로.
- 탐색·주입 도구에서 → 사람이 익숙한 도구에서 그린 것과 에이전트가 같은 정본 document/code를 공유하는 제작 환경으로.
- 일회성 Tailwind 패리티 작업에서 → 반복 가능한 레퍼런스 수집·적응·검증 루프로.
- 화면 UI 전용 시스템에서 → 매체를 가로지르는 디자인 총괄 시스템으로.

### 긴 arc

1. 기반: Objective, PRD, Architecture, ROADMAP, 레퍼런스 전략을 확장된 디자인 시스템 목표에 맞춰 정렬한다.
2. 레퍼런스 흡수: 외부 시스템과 로컬 디자인 작업을 스크린샷, 레포 노트, 패턴 장부, 적응 기준과 함께 연구한다.
3. 시스템 모델: 토큰, 패턴 분류 체계, 컴포넌트 레시피, 예시, 코드 에셋, 에이전트용 가이드를 정의한다.
4. 제품 표면: 웹사이트를 시스템의 탐색 가능하고 수익화 가능한 정문으로 발전시킨다.
5. 에이전트 통합: 같은 시스템을 Codex, Claude Code, 커스텀 디자인 스킬에서 그대로 쓸 수 있게 만든다.
6. 제작 환경: 기존 디자인 도구를 제작 표면으로 쓰고, 그 사이에 정본 document·토큰·코드 왕복을 놓는다.

## 목적

Askewly Design은 모든 형태의 디자인을 총괄한다 — 프로덕트 디자인, 슬라이드 디자인, 프론트엔드 디자인. 본 레포는 그 정본이고, `/askewly-design` 스킬이 공통 진입점이다. (북극성은 `CLAUDE.md` 「북극성」 절 — 이 절은 그 요약이다.)

범위는 웹사이트, 모바일 앱, SaaS, 커머스, 대시보드, 문서 사이트, 운영 도구 등 디지털 제품 UI에 더해, 슬라이드·인쇄물처럼 상호작용 없이 읽히는 지면 산출물까지다. 매체가 다르면 게이트도 다르다 — 화면은 상태·다크모드, 지면은 최종 형식 그대로 렌더해 확인한다.

- **Website**: 사람이 UI surfaces, components, patterns, colors, typography, layout, motion, page examples를 탐색하는 공개 사이트
- **제작 표면 왕복**: 사람은 Figma 같은 익숙한 도구에서 그리고, 그 결과가 정본 토큰·문서를 거쳐 production code로 무손실 왕복한다 (2026-07-22 사용자 확정 — 자체 캔버스 앱을 제작 표면으로 삼는 방향은 내렸다. 기존 캔버스 자산 `apps/`·`packages/canvas-core` 는 동결 보존, ADR 0005/0006 은 그 시점 결정 기록으로 유지)
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
├── `CLAUDE.md` 「북극성」 절             # 디자인 시스템 북극성 (사용자 소유 — 루트)
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

## 완료 보고서 위치 (2026-07-21 사용자 확정)

- milestone/horizon **완료 보고서는 `docs/reports/`** 에 둔다. harness §0 배치 규약의 기본값은 `archive/reports/` 이지만, 이 레포는 `.gitignore` 에 `archive/` 가 있어 **보고서가 조용히 버전 관리 밖으로 나갔다.**
- 발견 경위: 2026-07-21 병렬 horizon 병합 중 `git checkout archive/reports` 가 실패해서 드러났다. 그 시점까지 `vocabulary-in-use` 7건과 `editor-color-and-token-editing` 쪽 보고서가 **양쪽 다 커밋된 적이 없었다** — 워크트리가 사라지면 같이 사라지는 상태였다.
- `report_close.py` 는 보고서 경로를 인자로 받으므로 위치만 바꾸면 된다: `report_close.py docs/reports/<date>-<id>-<slug>.md --task-id <id> --root .`

## 병렬 horizon 의 changeset 번호 (2026-07-21)

- 두 horizon 이 같은 base 에서 병렬로 달리면 **changeset 번호가 겹친다.** 실제로 206~221 이 양쪽에서 서로 다른 변경을 가리켰다(병합 시 한쪽을 222~242 로 이동해 해소).
- 병렬 horizon 을 열 때는 **번호 구간을 먼저 나눠 잡는다.** 이력: `plans/horizons/CANDIDATES.md`

## 하지 않는 것 (2026-07-22 `CLAUDE.md` 「북극성」 절 에서 이관, 문구 원문 그대로)

- 다른 제품의 브랜드 아이덴티티를 최종 아이덴티티로 복사하지 않는다.
- Tailwind 패리티를 최종 시스템으로 취급하지 않는다. 그것은 근거 기반 훈련 데이터이자 구현 연습이다.
- 시스템을 웹 전용으로 만들지 않는다.
- 화면용 토큰을 지면 산출물에 그대로 옮기지 않는다. 매체가 다르면 게이트도 다르다.
- 공개 탐색 경험과 에셋 모델이 정합해지기 전에는 결제, 계정, 라이선스 강제를 붙이지 않는다.
- 품질 근거 없이 Figma의 C++/WebGPU 엔진이나 OpenDesign의 iframe/source-patch 구조를 그대로 복제하지 않는다. 동일 fixture benchmark와 code round-trip 증거로 renderer를 선택한다.

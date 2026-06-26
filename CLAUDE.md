# design-manual

> 컴퓨터로 디자인하는 법을 총망라 — 바이브 코딩 시대의 디자인 방법론·하네스·지식 베이스

## 목적

바이브 코딩(자연어 → UI)으로 디자이너 없이도 양질의 디자인을 뽑아내는 방법론을 정리한다.
- **How**: AI 에이전트(Claude Code, Codex, Stitch 등)에게 디자인을 "어떻게 지시"하는지 — 프롬프트 패턴, DESIGN.md 작성법, 토큰 시스템, 검증 루프
- **What**: 좋은 디자인의 구성요소(타이포·컬러·스페이싱·컴포넌트) 지식 정리
- **Harness**: 재사용 가능한 스킬/서브에이전트/템플릿 — `~/projects/custom-skills/` 와 `~/projects/custom-agents/` 로 승격

## Tech Stack

- **문서**: Markdown (Obsidian Flavored 허용 — wikilink/callout)
- **데모 프론트엔드** (필요 시): Vite + React + TypeScript + Tailwind (가벼움 우선). Shadcn/ui 또는 토큰만 손으로 정의
- **디자인 토큰 포맷**: `DESIGN.md` (Google Stitch 오픈 포맷) — YAML frontmatter(tokens) + Markdown body(rationale)
- **검증**: WCAG contrast / token reference linter, Playwright 스크린샷 (스킬 `browse`)

## Structure

```
design-manual/
├── CLAUDE.md                # (이 파일) 프로젝트 지침
├── README.md                # 외부용 진입점
├── ROADMAP.md               # 마일스톤
├── methodology/             # 방법론 — "어떻게 지시하는가"
│   ├── 00-INDEX.md
│   ├── design-md-guide.md   # DESIGN.md 작성·활용법
│   ├── prompt-patterns.md   # 프롬프트 패턴 (aesthetic/remix/ref)
│   └── verify-loop.md       # QA 루프 (스크린샷·a11y·토큰 lint)
├── knowledge/               # 지식 — "무엇이 좋은 디자인인가"
│   ├── typography.md
│   ├── color.md
│   ├── spacing-layout.md
│   └── components.md
├── templates/               # 즉시 복붙 가능한 DESIGN.md 템플릿
│   ├── minimal.md
│   ├── editorial.md
│   ├── brutalist.md
│   └── neo-claude.md
└── examples/                # 실제 생성 결과물 (before/after, prompt 포함)
```

> 스킬 자체는 본 레포가 아닌 `~/projects/custom-skills/` 에 산다 (예: `design-bootstrap`).
> 본 레포는 그 스킬이 *호출하는 도구·템플릿·지식* 만 갖는다.

## Conventions

- **단일 출처**: 디자인 지식은 `knowledge/`, 실행 가이드는 `methodology/`. 중복 시 methodology 가 knowledge 를 인용 (wikilink)
- **DESIGN.md 우선**: 모든 데모/예시는 DESIGN.md 한 장으로 출발. 토큰을 코드에 하드코딩하지 말 것
- **3-tier 토큰**: primitive(`color.gray.50`) → semantic(`surface.muted`) → component(`button.bg`). 컴포넌트는 semantic 만 참조
- **변경 이력**: 템플릿/방법론은 파일 하단에 `## Changelog` 짧게 유지 (세션 간 혼동 방지)
- **레이아웃 규칙**: 깊이 ≤5, 폴더당 ≤10 항목 (글로벌 규칙 준수)
- **임시 산출물**: `tmp/` (gitignored). archive 는 `archive/` (gitignored)

## 작업 패턴

1. **새 디자인 시스템 의뢰** → `templates/` 에서 가장 가까운 베이스 골라 fork → DESIGN.md 작성 → `design-consultation` 스킬로 보강
2. **기존 UI 비평** → `design-qa` 스킬 (WCAG + 토큰 lint + 스크린샷 diff)
3. **새 방법론 발견** → `methodology/` 에 글로 정리 → 패턴이 굳어지면 `~/projects/custom-skills/<new-skill>/SKILL.md` 작성 → `bash ~/projects/custom-skills/setup.sh` 배포

## 참고 — DESIGN.md 란?

Google Labs(Stitch) 가 오픈소스화한 포맷. 코딩 에이전트가 디자인 시스템을 "지속적·구조적"으로 이해하도록 하는 단일 markdown 파일. 자세한 가이드는 [methodology/design-md-guide.md](methodology/design-md-guide.md) 참조.

## Related

- 본 레포의 진입점 스킬: `/design-bootstrap` (소스: `~/projects/custom-skills/design-bootstrap/`)
- 글로벌 디자인 스킬 (기존, 별도 출처): `/design`, `/design-consultation`, `/design-system`, `/design-qa`, `/design-export`, `/design-flow`, `/design-full`
- 프론트엔드 코드 생성: `frontend-design:frontend-design` 스킬
- UI 용어 사전 배포: [docs/ui-vocabulary/deployment.md](docs/ui-vocabulary/deployment.md)

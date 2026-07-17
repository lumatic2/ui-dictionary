# Plan — CR Component Registry

Date: 2026-07-12
Milestone: CR (`ROADMAP.md`, active)
Status: completed 2026-07-12 — 4/4 steps; 사람(팔레트)과 에이전트(MCP/CLI/bridge HTTP)가 같은 카탈로그에서 같은 canonical 문서로 수렴함을 실 bridge round-trip으로 증명

## Hierarchy

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-canvas-production-environment.md` (H1) — UX4 완료 후 연쇄 승격.
- Outcome: shadcn/ui·Tailwind 프리미티브·프로젝트 컴포넌트를 하나의 큐레이션 카탈로그로 만들어 Insert 팔레트 v2와 에이전트(MCP/CLI)가 같은 어휘에서 꺼내 쓰게 한다.

## Scope Boundary

- CR 소유: 레지스트리 계약·큐레이션 카탈로그 데이터·팔레트 v2 소비·에이전트 조회 표면(list_components tool + CLI 서브커맨드).
- 제외(가드레일): 임의 npm 브라우징·설치·실행, 실제 소스 코드 생성/주입(RT 소관), Askewly 토큰 재스킨(AI 소관).
- 레지스트리 엔트리는 canonical `code-component` 노드로 삽입하되 source mapping은 `registry://<collection>/<slug>` 네임스페이스 참조 — 실파일 실체화는 RT에서.
- 기존 canonical/authority 경계 유지. 카탈로그는 정적 번들 데이터 + 문서 파생(프로젝트 컴포넌트)만.

## Step Tree

- [x] Step 1 — Registry package and curated catalog
  - 새 `packages/component-registry` (`@askewly/component-registry`): RegistryEntry 타입(id/slug/name/collection shadcn|layout|project/category/defaultSize/defaultProps/variants/source template), 큐레이션 카탈로그 ~20종(shadcn: button/card/input/badge/dialog/tabs/table/avatar/alert/select 등 + layout: stack/grid/container/section/heading/text), `createRegistryNode(document, entry, parentId, bounds)` planner(canvas-core factory 재사용), `searchRegistry(entries, query)`, `projectComponents(document)` 파생, 카탈로그 validator.
  - Verify: 패키지 vitest — 카탈로그 스키마 전수 검증, planner가 유효 canonical 노드 생성(assertValidDocument 통과), 검색·파생 결정성.

- [x] Step 2 — Insert palette v2 registry consumption
  - InsertPalette가 registry 카탈로그를 소비: 컬렉션 그룹(Components·Layout·Project), 검색 통합, 삽입 시 planInsert 재사용, 기존 프리미티브·빈 상태 유지.
  - Verify: InsertPalette 테스트 확장(컬렉션 렌더·검색·registry 삽입·Undo) + 전 renderer 스위트 회귀 0.

- [x] Step 3 — Agent registry surface (MCP tool + CLI)
  - MCP `list_components` tool과 `agent-canvas components` 서브커맨드가 같은 카탈로그(큐레이션+문서 파생)를 반환. 검색 파라미터 지원.
  - Verify: mcp 패키지 vitest — tool 계약, CLI exit/출력, 문서 파생 포함 여부.

- [x] Step 4 — Registry round-trip proof
  - 팔레트에서 registry 컴포넌트 검색→삽입→레이어/캔버스 반영→Undo, 그리고 에이전트 경로(list_components→apply_operations로 동일 엔트리 삽입)가 같은 문서에서 만나는 E2E. 브라우저 smoke.
  - Verify: 통합 테스트 + core/renderer/mcp 전 스위트 + 브라우저 증거.

## 결정 로그

- status: resolved
- 카탈로그 v1 = shadcn/ui 10±·layout 프리미티브 6± 큐레이션(정적 데이터) + 문서 파생 프로젝트 컴포넌트 — 사용자 확정 범위(2026-07-12 horizon Confirmed Decisions).
- source mapping = `registry://` 네임스페이스 참조(실체화는 RT) — canonical 검증 통과하는 안정 참조.
- 레지스트리 패키지 위치 = 신규 `packages/component-registry` (renderer·mcp 양쪽 소비, canvas-core 순수성 유지).
- 예상되는 추가 사용자 소유 결정: 없음.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "Step 1(신규 패키지)은 계약이 명확해 위임 적합; Step 2·3은 Step 1 API 확정 후 병렬 위임(파일군 분리: renderer vs mcp); Step 4·게이트는 오케스트레이터"
    target_roles: ["worker-implementation"]
    execution_path: claude_subagent
  spec_delta: "ROADMAP CR marker active 승격"
  perspectives:
    product: "사람과 에이전트가 같은 컴포넌트 어휘를 공유 — 사용자 비전(shadcn/tailwind 목록에서 꺼내 쓰기) 직행"
    architecture: "카탈로그는 데이터, 삽입은 기존 planInsert 합성 — 이중 상태 없음"
    security: "npm 실행·네트워크 없음, 정적 데이터만"
    qa: "스키마 전수 검증 + 양 소비자 계약 테스트 + round-trip E2E"
    skeptic: "카탈로그가 팔레트 전용이면 실패 — Step 3·4가 에이전트 경로를 강제"
  role_lanes:
    reviewer: "오케스트레이터: npm 실행·소스 생성 유입 반박, registry:// 참조 안정성 검토"
    qa: "오케스트레이터 전 스위트 독립 재실행"
    gate: "ledger 3-event 오케스트레이터 소유"
  dod:
    - "component-registry/renderer/mcp 스위트 PASS"
    - "팔레트와 에이전트가 동일 카탈로그 응답을 반환하는 계약 테스트"
    - "round-trip E2E + 브라우저 smoke"
```

## 중단점

각 step 완료 = checkpoint. blocked/error·새 사용자 결정 시 정지. CR 완료 시 H1 다음 후보 RT로 연쇄.

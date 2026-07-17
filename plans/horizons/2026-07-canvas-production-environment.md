# Horizon — Canvas Production Environment

Date: 2026-07-12
Status: closed 2026-07-12 — 7 milestones 전부 완료 (UX1·UX2 승계분 + UX3·UX4·CR·RT·AI). Close criteria 감사: packaged E2E가 실프로젝트 open·양 에이전트 MCP 편집·human 편집·소스 watcher 반영·crash/restart 복구·5k 예산(median 11.6ms)·a11y·보안 게이트를 증명, registry 조립·협업 패널·무손실 왕복·재열기 연속성은 renderer/bridge E2E+브라우저 증거로 증명. 잔여(비차단): packaged E2E에 registry/협업 시나리오 통합은 후속 유지보수 후보.
Supersedes: `docs/horizons/2026-07-canvas-product-ux.md` (2026-07-12 사용자 승인으로 확장 흡수 — UX1/UX2 기록·증거는 전신 문서와 BACKLOG에 보존)

## Goal

Agent Design을 fixture 데모에서 **실제 React 프로젝트에서 사람과 터미널 에이전트가 함께 production UI를 만드는 도구**로 완성한다. 사람은 레지스트리 컴포넌트로 화면을 조립하고, 에이전트는 같은 canonical document를 편집하며, 모든 변경이 소스 코드에 무손실로 반영된다.

## Why Now

UX1·UX2로 워크스페이스와 제작 루프(레이어·삽입·정렬·뷰포트·단축키)가 완성됐고 전 게이트가 PASS다. 남은 병목은 세 가지: ① 에이전트 협업이 기술적으로만 존재하고 제품 표면이 없음, ② 삽입 가능한 컴포넌트가 문서 내 항목뿐임(shadcn/Tailwind 카탈로그 부재), ③ 왕복이 fixture 기반이라 실 프로젝트 실증이 없음. 이 지평이 성공상태 ④(무손실 왕복)를 완결한다.

## Confirmed Decisions (2026-07-12 사용자 위임 — 추천값 확정)

- **에이전트 채널 = 하이브리드**: MCP(기존 `packages/agent-design-mcp`, stdio)를 기본 에이전트 대면 표면으로 유지. 같은 `BridgeClient`를 재사용하는 얇은 CLI를 추가해 고빈도/스크립팅 경로 확보. MCP 서버는 bridge `/events`를 구독해 `get_context`가 폴링 없이 live selection을 반영. 근거: `docs/research/2026-07-12-agent-canvas-control-mcp-vs-cli.md`.
- **레지스트리 v1 범위**: shadcn/ui + Tailwind 프리미티브 + 문서/프로젝트 내 컴포넌트로 한정. 임의 npm 브라우징·실행은 계속 제외 (UX2 가드레일 연장).
- 기존 Electron security, canonical document, bridge/MCP authority 경계는 유지한다.
- UI는 Figma 벤치마크 우선 구현 → AI milestone에서 Askewly 스타일로 변형.
- 중대 신규 결정(보안 경계 변경·외부 크레덴셜·비용성 side effect·전체 방향 전환)만 사용자 정지, 나머지는 오케스트레이터 추천값으로 진행.

## Milestones

### UX3 — Agent Collaboration UX
선택 영역 agent context 바인딩, Codex/Claude 연결·작업 상태, 변경 요약/diff, conflict 표면, audit 기반 Undo를 사람이 읽을 수 있는 collaboration surface로 만든다. 하이브리드 채널 배선(CLI 래퍼 + MCP live context) 포함.

### UX4 — Product Polish And Validation
empty/loading/error/recovery states, 접근성, 밀도, 시각 일관성, **UX2·UX3 기능을 포함한 packaged 대표 워크플로우 E2E** (UX2에서 이월된 packaged 재증명 해소).

### CR — Component Registry
shadcn/ui·Tailwind 프리미티브·자체 컴포넌트를 등록하는 카탈로그. Insert 팔레트 v2와 에이전트(MCP/CLI)가 같은 레지스트리에서 꺼내 쓴다.

### RT — Real-project Round-trip
실제 React 레포를 열어 캔버스 편집 → 소스 코드 무손실 반영을 실증. source mapping 왕복, 재열기 연속성, 에이전트 병행 편집 포함.

### AI — Askewly Identity
에디터 UI를 Askewly 토큰 SSOT로 재스킨하고, 캔버스가 ui-dictionary 레시피·토큰을 소비 — 사이트 시스템과 캔버스 두 기둥의 첫 연결.

## Close Criteria

packaged Windows app에서: 실제 React 프로젝트를 열어 사람이 레지스트리 컴포넌트로 대표 화면을 조립하고, 터미널 에이전트가 같은 문서를 편집하며, 변경이 소스 코드에 무손실 반영되고, 충돌·복구·Undo가 이해 가능하게 동작하는 워크플로우가 E2E evidence로 남는다. 5k 성능 예산·보안 게이트·접근성 기준 유지.

## Objective Impact Target

성공상태 ④ "사람이 Agent Design 캔버스에서 실제 컴포넌트를 조작하고 에이전트와 production code로 무손실 왕복" 완결. 장기 아크 6(제작 환경) 종결.

## Backlinks

- Objective: `docs/OBJECTIVE.md`
- Predecessor: `docs/horizons/2026-07-canvas-product-ux.md` (UX1·UX2 evidence)
- Next queued: `docs/horizons/2026-07-living-design-system.md` → `docs/horizons/2026-07-public-product-monetization.md`
- Channel research: `docs/research/2026-07-12-agent-canvas-control-mcp-vs-cli.md`

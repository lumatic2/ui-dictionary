# Plan — RT Real-project Round-trip

Date: 2026-07-12
Milestone: RT (`ROADMAP.md`, active)
Status: approved 2026-07-12 (Horizon-run 연쇄 — 사용자 위임 하 추천값 진행) — Step 1 pending

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — production code 무손실 왕복의 실증 심장부.
- Horizon: `docs/horizons/2026-07-canvas-production-environment.md` (H1) — CR 완료 후 연쇄 승격.
- Outcome: fixture가 아닌 현실적 React 레포에서 캔버스 편집↔소스 반영이 무손실로 돌고, registry 삽입이 실파일로 실체화되며, 재열기·에이전트 병행 편집에서 연속성이 유지된다.

## Scope Boundary

- RT 소유: 현실적 멀티컴포넌트 React 레포 ingestion 검증, 캔버스 편집→source patch 무손실 반영, registry:// 컴포넌트의 소스 실체화(codegen), 재열기 연속성, 에이전트 병행 편집 E2E.
- 제외: Askewly 재스킨(AI), 새 편집 기능, bridge authority 변경. 대상 레포는 **생성된 현실적 fixture 사본**(실사용자 레포에 쓰기 금지 — 안전 경계).
- 기존 source-patch 채널(beforeFileHash guard)·watcher 계약만 소비. 새 파일 쓰기도 같은 채널 경유.
- Test failure 3회 자가교정 후 blocked.

## Step Tree

- [ ] Step 1 — Realistic repo fixture and ingestion audit
  - 현실적 멀티컴포넌트 React fixture 생성기(마커 부착 컴포넌트 5±: hero/nav/card-grid/form/footer, 다중 파일)를 bridge 테스트 유틸로 추가하고, 기존 ingestion(마커 스캔→canonical 문서 파생) 경로를 이 레포에서 검증. 갭(다중 파일·중첩·미마커 코드 보존) 발견 시 보수.
  - Verify: bridge vitest — 다중 파일 ingestion이 결정적 canonical 문서 생성, 미마커 코드 비파괴.

- [ ] Step 2 — Lossless canvas-edit source reflection
  - 캔버스 편집(name/props/text/bounds)이 source patch로 실파일에 반영되고, 마커 밖 코드(주석·포맷·비마커 JSX)가 바이트 수준 보존됨을 검증. 반영 후 재파생 문서가 편집 결과와 일치(무손실 판정).
  - Verify: bridge vitest — 편집→패치→재파생 일치, 비대상 코드 diff 0, beforeFileHash 충돌 시 무변이.

- [ ] Step 3 — Registry component materialization
  - registry:// code-component가 소스로 실체화: `src/components/<Export>.tsx` 스캐폴드(마커 부착, defaultProps/variants 반영) 생성 + 사용 위치 JSX 삽입을 source-patch 채널로 수행하는 planner(`planMaterializeRegistryNode`). 기존 파일명 충돌 시 결정적 suffix.
  - Verify: component-registry/bridge vitest — 실체화 후 재파생 문서에서 해당 노드 source가 실파일 참조로 승격, 파일 내용 스키마 검증, 충돌 suffix 결정성.

- [ ] Step 4 — Reopen continuity and concurrent-agent E2E
  - fixture 레포에서: 캔버스 편집+registry 실체화 → 세션 재시작(재파생) 연속성 → 에이전트(bridge HTTP)와 human 편집 병행·conflict 복구까지 한 흐름. packaged 재검증은 H1 close 게이트로 이월 명시.
  - Verify: bridge 통합 테스트 + 전 스위트 매트릭스 + evidence 기록.

## 결정 로그

- status: resolved
- 대상 레포 = 생성된 현실적 fixture 사본 (실사용자 레포 쓰기 금지 — 안전 추천값; 실레포 실증은 사용자가 지정 레포를 제공할 때).
- 실체화 파일 규약 = `src/components/<ExportName>.tsx` + 기존 마커 스킴(data-agent-design-*) 재사용, 충돌 시 `<ExportName>2` 결정적 suffix.
- codegen 스타일 = 미니멀 함수 컴포넌트 + defaultProps 반영, Tailwind 클래스는 registry 기본값 수준(정교화는 AI milestone).
- 예상되는 추가 사용자 소유 결정: 없음 (실사용자 레포 대상 확대 시에만 사용자 확인).

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "Step 1-2(bridge 검증·보수)와 Step 3(registry codegen)은 파일군 분리 시 위임 가능; 순서 의존(1→2→3)이라 직렬 위임 + 오케스트레이터 게이트; Step 4는 오케스트레이터"
    target_roles: ["worker-implementation"]
    execution_path: claude_subagent
  spec_delta: "ROADMAP RT marker active 승격"
  perspectives:
    product: "왕복이 데모가 아니라 실제 코드베이스 워크플로우가 된다"
    architecture: "모든 쓰기는 기존 source-patch 채널·hash guard 경유, 새 authority 없음"
    security: "쓰기 대상은 trusted project root 내부로 한정(기존 경계), fixture 사본만"
    qa: "무손실 판정 = 재파생 일치 + 비대상 코드 diff 0 + 충돌 무변이"
    skeptic: "마커 안만 보존되고 주변 코드가 깨지면 실패 — Step 2가 바이트 보존을 강제"
  role_lanes:
    reviewer: "오케스트레이터: authority 확장·비가드 쓰기 유입 반박"
    qa: "오케스트레이터 전 스위트 독립 재실행"
    gate: "ledger 3-event 오케스트레이터 소유"
  dod:
    - "bridge/registry 스위트 PASS + 신규 무손실·실체화·연속성 테스트"
    - "재파생 일치 + 비대상 코드 diff 0 실패모드 포함"
    - "concurrent-agent E2E 증거"
```

## 중단점

각 step 완료 = checkpoint. blocked/error·새 사용자 결정·실사용자 레포 쓰기 필요 시 정지. RT 완료 시 H1 마지막 후보 AI로 연쇄.

# Plan — AI Askewly Identity

Date: 2026-07-12
Milestone: AI (`ROADMAP.md`, active) — H1 마지막 milestone
Status: approved 2026-07-12 — 3/4 steps 완료; Step 4는 5k 성능 게이트의 부하 내성 보강 후 재시도 중 (기능 게이트 전부 PASS, 코드 무죄는 worktree 이분으로 증명)

## Hierarchy

- Objective: `docs/OBJECTIVE.md` — 사이트 시스템과 캔버스 두 기둥의 첫 연결.
- Horizon: `docs/horizons/2026-07-canvas-production-environment.md` (H1) — RT 완료 후 연쇄 승격. AI 완료 시 H1 close criteria 감사.
- Outcome: 에디터 크롬이 Askewly 토큰 SSOT에서 파생되고, 캔버스가 tokenBindings를 실제 디자인 시스템 값으로 렌더하며(모드 전환 실효), H1 닫는 기준을 packaged로 감사한다.

## Scope Boundary

- AI 소유: 에디터 크롬 토큰화(하드코딩 hex 제거), 캔버스 tokenBindings 실렌더(default/dark 모드), 시각 정체성 패스, H1 close 감사(packaged 대표 워크플로우).
- 제외: 새 기능, 레시피 콘텐츠 확장(H2), 결제/공개 표면(H3).
- 토큰 정본 = 레포 루트 `tokens/askewly.tokens.json` (3-tier, DTCG) — 하드코딩 재발명 금지, 파생만.

## Step Tree

- [x] Step 1 — Editor chrome token bridge
  - `tokens/askewly.tokens.json`에서 에디터용 CSS 변수 파일을 파생(기존 generate 파이프라인 재사용 또는 renderer 전용 파생 스크립트), styles.css의 하드코딩 hex를 semantic var()로 전면 치환. 시각 회귀 없는 기계적 치환이 1차 목표.
  - Verify: 색 리터럴 lint(치환 후 styles.css hex 0 목표, 예외는 주석 근거) + renderer 전 스위트 + 브라우저 육안 대조.

- [x] Step 2 — Canvas token rendering
  - CanvasSurface nodeStyle이 hue 해시 대신 node.tokenBindings(background 등)를 SSOT 값으로 해석해 렌더. set-token-mode(askewly.default/dark)가 실제 캔버스 색을 전환. 미바인딩 노드는 중립 fallback.
  - Verify: 렌더 테스트(모드 전환 시 색 변화·바인딩 없는 노드 fallback) + 기존 스위트 회귀 0.

- [x] Step 3 — Identity polish pass (Fable 직접)
  - Figma 벤치마크 구조 위에 Askewly 정체성 적용: 포인트 컬러·radius·shadow·패널 위계 정리, 라이트 기준 완성(다크는 토큰 경로만 확보). 브라우저 양폭 검증.
  - Verify: 브라우저 스크린샷 전후 비교 + a11y 대비 유지 + 전 스위트.

- [ ] Step 4 — H1 close audit (Fable 직접)
  - packaged 재빌드 + 대표 워크플로우(registry 조립+협업 패널+생성 루프) packaged E2E·verify 체인, H1 close criteria 항목별 대조 감사, horizon 문서 close 기록 + BACKLOG 이관.
  - Verify: packaged 전 게이트 PASS + close 감사 문서.

## 결정 로그

- status: resolved
- 토큰 파생 방식 = 기존 파이프라인 산출을 renderer가 import (파이프라인 부재 시 최소 파생 스크립트, SSOT 직접 수정 금지).
- 다크 모드 = 토큰 경로 확보까지(전면 다크 완성은 후속 debt로 기록 가능).
- 캔버스 fallback = 바인딩 없는 노드는 중립 surface 계열 1색(hue 해시 폐기).
- 예상되는 추가 사용자 소유 결정: 없음.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "Step 1-2는 기계적 토큰 배선으로 위임(한 워커 직렬 — 같은 앱); Step 3 시각 판단과 Step 4 close 감사는 오케스트레이터 직접"
    target_roles: ["worker-implementation"]
    execution_path: claude_subagent
  spec_delta: "ROADMAP AI marker active 승격"
  perspectives:
    product: "캔버스가 자기가 속한 디자인 시스템을 처음으로 스스로 소비"
    architecture: "토큰은 SSOT 파생 단방향, 렌더러에 두 번째 토큰 정본 금지"
    security: "변경 없음"
    qa: "hex lint + 모드 전환 렌더 테스트 + packaged 최종 게이트"
    skeptic: "재스킨이 색만 바꾸고 SSOT와 안 이어지면 실패 — lint와 파생 경로가 강제"
  role_lanes:
    reviewer: "오케스트레이터: 이중 토큰 정본·시각 회귀 반박"
    qa: "오케스트레이터 전 스위트+브라우저+packaged 독립 확인"
    gate: "ledger 3-event + H1 close 감사 오케스트레이터 소유"
  dod:
    - "styles.css 하드코딩 hex 제거(근거 있는 예외만) + SSOT 파생 경로"
    - "token mode 전환이 캔버스 실색 변경 + 렌더 테스트"
    - "packaged 대표 워크플로우 게이트 PASS + H1 close 감사 기록"
```

## 중단점

각 step 완료 = checkpoint. AI 완료 = H1 close 감사 포함 — 이후 H2는 새 horizon 활성화이므로 사용자 보고 지점.

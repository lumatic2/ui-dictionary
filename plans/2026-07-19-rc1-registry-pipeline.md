# Plan - RC1 코드 자산 registry 파이프라인

Date: 2026-07-19
Milestone: RC1 (`ROADMAP.md`, active — Recipe Code Reuse 1/4)
Status: approved (2026-07-19)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-recipe-code-reuse.md` (1/4)
- 리서치: `research/2026-07-19-recipe-code-reuse-shadcn-registry.md`

## Scope

① 레시피 데모 54개를 실사해 **순수 데모(사이트 데이터 비결합) 1차 배치**를 선별(목표 ≥12개)하고 ② shadcn registry 호환 `registry.json` + `scripts/generate-registry.mjs`(소스 .tsx → files[].content + 의존 자동 추출 + cssVars 선언)를 만들어 `public/r/<name>.json` 으로 빌드·배포하고 ③ 자산 1개를 깨끗한 새 Vite 프로젝트에 이식해 실구동 검증한다.

## 스캐폴딩 결정

- source-of-truth: `examples/ui-vocabulary-site/src/components/*.tsx`(코드 원본 — 사이트와 자산이 같은 소스) + `examples/ui-vocabulary-site/registry.json`(자산 선언) + `scripts/generate-registry.mjs`(생성기)
- 검증: ① 생성 JSON 스키마 검증(필수 필드) ② 전수 curl(로컬 빌드 산출) ③ 깨끗한 Vite 프로젝트 이식 1건 브라우저 실구동 ④ 의존 미선언 검출(import 파싱 vs 선언 대조) 실패 경로
- 배포/운영: 사이트 정적 배포에 `public/r/` 합류(push 후 ui.askewly.com/r/). llms.txt에 Code Assets 절 추가
- 데이터: 항목 메타(레시피 md 백링크·title·설명)는 registry.json에서 관리
- 검토 후 제외: 서버·관측(정적 배포 — 해당 없음), design(코드 룩 변경 없음 — 배포만)

## 결정 로그

- [사용자 확정 2026-07-19] 방향: 에이전트가 코드에서 출발 + 스튜디오 연결 (AskUserQuestion 매듭).
- [AI 기본값] 포맷 = shadcn registry 호환(발명 금지 — 리서치 결론). 소비는 `npx shadcn add <url>`(사람)과 JSON fetch(에이전트) 병행.
- [AI 기본값] 1차 배치 = 순수 데모만(사이트 결합 제외 — 프리모템 1). 선별 기준: import가 shadcn ui/`cn`/lucide/react 범위 내.
- [AI 기본값] cssVars에는 semantic 토큰 요구를 선언해 component-restyle 리맵 접점으로.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 실사·선별 + 생성기 + registry 빌드 (changeset)
  - Artifact: changeset
  - Files: `scripts/generate-registry.mjs`(신규), `examples/ui-vocabulary-site/registry.json`(신규), `examples/ui-vocabulary-site/public/r/*.json`(산출)
  - Dependencies: 없음
  - Verify: 54개 실사 표(순수/결합 판정) + 생성 JSON ≥12개 스키마·의존 선언 검증 + 로컬 정적 서빙 curl 전수
  - Failure probe: import 파싱 vs 선언 불일치 1건 인위 주입 → 생성기가 명시 에러로 거부
  - Commit: `feat(agent): RC1 step 1 — registry generator + first batch`
- [ ] Step 2 — 이식 실구동 + llms 배선 (changeset)
  - Artifact: changeset (evidence)
  - Files: `scripts/generate-llms-txt.mjs`(Code Assets 절), `evidence/recipe-code-reuse/rc1-transplant.md`
  - Dependencies: Step 1
  - Verify: 깨끗한 새 Vite+Tailwind 프로젝트(scratchpad)에 자산 1개 이식 → 브라우저 실구동 + 스크린샷. llms.txt에 코드 자산 링크 존재
  - Failure probe: 사이트 결합 자산(예: landing-hero)을 의도적으로 생성 시도 → 선별 게이트가 제외/거부하는지 확인
  - Commit: `feat(agent): RC1 step 2 — transplant E2E + llms wiring`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: revert (기존 llms md 경로 불변 — additive)

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: expansion
  delegation_decision:
    remote_background_agents: skip
    reason: "단일 레포 빌드 파이프라인 — 검증 커맨드 명확, 실사 54개는 스크립트로"
    target_roles: []
    execution_path: local_manual
  spec_delta: "레시피 자산에 코드 계층 추가 — 문서(md) + 코드(registry JSON) 이중 배포"
  perspectives:
    product: "에이전트·사람 모두 검증된 코드에서 출발 — 재구현 품질 분산 제거"
    architecture: "사이트와 자산이 같은 소스(.tsx) — 사본 드리프트 없음, 표준 포맷 준수"
    security: "코드 공개 배포는 현행 사이트 공개 범위 내 — 신규 표면 없음"
    qa: "이식 실구동 + 의존 미선언 검출 실패 경로"
    skeptic: "결합 잔재가 자산에 새어들면 소비 실패 (프리모템 1 — 선별 게이트+이식 실구동으로 방어)"
  dod:
    - "≥12 자산 빌드 + 전수 curl + 스키마·의존 검증"
    - "깨끗한 프로젝트 이식 1건 실구동 (E2E)"
    - "실패 모드 2종(미선언 의존·결합 자산) 거부 확인"
```

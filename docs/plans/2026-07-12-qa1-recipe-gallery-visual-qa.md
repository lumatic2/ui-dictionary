# Plan - QA1 Recipe Gallery & Visual QA

Date: 2026-07-12
Milestone: QA1 (`ROADMAP.md`, active — horizon-run 연쇄 승격, QA2 완료 직후)
Status: completed (2026-07-12 — 3/3 steps, changesets #89–90)

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-quality-dogfooding.md` (active)
- Milestone: QA1 — Recipe Gallery & Visual QA (horizon 2/3)

## Scope

recipe 35종은 기계 게이트(validator·빌드)까지만 통과했고 19종은 사람이 화면에서 본 적 없다. QA1은 사이트에 전용 갤러리 섹션을 만들어 전 recipe를 실노출하고, design-qa(WCAG·스크린샷·다크모드)를 일괄 패스시키고, 발견 결함을 수정한다.

범위 밖: 캔버스 실체화(QA3), 결제/에셋(H3), 신규 recipe 수집.

중단점: build/lint 회귀 반복, sweep 불가(blocked 보고). push는 세션 단위 일괄 + 사용자 승인.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "갤러리 구현·결함 수정은 명세 고정 워커 위임. sweep·게이트·계약 갱신은 오케스트레이터."
    target_roles: ["worker(갤러리 changeset, 결함 수정 changeset)"]
    execution_path: claude_subagent
  spec_skip_reason: "제품 계약 무변경 — 기존 recipe 자산의 노출·품질 패스. recipe-format live-render 유보 계약 갱신은 Step 1에 포함."
  perspectives:
    product: "사람이 recipe를 눈으로 고르는 첫 표면 — H3 공개 경험의 전제."
    architecture: "기존 구현 컴포넌트 35종 재사용, 신규 렌더 체계 없음. 갤러리는 기존 SPA 내 섹션."
    security: "정적 사이트 — 위험 없음."
    qa: "build+lint 기준선(shadcn 경고 6) + audit:visuals + 브라우저 smoke + 전 recipe 라이트/다크 스크린샷 + WCAG contrast."
    skeptic: "빌드 통과 ≠ 보기 좋음 — 다크모드·모바일 프레임·contrast는 스크린샷 sweep으로만 잡힌다."
  role_lanes:
    qa: "sweep·contrast 검사는 오케스트레이터"
    gate: "완료 전 DoD 독립 대조 (오케스트레이터)"
  dod:
    - "갤러리 섹션에서 recipe 35종 전부 live render 열람 가능 (브라우저 관측)"
    - "전 recipe 라이트/다크 스크린샷 sweep + WCAG contrast 검사 산출물"
    - "발견 결함 목록 + 수정 + 재sweep PASS"
    - "site npm run build + npm run lint 기준선 유지"
    - "recipe-format live-render 유보 계약 갱신"
```

## Step 트리

- [x] Step 1 — Recipe Gallery 섹션 (changeset #89): 35/35 매핑, colors 페이지 패턴 배선, recipe-format 계약 갱신, 브라우저 smoke PASS. (커밋 4ab1881)
- [x] Step 2 — design-qa sweep (evidence): 35×2 캡처, contrast 후보 7건 전수 판독(전부 오탐/AA 통과), 실결함 G1/G2/G3 목록화. (커밋 7b6370f)
- [x] Step 3 — 결함 수정 (changeset #90): G1/G2 contained 데모 수렴 + 게이트 적발 크래시 2건 수정, 재sweep PASS. (커밋 e6204a1)

## 결정 로그

- [확정 2026-07-12] recipe 노출 = 전용 갤러리 섹션 — 사용자 AskUserQuestion 확정 (Quality horizon 활성화 시).
- [확정 2026-07-12] horizon-run 연쇄: QA2 승인("진행")의 연쇄 범위에 QA1→QA3 포함.
- [AI 기본값] 상세 렌더 = 기존 구현 컴포넌트 35종 재사용 (신규 렌더 체계·iframe 없음).
- [AI 기본값] 결함 수정은 QA1 내 소진 (horizon 문서의 "결함 수정" 명시 범위).
- [기존 관례] push는 세션 단위 일괄 + 사용자 승인.
- 남은 사용자 소유 결정: 없음.
- status: resolved

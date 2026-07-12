# Plan - QA1 Recipe Gallery & Visual QA

Date: 2026-07-12
Milestone: QA1 (`ROADMAP.md`, active — horizon-run 연쇄 승격, QA2 완료 직후)
Status: approved (2026-07-12 horizon-run 연쇄 — QA2 승인 시 연쇄 범위에 포함)

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

- [ ] Step 1 — Recipe Gallery 섹션 (changeset): 전용 네비 진입점 + 갤러리 인덱스(35종, surface 그룹) + 상세 live render(모바일 recipe는 DeviceFrame) + `docs/design-system/recipe-format.md` live-render 유보 계약 갱신. (verify: build + lint 기준선 + 브라우저 smoke)
- [ ] Step 2 — design-qa sweep (evidence): 전 35 recipe 라이트/다크 스크린샷 + WCAG contrast 자동 검사 → 결함 목록(심각도). (verify: sweep 산출물 + 결함 목록)
- [ ] Step 3 — 결함 수정 (changeset): sweep 결함 수정 + 재sweep. (verify: 재sweep PASS + build/lint)

## 결정 로그

- [확정 2026-07-12] recipe 노출 = 전용 갤러리 섹션 — 사용자 AskUserQuestion 확정 (Quality horizon 활성화 시).
- [확정 2026-07-12] horizon-run 연쇄: QA2 승인("진행")의 연쇄 범위에 QA1→QA3 포함.
- [AI 기본값] 상세 렌더 = 기존 구현 컴포넌트 35종 재사용 (신규 렌더 체계·iframe 없음).
- [AI 기본값] 결함 수정은 QA1 내 소진 (horizon 문서의 "결함 수정" 명시 범위).
- [기존 관례] push는 세션 단위 일괄 + 사용자 승인.
- 남은 사용자 소유 결정: 없음.
- status: resolved

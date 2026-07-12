# Plan - QA2 AskewlyDesign 설치와 dogfooding

Date: 2026-07-12
Milestone: QA2 (`ROADMAP.md`, active)
Status: awaiting approval

## 위계

- Objective: `docs/OBJECTIVE.md`
- Horizon: `docs/horizons/2026-07-quality-dogfooding.md` (active)
- Milestone: QA2 — AskewlyDesign Install & Dogfooding (horizon 첫 milestone, 사용자 확정 순서)

## Scope

데스크톱 앱은 packaged E2E 하네스로만 검증됐고 실설치·실사용이 0회다. QA2는 AskewlyDesign 이름으로 재패키징해 실제로 설치하고, 사람 시나리오로 검수하고, 적체된 유지보수 4건을 소진한다.

범위 밖: 사이트 갤러리·시각 QA(QA1), recipe 실체화(QA3), 코드 서명(별도 결정 필요 — dev 미서명 유지), 자동 업데이트 채널.

중단점: make:win 실패 반복, 설치 후 실행 불가(blocked 보고), 검증 회귀. push는 세션 단위 일괄 + 사용자 승인.

## Planning gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: use
    reason: "유지보수 4건은 명세 고정 구현이라 워커 위임(파일 영역별 병렬 가능성 검토). 재패키징·설치·dogfooding은 사용자 머신 상태 변경이라 오케스트레이터 직접 수행."
    target_roles: ["worker(유지보수 changeset ×4)"]
    execution_path: local_manual
  spec_skip_reason: "제품 계약 무변경 — 설치·검수·적체 유지보수 소진. packaged E2E 시나리오 통합은 기존 E2E 계약의 확장."
  perspectives:
    product: "사용자가 실제로 앱을 손에 쥐는 첫 순간 — dogfooding 피드백이 QA1/QA3 설계 입력이 된다."
    architecture: "설치는 기존 squirrel maker 산출물 사용. 유지보수 4건은 각자 기존 계약(토큰 경로·focus 관리·undo inverse·E2E 하네스) 내 확장."
    security: "미서명 dev 인스톨러 — 로컬 dogfooding 용도로 한정, 배포 아님. SmartScreen 경고는 예상 동작으로 기록."
    qa: "verify-package + packaged E2E + 설치 lifecycle 스크립트 + 수동 시나리오 체크리스트. 유지보수 각 건 targeted test."
    skeptic: "E2E 통과 ≠ 실사용 가능 — 첫 실행 onboarding·빈 상태·에러 메시지가 하네스에 안 잡히는 영역이므로 수동 시나리오에 명시 포함."
  role_lanes:
    qa: "설치·시나리오 검수는 오케스트레이터 + 사용자 눈 (스크린샷 evidence)"
    gate: "완료 전 DoD·결함 목록 독립 대조 (오케스트레이터)"
  dod:
    - "make:win 산출물이 AskewlyDesign 이름으로 생성 + verify-package PASS"
    - "실설치(askewly_design 설치 경로) + 시작 메뉴/실행 확인 (스크린샷)"
    - "dogfooding 시나리오 체크리스트 통과 + 결함 목록 기록 (심각도 분류)"
    - "유지보수 4건 각각 changeset + targeted test/E2E PASS"
    - "실패 모드 확인: 미서명 SmartScreen 경고 경로 + 언인스톨 lifecycle 관측"
```

## Step 트리

- [ ] Step 1 — 재패키징 + 실설치 (changeset): `npm run make:win`(AskewlyDesign 반영) → `verify-package` → 인스톨러 실행·설치 확인(설치 경로·시작 메뉴·실행 스크린샷) → 언인스톨/재설치 lifecycle 1회 관측. (verify: verify-package PASS + 설치본 실행 관측)
- [ ] Step 2 — Dogfooding 시나리오 검수 (evidence): 설치본으로 프로젝트 trust·열기 → 모바일 뷰포트 + recipe 삽입 → 편집·저장·undo → 앱 재시작 연속성 → 첫 실행 UX·빈 상태·에러 표면 관찰. 결함 목록(심각도) 기록. (verify: 체크리스트 + 스크린샷 + 결함 목록)
- [ ] Step 3 — 에디터 크롬 전면 다크 모드 (changeset). (verify: agent-design 테스트 무회귀 + 다크 전환 관측)
- [ ] Step 4 — shortcuts dialog 풀 focus trap (changeset). (verify: 테스트 + 키보드 순환 관측)
- [ ] Step 5 — 실체화 undo의 파일 삭제 시맨틱 (changeset). (verify: targeted test + 왕복 관측)
- [ ] Step 6 — packaged E2E에 registry 조립·협업 패널 시나리오 통합 (changeset). (verify: packaged E2E PASS)

## 결정 로그

- [확정 2026-07-12] Quality horizon 정식 활성화, milestone 3개(QA1/QA2/QA3), QA2 선행, recipe 노출은 전용 갤러리 — 사용자 AskUserQuestion 확정.
- [확정 2026-07-12] 앱 제품명 AskewlyDesign (리네임 changeset #83 완료).
- [AI 기본값] 코드 서명 없음(dev 미서명 유지) — 서명 인증서는 배포 horizon(H3)의 사용자 결정으로 유보.
- [AI 기본값] dogfooding 결함은 이 milestone에서 고치지 않고 목록화 — 수정은 심각도에 따라 QA1/QA3 또는 유지보수로 라우팅.
- [기존 관례] push는 세션 단위 일괄 + 사용자 승인.
- 남은 사용자 소유 결정: 없음.
- status: resolved

# Plan - ST1 스튜디오 정비

Date: 2026-07-19
Milestone: ST1 (`ROADMAP.md`, active — Cascade Studio 1/4)
Status: approved (2026-07-19 — 사용자 피드백 직반영 승인)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-cascade-studio.md` (active, 1/4)
- Milestone: ST1 — 결함 정비

## Scope

① 순위 칩 겹침 해결(카드 상단 예약 헤더 밴드로 분리) ② 카드 크기 차등(타일·이미지=대형 2열급, 일반=현행) ③ 축 순서를 영향순으로 재배열 ④ fetch-stock 해상도 분리(썸네일 medium + 최종용 large2x 동시 저장) + 계약 반영.

범위 밖: 캐스케이드(ST2), 영상(ST3).

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `templates/brief-studio.html`·`fetch-stock.py`·`docs/design-system/brief-studio.md`
- deploy: llms(계약) + 레포 커밋
- 테스트 표면: 실구동 스크린샷(칩 비겹침·크기 차등), fetch 재실행(large2x 파일 존재)

## 결정 로그

- [사용자 확정 2026-07-19] 피드백 6건 — 본 milestone은 ①②(칩·크기) + 순서 + 해상도.
- [AI 기본값] 칩은 absolute 오버레이 대신 카드 상단 고정 밴드(높이 예약). 대형 그룹 = tile·imagery (minmax 340px).
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — 스튜디오 레이아웃 정비 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html` (칩 밴드·크기 차등·AXES 영향순 재배열)
  - Dependencies: 없음
  - Verify: 실구동 스크린샷 — 칩이 콘텐츠와 겹치지 않고, tile·imagery 카드가 대형 렌더
  - Failure probe: 좁은 뷰포트(390px)에서도 칩 비겹침 확인
  - Commit: `feat(agent): ST1 step 1 — chip band + size tiers + impact order`
- [ ] Step 2 — 해상도 분리 + 계약 배포 (changeset)
  - Artifact: changeset
  - Files: `templates/fetch-stock.py` (medium+large2x 동시 저장), `docs/design-system/brief-studio.md` (해상도 계약), llms
  - Dependencies: Step 1
  - Verify: fetch 재실행 → cand-N.jpg(medium)·cand-N-full.jpg(large2x) 존재 + curl 계약 grep
  - Failure probe: large2x 부재 사진은 large→original 폴백 확인
  - Commit: `feat(agent): ST1 step 2 — resolution split + deploy`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: changeset revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "레이아웃·헬퍼 수정 — 직접"
    target_roles: []
    execution_path: local_manual
  spec_delta: "스튜디오 판독성·해상도 결함 해소"
  perspectives:
    product: "사용자 적발 결함 4종 직해소"
    architecture: "데이터 주도 구조 유지"
    security: "키 비노출 유지"
    qa: "실구동 + 좁은 뷰포트·폴백 실패 경로"
    skeptic: "크기 차등이 그리드 정렬 깨뜨릴 수 있음 — 그룹별 grid 분리로 방어"
  dod:
    - "칩 비겹침·크기 차등 스크린샷"
    - "large2x 파일 실존 + 계약 배포"
    - "실패 모드 2종 확인"
```

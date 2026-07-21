# Plan - SP3 이미지 파이프라인 (Pexels + 생성 옵션)

Date: 2026-07-19
Milestone: SP3 (`ROADMAP.md`, pending — Studio Depth 3/4)
Status: approved (2026-07-19 — 사용자 확정: 스톡 우선 + 생성 옵션)

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-studio-depth.md` (active, 3/4)
- Milestone: SP3 — 이미지 파이프라인

## Scope

① Pexels API 연동 헬퍼(`templates/fetch-stock.py` — 쿼리→후보 이미지 다운로드, `locale=ko-KR`) ② 스튜디오 이미지 그룹(사진 스타일: 실사 톤 후보 카드 — 스톡 실물 썸네일) ③ 생성 옵션 배선(comfy 로컬 / Codex image_gen — 계약 문서에 경로 명시, 실제 생성은 의뢰 시) ④ 계약·llms 배포.

범위 밖: 이미지 라이선스 자동 표기(수동 확인), Unsplash.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `templates/fetch-stock.py` + `docs/design-system/brief-studio.md` 이미지 절
- deploy: llms(계약만) + 레포 커밋
- 테스트 표면: Pexels API 실호출 1회(후보 수신), 스튜디오 이미지 그룹 렌더

## 결정 로그

- [사용자 확정] 스톡 우선(Pexels — ko-KR 정식·무승인) + 생성 옵션(comfy/image_gen).
- **[사용자 소유 — 실행 중 확인] Pexels API 키 발급**: 무료·즉시 발급이지만 계정 필요 — 키가 없으면 step-1에서 secret_required 정지 후 요청. (계획된 상호작용)
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — Pexels 헬퍼 + 실호출 검증 (changeset)
  - Artifact: changeset
  - Files: `templates/fetch-stock.py` write
  - Dependencies: SP2(스튜디오 v2 존재), Pexels API 키(사용자 — 없으면 secret_required 정지)
  - Verify: 실호출 1회 — 한국어 쿼리로 후보 N장 메타+썸네일 수신 로그
  - Failure probe: 키 미설정·율리밋 초과 시 명확한 에러 메시지(조용한 실패 금지) + 스튜디오는 이미지 그룹 없이도 동작
  - Commit: `feat(agent): SP3 step 1 — pexels stock helper`
- [ ] Step 2 — 스튜디오 이미지 그룹 + 계약 배포 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html`(이미지 스타일 그룹 — 실물 썸네일), `docs/design-system/brief-studio.md`(이미지 절: 스톡 우선·생성 옵션·라이선스 주의), llms 산출물
  - Dependencies: Step 1
  - Verify: 로컬 렌더에 실사 썸네일 후보 노출 + curl 계약 배포
  - Failure probe: 오프라인이면 이미지 그룹이 자리표시자로 degrade(페이지 불괴)
  - Commit: `feat(agent): SP3 step 2 — studio image group + deploy`

## Scope Boundary

- Execution mode: continuous
- 중단점: Pexels 키 secret_required / blocked·error
- Rollback/cleanup: changeset revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: expansion
  delegation_decision:
    remote_background_agents: skip
    reason: "API 헬퍼 1개 + 그룹 1개 — 직접"
    target_roles: []
    execution_path: local_manual
  spec_delta: "브리프에 실사 이미지 축 추가 — 플레이스홀더 시대 종료"
  perspectives:
    product: "실사가 뜨는 순간 데모 체감 품질 급상승"
    architecture: "헬퍼 표준 라이브러리(urllib), 키는 env"
    security: "PEXELS_API_KEY env만 — 커밋·로그 노출 금지(전역 규칙)"
    qa: "실호출 + 키 부재·오프라인 실패 경로"
    skeptic: "율리밋(200/h) — 후보 수 제한(그룹당 6~8)으로 충분"
  dod:
    - "Pexels 실호출 후보 수신"
    - "스튜디오 실사 썸네일 렌더 + 계약 배포"
    - "실패 모드: 키 부재 명시 에러 + degrade"
```

# Plan - ST3 영상 파이프라인 (Pexels Videos)

Date: 2026-07-19
Milestone: ST3 (`ROADMAP.md`, pending — Cascade Studio 3/4)
Status: approved (2026-07-19 — 사용자 "차라리 영상이었으면")

## 위계

- Objective: `OBJECTIVE.md`
- Horizon: `plans/horizons/2026-07-cascade-studio.md` (active, 3/4)
- Milestone: ST3 — 영상

## Scope

① fetch-stock에 Pexels Videos API(`/videos/search`, 동일 키) 지원 — HD 파일 + 포스터 이미지 저장 ② 스튜디오 이미지 축을 "이미지/영상" 축으로 확장(영상 후보는 hover 시 재생 미리보기) ③ 최종 페이지 히어로 비디오 배경 패턴(autoplay muted loop + `prefers-reduced-motion`/모바일=포스터 폴백) 계약화 + 배포.

범위 밖: 영상 편집, 업로드 영상.

## 스캐폴딩 결정

- 작업 유형: tooling
- source-of-truth: `templates/fetch-stock.py`·`brief-studio.html`·`docs/design-system/brief-studio.md`
- deploy: llms(계약) + 레포
- 테스트 표면: Videos API 실호출(HD mp4 + 포스터 다운로드), 스튜디오 영상 후보 hover 재생, 페이지 폴백

## 결정 로그

- [사용자 확정] 영상 후보 도입, 스톡 우선 유지.
- [AI 기본값] HD(1280급) 파일 선택(원본 4K는 과대), hover 시 muted 재생·이탈 시 정지. 히어로 비디오는 15MB 이하 후보 우선.
- 그 외 예상 결정: 없음
- status: resolved

## Step 트리

- [ ] Step 1 — Videos API 헬퍼 확장 + 실호출 (changeset)
  - Artifact: changeset
  - Files: `templates/fetch-stock.py` (`--video` 모드)
  - Dependencies: ST2 완료
  - Verify: 실호출 — 쿼리 1건에 HD mp4 N개 + 포스터 저장, 파일 크기 로그
  - Failure probe: 결과 0건·율리밋 시 명시 에러, 이미지 모드 무영향
  - Commit: `feat(agent): ST3 step 1 — pexels videos helper`
- [ ] Step 2 — 스튜디오 영상 후보 + 히어로 패턴 계약 (changeset)
  - Artifact: changeset
  - Files: `templates/brief-studio.html` (video 후보 hover 재생), `docs/design-system/brief-studio.md` (§영상: HD·포스터 폴백·reduced-motion 의무), llms
  - Dependencies: Step 1
  - Verify: 실구동 hover 재생 + curl 계약 grep
  - Failure probe: reduced-motion에서 자동재생 없음·포스터 표시 확인
  - Commit: `feat(agent): ST3 step 2 — video candidates + hero pattern + deploy`

## Scope Boundary

- Execution mode: continuous
- 중단점: blocked·error
- Rollback/cleanup: revert

## Planning gate

```yaml
planning_gate:
  team_validation_mode: not_required_lightweight
  scope_posture: expansion
  delegation_decision:
    remote_background_agents: skip
    reason: "헬퍼 확장 + 후보 타입 1종 — 직접"
    target_roles: []
    execution_path: local_manual
  spec_delta: "브리프에 영상 축 — 히어로 비디오 패턴 계약"
  perspectives:
    product: "저해상 사진 대비 체감 품질 도약"
    architecture: "동일 키·동일 헬퍼 확장"
    security: "키 비노출 유지"
    qa: "실호출 + 0건·reduced-motion 실패 경로"
    skeptic: "파일 크기 — HD 상한·15MB 우선으로 방어"
  dod:
    - "HD mp4 + 포스터 실파일"
    - "hover 재생 + 폴백 확인 + 계약 배포"
```

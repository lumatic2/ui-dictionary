# 20260712 실체화 undo 파일 삭제 시맨틱

Target: QA2 Step 5 — 유지보수 (ROADMAP 후보 소진).

## Scope

- registry 실체화(신규 파일 생성, `beforeFileHash === NEW_FILE_HASH`) 트랜잭션을 undo하면 `undoSourcePatch`가 빈 `beforeContent`를 다시 써서 유령 빈 파일이 남던 결함 수정.
- `apps/agent-design-bridge/src/session.ts`: 생성-기원 patch 감지 시 `rmSync`로 파일 삭제, `allowedSourceFiles`에서도 제거(실체화 전 상태 정확 복원). 기존 hash-conflict 가드(`HASH_CONFLICT`)와 비생성 patch undo 경로는 불변. persistence 실패 시 파일 재생성으로 롤백 대칭 유지.
- audit: undo 이벤트의 `afterFileHash = NEW_FILE_HASH`(파일 부재 표현), `sourceDiff`는 전체 삭제 diff.
- 테스트 3건 추가: undo→파일 삭제(빈 파일 아님), 실체화 후 파일 수정 시 hash 가드 거부, undo 재시도 clean 실패(REVISION_CONFLICT/INVALID_TRANSACTION).

## Verification

- [x] `cd apps/agent-design-bridge && npm test -- --run` — 9 files, 45/45 PASS (registry-materialization 8/8; 오케스트레이터 게이트 재실행 포함)
- [x] `npm run build` (tsc) — exit 0
- [x] 실패 모드: hash 가드 거부 + undo 재시도 clean 실패 테스트로 고정

## Result

Completed. 실체화 undo가 디스크에서 생성 파일을 삭제하고 pre-materialization 상태를 정확히 복원한다.

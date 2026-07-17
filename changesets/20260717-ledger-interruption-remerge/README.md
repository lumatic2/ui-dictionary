# execution ledger — interruption 이벤트 재병합

- Date: 2026-07-17
- Milestone: 유지보수 (AD1 잔여 정리 — harness-engineering cs#198로 verifier가 interruption 이벤트를 허용하게 되어 분리 사유 소멸)
- Scope: `.harness/execution-ledger.jsonl` (1 이벤트 삽입), `.harness/interruptions.jsonl` (삭제)

## What

- AD1 실행 중(2026-07-16) verifier의 3-event 제약 때문에 별도 파일로 분리했던 interruption 이벤트 1건("push 승인 획득 — resumed")을 execution-ledger의 시간순 위치(AD1 done_claim 직전)에 재삽입.
- `interruptions.jsonl` 삭제 — 분리 파일의 존재 사유가 소멸했고 내용이 본 장부로 흡수됨.

## Verification

- [x] 전 라인 JSON 파싱 PASS (127 lines)
- [x] task별 done_claim → adversarial_verify → task_completed 순서 위반 0 (42 tasks)
- [x] interruption 이벤트가 독립 이벤트로 존재 (완료 체인 무결)
- [x] `.harness/interruptions.jsonl` 부재 확인

# 20260712 shortcuts dialog 풀 focus trap

Target: QA2 Step 4 — 유지보수 (ROADMAP 후보 소진).

## Scope

- shortcuts dialog는 role/aria-modal·Escape 닫기·열림 시 포커스 진입·닫힘 시 opener 복원이 이미 구현돼 있었고, **Tab/Shift+Tab이 다이얼로그 밖으로 새는 것**만 갭이었다.
- `apps/agent-design/src/App.tsx`: 기존 window keydown 핸들러에 `FOCUSABLE_SELECTOR` 기반 Tab 순환(양끝 wrap, preventDefault) 추가 — 새 유틸리티·상태 없음, Escape 처리와 같은 자리.
- 테스트 1건 추가: 반복 Tab/Shift+Tab 동안 포커스가 다이얼로그 내부에 머무름.

## Verification

- [x] `cd apps/agent-design && npm test -- --run` — 10 files, 74/74 PASS (baseline 73 + 1; 오케스트레이터 게이트 재실행 포함)
- [x] `npm run build` — exit 0
- [x] 기존 테스트로 고정된 진입/복원/Escape/modal 계약 무회귀

## Result

Completed. 잔여 관찰: 배경 콘텐츠에 `inert`/`aria-hidden` 명시가 없어 스크린리더 가상 커서 순회는 별도 항목 (키보드 도달은 차단됨) — 필요 시 후속 유지보수.

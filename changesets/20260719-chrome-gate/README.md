# changeset: live browser gate

- Date: 2026-07-19
- Milestone: VB3 (`plans/2026-07-19-vb3-chrome-gate.md`)
- 사용자 지시: "결과물은 사람이 볼 수 있게 꼭 크롬으로 띄워서 유지"

## 변경

- `docs/design-system/entry-protocol.md` 5단계 개정 — 판정 표면 = 실물 브라우저: 사용자 기본 브라우저로 열기(Start-Process/open) + **확인 전 서버 유지 의무** + 확인 후 정리. 스크린샷은 증거 기록으로 존속.
- `~/projects/custom-skills/askewly-design/SKILL.md` 마무리 절 동기화 + 재배포.

## 검증 checklist

- [x] curl 배포 grep "keep that server running" 1 (attempt 6)
- [x] E2E: 꽃집 페이지 Start-Process 실열림 + 서버 curl 200 유지 (vb3-live-gate-e2e.log)
- [x] Failure probe: 별도 서버 조기 종료 → curl 000 — 유지 의무 근거 실증

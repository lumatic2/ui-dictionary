# changeset: video rotation rule (maintenance — cascade-studio 사후 보강)

- Date: 2026-07-19
- 성격: step-grade maintenance (사용자 규칙 추가 — milestone 아님, ST3 Gap 보강)
- 사용자: "영상 하나가 아니라 적어도 3종류는 써야 자연스럽게 루프가 된다"

## 변경

- `docs/design-system/brief-studio.md` §영상 — **최소 3종 로테이션 규칙** 명문: 단일 클립 loop 금지, `ended` 이벤트 순환, 수집은 각도 다른 쿼리 2~3개(동일 쿼리=동일 결과 확인됨), 크레딧 전원 표기. llms 배포.
- 야구장 실연 페이지에 즉시 적용: hero.mp4(타격)→hero-2(스윕)→hero-3(관중) 순환, loop 제거·ended 핸들러.

## 검증 checklist

- [x] 로테이션 자산 3종 서빙(curl 200) + ended 핸들러 코드
- [x] Failure probe: 동일 쿼리 재수집 → 동일 영상 반환 실측(vid2 == vid) — 규칙에 "각도 다른 쿼리" 근거로 기록
- [ ] curl 로테이션 규칙 배포 (세션 종료 후 자동 반영 — 다음 세션 preflight에서 확인)

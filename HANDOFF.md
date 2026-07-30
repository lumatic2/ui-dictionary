# HANDOFF

## 이어서 할 일
> 2026-07-31 세션 종료 시 기록

- 다음 큐(사용자 확정 2026-07-28): ① 『인터랙티브 웹 애니메이션』 책 스터디 자산화 — **사용자 주도**(사용자가 책 보며 전달) ② real-use-lap 부활(PARK — `plans/horizons/2026-07-real-use-lap.md` 헤더의 부활 조건 확인)
- 워크트리 `발표-슬라이드-만드는-법`: main 미병합 19커밋(SL1~SX3) + untracked 보고서 1건(`docs/reports/2026-07-28-sl1-slide-methodology-docs.md`) — 사용자가 "아직 할 일 남음", 병합은 /merge-worktree 로 나중에
- 워크트리 `pdf-다루는-법`: 커밋은 main 에 머지됨(dbedbe7) — **폴더·브랜치 정리만 남음**, 단 사용자가 남은 작업 있다 함 — 확인 후 정리
- 다크모드 이월 finding(유지보수, milestone 아님): 토큰 부재 강조색(App.tsx indigo/sky/emerald 칩·`#5f22a8` hover — 마커 처리됨, 토큰 신설 여부 판단) · forced-colors 대응 · 다크 전용 og-image
- 디자인 verify 타이포 7건(SQ1 이월 — ROADMAP 유지보수 후보에 기존 등재)

### 계획 위치 (cascade)
- 북극성: Askewly Design — 사람용 레퍼런스 사이트 + 에이전트용 구현 시스템
- Milestone(active): 없음 — goal `dark-mode` 완주(2026-07-31, DM1~DM3·사람 관측 2회차 통과), active goal 0
- 다음 차례: 새 goal 은 /harness-plan (책 스터디는 사용자 주도라 사용자 발화 대기)

### 현재 상태 / 주의점
- main 커밋·push 완료(2a34eab), 실배포 라이브: 다크모드 3-상태(기본 라이트·OS 무관), '다크모드' 용어(/terms/dark-mode)·knowledge llms 배선
- `lint:colors --max 0` 이 `npm run lint` 게이트에 들어감 — 셸에 리터럴 색 추가 시 lint 실패가 정상
- home-page.tsx·term-visual.tsx 는 스캐너 allowlist(데모 콘텐츠 지배 파일) — 셸 회귀는 스캐너가 못 잡으니 리뷰로

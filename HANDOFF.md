# HANDOFF

## 이어서 할 일
> 2026-08-01 세션 종료 시 기록 (goal 3개 마감 세션)

- **active goal 0** — 새 작업은 `/harness-plan`. 남은 큐: ① 『인터랙티브 웹 애니메이션』 책 스터디 자산화(사용자 주도) ② D2 Presenton 정밀 벤치·동영상 에셋 파이프(수요 미확인, deck-quality 이월).
- **kg 인입 후보 2건 미처리**(마감 시 판정만 완료): ① og:image 는 뷰어 테마 분기 불가 — 다크 톤 단일 래스터가 안전 기본값(출처 `research/2026-08-01-dark-carryover-goal-inventory.md` §C) ② 포커스 가시성 감사는 실키 Tab 으로 — programmatic focus() 는 :focus-visible 을 안 태움(출처 `evidence/finding-cleanup/m5-finding-fixes.md` 오탐 기록). `/kg` 정본 절차로 draft 인입.
- 워크트리 `발표-슬라이드-만드는-법` 병합·삭제 완료 — deck-quality(DQ1~DQ3)가 main 에 있음. 후속 슬라이드 작업은 새 워크트리에서.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 이식 가능한 제품 축 (`CLAUDE.md` 「북극성」)
- Milestone(active): 없음 — 2026-08-01 완주: `dark-carryover`(M2 토큰 전수·M3 forced-colors·M4 og-image) + `finding-cleanup`(M5 title/llms 게이트·M6 타이포 9단계) + `deck-quality`(워크트리 병합)
- 다음 차례: 사용자 방향 지정 대기 → `/harness-plan`

### 현재 상태 / 주의점
- main push 완료(`651d270`), 실배포 라이브 확인: 다크 og-image 카드·/search title "Search"·신설 토큰 전부 반영.
- **llms 정합 게이트 신설(M5)**: `docs/design-system`·`knowledge`·tokens 소스를 고치면 `node scripts/generate-tokens.mjs && node scripts/generate-llms-txt.mjs` 재생성 후 커밋해야 사이트 lint(`lint:llms`) 통과. 검사 전 대상 경로 dirty 면 exit 2 거부.
- **타이포 배선 주의(M6)**: `text-{2xs,xs,3xl,5xl,7xl}` 는 SSOT 경유. lg(20)·2xl(40)은 Tailwind 동명 기본값과 달라 미배선 — 값 다른 단계 배선 금지(렌더 무손실 계약, `archive/plans/2026-08-01-m6-*`).
- 강조·상태색은 `emphasis.*`/`status.*` 그룹 — shadcn `accent.*`(인터랙션 워시)와 섞지 말 것(M2 결정).
- untracked `tmp-patterns-reference.png` 사용자 소유 방치 유지. `tmp/og-image/` 에 시안 후보·비교 시트 잔존(gitignored — 참고용).

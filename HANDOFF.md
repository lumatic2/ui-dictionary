# HANDOFF

## 이어서 할 일
> 2026-07-29 세션 종료 시 기록

- **goal `site-quality` 완주 (2026-07-29)** — SQ1~SQ4 전부 완료·실배포 실증·사람 관측 통과. active goal 0 — 다음은 `/harness-plan` 으로 새 goal 개설.
- **다음 큐 (사용자 확정 2026-07-28 순서)**: ① 『인터랙티브 웹 애니메이션』 책 스터디 자산화 — **사용자 주도**(사용자가 책 보며 직접 전달, 대기) → ② 다크모드 정비(SQ1 색 시맨틱화로 전제 깔림 — `SiteThemeToggle` 재배선) → ③ real-use-lap 부활(RU2부터).
- **이월 finding (goal 밖 재료)**: 디자인 verify 타이포 규칙 보정(사용자 확정 후속 — 반응형 쌍 1계수 등, 이후 잔여 7건 처리) · use-case 칩 데드 경로(`setActiveUseCaseId` 비-null 호출 0곳) · App.tsx 카카오 버튼 hex 잔존(verify 스코프 밖) · home-page MeshGradient eager import · watercolor-pointer-field 데드 코드. 근거: `archive/plans/2026-07-28-sq{1,3}-*.md` finding 큐.
- **SQ4 프리렌더 운영 규약**: 새 라우트 추가 시 `scripts/prerender-ui-vocabulary.ts`(routes)와 폴백 함수 양쪽 확인 — `docs/ui-vocabulary/deployment.md` §Prerender + asset-first.
- 오너 언락 = 이메일 SHA-256 2계정(yusung806·yusung8307, `src/lib/owner.ts`). yusung8307 첫 로그인 시 authority "Access pending" 가능 — 뜨면 Askewly-company worker 쪽 계정 승인 확인.

### 계획 위치 (cascade)
- 북극성: Askewly Design — 공개 웹사이트 + 에이전트용 디자인 시스템 정본 (`CLAUDE.md` 「북극성」 절)
- Milestone(active): 없음 — goal-archive13(site-quality)까지 완료
- 다음 차례: 새 goal 개설(`/harness-plan`) 또는 사용자 책 스터디 전달 대기

### 현재 상태 / 주의점
- main == origin/main == `908ecc4`, 전부 push·배포됨(Cloudflare Pages 자동, 프리렌더 라이브 확인). 미추적 `.mcp.json` 은 이전부터 있던 것.
- 프리렌더가 754 라우트 정적 HTML 을 배포에 포함 — 배포 직후 엣지 캐시 혼재 가능(HTML max-age=0 이라 수렴). 실배포 확인은 번들 해시가 아니라 라우트 title 로 폴링.
- ROADMAP 148줄(150 내). 보고서는 `docs/reports/`(이 레포 규약 — archive/ 는 gitignored).

# HANDOFF

## 이어서 할 일
> 2026-07-28 세션 종료 시 기록

- **다음 축 = 비주얼 임팩트 정리 (사용자 확정 2026-07-28)** — three.js·toolshelf·KG 에 있는 비주얼 임팩트 방법을 정리·자산화. active goal 0 이라 `/harness-plan` 으로 새 goal 개설부터. 그 다음 순서는 『인터랙티브 웹 애니메이션』 책 스터디 자산화.
- goal `ui-encyclopedia` 완주됨 (UE1~UE5, 실서비스 실증) — 상태판 `ROADMAP.md`, 증거 `evidence/ui-encyclopedia/`.
- 이월 finding 큐 (다음 goal 후보 재료): O5 Get Started 빈 페이지 · O6 Docs 랜딩 역할 · O7 좌측 내비 IA · O9 검색 결과 UI 재디자인 · 기존 데모 디자인 verify 위반 77건 · SSG/prerender.
- **다크모드 정비 후보**: 사이트 전역 라이트 고정 상태(카탈로그 하드코딩 색 충돌). 되살리려면 `SiteThemeToggle`(App.tsx, export 보존) 재배선 + 카탈로그 색 시맨틱화.
- 오너 언락 = 이메일 SHA-256 2계정(yusung806·yusung8307, `src/lib/owner.ts`). **yusung8307 첫 로그인 시 authority "Access pending" 가능** — 뜨면 Askwely-company worker 쪽 계정 승인 확인.
- OAuth 시작은 authority 직행 고정 (`getOAuthStartOrigin`) — 프록시 경유로 되돌리면 state 쿠키 호스트 불일치로 로그인 깨진다 (evidence/ui-encyclopedia/ue4-pro-lock.md 관측 2회차).
- SPA fallback = Pages Functions (`functions/{patterns,terms,docs}/[[path]].js`·`search.js`) — 새 최상위 앱 경로 추가 시 함수도 추가 (`docs/ui-vocabulary/deployment.md` §SPA).

### 현재 상태 / 주의점
- main == origin/main == `bc6b132`, 전부 push·배포됨 (Cloudflare Pages 자동). 미추적 `.mcp.json` 은 이전부터 있던 것.
- `plans/` 에 구 horizon 시대 완료 계획서 40여 건 잔존 (UE 계획서 3건만 이번에 archive/plans 이동) — 정리는 별도 maintenance.
- ROADMAP 145줄(150 내), active goal 0 — 다음 `/harness-plan` 에서 새 goal 개설.

# UE4 — Pro 잠금 + 오너 언락 · 증거

> milestone UE4 · goal `ui-encyclopedia` · 2026-07-28
> plan: `plans/2026-07-28-ue4-pro-lock-owner-unlock.md` · changeset: `changesets/20260728-ue4-pro-lock-owner-unlock/`

## 기계 검증 (실행 관측 — 원문)

세션 route mock 3계정 (Playwright):

```
[anon] code_tabs=1 getcode=7 pro=7 unlocked=0 locked_overlays=3
[owner] code_tabs=8 getcode=0 pro=0 unlocked=7 locked_overlays=0
[owner] third example code panel opens: True
[other-user] code_tabs=1 getcode=7 pro=7 unlocked=0 locked_overlays=3
CONSOLE ERRORS: 0 · UE4 VERIFY: PASS
```

- 비로그인·**타 인증 계정** 모두 잠금 유지(첫 예제만 Code) — 이메일 SHA-256 대조가 실제로 갈라낸다. 오너 mock 은 전 예제 Code + 바리에이션 오버레이 0.
- tsc·build·lint exit 0. 오너 이메일 원문은 번들·레포 미포함(hex 해시만).
- **한계 명시**: 클라이언트 표시 층 게이트 — 정적 SPA 라 번들에 스니펫이 있어 우회 가능. 결제 도입 전 단계로 사용자 확정 범위(잠금+오너 언락만). 서버 게이팅은 결제 시 재설계.

## 배포 스모크 (실서비스 — 원문)

- `_redirects` 200 rewrite 가 이 Pages 프로젝트에서 미적용임을 실측(배포 번들 최신인데 전 규칙 404) → SPA fallback 을 Pages Functions 4개(`functions/{patterns,terms,docs}/[[path]].js`·`functions/search.js`, `env.ASSETS` 로 index.html 서빙)로 이전 (`c933fc0`).
- 배포 후: `patterns: 200 · terms: 200 · search: 200 · docs: 200 · llms.txt intact: 200 · unknown 404 intact: 404` — 앱 경로 딥링크 전부 동작, 에이전트용 404 페이지·정적 자산 보존.

## 사람 관측 (UE4 DoD 최종 항목)

- 과업: 배포 사이트(https://ui.askewly.com)에서 본인 Google 계정 로그인 → ① 아무 컬렉션(예: /patterns/marketing-footers)의 2번째 이후 예제에 Code 탭이 열리는지 ② /terms/accordion 의 Pro 변형이 조작되는지.
- 관측 1회차 (2026-07-28, 스크린샷 첨부): "code 탭이 뭘 말하는진 모르겠는데, 코드 복사하는 곳은 안 보여. 사이트 전체적으로 다크모드는 일단 막아두고 라이트 모드만 기본으로. 글자들이 안 보이기도 하고."
  - 스크린샷 판독: PRO 칩 보라(잠금 상태)·Get the code 노출 = proUnlocked=false 시점. 로그인 여부 미확인 — 재관측 시 상단바 이메일 표시 여부로 판별.
  - **결함(사용자 결정 승격): 사이트 전역 다크모드에서 카탈로그 하드코딩 색(text-slate-950 등)이 가독성 붕괴** → 라이트 고정으로 차단(`20abf56`+빌드 회복 `11ae8b3`), 다크 정비는 별도 후속. per-example 프리뷰 테마 토글은 유지. Playwright: OS 다크+저장된 다크 선호에서도 html.dark=false·stored=None PASS.
  - 부수 사고: 첫 커밋이 TS6133 빌드 실패 상태로 push 됨(`npm run build | tail` 파이프가 exit code 를 삼킴) — 즉시 회복. 이후 빌드 확인은 `${PIPESTATUS[0]}` 로.
- 관측 2회차 (2026-07-28): "로그인 하니까 https://askewly.com 으로 이동이 되어버리지 왜? 다시 들어가서 보니까 로그인 해도 코드 못보네" — **결함 2건째: OAuth 복귀 실패.**
  - 근본 원인 (worker 소스 실독, `Askwely-company/worker/oauth.ts`): 시작을 ui.askewly.com **프록시 경유**로 하면 CSRF `oauth_state` 쿠키가 ui.askewly.com host-only 로 저장되는데, Google 콜백은 등록된 redirect_uri 인 askewly.com 으로 직행 → state 쿠키 부재 → `redirectWith(origin/, "error")` = **askewly.com/?auth=error 낙하** (사용자가 본 그 현상). 로그인이 안 된 것이므로 "코드 못보네"도 같은 원인.
  - 수리 (`0de675d`): OAuth **시작만 authority 직행**(`getOAuthStartOrigin` → 항상 askewly.com). 세션 쿠키는 `Domain=.askewly.com` 공유(worker/auth.ts:139 실독)라 복귀 후 ui.askewly.com 세션 조회는 기존 프록시 경로 그대로 동작. 세션 payload 에 `email` 포함 확인(worker/index.ts:251) — 언락 대조 가능.
- **상태: 대기 (재관측 — 수리 배포 후 재로그인)**

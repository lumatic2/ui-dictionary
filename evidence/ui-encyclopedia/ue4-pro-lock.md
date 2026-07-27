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

## 사람 관측 (UE4 DoD 최종 항목)

- 과업: 배포 사이트(https://ui.askewly.com)에서 본인 Google 계정 로그인 → ① 아무 컬렉션(예: /patterns/marketing-footers)의 2번째 이후 예제에 Code 탭이 열리는지 ② /terms/accordion 의 Pro 변형이 조작되는지.
- **상태: 대기**

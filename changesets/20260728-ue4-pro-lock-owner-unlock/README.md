# changeset — UE4: Pro 잠금 + 오너 언락

> milestone UE4 · plan `plans/2026-07-28-ue4-pro-lock-owner-unlock.md` · 2026-07-28

## step-1 — 오너 판별 + patterns 코드 언락

- `src/lib/owner.ts` 신설: 오너 이메일 SHA-256 hex 대조(`isOwnerEmail` — trim+lowercase 정규화, crypto.subtle). 원문 이메일은 공개 번들·레포에 없음.
- `App.tsx`: `proUnlocked` 상태 — 세션 `{authenticated, email}` 변경 시 파생(단일점). `MarketingSectionCatalogPage` 에 prop — `hasPublicCode = exampleIndex === 0 || proUnlocked`. 잠긴 예제에 Pro 칩(언락 시 "Pro · unlocked" 녹색), CodeAccessModal 에 오너 로그인 안내 한 줄.

## step-2 — 바리에이션 갤러리 pro 잠금 실제화

- `variation-gallery.tsx`: pro 변형은 비오너에게 데모 블러+`pointer-events-none`+`inert`(포커스 차단) + 잠금 안내 오버레이. 설명·상태 칩은 잠겨도 보임(Tailwind Plus 프리뷰 관례). `TermPage` 로 prop 배선.

## step-3 — 통합 검증 + 배포 + 사람 관측

- Verify (Playwright, 세션 route mock 3계정): 비로그인 code_tabs=1·Get the code 7·변형 오버레이 3 / 오너 mock code_tabs=8·잠금 0·unlocked 칩 7·3번째 예제 Code 패널 실개방 / **타 인증 계정 mock = 비로그인과 동일 잠금**(이메일 대조 실동작). 콘솔 에러 0 · tsc·build·lint PASS.
- 사람 관측: 배포 사이트 실로그인 확인 — 아래 evidence 참조.

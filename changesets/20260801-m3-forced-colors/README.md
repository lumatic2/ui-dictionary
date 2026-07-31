# Changeset — M3: forced-colors(고대비 모드) 대응

- Milestone: M3 (goal `dark-carryover`, plan: `plans/2026-08-01-m3-forced-colors.md`)
- Date: 2026-08-01

## step-1 — 감사: 에뮬레이션 순회 + 결함 장부

- MDN 3문서 본문 확인·접근일 기록(research §B 갱신): 강제 속성 목록·box-shadow/그라디언트 소멸·forced-color-adjust·시스템 색 키워드.
- Playwright forcedColors 에뮬레이션으로 8표면 순회(라이트/다크 조합 포함) — 결함 3건(D1 스와치 소멸·D2 장식 블록 노이즈·D3 로고 포커스 불가시) + 결함 아님 판정 5건 장부화.
- Evidence: `evidence/dark-carryover/m3-forced-colors.md`

## step-2 — 수리 + 게이트

- `src/index.css` forced-colors 블록 신설: 장식 필드 숨김(D2)·전역 `:focus-visible` 시스템 색 outline(D3)·`.swatch-preserve { forced-color-adjust: none }`(D1).
- `home-page.tsx`(팔레트 보드)·`colors-page.tsx`(카드 색 스트립) 컨테이너에 `swatch-preserve` 부여 — forced-color-adjust 상속 활용, 요소별 산탄 수정 회피.
- 재순회: D1 스와치 색 보존(rgb 실측)·D2 장식 29개 숨김·D3 로고 outline solid 2px — 잔여 0. 일반 모드 장식 렌더 정상(무영향 계약). lint·build·콘솔 0 PASS.

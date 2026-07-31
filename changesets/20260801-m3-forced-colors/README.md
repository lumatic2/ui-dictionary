# Changeset — M3: forced-colors(고대비 모드) 대응

- Milestone: M3 (goal `dark-carryover`, plan: `plans/2026-08-01-m3-forced-colors.md`)
- Date: 2026-08-01

## step-1 — 감사: 에뮬레이션 순회 + 결함 장부

- MDN 3문서 본문 확인·접근일 기록(research §B 갱신): 강제 속성 목록·box-shadow/그라디언트 소멸·forced-color-adjust·시스템 색 키워드.
- Playwright forcedColors 에뮬레이션으로 8표면 순회(라이트/다크 조합 포함) — 결함 3건(D1 스와치 소멸·D2 장식 블록 노이즈·D3 로고 포커스 불가시) + 결함 아님 판정 5건 장부화.
- Evidence: `evidence/dark-carryover/m3-forced-colors.md`

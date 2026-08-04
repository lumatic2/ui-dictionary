# 20260804-m25-harvest-batch4 — M25 harvest 배치 4

> plan: `plans/2026-08-04-m25-harvest-batch4.md` · milestone: M25

## step-1 — C5-a: cursor-reactive-field 추출·등재

- home-page AtlasDemo 내장(pointer 분기 + cursorField 상태 + 감쇠 effect + CursorFieldCell 타입)을 `cursor-reactive-field.tsx` 로 캡슐화 추출, home-page 는 import 전환·구 정의 4블록 삭제(잔존 참조 grep 0).
- registry +1 (49) — meta.harvest. lint ALLOWLIST +1(고정 라이트 글리프 필드 = 콘텐츠).
- 검증: tsc 무오류 · 순수 추가 1(?? 1 + M index) · lint/build 759 routes · 실발화 probe(로컬 프리뷰): 점등 0→54(스윕 중, 글리프 o/>/_ 3종)→감쇠 13(2.5s 후).

## step-2 — C5-b: brain 인증 모달·HUD React 재작성·등재

- `auth-gate-modal.tsx`(가로막지 않는 게이트 — 이메일/Google/가입요청 3경로·닫기 3경로·첫 필드 포커스) + `focus-hud-overlay.tsx`(pointer-events-none 코너 HUD — 킥커·포커스 타이틀·활성 배지·aria-live) — viewer.html 마크업을 시맨틱 토큰 React 로 재작성. registry +2 (51).
- 검증(fresh 프로젝트 실발화): dialog aria-modal=true·포커스 Email 착지·Escape/백드롭/X 3경로 전부 닫힘·google 경로 해석 / HUD 배지 "7 memories activated"·pointer-events none·포커스 전환·Clear 숨김. 순수 추가 2(?? 2 + M index).

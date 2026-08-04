# 20260804-m25-harvest-batch4 — M25 harvest 배치 4

> plan: `plans/2026-08-04-m25-harvest-batch4.md` · milestone: M25

## step-1 — C5-a: cursor-reactive-field 추출·등재

- home-page AtlasDemo 내장(pointer 분기 + cursorField 상태 + 감쇠 effect + CursorFieldCell 타입)을 `cursor-reactive-field.tsx` 로 캡슐화 추출, home-page 는 import 전환·구 정의 4블록 삭제(잔존 참조 grep 0).
- registry +1 (49) — meta.harvest. lint ALLOWLIST +1(고정 라이트 글리프 필드 = 콘텐츠).
- 검증: tsc 무오류 · 순수 추가 1(?? 1 + M index) · lint/build 759 routes · 실발화 probe(로컬 프리뷰): 점등 0→54(스윕 중, 글리프 o/>/_ 3종)→감쇠 13(2.5s 후).

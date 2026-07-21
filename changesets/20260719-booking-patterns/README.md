# changeset: booking patterns + contract deploy (SF2 step 2)

- Date: 2026-07-19
- Milestone: SF2 step-2 (`plans/2026-07-19-sf2-composition-patterns.md`)
- Target: SF2 — 구성 패턴 완편
- 리서치: `research/2026-07-19-st4-composition-patterns.md` §3 (예약/티켓/이커머스형)

## Scope

- `templates/studio-data.default.json` — `booking-widget` 후보(위젯 히어로 → 남은 자리 → 후기 → FAQ, `hidden` 기본 — 예약·티켓·숙박·공연 업종 일치 시만 해제). 카탈로그 총 13항(12유형 + 예약형 변형).
- `docs/design-system/brief-studio.md` — §3.5 신설: 12유형 카탈로그 · 조건 노출 규칙(기본 ≤8종, 판정 근거) · 예약형 3패턴(위젯 히어로 통합·재고 실물 시각화·긴급 신호) · **긴급 신호 진실성 의무**(실재 데이터 없으면 구현 금지 — 다크패턴 방지).
- `docs/design-system/design-brief.md` — 축 4(페이지 구성) 표를 §3.5 백링크로 갱신.
- `examples/ui-vocabulary-site/public/llms/**` — 재생성 (60 assets).

## Contract

- source of truth: `docs/design-system/brief-studio.md` §3.5 + `templates/studio-data.default.json`
- deploy: llms (push 후 자동 반영 — 세션 push 배치)
- out of scope: 미리보기 다크·반응형 (SF3)

## Verification checklist

- [x] 예약 업종 데이터 → booking-widget 노출(9종) + 위젯 히어로·잔여 슬롯 미리보기 렌더 (Playwright)
- [x] 비예약 기본 데이터 → booking-widget 비노출(8종) — 조건 노출 경계 (failure probe)
- [x] llms 재생성 — 사본에 예약형 절 grep 2건
- [x] curl 배포 확인 — "예약/티켓형 특수 패턴" grep 1건 (2026-07-19 push 후 실측)

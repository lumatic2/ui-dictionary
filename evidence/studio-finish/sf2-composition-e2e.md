# SF2 — 구성 패턴 완편 E2E 실측 (2026-07-19)

## Step 1 — 신규 4유형 (Playwright, hidden 해제 데이터 `sf2-unhide.json`)

| 확인 | 관측 |
|---|---|
| 카탈로그 | 구성 후보 12종 렌더 (candCount 12) |
| compare-table 선택 | 미리보기에 "비교 항목" 비교표 렌더 — PV OK |
| problem-mech-proof 선택 | "작동 원리" 3단 렌더 — PV OK |
| ugc-first 선택 | "@사용자1" UGC 그리드 렌더 — PV OK |
| faq-trust 선택 | "보증·환불 정책" 렌더 — PV OK |
| Failure probe | 기본 데이터(hidden 유지): 노출 8종 · hidden 누출 0 · 18축·미리보기 무결 |

## Step 2 — 예약형 특수 패턴 (Playwright, `sf2-booking.json` — booking-widget hidden 해제)

| 확인 | 관측 |
|---|---|
| 조건 노출 | 예약 업종 데이터: 구성 9종 + booking-widget 존재, 다른 hidden 4종은 계속 비노출 |
| 위젯 히어로 | booking-widget 선택 → 미리보기 히어로 안에 날짜·인원·예약 위젯 렌더 (pvWidget true) |
| 재고 시각화 | "남은 자리" 슬롯 4개 + "마감" 상태 렌더 (pvSlots true) |
| Failure probe (비노출 경계) | 비예약 기본 데이터: 구성 8종 · booking-widget 비노출 (bookingLeak false) |

## 계약 배포

- `docs/design-system/brief-studio.md` §3.5 신설 — 12유형 카탈로그 · 조건 노출 판정 근거 · 예약형 3패턴 · **긴급 신호 진실성 의무**(가짜 희소성 금지, 리서치 NBC 출처).
- `docs/design-system/design-brief.md` 축 4 표 갱신(§3.5 백링크).
- `node scripts/generate-llms-txt.mjs` → 60 assets, llms 사본에 예약형 절 2건 grep 확인.
- ui.askewly.com curl: push 후 확인 — `curl -s .../brief-studio.md | grep "예약/티켓형 특수 패턴"`
- 리서치 커버 대조: 12유형 = §2.1~2.12 전량 + 예약형(§3) — 편입 완료.

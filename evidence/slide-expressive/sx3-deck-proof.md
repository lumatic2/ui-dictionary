# Evidence — SX3: 실증 (소개 덱 적용)

- Plan: `plans/2026-07-28-sx3-deck-proof.md` (연쇄 승인 집행)

## DoD 대조

| 항목 | 결과 |
|---|---|
| 신규 레이아웃 ≥1장 적용 (문구 무변경) | PASS — 표지 cover→hero-motion 전환, 제목·부제·칩 SL3 승인분 그대로 (+exportFallback 필드) |
| 자체 게이트 전부 PASS | PASS — validate `--lint` 0경고 · build 7장 · overflow 0 · tools 최신 템플릿 재동기화 |
| 브라우저 실조작 | PASS — hero-motion 표지 askewly 테마 실렌더 스크린샷(`sx3-shots/sx3-cover-live.jpeg`), 콘솔 에러 = favicon 404뿐 |
| 벡터 PDF 실산출·실개봉 | PASS — 7페이지·텍스트 914자 추출·p4 chart exportFallback 노트 계약대로·3면 래스터 눈 확인(`sx3-shots/eyecheck-p1.png` — 표지 벡터 인쇄 정상) |
| 표준 직행 예외 실사용 판정 | **정당** — hero-motion이 실덱에 문구 무변경으로 자연 착지(스키마·오버플로 마찰 0). 단 dogfood 적발 1건: R1 린트 면제 목록에 hero-motion 누락 → 수리·배포(custom-skills). **svg-filter-scene은 실덱 미적용** — 문구 동결 원칙상 카탈로그·fixture 실증으로 갈음(새 문구가 필요한 삽입은 다음 실덱 기회에) |

## 판정

SX3 DoD 충족 — completed (2026-07-28). goal `slide-expressive` 연쇄(SX1 레이아웃·SX2 벡터 PDF·SX3 실증) 완주.

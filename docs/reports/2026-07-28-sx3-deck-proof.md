# 완료 — SX3 실증 (소개 덱 적용)

> 완료: 2026-07-28 · SX3 (goal `slide-expressive`) · 배치: `docs/reports/` (이 레포 특례 — archive/ gitignore)
> **짧게 쓴다.**

## 1. 결과

Askewly Design 소개 덱 표지가 hero-motion(풀블리드 모션 히어로)으로 바뀌었고 — 승인된 문구는 한 글자도 안 바뀜 — 같은 덱이 벡터 PDF(텍스트 선택·검색 가능, 7페이지)로 나온다. SX1 레이아웃과 SX2 export 트랙이 실덱에서 함께 도는 것을 확인해 goal `slide-expressive`가 완주됐다. 표준 카탈로그 직행 예외는 "정당" 판정 — 신규 레이아웃이 마찰 0으로 착지했다.

## 2. 이슈와 해결

- dogfood 적발: hero-motion이 R1 린트 면제 목록에 없어 표지 제품명이 의심 보고 — 면제 추가·배포(custom-skills 수리 커밋). 린터가 자기 스킬의 신규 레이아웃에서 곧바로 일했다는 부수 실증.
- svg-filter-scene은 실덱 미적용 — 문구 동결 원칙(새 슬라이드 = G2~G3 재승인 사안). 카탈로그·fixture 실증으로 갈음, evidence에 정직 명시.
- DoD 잔여 없음.

## 3. 증거

- changeset: `changesets/20260728-sx3-deck-proof`
- 검증: evidence `evidence/slide-expressive/sx3-deck-proof.md` — DoD 5항 전부 PASS.
- 크기 회고: changeset 1개(커밋 1 예정)로 닫힘 — 실증 성격 milestone이라 정합(적용·게이트·판정 3 step).
- 실표면: 브라우저에서 hero-motion 표지 실렌더(스크린샷), 벡터 PDF를 PyMuPDF로 실검사(7페이지·914자 추출·p4 fallback 노트)하고 3면 래스터를 눈으로 확인.
- 재현: `cd decks/askewly-design-intro && node tools/validate-slides.mjs --lint && node tools/build-slides.mjs && node tools/export-vector-pdf.mjs`

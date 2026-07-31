# 슬라이드 표현력 심화 — 내부 실측 조사 (2026-07-28)

> 소비처: `plans/2026-07-28-sx1-impact-layouts.md` (goal `slide-expressive`). 외부 조사 불요 — 재료가 전부 이 레포·custom-skills·직전 SL 리서치에 있다(사유 명시). 코딩애플 기법 출처는 `knowledge/slide-principles.md` §표현 기법에 이미 접근일과 함께 기록됨.

## 갭 실측

1. **레이아웃 표현력**: `templates/layout-meta.json` 16종(정적 12 + 인터랙티브 4)은 전부 정보 전달형 — 임팩트 장면용(풀블리드 모션 히어로·SVG 필터 전환·스크롤 내러티브)이 0종. 코딩애플 영상의 "관종 PPT" 실체가 이 빈칸.
2. **PDF export**: `export-raster-pdf.mjs` 실측 — 슬라이드를 `page.screenshot`(PNG)으로 캡처해 이미지로 PDF에 임베드(244행 `page.pdf`는 이미지 페이지 인쇄). **텍스트 선택·검색 불가.** Slidev는 per-slide `page.pdf` + pdf-lib 병합으로 벡터 유지(SL1 리서치 실측) — 같은 구조로 벡터 트랙 추가 가능.
3. **표현 자산과의 단절**: 이 레포 recipe 47종(GSAP 핀·스크럽, shader 그라디언트, SVG 필터 등)과 expressive-stack 티어 판정 절차가 슬라이드 층에 배선 안 됨 — three-scene 상호 링크(VI8) 1건뿐.

## 활용 가능 자산

- expressive-stack 티어 계약: 하위 티어 우선·reduced-motion 게이팅·GPU lazy-load — 신규 레이아웃의 의무 계약으로 승계.
- 코딩애플 SVG 필터 기법(feTurbulence displacement·liquid blur+colorMatrix·`<animate>`): `knowledge/slide-principles.md` §표현 기법 — "임팩트 장면용, 본문 가독 영역 금지" 경계 기존재.
- 인터랙티브 레이아웃 4종의 `exportFallback` 계약 — 모션 레이아웃의 PDF 폴백에 그대로 재사용.
- SL2 린터·validator·overflow-checker — 신규 레이아웃도 같은 게이트.
- 실증 표면: `decks/askewly-design-intro/` (SL3 산출 소개 덱 — 신규 레이아웃 적용·벡터 PDF 실증 대상).

## 방향 근거

- SL3 실측: PPTX 품질 열위 → 사용자 확정 "PPTX 심화 중단, HTML/PDF 우선" (`methodology/slide-production.md` §2 결론 반영 완료).
- HANDOFF 대기 축 『인터랙티브 웹 애니메이션』 책 스터디와 연결 — 신규 모션 레이아웃이 스터디 자산의 착지 표면이 된다.

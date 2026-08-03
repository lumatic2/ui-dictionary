# changeset: m16-media-token-audit

- Milestone: M16 — 매체 통합 검증 (plan: `plans/2026-08-03-m16-media-token-audit.md`)
- Date: 2026-08-03

## step-1 — 토큰 소비 실측 장부

- `research/2026-08-03-m16-media-token-audit.md` 신설 — 슬라이드 파이프라인의 SSOT 소비 지점 전수 실측. 결론: **소비 0건** (askewly 테마 29변수 일치 0·파생 0·역할 평행 13·대응 부재 16, 스킬 내 브랜드 hex 검색 0건).
- 파이프라인 내부 규율은 건강: export-pptx = theme.mjs 단일 출처 판독, 덱 로컬 사본·배포본 drift 없음(개행만 차이). failure probe(drift) 미발생 — 정상 확인으로 기록.
- 발견: SP2 custom 테마 트랙(theme.json 주입)이 판정 A 의 기존 인입점. 문서층은 북극성 앞절(같은 SSOT 출발)과 「하지 않는 것」(화면 토큰 이식 금지)이 무해석 긴장 상태.
- Verify: 대조표 29변수 전수(REQUIRED_THEME_VARS 계수 29 일치) + 표본 3건 grep 재확인 PASS + A/B 근거 각 3줄 이상.

## step-2 — 판정 A 기록 + 게이트 문서 정합

- 사용자 판정 **A** (2026-08-03, 추천 B 기각): 슬라이드 테마는 SSOT 파생이어야 한다 — 현행 canonical 3종 = 미배선 결함(과도기) 등재.
- `docs/design-system/slide-spec.md` §5 「토큰 출발점」 신설(파생≠복사 — 「하지 않는 것」과 정합·구현 경로·과도기 허용) + §6 미구현 항목 1줄.
- `docs/design-system/medium-taxonomy.md` 발표 행에 SSOT 파생 게이트 추가.
- llms 재생성 174 assets — 문서 2건 diff 검출(잔여 probe PASS). ROADMAP 큐에 후속 goal(토큰→테마 생성기) 등재.

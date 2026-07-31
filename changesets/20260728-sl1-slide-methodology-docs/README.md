# Changeset — SL1: 발표 슬라이드 방법론 문서화

- Plan: `plans/2026-07-28-sl1-slide-methodology-docs.md` (승인 2026-07-28)
- Research: `research/2026-07-28-sl1-slide-methodology-research.md`

## step-1 — knowledge/slide-principles.md

- 신규: `knowledge/slide-principles.md` — 거장 8계보 수렴 원칙 5(표 + 근거 무게 분리: assertion-evidence만 실증, 수치 규칙은 folklore — slide-spec 등급 철학 정합) + 표현 기법(HTML 이점·SVG 필터·보안·실전 주의 3, 코딩애플 2영상 출처) + 게이트 정본 인용(재서술 0).
- Verify: 외부 인용 접근일 4건 grep 확인 · 링크 대상 실존(slide-production.md는 step-2 생성 예정 — step-3에서 재확인).

## step-2 — methodology/slide-production.md

- 신규: `methodology/slide-production.md` — HTML 정본 원칙 · export 결정표(편집 가능성 분기 4행) · 엔진 선택표(slide-deck-workflow 카드 인용) · G1~G7 순서 강제 · 매체 게이트는 slide-spec/medium-taxonomy 인용 + export별 최종 형식 확인 절차만 추가 · 린트 규칙 스펙 R1~R4(입력/판정/임계값/예외/근거 등급 표, 전부 warning·옵트인 — slide-spec §3 철학 정합, R4는 기존 checkSlideHeuristics 재사용 지정).
- Verify: 규칙 표에 입력·판정·임계값·예외 열 전부 존재 · validator 경로(tools/validate-slides.mjs)는 SKILL.md §9 실측 인용.

## step-3 — 목차·상호 링크

- 수정: `methodology/00-INDEX.md` — slide-production.md 등재 + Changelog.
- Verify: 신규 문서 2건 + 00-INDEX 의 상대 링크 전건 실존 검사 스크립트 PASS (step-1 유예분 slide-production.md 링크 포함).

## step-4 — llms 배선 + 회귀

- 수정: `scripts/generate-llms-txt.mjs` — Knowledge 섹션에 slide-principles.md 추가 + Methodology 섹션 신설(slide-production.md, 사용자 확정 첫 등재).
- 재생성: `public/llms.txt` +5줄/삭제 0 · 신규 자산 2건 복사. EOL-only 재생성 부산물 87건은 원복(diff 0줄).
- Verify: llms.txt 신규 2건 grep PASS · 기존 소실 0 · vite build PASS.

# 완료 — DQ1 덱 품질 기준 수립 (goal `deck-quality` 1/3)

> 완료: 2026-07-31 · DQ1 (goal `deck-quality`) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋·evidence 에.

## 1. 결과

"무엇이 좋은 슬라이드인가"가 스킬 계약이 됐다: 리서치 보강(원칙 18·실덱 사례 5, 전 항 출처+접근일) → `references/quality-rubric.md` Q1~Q12(장 단위 구성 7 + 덱 단위 서사·일관성 5, 항당 원칙/판정 질문/위반 예시/검사 주체 4필드) → few-shot 견본 5계열(`references/exemplars/` — 실빌드 slides.json+PNG, 죽은 예시 0) → G5 배선(루브릭 순회+같은 계열 견본 대조) + Q2 카드 상한 린트. custom-skills 2커밋(b4637ff→2cb0024) 배포·push.

## 2. 이슈와 해결

- 기존 정본 5축(거장 5원칙·slide-spec 수치 게이트·콘텐츠 린트 R1~R3·스킬 린트 R4~R6·slop 카탈로그)과의 중복 위험 → research §0 경계 지도를 먼저 그려 루브릭은 시각 구성·서사 층만 소유, 나머지는 상호 인용(사본 0).
- 정적 `cover` 레이아웃이 subtitle 을 렌더하지 않는 사양 실측 — 견본 커버는 hero-motion 으로 교체(정본 덱 선례).
- 크기 회고: changeset 1디렉터리·step 3절 — 정합.

## 3. 증거

- changeset: custom-skills `changesets/20260731-dq1-quality-rubric`
- 검증: `evidence/deck-quality/dq1-quality-rubric.md`
- 실표면: 견본 5장을 chromium 실구동으로 실빌드·실렌더해 PNG 산출·육안 확인(표지 subtitle 렌더 포함), 위반 fixture 에서 `lint Q2[통설]` warning 이 실제 출력됨을 assertion 으로 확인(정상 fixture 0건).
- 재현: `node tools/validate-slides.mjs --lint && node tools/build-slides.mjs` (exemplars/slides.json 사본 덱) + `node dq1-capture-exemplars.mjs <deck> <out>`

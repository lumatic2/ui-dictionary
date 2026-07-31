# DQ1 — 덱 품질 기준 수립 (리서치 보강 + 루브릭 + few-shot 견본)

> 2026-07-31 · plan: `plans/2026-07-31-dq1-quality-rubric.md` · changeset: custom-skills `20260731-dq1-quality-rubric`

## step-1 — 시각 품질 리서치 보강 (커밋 docs(dq1) step-1)

- `research/2026-07-31-dq1-deck-quality-refs.md`: 원칙 18(밀도·위계·그리드·색·서사·데이터 6분류, sonnet 병렬 위임 2본) + 실덱 사례 5(Jobs/Duarte·WWDC·Airbnb·Vercel Ship·reveal/Slidev — Linear·Front·Config 는 근거 부족 "확인 불가" 처리) + 루브릭 후보 Q1~Q12 표.
- 검증 실측: `grep -c "http"` = 20 (기준 ≥6) · 전 항 출처 URL+접근일 2026-07-31 · §0 경계 지도(기존 정본 5축과 중복 금지).

## step-2 — 품질 루브릭 + few-shot 견본 (custom-skills b4637ff)

- `references/quality-rubric.md`: Q1~Q12, 항당 4필드(원칙/판정 질문/위반 예시/검사 주체 린트|G5). 장 단위 Q1~Q7 + 덱 단위 Q8~Q12. 기존 정본(거장 린트·slide-spec·style-system) 상호 인용 — 사본 0 (`grep` 교차 확인).
- `references/exemplars/`: 5계열 견본(표지 훅·본문 3항·데이터 결론 제목·비교 대칭·마무리 행동요청) = slides.json 완결 덱 + 실빌드 PNG 5장 + README 주석(견본↔루브릭 항 매핑). validate 0 warning·overflow 0 issue·실렌더 육안 확인(askewly 테마). 발견: 정적 `cover` 레이아웃은 subtitle 미렌더 사양 → 견본 커버는 hero-motion(정본 덱 선례).

## step-3 — 계약 배선 (custom-skills 2cb0024)

- SKILL.md §7-7 G5 에 루브릭 순회+견본 대조 절차, §8 라우팅 표 등재.
- lint-principles Q2 신설(`--lint` warning): 카드형(hero-cards·closing·comparison-2col) 항목 >4. 실증: 위반 fixture(카드 5) → `lint Q2[통설]` 발화, 정상 fixture 0건. 린트는 validate 시점 — 빌드 산출 무변화.
- 배포: setup.sh 검증 FAIL 0 (claude·codex 양쪽 presentation-slides OK).

## 게이트

- DoD 충족: 루브릭+견본 배포·G5 대조 절차 배선·기존 fixture 산출 무변화. PASS.

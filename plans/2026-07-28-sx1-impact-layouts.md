# PLAN — SX1: 임팩트 레이아웃 2종 (슬라이드 표현력 심화)

> 생성: 2026-07-28 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `slide-expressive` 연쇄 1/3.
Status: approved (2026-07-28 사용자 승인 — 연쇄 SX2·SX3 제시됨)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "시각적 영감에서 → 구현 가능한 코드·에셋·에이전트 가이드로" 축의 발표 매체 판.
- **goal**: `slide-expressive` — 발표 슬라이드의 HTML 표현력과 PDF 품질을 심화한다 (SL3 실측 결론 "PPTX 중단·HTML/PDF 우선"의 실행, 사용자 확정 2026-07-28).
  - SX1 (이 계획서): 임팩트 레이아웃 2종 — `hero-motion`(풀블리드 모션 히어로) + `svg-filter-scene`(SVG 필터 전환 장면)
  - SX2 (연쇄 2/3): 벡터 PDF export — per-slide print + 병합, 텍스트 선택·검색 가능
  - SX3 (연쇄 3/3): 실증 — 소개 덱에 신규 레이아웃 적용 + 벡터 PDF 산출 + 게이트 왕복
- **리서치 입력**: `research/2026-07-28-sx1-slide-expressive-survey.md` — 레이아웃 16종 전부 정보 전달형(임팩트 0종), 현 PDF export는 라스터(코드 실측), 표현 자산(recipe 47·expressive-stack 계약·SVG 필터 기법) 미배선.

## Scope Boundary
- **포함**: ① `hero-motion` 레이아웃(CSS/GSAP-free 티어 우선 — 풀블리드 배경 + 단계 등장 모션, 컨테이너 스코프) ② `svg-filter-scene` 레이아웃(feTurbulence displacement 또는 liquid 계열 1기법 — 임팩트 장면 전용) ③ 둘 다 layout-meta·schema·renderer·exportFallback·fixture 완비 ④ 배포.
- **제외**: 스크롤 내러티브 레이아웃(책 스터디 축과 겹침 — 그쪽 착지로 이월) · 3종 이상 확장 · 기존 레이아웃 변경 · 벡터 PDF(SX2).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. 신규 레이아웃은 opt-in(기존 덱 무접촉 — layout enum 추가는 하위호환).

## 스캐폴딩 결정
- source-of-truth: 레이아웃 계약 = `templates/layout-meta.json` + `slides.schema.json` + renderer (SKILL.md §5 "기계적 단일 기준" 준수 — 셋 동시 갱신). 모션 계약은 expressive-stack 티어 규약 승계.
- 검증: validate·build·overflow + 신규 레이아웃 fixture 브라우저 실조작(모션 동작·reduced-motion 분기·폴백) + 기존 fixture 무회귀 + 배포본 동일 동작.
- 배포/운영: custom-skills 원본 수정 → `setup.sh --skill presentation-slides-yusung` 단일 배포(SL2 확립 경로).
- 자기선언 — 표현 계약: `prefers-reduced-motion` 시 정적 폴백 필수 · SVG 필터는 본문 가독 영역 금지(knowledge 경계) · 인터랙티브 계약대로 `exportFallback` 필수 · 티어 판정(하위 티어 우선) 주석 명기 · 외부 SVG/필터 코드 반입 없음(자작만 — 클릭재킹 경계).
- 검토 후 제외: GSAP 의존 추가(1차는 CSS 티어로 충분 — 필요 실증 후 SX3 finding으로) · Three.js(three-scene 기존재).

## 결정 로그
- status: resolved
- **방향 = HTML/PDF 우선** — 사용자 확정 2026-07-28 ("pdf나 html 쪽을 더 파는건 어때" → "제안대로 ㄱㄱ", methodology §2 결론 기록됨).
- **레이아웃 2종 선정 = hero-motion·svg-filter-scene** — 에이전트 제안, 계획 승인으로 확정(수정 시 재제시). 스크롤 내러티브는 책 스터디 축 이월.
- **표준 카탈로그 직행 (capability-notes 선례 예외)** — 스킬 관례는 "덱 로컬 프로토타입 → 반복 사용 후 승격"이나(fresh 검증자 적발), 이번엔 사용자가 표현력 확장 자체를 방향으로 확정했고 SX3가 즉시 실덱 사용을 실증하므로 표준 직행. SX3에서 실사용이 어색하면 되돌려 덱 로컬로 강등(finding).
- **새 사용자 소유 결정: 없음** (임계값·기법 선택은 expressive-stack 계약 승계 — 튜닝값).

## Step 트리

- [ ] **step-1 — hero-motion 레이아웃**
  - Artifact: layout-meta·schema enum 추가 + static/interactive renderer 구현(풀블리드 그라디언트/이미지 배경 + 제목·부제 단계 등장, CSS 애니메이션 티어, reduced-motion 분기, exportFallback) + fixture 덱 1장.
  - Files: write ~/projects/custom-skills/promoted/presentation-slides-yusung/templates/{layout-meta.json,slides.schema.json,src/renderers/*.mjs,src/css.mjs}, fixtures/impact-layouts-smoke/content/slides.json. read references/layouts.md(계약 문서 관례).
  - Risk: 위험 (schema·renderer·css 공유 파일 수정 — 기존 fixture 무회귀로 격리)
  - Dependencies: 없음
  - Verify: fixture validate·build PASS + 기존 polish-smoke build 무회귀.
  - Failure probe: ① schema enum과 layout-meta 불일치 → 넷(meta·schema·renderer·css)을 한 커밋 동시 갱신 ② **기존 reduced-motion CSS는 `.effect-*` 클래스에만 스코프됨(fresh 검증자 실측)** — 신규 레이아웃 자체 애니메이션 클래스는 css.mjs에 reduced-motion 규칙을 별도 추가하지 않으면 분기가 조용히 죽는다.
  - Commit: changeset `sx1-impact-layouts` (custom-skills 커밋, README 절: step-1).

- [ ] **step-2 — svg-filter-scene 레이아웃**
  - Artifact: 동일 3면(meta·schema·renderer) + feTurbulence displacement 배경 장면(자작 SVG, `<animate>` 시간 변화, reduced-motion 시 필터 정지) + fixture 1장 추가.
  - Files: write 위와 동일 파일셋 + fixture 확장. read knowledge/slide-principles.md §표현 기법(경계).
  - Risk: 위험 (SVG 필터 성능·가독 — 본문 텍스트를 필터 밖 레이어로 격리)
  - Dependencies: step-1
  - Verify: fixture validate·build PASS + 필터 애니메이션 동작.
  - Failure probe: 텍스트를 필터 대상에 넣으면 자글거려 가독 붕괴 — 필터는 배경 레이어 한정, 텍스트는 별도 스택.
  - Commit: changeset `sx1-impact-layouts` (README 절: step-2).

- [ ] **step-3 — 문서·배포·브라우저 검증 (SX1 마감)**
  - Artifact: references/layouts.md(또는 interactive.md)에 2종 계약 절 + SKILL.md §5 갱신 + `scripts/smoke-runner.mjs` catalogSlides()에 2종 등재(수기 목록 — fresh 검증자 실측: layoutMeta에서 파생 안 됨) + `setup.sh --skill` 배포 + 배포본 fixture 브라우저 실조작(모션·reduced-motion 에뮬레이션·폴백) + evidence.
  - Files: write custom-skills 문서 2건 + scripts/smoke-runner.mjs, evidence/slide-expressive/sx1-layouts.md. 실행: 배포 + Playwright.
  - Risk: 위험 (배포 — SL2 확립한 단일 스킬 배포 경로로 격리)
  - Dependencies: step-1, step-2
  - Verify: 배포본에서 fixture 빌드·브라우저 실렌더(모션 동작 + reduced-motion 분기 스크린샷) + 기존 fixture 무회귀.
  - Failure probe: reduced-motion 검증을 빼먹으면 접근성 회귀가 조용히 통과 — Playwright emulateMedia로 분기 양쪽 실확인.
  - Commit: changeset `sx1-impact-layouts` (README 절: step-3).

## 검증/DoD
- **DoD**: 신규 레이아웃 2종이 meta·schema·renderer·문서·fixture 완비로 스킬에 추가되고(기존 16종 무회귀), reduced-motion 분기·exportFallback 계약을 지키며, 배포본 브라우저 실조작으로 모션 동작이 확인된다.
- **Evidence**: `evidence/slide-expressive/sx1-layouts.md`
- **회귀 게이트**: 기존 fixture(polish-smoke·lint-principles-smoke) validate·build 출력 불변.

## 수치 출처
- 레이아웃 16종·라스터 export = `research/2026-07-28-sx1-slide-expressive-survey.md` (코드 실측).

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 — SL 연쇄 완주 직후, 사용자 방향 확정("HTML/PDF 우선")으로 goal 개설.

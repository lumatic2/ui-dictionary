# ROADMAP

> Last updated: 2026-08-01
> Status: **goal `dark-carryover` active (2026-08-01 승인)** — 다크모드 이월 3건 마감: M2 토큰 전수 승격 → M3 forced-colors → M4 og-image 3안 비교. 남은 큐: 『인터랙티브 웹 애니메이션』 책 스터디 자산화(사용자 주도) — real-use-lap 은 2026-07-31 폐기.
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Goal

<!-- harness:goal id="dark-carryover" status="active" -->
Goal: 다크모드 이월 3건 마감 — "토큰 부재" 강조·상태색을 3-tier 토큰으로 전수 승격하고(M2), forced-colors 접근성 모드를 감사·수리하며(M3), codex imagegen 다크·라이트 og-image 후보를 기존과 3안 품질 비교해 선택 교체한다(M4). 사이트 기본 테마=라이트 불변. 배포는 goal 마감 일괄(사용자 승인 게이트). 승인 2026-08-01 "ㄱㄱ" (연쇄 M2→M3→M4).

## Active Milestones — dark-carryover

<!-- harness:milestone id="M3" status="active" priority="P2" evidence="evidence/dark-carryover/m3-forced-colors.md" -->
### M3 — forced-colors(고대비 모드) 대응
- DoD: forced-colors 에뮬레이션에서 셸 주요 표면 판독·조작 가능(포커스 가시·경계 유지·선택 상태 구분·색-정보 요소 보존) + 일반 라이트/다크 무손실 + 다크+forced 동시 활성 조합 확인 + Windows 실물 스팟 1회(사람 핸드오프).
- Gap: DM1 정본("다크모드≠forced-colors — 별도 처리")의 실구현 부재 — 고대비 사용자에게 포커스 링·경계 소실 가능
- Scale: steps=2 (감사 장부 / 수리+게이트); surfaces: index.css forced-colors 블록·해당 컴포넌트; capability: 접근성 렌더링 모드 통과
- Plan: plans/2026-08-01-m3-forced-colors.md
- Status: [ ]

<!-- harness:milestone id="M4" status="pending" priority="P3" evidence="evidence/dark-carryover/m4-og-image-dark.md" -->
### M4 — og-image 3안 품질 비교·선택 교체
- DoD: codex imagegen 다크·라이트 톤 1200×630 후보 2종 + 기존 SVG 3안을 양 테마 목업으로 사용자가 비교 선택, 교체 시 dist 메타 정합·구 SVG 참조 0, goal 마감 일괄 배포(승인 후)로 실카드 확인.
- Gap: 현행 og:image 가 라이트 SVG 단일 — 다크 채팅 UI 어색 + SVG 크롤러 호환성 불리. og:image 는 테마 분기 불가(셸 단일 상속 — 검증자 실측)
- Scale: steps=2 (imagegen 2종+3안 비교 관측 / 메타 배선+마감 검증); surfaces: public/og-image·index.html; capability: 공유 첫인상까지 시스템의 얼굴
- Plan: plans/2026-08-01-m4-og-image-dark.md
- Status: [ ]

<!-- harness:goal-archive16 id="carryover-maintenance" status="completed" -->
Goal: 이월 유지보수 마감 — 사용자 지목 이월 finding 2건을 닫는다. closed 2026-08-01 — M1 단일 milestone 완주: 타이포 위반 8→0(규칙 쪽을 고쳐서 — 반응형 버킷 계수·사유 필수 마커 4건·임계 5→7 실측 재산정, @askewly/design 0.3.0) + SEO 셸 메타·`lang="en"` 통일(콘텐츠 제외). Details: `archive/plans/2026-07-31-m1-carryover-maintenance.md` + `docs/reports/2026-08-01-m1-carryover-maintenance.md`.

<!-- harness:goal-archive15 id="site-polish" status="completed" -->
Goal: 사이트 다듬기 — 수동 QA 직관성 결함 수리. closed 2026-07-31 — QA1(한/영 혼용) 관측 회귀 마감: **사이트 카피 = 영어 단일 확정**(`docs/design-system/copy-language.md`). QA2: Get Started 를 Primer 문법(사용자 확정 레퍼런스)+codex imagegen 일러스트 세트로 재설계, hover·cursor 반응, 관측 7왕복 통과. Details: `archive/plans/2026-07-31-qa{1,2}-*.md` + `docs/reports/2026-07-31-qa{1,2}-*.md`.

<!-- harness:goal-archive14 id="dark-mode" status="completed" -->
Goal: 다크모드 정비 — '다크모드' 정의를 지식·용어 정본으로 등재하고, 셸 하드코딩 색을 토큰화해 게이트한 뒤, 3-상태 다크모드를 활성화한다. closed 2026-07-31 — DM1(knowledge+llms·terms 등재)·DM2(셸 998→0 토큰화+lint:colors 게이트)·DM3(3-상태 활성화·기본 라이트·FOUC 없음) 단일 세션 완주, 실배포 실증·사람 관측 왕복 2회 통과(1회차 결함 3종 수리). Details: `archive/plans/2026-07-31-dm{1,2,3}-*.md` + `docs/reports/2026-07-31-dm{1,2,3}-*.md`.

<!-- harness:goal-archive13 id="site-quality" status="completed" -->
Goal: 사이트 품질 — UI 백과사전 사이트가 자기 디자인 게이트를 통과하고(verify 위반 79건), UE1 관측이 남긴 구조 결함(O5~O7)·검색 결과 UI(O9)를 수리하며, SSG/prerender 로 초기 로딩·SEO 를 확보한다. closed 2026-07-29 — SQ1(색 위반 72→0 시각 무손실)·SQ2(Get Started·Docs 허브·Components 내비)·SQ3(검색 2티어 재디자인)·SQ4(754 라우트 프리렌더+asset-first) 전부 실배포 실증, 사람 관측 3회 통과. Details: `archive/plans/2026-07-28-sq{1,2,3,4}-*.md` + `docs/reports/`.

<!-- harness:goal-archive12 id="visual-impact-consolidation" status="completed" -->
Goal: 비주얼 임팩트 정리 — 흩어진 비주얼 임팩트 방법(knowledge-graph 노드 19건, toolshelf 카드 15건, presentation-slides three-scene·3d-repolis)을 VI1~VI5 표현 스택 체계로 대조·판정·흡수해 자산화한다. closed 2026-07-28 — VI6(KG 19노드 판정·motion-principles 신설)·VI7(15카드 배치·llms 배선 완결)·VI8(recipe 2종 실구현·상호 링크) 단일 세션 완주. Details: `research/2026-07-28-visual-impact-goal-inventory.md` + `docs/reports/2026-07-28-vi{6,7,8}-*.md`.

<!-- harness:goal-archive11 id="ui-encyclopedia" status="completed" -->
Goal: UI 백과사전 — 들어가서 용어의 생김새·쓰임·바리에이션을 보고, 헤더·푸터 등 Page Sections 의 종류와 디자인 레퍼런스(직접 구현 데모)를 본다. 유료 경계 = Tailwind Plus 모델, 오너 로그인 전체 열람(결제는 범위 밖). closed 2026-07-28 — UE1~UE5 전부 완료·실서비스 실증(관측 왕복 총 8회, 결함 16건 발견·수리). Details: `archive/plans/2026-07-27-ue1-encyclopedia-navigation.md`(연쇄 정의) + `research/2026-07-27-ue1-encyclopedia-diagnosis.md`.

<!-- harness:goal id="real-use-lap" status="skipped" -->
Goal: 실사용 한 바퀴 — Askewly Design으로 Askewly Design 소개 덱(PPTX)을 실제로 만들고, 막히는 지점만 결함으로 기록해 milestone으로 삼는다. **제거(2026-07-31, 사용자 판정: 낡음)** — PARK(2026-07-27) 상태에서 부활 없이 폐기. horizon 문서 삭제(git 이력 보존), RU1 결함 장부(`evidence/real-use-lap/ru1-deck-production.md`)·파일럿 실측(`research/2026-07-27-ru2-pilot-defect-measurement.md`)은 기록으로 유지.

<!-- harness:goal-archive10 id="design-output-gates" status="completed" -->
Goal: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로. closed 2026-07-22 — DOG1~DOG6 완료, **DOG7(사람 관측) 보류**: 관측 1회 실시했으나 verify 위반 0건이라 오탐률 미측정·승격 판정 미획득. 게이트는 경고 유지. Details: `plans/horizons/2026-07-design-output-gates.md`.

<!-- harness:goal-archive9 id="vocabulary-in-use" status="completed" -->
Goal: askewly-design 호출 경로에 UI 용어 사전 562개를 집어넣고, 요구 한 문장에서 요소를 판정해 구현 자산까지 착지하는 흐름을 완성한다. closed 2026-07-21 — 7항 중 6 PASS · 1 미달(사람 관측: 조회 절차 미준수). Details: `archive/horizons/2026-07-vocabulary-in-use.md`.

<!-- harness:goal-archive8 id="editor-color-and-token-editing" status="completed" -->
Goal: 편집기에서 색이 색으로 보이고, 바꿔진다 — 인스펙터 UI·토큰 조회 API·검증 계층·렌더러 4표면. closed 2026-07-21 — 7항 중 6 PASS, 기준 6(판단 가능성) **부분 충족 명시**. Details: `plans/horizons/2026-07-editor-color-and-token-editing.md`.

<!-- harness:goal-archive7 id="editor-legibility" status="completed" -->
Goal: AskewlyDesign 편집기를 사람이 화면만 보고 판단할 수 있는 물건으로 만든다 — 조작감과 판독성 두 축. closed 2026-07-21 — 6항 중 5 PASS, 기준 6(판단 가능성) **미달 명시**. Details: `archive/horizons/2026-07-editor-legibility.md`.

<!-- harness:goal-archive6 id="template-production-hardening" status="completed" -->
Goal: 템플릿 제작 파이프라인을 선언 수준에서 실제 동작 수준으로 끌어올린다. closed 2026-07-20 — 닫는 기준 9항 중 8 PASS, 기준 7(실사용·편집기 축) **미달 명시**. Details: `archive/horizons/2026-07-template-production-hardening.md`.

<!-- harness:goal-archive5 id="template-production-system" status="completed" -->
Goal: 브리프·토큰·레시피를 명함·제품 포스터·인포그래픽의 편집 가능한 CanvasDocument와 브라우저 제작 루프로 바꾼다. Details: `plans/horizons/2026-07-template-production-system.md`.

<!-- harness:goal-archive4 id="recipe-code-reuse" status="completed" -->
Goal: 사이트 레시피 데모 실구현을 registry 코드 자산으로 배포하고, 에이전트 코드 출발 계약과 스튜디오 구성↔레시피 매핑을 배선한다. Details: `plans/horizons/2026-07-recipe-code-reuse.md`.

<!-- harness:goal-archive3 id="studio-finish" status="completed" -->
Goal: 스튜디오 이월 갭 3건 마감 — 데이터 주도 주입 자동화·구성 패턴 완편(4유형+예약형)·미리보기 고도화(다크·반응형). Details: `plans/horizons/2026-07-studio-finish.md`.


## Active Milestones — carryover-maintenance

## Active Milestones — site-polish

<!-- harness:milestone id="QA1" status="skipped" priority="P1" evidence="evidence/site-polish/qa1-copy-language.md" -->
### QA1 — 한/영 혼용 카피 정책 정본화 + 셸 적용
- DoD: (원안) 셸 자기-목소리 한국어 전환. **회귀 마감(2026-07-31)** — 랜딩 전환본을 사용자가 관측 후 기각, 영어 단일 확정. 산출물로 `docs/design-system/copy-language.md`(영어 단일 정책 기록)+llms 배선은 남김.
- Plan: plans/2026-07-31-qa1-copy-language-policy.md
- Status: [x] **회귀(2026-07-31)** — 사유: 취향 관측 기각. 교훈: 언어·톤 결정은 실물 시안 관측 먼저.

## Active Milestones — dark-mode

## Active Milestones — site-quality

## Active Milestones — ui-encyclopedia

<!-- harness:milestone id="UE2" status="completed" priority="P1" evidence="evidence/ui-encyclopedia/ue2-variation-gallery.md" -->
### UE2 — 용어 상세에 바리에이션 갤러리
- DoD: 변형·상태 층(TS 레지스트리)이 있고 상세 페이지가 실동작 갤러리로 렌더하며, 파일럿 2건(아코디언·탭)이 실데이터로 채워진다(변형 차별성 포함). 미등록 용어 무변화, Pro 표시 자리, 사람 관측 1회.
- Evidence: evidence/ui-encyclopedia/ue2-variation-gallery.md
- Gap: 아코디언 시각 자료가 미니목 1장 — 변형·상태·레퍼런스 0건 (진단 결함 3, O10 변형 차별성 교훈 반영)
- Scale: steps=3 (데이터 층·갤러리 렌더러·통합+관측); surfaces: term-variations 레지스트리·variation-demos·term-page; capability: 찾은 페이지에 볼 것
- Plan: archive/plans/2026-07-27-ue2-variation-gallery.md
- Status: [x]

- Completed at: 2026-07-27
- Summary: 변형·상태 레지스트리 + 상세 갤러리 — 아코디언 4변형·탭 3변형 실동작, Pro 배지 표시 층, 미등록 용어 무변화. Playwright 6항·디자인 verify PASS, 사람 관측 통과
<!-- harness:milestone id="UE3" status="completed" priority="P1" evidence="evidence/ui-encyclopedia/ue3-batch2.md" -->
### UE3 — Page Sections 전체 레퍼런스 → 직접 구현 데모 (배치식)
- DoD: Page Sections 컬렉션(약 16종)이 Dribbble·Pinterest 등 레퍼런스 헌팅(출처 URL+접근일 장부) → 재해석 직접 구현 데모로 채워진다. 배치 1 = Header Sections·Footers. source-quality + 노출 정책(채워진 것만 나열·실개수) 적용.
- Plan: (UE2 완료 후 별도 plan doc — 배치 순서·카테고리당 최소 기준 확정)
- Status: [x]

- Completed at: 2026-07-28
- Evidence: evidence/ui-encyclopedia/ue3-batch2.md
- Summary: Page Sections 16종 레퍼런스→실동작 데모 정비 (배치 1 헤더/푸터 + 배치 2 나머지 14종)
<!-- harness:milestone id="UE4" status="completed" priority="P2" evidence="evidence/ui-encyclopedia/ue4-pro-lock.md" -->
### UE4 — Pro 잠금 + 오너 언락
- DoD: Tailwind Plus 모델 잠금(정의·대표 데모 미리보기 무료, 바리에이션 전체·코드 복사 Pro)이 동작하고, Google 로그인 세션 이메일이 소유자와 일치하면 전체 열람된다. 결제 연동은 범위 밖.
- Plan: archive/plans/2026-07-28-ue4-pro-lock-owner-unlock.md
- Status: [x]

- Completed at: 2026-07-28
- Evidence: evidence/ui-encyclopedia/ue4-pro-lock.md
- Summary: Tailwind Plus 방식 잠금 + 오너(이메일 해시 대조) 전체 언락 — 실서비스 실증
<!-- harness:milestone id="UE5" status="completed" priority="P1" evidence="evidence/ui-encyclopedia/ue5-routing-split.md" -->
### UE5 — 페이지 분리 (라우팅 전환)
- DoD: 화면들이 실제 URL 경로(라우트 단위)로 분리되고, 기존 쿼리 URL 은 리다이렉트로 하위호환되며, 코드 분할로 초기 청크가 줄어든다. UE1 의 탐색 회귀(내비·검색·딥링크·뒤로가기) 전부 유지 — 사람 관측 1회 포함.
- Evidence: evidence/ui-encyclopedia/ue5-routing-split.md
- Gap: 23,507줄 App.tsx 상태 기반 SPA — 뒤로가기·SEO·코드분할 전부 불리 (사용자 확정 2026-07-27 "분리는 진행하는 게 좋겠어"). UE3 대량 콘텐츠 투입 전 실행.
- Scale: steps=3 (라우터 골격+리다이렉트 · 모듈 분리+코드 분할 · 통합 회귀+사람 관측); surfaces: main/routes/App 셸·화면 모듈; capability: 읽히는 URL 과 분할 로딩
- Plan: archive/plans/2026-07-27-ue5-routing-split.md
- Status: [x]

- Completed at: 2026-07-27
- Summary: React Router 도입 — /terms·/patterns·/docs·/search 경로, 구 쿼리 URL 전형태 리다이렉트, 초기 청크 3,324→1,758kB(-47%), App.tsx 23.5k→6.3k줄. 회귀 10항+통합 5항 PASS, 사람 관측 1회 통과
## 유지보수 후보 (milestone 아님)

> 이월 finding 전수 장부는 `docs/findings.md` (2026-07-20 수집 — A~F 6군). 아래는 이 horizon 밖 항목만.

- ~~디자인 verify 타이포 규칙 보정~~ — **해소 2026-08-01 (M1)**: 버킷 계수·사유 필수 마커·임계 5→7 재산정으로 위반 0. 남은 후속은 토큰 타이포 스케일 확장 여부(헤딩 단계·마이크로 라벨 부재).
- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; vocabulary-in-use (VL7–VL8) closed 2026-07-21 · real-use-lap RU1 closed 2026-07-22(미달) — 2026-07-28 BACKLOG 이관, template-production-system (TPS1–TPS5) closed 2026-07-19, recipe-code-reuse (RC1–RC4) closed 2026-07-19, skill-entry (SE1–SE2) closed 2026-07-18, design-brief (DB2) closed 2026-07-19, Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.

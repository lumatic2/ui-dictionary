# ROADMAP

> Last updated: 2026-07-28
> Status: **goal `slide-methodology` 진행 중 (워크트리 lumatic2/발표-슬라이드-만드는-법)** — SL1 방법론 문서화 active. 이전 goal `visual-impact-consolidation` 완주(2026-07-28). 대기 순서(사용자 확정 2026-07-28): ② 『인터랙티브 웹 애니메이션』 책 스터디 자산화 ③ 사이트 품질(finding 큐 O5~O9·verify 위반 77건·SSG) ④ 다크모드 정비 ⑤ real-use-lap 부활(PARK 2026-07-27 — SL3가 부활 조건과 연계).
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Goal

<!-- harness:goal id="slide-methodology" status="active" -->
Goal: 발표 슬라이드 방법론 — 발표 슬라이드를 HTML 정본으로 만들고 PPT·PDF·HTML 세 형식으로 내는 방법론을 knowledge/methodology 로 자산화하고(SL1), 거장 원칙을 린터로 옮기고(SL2), 편집 가능 PPTX 경로를 Askewly Design 소개 덱으로 실증한다(SL3 — real-use-lap 연계). 리서치: `research/2026-07-28-sl1-slide-methodology-research.md` (상류: KG 노드 2·toolshelf 카드 4).

## Active Milestones — slide-methodology

<!-- harness:milestone id="SL2" status="completed" priority="P1" evidence="evidence/slide-methodology/sl2-linter.md" -->
### SL2 — 슬라이드 린터
- DoD: SL1 린트 규칙 스펙(제목 완결문장·슬라이드당 메시지 1·텍스트/시각 비율·폰트 하한)이 custom-skills presentation-slides-yusung validator 에 구현되고(cross-repo, VI8 선례), 위반 fixture 로 검출 실증 + setup.sh 배포.
- Plan: plans/2026-07-28-sl2-slide-linter.md
- Status: [x]

- Completed at: 2026-07-28
- Evidence: evidence/slide-methodology/sl2-linter.md
- Summary: R1~R3 옵트인 린트 구현(custom-skills)·위반 fixture 각 1건 검출·오탐 0·배포본 동일 동작 — 기존 fixture에서 R1 실적발 1건 부수 확인
<!-- harness:milestone id="SL3" status="active" priority="P1" -->
### SL3 — 편집 가능 PPTX 실증
- DoD: Askewly Design 소개 덱을 방법론대로 실제 제작(HTML 정본)하고 html2pptx(pptxgenjs) vs ppt-master(SVG→DrawingML) 경로로 PPTX 를 뽑아 편집 가능성·충실도를 비교 장부로 기록, PowerPoint/LibreOffice 실개봉 확인. real-use-lap 부활 조건 판정 포함.
- Plan: plans/2026-07-28-sl3-editable-pptx-proof.md
- Status: [ ]

<!-- harness:goal-archive12 id="visual-impact-consolidation" status="completed" -->
Goal: 비주얼 임팩트 정리 — 흩어진 비주얼 임팩트 방법(knowledge-graph 노드 19건, toolshelf 카드 15건, presentation-slides three-scene·3d-repolis)을 VI1~VI5 표현 스택 체계로 대조·판정·흡수해 자산화한다. closed 2026-07-28 — VI6(KG 19노드 판정·motion-principles 신설)·VI7(15카드 배치·llms 배선 완결)·VI8(recipe 2종 실구현·상호 링크) 단일 세션 완주. Details: `research/2026-07-28-visual-impact-goal-inventory.md` + `docs/reports/2026-07-28-vi{6,7,8}-*.md`.

<!-- harness:goal-archive11 id="ui-encyclopedia" status="completed" -->
Goal: UI 백과사전 — 들어가서 용어의 생김새·쓰임·바리에이션을 보고, 헤더·푸터 등 Page Sections 의 종류와 디자인 레퍼런스(직접 구현 데모)를 본다. 유료 경계 = Tailwind Plus 모델, 오너 로그인 전체 열람(결제는 범위 밖). closed 2026-07-28 — UE1~UE5 전부 완료·실서비스 실증(관측 왕복 총 8회, 결함 16건 발견·수리). Details: `archive/plans/2026-07-27-ue1-encyclopedia-navigation.md`(연쇄 정의) + `research/2026-07-27-ue1-encyclopedia-diagnosis.md`.

<!-- harness:goal id="real-use-lap" status="pending" -->
Goal: 실사용 한 바퀴 — Askewly Design으로 Askewly Design 소개 덱(PPTX)을 실제로 만들고, 막히는 지점만 결함으로 기록해 milestone으로 삼는다. **보류(2026-07-27)** — UI 백과사전 축 우선, 부활 조건은 horizon 문서 헤더. Details: `plans/horizons/2026-07-real-use-lap.md`.

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


## Active Milestones — visual-impact-consolidation

<!-- harness:milestone id="VI7" status="completed" priority="P1" evidence="evidence/visual-impact-consolidation/vi7-placement.md" -->
### VI7 — 도구 층 배치
- DoD: toolshelf 비주얼 임팩트 카드 15건이 표현 스택 4티어에 배치되고 채택/보류/제외 판정(TC1 taste 흡수 계약 준수, 카드별 출처+사유)이 결정표에 반영되며 `shelf used` 기록이 남는다. + llms 배선 finding 해소(knowledge 3문서 전부 등재).
- Plan: archive/plans/2026-07-28-vi7-toolshelf-placement.md
- Status: [x]

- Completed at: 2026-07-28
- Evidence: evidence/visual-impact-consolidation/vi7-placement.md
- Summary: 15카드 전수 판정(A완료1·A대기2·B8·C4) — absorption-criteria 9행, llms knowledge 3문서 배선 완결, shelf used 8건
<!-- harness:milestone id="VI8" status="completed" priority="P1" evidence="evidence/visual-impact-consolidation/vi8-recipes.md" -->
### VI8 — 실증 확장
- DoD: VI7 A 대기 2건(GSAP 핀·스크럽, Paper Shaders 그라디언트)이 실동작 recipe(데모+문서+갤러리+catalog/llms)로 구현되고(브라우저 실동작 콘솔 0에러·validate-recipes·빌드·린트 PASS, reduced-motion·폴백 계약), presentation-slides three-scene 계약이 recipe 층과 상호 링크된다.
- Plan: archive/plans/2026-07-28-vi8-expressive-recipes.md
- Status: [x]

- Completed at: 2026-07-28
- Evidence: evidence/visual-impact-consolidation/vi8-recipes.md
- Summary: recipe 2종 실구현(Playwright 5/5·콘솔0, oklch→hex 결함 수리) + three-scene 상호 링크 — goal visual-impact-consolidation 완주
## Active Milestones — ui-encyclopedia

<!-- harness:milestone id="UE1" status="completed" priority="P0" evidence="evidence/ui-encyclopedia/ue1-navigation.md" -->
### UE1 — 탐색이 작동한다
- DoD: 사용자가 ① 검색으로 '아코디언' 상세에 도달하고 ② 사이드바로 'Header Sections' 목록에 도달하고 ③ 그 주소를 새 탭에서 재현할 수 있으며, 사람 관측 1회로 확인된다. 기존 URL 형태 전부 하위호환.
- Evidence: evidence/ui-encyclopedia/ue1-navigation.md
- Gap: 사이드바 카테고리 클릭 무반응(조용한 return)·딥링크 홈 폴백 — 실측 `research/2026-07-27-ue1-encyclopedia-diagnosis.md`
- Scale: steps=3 (내비 수리·URL 계약·통합 E2E+사람 관측); surfaces: App.tsx 내비·URL 배선, navigation-model; capability: 백과사전의 첫 동사 "찾는다"
- Plan: archive/plans/2026-07-27-ue1-encyclopedia-navigation.md
- Status: [x]

- Completed at: 2026-07-27
- Summary: 탐색 수리 — 사이드바 착지·검색 전역화(제안+결과 2경로)·딥링크·뒤로가기·TOC sticky·스크롤 격리. 사람 관측 3회 왕복(결함 10건 적발, 좁은 5건 즉시 수리, 구조 5건 finding 큐), 3회차 통과. UE5(분리) 사용자 확정
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

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; vocabulary-in-use (VL7–VL8) closed 2026-07-21 · real-use-lap RU1 closed 2026-07-22(미달) — 2026-07-28 BACKLOG 이관, template-production-system (TPS1–TPS5) closed 2026-07-19, recipe-code-reuse (RC1–RC4) closed 2026-07-19, skill-entry (SE1–SE2) closed 2026-07-18, design-brief (DB2) closed 2026-07-19, Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.

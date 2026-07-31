# ROADMAP

> Last updated: 2026-07-31
> Status: **goal `pptx-bespoke` 완주 (2026-07-31, 워크트리 lumatic2/발표-슬라이드-만드는-법)** — PB1 트랙 정식화·PB2 실증(관측 왕복 4회, 편집 그래머 확정·이미지 3트랙·스킬 흡수). 같은 날 goal `slide-pipeline-upgrade`(SP1~3)도 완주. active goal 0 — 다음은 워크트리 병합. 대기 순서(사용자 확정 2026-07-28): ② 『인터랙티브 웹 애니메이션』 책 스터디 자산화 ③ 사이트 품질(finding 큐 O5~O9·verify 위반 77건·SSG) ④ 다크모드 정비.
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Goal

<!-- harness:goal-archive17 id="pptx-bespoke" status="completed" -->
Goal: PPTX 고품질 bespoke 트랙 — 덱 전용 코드 생성+PNG 자기검사 미세조정. closed 2026-07-31 — PB1 정식화(pptx-to-png·계약 문서) + PB2 실증(관측 왕복 4회: HTML 미러링 FAIL→brandlogy 편집 그래머 재정의·구도 5종·lucide 아이콘·이미지 3트랙 사용자 확정, 실증 덱 4본, 스킬 §5~8 흡수 배포). Details: `evidence/slide-pipeline/pb{1,2}-*.md` + `docs/reports/2026-07-31-pb{1,2}-*.md`.

## Active Milestones — pptx-bespoke

<!-- harness:milestone id="PB1" status="completed" priority="P1" evidence="evidence/slide-pipeline/pb1-bespoke-track.md" -->
### PB1 — bespoke 트랙 정식화 (스킬 측)
- DoD: PPTX 시각 자기검사 스크립트(pptx-to-png)와 bespoke 트랙 계약 문서가 custom-skills 에 배포되고 기존 실증 PPTX 에서 PNG 산출 실동작, SKILL.md 2단 트랙 라우팅.
- Plan: plans/2026-07-31-pb1-bespoke-track-skill.md
- Status: [x]

- Completed at: 2026-07-31
- Evidence: evidence/slide-pipeline/pb1-bespoke-track.md
- Summary: pptx-to-png 시각 자기검사 + pptx-bespoke.md 계약 + 2단 트랙 라우팅 — 배포·PNG 실동작 검증
<!-- harness:milestone id="PB2" status="completed" priority="P1" evidence="evidence/slide-pipeline/pb2-bespoke-proof.md" -->
### PB2 — bespoke 실증 (askewly-design-intro)
- DoD: 실증 덱이 bespoke 트랙으로 산출되어 HTML 렌더 근접 판정(체크리스트 5항 장부)+구조 검증(네이티브 차트·비트맵 0·COM PASS)을 통과하고 사용자 관측 1회에서 범용 매퍼 대비 품질 향상 확인.
- Plan: plans/2026-07-31-pb2-bespoke-proof.md
- Status: [x]

<!-- harness:goal-archive16 id="slide-pipeline-upgrade" status="completed" -->
Goal: 슬라이드 파이프라인 업그레이드 — 유튜브 aITV54CLc_U(클로드 PPT 5단계) 등가 재현 검증 + 흡수분 스킬 업그레이드 + PPTX 정본화. closed 2026-07-31 — SP1 재현 랩(충실도 장부·흡수 판정 채택3/보류1)·SP2 스킬 업그레이드(custom 테마 트랙·G5 캘리브레이션·리디자인 입력)·SP3 pptxgenjs export 트랙 승격(실덱 2본 COM PASS) 단일 세션 완주. Details: `evidence/slide-pipeline/` + `docs/reports/2026-07-31-sp{1,2,3}-*.md`.

- Completed at: 2026-07-31
- Evidence: evidence/slide-pipeline/pb2-bespoke-proof.md
- Summary: 관측 왕복 4회 끝 그래머 확정 — 실증 덱 4본·이미지 3트랙·스킬 §5~8 흡수, goal pptx-bespoke 완주
## Active Milestones — slide-pipeline-upgrade

<!-- harness:milestone id="SP2" status="completed" priority="P1" evidence="evidence/slide-pipeline/sp2-skill-upgrade.md" -->
### SP2 — HTML 트랙 스킬 업그레이드
- DoD: SP1 채택분이 custom-skills presentation-slides-yusung 에 구현·배포되고 검증 덱으로 실증된다.
- Plan: plans/2026-07-31-sp2-html-track-upgrade.md
- Status: [x]

- Completed at: 2026-07-31
- Evidence: evidence/slide-pipeline/sp2-skill-upgrade.md
- Summary: custom 테마 트랙+G5 캘리브레이션+리디자인 입력 구현·배포 — smoke 18+3 PASS·배포본 랩 실증
<!-- harness:milestone id="SP3" status="completed" priority="P1" evidence="evidence/slide-pipeline/sp3-pptx-canonical.md" -->
### SP3 — PPTX 파이프라인 정본화
- DoD: pptxgenjs 단일 경로가 스킬 export 트랙으로 승격되고 methodology/slide-production.md 가 갱신되며 Askewly 스타일 실증 덱이 남는다.
- Plan: plans/2026-07-31-sp3-pptx-canonical-track.md
- Status: [x]

<!-- harness:goal-archive15 id="slide-expressive" status="completed" -->
Goal: 슬라이드 표현력 심화 — PPTX 중단·HTML/PDF 우선 방향의 실행. closed 2026-07-28 — SX1 임팩트 레이아웃 2종(hero-motion·svg-filter-scene, 정적 14종)·SX2 벡터 PDF 트랙(텍스트 선택·의존성 0)·SX3 소개 덱 실증(직행 예외 정당 판정) 단일 세션 완주. Details: `research/2026-07-28-sx1-slide-expressive-survey.md` + `docs/reports/2026-07-28-sx{1,2,3}-*.md`.

- Completed at: 2026-07-31
- Evidence: evidence/slide-pipeline/sp3-pptx-canonical.md
- Summary: export-pptx.mjs 정식 트랙 + methodology 정정 — 실덱 2본 COM PASS, goal slide-pipeline-upgrade 완주
## Active Milestones — slide-expressive

## Active Milestones — slide-methodology

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

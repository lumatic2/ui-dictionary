# ROADMAP

> Last updated: 2026-08-01
> Status: **2026-08-01 3개 goal 완주** — `finding-cleanup`(M5 search title·llms 게이트 · M6 타이포 9단계 배선) · `dark-carryover`(M2~M4) · `deck-quality`(DQ1~DQ3, 워크트리 병합됨). active goal 0. 남은 큐: 『인터랙티브 웹 애니메이션』 책 스터디 자산화(사용자 주도) · 이월 finding: D2 Presenton 정밀 벤치·동영상 에셋 파이프(수요 미확인).
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Goal

<!-- harness:goal id="finding-cleanup" status="completed" -->
Goal: 이월 finding 정리 — /search title 수리·llms 정합 게이트(M5) + 타이포 스케일 9단계 전수 등재·무손실 배선(M6). closed 2026-08-01 — M5(title 정합·게이트 FAIL/PASS 실증·오탐 1건 기록)·M6(scale 5→9단계·@theme 배선·computed 무손실) 단일 세션 완주. Details: `archive/plans/2026-08-01-m{5,6}-*.md` + `docs/reports/2026-08-01-m{5,6}-*.md`.

<!-- harness:goal-archive19 id="deck-quality" status="completed" -->
Goal: 슬라이드 덱 자체 품질 업그레이드. closed 2026-08-01 — DQ1~DQ3 완주(루브릭·견본 → 표현 기계 → 정본 덱 리디자인+관측 2라운드 PASS). 사용자 판정으로 루브릭 확장 금지가 기본값이 됐다. Details: `evidence/deck-quality/` + `docs/reports/2026-0{7-31,8-01}-dq{1,2,3}-*.md`.

## Active Milestones — finding-cleanup

## Active Milestones — dark-carryover

<!-- harness:milestone id="M4" status="completed" priority="P3" evidence="evidence/dark-carryover/m4-og-image-dark.md" -->
### M4 — og-image 3안 품질 비교·선택 교체
- DoD: codex imagegen 다크·라이트 톤 1200×630 후보 2종 + 기존 SVG 3안을 양 테마 목업으로 사용자가 비교 선택, 교체 시 dist 메타 정합·구 SVG 참조 0, goal 마감 일괄 배포(승인 후)로 실카드 확인.
- Gap: 현행 og:image 가 라이트 SVG 단일 — 다크 채팅 UI 어색 + SVG 크롤러 호환성 불리. og:image 는 테마 분기 불가(셸 단일 상속 — 검증자 실측)
- Scale: steps=2 (imagegen 2종+3안 비교 관측 / 메타 배선+마감 검증); surfaces: public/og-image·index.html; capability: 공유 첫인상까지 시스템의 얼굴
- Plan: plans/2026-08-01-m4-og-image-dark.md
- Status: [x]

- Completed at: 2026-08-01
- Evidence: evidence/dark-carryover/m4-og-image-dark.md
- Summary: A안(다크 PNG 1200×630) 실배포 — 절대 URL 메타·구 SVG 참조 0·카드 디버거 실증. 보고서 docs/reports/2026-08-01-m4-og-image-dark.md

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

**active goal 0** — 다음 방향은 새 `/harness-plan` 에서 연다.

<!-- harness:goal id="real-use-lap" status="skipped" -->
Goal: 실사용 한 바퀴 — Askewly Design으로 Askewly Design 소개 덱(PPTX)을 실제로 만들고, 막히는 지점만 결함으로 기록해 milestone으로 삼는다. **제거(2026-07-31, 사용자 판정: 낡음)** — PARK(2026-07-27) 상태에서 부활 없이 폐기. horizon 문서 삭제(git 이력 보존), RU1 결함 장부(`evidence/real-use-lap/ru1-deck-production.md`)·파일럿 실측(`research/2026-07-27-ru2-pilot-defect-measurement.md`)은 기록으로 유지.

## Completed Milestones — deck-quality

<!-- harness:milestone id="DQ2" status="completed" priority="P1" evidence="evidence/deck-quality/dq2-expressive-mechanics.md" -->
### DQ2 — 표현 기계 업그레이드
- DoD: 장간 연속 전환(opt-in, 실크롬 file:// 실측 또는 폴백 확정) + 이미지 최적화 빌드(용량 실측 개선) + sourceNote 겹침 해소 — HU4 회귀 5종 PASS·미사용 덱 무변화.
- Evidence: evidence/deck-quality/dq2-expressive-mechanics.md
- Gap: Auto-Animate·이미지 최적화·sourceNote 배치 3건 이월 finding
- Plan: plans/2026-07-31-dq2-expressive-mechanics.md
- Status: [x]

- Completed at: 2026-08-01
- Summary: animId 전환·optimize-images(77% 감소)·sourceNote 수리 — 회귀 6종 PASS
<!-- harness:milestone id="DQ3" status="completed" priority="P1" evidence="evidence/deck-quality/dq3-canonical-redesign.md" -->
### DQ3 — 정본 덱 리디자인 + 관측
- DoD: 정본 덱이 루브릭 기준 재제작되어 전/후 감사표 개선 + 전 자동 검증·HU4 회귀·발표 전 체크 PASS + 사용자 관측 PASS.
- Evidence: evidence/deck-quality/dq3-canonical-redesign.md
- Gap: 파이프라인 업그레이드가 정본 덱 내용물 품질로 미전이 (시안·관측 게이트 2회)
- Plan: plans/2026-07-31-dq3-canonical-redesign.md
- Status: [x]

- Completed at: 2026-08-01
- Summary: 규칙 처방 철회·루브릭 확장 금지 명문화, 덱 실변경 2건, 차트 색 finding 수리 — 관측 2라운드 PASS
<!-- harness:goal-archive18 id="html-upgrade" status="completed" -->
Goal: HTML 발표 트랙 업그레이드. closed 2026-07-31 — HU1~HU4 완주(발표 운영력·모션 문법·이미지 트랙·통합 실증, 사용자 관측 6라운드 PASS). Details: `evidence/html-upgrade/` + `docs/reports/2026-07-31-hu{1,2,3,4}-*.md`.

- Completed at: 2026-08-01
- Summary: 정본 덱 리디자인 + 사용자 관측 PASS — 규칙 처방 철회·루브릭 확장 금지, 덱 실변경 2건, 차트 색 수리
## Active Milestones — html-upgrade

<!-- harness:milestone id="HU4" status="completed" priority="P1" evidence="evidence/html-upgrade/hu4-live-proof.md" -->
### HU4 — 통합 실증
- DoD: askewly-design-intro 가 HU1~3 전 기능으로 라이브 리허설 통과 + 발표 게이트 명문화(대비·프로젝터 체크) + 사용자 관측 1회.
- Evidence: evidence/html-upgrade/hu4-live-proof.md
- Gap: 스킬 기능만으로는 실사용 품질 미보장(PB2 교훈 — 실덱 관측 필수)
- Plan: plans/2026-07-31-hu4-live-proof.md
- Status: [x]

<!-- harness:goal-archive17 id="pptx-bespoke" status="completed" -->
Goal: PPTX 고품질 bespoke 트랙 — 덱 전용 코드 생성+PNG 자기검사 미세조정. closed 2026-07-31 — PB1 정식화(pptx-to-png·계약 문서) + PB2 실증(관측 왕복 4회: HTML 미러링 FAIL→brandlogy 편집 그래머 재정의·구도 5종·lucide 아이콘·이미지 3트랙 사용자 확정, 실증 덱 4본, 스킬 §5~8 흡수 배포). Details: `evidence/slide-pipeline/pb{1,2}-*.md` + `docs/reports/2026-07-31-pb{1,2}-*.md`.

- Completed at: 2026-07-31
- Summary: 정본 덱 통합 실증 — 사용자 관측 6라운드 PASS, 발표 게이트 명문화
## Active Milestones — pptx-bespoke

## Active Milestones — slide-pipeline-upgrade

## Active Milestones — slide-expressive

## Active Milestones — slide-methodology

## Active Milestones — carryover-maintenance

## Active Milestones — site-polish

<!-- harness:milestone id="QA1" status="skipped" priority="P1" evidence="evidence/site-polish/qa1-copy-language.md" -->
### QA1 — 한/영 혼용 카피 정책 정본화 + 셸 적용
- DoD: (원안) 셸 자기-목소리 한국어 전환. **회귀 마감(2026-07-31)** — 랜딩 전환본을 사용자가 관측 후 기각, 영어 단일 확정. 산출물로 `docs/design-system/copy-language.md`(영어 단일 정책 기록)+llms 배선은 남김.
- Plan: plans/2026-07-31-qa1-copy-language-policy.md
- Status: [x] **회귀(2026-07-31)** — 사유: 취향 관측 기각. 교훈: 언어·톤 결정은 실물 시안 관측 먼저.

<!-- harness:milestone id="VI7" status="completed" priority="P1" evidence="evidence/visual-impact-consolidation/vi7-placement.md" -->
### VI7 — 도구 층 배치
- DoD: toolshelf 비주얼 임팩트 카드 15건이 표현 스택 4티어에 배치되고 채택/보류/제외 판정(TC1 taste 흡수 계약 준수, 카드별 출처+사유)이 결정표에 반영되며 `shelf used` 기록이 남는다. + llms 배선 finding 해소(knowledge 3문서 전부 등재).
- Plan: archive/plans/2026-07-28-vi7-toolshelf-placement.md
- Status: [x]

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

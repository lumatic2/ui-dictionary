# ROADMAP

> Last updated: 2026-08-04
> Status: **2026-08-04 goal `harvest-deep` 완주** — M22(소스 채굴 14/14+증보 ~40·착지 판정) + M23(확정 12건 집행: asset 8·cosmos 팔레트·knowledge 2·head-meta 계약) 연쇄. 당일 3-goal(reusable-composition→harvest→harvest-deep). active goal 0. 다음 후보: harvest 배치 3(본체 미등재 마이크로 인터랙션 6종·three.js 씬·Palette Generator). 남은 큐: 킥스타트 기본값 폴리싱(M19 finding) · CLI npm publish(사용자 승인 후) · 두 번째 블록 marketing-landing · 『인터랙티브 웹 애니메이션』 책 스터디(사용자 주도) · dark/light 테마 SSOT 파생 · D2 Presenton 벤치 · Around 재판정.
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Goal

<!-- harness:goal id="harvest-deep" status="completed" -->
Goal: 소스 레벨 재채굴(harvest-deep). closed 2026-08-04 — M22(채굴 14/14+증보 ~40·착지 판정·2차 라운드) + M23(확정 12건 집행: asset 8종·cosmos 팔레트 프리셋·knowledge 2편·head-meta 계약, 신선 E2E 시간차 검증·사용자 관측 통과) 연쇄 완주. Details: `evidence/harvest/` + `docs/reports/2026-08-04-m2{2,3}-*.md`.

## Active Milestones — harvest-deep

<!-- harness:milestone id="M22" status="completed" priority="P1" evidence="evidence/harvest/m22-mining.md" -->
### M22 — 소스 레벨 재료 채굴 — 5 표면 코드 채굴 장부 + 착지 판정
- DoD: 지목 재료 14건 전건 채굴 카드(실코드 파일:라인 인용) + 착지 판정표 + 사용자 확정 1회. 실패 모드 = 소스-라이브 불일치 명시 기록.
- Gap: M20 은 라이브 겉면 관측 — 코드 속 재료(토큰·모션·기법)가 판정 밖에 남았다.
- Plan: archive/plans/2026-08-04-m22-harvest-mining.md
- Status: [x]
- Completed at: 2026-08-04
- Summary: 1차 채굴 14/14+증보 11 + 2차 증보 ~30(미등재 6종·head 메타 6표면) → 사용자 확정 집행 12건(A7+B1~B3+B5). 보고: docs/reports/2026-08-04-m22-harvest-mining.md

<!-- harness:milestone id="M23" status="completed" priority="P1" evidence="evidence/harvest/m23-batch2.md" -->
### M23 — harvest 배치 2 — M22 확정 목록 승격 집행
- DoD: 확정 배치 전건 승격(착지별 게이트: diff 0·purity·build/lint·llms-sync·신선 E2E) + 통합 E2E 1회 + 사용자 관측 1회 + 잔여 이월 명시.
- Gap: 계약은 있는데 배치 반복 실적이 1회(2건)뿐.
- Plan: archive/plans/2026-08-04-m23-harvest-batch2.md
- Status: [x]
- Completed at: 2026-08-04
- Summary: 확정 12건 전건 승격(asset 8·cosmos·knowledge 2·head-meta) + 신선 E2E 시간차 검증 + 사용자 관측 통과. 보고: docs/reports/2026-08-04-m23-harvest-batch2.md

<!-- harness:goal id="harvest" status="completed" -->
Goal: 회수 루프(하베스트) — 산출물→저장고 입력 루프. closed 2026-08-04 — M20(전수 teardown 29·사용자 풀 확정) + M21(회수 계약 정본화·첫 승격 zigzag-story-section·terminal-demo-panel) 연쇄 완주. Details: `evidence/harvest/` + `docs/reports/2026-08-04-m2{0,1}-*.md`.

## Active Milestones — harvest

<!-- harness:milestone id="M20" status="completed" priority="P1" evidence="evidence/harvest/m20-teardown.md" -->
### M20 — 산출물 전수 teardown — 배포 표면 29종 실사 + harvest 후보 장부
- DoD: census 29 표면 ↔ teardown 카드 1:1 전건(누락 0) + 판정 축 3항 전건 + 후보 순위표 + 사용자 확정 1회. 실패 모드 검증 = 죽은 표면 2건이 실측 코드와 함께 사망 카드로 기록.
- Gap: 회수할 재료의 실태 미조사 — 계약 설계가 실물 없이 공중에 뜬다.
- Plan: archive/plans/2026-08-04-m20-harvest-teardown.md
- Status: [x]
- Completed at: 2026-08-04
- Summary: census 29→teardown 카드 29(워커 6기·표본 재검 일치)→사용자 풀 확정 7 표면(askewly.com·brain·guide·dev·bootcamp·sixsense·본체). 보고: docs/reports/2026-08-04-m20-harvest-teardown.md

<!-- harness:milestone id="M21" status="completed" priority="P1" evidence="evidence/harvest/m21-contract.md" -->
### M21 — 회수 계약(하베스트) 정본화 + 첫 승격 실증
- DoD: harvest-contract.md llms 실등재 + M20 확정 후보 ≥1건 승격이 [기존 자산 diff 0·purity·build/lint·신선 프로젝트 E2E] 전 구간 통과 + 사용자 관측 1회.
- Gap: 산출물→자산 승격의 반복 가능한 경로 부재 — 매번 일회성 수작업.
- Plan: archive/plans/2026-08-04-m21-harvest-contract.md
- Status: [x]
- Completed at: 2026-08-04
- Summary: harvest-contract.md llms 등재 + 승격 2건(meta.harvest 출처) + 신선 E2E(실결함 1 적발·수정) + 사용자 관측 통과. 보고: docs/reports/2026-08-04-m21-harvest-contract.md

<!-- harness:goal id="reusable-composition" status="completed" -->
Goal: 재사용 조합 — 블록 자산 등급 + 원커맨드 킥스타트로 착수 기본값을 "잘 만들어진 수준"으로. closed 2026-08-04 — M18(블록 정본화·saas-app-shell 흡수 구현·신선 이식 실증) + M19(init --block 원커맨드·E2E 사용자 관측 통과) 연쇄 완주. Details: `evidence/reusable-composition/` + `docs/reports/2026-08-04-m{18,19}-*.md`.

## Active Milestones — reusable-composition

<!-- harness:milestone id="M19" status="completed" priority="P1" evidence="evidence/reusable-composition/m19-kickstart.md" -->
### M19 — 킥스타트 원커맨드 (브리프→DESIGN.md→블록 이식→검증 일괄)
- DoD: `npx @askewly/design init --block saas-app-shell` 1회로 축약 브리프→DESIGN.md→토큰→이식→restyle 대조→verify 전 구간이 수동 개입 없이 닫히고 사용자 관측 통과. 회귀 = 기존 CLI 명령 무변경.
- Gap: 부트스트랩이 다단 fetch 낱개 절차 — 착수 마찰로 실전 우회 위험.
- Plan: plans/2026-08-04-m19-kickstart-command.md
- Status: [x]

<!-- harness:goal id="figma-return-path" status="completed" -->
Goal: Figma 귀환 경로 — 왕복(코드→Figma→사람 디테일링→코드 회수)을 반복 가능한 능력으로. closed 2026-08-02 — M14(채널 복구·재동기화 rem 보수·스냅숏 장부/diff 기계화·왕복 2회차 무변경 0/0/0) + M15(계약 §3 두 lane 정본화·llms 등재·figma-codex-workflow promoted 배포) 연쇄 완주. Details: `evidence/figma-return-path/` + `docs/reports/2026-08-02-m{14,15}-*.md`.

- Completed at: 2026-08-04
- Evidence: evidence/reusable-composition/m19-kickstart.md
- Summary: init --block 원커맨드(브리프→DESIGN.md→토큰층→재귀 이식→요구변수 대조→verify) + E2E 사용자 관측 통과
## Active Milestones — media-unification

## Active Milestones — figma-return-path

## Active Milestones — usage-and-site-surfacing

## Active Milestones — reference-diversification-2

## Active Milestones — reference-diversification

## Active Milestones — finding-cleanup

## Active Milestones — dark-carryover

## Completed Milestones — deck-quality

## Active Milestones — html-upgrade

<!-- harness:milestone id="HU4" status="completed" priority="P1" evidence="evidence/html-upgrade/hu4-live-proof.md" -->
### HU4 — 통합 실증
- DoD: askewly-design-intro 가 HU1~3 전 기능으로 라이브 리허설 통과 + 발표 게이트 명문화(대비·프로젝터 체크) + 사용자 관측 1회.
- Evidence: evidence/html-upgrade/hu4-live-proof.md
- Gap: 스킬 기능만으로는 실사용 품질 미보장(PB2 교훈 — 실덱 관측 필수)
- Plan: archive/plans/2026-07-31-hu4-live-proof.md
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
- Plan: archive/plans/2026-07-31-qa1-copy-language-policy.md
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

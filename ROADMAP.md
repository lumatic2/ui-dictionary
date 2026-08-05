# ROADMAP

> Last updated: 2026-08-05
> Status: **2026-08-05 goal `docs-block-and-theme-derive` 승인 (M29 active · M30 pending)** — ① `@/` alias 감지+안내 ② docs-site 블록(3호, 셸+3페이지) + 0.4.2 출고 ③ `/pt` `custom` 테마의 다크 판본. 직전 `cli-polish-041` 완주(M28, 0.4.1 출고). **큐 정정**: 구 큐 항목 "dark/light 테마 SSOT 파생"은 사용자 의도와 다른 물건이었고(의도 = 4번째 선택지가 레포 토큰을 따라가게 → M17 에서 이미 충족), M30 으로 재정의됐다. 남은 큐: 『인터랙티브 웹 애니메이션』 책 스터디(사용자 주도) · D2 Presenton 벤치 · Around 재판정.
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Goal

<!-- harness:goal id="docs-block-and-theme-derive" status="active" -->
Goal: 이식 경로가 세 번째 블록(docs-site)까지 **인쇄된 안내만으로** 돌아가고, `/pt` 의 4번째 테마 선택지(`custom`)가 레포 토큰의 다크 얼굴까지 따라간다. 킥스타트는 이 시스템이 남에게 이식되는 유일한 원커맨드 표면이고, `custom` 테마는 임의의 레포가 자기 브랜드로 덱을 만드는 유일한 경로다 — 둘 다 "이식 가능한 제품" 축의 실발현 지점이다. 승인 2026-08-05.

## Active Milestones — docs-block-and-theme-derive

<!-- harness:milestone id="M29" status="active" priority="P1" evidence="evidence/docs-block-and-theme-derive/m29-release-042.md" -->
### M29 — 이식 경로 완결: `@/` alias 안내 + docs-site 블록(3호) + 0.4.2 출고
- DoD: 빈 vite 프로젝트 → 킥스타트 1커맨드 → **인쇄된 안내만으로(수기 보완 0)** → `tsc -b` exit 0 → 빌드 성공 → docs-site 3페이지 실브라우저 렌더. M28 E2E 에서 2회 수기로 메웠던 alias 구멍 무재현 + 블록 3호가 block-contract §6 등재·llms 배포. 사용자 관측 1회 포함.
- Gap: 인쇄된 render 안내가 `@/...` 를 쓰라면서 alias 설정을 안내하지 않음(신선 vite `tsc -b` 6건 실패) · docs 계열 asset 7종이 낱개로만 존재하고 한 벌로 묶인 적 없음
- Scale: steps=5 (alias · 흡수 실사 · 블록 소스+등재 · 데모+관측 · 배포+출고+E2E); surfaces: packages/cli · blocks/docs-site · registry · npm; capability: 세 번째 블록까지 원커맨드 이식
- Plan: plans/2026-08-05-m29-docs-block-and-alias.md
- Status: [ ]

<!-- harness:milestone id="M30" status="pending" priority="P2" evidence="evidence/docs-block-and-theme-derive/m30-custom-dark-face.md" -->
### M30 — `custom` 테마의 다크 판본
- DoD: `/pt` 의 4번째 선택지 `custom` 이 대상 레포 `DESIGN.md` 로부터 라이트·다크 두 얼굴을 만들고, 실덱 다크 렌더가 사용자 관측을 통과한다. **canonical 3종 무변경**, 모드 미지정 호출(M17 경로) 산출 동일, 다크 정보 없는 프로젝트에는 조용한 폴백 없이 명시 실패.
- Gap: `DESIGN.md` 의 다크 오버라이드 37행이 실려 있는데 변환기가 `themes` 를 읽지 않음(grep 0건) — 브랜드 덱이 항상 라이트로만 나온다
- Scale: steps=2 (변환기 다크 판독+`--mode` · 스킬 배선+관측+배포); surfaces: custom-skills promoted/pt; capability: 내 브랜드의 다크 덱
- Plan: plans/2026-08-05-m30-custom-dark-face.md
- Status: [ ]

<!-- harness:goal-archive18 id="cli-polish-041" status="completed" -->
Goal: CLI 0.4.1 폴리싱 — 킥스타트 handoff 가 실제 프로젝트와 일치하고, verify 가 토큰 준수 코드를 위반으로 부르지 않게 한다. closed 2026-08-05 — M28 단독(0.4.1 출고·라이브 재현 통과, 오너 지목 3건 반영). Details: `docs/reports/2026-08-05-m28-cli-polish-041.md`. 킥스타트는 이 시스템이 남에게 이식되는 유일한 원커맨드 표면이라, 그 표면이 인쇄하는 안내가 틀리면 첫 3분에서 신뢰를 잃는다.
## Active Milestones — cli-polish-041
## Active Milestones — second-block-marketing

## Active Milestones — harvest-batch4-release

## Active Milestones — harvest-batch3

## Active Milestones — harvest-deep

## Active Milestones — harvest

## Active Milestones — reusable-composition

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

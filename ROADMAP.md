# ROADMAP

> Last updated: 2026-08-06
> Status: **2026-08-06 goal `queue-drain` 착수 (M32~M35 일괄 승인).** 이월 큐 4건을 비운다 — 이식 계약 실측화(M32) · Presenton 벤치(M33) · Around 재판정(M34) · Figma 후속 3건(M35). 직전: goal `dark-inversion-cleanup` 완주 (M31). 큐 잔여는 『인터랙티브 웹 애니메이션』 책 스터디(사용자 주도 — 별도 워크트리).
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Goal

<!-- harness:goal id="queue-drain" status="active" -->
Goal: 이월 큐 4건을 비운다. 서로 표면이 겹치지 않는 부채라 한 goal 아래 milestone 4개로 묶었다 — ① 이식 계약 `requiredCssVars` 를 손 선언에서 **실측**으로(M32) ② Presenton 정밀 벤치(M33) ③ Around 재판정(M34) ④ Figma 브리지 후속 3건(M35). 공통 성질은 "닫지 않으면 조용히 낡는 것들"이다 — 검사 구멍·미구현 계약·유예된 판정·낡은 동기화.

## Active Milestones — queue-drain

<!-- harness:milestone id="M32" status="completed" priority="P1" evidence="evidence/queue-drain/m32-required-css-vars.md" -->
### M32 — `requiredCssVars` 를 손 선언에서 실측으로
- DoD: 선언이 이식 파일 실측보다 좁으면 **빌드가 실패**한다(블록·비블록 양 경로). 57종이 실측 선언을 갖고, 전이 수집이 테스트로 발화하며, 라이브 킥스타트의 요구 변수가 전건 정의된다. 상류 shadcn 은 검사에 편입되거나 경계로 명문화된다. 이식 파일 내용 무변경.
- Gap: `requiredCssVars` 가 전부 수작업이라 57종 중 **5종**만 선언 보유 — 승계 계약 ④("전이적으로 실측해 선언과 대조")의 실측 항이 없다
- Scale: steps=3 (추출·게이트 / 57종 채우기·상류 판정·발화 테스트 / 배포·라이브 실측); surfaces: generate-registry·registry.json·kickstart; capability: 이식처가 색을 잃지 않는다는 기계 보증
- Plan: archive/plans/2026-08-06-m32-required-css-vars-measured.md
- Status: [x]

- Completed at: 2026-08-06
- Evidence: evidence/queue-drain/m32-required-css-vars.md
- Summary: requiredCssVars 실측화 — 양 경로 빌드 게이트, 49종 신규 선언, 상류 shadcn 경계 확정, 라이브 재현 통과
<!-- harness:milestone id="M33" status="completed" priority="P2" evidence="research/2026-08-06-m33-presenton-bench.md" -->
### M33 — Presenton 정밀 벤치마크
- DoD: 레포 실사(SHA·라이선스·파이프라인) + 실물 산출물 1편 + `/pt` 항목별 대조표(양쪽 출처 필수) + A/B/C 판정 + 후속 finding 등록. 유료 크리덴셜 미사용, 실구동 불가 시 partial 명시.
- Gap: `research/2026-07-31-html-upgrade-goal-refs.md` §4-D2 로 등록된 뒤 미착수 — 우리와 목적이 가장 가까운 최근 진입자를 추정으로만 알고 있다
- Scale: steps=2 (실사·산출물 / 대조표·판정); surfaces: research 문서·docs/findings.md; capability: 덱 트랙의 위치를 실물로 안다
- Plan: archive/plans/2026-08-06-m33-presenton-bench.md
- Status: [x]

- Completed at: 2026-08-06
- Evidence: research/2026-08-06-m33-presenton-bench.md
- Summary: Presenton 벤치 — 실구동 5장 덱, 10축 대조, 판정 A 1건·B 4건·C 1건
<!-- harness:milestone id="M34" status="active" priority="P2" -->
### M34 — Around 재판정 (+ A 면 흡수)
- DoD: 판정이 `absorption-criteria` 에 날짜·근거와 함께 갱신되고 ledger 1행. A 면 지정 2건(customizer 원리 → knowledge, 패키지 클레임 → `docs/PRD.md`)이 우리 규칙으로 존재하고 llms 에 실린다. B·C 면 흡수 0건.
- Gap: M11 이 "이식 축 미개방"을 이유로 C 보류했는데, M26~M31 로 그 축이 열렸다 — 재판정 조건이 충족된 채 방치돼 있다
- Scale: steps=2 (재판정 / 반영·흡수); surfaces: absorption-criteria·ledger·knowledge·PRD; capability: 패키징 원리의 정본화
- Plan: plans/2026-08-06-m34-around-reverdict.md
- Status: [ ]

<!-- harness:milestone id="M35" status="pending" priority="P1" -->
### M35 — Figma 브리지 후속 3건
- DoD: 스냅숏 구간 분할(기본 호출 무변경) + **라이브 절단 해소 실증**, 계약 §2.2 `description` 복사 + 읽기(dry-run) 모드 + `--no-remove`, 드리프트 실측→승인→반영 후 2차 실행이 `0/0/0` 또는 updated-only, 사람이 실파일 표본 3종 확인.
- Gap: M14 가 손 3분할로 우회한 20kb 절단이 그대로고, §2.2 description 은 7월부터 미구현이며, M31 신설 토큰이 Figma 에 안 갔다
- Scale: steps=3 (청크 / description·dry-run·no-remove / 라이브 동기화·회수); surfaces: figma-push-snapshot·generate-figma-variables-sync·bridge-contract; capability: 왕복이 다시 최신
- Plan: plans/2026-08-06-m35-figma-followups.md
- Status: [ ]

<!-- harness:goal-archive19 id="dark-inversion-cleanup" status="completed" -->
Goal: 다크에서 **밝아지는 모달 백드롭**과 **흰 판때기**를 없앤다 — 파일별 `dark:` 산포가 아니라 semantic 토큰 `scrim` 1개를 SSOT 에 신설하고, 그 토큰이 CLI·registry 를 타고 이식 경로까지 함께 가게 한다. M29 이월분에 **남의 레포로 이식되는 asset 2종**이 들어 있어서 이건 화면 수리가 아니라 이식 표면의 결함이다. closed 2026-08-06 — M31 단독(스크림 토큰 신설·0.4.3 출고·라이브 실증, 사용자 관측 통과). Details: `docs/reports/2026-08-06-m31-dark-inversion-cleanup.md`.

## Active Milestones — docs-block-and-theme-derive

<!-- harness:milestone id="M30" status="completed" priority="P2" evidence="evidence/docs-block-and-theme-derive/m30-custom-dark-face.md" -->
### M30 — `custom` 테마의 다크 판본
- DoD: `/pt` 의 4번째 선택지 `custom` 이 대상 레포 `DESIGN.md` 로부터 라이트·다크 두 얼굴을 만들고, 실덱 다크 렌더가 사용자 관측을 통과한다. **canonical 3종 무변경**, 모드 미지정 호출(M17 경로) 산출 동일, 다크 정보 없는 프로젝트에는 조용한 폴백 없이 명시 실패.
- Gap: `DESIGN.md` 의 다크 오버라이드 37행이 실려 있는데 변환기가 `themes` 를 읽지 않음(grep 0건) — 브랜드 덱이 항상 라이트로만 나온다
- Scale: steps=2 (변환기 다크 판독+`--mode` · 스킬 배선+관측+배포); surfaces: custom-skills promoted/pt; capability: 내 브랜드의 다크 덱
- Plan: archive/plans/2026-08-05-m30-custom-dark-face.md
- Status: [x]

<!-- harness:goal-archive18 id="cli-polish-041" status="completed" -->
Goal: CLI 0.4.1 폴리싱 — 킥스타트 handoff 가 실제 프로젝트와 일치하고, verify 가 토큰 준수 코드를 위반으로 부르지 않게 한다. closed 2026-08-05 — M28 단독(0.4.1 출고·라이브 재현 통과, 오너 지목 3건 반영). Details: `docs/reports/2026-08-05-m28-cli-polish-041.md`. 킥스타트는 이 시스템이 남에게 이식되는 유일한 원커맨드 표면이라, 그 표면이 인쇄하는 안내가 틀리면 첫 3분에서 신뢰를 잃는다.
- Completed at: 2026-08-06
- Evidence: evidence/docs-block-and-theme-derive/m30-custom-dark-face.md
- Summary: custom 테마의 다크 판본 — --mode light|dark 로 레포 브랜드의 두 얼굴, canonical 3종 무변경, self-test 13/13, 사용자 관측 통과(민트 확정)
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

# PLAN — SL1: 발표 슬라이드 방법론 문서화

> 생성: 2026-07-28 · 갈래: 문서(knowledge/methodology) · scope: goal `slide-methodology` 연쇄 1/3. 워크트리 `lumatic2/발표-슬라이드-만드는-법`.
Status: approved (2026-07-28 사용자 승인 — "응 추천대로 ㄱ", llms 등재 포함, 연쇄 SL2·SL3 제시됨)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "슬라이드·지면 산출물까지가 범위" + "매체가 다르면 게이트도 다르다" 축의 슬라이드 구체화.
- **goal**: `slide-methodology` — 발표 슬라이드를 HTML 정본으로 만들고 PPT·PDF·HTML 세 형식으로 내는 방법론을 자산화하고, 편집 가능 PPTX 경로를 실증한다.
  - SL1 (이 계획서): 방법론 문서화
  - SL2 (연쇄 2/3): 슬라이드 린터 — 거장 원칙 자동 검사 (custom-skills presentation-slides-yusung validator 확장, 규칙 스펙 정본은 SL1 methodology 문서)
  - SL3 (연쇄 3/3): 편집 가능 PPTX export 실증 — Askewly Design 소개 덱 실제 제작 (pending goal `real-use-lap` 부활 연계)
- **리서치 입력**: `research/2026-07-28-sl1-slide-methodology-research.md` — 거장 수렴 원칙 5(출처 8계보) · HTML 정본+3-format export 경로 지도 · 기존 자산 대조(presentation-slides-yusung, slide-deck-workflow, slides-grab) · 갭 3건. 상류 자산: KG 노드 2건(`slide-deck-convergent-principles`·`html-first-slide-export-pipeline`), toolshelf 카드 4건(ppt-master·decktape·slidev·PptxGenJS).

## Scope Boundary
- **포함**: ① `knowledge/slide-principles.md`(무엇이 좋은 슬라이드인가 — 수렴 원칙 5 + 표현 기법) ② `methodology/slide-production.md`(어떻게 만드는가 — HTML 정본 + 3-format export 파이프라인 + 엔진 선택 결정표 + SL2 입력용 린트 규칙 스펙) ③ 목차·상호 링크 ④ llms 배선(사용자 결정 시).
- **제외**: 린터 구현(SL2) · PPTX 실증(SL3) · 문서형 PDF 방법론(옆 워크트리 `pdf-다루는-법` 소관 — 여기는 슬라이드→PDF export만) · 사이트 UI 변경 · 새 데모 구현 · **매체 게이트 재서술 금지** — 게이트 정본은 `docs/design-system/medium-taxonomy.md`·`slide-spec.md`(fresh 검증자 적발 2026-07-28), 새 문서는 인용/확장만.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 신규 문서 2건 + 목차·배선 소폭 수정 — 커밋 revert로 원복. 기존 knowledge/methodology 문서의 기존 내용 무변경(추가 링크만).

## 스캐폴딩 결정
- source-of-truth: 레포 관례 준수 — 디자인 지식은 `knowledge/`, 실행 가이드는 `methodology/`, 중복 시 methodology가 knowledge를 wikilink 인용. KG 노드 2건은 상류 포인터로 링크만 하고 본문을 복제하지 않는다(그래프가 일반 지식 정본, 레포 문서가 Askewly Design 적용 정본).
- 검증: 문서 내 모든 외부 인용에 출처 URL+접근일(전 레포 인용 규칙) · wikilink 대상 실존 grep 확인 · llms/catalog 재생성 후 신규 문서 등재 grep 확인 · 사이트 빌드 PASS(배선 파일을 건드린 경우).
- 배포/운영: push는 세션 말 일괄(사용자 관례 — 사전 요약 보고 후). 이 워크트리 브랜치에 커밋, main 병합은 merge-worktree 절차.
- 자기선언 — 매체 게이트 경계: 게이트(캔버스 프리셋·WCAG 대비·통설 규칙)의 정본은 `docs/design-system/slide-spec.md`+`medium-taxonomy.md` — methodology 문서는 이를 **인용**하고, 게이트에 없는 것(export별 최종 형식 렌더 확인 절차 — "PPTX는 PowerPoint/LibreOffice로 열어 확인, PDF는 뷰어 렌더 확인")만 추가한다. 추가분이 게이트 성격이면 slide-spec.md 쪽에 제안하고 methodology에는 두지 않는다. 코딩애플 유래 실전 주의(한글 폰트·다크모드·글자 크기 명시, 파일 분리)는 제작 파이프라인 소속이라 methodology에 흡수.
- 검토 후 제외: knowledge/expressive-stack.md 구조 변경(비주얼 임팩트 축 정본 — 링크만, 개편 안 함) · slide-spec.md 본문 수정(이번 milestone 범위 밖 — 필요 발견 시 finding 큐).

## 결정 로그
- status: resolved
- **goal 범위 = 3-milestone 연쇄** (SL1 문서 → SL2 린터 → SL3 PPTX 실증) — 사용자 확정 2026-07-28.
- **SL3 실증 덱 = Askewly Design 소개 덱** — pending goal `real-use-lap` 부활 연계. 사용자 확정 2026-07-28.
- **SL2 린터 위치 = custom-skills presentation-slides-yusung validator 확장** — 규칙 스펙 정본은 이 레포 methodology 문서, 구현은 cross-repo 커밋(VI8 선례). 사용자 확정 2026-07-28.
- **methodology/ llms 등재 = 등재 확정** — 사용자 승인 2026-07-28("추천대로"). methodology/slide-production.md를 FIXED_ASSETS에 methodology 섹션 신설로 등재(첫 등재), knowledge/slide-principles.md는 기존 Knowledge 섹션에 추가.

## Step 트리

- [x] **step-1 — knowledge/slide-principles.md (무엇이 좋은 슬라이드인가)**
  - Artifact: `knowledge/slide-principles.md` — 거장 수렴 원칙 5(계보·출처·에이전트 규칙화 가능성 판정) + 표현 기법 절(HTML/CSS 발표의 이점, SVG 필터 표현 기법과 보안 주의 — 코딩애플 2영상 유래 명시) + KG 노드 백링크.
  - Files: write knowledge/slide-principles.md. read research/2026-07-28-sl1-slide-methodology-research.md, knowledge/motion-references.md·knowledge/expressive-stack.md(관례 확인), ~/projects/knowledge-graph/nodes/디자인/slide-deck-convergent-principles.md(복제 아닌 링크 경계 확인).
  - Risk: 없음 (신규 문서 — 기존 문서 무접촉)
  - Dependencies: 없음
  - Verify: 문서 존재 + 외부 인용 전건 URL+접근일 grep 확인 + wikilink 대상 실존.
  - Failure probe: KG 노드 본문을 통째로 복사하면 이중 정본 드리프트(VI6에서 잡은 결함 유형) — 원칙 요지+Askewly 적용만 쓰고 근거 상세는 링크로.
  - Commit: changeset `sl1-slide-methodology-docs` (README 절: step-1).

- [ ] **step-2 — methodology/slide-production.md (어떻게 만드는가)**
  - Artifact: `methodology/slide-production.md` — ① HTML 정본 원칙(왜 HTML이 제작 표면인가) ② 3-format export 결정표(PDF=Playwright/decktape, PPTX=이미지 박제/html2pptx/SVG→DrawingML 3등급 + "편집 가능성 요구" 분기 질문) ③ 엔진 선택표(presentation-slides-yusung vs slides-grab — slide-deck-workflow 카드 기준 인용) ④ 매체 게이트는 `docs/design-system/slide-spec.md`·`medium-taxonomy.md` **인용** + export별 최종 형식 렌더 확인 절차만 추가(게이트 재서술 금지) ⑤ 프로세스: 구조 확정→슬라이드화 순서 강제(수렴 원칙 4·5) ⑥ SL2 입력용 린트 규칙 스펙(제목 완결문장·슬라이드당 메시지 1·텍스트/시각 비율·폰트 하한 — 검사 가능 형태로 명세).
  - Files: write methodology/slide-production.md. read methodology/00-INDEX.md(목차 관례), docs/design-system/slide-spec.md·medium-taxonomy.md·entry-protocol.md(게이트 정본 — 인용 경계), ~/.claude/skills/presentation-slides-yusung/SKILL.md(게이트·validator 현황), ~/projects/toolshelf/cards/slide-deck-workflow.md(엔진 선택표 인용).
  - Risk: 없음 (신규 문서 — step-1 인용 링크 외 기존 무접촉)
  - Dependencies: step-1 (knowledge 문서를 wikilink 인용하므로)
  - Verify: 문서 존재 + knowledge/slide-principles.md wikilink 정합 + 린트 규칙 스펙이 검사 가능 서술(입력·판정·임계값)인지 자체 점검.
  - Failure probe: 린트 규칙을 "권고" 수준 산문으로 쓰면 SL2에서 구현 불가 — 규칙마다 [입력 필드 / 판정 로직 / 임계값 / 예외]를 표로 고정.
  - Commit: changeset `sl1-slide-methodology-docs` (README 절: step-2).

- [ ] **step-3 — 목차·상호 링크 (문서 층 마감)**
  - Artifact: `methodology/00-INDEX.md` 목차 등재 + knowledge↔methodology 상호 wikilink 정합 확인.
  - Files: write methodology/00-INDEX.md. read knowledge/slide-principles.md, methodology/slide-production.md.
  - Risk: 없음 (목차 1건 추가 — 기존 항목 무변경)
  - Dependencies: step-1, step-2
  - Verify: 00-INDEX에 신규 항목 존재 + 두 문서의 wikilink 전건 실존 grep.
  - Failure probe: wikilink 표기(Obsidian [[...]] vs md 링크)가 기존 관례와 다르면 사이트/뷰어에서 깨짐 — 00-INDEX 기존 항목 표기 그대로 따른다.
  - Commit: changeset `sl1-slide-methodology-docs` (README 절: step-3).

- [ ] **step-4 — llms 배선 + 회귀 검증 (SL1 마감)**
  - Artifact: `scripts/generate-llms-txt.mjs` FIXED_ASSETS에 knowledge/slide-principles.md 등재(+ 사용자 결정이 "등재"면 methodology/slide-production.md — methodology 첫 등재) + 재생성 + evidence 기록.
  - Files: write scripts/generate-llms-txt.mjs, evidence/slide-methodology/sl1-docs.md. 실행: llms 재생성 + 사이트 빌드.
  - Risk: 위험 (배선 코드 수정 + 재생성 — 기존 등재 소실 회귀 가능, 산출물 grep으로 확인)
  - Dependencies: step-3
  - Verify: 재생성 산출물(llms.txt·public/llms/)에 신규 문서 grep 존재 + 기존 등재 문서 소실 0(diff) + 사이트 빌드 PASS.
  - Failure probe: FIXED_ASSETS는 하드코딩 배열 — 배열 수정 없이 재생성만 돌리면 신규 문서가 안 뜬다(fresh 검증자 적발). 스크립트 성공 exit가 아니라 산출물 내용을 확인.
  - Commit: changeset `sl1-slide-methodology-docs` (README 절: step-4).

## 검증/DoD
- **DoD**: knowledge 1건 + methodology 1건이 레포 관례(단일 출처·wikilink·Changelog)대로 작성되고 — 매체 게이트는 design-system 정본 인용(재서술 0) — 목차·llms 배선에 등재되며, 모든 외부 인용에 출처 URL+접근일이 붙고, SL2가 그대로 구현에 쓸 수 있는 린트 규칙 스펙(입력·판정·임계값 표)이 포함된다. 빌드 PASS.
- **Evidence**: `evidence/slide-methodology/sl1-docs.md`
- **회귀 게이트**: 기존 knowledge/methodology 문서 기존 본문 diff 0(추가 링크 제외) · llms 재생성 시 기존 등재 문서 소실 0.

## 재생성 장벽
- llms 재생성은 step-4에서 1회 (문서·목차가 확정된 뒤).

## 수치 출처
- 수렴 원칙 5·도구 지형 수치 = `research/2026-07-28-sl1-slide-methodology-research.md` (접근일 2026-07-28 명시 출처들).

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 — 리서치·KG·toolshelf 상류 자산화 완료 상태에서 착수. 결정 3건 사용자 확정(3-milestone 연쇄 · SL3=Askewly Design 소개 덱 · SL2=스킬 validator 확장).
- 2026-07-28 fresh 검증자 반영 — [HIGH] 매체 게이트 정본(slide-spec.md·medium-taxonomy.md) 기존재 적발 → step-2 인용/확장으로 재설계, 리서치 갭 3 정정. [MED] methodology llms 첫 등재 = 미소진 결정 → 결정 로그 등록(승인 시 확정). [LOW] llms 스크립트 경로 정정(루트 scripts/) · step-3을 3(목차)/4(llms 배선)로 분리.

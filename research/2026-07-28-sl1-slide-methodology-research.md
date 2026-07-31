# 발표 슬라이드 방법론 리서치 (2026-07-28)

> 소비처: `plans/2026-07-28-sl1-slide-methodology-docs.md` (goal `slide-methodology` SL1)
> 수행: sonnet 리서치 에이전트 2기 병렬 (도구 현황 / 거장 방법론) + toolshelf recall + 기존 스킬 3종 정독. 모든 외부 인용에 출처 URL + 접근일 표기.

## 1. 거장 방법론 — 수렴 원칙 5

Minto(피라미드/SCQA) · Michael Alley(assertion-evidence) · 맥킨지(action title) · Duarte(slide:ology/Resonate) · Reynolds(Presentation Zen) · Kawasaki(10/20/30) · Jobs 키노트 분석 · speaking.io(Zach Holman)가 표현만 다를 뿐 다음으로 수렴:

1. **슬라이드당 메시지 하나** — 메시지가 둘이면 슬라이드도 둘.
2. **제목이 곧 주장** — 명사구 제목 금지, 완결 문장. 제목만 읽어도 스토리가 통해야 함(title-only read test). Penn State 실증 연구로 이해도·회상 우위 검증.
3. **텍스트 대신 시각 증거** — 불릿 지양, 그래프·다이어그램. Kawasaki 30pt 하한은 이 원칙의 수치화.
4. **청중 관점 편집** — 발표자가 하고 싶은 말이 아니라 청중이 받아야 할 말. MECE + 의도적 반복 설계.
5. **구조 확정이 디자인보다 먼저** — 청중 분석 → SCQA → 스토리보드 → 그다음 슬라이드 툴.

에이전트 적용: ①②③은 자동 린트 규칙(제목 완결문장·메시지 수·텍스트/시각 비율·폰트 하한), ④⑤는 파이프라인 순서 강제(아웃라인 승인 게이트).

주요 출처 (접근일 전부 2026-07-28):
- think-cell Pyramid Principle: https://www.think-cell.com/en/resources/content-hub/using-the-pyramid-principle-to-build-better-powerpoint-presentations
- Penn State assertion-evidence: https://writing.engr.psu.edu/assertion_evidence_EA.html · ASEE 실증 논문: https://peer.asee.org/assertion-evidence-slides-appear-to-lead-to-better-comprehension-and-recall-of-more-complex-concepts.pdf
- slideworks action title: https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey
- Kawasaki 10/20/30 (원저자): https://guykawasaki.com/the_102030_rule/
- speaking.io: https://speaking.io/plan/number-of-slides/
- Duarte: https://en.wikipedia.org/wiki/Nancy_Duarte · Reynolds: https://www.blinkist.com/en/books/presentation-zen-en
- Jobs 분석(카민 갤로): https://www.forbes.com/sites/carminegallo/2012/10/04/11-presentation-lessons-you-can-still-learn-from-steve-jobs/
- 미확인: "김재엽" 발표 방법론 자료, GitHub 한국어 발표 가이드 — 1차 출처 못 찾음(추정 기재 안 함).

## 2. 도구 지형 — HTML 정본 + 3-format export

**핵심 구조**: HTML을 정본 제작 표면으로, PDF·PPTX는 export 경로로.

- HTML 프레임워크: reveal.js 72k(성숙) · Slidev 47.9k(릴리스 활발, Playwright 기반 PDF/PPTX/PNG 통합 export — **PPTX는 PNG를 pptxgenjs로 배경 삽입하는 래스터, 편집 불가** — export.ts 실측) · Marp(마크다운 최경량) · impress.js(정체).
- PDF 경로: **Playwright print-to-pdf**(범용 최고 신뢰, 프로덕션 사례) · **decktape**(14 프레임워크 인식 페이지 경계 캡처, Puppeteer — 클론 실측).
- PPTX 경로 3등급: ① 이미지 박제(Slidev·Marp·Touying export 공통 — 편집 불가) ② **pptxgenjs 기반 html2pptx**(Anthropic 오피스 스킬 계열 채택 — 4.0.1이 과거 "복구 필요" 손상 버그 수리판임을 CHANGELOG 실측) ③ **ppt-master식 SVG→DrawingML**(네이티브 편집 가능 — hugohe3/ppt-master 30k~41k stars, 스크립트 202개 실측).
- 코드 조판 계열: Typst/Touying(구 /ppt 스킬이 이 경로 — PNG 박제 한계 명시돼 있음).

주요 출처 (접근일 전부 2026-07-28): https://github.com/hugohe3/ppt-master · https://github.com/slidevjs/slidev · https://github.com/astefanutti/decktape · https://github.com/gitbrent/PptxGenJS · https://github.com/ComposioHQ/awesome-claude-skills/blob/master/document-skills/pptx/scripts/html2pptx.js · http://blog.pamelafox.org/2024/01/converting-html-pages-to-pdfs-with.html

## 3. 기존 자산 대조

- **`presentation-slides-yusung`** (promoted 현역): slides.json 단일 원본 → HTML 결정론 빌드, 레이아웃 16종, G1~G7 승인 게이트, validator/overflow checker. **HTML 정본 축의 기존 구현.**
- **`slide-deck-workflow`** (toolshelf 메타 카드): 리서치→구조→카피→디자인→제작→QA 7게이트 프로세스 + slides-grab vs presentation-slides-yusung 엔진 선택표. **바깥 프로세스의 기존 정본.**
- **`slides-grab`** (toolshelf, npm ~1k stars): HTML 슬라이드 + bbox 시각 편집 + validate + PDF/PNG export.
- 구 `/ppt`(deprecated): Typst/Touying → PNG 박제 pptx. 구 `ppt-master` 스킬(graveyard): 위 GitHub 프로젝트의 워크플로우 사본.
- 코딩애플 영상 2건(사용자 제공 요약): HTML/CSS 발표의 이점(애니메이션·차트·3D·배포)과 실전 주의(한글 폰트·다크모드·파일 분리 명시), SVG 필터 표현 기법(displacement map·liquid UI·클릭재킹 주의).

## 4. 이번에 만든 상류 자산

- KG 노드 2건 (`~/projects/knowledge-graph`, 커밋 eeefd22): `slide-deck-convergent-principles` · `html-first-slide-export-pipeline`
- toolshelf 카드 4건 (커밋 7fb5776): `ppt-master` · `decktape` · `slidev` · `PptxGenJS` (전부 클론 실측 + 반입 안전 심사 통과)

## 5. 갭 (goal 재료)

1. 거장 원칙의 **린트화**(제목 완결문장·메시지 수·텍스트 비율 검사기)는 어디에도 없음.
2. **편집 가능 PPTX export** 경로 부재 — 기존 자산 전부 이미지 박제 계열.
3. 이 모든 걸 잇는 **제작 방법론 문서**(knowledge/methodology)가 없음. ⚠ 정정(2026-07-28 fresh 검증자 적발): 슬라이드 **매체 게이트는 이미 정본이 있다** — `docs/design-system/medium-taxonomy.md`(발표 행)·`slide-spec.md`(캔버스 프리셋·WCAG·통설 규칙, 코드 검증 `packages/template-core/src/slide-spec.ts`)가 llms.txt Media 섹션으로 배포 중. 따라서 갭은 게이트가 아니라 **제작 파이프라인**(HTML 정본·export 경로·프로세스·린트 규칙)이며, 새 문서는 게이트를 재서술하지 않고 기존 정본을 인용/확장해야 한다.

# Slide Production — 발표 슬라이드를 어떻게 만드는가

> 발표 슬라이드 제작 파이프라인의 실행 가이드. 콘텐츠 원칙("무엇이 좋은가")은 [slide-principles](../knowledge/slide-principles.md), 매체 게이트 정본은 [medium-taxonomy](../docs/design-system/medium-taxonomy.md) · [slide-spec](../docs/design-system/slide-spec.md) — 이 문서는 게이트를 재서술하지 않고 인용한다.
> 근거 장부: `research/2026-07-28-sl1-slide-methodology-research.md` (도구 실측·출처 URL·접근일 2026-07-28).

## 1. HTML이 정본 제작 표면이다

발표 슬라이드는 **HTML을 단일 정본으로 만들고, PPT·PDF는 export 산출물로 취급한다.** 형식별로 따로 만들지 않는다.

- 표현 자유도가 가장 높다 — 애니메이션·Chart.js·Three.js·실시간 데이터. 이 레포의 [expressive-stack](../knowledge/expressive-stack.md) 티어·recipe 층이 그대로 재료가 된다.
- 브라우저 렌더가 곧 최종 화면이라 WYSIWYG 검증이 되고, git으로 버전 관리된다.
- 편집 가능한 소스(JSON/HTML)에서 결정론적으로 재빌드된다 — `presentation-slides-yusung`의 `content/slides.json` 계약.

주의(HTML→export 함정): **export 경로를 이어 붙이지 않는다.** HTML→PDF→PPTX처럼 이으면 첫 변환에서 이미지로 굳는다. PPTX가 필요하면 HTML(또는 SVG)에서 직접 간다.

## 2. Export 결정표 — 3형식

분기 질문은 하나다: **받는 쪽이 산출물을 얼마나 편집해야 하는가.**

| 목적 | 경로 | 도구 (toolshelf 카드) | 편집 |
|---|---|---|---|
| 발표 그 자체 | HTML 그대로 (브라우저/배포) | `presentation-slides-yusung` · `slides-grab` | 소스 편집 → 재빌드 |
| 공유·인쇄용 PDF | Playwright print-to-pdf (범용) / `decktape` (reveal.js 등 14 프레임워크 인식) | `decktape` · slides-grab pdf | 불가 (최종본) |
| 보기용 PPTX | 슬라이드를 PNG 렌더 → 배경 삽입 (Slidev·Marp·구 /ppt 전부 이 방식) | `slidev` (export 아키텍처 참조) | 불가 (이미지 박제) |
| **편집 가능 PPTX** | ① HTML→shape 변환: pptxgenjs 기반 html2pptx ② SVG→DrawingML: ppt-master 방식 | `PptxGenJS`(4.0.1+ 고정 — 구버전 손상 이력) · `ppt-master` | 가능 (네이티브 개체) |

- 편집 가능 PPTX 두 경로의 실측 비교는 SL3(Askewly Design 소개 덱 실증)에서 장부화했다 — `research/2026-07-28-sl3-pptx-path-comparison.md`.
- **실측 결론 (2026-07-28, 사용자 확정)**: PPTX 네이티브 변환은 HTML·PDF 대비 품질이 확연히 낮다(폰트 미임베드 폴백·레이아웃 근사·SVG 저작 규약 마찰 — PowerPoint 실개봉 관측). 따라서 **PPTX 심화는 여기서 멈추고, 수신자가 파일을 직접 편집해야 한다는 명시 요구가 있을 때만 위 경로를 쓴다.** 기본 배포는 HTML(발표·링크 공유) + PDF(고정 공유)이며, 투자 우선순위도 HTML 표현력·PDF 품질에 둔다.
- 문서형 PDF(보고서·브리핑)는 이 문서 범위 밖 — `/pdf` 스킬 소관. 여기는 **슬라이드의 PDF export**만 다룬다.

## 3. 엔진 선택 — 언제 무엇으로 만드나

정본 기준표는 toolshelf `slide-deck-workflow` 카드(엔진 선택표·7게이트 프로세스). 요지:

| 상황 | 엔진 |
|---|---|
| 재사용·계속 편집할 진지한 덱, 인터랙티브(Chart.js·Three.js·QR·before/after) | `presentation-slides-yusung` (slides.json 정본, 레이아웃 16종, G1~G7 게이트) |
| 빠른 프로토타입, 시각적 bbox 편집, 즉시 PDF/PNG | `slides-grab` (npm CLI, 35 스타일) |
| 편집 가능 PPTX가 최종 요구 | 위 엔진으로 HTML 확정 후 §2 편집 가능 경로 — 또는 `ppt-master` 워크플로우 직행 |

## 4. 프로세스 — 구조가 디자인보다 먼저 (순서 강제)

[slide-principles](../knowledge/slide-principles.md) 원칙 4·5의 실행형. `presentation-slides-yusung`의 G1~G7 게이트가 이미 이 순서를 강제한다 — 새 발명 없이 그대로 쓴다:

```text
G1 자료(출처 승인) → G2 구성안(아웃라인 승인) → G3 문구 → G4 디자인 방향
→ G5 대표 슬라이드 미리보기 → G6 검증 → G7 export
```

- **G2 이전에 슬라이드를 그리지 않는다** — 아웃라인(장별 메시지 1개 + 제목=주장) 승인이 먼저다.
- G3에서 **title-only read test**(제목만 이어 읽어 스토리가 통하는가)를 사람 체크 항목으로 확인한다 — 기계 판정 불가 항목이라 게이트 체크리스트 소속.

## 5. 매체 게이트 — export별 최종 형식 확인

게이트 자체(캔버스 프리셋 선언·WCAG 대비·통설 규칙 옵트인)는 [slide-spec](../docs/design-system/slide-spec.md)이 정본이다. 이 문서가 추가하는 것은 **export별 최종 형식 확인 절차**뿐이다 — 인쇄 게이트의 "최종 형식 그대로 래스터화" 원칙([medium-taxonomy](../docs/design-system/medium-taxonomy.md))을 슬라이드 export에 적용:

| 산출물 | 확인 방법 |
|---|---|
| HTML | 브라우저 실조작 (링크·키보드 이동·인터랙션 — G5/G6 기존 절차) |
| PDF | **PDF 파일 자체를 열어** 첫·중간·끝 3면 확인 (HTML 스크린샷 아님 — 페이지 경계·폰트 임베딩이 그 사이에서 갈린다) |
| PPTX | **PowerPoint 또는 LibreOffice로 실개봉** — 렌더 충실도 + (편집 가능 경로면) 텍스트 선택·개체 이동이 실제로 되는지 |

한글 폰트·글자 크기·다크모드 대비는 HTML 단계에서 명시해야 export에 반영된다 ([slide-principles](../knowledge/slide-principles.md) §표현 기법 실전 주의).

## 6. 슬라이드 린트 규칙 스펙 (SL2 구현 입력)

구현 위치: `presentation-slides-yusung`의 validator(`tools/validate-slides.mjs`) 확장 — 입력은 `content/slides.json`. **전 규칙 severity=warning, 차단 없음** — slide-spec §3의 철학(근거 없는 임계값을 차단으로 승격하면 근거 있는 검사까지 무시당한다)을 따르고, 각 위반은 근거 등급을 값으로 들고 나온다.

| id | 규칙 | 입력 | 판정 | 임계값 | 예외 | 근거 등급 |
|---|---|---|---|---|---|---|
| R1 | 제목=완결 문장 | `slides[].title` | 명사구 블랙리스트 일치(`개요·결과·소개·배경·현황·목차·정리` 단독) 또는 한국어 종결어미(`-다/-까/-자/-요`)·영어 동사 부재 | 블랙리스트=위반, 종결어미 부재=의심 보고 | `cover`·`closing`·`qr-embed` 레이아웃 | 실증 (assertion-evidence, Penn State) |
| R2 | 슬라이드당 메시지 1 | `slides[].title` + 핵심 메시지 필드 | 제목 내 병렬 신호 카운트: `및`·`와/과` 나열·`&`·쉼표 | 병렬 신호 ≥2 = 위반 | `comparison-2col`(비교=한 메시지)·`summary-grid`(요약 전용) | 통설 (맥킨지 관행 — 실증 미확인) |
| R3 | 텍스트 과밀 | 시각 슬롯 없는 레이아웃의 본문 텍스트 총량 | 슬라이드당 본문 글자수 합산 | >250자 = 위반 (임계값은 통설 — 조정 가능 옵션으로) | `closing`(출처 목록 등) | 통설 (6×6 계열 folklore) |
| R4 | 폰트 하한 | — | **신규 구현 금지** — `@askewly/template-core`의 `checkSlideHeuristics`(24pt, folklore, 옵트인)가 이미 존재. 필요 시 그 코드를 부른다 | slide-spec 정본 | — | folklore (slide-spec §3) |

- R1~R3도 옵트인 플래그로 켠다(기본 off) — 기존 validator 사용자의 출력을 갑자기 바꾸지 않는다.
- title-only read test(원칙 2의 전체 스토리 검사)는 기계 판정 불가 — §4 G3 체크리스트 소속으로 남긴다.
- 위반 fixture(위반 slides.json 샘플)로 검출을 실증하는 것까지가 SL2 DoD.

## 관련

- 원칙·표현 기법: [slide-principles](../knowledge/slide-principles.md)
- 게이트 정본: [slide-spec](../docs/design-system/slide-spec.md) · [medium-taxonomy](../docs/design-system/medium-taxonomy.md)
- 도구 카드: toolshelf `ppt-master`·`decktape`·`slidev`·`PptxGenJS`·`slides-grab`·`slide-deck-workflow`
- KG: `html-first-slide-export-pipeline` (`~/projects/knowledge-graph`)

## Changelog

- 2026-07-28: SL3 실측 결론 반영 — PPTX 심화 중단, HTML·PDF 우선 (사용자 확정).
- 2026-07-28: 초판 (SL1 step-2 — HTML 정본·export 결정표·엔진 선택·게이트 인용·린트 스펙).

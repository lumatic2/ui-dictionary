# 편집 가능 PPTX 두 경로 비교 장부 (SL3 실측, 2026-07-28)

> 소비처: `plans/2026-07-28-sl3-editable-pptx-proof.md` (goal `slide-methodology` SL3) · `methodology/slide-production.md` §2 후속 근거.
> 동일 원본(Askewly Design 소개 덱, HTML 정본 7장)을 두 경로로 PPTX화한 실측. 검사 도구: python-pptx (PowerPoint/LibreOffice 미설치로 실개봉은 못 함 — 아래 "평가 못 함").

## 실측 비교

| 축 | 경로 A — pptxgenjs (html2pptx 계열) | 경로 B — ppt-master (SVG→DrawingML) |
|---|---|---|
| 입력 | `slides.json`을 직접 매핑 (자체 스크립트 ~130줄, 레이아웃 6종 대응) | SVG 재작성 필요 (대표 3장 수작업 — 장당 SVG 저작 비용) |
| 산출 | 7장 전부 변환 | 3장 (대표 장 한정 실험) |
| 개체 편집성 | 전부 네이티브: AUTO_SHAPE 텍스트 프레임 + **네이티브 CHART 개체**(데이터 편집 가능) + 발표자 노트 | 전부 네이티브: TEXT_BOX 21/26개 + AUTO_SHAPE — SVG 좌표 그대로 |
| 캔버스 | 13.333×7.5in (defineLayout 명시) | 13.333×7.5in (1280×720 SVG에서 자동 추론) — slide-spec `pptx-widescreen-16-9` 정합 |
| 차트 | `addChart(BAR)` → 진짜 PowerPoint 차트 | 미실험 — SVG 차트는 도형으로 굳을 것으로 예상 |
| 시각 충실도 | 매핑 규칙의 근사 (HTML 렌더와 레이아웃 차이 있음 — 카드 위치·그라디언트 생략) | SVG 좌표 = 산출 좌표 (WYSIWYG에 가까움) |
| 파이프라인 의존 | npm 1패키지 (`pptxgenjs@4.0.1` 고정 — 구버전 손상 이력) | Python venv 5패키지(python-pptx·XlsxWriter·skia-pathops·Pillow·numpy) + **정식 경로는 `spec_lock.md` 프로젝트 계약 요구** — 이번엔 `--quick-test`(test-only)로 우회 |
| 반복 왕복 | 정본 수정 → `node html2pptx.mjs` 재생성 (완전 자동) | SVG 중간층을 손으로 유지해야 함 (자동화하려면 HTML→SVG 생성기 필요) |

## 판정

- **자동화 반복 왕복이 목적이면 경로 A** — 정본(slides.json)에서 결정론 재생성이 되고 차트까지 네이티브다. 매핑 규칙을 레이아웃 16종 전체로 넓히는 비용이 남는다.
- **시각 충실도·자유 배치가 목적이면 경로 B** — 좌표 보존이 확실하다. 단 SVG 중간층 저작 비용과 정식 파이프라인의 프로젝트 계약(spec_lock·8확인)이 반복 사용의 마찰이다.
- methodology §2 결정표의 "편집 가능성 요구" 분기는 실측으로 유지 — 두 경로 다 "네이티브 편집 가능"을 실제로 달성했다.

## 실개봉 결과 (2026-07-28 2차 — 정정)

> 1차 판정 "미설치"는 오판이었다 — PATH 검색(Get-Command)만 하고 설치 디렉터리·레지스트리를 안 봤다. 사용자 지적으로 재확인: **둘 다 설치돼 있었다.** (검증 방법 교훈: 설치 확인은 App Paths 레지스트리 + 표준 설치 경로까지)

- **PowerPoint COM 실개봉 — 두 파일 모두 PASS**: 복구 대화 없이 열림, slide 2 개체 이동(+20pt) 실적용, 텍스트 편집·복원 성공, SaveAs 성공. 편집 가능 PPTX 주장이 실제 PowerPoint 엔진에서 실증됨.
- **LibreOffice Impress 렌더 — 두 파일 모두 파싱·PDF 변환 성공.** 래스터 확인에서 실결함 2건 발견:
  1. **경로 A 폰트 폴백** — Pretendard 미임베드라 미설치 환경에서 세리프 폴백. 대응: 폰트 임베드 옵션 또는 수신 환경 폰트 안내 필요 (methodology §5 실전 주의에 이미 있는 "한글 폰트 명시"의 PPTX 판).
  2. **경로 B 텍스트 겹침** — SVG에서 여러 줄을 절대좌표 `<text>`로 찍은 저작 방식이 변환 후 텍스트 박스 줄간격과 충돌해 겹침. SVG 저작 시 tspan/단일 텍스트 블록 규약 필요 — 정식 ppt-master 파이프라인이 spec 계약을 요구하는 이유를 실측으로 재확인.

## 평가 못 함

- 경로 B의 차트·인터랙티브 레이아웃 변환.

## dogfood 결함 (real-use-lap 정신)

1. ppt-master 정식 경로는 `spec_lock.md` 계약 필수 — 표적 변환만 쓰려면 `--quick-test`(test-only)뿐. 반복 자동화에 쓰려면 계약 파일 생성을 스크립트화해야 한다.
2. 경로 A의 레이아웃 매핑은 덱별 수작업 — 스킬화하려면 presentation-slides-yusung 레이아웃 16종의 표준 매핑 모듈이 필요하다.
3. 로컬에 PPTX 뷰어 부재 — 발표 매체 게이트(§5 실개봉)를 로컬에서 못 밟는 환경 갭.

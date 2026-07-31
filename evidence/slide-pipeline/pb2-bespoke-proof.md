# PB2 — bespoke 실증: askewly-design-intro 고품질 산출

> 2026-07-31 · plan: `plans/2026-07-31-pb2-bespoke-proof.md` · 산출: `decks/askewly-design-intro/export/askewly-design-intro.bespoke.pptx` (bespoke 코드: `tools/export-pptx-bespoke.mjs`)

## 절차 (pptx-bespoke.md 계약 준수)

- 선행 게이트: PB1 배포본(`scripts/pptx-to-png.ps1`·`references/pptx-bespoke.md`) 존재 확인 PASS.
- 기준: HTML 렌더 7장 스크린샷(`export/baseline-png/`, 덱 정식 캡처 경로 export-raster-pdf `--png-dir`, 1920×1080·scale 2x). ⚠ 일반 `playwright screenshot` 직접 캡처는 논리 캔버스 스케일링을 안 타 기준으로 못 쓴다(실측 — 캡처는 반드시 덱 캡처 경로로).
- bespoke 코드: 슬라이드별 아트디렉션 7종(hero-motion 정지 프레임 재해석·카드 3열·비교 2열 틴트·차트 카드·스텝 플로우·요약 그리드·클로징). 팔레트·폰트 전부 theme.mjs 판독.

## 라운드 장부 (대표 1장 = slide 2 hero-cards, 상한 5)

| 회차 | 대상 | 체크리스트 ①표면색 ②팔레트 ③타이포 ④구도 ⑤디테일 | 관측 편차 | 반영 |
|---|---|---|---|---|
| r1 | s02 | ① pass ② pass ③ pass ④ fail ⑤ fail | 본문 3줄 랩이 언더라인과 충돌·본문 박스 부족 | 카드 h 1.62→1.82, 본문 h 0.6·9.5pt, 언더라인 하향 |
| r2 | s02 | ① pass ② pass ③ pass ④ pass ⑤ pass | 수렴 | — |

전장 추가 라운드 (상한 3, 합산):

| 회차 | 대상 | 관측 편차 | 반영 |
|---|---|---|---|
| f1 | s04·s05·s07 | s04 값축이 위로(catAxisOrientation 부작용) · s05 번호 원 "01" 줄바꿈(기본 inset) · s07 URL 랩 | s04 데이터 역순 투입으로 축 아래 유지 · s05 margin:0+박스 확장 · s07 itemW 1.8 |

최종 전장 PNG 세트 재검(7장): 충돌·랩·잘림 0. 비교컷: `img/pb2-baseline-s02.png` vs `img/pb2-bespoke-s02.png`, 차트 `img/pb2-bespoke-s04.png`.

## 편차 장부 (표현 불가 — 침묵 근사 금지)

| HTML 표현 | PPTX 제약 | 대체 표현 | 판정 |
|---|---|---|---|
| 그라디언트 언더라인·연결선 | pptxgenjs gradient fill 미지원 | 2·3톤 분할 블록 (색 경계 계단) | 수용 |
| 카드 배경 미세 그라디언트(card-gradient) | 동상 | 단색 CARD/틴트 근사 | 수용 |
| hero-motion 모션 | PPTX 정적 | 정지 프레임 아트디렉션 (exportFallback 문구 계약) | 수용 |
| lucide 아이콘(layers·target·sparkles) | 코드 생성 경로에 SVG 이관 없음 | ✦·✓ 글리프 + 틴트 박스 | 수용 |
| 차트 막대 라운드 코너 | pptxgenjs bar 코너 옵션 없음 | 직각 막대 | 수용 |

## 구조 검증 (SP3 계약 회귀 없음)

- python-pptx: slides 7 · charts 1(has_chart 네이티브) · **pictures 0** · notes 7(발표자 노트 이관).
- COM 실개봉: Opened·ChartShapes 1·Workbook 접근 1 — PASS.
- pptxgenjs 4.0.1 결함 실측 2건 (bespoke 코드 주석 + finding):
  - **shadow 옵션 객체 뮤테이션** — 같은 객체를 두 도형에 재사용하면 EMU 이중 변환(blurRad 177800→22.6억)으로 **PowerPoint 가 파일을 열지 못한다**(python-pptx/XML lint 는 통과 — 구조 검증만으로 못 잡는 부류). 해법: 도형마다 새 객체.
  - 텍스트 기본 inset 이 좁은 박스에서 숫자("01")도 줄바꿈 — margin:0 필요.

## v2 재수행 (기준 교체 후 — brandlogy 그래머)

- 콘텐츠: `content/pptx-composition.json` 신설(PPT 구성 레이어 — 주장형 헤드라인·빅넘버 스탯·아이콘 리스트, 수치는 레포 실측만: 562·166·47·13 / 차트1·비트맵0·노트7). slides.json(HTML 정본) 무접촉.
- 코드 v2: 프레임 고정 앵커(kicker·워드마크·페이지/출처) + 정보 3계층(헤드라인→스탯 카드→차트/리스트 카드) + 색 규율(정량=네이비·정성=먹색) + 캔버스 수직 그라디언트 근사(1% 투명도 계단 5장).

라운드 장부 v2 (체크리스트 v2: ①프레임 ②3계층 밀도 ③색 규율 ④타이포 위계 ⑤카드 문법):

| 회차 | 대상 | 판정 | 관측 편차 | 반영 |
|---|---|---|---|---|
| v2-r1 | s04(대표) | ①~④ pass ⑤ fail | 그라디언트 밴드 경계선 노출(2장 큰 계단) | 1% 계단 5장으로 세분 |
| v2-r2 | 전장 | ⑤ fail | 스탯·리스트 카드 내부 공백 과다(비율 미준수) | ref 실측 비율로 압축(statH 1.5~1.6) |
| v2-r3 | 전장 | 전항 pass | 행 압축 후 중간 빈 띠 | 두 행 블록 본문 수직 센터링 — 수렴 |

- 구조 검증(v2): python-pptx slides 7·charts 1·pictures 0·notes 7 + COM Opened·ChartShapes 1·Workbook 접근 1 — PASS.
- 편차 장부 추가(v2): 캔버스 수직 그라디언트 → 1% 투명도 계단 5장 근사(수용) · lucide 아이콘 → 유니코드 글리프 칩(수용).
- 부수 실측: 관측용으로 열려 있던 PowerPoint 창이 산출 파일을 잠가 EBUSY — 재산출 전 대상 파일을 잡은 뷰어 프로세스 종료 필요(라운드 루프 운영 노트).

## f4 라운드 (사용자 관측 2차 피드백 반영)

- 관측 피드백 2026-07-31: ① "배경에 정체불명 그림자 계층" — 그라디언트 근사 밴드가 원인 → **제거, 단색 캔버스** (근사가 원본보다 나쁜 사례 — 편차 장부 판정 '수용'→'철회' 정정). ② "카드 일색이라 어색" → 구성 분화: 카드는 s4(차트+스탯)에만, s2·s3·s6=헤어라인 오픈 스탯+오픈 리스트, s5=번호 원+연결선 오픈 플로우, s7=오픈 클로징.

## ⑤ 등가 실증 — 주제 한 줄 → 자유 구성 (free-topic-deck)

- 영상 5단계 재검토(사용자 질문)로 드러난 갭: 영상의 ⑤는 **주제 한 줄 → 클로드가 구성(장수·장별 내용) 자유 생성**인데, askewly-design-intro 실증은 기존 HTML 덱 7장 구성을 물려받았다 — 구성이 PPT 매체에서 태어나지 않음. 영상에 장수·목차 지정 단계는 없음(스타일은 ①~④에서 1회 박제).
- 실증: `decks/claude-ppt-lab/free-topic-deck/` — 주제 "오늘 슬라이드 파이프라인에 무슨 일이 있었나" 한 줄에서 구성안 자유 생성(5장: 표지→방법→실측 차트→교훈→액션). 수치 전부 실측(git log 34커밋·단계별 7/2/4/5·라운드 10·PPTX 5본·흡수 3+1).
- 결과: **캘리브레이션 0라운드로 그래머 전이** — 박제된 스타일(bespoke 코드 v2 f4)이 새 주제·새 구성에서 추가 조정 없이 동작. 영상 "한 장이 완벽하면 그다음은 극락"의 실측 등가.
- 구조 검증: slides 5·charts 1·pictures 0·notes 5 + COM Opened·Workbook 접근 — PASS.

## 게이트

- 시각(체크리스트 5항): PASS (r2 수렴 + 전장 f1).
- 구조: PASS.
- 사용자 관측 1회(최종): **대기** — PowerPoint 실개봉, 범용 매퍼 산출본과 대조 판정. 관측 결과를 새 줄로 추가한다.
- 관측 결과 2026-07-31: **FAIL — "쓸만한 품질 아님".** 원인 판정(사용자): "HTML 과 동일한 구조로 PPT 를 만들겠다는 목적 자체가 잘못" — 기준이던 HTML 덱이 애초에 여백 위주 미니멀이라, 충실 재현할수록 성긴 PPT 가 된다. 사용자가 제시한 목표 이미지 = 영상(brandlogy)류 편집 그래머: 좌상단 kicker·우상단 워드마크·좌측 주장형 헤드라인+한 줄 부제·본문 2열(차트 카드 + 빅넘버 스탯 카드 3단)·하단 페이지/출처 — 본문 밀도 규칙(하단 1/3 비우지 않음). **품질 기준 결정 자체가 뒤집힘 → decision_required 정지, 재계획.**

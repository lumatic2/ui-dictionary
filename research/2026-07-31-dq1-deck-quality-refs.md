# 덱 시각 품질 기준 — 리서치 보강 (DQ1 재료)

> 2026-07-31 · 소비처: `plans/2026-07-31-dq1-quality-rubric.md` step-2(루브릭)·step-3(배선) — goal `deck-quality`
> 선행 장부: `research/2026-07-31-html-upgrade-goal-refs.md`(파이프라인·기법) · `research/2026-07-28-sl1-slide-methodology-research.md`(거장 방법론 출처 장부)
> 초점: **시각 구성 품질**(밀도·위계·그리드·색·데이터 표현) — 콘텐츠 원칙(메시지·제목)은 기존 정본이 소유하므로 재수집하지 않는다.

## 0. 기존 정본과의 경계 (중복 금지 지도)

루브릭이 **인용만 하고 재서술하지 않을** 기존 자산:

| 이미 있는 것 | 정본 위치 | 루브릭에서의 취급 |
|---|---|---|
| 콘텐츠 수렴 원칙 5 (메시지 1·제목=주장·시각 증거·청중 관점·구조 우선) | `knowledge/slide-principles.md` (KG `slide-deck-convergent-principles`) | 인용 — 콘텐츠 축은 이 5원칙이 정본 |
| 캔버스·WCAG 대비·통설 옵트인(24pt 등) 게이트 | `docs/design-system/slide-spec.md` | 인용 — 수치 게이트는 재정의 금지 |
| 콘텐츠 린트 R1~R3(제목 문장·메시지 1·과밀 250자) | `methodology/slide-production.md` §6 | 인용 — 기계 검사 기존분 |
| 스킬 자체 린트(거장 5원칙 + R4 모션·R5 슬롭 시그니처·R6 이모지) | custom-skills `templates/src/lint-principles.mjs` | 인용 — 번호 충돌 주의(§6 R1~R4 와 별개 체계) |
| AI-slop 금지 카탈로그(CSS·토큰·컴포넌트) | `methodology/ai-slop-catalog.md`·KG 스멜 테스트 8항 | 인용 — 슬롭 축 정본 |
| 모션 규율(GPU 속성·stagger≤10·reduced-motion) | custom-skills `references/style-system.md`(HU2) | 인용 |

**루브릭이 채울 공백**: ① 장 단위 시각 구성(밀도 판정·위계 단계 수·그리드/정렬·여백) ② 색·강조 운용(신호색 수·강조 남용) ③ 덱 단위 서사 아크(장별 역할·리듬) ④ 데이터 슬라이드 시각 원칙 ⑤ few-shot 견본(살아있는 예시).

## 1. 시각 구성 원칙 (외부 수집 — sonnet 위임, 접근일 전부 2026-07-31)

> 형식: 원칙 / 근거·출처 / 판정 질문. 콘텐츠 축(메시지·제목)과 겹치는 항은 §0 경계에 따라 기존 정본 인용으로 대체 예정.

### 밀도
1. **슬라이드당 아이디어 1 — 헤드라인 6~8단어로 요약 안 되면 쪼갠다.** Miller's Law(7±2)·Sweller 인지부하. 출처: [QuarkAndCode/Medium — The Math Behind Effective Slide Design](https://medium.com/@QuarkAndCode/the-math-behind-effective-slide-design-evidence-based-powerpoint-tips-ba1b8db8895f). 판정: "이 장의 메시지를 8단어 헤드라인 하나로 말할 수 있는가?" *(기존 수렴 원칙 1과 동일 계보 — 루브릭에선 인용 처리)*
2. **화면 텍스트가 구두 설명을 반복하지 않는다(redundancy principle).** Mayer Multimedia Learning — graphics+narration 이 graphics+narration+printed text 보다 우위. 출처: [UCSD Multimedia — Evidence-Based Presentation Design](https://multimedia.ucsd.edu/best-practices/presentation-design.html) (Mayer 2009·Kosslyn 2007 인용). 판정: "화면 텍스트가 발표 멘트의 사본인가?"
3. **불릿 4개 상한(rule of four).** 작업기억 4개념 한계, 완료 불릿은 회색 처리. 출처: 위 UCSD. 판정: "불릿이 4개를 넘는가, 넘는다면 왜?"

### 위계
4. **대비가 위계를 만든다** — 크기·색·형태로 지배/절제 요소를 명확히. 출처: [Duarte — Ultimate Guide to Contrast](https://www.duarte.com/blog/ultimate-guide-to-contrast/). 판정: "가장 먼저 읽혀야 할 요소가 실제로 가장 크거나 진한가?"
5. **신호 대 잡음비 최대화** — 메시지에 기여하지 않는 요소 제거(감정 기여 요소는 예외 인정). 출처: [Presentation Zen — The Signal-to-Noise Ratio](https://presentationzen.com/blog/the-signal-to-noise-ratio-activity). 판정: "이 요소를 지워도 전달에 지장 없는가?"
6. **뒷줄 가독성** — 고속도로 표지판처럼 즉시 읽히는 크기. 출처: [Garr Reynolds — Design Tips](https://www.garrreynolds.com/design-tips). 판정: "뒷자리에서 읽히는가?" *(수치 게이트는 slide-spec 정본 — folklore 옵트인)*
7. **F/Z 시선 패턴 위 배치** — 텍스트 밀도 높으면 F, 미니멀이면 Z. NN/g 232명 eyetracking(2006·2017 재확인). 출처: [NN/g — F-Shaped Pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/). 판정: "핵심이 좌상단 또는 Z 대각 착지점에 있는가?"

### 그리드·정렬·여백
8. **여백 2/3 규칙** — 슬라이드의 약 2/3 를 빈 공간으로(수치는 출처 간 편차, 방향성 일치). 출처: [presentations.ai — Design Best Practices](https://www.presentations.ai/blog/presentation-design-best-practices). 판정: "빈 공간이 절반 이상인가?"
9. **여백 = 산소** — 핵심 요소를 고립시켜 초점 강화. 출처: [Duarte — perfect your slide design](https://www.duarte.com/perfect-your-slide-design/). 판정: "핵심 요소 주변에 침범 없는 여백이 있는가?"
10. **보이지 않는 그리드** — 같은 정렬 기준선이 덱 전체에서 반복. 출처: [SlideBazaar — The Invisible Grid System](https://slidebazaar.com/blog/the-invisible-grid-system-that-makes-every-slide-layout-look-intentional/). 판정: "좌측 마진·텍스트 시작점이 장마다 흔들리지 않는가?"

### 색·강조
11. **60-30-10** — 주색 60(배경)·보조 30(제목/컨테이너)·강조 10(핵심 수치/CTA)만, 팔레트 3~4색 상한. 출처: [SlidesCarnival — best colors](https://www.slidescarnival.com/learn/how-to-pick-the-best-colors-for-your-presentation-slides). 판정: "강조색이 색면적 ~10%를 지키며 핵심에만 쓰였는가?"
12. **목적 있는 색 2~3개** — 전경 warm·배경 cool. 출처: Garr Reynolds Design Tips(상동). 판정: "장마다 색 조합이 바뀌지 않는가?"

### 서사
13. **3막 구조** — 청중의 문제 제시 → 현실 vs 가능성 대비 → 해법+행동요청. 출처: [Duarte — 3-Act Story Structure](https://www.duarte.com/blog/business-communication-demands-3-act-story-structure/). 판정: "덱을 3막으로 잘랐을 때 빈 막이 없는가?"
14. **청중 = 영웅, 발표자 = 멘토** — 도전과제로 열고 더 나은 미래상으로 닫는다. 출처: [Duarte — Storytelling in Presentations](https://www.duarte.com/blog/tips-for-crafting-a-storytelling-presentation/). 판정: "첫 장이 자기소개가 아니라 청중의 도전과제로 시작하는가?" *(기존 수렴 원칙 4와 동계 — 인용 처리)*

### 데이터
15. **데이터-잉크 비율 최대화** — 비데이터 잉크(그리드·장식·3D) 제거. Tufte. 출처: [GeeksforGeeks — Tufte's Principles](https://www.geeksforgeeks.org/data-visualization/mastering-tuftes-data-visualization-principles/). 판정: "지워도 해석에 지장 없는 장식이 남았는가?"
16. **발표용 차트는 결론만** — 라이브와 회람 문서는 밀도 기준이 다르다. 출처: [Duarte — Displaying Data](https://www.duarte.com/blog/display-data-in-presentations/). 판정: "원자료 전체가 아니라 결론 하나로 좁혀졌는가?"
17. **직접 라벨링 + 전략적 색** — 맥락 요소는 라이트 뉴트럴, 핵심만 볼드 색. 범례 왕복 조회 지양. 출처: Duarte(상동) + [Shortform — Storytelling With Data 요약](https://www.shortform.com/summary/storytelling-with-data-summary-cole-nussbaumer-knaflic). 판정: "라벨이 데이터 옆에 바로 붙어 있는가?"
18. **차트 클러터 = 인지부하** — 값을 더하지 않는 요소 전부 제거. Nussbaumer Knaflic. 출처: Shortform(상동). 판정: "각 차트 요소가 이해에 실제 기여하는가?"

### 검사 주체 판정 (에이전트 보고 원문)
기계 린트 가능: 3(불릿 수)·6(폰트 하한 — slide-spec 기존)·8(여백 비율 — 바운딩박스)·10(정렬 좌표 반복성)·11(색 히스토그램)·12(고유 색 수)·17(범례 vs 직접 라벨). 부분 기계: 15·18(요소 카운트만). 사람 육안(G5): 1·2·4·5·7·9·13·14·16.

## 2. 고품질 실덱 사례 (외부 수집 — sonnet 위임, 접근일 전부 2026-07-31)

> 형식: 사례 / 관찰 가능한 기법 / 흉내 함정. Linear 키노트·Front 덱·Config 2026 비주얼은 근거 부족으로 **확인 불가 처리**(추정 기재 회피 — 에이전트 보고 원문).

1. **Jobs iPhone 2007 (Duarte 스파크라인 분석)** — "what is"↔"what could be" 교차로 격차를 벌리는 서사 곡선, 상태→서스펜스→경이→새 안정 4단 감정 곡선. 출처: [Duarte/Wikipedia](https://en.wikipedia.org/wiki/Nancy_Duarte)·[peterlevitan.com](https://peterlevitan.com/steve-jobs-nancy-duarte-present-4224/)·[gong.io](https://www.gong.io/blog/steve-jobs-iphone-keynote). 함정: 스파크라인(서사 밀도)과 Jobs 미니멀(비주얼 밀도)은 결이 달라 그대로 겹치면 어긋난다.
2. **Apple WWDC (Carmine Gallo 분석)** — 통계 1개=슬라이드 1장 전담 · 숫자를 시각 오브젝트로(500억을 앱 아이콘으로 채움) · 불릿 전면 배제 · 슬라이드-데모 교차 리듬. 출처: [Forbes/Gallo](https://www.forbes.com/sites/carminegallo/2013/06/11/ten-presentation-techniques-you-can-and-should-copy-from-apples-wwdc-keynote/). 함정: 텍스트리스는 발표자 암기+라이브 데모가 전제 — 슬라이드만 비우면 맥락 실종.
3. **Airbnb 2008 피치덱** — 정체성 9단어 압축 표지 · 장 = 논증 스텝 1개 · 14장 최소 분량 · Sequoia 10항 골격. 출처: [spectup](https://www.spectup.com/resource-hub/airbnb-pitch-deck-analysis)·[failory](https://www.failory.com/pitch-deck/airbnb)·[easyvc](https://easyvc.ai/blog/sequoia-capital-pitch-deck-template/). 함정: **이 덱의 강점은 논증 구조지 그래픽 완성도가 아니다**(로고 배경 불통일 등 시각 미달 지적 다수) — 비주얼 사례로 흉내 금지.
4. **Vercel Ship 키노트 플랫폼** — 연간 단일 비주얼 모티프(자성 입자→페로플루이드) 하나로 브랜드 관통 · 디자인 토큰/모듈 컴포넌트로 이벤트 간 일관성. 출처: [vercel.com blog](https://vercel.com/blog/designing-and-building-the-vercel-ship-conference-platform). 함정: 전담 모션 팀+3D 파이프라인 전제 — 흉내 내면 "로고 배경 영상"에 그치고 핵심(모티프 정합성)은 재현 안 됨.
5. **reveal.js/Slidev 쇼케이스** — Auto-Animate(같은 이름 요소 자동 보간 — DQ2 step-1 의 직접 전례)·fragment 세분 스타일·배경 레이어 분리·코드/다이어그램 실물 임베드. 출처: [revealjs.com/demo](https://revealjs.com/demo/)·[sli.dev/showcases](https://sli.dev/resources/showcases). 함정: 기능 전부 쓰기 = 산만한 덱 — 좋은 사례의 공통점은 주제에 필요한 기능만 선별.

**공통 패턴 5** (에이전트 종합): ① 장 하나 = 아이디어/논증 스텝 하나 ② 핵심 수치는 전용 장으로 격리해 시각적으로 과장 ③ 덱 전체를 관통하는 단일 서사/비주얼 모티프를 먼저 정한다 ④ 텍스트보다 보여주는 요소(이미지·데모·코드) 우선, 설명은 말로 ⑤ 인터랙션 기능은 주제 적합 선별만.

## 3. 루브릭 후보 표 (종합 — step-2 입력)

§0 경계 적용: 기존 정본 소유 항목(메시지 1·제목=주장·폰트 하한·모션·슬롭 시그니처)은 제외하고, **신규 루브릭 후보만** 남긴다. 검사 주체: L=기계 린트(slides.json 정적 분석으로 가능한 것만 — 픽셀 히스토그램류는 G5 로 격하), G5=육안 캘리브레이션.

| # | 후보 원칙 | 근거 | 검사 주체 |
|---|---|---|---|
| Q1 | 화면 텍스트 ≠ 발표 멘트 사본 (redundancy) | §1-2 Mayer | G5 (notes 대조는 L 보조 가능) |
| Q2 | 항목 4개 상한 — 넘으면 분할·그룹화 | §1-3 UCSD | L (items 수) |
| Q3 | 장당 지배 요소 1개 — 가장 먼저 읽힐 것이 실제로 가장 크다 | §1-4 Duarte 대비 | G5 |
| Q4 | 신호/잡음 — 지워도 지장 없는 요소 0 | §1-5 Presentation Zen | G5 |
| Q5 | 여백 ≥ 절반 — 콘텐츠가 캔버스를 꽉 채우지 않는다 | §1-8·9 (수치는 방향성) | G5 (overflow-checker 는 초과만 잡음) |
| Q6 | 정렬 기준선 덱 전체 반복 (그리드) | §1-10 | G5 (템플릿이 이미 상당 보장) |
| Q7 | 강조색 절제 — 강조 1색이 핵심 수치/CTA 에만 | §1-11·12 60-30-10 | G5 (테마 토큰이 팔레트는 보장, 남용은 육안) |
| Q8 | 서사 아크 — 청중 문제로 열고, 현실↔가능성 대비로 전개, 행동요청으로 닫는다 | §1-13·14 + §2-1 스파크라인 | G5 (덱 단위) |
| Q9 | 핵심 수치 전용 장 격리 + 시각 과장 | §2-2 WWDC | G5 |
| Q10 | 덱 관통 단일 모티프 — 장식이 장마다 새 문법을 발명하지 않는다 | §2-4 Vercel + §2 공통 ③ | G5 |
| Q11 | 차트 = 결론 1개 + 직접 라벨 + 비데이터 잉크 0 | §1-15~18 Tufte·Duarte·Knaflic | 부분 L (범례 유무·grid 옵션) + G5 |
| Q12 | 표현 기능(fragment·전환·3D) 주제 적합 선별 — 기본은 미적용 | §2-5 함정 + HU4 사용자 확정 | G5 |

- L 후보 중 실구현 가치: **Q2(items 수)** 는 기존 R3(글자수 250)와 별개 축이라 린트 승격 후보. Q11 의 범례/grid 는 차트 config 정적 검사 가능. 나머지 L 표기는 G5 체크리스트 문항으로.
- few-shot 견본 계열 배정(step-2): 표지(Q8·Q10) · 본문 텍스트(Q2·Q3·Q5) · 데이터(Q9·Q11) · 비교(Q3·Q7) · 마무리(Q8 행동요청).

## Changelog
- 2026-07-31 초판 — 내부 경계 지도 선작성, 외부 수집 대기.

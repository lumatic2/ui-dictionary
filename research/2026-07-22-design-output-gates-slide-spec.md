# 슬라이드(발표 자료) 규격 계약 리서치 — Design Output Gates

- 작성일: 2026-07-22
- 목적: 미래 horizon `design-output-gates`(가칭, `plans/horizons/CANDIDATES.md` 4번 `design-output-static-linter`)의 **슬라이드 매체 milestone** 설계 입력. 슬라이드 자산은 레포에 아직 0건이므로 이 문서가 신설 규격 조사다.
- 접속일: 모든 출처 2026-07-22.
- 관련 선행 리서치: `research/2026-07-20-template-production-hardening-print-spec.md` — 인쇄물(명함·포스터·인포그래픽) 규격 계약. 본 문서는 그 자매 문서로, 구성(항목별 관행 → 교차검증 → 레포 현재 값과의 관계)을 따른다. 코드 레벨 대응물은 `packages/template-core/src/print-spec.ts` — 슬라이드 전용 `slide-spec.ts` 같은 파일은 아직 없다.

---

## 1. 캔버스 규격

### 1.1 PowerPoint

- **Widescreen(16:9) 기본값 = 13.333in × 7.5in**(PowerPoint 2013부터 기본) — [Microsoft Support, Change the size of your PowerPoint slides](https://support.microsoft.com/en-us/office/change-the-size-of-your-powerpoint-slides-040a811c-be43-40b9-8d04-0de5ed79987e) (접속 2026-07-22, 공식 1차 출처, WebFetch로 본문 확인).
- 같은 페이지에 **"On-screen Show (16:9)" = 10in × 5.625in**도 별도 항목으로 존재한다. 비율은 Widescreen과 동일(16:9)하지만 절대 치수가 다르다 — 즉 "16:9"라는 이름만으로 절대 캔버스 크기를 확정할 수 없고 두 프리셋을 구분해야 한다.
- **Standard(4:3) 레거시 = 10in × 7.5in**(PowerPoint 2010 이전 기본값) — 같은 공식 출처.
- px 환산(96 PPI 기준, 업계 통용): 13.333in×7.5in ≈ 1280×720px, 확대하면 1920×1080px(둘 다 16:9 비율 유지) — [Deckary, PowerPoint Slide Size: Dimensions for 16:9, 4:3 & Custom](https://deckary.com/blog/powerpoint-slide-size) (접속 2026-07-22), [papersowl, PowerPoint Slide Sizes](https://papersowl.com/blog/powerpoint-slide-size) (접속 2026-07-22) — 2개 2차 출처 일치. **주의: 96 PPI 자체가 PowerPoint 공식 export 해상도라는 1차 확인은 못함 — "출처 확인 실패"**(업계 통용 수치로만 확인).

### 1.2 Google Slides

- **기본 = 960×540px, 16:9, 10in×5.625in(25.4×14.29cm), 96 PPI 기준** — [Google Docs Editors Help, Change slide size & measurement units in Google Slides](https://support.google.com/docs/answer/3447672?hl=en) (접속 2026-07-22, 공식 페이지 WebFetch로 확인했으나 **본문 자체엔 구체 px/inch 수치가 없고 "Standard(4:3)/Widescreen(16:9)/Widescreen(16:10)" 세 프리셋 이름만 명시**). 960×540px 수치는 2차 출처 — [plusai, Google Slides size and dimensions](https://plusai.com/blog/google-slides-size-and-dimensions/) (접속 2026-07-22).
- Google Slides 16:9 기본값(10in×5.625in)은 PowerPoint의 "On-screen Show (16:9)" 프리셋(동일 10in×5.625in)과 정확히 일치하고, PowerPoint의 Widescreen 기본값(13.333in×7.5in)과는 **다르다**. 즉 "PowerPoint 기본"과 "Google Slides 기본"이 같은 16:9라도 절대 캔버스 크기가 다를 수 있다.
- Google Slides도 4:3(Standard), 16:10(Widescreen 16:10) 프리셋을 제공한다 — 공식 페이지 확인.

### 1.3 Apple Keynote

- 프리셋으로 1920×1080(16:9 Full HD)을 제공하며, 구버전(레거시) 기본은 4:3이었다는 언급이 다수 2차 출처에서 확인된다 — [Indezine, Apple Keynote Slide Size (aka Resolution)](https://blog.indezine.com/2008/06/apple-keynote-slide-size-aka-resolution.html) (접속 2026-07-22, 오래된 글이나 Keynote px 기반 좌표계의 역사적 근거), [aspectratiocalculator.com, Presentation Aspect Ratios](https://aspectratiocalculator.com/presentation-aspect-ratios/) (접속 2026-07-22). **Apple 공식 문서에서 "기본값" 자체를 명시한 1차 출처는 이번 세션에서 확인하지 못함 — "출처 확인 실패".** Keynote는 PowerPoint·Google Slides와 달리 애초에 **inch가 아니라 px 기반** 캔버스 좌표계를 쓴다는 점이 여러 출처에서 일관되게 확인된다(이 자체는 1차 확인 없이 다수 2차 출처 일치로만 채택).

### 1.4 세 도구 비교 — 절대 치수가 서로 다르다

| 도구 | 16:9 기본/프리셋 | 절대 치수 | 비고 |
|---|---|---|---|
| PowerPoint | Widescreen(기본, 2013~) | 13.333in × 7.5in | 96PPI 환산 시 1280×720 또는 1920×1080 |
| PowerPoint | On-screen Show (16:9) | 10in × 5.625in | Widescreen과 별개 프리셋, 비율만 같음 |
| Google Slides | 기본 | 960×540px = 10in × 5.625in | PowerPoint의 On-screen Show와 절대 치수 일치 |
| Keynote | 프리셋 | 1920×1080px | px 네이티브, inch 환산은 2차 파생 |

**교차검증 결론**: "16:9 슬라이드"라는 이름만으로 절대 캔버스 크기는 정해지지 않는다(PowerPoint Widescreen 13.333in vs On-screen Show/Google Slides 10in — 비율은 같지만 절대 크기가 1.333배 차이). 인쇄 규격(90×50mm vs 85×55mm)에서 확인된 것과 같은 패턴 — **비율 일치가 규격 일치를 보증하지 않는다.**

### 1.5 4:3 레거시

- PowerPoint Standard(4:3) = 10in×7.5in(96PPI 환산 960×720px) — 위 1.1절 출처. Google Slides도 4:3 프리셋 제공(1.2절). 두 도구의 4:3 절대 치수가 일치하는지는 이번 세션에서 별도 대조하지 못함(Google 공식 페이지가 구체 수치를 안 밝힘) — **출처 확인 실패**.

---

## 2. 안전영역(title-safe / action-safe)

### 2.1 방송 표준 자체는 확인됨 — 그러나 슬라이드용은 아니다

- **SMPTE ST 2046-1:2009**(1차 표준 문서, 1920×1080/1280×720/720×576/720×480 TV 포맷 대상)이 **Safe Action Area = 93%**, **Safe Title Area = 90%**(가로·세로 모두, 프로덕션 애퍼처 기준)로 재정의했다 — [SMPTE ST 2046-1:2009 PDF](https://pub.smpte.org/pub/st2046-1/st2046-1-2009.pdf) (1차 표준 문서, 접속 2026-07-22), [GlobalSpec, SMPTE ST 2046-1](https://standards.globalspec.com/std/1208705/SMPTE%20ST%202046-1) (접속 2026-07-22), [NAB, Television Safe Areas Redefined](https://www.nab.org/xert/scitech/pdfs/tv031510.pdf) (접속 2026-07-22, 업계 해설). 구버전(1963년 SMPTE RP 13)은 90%/90% 단일 값이었다.
- **이 표준은 TV/방송 프로덕션용이지 발표 슬라이드용이 아니다.** 슬라이드에 그대로 적용된다는 1차 출처(Microsoft/Google/Apple 공식 문서)는 확인하지 못했다 — **"출처 확인 실패"**: 슬라이드 제작 업계 블로그(SlideModel, PPT Productivity 등)가 "No Fly Zone"이라는 이름으로 이 방송 개념을 차용해 쓰지만, 이는 방송 표준의 **유추 적용**이지 슬라이드 전용 표준이 아니다 — [PPT Productivity, No Fly Zone slide boundary](https://pptproductivity.com/powerpoint-addin/refine-easier/refine-slides/no-fly-zone-slide-layout) (접속 2026-07-22).

### 2.2 슬라이드 전용 여백 관행 — 근거 약함

- "16:9일 때 슬라이드 폭의 1/20(≈5%)을 여백으로" 같은 경험칙이 발견되나 출처가 업계 블로그(Slidor)뿐이고 1차 표준이 없다 — [Slidor, PowerPoint margins: set up slide safe zones](https://www.slidor.agency/blog/marges-slides-powerpoint) (접속 2026-07-22). **통설 — 1차 출처 없음.**
- "사방 최소 1인치" 권장도 동일 계열 2차 출처에서만 확인 — [SlideGenius, Optimal Margin Size for PowerPoint Presentations](https://www.slidegenius.com/cm-faq-question/how-much-space-is-enough-for-a-margin-in-powerpoint-is-there-a-default-standard) (접속 2026-07-22), 같은 글이 "PowerPoint에 기본/표준 여백값 자체가 없다"고 명시. **즉 "PowerPoint/Google Slides/Keynote 공식 안전영역 값은 없다"는 것 자체가 확인된 사실이고, 방송 90%/93%를 슬라이드에 쓰는 것은 업계 관행의 유추이지 표준이 아니다.**

### 2.3 결론

인쇄 규격 리서치의 "포스터 안전영역 3mm는 유추다" 패턴과 동일한 구조 — 슬라이드도 **"안전영역"이라는 개념 자체는 널리 쓰이지만 슬라이드 전용 수치 표준은 없다.** 방송 90%/93%를 그대로 가져다 쓰려면 그 사실(원출처=TV, 슬라이드=유추 적용)을 명시해야 근거를 왜곡하지 않는다.

---

## 3. 본문 최소 글자 크기

### 3.1 "24pt/30pt 규칙"의 1차 출처 — Guy Kawasaki, 통설이 아니라 특정 인물의 실명 규칙

- **10/20/30 규칙**(슬라이드 10장, 발표 20분, 폰트 최소 30pt)의 저자는 **Guy Kawasaki**(전 Apple 에반젤리스트, 벤처캐피털리스트)이며 본인 블로그에 규칙 원문이 있다 — [Guy Kawasaki, The 10/20/30 Rule](https://guykawasaki.com/the_102030_rule/) (접속 2026-07-22, 저자 본인 1차 출처). 그는 "30pt가 부담스러우면 청중 중 최고령자 나이를 2로 나눈 값을 폰트 크기로 쓰라"는 대안 공식도 제시했다 — 같은 출처.
- **이것은 실증 연구가 아니라 한 개인(투자자·발표자)의 경험칙이다.** "발표 슬라이드는 최소 24pt/30pt여야 한다"는 문구가 마치 업계 표준인 것처럼 여러 2차 출처(Autoppt, Superchart, Whitepage 등)에 반복 인용되지만, 그 근원은 전부 이 한 사람의 블로그 규칙으로 수렴한다. **가독성 실험(예: 특정 거리에서 특정 pt가 실제로 읽히는지 측정한 연구)에 기반한 1차 출처는 이번 세션에서 확인하지 못했다 — "출처 확인 실패".**
- Microsoft 자체는 본문 18~24pt를 언급하는 2차 정리 글이 있으나(Autoppt 요약), Microsoft 공식 문서에서 이 수치를 직접 확인하지 못했다 — **출처 확인 실패**.

### 3.2 결론

24pt/30pt 규칙은 **통설이지 1차 실증 출처가 없다.** 다만 원저자(Guy Kawasaki)가 명확히 특정되는 점에서 "출처 불명 통설"과는 결이 다르다 — "누가 왜 이 규칙을 만들었는지"는 확인되나 "왜 30이라는 숫자인지"의 실증 근거는 없다.

---

## 4. 한 슬라이드 정보량 한계 (6×6 규칙)

### 4.1 원 출처 불명, 인지부하 이론과의 연결도 후행적 정당화

- **6×6 규칙**(불릿 최대 6개, 불릿당 최대 6단어)은 다수 프레젠테이션 업계 사이트에서 반복되지만, **이 숫자(6과 6) 자체의 1차 창안자·연구를 특정하는 출처는 확인하지 못했다** — **출처 확인 실패**. George Miller의 "매직 넘버 7±2"(작업기억 용량 연구, 1956)를 근거로 드는 2차 해설이 있으나 — [SlideModel, What is the 6x6 Rule in PowerPoint?](https://slidemodel.com/6x6-rule-powerpoint/) (접속 2026-07-22) — 이는 6×6 규칙이 처음 제안될 때 Miller의 논문을 실제로 인용해서 나온 것인지, 아니면 사후적으로 그럴듯한 근거를 붙인 것인지 구분되지 않는다.
- **John Sweller의 인지부하 이론(Cognitive Load Theory, 1980년대 후반)은 실재하는 학술 이론**이고, 관련 연구는 슬라이드 텍스트 과다가 학습에 부정적이라는 결론을 반복 확인한다 — 예: 시선추적 연구에서 불릿 1개일 때 학생이 전문을 읽지만 불릿이 늘어날수록 읽는 비율이 급감한다는 결과, 그리고 "중복 효과(redundancy effect)" — 말과 글로 동일 정보를 동시에 제시하면 작업기억 과부하가 생긴다는 결과 — [InnerDrive, PowerPoint Presentations: student attention and Cognitive Load](https://www.innerdrive.co.uk/blog/tracking-powerpoint-attention/) (접속 2026-07-22). **다만 이 연구들은 "정보가 적을수록 낫다"는 방향성만 지지하지, "정확히 6개·6단어"라는 임계값을 실증하지는 않는다.**

### 4.2 결론

- **방향성(적을수록 낫다)은 인지부하 이론으로 뒷받침된다 — 실재하는 학술 근거.**
- **"6"이라는 정확한 숫자는 통설이다 — 1차 출처 없음.** 검사기를 만든다면 "불릿 개수/단어 수 상한이 존재해야 한다"는 원칙은 근거가 있지만, 그 상한값을 6으로 못박는 것은 관행 채택이지 실증 채택이 아니라는 점을 문서에 남겨야 한다.

---

## 5. 대비 기준 (프로젝터 환경)

### 5.1 WCAG 값 자체는 확정, "슬라이드 전용" 별도 기준은 없음

- WCAG 2.1/2.2 기준 그대로: **일반 텍스트 4.5:1(AA), 큰 텍스트(18pt 이상 또는 14pt bold 이상) 3:1(AA), AAA는 각각 7:1/4.5:1** — [W3C, Understanding SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) (접속 2026-07-22, 1차 표준 해설), [W3C, Understanding SC 1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced) (접속 2026-07-22).
- **Microsoft 자체가 PowerPoint 접근성 가이드에서 이 WCAG 값을 그대로 채택한다** — "18pt 미만 일반 텍스트는 4.5:1 이상, 18pt 이상(또는 14pt bold 이상) 큰 텍스트는 3:1 이상" — [Microsoft Support, Make your PowerPoint presentations accessible](https://support.microsoft.com/en-us/office/make-your-powerpoint-presentations-accessible-to-people-with-disabilities-6f7772b2-2f33-4bd2-8ca7-dae3b2b3ef25) (접속 2026-07-22, 공식 1차 출처). **즉 "슬라이드는 WCAG 값을 그대로 쓴다"는 것 자체는 Microsoft 공식 문서로 확인된 사실이다** — 인쇄물처럼 "화면과 다른 별도 규격"이 아니다.

### 5.2 프로젝터 환경 보정값 — 통설, 정량 표준 없음

- "프로젝터로 투사하면 화면보다 20~30% 밝게(연하게) 보인다"는 경험칙이 발견되나 1차 출처(ANSI/제조사 표준)가 아니라 업계 블로그 수준 — **출처 확인 실패**(구체 출처 URL을 이번 세션에서 특정하지 못함, WebSearch 종합 결과에서만 확인).
- ANSI/HFS 100-1988(디스플레이 측정 표준)이 주변광을 대비 계산에 포함해야 한다고 규정한다는 언급이 있으나, 이는 디스플레이 측정 업계 표준이지 "슬라이드 제작 시 대비를 몇 배로 올려야 하는가"에 대한 정량적 보정 계수를 제공하지 않는다 — **출처 확인 실패**(원문 표준 문서 직접 확인 못함).

### 5.3 결론

- **정량 기준은 WCAG 4.5:1/3:1을 그대로 쓰는 것이 맞다** — Microsoft 공식 문서가 이를 확인한다. 인쇄물과 달리 슬라이드는 화면 표시가 최종 매체와 물리적으로 다르지 않다(둘 다 발광형 디스플레이 또는 투사).
- **"프로젝터는 어두워 보이니 대비를 더 확보해야 한다"는 방향성은 실무적으로 합리적이나, 이를 몇 배로 가중치를 줄지에 대한 정량 표준은 확인하지 못했다.** 검사기를 만든다면 WCAG 4.5:1/3:1을 하한으로 쓰되, "이 값은 이상적 디스플레이 기준이며 프로젝터 환경에서는 추가 여유가 권장된다"는 주석을 다는 정도가 근거에 부합한다.

---

## 6. 기계 검증 가능성 판정표

| # | 항목 | 규칙(요약) | 근거 등급 | 정적 분석으로 결정론적 검증 가능? | 비고 |
|---|---|---|---|---|---|
| 1 | 캔버스 비율/치수 | 청사진이 16:9(13.333×7.5in 또는 10×5.625in) / 4:3(10×7.5in) 선언과 일치 | 확정 사실(공식 문서) | **가능** | `print-spec.ts`의 `validateSpecDeclaration` 패턴 그대로 재사용 가능 — 선언한 규격 vs 실제 px 비율 대조 |
| 2 | 안전영역(title/action-safe) | 필수 텍스트가 캔버스 90%(title-safe) 또는 93%(action-safe) 인셋 안에 있는가 | **유추 적용**(방송 표준 SMPTE ST 2046-1을 슬라이드에 차용, 슬라이드 전용 1차 출처 없음) | **가능**(수치를 유추로 채택한다는 전제하에) | 인셋 비율 계산 자체는 인쇄물 안전영역과 동일한 산수 — 값의 근거 등급만 다르다 |
| 3 | 본문 최소 글자 크기(24pt/30pt) | 본문 텍스트가 하한 pt 이상인가 | **통설**(Guy Kawasaki 개인 경험칙, 실증 연구 없음) | **가능** | 텍스트 요소의 font-size 속성만 읽으면 되는 가장 쉬운 검사 — 단, 하한값 자체(24? 30?)는 임의 채택임을 문서에 명시 필요 |
| 4 | 불릿/줄 수 상한(6×6) | 슬라이드당 불릿 ≤6, 불릿당 단어 ≤6 | **통설**(방향성은 인지부하 이론 지지, 정확한 숫자는 근거 없음) | **가능** | 텍스트 노드 개수·단어 수 카운트는 정적 분석의 정석 — "왜 6인가"는 못 재지만 "6을 넘었는가"는 결정론적으로 잴 수 있음 |
| 5 | 대비(WCAG) | 본문 4.5:1, 큰 텍스트(18pt+/14pt bold+) 3:1 | 확정 사실(WCAG 1차 표준 + Microsoft 공식 채택) | **가능** | 기존 WCAG 대비 계산 로직 재사용 가능(다른 레포 기능에 이미 있을 가능성 높음) |
| 5b | 프로젝터 보정 가중치 | 대비 기준에 추가 여유를 둘 것인가 | **출처 확인 실패**(정량 표준 없음) | **불가능** — 재고 근거 자체가 없어 검사 임계값을 못 정함 | 검사기에 넣으려면 자체 임의 기준을 새로 정해야 하는데, 이는 리서치가 아니라 설계 판단(horizon에서 사용자 결정 필요) |
| 6 | "슬라이드가 지루한가" 류 정성 판단 | (예시로 배경에서 제시된 대조군) | 해당 없음 | **불가능** | 정적 분석 대상이 아님 — 참고용 |

---

## 7. 레포 현재 값과의 관계

- `packages/template-core/src/print-spec.ts`에는 슬라이드 전용 규격이 없다(명함/A계열 포스터만 존재). `hasPrintSpecs()`도 `medium === 'print'`만 다룬다 — 슬라이드는 `medium: 'screen'` 경로로 갈 가능성이 높으나, 현재 `TemplateBlueprint`의 `output.medium`에 슬라이드 전용 값(예: `'slide'`)이나 슬라이드 캔버스 프리셋은 코드에 없다(이번 세션에서 `types.ts` 재확인은 하지 않음 — 필요 시 horizon 설계 단계에서 직접 대조).
- 인쇄 규격과 달리 슬라이드는 **mm 환산이 필요 없다** — 최종 매체가 화면/투사이므로 인쇄물처럼 "논리 px ↔ 물리 mm" 이중 좌표계 문제(선행 리서치 8.4절)가 발생하지 않는다. 대신 "어느 도구(PowerPoint/Google Slides/Keynote) 기준 캔버스 px인가"를 선언해야 한다는, 인쇄물의 "어느 규격 mm인가" 문제와 **동형(isomorphic)**인 문제가 있다(1.4절 비교표 참조).

---

## 8. 확정 사실 vs 확정 못 한 것 요약

### 확정 사실
- PowerPoint 기본 캔버스: Widescreen 13.333×7.5in, On-screen Show(16:9) 10×5.625in, Standard(4:3) 10×7.5in (Microsoft 공식 1차 출처)
- Google Slides 기본 16:9 = 10×5.625in = 960×540px(PowerPoint On-screen Show와 절대 치수 일치) — 단 px 수치 자체는 2차 출처
- Keynote 16:9 프리셋 = 1920×1080px (다수 2차 출처 일치, Apple 1차 확인은 실패)
- SMPTE ST 2046-1:2009 = Safe Action 93%, Safe Title 90% (1차 표준 문서로 확인)
- WCAG 대비 기준 4.5:1(일반)/3:1(큰 텍스트), Microsoft가 PowerPoint 접근성 가이드에 그대로 채택 (1차 표준 + 공식 벤더 문서)
- 10/20/30 규칙(폰트 최소 30pt)의 저자는 Guy Kawasaki 본인(1차 블로그 출처) — 단 "30"이라는 숫자 자체의 실증 근거는 없음
- Cognitive Load Theory(Sweller)와 슬라이드 텍스트 과다의 부정적 상관은 실재하는 연구 방향 — 단 "6×6"이라는 정확한 임계값의 실증 근거는 없음

### 확정 못 한 것 ("출처 확인 실패")
- 방송 안전영역(90%/93%)을 슬라이드에 적용하는 것에 대한 발표/슬라이드 전용 1차 표준(Microsoft/Google/Apple 공식 문서) — 업계 블로그의 유추 적용만 확인
- 6×6 규칙 숫자(6, 6) 자체의 최초 창안자·1차 연구
- 24pt/30pt 규칙이 실제 가독성 실험(거리·해상도별 임계 측정)에 기반했다는 1차 근거
- PowerPoint/Google Slides/Keynote export 시 96 PPI가 실제로 고정 공식값인지에 대한 벤더 1차 확인
- 프로젝터 환경에서 WCAG 대비 기준에 추가할 정량적 가중치(20~30% 완화/강화 등 구체 계수)
- Google Slides 4:3 프리셋의 정확한 절대 치수(공식 문서가 프리셋 이름만 밝히고 수치를 안 씀)
- Keynote 공식 문서에서 "기본값"을 직접 명시하는 1차 출처

---

## Changelog
- 2026-07-22: 최초 작성.

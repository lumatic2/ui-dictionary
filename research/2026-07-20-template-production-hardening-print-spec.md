# 인쇄 발주 규격 계약 리서치 — Template Production Hardening

- 작성일: 2026-07-20
- 목적: `packages/template-core`의 인쇄 규격 계약(도련·안전영역·명함/포스터/인포그래픽 규격·해상도·mm↔px 환산)을 실제 인쇄 발주가 가능한 수준으로 다시 세우기 위한 사실 조사. milestone **TH11(인쇄 규격 mm 기반 재정의)** 설계 입력.
- 접속일: 모든 출처 2026-07-20.
- 관련 선행 리서치: `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md` — 도련/명함 규격(1.2절)이 부분적으로 겹친다. 본 문서는 그 수치를 재검증하고, 포스터·인포그래픽·해상도·`@page` CSS 항목을 추가로 다룬다.

---

## 1. 도련(Bleed)

### 1.1 한국 인쇄소 관행

- 명함: 재단선 바깥으로 **사방 3mm** 확장(90×50mm 완성 → 96×56mm 작업 사이즈)이 반복적으로 확인됨 — [파란디자인, 명함 사이즈 완벽 가이드](https://parancompany.co.kr/blog/business-card-size) (접속 2026-07-20), [오프린트미, 명함 사이즈 90×50 vs 85×55](https://www.ohprint.me/blog/business-card-size-guide-90x50-85x55) (접속 2026-07-20), WebSearch 종합 결과("도련은 사방 1~3mm가 표준이며 ... 96×56mm") — 복수 인쇄 업체(레드프린팅·나눔인쇄·이프린트랜드 등) listicle 종합, 개별 페이지 원문 인용은 실패(레드프린팅 원문 페이지엔 구체 수치 없음, 링크만 존재 — 아래 참고).
- 포스터: 완성 사이즈에 **사방 3mm씩(총 6mm)** 추가하는 동일 원칙이 적용됨 — 예시로 A2 완성 420×594mm → 작업 사이즈 426×600mm — [파란디자인, 포스터 사이즈 가이드](https://parancompany.co.kr/blog/poster-size-guide) (접속 2026-07-20).
- 교차검증: 레드프린팅(`redprinting.co.kr`) 가이드 페이지(`/ko/guide/view/6/342`)는 도련·안전영역 링크만 갖고 원문에 수치가 없어 직접 인용은 실패("**출처 확인 실패**" — 링크된 하위 페이지는 별도 접속 필요, 본 세션에서 미조사). 대신 파란디자인(명함/포스터 두 항목 모두 3mm)과 WebSearch 종합 결과가 일치해 3mm를 정본 값으로 채택.

### 1.2 국제 관행

- 미국/캐나다 명함: 0.125in(=3.175mm) 도련이 표준 — [Apex Workwear, Business Card Bleed and Safe Area](https://apexworkwear.ca/business-card-bleed-and-safe-area/) (접속 2026-07-20, 선행 리서치에서 재확인).
- 값 자체(3mm ≈ 0.118in vs 미국 0.125in=3.175mm)는 근소하게 다르지만 실무적으로는 "사방 약 3mm" 관행이 한국/미국 공통.

### 1.3 명함 vs 포스터 — 다른가?

**다르지 않다.** 두 포맷 모두 한국 인쇄소 관행은 사방 3mm 도련으로 동일하다(1.1절 출처 2건 모두 3mm). 현재 레포의 `print-spec.ts`가 명함에 `bleedMm: 3`(한국 규격) / `3.175`(미국 규격)를 쓰는 것은 이 사실과 일치한다. 포스터에도 동일 원칙(3mm)을 확장 적용하는 것이 타당하다는 근거가 확보됐다.

---

## 2. 안전영역(Safe Area / Margin)

### 2.1 정의와 도련과의 구분

- 안전영역은 **재단선에서 안쪽으로**(도련과 반대 방향) 확보하는 여백으로, 재단 오차로 텍스트·로고가 잘리지 않게 하는 목적. 도련은 재단선 **바깥으로** 배경이 넘어가게 하는 여유. 두 개념은 재단선을 기준으로 서로 반대 방향에 위치한다 — [Apex Workwear, Business Card Bleed and Safe Area](https://apexworkwear.ca/business-card-bleed-and-safe-area/) (접속 2026-07-20), 파란디자인 명함 가이드(1.1절 출처).

### 2.2 수치

- 명함: 재단선 안쪽 **3mm** — 84×44mm 안에 텍스트·로고 배치(90×50mm 재단 기준) — 파란디자인, WebSearch 종합 결과(1.1절 동일 출처).
- 포스터: 안전영역 개념과 별개로 **최소 15mm 여백**을 게시 목적(게시판 클립 등에 가려지지 않도록)으로 권장, 전체 면적의 30~40%를 여백으로 유지하라는 권장도 확인됨 — [파란디자인, 포스터 사이즈 가이드](https://parancompany.co.kr/blog/poster-size-guide) (접속 2026-07-20). 단, 이 15mm는 "재단 오차 대비 안전영역"이 아니라 "게시 환경에서 콘텐츠가 가려지지 않기 위한 여백"으로 목적이 다르다 — 이 구분을 명확히 인용할 별도 1차 출처는 확인 실패("**출처 확인 실패**": 파란디자인 기사 자체가 두 개념을 뚜렷이 구분하지 않고 서술함).

### 2.3 레포 현재 값과의 관계

- `catalog.ts`의 `SAFE_AREA_INSET = 24`(px, 고정)는 포맷·규격과 무관한 단일 값이다. 명함 규격(3mm)과 포스터 권장 여백(15mm)이 5배 차이 나므로, 고정 px 단일 값은 두 포맷 모두를 정확히 표현할 수 없다.
- `print-spec.ts`의 `safeAreaMm: 3`(명함 전용)은 2.2절 수치와 일치한다. 포스터·인포그래픽에는 아직 규격이 없다(`hasPrintSpecs`가 `business-card`만 반환 — 4절 참조).

---

## 3. 명함 규격

선행 리서치(`format-layout-taxonomy.md` 1.2절)에서 이미 상세 조사됨. 본 리서치에서 재확인한 요지만 정리:

| 규격 | 크기 | 도련 포함 작업크기 | 안전영역 내부 크기 | 사용 빈도/맥락 |
|---|---|---|---|---|
| 한국 표준 | 90×50mm | 96×56mm | 84×44mm | 전통적, 금융/법률/공공 선호 |
| 한국 카드지갑형 | 85×55mm | 동일 원리(3mm) | 동일 원리 | IT/디자인/스타트업 선호, 신용카드 규격과 동일 |
| 미국/캐나다 | 3.5×2in (88.9×50.8mm) | 3.75×2.25in (0.125in 도련) | 3.25×1.75in | 북미 표준 |

출처: 위 1.1절 + 선행 리서치 1.2절(Apex Workwear, PrintingForLess, 파란디자인, 오프린트미).

**중요 — 재단 크기 자체가 다르다는 점**: 90/50=1.8, 85/55≈1.545, 88.9/50.8=1.75. 세 비율이 모두 다르므로 명함은 "하나의 국제 표준"이 없고, 규격 프리셋으로 명시적으로 구분해야 한다(현재 `print-spec.ts`의 3개 프리셋 구조가 이 사실에 부합).

---

## 4. 포스터 규격

### 4.1 인쇄 발주에 실제 쓰이는 표준 (ISO A계열)

| 규격 | 크기(mm) | 비율(장변/단변) | 용도 |
|---|---|---|---|
| A0 | 841×1189 | 1.414 (1:√2) | 대형 도면/학회 포스터 |
| A1 | 594×841 | 1.414 | 행사 메인, 로비 벽, 대형 캠페인 |
| A2 | 420×594 | 1.414 | 실내 포스터 표준(가장 보편적) |
| A3 | 297×420 | 1.414 | 소형 실내/데스크 포스터 |

출처: [papersizes.org, A Paper Sizes](https://www.papersizes.org/a-paper-sizes.htm) (접속 2026-07-20, ISO 216 근거), [파란디자인, 포스터 사이즈 가이드](https://parancompany.co.kr/blog/poster-size-guide) (접속 2026-07-20, 동일 수치 한국어 확인). 한국 인쇄 실무 블로그(네이버) 교차검증: A1=841×594mm, A2/B2/A1 사이즈 정리 글에서 동일 수치 확인 — [퍼블로그, 포스터 제작 가이드](https://blog.naver.com/happyhoon2016/224340350619) (접속 2026-07-20), [allin1editor 블로그, A2·B2·A1 포스터 사이즈 정리](https://blog.naver.com/allin1editor/224294726319) (접속 2026-07-20). **두 번 조회한 수치(A1=594×841mm)가 국제 출처(papersizes.org)와 한국 실무 출처(네이버 블로그 2건) 모두 일치.**

### 4.2 B계열(한국에서 병행 사용)

- B1: 728×1030mm, B2: 515×728mm, B3: 364×515mm — [allin1editor 블로그](https://blog.naver.com/allin1editor/224294726319) (접속 2026-07-20). 국전지(A계열 원지, 939×636mm)와 사륙전지(B계열 원지) 구분이 한국 인쇄 용지 관행에 존재함 — WebSearch 종합 결과(나무위키, 디지프린트 등 listicle 종합, 개별 1차 출처 직접 인용은 미실시).

### 4.3 미국 표준

- 18×24in(457×610mm)과 24×36in(610×914mm), 모두 비율 2:3(≈1:1.333) — 선행 리서치 확인([PixExact, Poster Size Guide](https://www.pixexact.com/blog/poster-size-guide), 접속 2026-07-20).

### 4.4 현재 레포 캔버스(1080×1350, 4:5)와의 차이

- 4:5 = 0.8 (또는 세로 기준 1.25) — 인스타그램 세로형 피드에 최적화된 **소셜 미디어 크리에이티브 비율**이다 — [Venngage, Infographic Size Guide](https://venngage.com/blog/infographic-size-guide-web-social-print/) 등 소셜 규격 관련 통용 지식(별도 1차 인용 불필요할 만큼 업계 공지 수준이나, 정확한 "Instagram 4:5" 출처 직접 인용은 본 세션에서 별도 조사하지 않음 — "출처 확인 실패"로 표기하되 선행 리서치 2.2절에서 이미 "인쇄 표준이 아닌 소셜 세로형 규격"으로 확인됨).
- 인쇄 표준 비율은 A계열 1:1.414(≈0.707) 또는 미국 2:3(≈0.667)로, 1080×1350의 0.8과 **명확히 다르다**. 즉 현재 캔버스는 어느 인쇄 표준 비율과도 일치하지 않는다.
- 포스터 해상도 관행(본 리서치 신규 확인): **A2 이하는 300dpi, A1 이상은 150~200dpi**로 낮춰도 된다는 실무 기준이 확인됨 — [파란디자인, 포스터 사이즈 가이드](https://parancompany.co.kr/blog/poster-size-guide) (접속 2026-07-20). 이는 대형 포스터는 관람 거리가 멀어 고해상도가 불필요하다는 인쇄 업계 통념과 일치하나, 이 특정 수치의 2차 교차검증 출처는 확보하지 못함("출처 확인 실패" — 단일 출처).

---

## 5. 인포그래픽

### 5.1 결론: 인쇄 발주용 "표준 규격"은 존재하지 않는다

- "인포그래픽에 통일된 규격은 없다(no uniform infographic size)"는 것이 다수 출처에서 공통 결론 — [Venngage, Infographic Size Guide](https://venngage.com/blog/infographic-size-guide-web-social-print/) (접속 2026-07-20).
- 인쇄가 필요하면 **A4(210×297mm) 또는 US Letter(215.9×279.4mm)를 관행적으로 사용**하고, 300dpi로 export하는 것이 일반적 권장 — 동일 출처. A3(297×420mm)는 컨퍼런스 핸드아웃/포스터 겸용으로 언급됨.
- 즉 인포그래픽은 "고유 인쇄 규격"이 아니라 **문서/포스터 규격(A4·A3·Letter)을 차용**하는 방식이다. 레포의 `hasPrintSpecs()`가 인포그래픽에 규격을 정의하지 않은 현재 상태는 이 사실과 부합하며, 억지로 새 규격을 만들기보다 "인포그래픽은 문서 규격을 차용한다"를 명시하는 편이 근거에 맞다.

---

## 6. 해상도(DPI)와 mm↔px 환산

### 6.1 표준 요구치

- 인쇄 발주 시 일반 요구 해상도는 **300dpi**(소형~중형 포맷: 명함, A4, A2 이하 포스터) — [Venngage, Infographic Size Guide](https://venngage.com/blog/infographic-size-guide-web-social-print/) (접속 2026-07-20), [파란디자인, 포스터 사이즈 가이드](https://parancompany.co.kr/blog/poster-size-guide) (접속 2026-07-20).
- 대형 포맷(A1 이상)은 150~200dpi로 완화 가능 — 파란디자인(동일 출처, 4.4절 참조).

### 6.2 환산 공식

- `px = (mm / 25.4) × dpi` — [pixelcalculator.com](https://pixelcalculator.com/en/index.php), [cssunitconverter.com, MM to PX Converter](https://cssunitconverter.com/mm-to-pixels) (접속 2026-07-20, WebSearch 종합 결과에 두 출처 값이 일치).
- 검증 예시(WebSearch 결과 자체 계산): 300dpi 기준 1mm ≈ 11.81px. A4(210×297mm) → 2480×3508px. 85×55mm 명함 → 1004×650px(반올림).
- **레포 현재 좌표계와의 관계**: `print-spec.ts` 주석이 이미 "300dpi 기준 1mm ≈ 11.811px"를 명시하고 있으며 이는 본 리서치의 공식과 정확히 일치한다(`25.4mm/in ÷ 300dpi... ` 아님 — `300 / 25.4 = 11.811`, 계산 확인). 다만 현재 코드는 이 상수를 **실제 mm→px 절대 환산에는 쓰지 않고**, 종횡비 대조 + "짧은 변 대비 비율" 방식으로 도련/안전영역 px만 상대 환산한다(`safeAreaInsetPx`, `bleedPx` 함수, `print-spec.ts:79-91`). 즉 청사진의 논리 px 자체는 300dpi 절대 캔버스가 아니다(예: 명함 blueprint가 1050×600px인데 90mm×11.811=1063px로 정확히 일치하지 않음 — 청사진은 "논리 디자인 px"이고 실제 인쇄 export 시점에 별도 300dpi 래스터화가 필요하다는 뜻).

---

## 7. `@page` CSS (bleed, marks, size)

### 7.1 스펙 상태

- `@page`의 `size`, `bleed`, `marks` 서술자는 **CSS Paged Media Module Level 3**에 속하며, 이 스펙은 아직 W3C Working Draft(초안) 단계다 — [CSS-Tricks, bleed](https://css-tricks.com/almanac/properties/b/bleed/) (접속 2026-07-20).

### 7.2 브라우저 지원 — 사실상 없음

- `bleed`, `marks` 서술자는 **IE, Edge, Chrome, Firefox, Safari 데스크톱/모바일 전부 미지원**("No support in standard browsers") — [CSS-Tricks, bleed](https://css-tricks.com/almanac/properties/b/bleed/) (접속 2026-07-20).
- `@page { size: ... }`(용지 크기 지정 자체)는 2024년 말 기준 주요 브라우저가 지원한다는 별도 정보가 있으나, **Chrome의 GUI "인쇄" 대화상자는 CSS `size`를 무시하고 창 크기를 기준으로 PDF 페이지 크기를 정한다** — 반면 **headless Chrome(`--print-to-pdf`)는 CSS `size`를 실제로 반영한다** — [excessivelyadequate.com, Controlling the Settings in Chrome's Print Dialogue With CSS](https://excessivelyadequate.com/posts/print.html) (접속 2026-07-20 경유 WebSearch 요약), [andre.arko.net, Chrome "Print to PDF" and headless --print-to-pdf aren't the same!](https://andre.arko.net/2025/05/25/chrome-headless-print-to-pdf/) (접속 2026-07-20).
- Chrome은 crop marks(재단 표시)를 native print-to-PDF에서 **지원하지 않는다** — WebSearch 종합 결과, 2026-07-20 확인.

### 7.3 실제로 도련·재단 표시를 만들 수 있는 도구

| 도구 | `size` | `bleed` | `marks`(crop) | 비고 |
|---|---|---|---|---|
| Chrome GUI 인쇄 | 미반영 | 미지원 | 미지원 | 실사용 불가 |
| Chrome headless(`--print-to-pdf`) | 반영됨 | 미지원(확인 안 됨) | 미지원 | size만 신뢰 가능 |
| Prince XML(상용) | 지원 | 지원, 배경색/반복 이미지도 도련 영역까지 렌더 | 지원(crop/cross) | 가장 완전한 지원 |
| WeasyPrint(OSS, Python) | 지원 | **미지원** — 배경을 `@page` 크기에서 clip, 도련 영역 자체가 없음 | 미지원("Ignored marks: crop" 경고) | GitHub Issue #934, #471로 미해결 확인 |
| Paged.js(OSS, 브라우저 폴리필) | 지원 | 지원(bleed>0일 때 marks 렌더) | 지원(crop/cross) | 브라우저 위에서 동작하는 폴리필, 상용 대비 중간 수준 |

출처: [Prince, Paged Media 문서](https://www.princexml.com/doc/paged/) (접속 2026-07-20), [WeasyPrint GitHub Issue #934, Bleed & Page Backgrounds](https://github.com/Kozea/WeasyPrint/issues/934) (접속 2026-07-20), [WeasyPrint GitHub Issue #471, Support page marks and bleed](https://github.com/Kozea/WeasyPrint/issues/471) (접속 2026-07-20), [Paged.js, Web design for print](https://pagedjs.org/en/documentation/5-web-design-for-print/) (접속 2026-07-20), [DocRaptor, CSS Paged Media](https://docraptor.com/css-paged-media) (접속 2026-07-20).

### 7.4 레포에 대한 함의

- 레포가 HTML/CSS 기반 export를 print-ready PDF로 만들려면, **순정 Chrome/브라우저 CSS `@page`만으로는 도련·재단 표시를 표현할 수 없다**. 실제로 인쇄 발주 가능한 PDF를 만들려면 Prince(상용) 또는 Paged.js(OSS 폴리필) 같은 별도 렌더링 경로가 필요하고, WeasyPrint는 도련 자체를 지원하지 않으므로 배제해야 한다.
- 현재 도련/안전영역 계약(`print-spec.ts`)은 **디자인 시점 검증**(슬롯이 안전영역을 침범하는지, 배경이 도련까지 덮는지)이지 **최종 PDF 렌더링 시점의 CSS `bleed`/`marks` 서술자**가 아니다 — 이 구분을 레포 문서에 명시할 필요가 있다(즉 "우리가 검증하는 도련"과 "PDF 생성 시 실제로 도련을 표현하는 방법"은 다른 레이어).

---

## 8. 우리 레포에 무엇을 바꿔야 하는가

### 8.1 `catalog.ts`의 `SAFE_AREA_INSET = 24`(px 고정값)

- **문제**: 포맷·규격과 무관한 단일 px 값. 명함(3mm)과 포스터(15mm 권장)가 5배 차이 나는데 하나의 상수로는 둘 다 정확히 표현 불가능. 또한 24px가 어떤 mm 근거에서 나온 값인지 코드에 근거가 없다(역산: 명함 blueprint 1050×600px 기준, 짧은 변 600px가 실제 90mm 또는 50mm 어느 쪽에 대응하는지 정의가 없으면 24px→mm 환산이 애매함).
- **영향 범위**: `catalog.ts`의 `validateFormatIntegrity`가 이 상수로 모든 포맷(명함/포스터/인포그래픽)에 획일적 안전영역 검사를 적용 중. `print-spec.ts`는 이미 명함에 한해 `safeAreaMm: 3` → `safeAreaInsetPx()`로 규격별 환산을 정확히 구현해 놓았으나, 이 정확한 계산은 `hasPrintSpecs()`가 `business-card`에만 `true`를 반환하므로 포스터/인포그래픽에는 적용되지 않는다.
- **바꿀 방향**: `SAFE_AREA_INSET` 같은 포맷 무관 고정 px 상수를 없애고, `print-spec.ts`의 규격별 mm 정의 + `safeAreaInsetPx()` 패턴을 포스터에도 확장한다. 단, 포스터는 "안전영역(재단 오차 대비)"과 "게시 여백(15mm, 클립 등에 안 가려지게)"이 서로 다른 목적의 수치라는 게 2.2절에서 확인됐으므로, 이름을 구분해서 인코딩해야 한다(예: `safeAreaMm`와 `postingMarginMm`을 별개 필드로).

### 8.2 포스터 규격 프리셋 신규 추가

- **바꿀 내용**: `printSpecs`에 A계열(A3/A2/A1, 비율 1:1.414 공통) 프리셋 추가. 도련은 명함과 동일하게 3mm(4.1/1.1절 근거)로 통일 가능. 안전영역은 "재단 오차 대비"(추정 3mm, 명함과 동일 원칙 적용 가능하나 포스터 전용 1차 출처는 확인 못함 — "출처 확인 실패", 명함 원칙을 유추 적용하려면 그 사실을 명시해야 함)와 "게시 여백"(15mm, 4.1절 출처 있음)을 구분해 필드화.
- **영향 범위**: `matchPrintSpec()`은 종횡비만 보므로 A계열(1.414)을 추가하면 현재 `product-poster-hero`(1080×1350, 0.8)는 어느 것과도 안 맞아 `null`을 반환한다 — 이는 4.4절에서 확인한 사실(현재 캔버스가 인쇄 표준이 아님)과 일치하는 정확한 동작이다. 인쇄용 포스터 blueprint를 새로 만들 경우에만 A계열 프리셋이 매칭된다.

### 8.3 인포그래픽

- **바꿀 내용**: 인포그래픽 전용 규격을 새로 만들지 않는다(5.1절 — 업계에 고유 규격이 없음이 확인됨). 대신 "인포그래픽은 A4/A3 문서 규격을 차용한다"는 사실을 `print-spec.ts` 주석 또는 별도 문서에 명시하고, 필요 시 A4/A3 프리셋(8.2절에서 추가하는 A계열과 공유 가능)을 인포그래픽 포맷에도 매칭 대상으로 연결한다. `hasPrintSpecs('infographic')`을 `true`로 바꾸되 "포스터와 규격을 공유"라는 관계를 명시해야 근거 있는 변경이 된다.

### 8.4 px 좌표계와 mm 계약의 연결(가장 중요한 구조적 갭)

- **현재 상태**: 6.2절에서 확인했듯 `print-spec.ts`는 mm→px를 **절대 환산이 아니라 "짧은 변 대비 비율"로만** 쓴다. 즉 청사진 1050×600px가 실제로 몇 mm짜리 캔버스인지는 코드 어디에도 정의돼 있지 않고, 오직 종횡비 매칭(`matchPrintSpec`)으로 "이 청사진이 어떤 규격에 해당하는가"만 간접 추론한다.
- **문제**: 이 방식은 도련/안전영역의 **비율**은 정확히 지키지만, 최종 300dpi 인쇄 PDF를 만들 때 "이 1050px가 실제로 몇 mm인가"를 알 방법이 없다. 명함 청사진 1050×600px를 90mm×11.811px/mm=1063px로 스케일할지, 85mm×11.811=1004px로 스케일할지가 코드에 명시돼 있지 않다(현재는 둘 다 종횡비만으로 매칭되므로 두 규격에 다 "맞을 수" 있어 모호함).
- **바꿀 방향**: 청사진 타입에 "이 blueprint가 어떤 규격의 논리 px인지"를 명시하는 필드(예: `printSpecId` 또는 `mmPerPx` 스케일 팩터)를 추가해, export 시점에 `px_actual = px_logical × (trim_mm / logical_short_edge_px) × (dpi / 25.4)` 같은 명시적 환산이 가능하게 해야 한다. 이는 코드 변경이 필요한 설계 판단이므로 이 리서치의 범위 밖이며 TH11 설계 시 별도로 다뤄야 한다.

### 8.5 `@page` CSS 채택 여부

- **바꿀 내용**: 만약 레포가 HTML/CSS를 PDF export 경로로 쓴다면(현재 export 파이프라인 구현은 이 리서치에서 확인하지 않음), 순정 브라우저 `@page bleed/marks`에 의존해서는 안 된다(7.2절). 도련이 실제로 필요한 export라면 Paged.js(OSS, 라이선스 무료) 도입을 검토하거나, 도련 없이 "재단선까지 배경을 채운 고정 크기 PDF"만 만들고 실제 도련 확장은 인쇄소 측 처리에 맡기는 방식(도련 없는 완성 사이즈 export + 규격 문서에 명시)이 대안이다. 이 판단은 export 파이프라인 코드를 봐야 확정할 수 있어 이 리서치 범위 밖이다.

---

## 9. 확정 사실 vs 확정 못 한 것 요약

### 확정 사실
- 한국 명함/포스터 도련 = 사방 3mm (2개 이상 출처, 상호 일치)
- 명함 안전영역 = 재단선 안쪽 3mm (2개 이상 출처 일치)
- 포스터 게시 여백 권장 = 15mm, 면적 30~40% (단일 출처)
- 한국 명함 두 표준(90×50mm / 85×55mm)과 미국(3.5×2in=88.9×50.8mm) 비율이 서로 다름
- A계열 포스터 mm 수치(A0~A3) — 국제 출처 1건 + 한국 출처 2건 교차검증 일치
- 인포그래픽은 고유 인쇄 규격이 없고 A4/Letter/A3를 차용 (1개 명시적 출처, 업계 통설)
- 300dpi가 표준 인쇄 요구 해상도, mm→px = mm/25.4×dpi 공식 (2개 이상 출처 일치)
- 대형 포스터(A1+)는 150~200dpi로 완화 가능 (단일 출처)
- `@page` `bleed`/`marks`는 모든 주요 브라우저 미지원, Chrome GUI 인쇄는 `size`도 무시, headless Chrome은 `size`만 반영 (복수 출처)
- Prince=완전 지원, WeasyPrint=도련 미지원, Paged.js=폴리필로 지원 (각 도구 공식 문서/이슈트래커로 확인)

### 확정 못 한 것 ("출처 확인 실패")
- 포스터 전용 "재단 오차 대비 안전영역" 수치(명함의 3mm과 별개로 포스터에 특화된 값) — 15mm는 게시 여백이지 재단 오차 대비 값인지 불명확
- 국전지/사륙전지(B계열) 원지 규격의 1차 출처 상세(간접 WebSearch 종합만 확보, 개별 사이트 직접 인용 실패)
- 현재 `SAFE_AREA_INSET = 24`(px)가 어떤 mm 근거로 정해졌는지(레포 히스토리 미조사 — 코드 주석에 유도 과정 없음)
- Chrome headless가 `bleed` 서술자 자체를 반영하는지 여부(=`size`만 반영 확인, `bleed` 반영 여부는 별도 확인 못함)

---

## Changelog
- 2026-07-20: 최초 작성.

# 리서치: 편집기에서 "토큰에 묶인 색"을 사람이 고치는 UI

- 작성일: 2026-07-21
- 목적: AskewlyDesign 편집기 인스펙터가 `Token · fill` 자유 텍스트 입력 하나만 제공하는 문제(색 견본 없음, 토큰 목록 없음, 자동완성 없음, 바인딩 없는 노드는 색 변경 경로 자체 없음)를 고치는 horizon 설계 입력. 결론 없음 — 비교 자료만 정리.
- 규율: 모든 인용에 출처 URL + 접근일(2026-07-21) 표기. 스크린샷 확인 불가 항목은 "문서로 확인 불가"로 명시. 추정 금지 — 확인 못하면 "확인 실패"로 남김.

---

## 비교 축 요약표

| 축 | Figma Variables | Penpot (Assets vs Tokens) | Framer Variables | Webflow Variables | Tokens Studio (Figma 플러그인) |
|---|---|---|---|---|---|
| 라벨 | Fill / Stroke | Fill / Stroke (Design 사이드바) | Fill(속성 패널) | Style panel의 색 필드 | Token 이름 자체(플러그인 패널) |
| 기본 컨트롤 | 스와치 클릭 → 패널 | 스와치 + hex 입력 겸용 | 속성 옆 "+"로 변수화 | 스와치(purple dot로 바인딩 표시) | 플러그인 사이드바의 별도 Value input + 왼쪽 스와치 |
| 토큰 목록 노출 | Libraries 탭 팝오버, 검색 가능 | Assets 탭(에셋) / Tokens 탭(토큰), 점표기 그룹 폴더 | 드롭다운(속성 패널) | Style panel 내 드롭다운/모달 | 플러그인 패널 리스트/그리드 뷰, 우클릭 메뉴 |
| 미바인딩 상태에서 새로 묶는 경로 | "Apply styles and variables" 버튼 | 에셋 탭 클릭 적용 / 토큰 탭 우클릭 → Fill 적용 | 속성 옆 "+" 아이콘 | 스와치의 보라 점 클릭 | 토큰 이름 직접 클릭 또는 우클릭 메뉴 |
| 원시 hex와 공존 방식 | 확인 실패 — 문서로 미확인 | 같은 컬러피커 안에서 HEX/RGB/HSB/HSL 입력 + 라이브러리 탭 전환 | 확인 실패 — 문서로 미확인 | 컬러 피커로 값 직접 지정 가능(변수 값 편집 모달에서) | 컬러피커가 Value input 옆에 있어 원시값 입력 가능 |
| 바인딩 상태 시각 표시 | 변수=사각형 스와치, 스타일=원형 스와치(구분) | 에셋=원형 스와치+색 이름, 토큰=둥근 사각형 스와치+토큰 이름("token pill") | 확인 실패 — 문서로 미확인 | 바인딩된 필드는 보라색(purple)으로 하이라이트 | 토큰 적용 시 레이어에 토큰명 매핑(문서로 시각 세부 미확인) |
| 깨진/누락 바인딩 표시 | 확인 실패 — 문서로 미확인 | 폰트 토큰 사례로 "Missing font" 메시지 확인 — 색 토큰도 유사할 것으로 보이나 문서로 직접 미확인 | 확인 실패 | 확인 실패 | 확인 실패 |
| 해제(unbind) 경로 | 스와치 위 hover → "Detach variable" 아이콘 | 토큰 pill의 메뉴에서 detach | 확인 실패 | 확인 실패 | 확인 실패 |
| 모드(라이트/다크) 전환 | Modes 기능 존재(문서 목차상) — 바인딩된 fill에 미치는 구체 UI 효과는 확인 실패 | 문서에 "themes" 언급되나 색 전환 UI 세부는 확인 실패 | 해당 문서 없음 | 해당 문서 없음 | 해당 문서 없음(플러그인은 Figma variables/themes에 위임) |

---

## 1. Figma Variables

### 기본 흐름
- Fill 또는 Stroke 섹션에서 **"Apply styles and variables"**를 클릭해 변수 피커를 연다.
  출처: https://help.figma.com/hc/en-us/articles/15343107263511-Apply-variables-to-designs (접근일 2026-07-21)
- 컬러 스와치를 클릭하고 **Libraries 탭**을 열어 변수를 선택하는 경로도 있다. 검색창에서 **변수 이름 또는 변수 그룹**으로 검색 가능.
  출처: 위와 동일 검색 스니펫 (WebSearch 결과, 2026-07-21 접근)
- **변수(square swatch)**와 **스타일(circle swatch)**을 스와치 모양으로 구분해서 보여준다 — 즉 같은 목록 안에서도 "이건 변수, 이건 스타일"을 형태로 구분.
  출처: WebSearch 스니펫 기반, 원문 페이지 위와 동일 (2026-07-21)

### 편집 진입점
- 변수가 바인딩된 Fill의 스와치를 클릭하면 미리보기와 함께 **Edit Variable** 버튼이 뜨고, 이걸 누르면 Variables 탭으로 이동한다.
  출처: https://help.figma.com/hc/en-us/articles/15343107263511-Apply-variables-to-designs (WebSearch 스니펫, 접근일 2026-07-21)
- 반례: 포럼 스레드에서는 사용자가 "fill/stroke에서 바로 변수 정의로 점프하는 기능이 없다"고 불만을 제기하며, "Detach Variable"과 "Remove"는 있지만 "go to Variable in the Library" 옵션은 없다고 확인. 즉 공식 도움말과 실사용자 경험이 다소 어긋난다 — 버전/기능 롤아웃 차이일 수 있음.
  출처: https://forum.figma.com/ask-the-community-7/how-to-find-edit-variable-directly-from-fill-stroke-etc-38226 (접근일 2026-07-21)

### 해제
- 관련 우측 패널 섹션에서 변수 위에 hover → **Detach variable** 아이콘 클릭.
  출처: https://help.figma.com/hc/en-us/articles/15343107263511-Apply-variables-to-designs (접근일 2026-07-21)

### 확인 실패 항목
- 바인딩 안 된 기본 상태(hex 텍스트만 vs 스와치만)의 정확한 모습.
- 모드(라이트/다크) 전환이 실제로 fill 컨트롤 위에서 어떻게 보이는지(색이 즉시 바뀌는지, 모드 이름이 뱃지로 뜨는지).
- 깨진 변수 참조(라이브러리 삭제 등)의 시각 표시.
- 이 세 가지는 Figma Help Center 문서 텍스트로는 서술되지 않음 — 스크린샷 확인이 필요하나 이 세션에서는 불가.

---

## 2. Penpot

Penpot은 **에셋 컬러(Asset colors)**와 **컬러 토큰(Color tokens)**을 별개 시스템으로 유지한다는 점이 특징 — 나중에 하나로 합칠 수도 있는 로드맵이지만 현재는 병존.
출처: https://penpot.app/blog/penpot-deep-dive-color-tokens-vs-asset-colors/ (접근일 2026-07-21)

### 에셋 컬러(레거시에 가까운 경로)
- Assets 탭에서 컬러를 클릭 → 선택된 오브젝트의 fill에 적용. **Alt+클릭**하면 stroke에 적용.
  출처: https://help.penpot.app/user-guide/libraries/ (WebSearch 스니펫, 접근일 2026-07-21)
- 적용되면 디자인 패널에 "사각형 hex 스와치" 대신 **원형 스와치 + 컬러 이름**이 표시된다.
  출처: https://penpot.app/blog/penpot-deep-dive-color-tokens-vs-asset-colors/ (접근일 2026-07-21)

### 컬러 토큰(신규 표준 경로)
- Design 사이드바의 컬러 필드에서 **토큰 컨트롤을 클릭**하면 활성 세트/테마에 속한 적용 가능 토큰 목록이 뜬다.
  출처: https://help.penpot.app/user-guide/design-systems/design-tokens/ (접근일 2026-07-21)
- 또는 Tokens 탭에서 토큰 이름 **우클릭 → Fill/Stroke 적용**.
  출처: 위와 동일
- 토큰 이름은 점표기(`color.primary.default` 등)로 짓고, Penpot이 이를 **중첩된 접이식 폴더 구조**로 자동 그룹핑한다 — 이름 자체가 IA 역할.
  출처: 위와 동일
- 적용되면 "사각형 hex 스와치" 대신 **둥근 사각형 스와치 + 토큰 이름**("토큰 pill")이 표시된다. 에셋(원형)과 토큰(둥근 사각형)의 스와치 모양이 서로 다르다 — Figma의 변수/스타일 구분과 유사한 전략.
  출처: https://penpot.app/blog/penpot-deep-dive-color-tokens-vs-asset-colors/ (접근일 2026-07-21)

### 해제/원시값 병행
- 토큰 pill의 메뉴에서 **detach**하면 다시 커스텀 값(원시 hex)을 쓸 수 있다.
  출처: 위와 동일
- 컬러 피커 자체는 스포이드, 색 모델(RGB/Harmony Wheel/HSV), **HEX/RGB/HSB/HSL 입력 전환**, "Libraries" 섹션(최근 색상 ↔ 라이브러리 전환)을 모두 한 팝오버 안에 갖는다 — 즉 원시 hex 입력과 라이브러리/토큰 선택이 탭 전환으로 공존.
  출처: https://help.penpot.app/user-guide/designing/color-stroke/ (접근일 2026-07-21)

### 확인 실패 항목
- 컬러 토큰 피커에 검색창이 있는지 — 문서에 명시 없음.
- 컬러 토큰 자체가 깨졌을 때(참조 삭제 등)의 표시 — 문서는 폰트 토큰 사례("Missing font")만 예시로 들었고 색 토큰 사례는 직접 서술하지 않음.

---

## 3. Framer Variables

- Framer는 색·숫자·반응형 값을 모두 **Variables**로 취급하며 이것이 사실상 토큰 시스템이다.
  출처: https://www.framer.com/dictionary/design-tokens (접근일 2026-07-21)
- 변수를 만든 뒤에는 속성 패널의 **드롭다운 메뉴**에서 선택해 요소에 참조시킨다.
  출처: 위와 동일 WebSearch 종합
- 새로 변수화하는 경로: 요소/속성을 선택 → 속성 옆 **"+" 아이콘** 클릭 → 이름 지정.
  출처: https://launchnow.design/blog/how-to-use-framer-variables-for-dynamic-design (WebSearch 스니펫, 접근일 2026-07-21)
- 색 변수 이름은 `primary`, `error` 같은 시맨틱 네이밍을 지원.
  출처: https://www.framer.com/dictionary/color-variable (접근일 2026-07-21)
- 코드 컴포넌트 연동 시, 컬러/섀도 변수를 연결하면 문자열이 아니라 `{ "value": "#000000" }` 형태 객체로 전달된다 — 즉 "토큰 이름"과 "해석된 값"을 객체 형태로 함께 들고 다닌다는 신호지만, 이건 개발자용 코드 컴포넌트 계약이지 디자이너용 UI 설명은 아니다.
  출처: 위와 동일

### 확인 실패 항목
- 기본 fill 컨트롤이 스와치인지 텍스트인지.
- 변수 선택 드롭다운에 검색/그룹 표시가 있는지.
- 바인딩 상태의 시각적 구분(색, 아이콘 등).
- 해제(unbind) 경로.
이 네 가지는 공식 문서 텍스트에서 다루지 않아 확인 실패로 남김 — Framer 공식 문서(`framer.com/developers`, `framer.com/dictionary`)는 개념 설명 위주이고 UI 워크플로우 스크린샷 문서가 검색으로는 나오지 않음.

---

## 4. Webflow Variables

- Variables(=디자인 토큰)는 색, 타이포, 스페이싱 같은 스타일 값의 최소 단위.
  출처: https://webflow.com/webflow-way/design-systems/variables (접근일 2026-07-21)
- 컬러 변수 사용법: 스와치 좌상단의 **보라 점(purple dot)**을 클릭하면 바인딩 인터페이스가 열리고, 거기서 컬러 피커로 값을 고를 수 있다.
  출처: https://help.webflow.com/hc/en-us/articles/33961268146323-Variables (WebSearch 스니펫, 접근일 2026-07-21)
- Style 패널에서 변수가 적용된 필드는 **보라색으로 하이라이트**되어 "이 값은 변수에 묶여 있다"는 걸 표시한다.
  출처: 위와 동일
- 필드 위에 hover → **연필(pencil) 아이콘** 클릭 → 변수 편집 모달이 열린다(이름·값을 그 자리에서 바로 수정 가능).
  출처: 위와 동일
- 그룹핑은 네이밍 컨벤션(`그룹명/변수명`, 예: `Colors/Red`, `Colors/Blue`)으로 이뤄진다 — Penpot의 점표기 자동 그룹핑과 유사한 발상이지만 Webflow는 슬래시(`/`) 구분자를 쓴다.
  출처: 위와 동일

### 확인 실패 항목
- 변수 선택 드롭다운/모달 안에 검색창이 있는지.
- 미바인딩 상태에서 새로 묶는 정확한 어포던스(보라 점 외에 다른 경로가 있는지).
- 깨진 참조 표시.

---

## 5. Tokens Studio (Figma 플러그인) — 사실상 업계 표준 중 하나

- 플러그인 패널에서 컬러 토큰 이름을 **우클릭**하면 어떤 속성(fill/stroke 등)에 적용할지 메뉴가 뜬다. 이름을 **그냥 클릭**하면 기본으로 fill에 적용된다.
  출처: https://docs.tokens.studio/manage-tokens/apply (WebSearch 스니펫, 접근일 2026-07-21)
- 토큰 생성/편집 폼에서는 **Value input 왼쪽의 스와치**를 클릭하면 컬러 피커가 열린다 — 즉 "토큰 이름 자체를 편집하는 화면"에 원시값 입력이 붙어 있는 구조.
  출처: https://docs.tokens.studio/manage-tokens/token-types/color/ (WebSearch 스니펫, 접근일 2026-07-21)
- Tokens 페이지에서 **리스트 뷰 ↔ 그리드 뷰** 토글이 있어, 토큰 이름 위주로 볼지 스와치 위주로 볼지 전환 가능.
  출처: 위와 동일

### 특징
Tokens Studio는 Figma 네이티브 변수 패널이 아니라 **플러그인 자체 사이드바**에서 토큰 목록·검색·적용을 전부 처리하고, 최종적으로 Figma 레이어에는 (플러그인 데이터로) 토큰명이 매핑된다. Figma 네이티브 Variables가 나온 이후 Tokens Studio도 네이티브 변수와 동기화하는 기능을 갖췄다고 알려져 있으나, 이 동기화 UI의 세부는 이번 검색 범위에서 확인하지 못함(확인 실패).

### 확인 실패 항목
- 플러그인 패널 검색창의 정확한 동작(그룹 검색 지원 여부).
- 레이어에 토큰이 적용된 뒤 Figma 네이티브 우측 패널에 어떻게 반영되는지(스와치 모양 등) — 플러그인이 네이티브 UI를 대체하는지 별도로 얹는지 문서로 명확히 구분되지 않음.

---

## 종료 사유

새 소스 검색(Figma Guide to variables 재확인, Penpot color-stroke 페이지)에서 이전 소스와 겹치는 사실만 확인되고 새로운 사실이 추가되지 않아 포화로 판단, 종료.

---

## AskewlyDesign로 옮길 때 걸리는 지점 (관찰, 결론 아님)

- 다섯 시스템 모두 공통으로 **"스와치 모양 자체가 바인딩 종류를 말한다"**는 전략을 쓴다(Figma: 사각형=변수/원형=스타일, Penpot: 원형=에셋/둥근사각형=토큰). AskewlyDesign 인스펙터는 현재 스와치가 아예 없다 — 이 축이 통째로 비어 있다는 뜻.
- 다섯 시스템 모두 **"바인딩 없는 상태에서 새로 묶는 명시적 어포던스"**를 갖는다(버튼, +아이콘, 보라 점, 우클릭 메뉴 등). AskewlyDesign은 이 경로가 아예 없다고 배경에 적혀 있음 — 즉 "리서치가 확인한 5개 사례 전부와 달리, 우리는 미바인딩 노드에 진입점이 없다"가 갭.
- Penpot·Webflow는 **점표기/슬래시 네이밍을 그룹 UI로 자동 변환**한다 — 토큰 이름 컨벤션 자체가 IA 설계에 영향을 준다는 점은 토큰 네이밍 규칙을 정할 때 같이 고려할 부분.
- Figma는 원시값과 토큰 바인딩의 공존을 "Detach"로 명확히 분리하는 반면, Penpot은 같은 컬러피커 팝오버 안에서 탭 전환으로 공존시킨다 — 두 모델이 다르다는 점은 설계 시 택일해야 할 지점.
- "묶여있음"을 알리는 시각 신호로 Webflow는 색상(보라 하이라이트), Figma/Penpot은 스와치 모양+라벨을 쓴다 — 색상 신호는 라이트/다크 테마에서 대비 문제가 생길 수 있어 스와치+라벨 쪽이 더 견고해 보이지만 이건 관찰이지 검증된 결론은 아님.

# 캔버스 편집 UI 리서치 — Figma / Framer / Penpot 비교

- 작성일: 2026-07-20
- 소비처: ui-dictionary `AskewlyDesign` 편집기 UI 재설계 horizon 기획
- 목표: 캔버스 조작감(선택·핸들·스냅·이동/리사이즈 피드백)과 화면 읽힘(레이어·인스펙터 정보구조)의 구체적 메커니즘을 근거 기반으로 정리

## 조사 범위·방법

- 대상: Figma(공식 Help Center 1차), Framer(공식 Help Center/Academy 1차, 텍스트 문서 한계 있음), Penpot(공식 Help Center 1차 — 오픈소스 구현 참고용)
- 방법: WebSearch로 후보 문서 탐색 → WebFetch로 공식 문서 원문 확인·인용. 스크린샷/실물 조작은 하지 않았고(도구 미접속), 모든 메커니즘 서술은 공식 문서 텍스트에 근거한다.
- 원칙: 수치·정확한 동작이 출처에 없으면 "출처 확인 실패"로 명시하고 추정하지 않는다.

---

## 1. Figma

### 1.1 선택·리사이즈·회전

- 선택된 레이어의 바운딩 박스에는 리사이즈 핸들이 4변 + 4모서리에 존재한다: "To adjust the width of a layer: hover over the layer's left or right bounds" / "To adjust the height... top or bottom bounds" / "To adjust both width and height: hover over any corner." 즉 변 4개는 단축(폭 또는 높이만), 모서리 4개는 양축 동시 리사이즈. (출처: [Adjust alignment, rotation, position, and dimensions](https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions), 접근일 2026-07-20)
- 회전 핸들은 리사이즈 핸들과 별도 위치에 있다: "Hover just outside one of the layer's bounds until the icon appears" — 즉 바운딩 박스 모서리의 **바깥쪽**(핫존)에서만 회전 커서가 뜬다. 정확한 px 폭은 문서에 없음(출처 확인 실패). (동일 출처)
- 모디파이어 키:
  - 리사이즈 중 종횡비가 잠겨 있으면 Ctrl(⌃)을 눌러 일시 해제, 잠금 해제 상태면 Shift로 일시 잠금.
  - Shift+드래그: 회전 15도 단위 스냅.
  - Option/Alt: 중심점 기준 리사이즈(양쪽 변 동시 이동). Shift+Option/Alt 동시: 중심 기준 + 종횡비 유지 결합. (출처: WebSearch 종합, 원문은 [Adjust alignment...](https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions) 및 관련 포럼 교차확인 — 포럼(2차 출처)만 확인된 부분은 "Ctrl+Alt로 프레임을 중심 기준 비례 스케일"이며 이는 2차 출처로 표시)
- 종횡비 잠금: 레이어 선택 후 우측 사이드바 "Lock aspect ratio" 토글. 활성화 시 W/H 중 하나를 바꾸면 다른 값이 비례 갱신. (동일 출처)
- **AskewlyDesign 함의**: 변 핸들(단축)과 모서리 핸들(양축)을 시각적으로 구분하고, 회전은 모서리 바깥의 별도 핫존으로 분리하면 "리사이즈인지 회전인지 커서 전에 못 알아본다"는 문제를 줄일 수 있다. Option/Alt 중심 리사이즈는 컴포넌트 균형 조정(패딩 좌우 대칭 등)에 유용해 우선순위 있는 모디파이어다.

### 1.2 스마트 가이드·스냅·측정

- 스마트 가이드(정렬 가이드)는 이동 중 다른 오브젝트와 유사한 간격일 때 나타난다: "Smart guides appear when you are moving an object to the distance that is similar to the distance between other objects... the measurement line will be shown and the object will snap to this measurement." (출처: [Measure distances between layers](https://help.figma.com/hc/en-us/articles/360039956974-Measure-distances-between-layers), 접근일 2026-07-20)
- 거리 측정은 기본적으로 **모디파이어 키 + 호버**로 트리거된다: 첫 오브젝트를 선택한 뒤 Option(Mac)/Alt(Win)를 누른 채 두 번째 오브젝트를 호버하면 "Figma will display a red line between the two objects, as well as horizontal and vertical measurements." 중첩 레이어(프레임/그룹 내부)를 측정할 때는 Cmd+Option(Mac)/Ctrl+Alt(Win) 조합이 필요하다. (동일 출처)
- 측정은 **바운딩 박스 기준**이다: "Figma will measure the distances between the bounds of each object — the bounding box that surrounds an object or layer" — 따라서 스트로크·텍스트 베이스라인·비정형 폴리곤의 시각적 가장자리와 다를 수 있다는 점을 문서가 명시한다. (동일 출처)
- 열람 권한만 있어도(can view) 일반 모드 측정은 가능하지만, Vector 모드 측정은 편집 권한(can edit)이 필요하다. (동일 출처)
- 정확한 px 배지 렌더링 규격(폰트 크기, 배경색 등)은 문서에 없음 — **출처 확인 실패**.
- **AskewlyDesign 함의**: "이동 중 자동 스냅+빨간 라인"과 "모디파이어+호버로 임의 두 오브젝트 간 거리 측정"은 서로 다른 기능이다. 캔버스가 두 상호작용을 분리해서 제공하면(드래그 중 자동 가이드 vs 정적 상태에서 모디파이어로 측정), 사용자가 "지금 뭘 보고 있는지" 헷갈리지 않는다. 측정이 바운딩 박스 기준이라는 규약은 우리 CanvasDocument의 좌표 모델과 일치시켜야 값이 어긋나지 않는다.

### 1.3 레이어 패널 정보구조

- 좌측 사이드바는 자식 오브젝트를 부모 그룹/프레임 안에 중첩(nest)하며 접고 펼 수 있다: "Figma nests any child objects within their parent group or frame. This allows you to collapse and expand layers within a group or Frame." (출처: [Explore the navigation bar and left sidebar](https://help.figma.com/hc/en-us/articles/360039831974-Explore-the-navigation-bar-and-left-sidebar), 접근일 2026-07-20)
- 레이어 타입별 아이콘이 존재: Frame, Group, Component, Instance, Text, Shape(타입별 상이), Image, Auto layout, Section, Animated GIF/video, Slot. 아이콘의 시각적 세부(색상·형태 규칙)는 문서에 텍스트로만 나열되어 있고 스타일 규격은 없음 — **출처 확인 실패**(디자인 규격 자체).
- Find 기능으로 텍스트/이미지/프레임/컴포넌트 등을 파일 전체에서 검색·치환 가능.
- "Highlight layers on hover"는 Menu > Preferences에서 켜는 옵션으로, 캔버스에서 호버한 레이어를 레이어 패널에서 강조하는 기능이지만, 반대 방향(캔버스 선택 → 레이어 패널 자동 스크롤/하이라이트)이 항상 켜져 있는지 문서에 명시되어 있지 않음 — **출처 확인 실패**.
- 레이어 패널 우상단 "Collapse layers" 버튼으로 전체 접기(단, 선택된 항목의 부모 경로는 펼침 유지).
- **AskewlyDesign 함의**: 아이콘 체계(타입별 고유 아이콘)와 접기/펼치기가 "레이어가 뭔지 한눈에 안 들어온다"는 현재 문제의 핵심 해법 후보다. 특히 "선택된 레이어의 부모 경로는 펼침 유지"는 깊이 중첩된 트리에서 미아가 되는 것을 막는 장치로 이식 가치가 크다.

### 1.4 속성 인스펙터 구조

- 우측 사이드바(Properties panel)는 Design/Prototype 두 탭 구조(편집 권한 기준; 열람 전용은 Comment/Properties 탭). (출처: [Design, prototype, and explore layer properties in the right sidebar](https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-explore-layer-properties-in-the-right-sidebar), 접근일 2026-07-20)
- Design 탭 섹션 순서(문서 목차 기준): Alignment/rotation/position → Frame size and orientation → Corner radius → Constraints → Layout guides → Component properties → Instance → Auto layout → Blend Modes → Text → Fill → Stroke → Effects → Export settings. 즉 **기하(위치/크기) → 구조(오토레이아웃/컴포넌트) → 시각(텍스트/Fill/Stroke/Effects) → 내보내기** 순으로 상단에 조작 빈도 높은 기하 속성이 온다.
- "Property labels" 토글(줌 퍼센트 옆 드롭다운)로 값 필드에 라벨을 붙일 수 있다는 사실은 명시되어 있으나, 기본 상태에서 라벨이 꺼져 있고 아이콘만 보이는지 여부, 숫자 필드의 드래그 스크럽 입력 지원 여부는 문서에 없음 — **출처 확인 실패**.
- **AskewlyDesign 함의**: 인스펙터 섹션 순서를 "기하 → 구조 → 시각 → 내보내기"로 고정하면 사용자가 매번 같은 위치에서 원하는 속성을 찾는다. 현재 AskewlyDesign 인스펙터가 이 순서를 안 지키고 있다면 재배치가 저비용 개선점이다.

### 1.5 캔버스 밖 UI (툴바)

- 툴바는 도구 접근 허브: "The toolbar is your hub for interacting with — and adding objects — to the canvas." Move 툴이 파일을 열면 기본 활성. Frame 툴 단축키는 F 또는 A. Text 단축키 T. Hand 툴은 스페이스바 홀드로 임시 활성화. Dev Mode는 Shift+D. (출처: [Access design tools from the toolbar](https://help.figma.com/hc/en-us/articles/360041064174-Access-design-tools-from-the-toolbar), 접근일 2026-07-20)
- 툴바가 화면 상단인지 하단인지는 공식 문서 원문에 명시적 단정이 없었다(WebSearch 요약에서는 "현재 UI3에서 하단"이라는 서술이 있었으나 이는 2차 출처 기반이며 공식 문서 원문에서 직접 인용 확인은 실패했다) — **출처 확인 실패**(정확한 배치 위치의 1차 출처).
- **AskewlyDesign 함의**: 툴 전환 단축키를 도구 카테고리별로 일관되게(예: 알파벳 첫 글자) 배정하면 학습 비용이 준다.

---

## 2. Framer

Framer 공식 문서는 Figma에 비해 **캔버스 저수준 상호작용(핸들 개수, 스냅 판정 규칙, 측정 배지 규격)을 텍스트 문서로 노출하지 않는다.** Academy 레슨 다수가 동영상 중심이라 WebFetch로 텍스트 본문을 확인할 수 없었다. 아래는 확인 가능했던 항목만 정리하고 나머지는 명시적으로 실패 처리한다.

### 2.1 확인된 것

- 인터페이스는 3영역 구조: "the canvas (center) where you design, the layers panel (left) showing your page structure, and the properties panel (right) for styling and settings." (출처: [Framer Academy: Interacting with layers](https://www.framer.com/academy/lessons/framer-fundamentals-interacting-with-layers) 페이지 메타 설명, 2차 성격 — 레슨 본문 자체는 영상이라 미확인. 접근일 2026-07-20)
- 레이어 패널은 브라우저 DOM 인스펙터와 유사한 트리 구조: "Every visual element placed on a Framer page appears in the layers panel on the left side of the editor, showing the document tree with parent elements containing children, much like the DOM tree in a browser inspector." 이름변경·순서변경·숨김·잠금·그룹/그룹해제가 모두 이 패널 하나에서 이뤄진다. (출처: [Framer Layers Panel: A Complete Guide](https://framerwebsites.com/blog/framer-layers-panel-guide), **2차 출처** — 공식 Academy 레슨 본문 텍스트를 직접 확인하지 못해 2차임을 명시. 접근일 2026-07-20)
- 레이아웃 가이드(그리드): Framer 로고 메뉴 → View → Show Guides로 표시. 브레이크포인트를 선택해야만 가이드 옵션이 나타나며, 각 브레이크포인트는 독립적인 grid type(columns/rows)·gap·margins·width 설정을 가진다. 가이드는 퍼블리시된 사이트에는 나타나지 않는 편집기 전용 요소다. (출처: [Framer Help: Adding a layout grid](https://www.framer.com/help/articles/layout-grids/), 접근일 2026-07-20)
- 캔버스 패닝/줌: Space+드래그(마우스) 또는 트랙패드 제스처로 패닝, 기본 줌 100%, Cmd/Ctrl + / − 로 줌 조절. 캔버스 도구(선택/패닝/코멘트)는 "bottom toolbar"에 위치. (출처: [Framer Help: Using the canvas](https://www.framer.com/help/articles/how-to-use-the-canvas/), 접근일 2026-07-20)
- 종횡비 잠금 없이 리사이즈, 워크스페이스 라이브러리 컴포넌트 삽입, 겹친 레이어 선택, 가시성 토글, 스택 내 위치 관리, reparenting 제어, 레이어 auto-fit, 프레임 unwrap 등을 다루는 "8 Framer shortcuts to learn" 레슨이 존재하나 **실제 키 조합은 텍스트로 노출되지 않음**(영상 레슨). (출처: [Framer Academy: 8 Framer shortcuts to learn](https://www.framer.com/academy/lessons/8-framer-shortcuts-to-learn), 접근일 2026-07-20 — 목차 설명만 확인, 구체 키 확인 실패)

### 2.2 출처 확인 실패 (Framer)

- 선택 시 테두리 색상·두께, 리사이즈 핸들 개수/모양, 회전 핫존 위치
- 스마트 가이드/스냅의 정확한 판정 규칙(허용 오차 px, 스냅 우선순위)
- 거리 측정 배지의 트리거 조건과 표시 형식
- 속성 패널의 섹션 순서(Figma처럼 목차화된 공식 문서를 찾지 못함)
- 툴바의 정확한 도구 목록과 단축키 전체 목록

이 항목들은 Framer 자체가 문서화 전략상 "영상으로 보여주고 텍스트로 스펙을 안 박아둔다"는 특징을 보인다는 뜻이며, 이는 그 자체로 하나의 관찰이다: **Framer는 세부 조작 규칙을 문서 스펙이 아니라 UI 자체의 발견 가능성(discoverability)에 맡긴다.** 다만 이건 문서 부재로부터의 추론이지 공식 진술은 아니므로 단정하지 않는다.

- **AskewlyDesign 함의**: Framer 관련 항목은 근거가 얕으므로 이번 horizon 설계에서 Framer를 "구체 스펙 소스"로 쓰지 말고, Figma/Penpot의 확정 메커니즘을 우선 채택 기준으로 삼는다. Framer는 실물 사용 관찰(스크린 리코딩 등)이 필요하면 별도 태스크로 분리해야 한다.

---

## 3. Penpot (오픈소스 구현 참고)

### 3.1 선택·리사이즈

- 리사이즈는 선택 박스 가장자리의 핸들로 수행: "To resize a selected layer you can use the handles at the edges of the selection box." 정확한 핸들 개수(4/8)는 원문에 숫자로 명시되어 있지 않음 — **출처 확인 실패**(개수 자체).
- 모디파이어: Shift 홀드 = 종횡비 유지, Alt/⌥ 홀드 = 중심 기준 리사이즈(반대편 두 변을 동시에 이동). (출처: [Workspace Basics](https://help.penpot.app/user-guide/designing/workspace-basics/), 접근일 2026-07-20)
- 숫자 입력 필드에서 Shift 홀드 시 값이 10배속으로 변경된다: "Hold Shift/⇧ to change the value ten times faster." (동일 출처)

### 3.2 스냅·가이드

- 이동 중 다른 레이어의 가장자리·중심에 정렬 가이드가 나타나고, "Dynamic alignment"가 그 가이드로 스냅시킨다: "Penpot will show alignment guides for the edges and the center of the layers at sight... snaps the layer that is being moved to those guides." (동일 출처)
- 3개 이상 레이어가 근접해 있을 때 하나를 드래그하면 균등 배치를 돕기 위해 **간격(거리) 수치**를 보여준다: "If there are more than two layers nearby and you drag one of them Penpot will show their distance to help you distribute them equally." — 이는 Figma의 "동일 간격 자동 감지" 스마트 가이드와 유사한 기능이지만 3개 이상이라는 조건이 문서에 명시된 점이 특징.
- 픽셀 그리드 스냅이 기본 활성화("Layers automatically snap to the pixel grid")이며 메인 메뉴에서 끌 수 있음(서브픽셀 정밀도 작업용).
- 수동 가이드: 눈금자(ruler)를 클릭 드래그해 세로/가로 가이드 생성. 전체 가이드 표시 토글은 Ctrl/⌘+`, 가이드 스냅 토글은 Shift+Ctrl/⌘+`. (출처: [Workspace Basics](https://help.penpot.app/user-guide/designing/workspace-basics/), 접근일 2026-07-20)

### 3.3 레이어 패널

- 가시성 토글은 레이어 옆 눈 아이콘, 잠금 토글은 자물쇠 아이콘. (출처: [Layers](https://help.penpot.app/user-guide/designing/layers/), 접근일 2026-07-20)
- 선택 방식: 단일 클릭 = 단일 선택, Ctrl/⌘+클릭 = 복수 선택(개별), Shift+클릭 = 범위(구간) 선택.
- 계층 구조는 보드(board)가 다른 보드를 포함할 수 있는 구조이나, 들여쓰기 폭이나 접기/펼치기 아이콘의 정확한 시각 규격은 문서에 없음 — **출처 확인 실패**.

### 3.4 인스펙터(디자인 패널) 구조

- 우측 사이드바는 선택 타입에 따라 달라지는 "Design Properties" 패널이 핵심이며, "some properties are always present (size, position), while others are optional (stroke, shadow, blur…)." 즉 **위치/크기는 상시 노출, 스타일 속성은 선택적 노출**이라는 원칙을 공식 문서가 명시한다. (출처: [Objects](https://help.penpot.app/user-guide/objects/) 요약 및 [The interface](https://help.penpot.app/user-guide/first-steps/the-interface/), 접근일 2026-07-20)
- 우측 사이드바에는 Design Properties 외에 Prototype 모드, Inspect 모드(코드/스펙 추출), Design Tokens 바인딩(숫자·색상 필드에 토큰 연결), Assets 패널(재사용 컴포넌트/컬러/텍스트 스타일 라이브러리)이 탭 또는 모드 전환으로 존재.
- 정확한 섹션 나열 순서(예: Fill이 Stroke보다 위인지)는 WebSearch 요약 수준에서만 확인되었고 원문 목차 대조를 완전히 마치지 못했다 — 순서 세부는 **출처 확인 실패**로 남긴다(상시/선택적 구분 원칙만 확정).
- 좌측: Pages 패널(파일 내 다중 페이지) + Layers 패널. 눈금자(rulers)가 좌측/상단에 상시 존재해 "coordinates to help you design"과 가이드 생성을 겸한다. (출처: [Interface tour](https://help.penpot.app/user-guide/first-steps/the-interface/), 접근일 2026-07-20)

### 3.5 오픈소스 구현으로서의 참고 가치

- Penpot은 SVG 기반 오픈소스 구현이라 "동적 정렬 가이드 + 근접 3개 이상 레이어 간격 표시 + 픽셀 그리드 스냅"을 별개 계층으로 나눠 각각 토글 가능하게 만든 것이 특징이다. 이는 AskewlyDesign의 CanvasDocument/renderer 분리 구조(ADR 0006)와 유사하게, "스냅 판정 로직"과 "가이드 렌더링"을 분리하는 구현 아키텍처 참고가 된다.

---

## 4. 축별 비교표

| 축 | Figma | Framer | Penpot |
|---|---|---|---|
| **선택 표현** | 바운딩 박스, 변 핸들(단축 리사이즈) + 모서리 핸들(양축 리사이즈), 회전은 모서리 바깥 별도 핫존 | 출처 확인 실패(테두리/핸들 스펙 비공개) | 선택 박스 가장자리 핸들, Alt=중심 기준, Shift=종횡비 유지 |
| **스냅/가이드** | 이동 중 유사 간격 감지 시 스마트 가이드 자동 스냅. 거리 측정은 Option/Alt+호버로 별도 트리거, 바운딩 박스 기준, 중첩 레이어는 Cmd+Option/Ctrl+Alt | 레이아웃 그리드(브레이크포인트별 columns/rows·gap·margin) 존재, 스냅 세부 규칙은 출처 확인 실패 | 이동 중 가장자리/중심 정렬 가이드 자동 스냅, 3개 이상 근접 레이어는 간격 수치 표시(균등배치 보조), 픽셀 그리드 스냅 기본 on(토글 가능), 수동 ruler 가이드 |
| **레이어 패널** | 부모-자식 중첩 접기/펼기, 타입별 아이콘(Frame/Group/Component/Instance/Text/Shape 등), Find 검색, 선택된 항목의 부모 경로는 접기 예외 | DOM 트리 유사 구조(2차 출처), 이름변경/순서/숨김/잠금/그룹이 한 패널에 통합 | 눈/자물쇠 아이콘 토글, 단일/Ctrl 다중/Shift 범위 선택, 보드 내 보드 중첩(들여쓰기 규격은 출처 확인 실패) |
| **인스펙터 구조** | Design/Prototype 탭. Design 섹션 순서: 위치·회전 → 크기·모서리 → 제약/레이아웃가이드 → 컴포넌트/오토레이아웃 → 블렌드 → 텍스트 → Fill/Stroke/Effects → Export | 우측 properties panel: styling and settings (세부 섹션 구조 출처 확인 실패) | Design Properties(위치·크기 상시, 스타일 속성 선택적 노출) + Prototype/Inspect/Design Tokens/Assets 별도 모드·탭. 세부 순서는 출처 확인 실패 |

---

## 5. 출처 확인 실패 목록 (전체 정리)

1. Figma: 회전 핫존의 정확한 px 반경
2. Figma: 리사이즈/회전 커서 아이콘의 정확한 형태(공식 이름)
3. Figma: 거리 측정 배지의 시각 규격(폰트/배경색)
4. Figma: 레이어 타입 아이콘의 시각 규격(색상·형태 세부)
5. Figma: 캔버스 선택 → 레이어 패널 자동 하이라이트/스크롤이 기본 on인지
6. Figma: 툴바의 정확한 화면 배치(상단/하단) 1차 문서 인용
7. Framer: 선택 테두리 색상/두께, 리사이즈 핸들 개수·모양, 회전 핫존 위치
8. Framer: 스마트 가이드/스냅의 판정 규칙(허용 오차, 우선순위)
9. Framer: 거리 측정 배지 트리거 조건과 표시 형식
10. Framer: 속성 패널 섹션 순서
11. Framer: 툴바 전체 도구 목록과 단축키
12. Penpot: 리사이즈 핸들 정확한 개수(4 vs 8)
13. Penpot: 레이어 트리 들여쓰기 폭·접기 아이콘 시각 규격
14. Penpot: Design Properties 패널의 정확한 섹션 나열 순서(Fill/Stroke/Effects 상대 순서 등)

---

## 6. AskewlyDesign에 대한 종합 함의

1. **핸들 역할 분리**: 변 핸들(단축 리사이즈)과 모서리 핸들(양축 리사이즈)을 시각적으로 구분하고, 회전은 모서리 바깥의 별도 핫존으로 분리한다(Figma 근거). "지금 뭘 조작 중인지" 커서 전 단계에서 구분 가능해야 한다.
2. **스냅과 측정을 별개 상호작용으로 설계**: 드래그 중 자동 스냅(이동 시 자동 발생)과, 정적 상태에서 모디파이어+호버로 하는 임의 거리 측정(Figma)을 하나의 기능으로 뭉치지 않는다. Penpot처럼 "3개 이상 근접 레이어의 균등 배치 힌트"를 별도 계층으로 추가하면 정렬 작업의 인지 부하가 준다.
3. **측정 기준을 바운딩 박스로 명문화**: 스트로크·텍스트 베이스라인 등으로 인한 오차를 문서화해 CanvasDocument 좌표 모델과 어긋나지 않게 한다.
4. **레이어 패널: 부모 경로 접기 예외 + 타입별 아이콘 + 검색**: 현재 "뭐가 뭔지 안 보인다"는 지적의 상당 부분은 레이어 타입 구분과 트리 탐색성 부재일 가능성이 높다. Figma의 "선택 시 부모 경로는 펼침 유지" 규칙을 우선 이식 후보로 삼는다.
5. **인스펙터 섹션 순서 고정**: 기하(위치/크기) → 구조(레이아웃/컴포넌트) → 시각(텍스트/Fill/Stroke/Effects) → 내보내기 순서를 Figma·Penpot 둘 다 채택하는 것으로 확인됐다(Penpot은 "위치/크기 상시, 스타일 선택적 노출" 원칙까지 명문화). AskewlyDesign 인스펙터가 이 순서·원칙을 안 지키면 우선 재배치 대상이다.
6. **Framer는 이번 스펙 소스에서 제외, 별도 관찰 태스크로**: Framer 공식 문서는 저수준 조작 스펙을 텍스트로 노출하지 않는다. Framer의 "다르게 푸는 지점"을 알고 싶다면 문서 리서치가 아니라 실물 스크린 리코딩/사용 관찰이 필요하다 — 이는 이번 태스크 범위 밖이므로 후속 태스크로 분리 제안한다.

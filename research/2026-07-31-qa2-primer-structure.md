# Primer 홈 구조 해독 (QA2 3차 재설계 — 사용자 확정 레퍼런스)

> 2026-07-31 · 소비처: `plans/2026-07-31-qa2-get-started-cards.md` · 출처: https://primer.style/ (접근일 2026-07-31, 전체 캡처 `research/assets/2026-07-31-primer-home.png`)
> 사용자 지시: "primer.style 처럼 해. 쭉 다 캡처해서 따라 만들자" — 구도·문법을 따르고 브랜드 아이덴티티(색·일러스트 스타일)는 복사하지 않는다(CLAUDE.md 하지 않는 것 ①).

## 페이지 골격 (위→아래)

1. **센터 워드마크 + 1줄 서브** — "Primer / The design system for GitHub". 문단 없음. 우상단 장식 3D 도형이 캔버스 밖으로 블리드.
2. **비대칭 2카드 히어로 밴드** (연회색 페이지 위 흰 카드, 큰 라운드):
   - 좌(넓음): 2줄 헤딩("Build UI at GitHub with **Primer Product UI**" — 제품명만 볼드) → "Get started with Product UI >" 텍스트 링크 → 하단에 **실물 크기 UI 조각 콜라주**(브랜치 다이어그램 선화 + Success 토스트 + Divider 태그 + 아이콘 툴바 + 스펙 주석 박스)가 겹쳐지며 카드 경계로 잘림.
   - 우(좁음): 상단 일러스트(mona 6타일 그리드) → 헤딩("Create for GitHub using the **Brand toolkit**") → 링크.
3. **풀폭 카드 1장**: 좌측 3줄 헤딩 + 링크, 우측에 실물 크기 UI 요소 콜라주(칩·드롭다운·타이포 스페시멘)가 우측 경계로 블리드.
4. **"Shared Foundations" 섹션 헤딩 + 3열 소카드**: 아이콘 칩(연회색 타일) + 제목 + 1문장 + "Learn more >".
5. **"Design at GitHub" 섹션 헤딩 + 2열 카드**: 추상 3D 아트 이미지 + 제목 + 1문장 + Learn more.

## 핵심 문법 (왜 안 "AI slop"인가)

- **일러스트 = 실물 크기 요소 몇 개의 콜라주** — 축소·캡처가 아니라, 토스트·버튼·태그 같은 조각을 원래 크기로 크게 겹쳐 카드 경계로 잘라낸다. 모든 글자가 읽힌다.
- 카드 헤딩이 곧 카피: "동사구 with **제품명**" — 별도 설명 문단 없음(소카드만 1문장).
- CTA 는 전부 텍스트 링크("Get started with X >", "Learn more >") — 버튼 없음.
- 위계 3단: 대형 히어로 카드(주력) → 3열 소카드(기반) → 이미지 카드(문화).

## 우리 매핑 (get-started)

| Primer | Askewly get-started |
|---|---|
| 센터 워드마크+서브 | "Get started" 센터 헤딩 + 1줄 서브 |
| 히어로 좌(넓음) Product UI | **Patterns** — 실물 크기 UI 조각 콜라주(토스트·태그·툴바·스펙 박스, 토큰 기반 자작) |
| 히어로 우(좁음) Brand toolkit | **Colors** — 상단 스와치 6타일 그리드(paletteSeedLibrary 실데이터, hex 라벨 실크기) |
| 풀폭 Brand UI | **Recipes** — 우측 MeshGradientSurface 실물 + 모션 칩 콜라주 |
| Shared Foundations 3열 | **Docs**(31 articles) · **UI Vocabulary**(562 terms, Ctrl F) · **Agents**(llms.txt) |
| Design at GitHub 2열 | 생략 (해당 콘텐츠 없음) |

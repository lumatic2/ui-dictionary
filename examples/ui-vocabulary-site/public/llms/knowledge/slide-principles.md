# Slide Principles — 무엇이 좋은 발표 슬라이드인가

> 발표 슬라이드의 콘텐츠·구조 원칙. 거장 방법론 8계보가 수렴하는 5원칙과 표현 기법을 담는다.
> 제작 절차("어떻게 만드는가")는 [slide-production](../methodology/slide-production.md), 캔버스·대비·통설 규칙의 **게이트 정본**은 [slide-spec](../docs/design-system/slide-spec.md) — 이 문서는 게이트를 재서술하지 않는다.
> 일반 지식 원본(KG): `nodes/디자인/slide-deck-convergent-principles.md` — 여기는 Askewly Design 적용 관점만 적는다.

## 수렴 원칙 5

Minto(피라미드 원칙)·Michael Alley(assertion-evidence)·맥킨지(action title)·Nancy Duarte(slide:ology/Resonate)·Garr Reynolds(Presentation Zen)·Guy Kawasaki(10/20/30)·스티브 잡스 키노트 분석(카민 갤로)·speaking.io(Zach Holman) — 표현만 다를 뿐 같은 곳으로 수렴한다. (전체 출처 장부: `research/2026-07-28-sl1-slide-methodology-research.md`, 접근일 전부 2026-07-28)

| # | 원칙 | 계보 | 에이전트 규칙화 |
|---|---|---|---|
| 1 | **슬라이드당 메시지 하나** — 메시지가 둘이면 슬라이드도 둘 | 맥킨지 · Alley · Jobs | 자동 검사 가능 |
| 2 | **제목이 곧 주장** — 명사구 제목("결과", "개요") 금지, 완결 문장. 제목만 읽어도 스토리가 통해야 함(title-only read test) | Alley(assertion) · 맥킨지(action title) · Minto(결론 우선) | 자동 검사 가능 |
| 3 | **텍스트 대신 시각 증거** — 불릿 나열 지양, 그래프·다이어그램·이미지가 주장을 증명 | Alley(evidence) · Reynolds · Duarte · Jobs · Kawasaki(30pt 하한) | 부분 검사 가능 (비율 휴리스틱) |
| 4 | **청중 관점 편집** — 발표자가 하고 싶은 말이 아니라 청중이 받아야 할 말. MECE + 핵심 메시지 의도적 반복 | Duarte · Minto(MECE) · speaking.io | 프로세스 규칙 |
| 5 | **구조 확정이 디자인보다 먼저** — 청중 분석 → 논리 구조(SCQA) → 스토리보드 → 그다음 슬라이드 도구 | Duarte · Minto · Reynolds · Jobs(과잉 리허설) | 프로세스 규칙 (순서 강제) |

근거 무게는 같지 않다 — [slide-spec](../docs/design-system/slide-spec.md)의 등급 철학을 따른다:

- **원칙 2는 실증이 있다**: Penn State assertion-evidence 연구가 전통 불릿 슬라이드 대비 이해도·기억 회상 우위를 보고 (Michael Alley 계열, ASEE: `https://peer.asee.org/assertion-evidence-slides-appear-to-lead-to-better-comprehension-and-recall-of-more-complex-concepts.pdf`, 접근일 2026-07-28).
- **수치 규칙은 대부분 통설(folklore)이다**: Kawasaki 10장/20분/30pt(원저자 `https://guykawasaki.com/the_102030_rule/`, 접근일 2026-07-28)는 저자는 특정되나 숫자의 실증이 없다 — slide-spec §3이 24pt를 `folklore` 등급 옵트인 경고로 두는 것과 같은 이유로, 이 수치들을 차단 규칙으로 승격하지 않는다.
- speaking.io는 반대 방향의 수치 조언을 준다 — 장수를 줄이지 말고 **장당 정보 밀도**를 줄여라(`https://speaking.io/plan/number-of-slides/`, 접근일 2026-07-28). "10장 이내"와 충돌하는 게 아니라, 제약 대상이 장수가 아니라 밀도임을 보여준다.

## 표현 기법 — HTML이 제작 표면일 때 열리는 것

출처: 코딩애플 영상 2건 요약(사용자 제공 2026-07-28) — ① "관종이 될 수 있는 PPT" `https://www.youtube.com/watch?v=2kdo2ZLTG_E` ② "진정한 남자는 포토샵 대신 html 쓴다" `https://www.youtube.com/watch?v=RrYPBkmnUwc`.

- **PPT 대비 이점**: 애니메이션 자유도, Chart.js 차트, Three.js 3D, 실시간 데이터 반응, 브라우저·모바일 대응, 깃허브 페이지 배포. 이 레포의 [expressive-stack](expressive-stack.md) 티어와 recipe 층([motion-principles](motion-principles.md) 원칙 포함)이 슬라이드에도 그대로 표현 재료가 된다.
- **SVG 필터 기법**: feTurbulence + displacement map(물결·자글거림 뒤틀기), feGaussianBlur + feColorMatrix(슬라임/liquid 병합), `<animate>`(프레임 작업 없는 필터 속성 애니메이션). 임팩트 장면용 — 본문 가독 영역에는 쓰지 않는다.
- **보안 주의**: SVG 필터는 픽셀 단위 색상 조작이 가능해 클릭재킹(가짜 UI 겹치기)에 악용된 실사례가 구글 보안 리포트에 있다 — 외부 SVG/필터 코드를 슬라이드에 반입할 때 출처 검증.
- **실전 주의 3가지** (HTML 발표에서 매번 명시해야 하는 것): 한글 폰트 지정, 글자 크기, 다크모드 대비 — 기본값에 맡기면 export에서 깨진다. 레이아웃이 많아지면 파일 분리(단일 파일 비대화 방지).

## 관련

- 제작 절차·export 경로·엔진 선택: [slide-production](../methodology/slide-production.md)
- 게이트(캔버스 프리셋·WCAG 대비·통설 규칙 옵트인): [slide-spec](../docs/design-system/slide-spec.md) · 매체 판정: [medium-taxonomy](../docs/design-system/medium-taxonomy.md)
- KG 일반 지식: `slide-deck-convergent-principles` · `html-first-slide-export-pipeline` (`~/projects/knowledge-graph`)

## Changelog

- 2026-07-28: 초판 (SL1 step-1 — 리서치 `research/2026-07-28-sl1-slide-methodology-research.md` 흡수).

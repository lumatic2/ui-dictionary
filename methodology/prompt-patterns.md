# Prompt Patterns — AI 에게 디자인을 시키는 법

> DESIGN.md 가 "**무엇을**" 의 단일 출처라면, 본 문서는 "**어떻게 지시할지**"의 카탈로그. 각 패턴은 1) 언제 쓰나 2) 원본 프롬프트 3) 변주 4) 주의점.

## 패턴 분류

| 단계 | 목표 | 대표 패턴 |
|---|---|---|
| **창출** | 0 → 1, 아이디에이션 | Three-designer Debate · Break-default Aesthetic · Brand Remix |
| **구체화** | 토큰·컴포넌트 만들기 | Spec-first Component · Token Extraction · Reference Pinning |
| **검수** | 결과 비평·교정 | Adversarial Critic · A11y Audit · AI-slop Smell Test |
| **운영** | 멀티세션·점진 변경 | Changelog-anchored Diff · Constraint Reminder |

---

## 1. Three-designer Debate (창출)

**언제**: Personality 가 안 잡히고 흐릿할 때. "어떤 톤이지?" 가 한 단어로 안 나올 때.

**프롬프트**:
```
가상의 세 디자이너가 본 프로젝트의 비주얼 방향을 두고 논쟁한다고 가정해줘.
- A: Dieter Rams 추종자 (less but better, 무채색, 그리드)
- B: David Carson 추종자 (브루탈, 의도된 chaos, typography 가 콘텐츠)
- C: Jony Ive 추종자 (재질, 깊이, 빛)

각자 3 가지 제안을 내고, 서로의 약점 하나씩 지적해. 마지막에 어떤 조합이
이 프로젝트에 가장 맞는지 너의 추천을 한 단락으로 정리.
```

**변주**: A/B/C 를 도메인에 맞춰 갈아끼우기 — fintech 면 (Linear / Mercury / Stripe), publisher 면 (NYT / Substack / The Verge).

**주의**: 3 명을 그대로 받지 말 것 — "추천" 단락이 진짜 산출. 그걸 § 1 Personality 의 초안으로 박는다.

---

## 2. Break-default Aesthetic (창출)

**언제**: AI 가 만든 결과가 "어디서 본 듯한 평균값" 일 때.

**프롬프트**:
```
다음 5 가지가 현재 AI 가 디폴트로 뱉는 것들이야:
1. 부드러운 그림자 (0 4px 12px rgba(0,0,0,0.1))
2. 보라/파랑 그라데이션 CTA
3. 8-12px 라운드
4. Inter / Geist sans 만
5. 흰 배경 + 라이트 그레이 카드

이 중 4 개를 일부러 깨는 디자인 시스템을 제안해줘. 각각 무엇으로 대체하는지,
왜 그 선택이 이 프로젝트의 personality (DESIGN.md § 1) 에 부합하는지.
대체안은 토큰 수준에서 구체적으로.
```

**변주**: "5 개 다 깨기"는 너무 강하다 — 항상 1 개는 남기는 게 안정적. AI 가 자체 검증할 수 있는 안전 영역.

**주의**: § 8 Anti-patterns 에 결과를 박아두지 않으면 AI 가 다음 세션에서 다시 디폴트로 돌아간다.

---

## 3. Brand Remix (창출)

**언제**: 참고할 톤이 명확한 두 브랜드 사이에서 골라야 할 때.

**프롬프트**:
```
Linear 의 색·타이포 + Things 3 의 spacing·여백 감각을 섞은 시스템을 만들어줘.
- Linear 에서 가져올 것: 정확한 그레이 단계, 모노톤 + iris accent, mono 라벨
- Things 3 에서 가져올 것: 카드 간 큰 여백, 라운드 코너, 명료한 위계

DESIGN.md frontmatter 만 먼저 작성 (tokens 까지). body 는 다음 단계에서.
```

**주의**: 너무 비슷한 톤을 섞으면 결과가 평균값. 한 축이 분명히 다른 두 브랜드를 골라야 차별화된 출력이 나온다.

---

## 4. Spec-first Component (구체화)

**언제**: 새 컴포넌트를 AI 에게 시킬 때. 구현부터 시키면 매직 넘버가 부활한다.

**프롬프트**:
```
DESIGN.md § 7 에 Dropdown 컴포넌트를 추가하려 해. 다음 4 항목 순서로
spec 만 먼저 작성해줘 — 코드 X.

1. Anatomy (구조 — trigger / list / item / divider 등)
2. Tokens used (semantic 토큰만 — 어디에 surface.muted, 어디에 border.default)
3. Variants (size: sm/md / placement: bottom-start/...)
4. States (default / hover / active / disabled / focus-visible / open)

토큰이 부족하면 어떤 토큰을 추가해야 할지도 같이 제안.
```

그 다음 별도 세션에서 "이 spec 대로 React + Radix Primitives 로 구현" 시킨다.

**주의**: spec 검토 없이 바로 구현 단계 가지 말 것. spec 에서 토큰 부족이 발견되면 거기서 멈추고 토큰부터 추가.

---

## 5. Token Extraction (구체화)

**언제**: 기존 코드/스크린샷에서 DESIGN.md 를 거꾸로 만들 때.

**프롬프트**:
```
다음 코드/이미지에서 디자인 토큰을 추출해줘.
[붙여넣기 / 첨부]

산출:
- primitive: 사용된 모든 색 (hex → oklch 변환), 사용된 모든 spacing 값,
  font 패밀리, font size, radius, border-width 의 distinct 목록
- semantic 후보: 위 primitive 가 어떤 의미론적 역할로 쓰였는지 추정
  (예: gray-900 은 본문 텍스트, gray-500 은 placeholder)
- 빠진 것: spec 상 필요한데 코드에 없는 토큰

각 primitive 가 코드에서 몇 번 쓰였는지 카운트도 같이.
```

**주의**: 카운트 1-2 회만 등장한 색은 보통 우연이거나 버그. 토큰화하지 말고 매직 넘버로 표시 후 사람이 결정.

---

## 6. Reference Pinning (구체화)

**언제**: AI 가 "비슷한 느낌"을 자기 맘대로 해석할 때.

**프롬프트**:
```
첨부한 3 장 스크린샷이 우리가 원하는 톤이야. 다음을 추출:
- 공통점 3 가지 (셋 다에 존재하는 시각 특성)
- 차이점 2 가지 (셋 사이에서 변주된 것 — 우리가 양보할 수 있는 부분)
- 우리가 *피해야 할 것* 2 가지 (이 톤에는 없지만 AI 가 흔히 추가하는 것)

마지막에 우리 DESIGN.md § 1 Personality 에 들어갈 3 줄을 작성.
```

**주의**: 스크린샷 3 장 미만이면 동작이 불안정. 또 3 장이 너무 비슷하면 차이점 항이 비어버린다 — 일부러 한 장은 살짝 결이 다른 걸 섞을 것.

---

## 7. Adversarial Critic (검수)

**언제**: 자체 비평이 필요할 때. 본인이 만든 디자인을 본인이 비평하면 편향.

**프롬프트**:
```
다음 DESIGN.md (또는 스크린샷) 에 대해, 의도적으로 적대적인 디자이너의
관점에서 비평해줘. 다음 frame 으로:

1. "디자이너가 아닌 사람이 만든 것 같은 흔적" 3 가지
2. "AI slop 의 흔적" 3 가지 (디폴트값, 안 깬 관습 등)
3. "10 년 뒤 다시 보면 부끄러울 것" 1 가지
4. "그럼에도 잘 한 것" 1 가지 (균형 유지)

각 항목은 구체 토큰·컴포넌트 이름까지 지목.
```

**주의**: 처음 2 회는 거칠어도 가져갈 만하다. 같은 디자인에 4 회 이상 돌리면 AI 가 트집을 위한 트집을 잡기 시작 — 거기서 멈춰야.

---

## 8. A11y Audit (검수)

**언제**: contrast lint 통과한 뒤 한 번 더. lint 가 잡지 못하는 항목용.

**프롬프트**:
```
DESIGN.md 와 첨부 컴포넌트 코드에 대해 다음 a11y 항목을 점검:

1. focus-visible 인디케이터 — 모든 interactive 요소에 정의돼있나?
   3px outline 또는 ring, 색은 무엇? prefers-reduced-motion 시 동작?
2. ARIA / 시맨틱 — div+onClick 이 button 으로, list 가 ul 로 돼있나?
3. 키보드 trap — modal / dropdown 에서 Esc 닫기, Tab 사이클?
4. 컬러 단독 정보 전달 — error/success 가 색만으로 구분되는 곳?
5. 텍스트 크기 단위 — px 대신 rem 사용? 사용자 zoom 200% 에서 깨지나?

각 항목 PASS/FAIL/N/A + 구체 위치 지목.
```

**주의**: axe-core / pa11y 가 자동으로 잡는 것은 굳이 LLM 에 시키지 말 것 — 비싸고 부정확. LLM 은 "맥락이 필요한 a11y" (위 5 번 같은 의도 판단) 에만.

---

## 9. AI-slop Smell Test (검수)

**언제**: 결과물이 "어딘가 평범한데 어디가 평범한지 못 짚을 때".

**프롬프트**:
```
다음 디자인이 "AI 가 만든 티"가 나는지 평가해줘. 채점 기준:

- [ ] 그림자가 0 4px 12px rgba(0,0,0,0.1) 류의 디폴트?
- [ ] CTA 가 보라/파랑 그라데이션?
- [ ] 라운드가 8 또는 12px?
- [ ] 폰트가 Inter / Geist 만?
- [ ] hero 가 좌측 텍스트 우측 일러스트 split?
- [ ] 카드가 white-on-light-gray + 1px 보더 + 부드러운 그림자?
- [ ] CTA 옆 "↗" 또는 "→" 아이콘?
- [ ] dark mode 가 검정 #000 이 아닌 #111-#1a1a1a?
- [ ] 헤딩이 -2% letter-spacing?
- [ ] 본문이 16/24 + line-height 1.5?

체크 개수 / 10. 3 이하 = 차별화, 4-6 = 평범, 7+ = AI slop.
체크된 것 중 1 개를 어떻게 깰지 구체 제안.
```

**주의**: 이 체크리스트는 본 프로젝트(`desing-manual`)의 § 8 Anti-patterns 후보 풀이기도 함. 시대에 따라 항목 갱신.

---

## 10. Changelog-anchored Diff (운영)

**언제**: 멀티세션 작업 중 "내가 어제 뭘 바꿨더라" 가 발생할 때.

**프롬프트**:
```
DESIGN.md § 9 Changelog 의 마지막 5 개 entry 만 보고, 다음을 정리:
- 최근 디자인의 핵심 변화 1 문장
- 아직 안 적용된 것 (changelog 에 있는데 코드에 반영 X)
- 다음에 손대야 할 것 (changelog 의 흐름상 자연스러운 다음 단계)

추측 금지 — 실제 entry 텍스트만 근거.
```

**주의**: changelog 가 부실하면 (commit log 복붙 류) 이 패턴이 무용지물. 그러면 우선 changelog 부터 정비.

---

## 11. Constraint Reminder (운영)

**언제**: 긴 대화 중반에 AI 가 § 8 anti-patterns 를 잊고 슬쩍 위반할 때.

**프롬프트** (대화 중간에 박는 한 줄):
```
잠깐 — DESIGN.md § 8 anti-patterns 다시 한 번 출력해줘. 그 다음 직전 제안이
거기 위반하는지 자가 체크.
```

**주의**: 너무 자주 박으면 (3 턴마다 등) 진행 안 됨. 새 컴포넌트 / 새 색 도입 시점에만.

---

## 패턴 조합 (recipe)

자주 묶이는 시퀀스. `recipes/` 폴더의 추후 작업 대상.

- **"새 프로젝트 부트스트랩"**: Three-designer Debate → Reference Pinning → Break-default → DESIGN.md frontmatter 작성 → AI-slop Smell Test
- **"기존 사이트 → DESIGN.md 추출"**: Token Extraction → Reference Pinning → 두 결과 머지 → Adversarial Critic
- **"새 컴포넌트 추가"**: Spec-first Component → 구현 → A11y Audit → AI-slop Smell Test → Changelog 한 줄

## 메타 룰

- **한 프롬프트 = 한 결정**. 멀티-목적 프롬프트는 결과가 평균값.
- **출력 포맷을 강제하라**. "각 항목은 구체 토큰 이름까지" 처럼 — 추상 답변 방지.
- **양보 가능한 부분을 명시하라**. "x 는 양보, y 는 양보 불가" 가 있으면 AI 가 자유도를 그쪽으로 쓴다.
- **AI 의 자기검열을 활용하라**. "왜 그 선택이 § 1 Personality 와 부합하는지" 한 줄 강제 → 헛소리 감소.

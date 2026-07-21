# Figma Motion 실재 여부 조사

- 조사일: 2026-07-20
- 목적: AskewlyDesign 캔버스 편집기 UI 재설계 horizon 기획 입력

## 판정: 실재함 (확인됨)

Figma Motion은 Figma가 Config 2026 컨퍼런스(2026-06-24)에서 공식 발표한 실재 제품/기능이다. Framer Motion(React 애니메이션 라이브러리, 별개 회사)과 혼동한 것이 아니며, 정식 명칭 그대로 "Figma Motion"이다.

## 확인된 사실 (출처 명시)

### 발표 시점·명칭·상태
- 2026-06-24, Config 2026에서 발표. 정식 명칭 "Figma Motion". [Figma Blog — Config 2026 Recap](https://www.figma.com/blog/config-2026-recap/) (접근 2026-07-20)
- 공식 헬프센터 문서 존재: "What's new from Config 2026" — Figma Motion을 "rolling out gradually" (June 24, 2026), **Open beta**, 전 플랜(Full seat) 대상, "Can edit" 권한 필요, Figma for Government 플랜은 제외. [Figma Help Center](https://help.figma.com/hc/en-us/articles/39582753756695-What-s-new-from-Config-2026) (접근 2026-07-20)
- Config 공식 세션 페이지에 "Figma deep dive: Motion" 세션이 별도로 존재. [config.figma.com 세션](https://config.figma.com/san-francisco/session/dfa297f9-6486-4a4f-b272-97fe3572349c/) (접근 2026-07-20)
- Figma 공식 계정이 X(트위터)에서 발표를 알림 (접근만 확인, 본문 상세는 재확인 필요). [x.com/figma/status/2069827742800253230](https://x.com/figma/status/2069827742800253230) (접근 2026-07-20)

### 무엇을 하는 도구인가
- 대상: 전체 디자이너, 특히 기존에 외부 모션 툴(After Effects 등)로 이탈해야 했던 모션 디자이너.
- 핵심 기능: Figma Design 파일 내에 네이티브 타임라인 통합. 프리셋 애니메이션으로 빠르게 시작하거나 키프레임부터 직접 빌드 가능. easing curve, spring 애니메이션 지원. Figma agent(AI)가 텍스트 설명 기반으로 초기 키프레임 생성 가능.
- 디자인 시스템 결합: 컴포넌트 단위로 애니메이션을 한 번 정의하면 그 모션이 모든 인스턴스·모든 협업자 파일에 전파됨(색상·타이포와 같은 방식). timing/easing variable, "animated components" 개념 도입.
- [Figma Blog — Config 2026 Recap](https://www.figma.com/blog/config-2026-recap/) (접근 2026-07-20), [Figma Help Center](https://help.figma.com/hc/en-us/articles/39582753756695-What-s-new-from-Config-2026) (접근 2026-07-20)

### 기존 Smart Animate/프로토타이핑과의 관계
- Figma 공식 헬프센터 "What's new from Config 2026" 문서 자체는 Smart Animate와의 관계를 명시적으로 비교하지 않음 (WebFetch로 직접 확인, 해당 문서에 언급 없음, 접근 2026-07-20).
- 3rd-party 해설(FigAnimations, uxplanet 등, 2차 출처)에 따르면 역할 분담 성격:
  - **Smart Animate**: 두 프레임 간 레이어 이름 매칭 기반 상태 전환(hover, modal 진입, 토글, 네비게이션 전환) — 기존 프로토타이핑 엔진, 변경 없음.
  - **Figma Motion**: 타임라인 정밀도, 경로 기반 모션, 프레임 단위 키프레임 제어가 필요한 복잡한 모션 디자인.
  - 출처: [FigAnimations — Complete Guide to Figma Animation](https://www.figanimations.com/blogs/the-complete-guide-to-figma-animation) (접근 2026-07-20) — **2차 출처, Figma 공식 문서 아님**. 역할 분담 설명은 신뢰도가 1차 출처보다 낮음.

### UI 구조
- 타임라인 기반(state-based가 아님). 공식 문구: "motion now lives on the canvas — in the same file as your components, your variables, and your team." [Figma Blog](https://www.figma.com/blog/config-2026-recap/) (접근 2026-07-20)
- Dev Mode에서 타임라인 전체를 읽기 전용으로 검사 가능 — 모든 timing 값, easing curve, keyframe이 그대로 노출. [Figma Help Center](https://help.figma.com/hc/en-us/articles/39582753756695-What-s-new-from-Config-2026) (접근 2026-07-20)

### 경쟁/유사 도구 대비 위치
- 조사 항목 4(Framer Motion, Rive, After Effects, Jitter 등과의 명시적 포지셔닝 비교)에 대한 **Figma 공식 1차 출처 발화는 확인하지 못함**. Config 2026 recap과 헬프센터 문서 모두 경쟁 도구를 직접 언급하지 않는다.
- 출처 확인 실패로 명시함: 경쟁 도구 대비 포지셔닝은 이번 조사에서 1차 출처로 검증되지 않았으므로 horizon 기획에 사실로 인용하지 말 것.

### 코드 출력
- 확인됨: MP4, GIF, WebM, Animated SVG 익스포트 지원. Dev Mode에서 CSS, JSON, React-ready 코드 복사 가능.
- Lottie 익스포트는 "향후 도입 예정"(계획 단계, 미출시). [Figma Help Center](https://help.figma.com/hc/en-us/articles/39582753756695-What-s-new-from-Config-2026) (접근 2026-07-20)

## 출처 확인 실패 항목 (명시)
- Figma Motion과 Smart Animate의 관계에 대한 Figma **공식** 1차 발화(공식 블로그/헬프센터에 명시된 비교 문장)는 찾지 못했다. 위 "역할 분담" 설명은 서드파티 해설 기반이며, 공식 입장으로 인용하면 안 된다.
- Framer Motion, Rive, After Effects, Jitter 대비 Figma의 공식 포지셔닝 발언은 확인하지 못했다.
- X(트위터) 발표 게시물의 정확한 본문 텍스트는 WebFetch로 재확인하지 않았다(링크 존재만 확인).

## UI 함의 (AskewlyDesign horizon 기획용, 추측 — 사실 아님)
아래는 위 확인된 사실에 대한 **해석/추측**이며 Figma 공식 발화가 아니다.
- 타임라인이 "캔버스와 별개 패널"이 아니라 같은 파일·같은 컴포넌트/변수 시스템 안에 결합된 것이 핵심 차별점으로 보인다 — 별도 모션 툴로 컨텍스트 전환 없이 정적 디자인과 모션이 한 문서 안에 공존.
- Dev Mode 읽기 전용 타임라인 노출 + 코드 export(CSS/JSON/React)는 AskewlyDesign의 "선택 영역 결합 에이전트 + 코드 왕복" 방향과 구조적으로 유사한 패턴 — 참고할 만한 선례로 볼 수 있으나, 직접 벤치마킹 전 Figma 공식 UI 스크린샷/데모 영상으로 재확인 필요(이번 조사는 텍스트 기반).

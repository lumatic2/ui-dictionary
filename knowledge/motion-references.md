# Motion & Interaction References

> 인터랙티브 UI를 만들 때 참고하는 외부 자료 북마크. 코드 라이브러리 클론은 toolshelf(`~/projects/toolshelf`)에 있고, 여기엔 레포가 아닌 기법·데모 레퍼런스를 남긴다.

## 스크롤 내러티브 (scroll-driven storytelling)

- **GSAP + ScrollTrigger** — 스크롤 핀·스크럽·패럴랙스·단계적 리빌 기법의 가장 깊은 데모 라이브러리.
  - 데모 허브: `https://gsap.com/scroll/` · `https://demos.gsap.com/plugin/scrolltrigger/` · CodePen 컬렉션 `https://codepen.io/collection/DkvGzg`
  - 라이선스: GSAP 코어 + 전 플러그인(ScrollTrigger 포함)이 2024년 Webflow 인수 이후 **모든 용도 무료**(상업 포함). 의존성으로 추가하기 전 `gsap.com/pricing`에서 현재 약관 재확인.
  - 용도: showcase 카드 4 (Scroll-Driven Narrative) 기법 참고. 레포가 아니라 데모 갤러리라 toolshelf에 클론하지 않고 여기 북마크. 우리 모션 primitive로 재구현하거나, 무료화됐으니 `gsap` 직접 추가 중 택.
  - 접근일: 2026-07-07

## 공간형 랜딩 (Three.js walkable/spatial hero)

포트폴리오·랜딩을 평면 목록이 아니라 **장소**(방·도시·캠퍼스)로 모델링하는 임팩트 패턴. 실사례: Bruno Simon Folio 2025 · Sooah's Room Folio · My Room in 3D · Repolis(레포→3D 도시) 등 — 사례 장부와 실측 리포트는 KG `nodes/디자인/spatial-repo-portfolio-agentic-wayfinding-pattern.md` + toolshelf `3d-spatial-landing-reference-pack`(8사이트) (접근일 2026-07-28).

**채택 게이트 (decorative-skin failure)**: 3D 가 데이터 위의 장식 스킨이면 실패다 — ① 정보 구조(구역·경로) ② 시각 위계(랜드마크·스케일·조명) ③ 증거 접근(각 목적지에서 실제 콘텐츠 열람)의 3층이 전부 의도적으로 매핑될 때만 공간 메타포가 정당하다. 첫 제품 형태는 도시보다 **룸 스케일**이 적합할 수 있다. LLM 없는 non-agent 폴백(로컬 검색·결정적 라우팅)을 유지한다.

## 영상 매체 (Remotion) — 링크만, 매체가 다르다

사전 렌더 영상은 화면 UI 와 게이트가 다르다(프레임 결정론·정지프레임 검증). 이 레포 범위 밖 — 필요 시 KG 원본을 직접 읽는다 (접근일 2026-07-28):

- `nodes/디자인/motion-remotion-animation-pattern-library.md` — 프리미티브 패턴 조직법
- `nodes/디자인/motion-remotion-scene-spec-workflow.md` — 씬 스펙·컴포넌트 레지스트리·렌더 루프
- `nodes/디자인/motion-remotion-official-resource-selection.md` — 공식 리소스 역설계 루프
- `nodes/디자인/motion-remotion-frame-render-guardrails.md` — 프레임 기반·CSS 애니메이션 배제 가드레일

단, 모션 **원칙**(still appeal·목적 6분류·타이포 가독성)은 매체 공통 — [[motion-principles]] 가 정본.

## 관련 toolshelf 항목 (코드 클론)

- `magicui` — 애니메이션 컴포넌트 패턴 (카드 5/6/9)
- `shaders` (paper-design) — WebGL 메시 그라디언트 (카드 6)
- `cmdk` — 커맨드 팔레트 primitive (카드 10)
- `cult-ui` — 편집 캔버스·머티리얼 컴포넌트 (카드 1/7)
- `react-bits` · `motion` — 애니메이션 컴포넌트/엔진 (기존)

상세 후보 분석: `docs/research/showcase-card-reference-shortlist-2026-07.md`

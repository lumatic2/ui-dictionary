# VI7 — toolshelf 비주얼 임팩트 카드 15건 배치·판정 장부 (2026-07-28)

> 소비처: `plans/2026-07-28-vi7-toolshelf-placement.md` step-2 (정본 반영)
> 판정 규칙: `docs/design-system/absorption-criteria.md` 3분기(A=Recipe 정본화 / B=링크 참조 / C=보류) + 티어 = `knowledge/expressive-stack.md` 4티어. 공통 불변식: 스타일은 흡수하지 않는다 — 원리·계약·판정 기준만.
> 카드 출처: toolshelf `cards/*.md` frontmatter (접근일 2026-07-28). 기판정 6종 = absorption-criteria 실측 표(2026-07-17).

## 판정표 (15행 전수)

| # | 카드 | 티어 | 3분기 | 기판정 | 사유 · 출처 |
|---|---|---|---|---|---|
| 1 | GSAP | ② | **A 대기** | 유지(A 대기) | 핀·스크럽 원리는 결정표 ② 등재, recipe 실수요 대기 — VI8 1순위 후보(스크롤 시퀀스 recipe). 카드가 KG 허브 노드와 이미 배선(`knowledge:` 필드). https://github.com/greensock/GSAP |
| 2 | motion | ② | **A 완료** | 유지(A) | 스프링·stagger 원리 recipe 3종 이식 완료(VI3: spring-drag-snap-card·staggered-entrance-group·magnetic-hover-button). https://github.com/motiondivision/motion |
| 3 | shaders (paper-design) | ④ | **A 대기** | 신규 | 결정표 ④ "Paper Shaders" 등재 + 쇼케이스 Shader Gradient 실사용 = 수요 실증. 토큰화된 shader-gradient recipe 실구현이 남음 — VI8 후보. 기존 mesh-gradient recipe 는 ① CSS 근사로 별개. https://github.com/paper-design/shaders |
| 4 | WebGL-Fluid-Simulation | ④ | **B** | 유지(B) | Navier-Stokes 구현 자체가 가치 — 재서술=열화 복제. 결정표 ④ 행에서 링크 참조 유지. https://github.com/PavelDoGreat/WebGL-Fluid-Simulation |
| 5 | jquery.ripples | ④ | **C** | 신규 | 물결 배경 수요 미실증 + jQuery 의존 구식 스택 — 카드만 유지, 수요 발생 시 #6 과 함께 재판정. https://github.com/sirxemic/jquery.ripples |
| 6 | simple-water-waves-shader | ④ | **C** | 신규 | 의존성 0 순수 WebGL 리플 — 구현 참조 가치는 있으나 결정표·장부에 물결 수요 0. 카드 유지. https://github.com/gorodroz/simple-water-waves-shader |
| 7 | spark (sparkjsdev) | ④ | **C** | 신규 | Gaussian splatting 렌더러 — 3D 스캔·대형 씬 수요 미실증. 에셋 게이트는 KG `web-3d-asset-pipeline-quality-gate` 가 이미 커버(VI6 링크). https://github.com/sparkjsdev/spark |
| 8 | react-bits | ②(참조) | **B** | 유지(B) | 130+ 완성 컴포넌트 모음 — 가치=구현량, 라이선스 MIT+Commons Clause 주의 문구 포함. https://github.com/DavidHDev/react-bits |
| 9 | magicui | ①②(참조) | **B** | 유지(B) | Tailwind+Motion 조합 모음 — 쇼케이스 카드 레퍼런스. https://github.com/magicuidesign/magicui |
| 10 | animated-grid-lines | ③ | **C** | 유지(C) | 커서 반응 그리드 단일 효과 — 수요 미실증. https://github.com/robertcoopercode/animated-grid-lines |
| 11 | Brainwave-Interactive-Landing | 레퍼런스 소스 | **B** | 신규 | 애니메이션 헤비 랜딩 완성 사례(스크롤 트리거·히어로 레이어링) — 티어 배치 비대상(갤러리형), 사례 링크 가치. https://github.com/arnobt78/Brainwave-Interactive-Landing--React-Frontend |
| 12 | 3d-spatial-landing-reference-pack | 레퍼런스 소스 | **B** | 신규 | 공간형 랜딩 8사이트 팩 — VI6 에서 motion-references §공간형 랜딩에 이미 링크 반영. https://www.sooahs-room-folio.com/ 외 7 |
| 13 | 60fps-design | 레퍼런스 소스 | **B** | 신규 | iOS·웹 마이크로인터랙션 큐레이션 갤러리 — 기법이 아니라 관찰 소스, motion-references 북마크. https://60fps.design/ |
| 14 | landing-love | 레퍼런스 소스 | **B** | 신규 | 애니메이션 랜딩 갤러리(풀페이지 영상 기록) — 스크롤 페이싱·히어로 전환 관찰 소스. https://www.landing.love/ |
| 15 | remotion | 범위 밖(영상 매체) | **B** | 신규 | 사전 렌더 영상 프레임워크 — 화면 UI 티어 비대상. motion-references §영상 매체가 KG 노드 4건 링크로 이미 커버. https://github.com/remotion-dev/remotion |

집계: A 완료 1 · A 대기 2 · B 8 · C 4. 티어 배치 대상 10(①~④), 갤러리·레퍼런스 소스 4, 범위 밖 매체 1.

## VI8 입력 (A 대기 상위 후보)

1. **GSAP 스크롤 시퀀스 recipe** (② — 핀·스크럽·다요소 안무, 결정표 등재 실수요)
2. **Paper Shaders shader-gradient recipe** (④ — 쇼케이스 실사용, 토큰 파생 계약)
3. (보조) presentation-slides three-scene 계약 ↔ lazy-three-object-scene recipe 상호 링크 (VI8 DoD 기재 항목)

## 갤러리형 vs 코드형 구분 (failure probe 대응)

#11~14 는 코드 이식 대상이 아니라 **관찰 소스**다 — 티어 배치 없이 "레퍼런스 소스"로 표기하고 motion-references 북마크로만 반영한다 (재서술·벤더링 금지).

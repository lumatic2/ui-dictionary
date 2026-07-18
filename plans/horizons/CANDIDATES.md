# Horizon Candidates (백로그)

> §B0.5 Beat 2의 입력 정본. **우선순위 순서는 사용자 소유** — 에이전트는 후보 추가와 근거 제안만 한다.
> Beat 2는 여기서 후보를 꺼내 선정하고, 새 후보 발견 시 여기에 적재한다.

## 후보 (우선순위 순)

> 순서 변경 제안: `template-production-system`을 `recipe-code-reuse` 다음 Horizon으로 승격. 사용자 확정 전에는 기존 번호 목록을 재정렬하지 않는다. 설계 번들: `plans/horizons/2026-07-template-production-system.md`.

1. **public-product-monetization (복귀)** — parked 2026-07-17 (`docs/horizons/2026-07-public-product-monetization.md`). PX 완료, AM/AC/PG/PP 미착수. 복귀 조건 제안: agent-adoption-loop가 닫혀 실사용 흐름·스타일 기준이 검증된 뒤, AM(무료/Pro 경계) §B0-1 토론부터 재개.
2. ~~**vertical-integration (신규, 사용자 발의 2026-07-17)**~~ → **선정·개명 2026-07-17**: `docs/horizons/2026-07-expressive-stack.md`로 active 승격 (범위 확장 — "화면 표시 대다수" 4티어, 사용자 확정). 원 후보 기술: "Tailwind(문법) 위에 shadcn(부품) 위에 Askewly(판단)" 스택을 판단 층에서 그치지 않고 아래 두 층까지 Askewly Design이 다루는 수직 통합. 구성 제안: ① **CSS 표현 기법 knowledge** — "CSS로 예술"급 고급 기법(그라디언트 메시·mask/clip-path·scroll-driven animation·houdini·blend mode 등)을 어떻게 만드는지 해부해 `knowledge/`+recipe로 정본화 ② **부품 층 계약** — shadcn 등 컴포넌트 배포 계층을 우리 recipe가 직접 참조·재스타일하는 가이드(“shadcn 룩” 탈출 레시피) ③ **레퍼런스 흡수** — toolshelf 실측 후보: react-bits(130+ 애니메이션 컴포넌트)·GSAP·magicui·cult-ui·animated-grid-lines·WebGL-Fluid-Simulation·taste-skill·nothing-design-skill. 진입 시 §B0.5 Beat 2 + 재료 수집(리서치) beat 선행 권고 — CSS-art 기법 계보 조사가 milestone 설계의 입력.

## 이력

- 2026-07-17: 파일 생성 (agent-adoption-loop 활성화와 함께). parked monetization을 첫 복귀 후보로 적재.
- 2026-07-17: vertical-integration 후보 적재 (사용자 발의 — CSS 표현 기법 편입 + 문법/부품 층 수직 통합, toolshelf recall 근거 포함).
- 2026-07-18: skill-entry horizon은 후보 경유 없이 사용자 발의로 직접 개설 (`2026-07-skill-entry.md` — 진입 경량화 + 사람 확인 게이트, 좁은 boundary horizon).
- 2026-07-19: studio-finish horizon 개설 (사용자 선정 — cascade-studio 이월 갭 3건 마감, `2026-07-studio-finish.md`). 후보 1번(parked horizon 복귀)은 잔류 — 복귀 조건(agent-adoption-loop 닫힘)은 충족된 상태.
- 2026-07-19: recipe-code-reuse horizon 개설 (사용자 발의 — "사이트 템플릿 활용": 코드 출발 + 스튜디오 연결 선택, `2026-07-recipe-code-reuse.md`).
- 2026-07-19: template-production-system next 번들 작성 (사용자 발의·추천 범위 확정 — 명함/제품 포스터/인포그래픽, 구조 우선, 고정 fixture 우선). 기존 active와 후보 우선순위는 사용자 결정 전 변경하지 않음.

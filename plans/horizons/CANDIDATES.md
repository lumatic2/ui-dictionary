# Horizon Candidates (백로그)

> §B0.5 Beat 2의 입력 정본. **우선순위 순서는 사용자 소유** — 에이전트는 후보 추가와 근거 제안만 한다.
> Beat 2는 여기서 후보를 꺼내 선정하고, 새 후보 발견 시 여기에 적재한다.

## 후보 (우선순위 순)

> 순서 변경 제안: `template-production-system`을 `recipe-code-reuse` 다음 Horizon으로 승격. 사용자 확정 전에는 기존 번호 목록을 재정렬하지 않는다. 설계 번들: `plans/horizons/2026-07-template-production-system.md`.

1. ~~**public-product-monetization (복귀)**~~ → **후보 제거 2026-07-20 (사용자 지시)**. 이 주제는 에이전트가 제안·언급하지 않는다 — 사용자가 먼저 꺼낼 때만 다시 다룬다. parked 기록은 `docs/horizons/2026-07-public-product-monetization.md`에 동결 보존.
2. ~~**vertical-integration (신규, 사용자 발의 2026-07-17)**~~ → **선정·개명 2026-07-17**: `docs/horizons/2026-07-expressive-stack.md`로 active 승격 (범위 확장 — "화면 표시 대다수" 4티어, 사용자 확정). 원 후보 기술: "Tailwind(문법) 위에 shadcn(부품) 위에 Askewly(판단)" 스택을 판단 층에서 그치지 않고 아래 두 층까지 Askewly Design이 다루는 수직 통합. 구성 제안: ① **CSS 표현 기법 knowledge** — "CSS로 예술"급 고급 기법(그라디언트 메시·mask/clip-path·scroll-driven animation·houdini·blend mode 등)을 어떻게 만드는지 해부해 `knowledge/`+recipe로 정본화 ② **부품 층 계약** — shadcn 등 컴포넌트 배포 계층을 우리 recipe가 직접 참조·재스타일하는 가이드(“shadcn 룩” 탈출 레시피) ③ **레퍼런스 흡수** — toolshelf 실측 후보: react-bits(130+ 애니메이션 컴포넌트)·GSAP·magicui·cult-ui·animated-grid-lines·WebGL-Fluid-Simulation·taste-skill·nothing-design-skill. 진입 시 §B0.5 Beat 2 + 재료 수집(리서치) beat 선행 권고 — CSS-art 기법 계보 조사가 milestone 설계의 입력.

3. **editor-color-and-token-editing (신규, 2026-07-21 EU5 관측에서 적재)** — **편집기에서 색을 바꿀 수 없다.** `editor-legibility` 닫는 기준 6 관측에서 사용자가 과업 3건 중 색 토큰 변경 하나에서 막혔다("색은 어떻게 바꾸는지 모르겠네"). 계측: 화면 전체에 **"색" 단어 0건 · 색 견본 0개**, 유일 경로가 `Token · fill` 자유 텍스트 입력(유효 토큰 이름을 미리 알고 오타 없이 타이핑해야 함), 바인딩이 없는 노드(이미지 등)는 **컨트롤 자체가 없어 색 변경 불가**. 구성 제안: ① 해석된 색 견본 + 선택 목록(자유 타이핑 대신) ② 토큰을 **새로 묶는** 경로 ③ 사용자 언어 라벨(`Token · fill` → "채움 색") ④ 유효 토큰 자동완성·오타 피드백. 근거: `evidence/editor-legibility/eu5-judgeability.md`. **이 결함은 probe 11건과 브라우저 계측이 전부 못 잡았고 사람이 한 번 만져서 나왔다** — 다음 horizon에도 과업 관측 게이트를 유지할 근거.

4. **editor-motion (신규, 2026-07-20 리서치에서 적재)** — Figma Motion(Config 2026 발표, Open beta)이 확립한 구조: **모션이 캔버스 안에 살고**, 컴포넌트 단위로 정의한 애니메이션이 색·타이포처럼 모든 인스턴스에 전파되며, Dev Mode에서 CSS/JSON/React 코드로 나온다. AskewlyDesign의 "코드 네이티브 캔버스"와 축이 같다. 근거: `research/2026-07-20-editor-ui-horizon-figma-motion.md`. **진입 조건: `editor-legibility` 완료** — 선택·레이어가 안 읽히는 상태에서 타임라인을 얹으면 판단 불가가 한 겹 더 쌓인다.
5. **framer 실물 관찰 (태스크 규모)** — Framer 공식 문서는 저수준 조작 스펙(핸들·스냅 판정)을 텍스트로 노출하지 않아 문서 리서치로 5개 항목이 확인 실패로 남았다. 알고 싶으면 실물 사용 관찰이 필요하다. horizon이 아니라 단일 태스크.

## 이력

- 2026-07-17: 파일 생성 (agent-adoption-loop 활성화와 함께). parked monetization을 첫 복귀 후보로 적재.
- 2026-07-17: vertical-integration 후보 적재 (사용자 발의 — CSS 표현 기법 편입 + 문법/부품 층 수직 통합, toolshelf recall 근거 포함).
- 2026-07-18: skill-entry horizon은 후보 경유 없이 사용자 발의로 직접 개설 (`2026-07-skill-entry.md` — 진입 경량화 + 사람 확인 게이트, 좁은 boundary horizon).
- 2026-07-19: studio-finish horizon 개설 (사용자 선정 — cascade-studio 이월 갭 3건 마감, `2026-07-studio-finish.md`). 후보 1번(parked horizon 복귀)은 잔류 — 복귀 조건(agent-adoption-loop 닫힘)은 충족된 상태.
- 2026-07-19: recipe-code-reuse horizon 개설 (사용자 발의 — "사이트 템플릿 활용": 코드 출발 + 스튜디오 연결 선택, `2026-07-recipe-code-reuse.md`).
- 2026-07-19: template-production-system next 번들 작성 (사용자 발의·추천 범위 확정 — 명함/제품 포스터/인포그래픽, 구조 우선, 고정 fixture 우선). 기존 active와 후보 우선순위는 사용자 결정 전 변경하지 않음.
- 2026-07-20: public-product-monetization 후보 제거 (사용자 지시 — "noise가 심하다, 내가 원할 때 얘기하겠다"). 에이전트 발의 금지 항목.
- 2026-07-19: recipe-code-reuse closed (RC1~RC4 — 27 코드 자산·코드 출발 계약·매핑·실연 사람 게이트. 2세션 병행 1일 완주 — 디플레 재적발, 다음 설계 입력).
- 2026-07-21: **editor-legibility closed** — 닫는 기준 6항 중 5 PASS·1 **미달**(판단 가능성: 과업 3건 중 2건 성공). 미달을 미달로 적고 닫았다. 실패에서 editor-color-and-token-editing 후보 적재. 크기 회고: 5 milestone·13 changeset(195~205)·14 leaf — 선언(최소 3 무감독 세션·예상 14 leaf)과 일치, 인플레·디플레 없음.
- 2026-07-20: editor-legibility horizon 설계 번들 작성(사용자 발의 — 편집기 UI "Figma만큼이라도", 조작감+판독성 둘 다). 승인 대기: `plans/horizons/2026-07-editor-legibility.md`. 같은 리서치에서 editor-motion·framer 관찰 후보 적재.

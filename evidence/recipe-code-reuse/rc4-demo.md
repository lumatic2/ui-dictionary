# RC4 통합 실연 — 흙과 손

- Date: 2026-07-19
- Brief: 수제 도자기 온라인숍 · 따뜻하고 장인적
- Selections: `evidence/recipe-code-reuse/rc4-selections.json` (사용자가 스튜디오에서 제출한 18축 원본 복원)
- Scratch app: Claude session scratchpad `rc4-site/` (계획된 비배포 데모)

## 전 루프

1. 사용자가 `clay-hands` 방향과 18축을 선택해 `brief-selections.json`을 제출했다.
2. 수집 payload의 `hero-cards-info` 및 `implementation.recipes` 3개가 `DESIGN.md`로 흘렀다.
3. `/r/responsive-content-grid.json`에서 카드 grid 코드를 이식하고 Button/Badge 의존을 로컬 primitive로 해결했다.
4. `landing-hero`, `article-documentation-layout`은 recipe 문서 폴백으로 구현했다.
5. 전체를 warm paper, forest green, Noto Serif/Sans KR, 4px radius 토큰으로 다시 입혔다.
6. Vite production build와 데스크톱·모바일 Playwright를 재실행했다.

## 기술 검증

- Vite+React+TypeScript+Tailwind production build: **PASS** — 1,882 modules, JS 230.74 kB, CSS 21.85 kB.
- Desktop 1234×1280(light): HTTP 200, 제목·제품 grid 노출, console/page errors 0.
- Mobile 390×844(light): HTTP 200, 제목·제품 grid 노출, console/page errors 0.
- Screenshots: `rc4-pottery-desktop.png`, `rc4-pottery-mobile.png`.

## Close Criteria 선언 / 실측 / 판정

1. 코드 자산 배포 — 선언 ≥12 / 실측 27 assets HTTP 200·의존 선언 / **PASS**.
2. 깨끗한 이식 실구동 — 선언 ≥1 / 실측 RC1 stat-summary-grid + RC4 responsive-content-grid / **PASS**.
3. 코드 출발 E2E — 선언 fetch→적용→토큰 리맵 / 실측 RC2 headless·독립 build/browser / **PASS**.
4. 매핑 배선 — 선언 13항·수집→DESIGN→구현 / 실측 13/13, 49/49, live 계약 / **PASS**.
5. 통합 실연 — 선언 선택→조합→리스타일→사람 live gate / 선택·조합·리스타일·브라우저 기술 실측 **PASS**, **사용자 최종 시각 확인 대기**.

## 프리모템 대조

- 사이트 결합 잔재: 없음. scratch 새 프로젝트 build/browser PASS.
- 기본 shadcn 표정 고착: 없음. 사용자 선택 warm/forest 토큰과 세리프 헤딩으로 리맵했다.
- 매핑 장식화: 없음. 제출 JSON의 hero/cards/info mapping이 실제 구현 경로를 결정했다.

## 발견·교정

- 병렬 세션의 선택 JSON·소스가 repo가 아닌 세션 scratchpad에 남아 정본과 B2B 보조 proof가 혼선됨 → 실제 `brief-selections.json`, `DESIGN.md`, 실행 소스를 역추적해 정본 증거를 도자기 의뢰로 교정했다.
- 첫 재검증은 종료된 `:5190` 때문에 connection refused → exact scratch path에서 `--strictPort` 서버를 다시 띄운 뒤 동일 검사를 PASS했다.

## 판정

기술 DoD와 실제 사용자 선택 반영은 충족했다. RC4 및 Recipe Code Reuse Horizon 완료 표시는 사용자가 최종 화면을 보고 시각 판정을 내린 뒤 수행한다.

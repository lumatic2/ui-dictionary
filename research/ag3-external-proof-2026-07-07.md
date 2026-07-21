# AG3 외부 프로젝트 실전 실증 — development-dictionary VS Code 가이드

Date: 2026-07-07
Milestone: AG3 (plan: `docs/plans/2026-07-07-ag3-external-proof.md`)
Method: sonnet 구현 에이전트가 live 진입점만으로 SSOT 소비, Fable 독립 게이트 검증.

## 무엇을 증명했나

외부 레포(`~/projects/development-dictionary`, Askewly Dev Guide)에서 코딩 에이전트가 **`https://ui.askewly.com/llms.txt` 진입점만으로** Askewly Design SSOT를 발견·소비해 실제 페이지("VS Code 최대로 활용하기", `#/guides/vscode`)를 구현했다. ui-dictionary 로컬 파일 접근 0 — SMC3 데모(경로 손 전달)와 달리 발견 계층이 실전에서 작동함을 확인.

## 소비 경로 (에이전트 fetch 로그)

1. `https://ui.askewly.com/llms.txt` → 인덱스에서 하위 URL 발견
2. `/llms/tokens/askewly.tokens.json` → semantic·component 토큰을 `.askewly-guide` 스코프 CSS vars로 해석(`src/styles/askewly-guide.css`, light+dark, 생성 출처 주석)
3. `/llms/recipes/application-ui/showcase-card.md` → Extension/Cursor 카드 9장 (Anatomy + hover states)
4. `/llms/recipes/forms/button.md` → 홈 링크 버튼 2개 (h40/px24/radius-sm, primary solid·secondary outline)
5. `/llms/recipes/marketing/landing-hero.md` → 페이지 헤더 (Compact variant, anti-pattern 준수: split hero·blob·가짜 대시보드 없음)
6. `/llms/docs/design-system/recipe-format.md`, `/llms/docs/design-system/agent-asset-model.md` → 계약 이해용

## 게이트 검증 (Fable 독립 재실행)

- `npm run build` exit 0 / `npm run lint` exit 0
- 색 리터럴 스캔: `vscode-guide.tsx`에 hex/rgb/oklch 0건 (색은 전부 `var(--ag-*)`)
- 토큰 값 대조: `--ag-action-primary` light `#6f2dbd` == SSOT `{askewly.violet}` `#6F2DBD`, dark `oklch(0.985 0 0)` == `{gray.1}` — 참조 해석 정확
- 브라우저 렌더: `#/guides/vscode` 전체 렌더 + 랜딩(도시 맵) 무변경 + 진입 링크 확인 — `assets/ag3-2026-07-07/vscode-guide-full.png`, `landing-check.png`
- 실패 모드(진입점 우회): 소비 로그에 로컬 ui-dictionary 경로 접근 없음
- 노이즈 정정: 에이전트가 남긴 `src/index.css` EOL-only 변경은 revert

## 관찰 (후속 재료)

- **레시피 커버리지 충분**: 이 페이지는 기존 5종 레시피로 충분 — 수요 주도 확장 발동 안 함.
- **showcase-card 적응 편차(투명 보고됨)**: 카드 content region을 인터랙티브 데모 대신 정적 추천 텍스트로 사용 — 문서 페이지 맥락의 의도적 적응. 레시피에 "정적 콘텐츠 variant"를 명시할지는 레시피 확장 pass 재료.
- **토큰 스코핑 패턴 검증**: 외부 프로젝트에 자체 디자인이 있어도 `.askewly-guide` 클래스 스코프 CSS vars로 충돌 없이 반입 가능 — design-bridge 백로그(semantic 변수 블록 방출)와 연결되는 패턴.

## Evidence

- development-dictionary 커밋 `7aa2685` (+530줄: vscode-guide.tsx, askewly-guide.css, App.tsx 최소 diff)
- 스크린샷 2장: `docs/research/assets/ag3-2026-07-07/`

# SP2 — HTML 트랙 스킬 업그레이드 검증

> 2026-07-31 · plan: `plans/2026-07-31-sp2-html-track-upgrade.md` · changeset: custom-skills `changesets/20260731-sp2-html-track-upgrade` (커밋 9346b41·f64a4ee)

## 구현 (SP1 채택 3건)

1. **커스텀 브랜드 테마 트랙** — `meta.template: "custom"` + 덱 로컬 `content/theme.json`: theme.mjs(REQUIRED_THEME_VARS 29키 — 계획서 "26키"는 추정치, 코드 정본 29·customThemeErrors·registerCustomTheme) · io/builder-core 주입 훅 · schema enum · validator(실존+키 전건, 누락=FAIL) · `scripts/design-md-to-theme.mjs`(DESIGN.md colors 휴리스틱 매핑, 미해석 키는 기본값 미채움+exit 1) · fixture `custom-theme-smoke`.
2. **1장 캘리브레이션 승격** — SKILL.md G5 를 "대표 1장 스타일 캘리브레이션 루프"로 대체 서술(편차 체크 4항: 앵커·간격·키컬러 단일성·푸터, 코드 diff 교정, 수렴 반복).
3. **리디자인 입력 트랙(md)** — SKILL.md §1 입력 + authoring-contract.md 절차 절(절→슬라이드 매핑, 수치·인용 보존, 주장 추가 금지).

## 검증

- 소스: smoke-runner **18 fixtures + 3 negative 전부 PASS** (기존 17 무회귀 + custom-theme-smoke 신규) · 음성 케이스: theme.json 에서 chart-3 제거 → validator `ERROR ... missing required keys: chart-3`, exit 1.
- 배포: `setup.sh` 출고 정합 통과 (커밋 가드 2건 검사 — claude·codex 배포본 동일 확인).
- 랩 실증 (배포본): `~/.claude/skills/.../scripts/design-md-to-theme.mjs` 를 `research/sources/minimax-design-md.md` 에 실행 → theme.json 29 vars → custom 템플릿 1장 빌드(validate·build·overflow PASS) → Chrome 실렌더 `evidence/slide-pipeline/img/lab-custom-theme-proof.png`. 콘솔 에러는 favicon 404 1건뿐.
- 대조: 변환 산출 vars == fixture 고정본 **identical** · SP1 수동 매핑 핵심 hex 10키 전부 일치.
- 편차 명기: SP1 랩의 레이아웃 교정(좌측 앵커·푸터 스왑 등)은 **브랜드 프리셋(덱 로컬) 사안**이라 스킬 기본 CSS 에 넣지 않았다 — canonical 3테마 무접촉(회귀 게이트) 원칙. 절차로는 G5 캘리브레이션 루프가 그 교정을 재현하도록 문서화됨.

## finding

- 계획서 "26키" 표기 vs 코드 정본 29키 — 튜닝값 결정 로그대로 코드가 정본, 여기 정정 기록.
- 변환기 chart-3 이 SP1 수동(#a855f7)과 다른 값(#3b82f6 — brand-blue-mid) 선택 — 브랜드셋 내 순서 휴리스틱 차이, 시각 영향 경미. 필요 시 `--set chart-3=...` 보완 경로 실존.

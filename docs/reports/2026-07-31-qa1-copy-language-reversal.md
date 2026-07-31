# QA1 — 한/영 혼용 카피 정책 (회귀 마감)

- Date: 2026-07-31 · Plan: `plans/2026-07-31-qa1-copy-language-policy.md` · Changeset: `changesets/20260731-qa1-copy-language/`

## 1. 결과

한/영 혼용 정책(용어=영어·자기-목소리=한국어 해요체)을 문서화하고 랜딩에 실제 적용했으나, 사용자 관측에서 기각되어 **영어 단일로 회귀 마감**했다. 잔존 산출물은 `docs/design-system/copy-language.md` — 영어 단일 결정 기록(한국어 재제안 금지 명시)으로 개정해 llms 에 배선 유지. 셸 카피는 원상(영어) 그대로이고, step-3(내비·허브 전환)은 미착수 폐기.

## 2. 이슈와 해결

- **계획 단계 결정이 실물 관측에서 뒤집혔다** — 언어·문체를 AskUserQuestion 문답만으로 확정하고 승인받았으나, 적용본을 본 사용자가 즉시 기각("너무 별론데"). 미커밋 상태라 git checkout 원복으로 손실 없이 회수. ledger interruption(decision_required) 1건 계수.
- 교훈: **취향 축 결정(언어·톤·비주얼)은 문서 합의가 아니라 대표 표면 1곳의 실물 시안 관측을 먼저 받는다.** 다음 취향성 계획부터 "시안 관측 게이트"를 step-1 에 둔다.

## 3. 증거

- Evidence: `evidence/site-polish/qa1-copy-language.md` — step 별 판정 표.
- 실표면: 로컬 preview(4322) 랜딩에서 한국어 전환본 렌더 확인 후 사용자 직접 관측 → 기각 → 원복 후 `git status` 로 셸 파일 무변경 확인.
- 재현: `git show f14d26e` (step-1 정책 초판+llms 배선) → 개정판은 회귀 커밋. `node scripts/generate-llms-txt.mjs` 재실행으로 llms 정합 확인.
- 크기 회고: milestone 이 changeset 1개로 닫혔다 — 원안 3 step 이었으나 회귀로 실질 1 step 분량. 라벨 정합 적발: 회귀 경로에선 판정 무의미하나, "정책 문서만"이라면 step-grade 였다.

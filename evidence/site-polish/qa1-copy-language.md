# QA1 evidence — 한/영 혼용 시도 → 회귀

- 2026-07-31 · plan: `plans/2026-07-31-qa1-copy-language-policy.md` (closed — 회귀)

| 항목 | 결과 |
|---|---|
| step-1 정책 문서 + llms 배선 | PASS — llms 재생성 diff +1줄·기존 무손실, 오타 경로 probe exit 1 감지 (커밋 f14d26e) |
| step-2 랜딩 한국어 전환 | 적용 → tsc·lint(colors 0)·build(755 라우트) PASS → **사용자 관측 기각** → git checkout 원복 |
| 재결정 | 영어 단일 확정(AskUserQuestion) — 정책 문서 개정, 한국어 재제안 금지 명시 |
| step-3 | 미착수 폐기 |

- 교훈: 언어·톤 같은 취향 결정은 문서 승인만으로 확정하지 말고, 대표 표면 1곳의 실물 시안으로 먼저 관측받는다. ledger interruption(decision_required) 1건 계수.

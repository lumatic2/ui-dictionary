# changeset: qa1-copy-language

- Milestone: QA1 — 한/영 혼용 카피 정책 정본화 + 셸 적용 (plan: `plans/2026-07-31-qa1-copy-language-policy.md`)
- Date: 2026-07-31

## step-1 — 카피 언어 정책 문서 + llms 배선

- `docs/design-system/copy-language.md` 신설 — 원칙(영어=UI 용어·고유명·코드·데모 콘텐츠 / 한국어=자기 목소리), 문체(해요체·em dash 금지·직역투 금지), 표면 판정표 15행, CTA 혼용 형태, 에이전트 계약.
- `scripts/generate-llms-txt.mjs` FIXED_ASSETS Principles 절에 배열 항목 1개 추가 → llms 재생성(diff +1줄, 기존 목록 무손실).
- Failure probe: 등재 경로 오타 1회 주입 → `SSOT source missing` exit 1 감지 확인 후 원복.

## 회귀 마감 (2026-07-31)

- step-2(랜딩 한국어 전환) 적용본을 사용자가 관측 후 기각("너무 별론데") → 미커밋 원복, AskUserQuestion 재결정 = **영어 유지로 회귀**.
- 정책 문서를 **영어 단일 기록**으로 개정(한국어 재제안 금지 명시), llms 설명 갱신·재생성. step-3 미착수 폐기.
- 부수 정리: DM1 이월 llms vocabulary 재생성분(style-tokens.yml 에 dark-mode 항목 +54줄·index.md 카운트) 이 changeset 에 합류.

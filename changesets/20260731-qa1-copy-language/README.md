# changeset: qa1-copy-language

- Milestone: QA1 — 한/영 혼용 카피 정책 정본화 + 셸 적용 (plan: `plans/2026-07-31-qa1-copy-language-policy.md`)
- Date: 2026-07-31

## step-1 — 카피 언어 정책 문서 + llms 배선

- `docs/design-system/copy-language.md` 신설 — 원칙(영어=UI 용어·고유명·코드·데모 콘텐츠 / 한국어=자기 목소리), 문체(해요체·em dash 금지·직역투 금지), 표면 판정표 15행, CTA 혼용 형태, 에이전트 계약.
- `scripts/generate-llms-txt.mjs` FIXED_ASSETS Principles 절에 배열 항목 1개 추가 → llms 재생성(diff +1줄, 기존 목록 무손실).
- Failure probe: 등재 경로 오타 1회 주입 → `SSOT source missing` exit 1 감지 확인 후 원복.

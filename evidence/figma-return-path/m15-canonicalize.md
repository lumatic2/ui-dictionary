# M15 정본화·배선 evidence

Date: 2026-08-02 · Plan: `plans/2026-08-01-m15-figma-return-path-canonicalize.md`

## DoD 3표면 배선 확인

1. **정본 문서**: `methodology/figma-workflow.md`(③ push 장부 필수·⑤ 기계화 회수 기본 경로 승격·함정 4건 Changelog) + `docs/design-system/figma-bridge-contract.md`(§1 채널 현행화, §3 두 lane 분리 — 3a 사람 디테일링 회수/3b 레퍼런스 흡수). Verify: `grep -n "figma-return-diff\|figma-push-snapshot\|yusung345" methodology/figma-workflow.md docs/design-system/figma-bridge-contract.md` — 양 문서 실재, M14 evidence 절차와 문장 단위 정합. partial 표기 준수: 변경 반영 구간 실증 출처를 FW2-1 로 명기.
2. **llms**: FIXED_ASSETS §Contracts 등재 → 재생성 → `public/llms.txt` 37행 노출 + `public/llms/docs/design-system/figma-bridge-contract.md` 사본 생성. `npm run lint:llms` PASS(소스·생성물 정합), build 759 routes PASS, oxlint 선재 경고만.
3. **스킬**: figma-codex-workflow `in-progress→promoted`(git mv, 사용자 승인 2026-08-01) + M14 교훈 반영 + ask-yusung 라우터 등재 + setup.sh 배포. 본문 diff 0(~/.claude·~/.codex 양면, frontmatter 슬리밍·CRLF 제외), 출고 정합 85건 PASS. custom-skills 791033f·8de9b6a push 완료.

## 발견

- 계약 §5 "미반영 3건"은 내용이 아니라 버킷 문제였다(원본에 기반영·미배포) — Gap 서술이 실사로 정정됨.
- 배포본 검증은 frontmatter description 슬리밍·CRLF 변환을 감안해야 한다(`--strip-trailing-cr` + 본문 기준).

# changeset: m15-figma-return-path-canonicalize

Milestone: M15 — 귀환 절차 정본화·배선
Plan: `plans/2026-08-01-m15-figma-return-path-canonicalize.md`

## step-1 — 방법론·계약 갱신

- `methodology/figma-workflow.md`: ③ push 스냅숏 장부 필수·MCP 재등록 절차·20kb 청크·FNV Math.imul 함정, ⑤ 기계화 회수(스냅숏 대조)를 기본 경로로 정본 승격, 도구 좌표 표 갱신, Changelog.
- `docs/design-system/figma-bridge-contract.md`: §1 채널 현행화(2026-08-01 실측 반영), §3 을 두 lane(3a 사람 디테일링 회수=기계화 / 3b 레퍼런스 흡수=선별)으로 분리 명문화, Changelog.
- Verify: grep 대조 — 스크립트명(figma-push-snapshot·figma-return-diff)·계정 문자열이 양 문서에 실재, M14 evidence 와 절차 서술 정합.

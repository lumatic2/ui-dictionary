# 프로토콜·안티패턴 재정렬 — 판정-중심 + 한글 줄바꿈 (AD4 갭 ②③④)

- Date: 2026-07-17
- Milestone: AD4 Step 2 (plan: `docs/plans/2026-07-17-ad4-gap-driven-expansion.md`)
- Scope: `docs/design-system/entry-protocol.md`(재정렬), `docs/design-system/anti-patterns.md`(클러스터 13 추가), `examples/ui-vocabulary-site/public/llms*`(generator 재생성 — chat recipe 포함 46 assets)

## What

- **갭 ③ (DF-3)**: entry-protocol을 판정-중심으로 재정렬 — 서두를 "judgment injection, not style injection"으로 재프레임, 토큰 단계를 "프로젝트 디자인 시스템이 look을 소유, askewly tokens는 무토큰 프로젝트 fallback·명시 요청 시만"으로 강화, Rules에 스타일 수렴=실패 조항 추가.
- **갭 ④ (DF-2, hook 불사용 사용자 확정)**: 시그니처 자가 판정을 의무 단계로 명문화 — "no runtime hook will remind you; this document is the only place the obligation lives" + 판정 없는 보고는 미완성 + DF-1/DF-2 2/2 스킵 전례 명시.
- **갭 ② (DF-1·DF-2)**: anti-patterns 클러스터 13 "한글 타이포그래피·줄바꿈" — `break-keep` 원칙/왜(영어 목업에서 안 보이는 실패)/위반 예(chat recipe·DF 장부)/에이전트 지시형 문구.

## Verification

- [x] `node scripts/generate-llms-txt.mjs` 재생성 PASS — 46 assets(chat recipe 신규 포함), llms.txt에 chat-conversation-panel 노출 grep
- [x] 과교정 방지 probe: "fallback when the project has no tokens" 경로 잔존 grep 1 (무토큰 프로젝트 기본값 보존)
- [x] 판정 의무 명문 probe: "mandatory step" grep 1 + anti-patterns "break-keep" grep 2
- [x] site `npm run build` PASS (재생성 자산 포함)
- [x] 배포 curl: entry-protocol·anti-patterns·신규 recipe 200 + 오경로 404 (push 후 기록)

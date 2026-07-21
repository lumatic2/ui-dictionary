# 챗/대화 UI recipe — chat-conversation-panel (AD4 갭 ①)

- Date: 2026-07-17
- Milestone: AD4 Step 1 (plan: `docs/plans/2026-07-17-ad4-gap-driven-expansion.md`)
- Scope: `recipes/application-ui/chat-conversation-panel.md`(신규), `examples/ui-vocabulary-site/src/components/chat-conversation-panel.tsx`(신규 code_asset + colocated demo), `src/lib/recipe-gallery-data.ts`·`src/lib/recipe-gallery-demo-registry.ts`(gallery 배선)

## What

- dogfooding 장부 DF-1·DF-2가 2/2로 재확인한 갭: 챗/대화 UI recipe 부재 → 수요 주도 신설.
- Recipe 내용이 DF에서 실측된 실패를 그대로 계약화: bounded thread(`role="log"` polite), 대기 상태(typing dots + reduced-motion + sr-only), 에러 행(아이콘+텍스트+단일 Retry, draft 보존), 한글 `break-keep`, Enter 전송/Shift+Enter 줄바꿈, 빈 draft·대기 중 send disabled.
- Contract: recipe frontmatter는 `recipe-format.md` 준수(semantic 토큰만), 코드 SSOT = code_asset, gallery는 수동 배선 2곳.

## Verification

- [x] `python scripts/validate-recipes.py` — recipes ok: 36 (신규 포함, 토큰 실존·8섹션·code_asset 검증)
- [x] site `npm run build` PASS
- [x] 브라우저 실구동(dev 5199): 빈 상태 → 3턴 대화 → 3턴째 에러 발화 → Retry 회복, `word-break: keep-all` computed, send disabled(빈 draft), 라이트/다크 스크린샷 (`chat-panel-light.png`·`chat-panel-dark.png`)
- [x] 시그니처 자가 판정: 원칙 5/5(사이트 자체 토큰만·액센트=신호·절제 계층·상태 완비·실험 터치 없음), 비선호 0(keep-all·lucide·좌측 라인/이모지/리터럴 없음)

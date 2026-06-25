# Step 9: batch-3-app-dashboard-layout-patterns

## 읽어야 할 파일

- `docs/plans/2026-06-26-ui-vocabulary-full-component-expansion.md` — 왜: Batch 3 scope와 stop condition을 확인한다.
- `docs/ui-vocabulary/terms.yml` — 왜: app/dashboard layout terms를 추가한다.
- `examples/ui-vocabulary-site/src/components/term-visual.tsx` — 왜: layout mini visual을 구현한다.
- `phases/ui-vocabulary-encyclopedia/step8.md` — 왜: 직전 batch 결과를 이어받는다.

## 작업

Batch 3 app/dashboard layout patterns 20개를 추가한다. 대상 예: `permission-state`, `locked-state`, `offline-state`, `maintenance-state`, `syncing-state`, `saving-indicator`, `unsaved-changes-banner`, `session-expired-dialog`, `upgrade-prompt`, `quota-warning`, `trial-banner`, `destructive-confirmation`, `success-toast`, `error-toast`, `notification-center`, `notification-list`, `status-chip`, `health-indicator`, `connection-status`, `retry-panel`.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site
npm run build
npm run lint
```

## 검증 절차

1. step 9를 `in_progress`로 바꾼다.
2. 20개 term과 visual variant를 추가한다.
3. build/lint/render smoke를 실행한다.
4. 성공하면 step 9를 `completed`로 갱신한다.

## 금지사항

- 상태 메시지를 모두 alert로 뭉개지 않는다. 각 상태가 다른 상황에서 쓰이는 이유를 one_liner/anti_use에 남긴다.


# Step 3: Origin UI Data/Feedback/Layout Batch

## 읽어야 할 파일

- `phases/external-ui-ecosystem-vocabulary/index.json` — 왜: Origin UI coverage의 이전 batch summary를 확인한다.
- `docs/plans/2026-06-27-external-ui-ecosystem-vocabulary.md` — 왜: M1 완료 후 M2로 넘어가는 중단점을 확인한다.
- `docs/ui-vocabulary/terms.yml` — 왜: data-display, feedback, layout 후보와 기존 항목을 비교한다.
- `docs/ui-vocabulary/deployment.md` — 왜: production deploy gate와 `ui-dictionary` 원격 배포 절차를 확인한다.

## 작업

Origin UI/coss ui에서 data display, feedback, layout/grouping 계열의 남은 고가치 후보를 승격한다. 이후 M1 전체 통합 검증을 수행하고, 사용자 배포 승인 후 production smoke까지 확인한다.

M1 종료 시:

- `ROADMAP.md`의 `ui-vocab-origin-ui-coverage` DoD 충족 여부를 확인한다.
- 충족하면 harness roadmap sync로 milestone 완료 처리한다.
- M2 `ui-vocab-shadcn-blocks-ecosystem-coverage`를 다음 후보로 제안한다.

## Acceptance Criteria

```bash
python scripts/validate-ui-vocabulary.py
cd examples/ui-vocabulary-site && npm run build:data && npm run build && npm run lint
cd ../..
node scripts/audit-ui-vocabulary-candidates.mjs --strict-duplicates
```

## 검증 절차

1. AC 커맨드 실행
2. Chrome smoke로 새 항목 검색 및 visual 렌더 확인
3. 사용자 승인 후 `git push ui-dictionary main`
4. `https://ui.askewly.com/` production smoke
5. milestone 완료 가능 여부 판단

## 금지사항

- 사용자 승인 없이 production deploy를 하지 않는다.
- M2 후보를 M1에 섞지 않는다. shadcn block ecosystem 전용 후보는 다음 milestone으로 넘긴다.

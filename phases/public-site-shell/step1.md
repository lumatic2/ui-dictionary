# Step 1: Verification and Status Sync

## 읽어야 할 파일

- `phases/public-site-shell/index.json` — 왜: step 0 결과와 최종 phase 상태를 갱신해야 함.
- `ROADMAP.md` — 왜: PSS1 milestone 완료 여부와 evidence를 sync해야 함.
- `docs/plans/2026-07-04-public-site-shell.md` — 왜: step tree 체크박스를 implementation result와 맞춰야 함.
- `examples/ui-vocabulary-site/package.json` — 왜: 검증 명령이 npm scripts에 정의되어 있음.

## 작업

홈페이지/IA shell 구현 후 build/lint를 실행하고, phase status와 ROADMAP milestone을 완료 상태로 동기화한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
cd examples/ui-vocabulary-site && npm run lint
```

## 검증 절차

1. AC 커맨드 실행.
2. browser smoke로 homepage desktop/mobile first viewport를 확인.
3. `phases/public-site-shell/index.json` step 1을 completed로 갱신.
4. ROADMAP PSS1을 `roadmap_sync.py complete`로 완료 처리한다.

## 금지사항

- build/lint 실패를 무시하지 마라.
- unrelated dirty Tailwind evidence files를 커밋에 섞지 마라.

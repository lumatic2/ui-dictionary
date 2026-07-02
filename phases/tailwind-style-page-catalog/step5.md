# Step 5: Docs/Term polish and final smoke

## 읽어야 할 파일

- `examples/ui-vocabulary-site/src/App.tsx` — 왜: Docs landing, empty state, page copy, routing.
- `examples/ui-vocabulary-site/src/components/term-page.tsx` — 왜: one-page-per-term detail surface.
- `examples/ui-vocabulary-site/src/lib/navigation-model.ts` — 왜: Docs/Plus path labels and term relationships.
- `docs/research/assets/tailwind-docs-viewport.png` — 왜: Docs concept navigation and prose reference.

## 작업

Docs와 term detail의 설명 방식을 Tailwind-style로 정리하고 최종 검증한다.

Target behavior:

- Docs는 개념/속성군 reference로 보인다.
- Term page는 canonical path, also appears in, related terms가 명확하다.
- Empty/recovery UI가 카드형 제품 shell처럼 튀지 않는다.
- Browser back/reload/direct URL이 유지된다.

## Acceptance Criteria

```powershell
cd examples/ui-vocabulary-site
npm run build
npm run lint
npm run audit:visuals
python ..\..\scripts\validate-ui-vocabulary.py
git diff --check
```

Chrome smoke:

- `?page=docs`
- `?page=plus`
- `?page=plus&filter=nav%3Aplus-templates-dashboard-screens`
- `?page=index&q=command`
- `?page=term&id=command-palette`
- console error 0개.

## 검증 절차

1. 모든 AC 커맨드를 실행한다.
2. Chrome smoke를 desktop/mobile width로 확인한다.
3. 결과를 사용자에게 쉬운 말로 보고한다.
4. step과 phase 상태를 갱신한다.

## 금지사항

- production deploy/push는 사용자 승인 없이 하지 마라.
- 기존 unrelated dirty change를 revert하지 마라.

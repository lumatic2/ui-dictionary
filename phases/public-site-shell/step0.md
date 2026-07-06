# Step 0: Homepage and IA Entrypoints

## 읽어야 할 파일

- `docs/design-system/site-blueprint.md` — 왜: `ui.askewly.com/` 홈페이지의 first viewport, section order, top-level navigation contract가 정의되어 있음.
- `docs/PRD.md` — 왜: public website, paid asset, agent guidance 제품 목적을 구현 문구와 CTA에 반영해야 함.
- `docs/ARCHITECTURE.md` — 왜: 현재 앱 스택과 검증 명령, site implementation 위치가 정의되어 있음.
- `examples/ui-vocabulary-site/src/App.tsx` — 왜: 현재 page mode, topbar, sidebar, Plus/Docs 렌더링을 보존하면서 home mode를 추가해야 함.
- `examples/ui-vocabulary-site/src/components/topbar-search.tsx` — 왜: 홈페이지 첫 viewport에도 search/command affordance가 보여야 하며 기존 검색 UX와 충돌하면 안 됨.

## 작업

현재 Vite React 앱에 `home` page mode를 추가하고, 기본 진입 `ui.askewly.com/`이 새 public homepage를 렌더링하도록 한다.

구현 규칙:

- 기존 Plus/Docs/Term 페이지는 삭제하지 않는다.
- 홈페이지 UI는 별도 `HomePage` 컴포넌트로 만든다.
- 첫 viewport에는 제품명, 제품 약속, 검색/command affordance, 최소 3개의 실제 UI preview가 보여야 한다.
- 홈페이지 CTAs는 기존 구현으로 이동해야 한다. 예: Surfaces/Patterns는 Plus filters, Components는 Docs element pages, Docs는 docs page로 이동.
- top-level navigation은 Docs, Patterns, Showcase, Resources, Pro만 보여주고, Home은 로고 클릭으로 처리한다.

## Acceptance Criteria

```bash
cd examples/ui-vocabulary-site && npm run build
```

## 검증 절차

1. AC 커맨드 실행.
2. `/` 기본 진입이 home page mode로 시작하는지 코드와 browser smoke로 확인.
3. 기존 `?page=docs`, `?page=term`, `?filter=nav:plus-application-ui` 흐름이 깨지지 않았는지 확인.
4. `phases/public-site-shell/index.json` step 0을 completed로 갱신.

## 금지사항

- 기존 Tailwind-derived 구현을 삭제하지 마라. 이유: 새 IA 아래로 재배치할 콘텐츠다.
- App 전체 라우터를 대규모로 교체하지 마라. 이유: 현재 dirty worktree와 기존 filter URL 호환성을 지켜야 한다.
- 홈페이지를 텍스트-only hero로 만들지 마라. 이유: blueprint가 실제 UI previews를 요구한다.

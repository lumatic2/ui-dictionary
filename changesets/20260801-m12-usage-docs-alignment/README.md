# Changeset — M12: 사람용 사용법 문서화 (설치 경로 정합 + Quickstart)

Date: 2026-08-01 · Goal: `usage-and-site-surfacing` (연쇄 1/2) · Plan: `plans/2026-08-01-m12-usage-docs-alignment.md`

## step-1 — 설치 경로 정합 수정 + 상호 링크

- **문제**: 사이트가 사람에게 제시하는 유일한 설치 명령이 존재하지 않는 패키지 `ui-dictionary` 를 가리킴(npm 404). 실제 배포명 `@askewly/design`(0.3.0, 레지스트리 200), bin `askewly-design`.
- **정정 3파일**: `documentation-pages.ts:220`(Getting set up 코드블록 — 레시피 예시 id 도 실존 id 로: sidebar-application-shell·mobile-signup-field-stack·topbar-command-search), `article-documentation-layout.tsx:163`, `App.tsx:2007`(docs-copy-button 데모 하드코딩).
- **생성물 재생성**: `build:catalog`(recipe-sources.generated.ts 에 물질화된 사본 1건 해소 — 잔존 grep 0), llms 재생성(entry-protocol 변경분).
- **상호 링크**: entry-protocol.md 의 사람용 루프 언급에 실제 URL(`/docs/getting-started-setup`) + README §How to use 참조 추가.
- 검증: grep 잔존 0 · site build(prerender 755) PASS.

## step-2 — 사람용 Quickstart 정본 신설

- **README §How to use in a new project**: Explore→Install→Inject→Verify 4단계 + 사이트 Getting set up·templates·llms.txt 링크. 사이트 페이지가 사람용 루프의 정본, README 는 요약+링크(이중 정본 방지).
- **`templates/README.md` 신규**: 12개 템플릿 파일의 용도·적용 순서 인덱스 + `$DESIGN_HARNESS_ROOT`(저자 로컬 design-manual) 의존 조각 명시 — 제3자는 CLI 경로로 우회.
- **`methodology/design-md-guide.md`**: 외부 스크립트 의존 경고 블록 1개 추가(제3자 대체 경로 = DESIGN.md.tmpl + published CLI).
- 검증: 상대 링크 실존 확인 · 명령 표기 step-1 정본과 정합(grep) · 구표기 잔존 0.

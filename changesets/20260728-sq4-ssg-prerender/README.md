# changeset — SQ4: SSG/prerender

> Milestone: SQ4 (goal `site-quality`) · Plan: `plans/2026-07-28-sq4-ssg-prerender.md` · 2026-07-28

## step-1 — 프리렌더 생성기 + 빌드 편입

- `scripts/prerender-ui-vocabulary.ts`(레포 루트) 신설 — vite-node 로 실행해 앱 데이터 모듈(terms.generated·navigation-model·documentation-pages·search)을 `@` alias 그대로 임포트(계획 기술 결정 ⑤). 라우트별 `dist/<route>/index.html` 생성: 고유 title·meta description·og:title/url/description·twitter·canonical + `#root` 첫 페인트 정적 콘텐츠(용어 = 카테고리·한/영 이름·정의·설명, 컬렉션 = 경로·항목 링크, docs = 브레드크럼·제목·lead·섹션 제목, 허브·정적 페이지 포함).
- 노출 게이트 재현: exposure.ts 는 vite-node 아래서 DEV=true 라 쓰지 않고 데이터 필드로 직접 판정(shell 문서 제외·plus-templates 게이트·빈 termIds 컬렉션 제외).
- 안전장치: 템플릿 앵커 부재·중복 라우트·비안전 경로문자 = 빌드 실패로 소리내기. 삽입 문자열 전수 HTML 이스케이프(기술 결정 ⑥).
- `package.json` — postbuild 훅(`vite-node ../../scripts/prerender-ui-vocabulary.ts`) + devDependency `vite-node`. CF 빌드 커맨드 무변경.

검증: `npm run build` — 754 라우트 생성 311ms(빌드 시간 영향 미미) · spot HTML 4종(title·og:url·canonical 고유값) · "Spacing &amp; layout" 이스케이프 확인 · dist index.html 수 = 754.

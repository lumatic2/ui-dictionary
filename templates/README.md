# templates/ — 부트스트랩 템플릿 인덱스

새 프로젝트에 Askewly Design 을 붙일 때 쓰는 조각들이다. 어느 것도 자동 적용되지 않는다 — 아래 순서대로 필요한 것만 복사한다. (사람용 전체 절차: [사이트 Getting set up](https://ui.askewly.com/docs/getting-started-setup) · 레포 `README.md` §How to use)

## 적용 순서

1. **`DESIGN.md.tmpl`** → 프로젝트 루트 `DESIGN.md` 로 복사 후 채운다. Google Stitch 공식 스키마(flat frontmatter + 8섹션) 정합판 — 작성 순서·요령은 [methodology/design-md-guide.md](../methodology/design-md-guide.md).
2. **`claude-design-section.md.tmpl`** → 프로젝트 `CLAUDE.md` 에 디자인 규칙 절로 병합. 코딩 에이전트가 DESIGN.md 를 단일 출처로 읽게 만든다.
3. **`gitignore.append`** → 프로젝트 `.gitignore` 에 이어붙인다 (디자인 하니스 산출물 제외).
4. 토큰·레시피 주입은 템플릿이 아니라 published CLI: `npm install -D @askewly/design` → `npx askewly-design init` (DESIGN.md + tokens.css 생성) / `npx askewly-design add <recipe-id>`.

## 검증 조각 (선택)

- **`playwright.config.ts.tmpl`** + **`tests/design.spec.ts.tmpl`** — 시각 회귀(VRT) 스캐폴드. `test:vrt` 스크립트와 함께 쓴다.
- **`package.json.scripts.json`** — `lint:design`/`build:design`/`test:vrt` 스크립트 조각. ⚠ `$DESIGN_HARNESS_ROOT`(저자 로컬 `design-manual` 레포) 의존 — 제3자는 `lint:design`/`build:design` 대신 CLI `init` 산출물을 쓴다.
- **`hooks/design-lint.sh`** — DESIGN.md 변경 시 pre-commit lint. 같은 `design-manual` 의존 — 하니스가 없으면 조용히 skip 하도록 작성돼 있다.

## Brief Studio (디자인 브리프 인터뷰 도구)

- **`brief-studio.html`** — self-contained 브리프 선택 스튜디오 (타일·축 선택 UI). 직접 편집 금지 — 데이터 치환은 `make-studio.py`.
- **`make-studio.py`** — `--data <studio-data.json> --out <studio.html>` 로 스튜디오 HTML 생성. 기준 데이터: `studio-data.default.json`.
- **`brief-studio-server.py`** — 스튜디오 정적 서빙 + 선택 결과(`brief-selections.json`) 수집 서버 (기본 포트 8960, 표준 라이브러리만).
- **`fetch-stock.py`** — Pexels 스톡 후보 fetch (Brief Studio 이미지 축 연동). 환경변수 `PEXELS_API_KEY` 필요.

운용 맥락: [docs/design-system/brief-studio.md](../docs/design-system/brief-studio.md)

## Changelog

- 2026-08-01: M12 — 최초 작성 (템플릿 용도·적용 순서·외부 의존 명시).

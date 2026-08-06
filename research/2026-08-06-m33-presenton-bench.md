# Presenton 정밀 벤치마크 — 실사·실구동·대조

> 2026-08-06 · 소비처: `/pt` 스킬(`~/projects/custom-skills/promoted/pt/`) — 채택분은 별도 milestone 으로 반영
> 등록 출처: `research/2026-07-31-html-upgrade-goal-refs.md` §4-D2 "Presenton 벤치마크 정밀 조사(별도 리서치 후보)"
> 방법: 얕은 클론 정독(하위 모델 위임 1회 + 부모 표본 재확인) → **로컬 모델로 실구동** → 산출물 실물 대조
> 인용 규칙: 외부 사실은 경로/URL + 접근일 **2026-08-06**. 확인 못 한 것은 §6 에 그대로 남긴다.

## 1. 실사 — 무엇을 어떻게 만드는가

**고정 정보** (`git rev-parse HEAD` 실측): commit `bed1fc6c31b94d844191893a1c212d8fbe0f6d0b` · 기본 브랜치 `main` ·
**Apache-2.0**(`LICENSE` 실물 확인) · 최근 커밋 2026-08-05 · 실행 버전 배너 `0.9.3-beta` ·
GitHub API 실측 stars **9,395**, 언어 TypeScript (https://api.github.com/repos/presenton/presenton, 접근 2026-08-06).

**구성** — 백엔드 `servers/fastapi/`(Python/FastAPI, SQLAlchemy+Alembic), 프런트 `servers/nextjs/`(Next.js+Tailwind,
Konva 기반 슬라이드 편집기), 데스크톱 래퍼 `electron/`, 템플릿 `templates/<name>/template.json` 7종
(dynamic·executive·general·modern·momentum·standard·swift). 배포 정본은 Docker (`ghcr.io/presenton/presenton:latest`, 실측 **5.27GB**).

**생성 파이프라인** (진입점 실측):

| 단계 | 진입점 | 산출 |
|---|---|---|
| 생성 요청 | `POST /api/v1/ppt/presentation/create` (`api/v1/ppt/endpoints/presentation.py`) | `PresentationModel` 행 |
| 아웃라인 | `GET /outlines/stream/{id}` (`endpoints/outlines.py:84`) → `utils/llm_calls/generate_presentation_outlines.py` | `PresentationOutlineModel {slides:[{content}]}` — SSE 스트림, `dirtyjson` 파싱 |
| 구조 결정 | `POST /presentation/prepare` → `utils/llm_calls/generate_presentation_structure.py` | `PresentationStructureModel {slides:[int]}` — **레이아웃 인덱스 배열** |
| 콘텐츠 채우기 | `GET /presentation/stream/{id}` → `utils/llm_calls/generate_slide_content.py` | 레이아웃별 `json_schema` 에 맞춰 슬라이드 UI 트리 |
| export | `utils/export_utils.py::export_presentation()` → Next.js `/pdf-maker` 페이지를 Puppeteer 로 렌더 | PDF / PPTX |

핵심 구조: **레이아웃이 먼저 정해지고, 그 레이아웃의 JSON 스키마가 LLM 의 출력 형식을 강제한다.**
`templates/v2/schema.py::get_template_schema()` 가 `template.json` 을 `layouts:[{layout_id, schema}]` 로 바꿔 그 계약을 만든다.

**레이아웃·테마 모델** — 레이아웃은 **JSON 선언**(`templates/general/template.json` 실측 12 layouts, 각 `{id, description, components}`).
커스텀 템플릿은 DB(`models/sql/template_v2.py`)에 저장되고, 코드형 레이아웃은 `templates/layout_code_validation.py` 가
Next.js `/api/validate-layout-code` 로 **렌더해서** 검증한다. 테마는 `models/theme_data.py` 의
`ThemeData{primary, background, card, stroke, background_text, primary_text, graph_0..9}` +
`GeneratedColorPalette`(lightness 변주 자동 생성) — **손으로 쓰는 토큰 파일이 아니라 프로그램이 파생**한다.

**검증 게이트** — 스키마 검증은 있다(`utils/llm_utils.py::get_schema_validation_errors`, Pydantic validator,
아웃라인 단어 수 제한 `utils/outline_limits.py`). 테스트 스위트도 실재한다(`servers/fastapi/tests/` unit·integration·
edge_cases·regression + 스냅숏). **오버플로 검사·대비 검사에 해당하는 자동 게이트는 찾지 못했다** —
`overflow` 문자열은 렌더러의 CSS 처리에서만, `contrast` 는 차트/표 색 유틸에서만 나온다(grep 근거 §6).

**export 트랙** — `Literal["pdf", "pptx"]`(`services/export_task_service.py:497`) **2종. HTML export 없음.**
실행체는 레포에 없고 **별도 레포 `presenton/presenton-export` 릴리스를 빌드 때 내려받는다**
(`scripts/sync-presentation-export.cjs`). 이미지 안 실물 확인: `/app/presentation-export/` 에
`index.cjs`·`node_modules`(sharp 포함)·`py/convert-linux-x64` 바이너리, 버전 `v0.4.2`. PDF 는 Puppeteer(헤드리스 Chromium).

## 2. 실구동 — 유료 키 0으로 돌렸다

계획의 무료 경로 규칙대로 **유료 API 키를 쓰지 않고** 로컬 모델로 돌렸다. 지원 LLM 제공자 16종
(`enums/llm_provider.py`)에 `ollama`·`lmstudio` 가 있어 가능했다.

```
docker run -d --name presenton-bench -p 5111:3009 -p 5112:8009 \
  -e LLM=ollama -e OLLAMA_URL=http://host.docker.internal:11434 \
  -e OLLAMA_MODEL=gemma4:12b -e CAN_CHANGE_KEYS=true \
  -v <scratchpad>/presenton-data:/app_data ghcr.io/presenton/presenton:latest
```

- **이미지 제공자 미설정으로 진행**했고 생성은 정상 완료됐다 — 이미지 자리는 플레이스홀더로 채워진다(스크린샷의 줄무늬 판).
  README 예시가 전부 `IMAGE_PROVIDER=pexels` 를 붙이지만 **필수는 아니었다**(실측).
- **첫 실행에 로컬 관리자 계정 설정이 필요하다**(`POST /api/v1/auth/setup`). 외부 크리덴셜이 아니라
  자기 인스턴스 계정이라 scratchpad 안에서 생성했다.
- **함정 — 앱이 컨테이너 안에서 루프백에만 바인딩한다.** `-p 5111:3000` 매핑은 연결이 안 되고(호스트 `000`),
  컨테이너 내부 `curl 127.0.0.1:3000` 만 200이다. `--network host` 로도 `/` 가 500이라, 컨테이너 안에서
  Node 로 `0.0.0.0:3009 → 127.0.0.1:3000` TCP 포워더를 띄워 열었다. 배포 문서에 없는 실측 함정.
- 실행 시간(참고, 이 기기 gemma4:12b): 아웃라인 5장 약 **43초**, 슬라이드 5장 스트림 약 **6분**.

**산출물** — 주제 "Design tokens: how a portable design system keeps one visual identity across products", 5장.
스크린샷: `<scratchpad>/bench-shots/presenton-deck-1.png` (편집기 화면, 1·2장 노출).
관측된 품질 특징:
- 레이아웃 배분이 실제로 다르다(좌우 반전·아이콘 2열·요약 그리드). 타이포 위계는 또렷하고 대비도 무난.
- **본문이 LLM 산문 그대로**다 — "Modular design elements that can be scaled effortlessly across web, mobile,
  and desktop apps" 류. 슬라이드 문법(짧은 명사구)으로 압축하는 층이 없다.
- **아웃라인 파싱 잔여물이 제목에 샜다** — 생성된 title 이 `" Design Tokens: … Presenter:"` 로 끝난다.
  아웃라인 마크다운의 `Presenter: [Name]` 줄이 제목으로 흘러들어간 것(실측, `/tmp/outline.txt`).
- 이미지 슬롯이 플레이스홀더라 5장 중 4장이 같은 줄무늬 판을 쓴다(제공자 미설정 시의 기본 모습).

## 3. `/pt` 트랙과 항목별 대조

> 우리 쪽 근거는 **`/pt` 소스 실측**이다(§0 요약 재사용 금지 — 아래 §4 에 요약이 틀린 지점을 적었다).

| 축 | Presenton | `/pt` (우리) | 판정 |
|---|---|---|---|
| 단일 원본 | DB 행 + `ui` JSON 트리(`models/sql/slide.py`) | `content/slides.json` 1개 파일 (`templates/slides.schema.json`) | 우리가 앞섬 — 파일 1개라 diff·리뷰·수기 편집이 된다 |
| 레이아웃 정의 | 템플릿별 `template.json` 의 layouts(general 12종) | `templates/layout-meta.json` **19종** (cover·closing·hero-cards·comparison-2col·step-flow·diagram-box·summary-grid·bento-grid·case-map·split-screen·timeline-cards·pipeline-lanes·result-transitions·chart-interactive·three-scene·before-after·qr-embed·hero-motion·svg-filter-scene) | 대등 — 수는 우리가 많고, **인터랙티브 레이아웃은 우리만** 있다 |
| 레이아웃 선택 | **LLM 이 인덱스 배열로 결정**(`generate_presentation_structure.py`) | 사람이 G2 구성안에서 승인(`SKILL.md` 게이트 표) | **차용 후보 A** — 자동 배분 자체가 아니라 *스키마로 출력 형식을 강제하는 방식* |
| 콘텐츠 생성 | 레이아웃 `json_schema` 로 LLM 출력 강제 | 사람이 문구 작성/승인(G3) | **차용 후보 A** (아래 §4-①) |
| 테마·토큰 | `ThemeData` 7색 + lightness 자동 변주 | `dark`/`light`/`askewly`/`custom`(레포 `DESIGN.md` 파생, `design-md-to-theme.mjs`) | 우리가 앞섬 — 토큰 SSOT 에서 파생, 다크 판본까지(M30) |
| 검증 게이트 | 스키마 검증 + 테스트 스위트. **오버플로·대비 자동 검사 없음** | validate + 거장 원칙 린트 R1~R3 + `overflow-checker.mjs` + 캘리브레이션 루프 | **우리가 앞섬 — 이 벤치의 가장 큰 격차** |
| export | PDF·PPTX 2종(외부 바이너리 + Puppeteer) | raster PDF·vector PDF·PPTX(bespoke 포함)·**단일 파일 HTML** 4종 | 우리가 앞섬 |
| 배포·설치 | Docker 5.27GB, 웹 앱·데스크톱·MCP 서버 | 스킬 + 스크립트(설치 없음) | 대등 — 목적이 다르다(제품 vs 작업 절차) |
| 협업·편집 | 브라우저 편집기(Konva)·AI 채팅 편집·템플릿 생성 UI | 없음(코드·JSON 편집) | **Presenton 이 앞섬** |
| 자동화 진입 | REST + **MCP 서버**(`mcp_server.py`, `presentation/generate` 등 허용목록) | 스킬 호출 | 대등 — 접근 방식이 다르다 |

### 3.1 산출물 1:1 육안 대조 (스크린샷 양쪽)

- **Presenton**: `<scratchpad>/bench-shots/presenton-deck-1.png` (이번 실구동 산출, 편집기 화면)
- **`/pt`**: `~/projects/custom-skills/promoted/pt/references/exemplars/02-exemplar-body.png` (기존 산출물 재사용 — 계획 §스캐폴딩 허용)

같은 "3항목 카드 나열" 계열 장면을 나란히 놓고 본 결과:

| 관측 축 | Presenton | `/pt` exemplar |
|---|---|---|
| 본문 문장 | 완결 산문 2줄("Modular design elements that can be scaled effortlessly across web, mobile, and desktop apps") | 짧은 명사구("5개 대시보드를 새벽에 자동 수집") |
| 밀도 | 좌우 2단에 이미지+텍스트, 여백 적음 | 카드 3장 + 넓은 상하 여백 |
| 색 | 보라 강조를 아이콘 배지·밑줄에 반복 사용 | 강조 1색을 번호·아이콘에만, 나머지 무채 |
| 이미지 | 플레이스홀더 줄무늬 판이 4/5장 반복 | 이미지 없이 타이포·구조로 지탱 |
| 첫인상 | 도구가 만든 티가 난다 — 문장이 슬라이드가 아니라 문서다 | 발표 지면으로 읽힌다 |

**이 대조가 §4-① 판정의 근거다.** Presenton 의 강점은 "레이아웃 스키마가 채워질 자리를 정해 준다"는 구조이고,
약점은 그 자리에 **문서 문장이 그대로 들어간다**는 것이다. 우리 트랙은 문구 게이트(G3)로 그걸 막지만
슬롯 계약은 느슨하다 — 그래서 가져올 것이 ① 하나로 좁혀진다.

## 4. 판정 (A/B/C — `docs/design-system/absorption-criteria.md` 어휘)

- **① 레이아웃 스키마로 LLM 출력을 강제하는 구조 — A(원리 흡수).**
  Presenton 은 레이아웃을 먼저 고르고 그 레이아웃의 JSON 스키마를 생성 계약으로 준다. 우리 `slides.json` 은
  스키마가 있지만 **레이아웃별 슬롯 계약이 생성 시점 강제**로 쓰이지는 않는다. 코드 복사가 아니라 원리 차용.
  소비처: `/pt` 의 G2→G3 사이. 라이선스는 Apache-2.0 이라 코드 차용도 가능하나 **원리만으로 충분하다**.
- **② 자동 레이아웃 배분(LLM 이 인덱스 배열 결정) — B(관찰만).**
  우리 트랙은 구성안 사람 승인이 게이트고 그게 품질의 축이다. 자동 배분을 넣으면 그 게이트가 무의미해진다.
  다만 "후보 3안 제시" 정도의 보조로는 재검토 여지 — finding 으로만.
- **③ 브라우저 편집기·AI 채팅 편집 — B.** 제품 표면이지 우리 트랙의 부품이 아니다. 북극성의 "제작 표면 왕복"은
  Figma 경로로 이미 결정돼 있다(2026-07-22 사용자 확정).
- **④ 테마 자동 변주(lightness 파생 팔레트) — C(보류).** 우리는 토큰 SSOT + 접근성 자기검사로 더 엄격하게 한다.
  덮어쓸 이유가 없다.
- **⑤ export 아키텍처(외부 바이너리 + Puppeteer) — B.** 우리 4트랙이 이미 앞서 있다. 참고만.
- **⑥ MCP 서버로 생성 API 노출 — B(관찰).** 우리 진입은 스킬이라 층이 다르다.

**총평**: 목적이 가장 가까운 최근 진입자이지만, **품질 게이트에서 우리가 확실히 앞선다**(오버플로·대비·캘리브레이션 부재).
Presenton 이 앞선 곳은 *제품성*(웹 편집기·설치형 배포·MCP)이고, 그건 우리 트랙이 겨냥한 자리가 아니다.
가져올 것은 **① 하나**다.

## 5. 후속 후보 (finding 등록)

- `/pt` G2→G3 에 **레이아웃별 슬롯 계약을 생성 시점 강제**로 넣을지 검토 (판정 ①). 별도 milestone.
- 자동 레이아웃 배분을 "후보 제시" 수준으로만 도입할지 (판정 ②, 낮은 우선순위).

## 6. 확인 못 한 것

- 기본 DB 엔진(sqlite vs postgres) — `services/database.py` 미열람.
- PPTX 변환 바이너리 내부 구현 — `presenton-export` 레포 미클론(릴리스 zip 만 확인).
- `.github/` CI 워크플로 내용.
- 오버플로·대비 관련 문자열이 **게이트인지 렌더 동작인지** 최종 확정 못 함 — grep 근거:
  `grep -rli overflow servers/nextjs` 는 렌더러 파일만, `grep -rli contrast servers/nextjs` 는 차트/표 색 유틸만 반환.
  린트·테스트 파일에서는 안 나왔다.
- 루트 `layouts.json`(259KB)이 빌드 산출물인지 수기 소스인지.
- "Sign in with ChatGPT" 무료 경로의 백엔드 구현 — 사용하지 않았다(사용자 계정 필요).
- **1:1 대조에서 우리 쪽은 기존 exemplar 재사용**이라 **주제가 다르다**(계획 §스캐폴딩이 재사용을 허용).
  같은 주제로 우리 덱을 새로 만들었다면 문구 게이트가 붙은 결과라 더 유리하게 나왔을 것이다 —
  이 대조는 "양쪽의 기본값이 어떻게 생겼나"까지만 말한다.

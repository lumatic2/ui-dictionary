# M22 harvest mining ledger — 소스 레벨 재료 채굴 (5 표면)

> 2026-08-04 · 소비처: `plans/2026-08-04-m22-harvest-mining.md` (M22 쓰기 정본) · 입력: 사용자 지목 재료 ①~⑭ (plan 「사용자 지목 재료」 절)
> 채굴 방식: 레포당 sonnet worker 1(읽기 전용) — 카드 전건 실코드 파일:라인 인용. 원본 fragment: 세션 scratchpad `mining-*.md`.

## 채굴 — brain (second-brain/poc-graph)

# 소스 레벨 재료 채굴 — second-brain/poc-graph (brain.askewly.com)

대상 레포: `C:\Users\yusun\projects\second-brain\poc-graph` (읽기 전용 채굴, 파일 미수정)

핵심 파일: `viewer.html` (=`dist/index.html`, 3834줄, 단일 페이지 앱) · `graph.json` (노드 203/엣지 732) · `worker/*.ts` (Cloudflare Worker 서빙+ask API)

---

### ① 컬러감 (brain)
- 소스: `viewer.html:33-48` (CSS 변수), `viewer.html:412-434` (타입/관계 컬러 맵)
  ```js
  const TYPE_META = {
    semantic:{ko:"개념", color:"#6E8FC4", glyph:"planet"},
    reflective:{ko:"통찰", color:"#C4A9D9", glyph:"crystal"},
    procedural:{ko:"절차", color:"#7FCDB5", glyph:"mechanism"},
    episodic:{ko:"사건", color:"#F58F6E", glyph:"comet"},
    thesis:{ko:"주장", color:"#D98BA6", glyph:"seal"},
    topic:{ko:"주제", color:"#3E5F94", glyph:"orbit"},
    unclassified:{ko:"미분류", color:"#8A8472", glyph:"pebble"},
  };
  ```
  ```css
  --bg:#0A0A0A; --panel:#111111; --ink:#FAFAFA; --mut:#888888;
  --primary:#3E5F94; --accent:#7FCDB5; --hot:#F58F6E;
  ```
- 구현 요지: 다크 배경(`#0A0A0A`) 위에 노드 타입(7종)마다 고정 hex 컬러 + SVG 글리프(행성/크리스탈/기계/코멧/인장/궤도/조약돌)를 매핑. 엣지도 관계 종류(`REL_META`, `viewer.html:422-434`, 13종)별 고정 hex + 방향성(`dir:true/false`)을 가짐. 계층(은하/성단/궤도) 노드는 별도 `HIER_COLOR`(`viewer.html:442`, galaxy `#3E5F94`/cluster `#7FCDB5`/system `#C4A9D9`)를 쓴다. 엣지 색은 `EDGE_NEUTRAL`(`#B8B3AA`)을 베이스로 노드 컬러와 소량(`.22`) lerp.
- 의존성: 없음(순수 JS 상수 객체, CSS 변수). `hexA()`(`viewer.html:438`) 헬퍼로 hex→rgba 변환.
- 추출 난도: **하** — `TYPE_META`/`REL_META`/CSS 변수 블록만 복사하면 즉시 재사용 가능한 독립 팔레트.

### ② 지식 그래프 연결 방식 (brain)
- 소스: `graph.json` 스키마 (노드 예시, 엣지 예시), `viewer.html:1052-1103`(force 설정), `viewer.html:2304`(`linkColor`)
  ```json
  // node
  { "id":"10-Resources/.../ai/llm-adversary-harness-pattern.md", "label":"...", "type":"semantic",
    "domain":"ai", "hierarchy":{"galaxy":"ai-building","cluster":"ai","system":"agents","role":"star"},
    "body_ko":"...", "body_en":"...", "source_card":{...} }
  // edge
  { "source":"...", "target":"...", "type":"link", "rel":"extends",
    "provenance":{"layer":"semantic","kind":"source-link","reviewed":false},
    "overview_visible":true, "overview_emphasis":true }
  ```
- 구현 요지: 노드는 vault 마크다운 파일 1개=1노드(203개), `type`(7종 semantic/reflective/procedural/episodic/thesis/topic/unclassified)과 3단 계층(`hierarchy.galaxy > cluster > system`, role=`galaxy|cluster|system|star`)을 동시에 가짐 — 계층 노드는 `hierarchy_virtual` 플래그로 실노드와 구분(`isHier()`, `viewer.html:439`). 엣지(732개)는 방향성 관계(`rel`: supports/extends/requires/refines/instantiates/contradicts/triggered-by/composes/mentions/related/contains) + 무방향 태그/유사 관계(near-miss/topic-tag/thesis-tag)로 구성, `provenance.reviewed`로 사람 검수 여부 추적. 물리는 3D에서는 자체 force 어댑터(`d3Force`를 흉내내는 `{strength()}` 스텁, `viewer.html:1405`)로 커스텀 레이아웃(궤도/성단 배치, `layoutHints`/`clusterPairHints`)을 쓰고, 2D 폴백은 `force-graph`(d3-force 래퍼) 라이브러리의 기본 `charge`/`link` force를 그대로 사용(`forceCharge()`, `viewer.html:1051-1056`).
- 의존성: `graph.json`(빌드 산출물, `build_brain.py`/`extract_graph.py`로 생성), `force-graph@1.43.5`(2D), 커스텀 3D 물리 코드.
- 추출 난도: **중** — 스키마 자체는 이식하기 쉽지만 3계층 hierarchy + custom force 어댑터가 뷰어 코드 전반(레이아웃 모드 5종: overview/topic/cluster/thesis/time)에 얽혀 있어 물리 로직만 따로 떼려면 어댑터 인터페이스 정리가 필요.

### ③ three.js 활용 코드 (brain)
- 소스: `viewer.html:404-410`(임포트), `viewer.html:1117-1166`(씬 구성), `viewer.html:1618-1690`(노드 포인트 클라우드 커스텀 셰이더), `viewer.html:1696-1766`(엣지 라인 커스텀 셰이더)
  ```js
  import * as THREE from "three";
  import { TrackballControls } from ".../controls/TrackballControls.js";
  import { EffectComposer } from ".../postprocessing/EffectComposer.js";
  import { UnrealBloomPass } from ".../postprocessing/UnrealBloomPass.js";
  ```
  ```js
  const material = new THREE.ShaderMaterial({
    uniforms:{ uTime, uNear, uFar, uMotion, uMinDistance, uCameraDistance },
    vertexColors:true, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:`... gl_PointSize = clamp(aSize*breath*zoomScale*emphasisScale, 1.4, 14.0); ...`,
    fragmentShader:`... float core = smoothstep(0.52,0.0,d); ... gl_FragColor = vec4(coreColor*..., alpha); ...`
  });
  const points = new THREE.Points(geometry, material); // 노드 전체를 단일 Points 오브젝트로
  ```
- 구현 요지: CDN import map(`three@0.183.2` esm)으로 로드, `WebGLRenderer` + `EffectComposer`(`RenderPass`+`UnrealBloomPass`)로 블룸 포스트프로세싱. 노드는 개별 Mesh가 아니라 **단일 `THREE.Points` + 커스텀 vertex/fragment 셰이더**(발광 포인트 스프라이트, `gl_PointCoord` 기반 원형 코어+헤일로, `AdditiveBlending`)로 203개를 한 드로우콜에 렌더 — 카메라 거리에 따라 크기·투명도 감쇠. 엣지도 동일 패턴으로 `THREE.LineSegments` + 커스텀 셰이더(펄스 강도 `aIntensity`, `AdditiveBlending`). 카메라 컨트롤은 `TrackballControls`(회전 비활성, 미들=dolly/우클릭=pan). `WebGL` 미지원 시 `supportsWebGL()`(`viewer.html:1057-1065`) 체크로 2D(`force-graph`+Canvas)로 자동 폴백(`initGraph()`, `viewer.html:1067-1077`).
- 의존성: `three@0.183.2`(CDN jsdelivr `+esm`), three examples jsm(`TrackballControls`/`EffectComposer`/`RenderPass`/`UnrealBloomPass`, CDN 직접 경로), `force-graph@1.43.5`(2D 폴백).
- 추출 난도: **중상** — 셰이더+블룸+trackball 조합 자체는 독립적으로 뜯어낼 수 있는 "발광 포인트 클라우드" 컴포넌트지만, 노드/엣지 위치 갱신·hover/raycast(`viewer.html:1313-1335`, `Points` 대상 raycast)·2D 폴백 동기화가 `threeState` 전역 객체 하나에 강하게 결합돼 있어 분리 시 상태 관리 재설계 필요.

### ④ UI (brain)
- 소스: `viewer.html:287-325`(사이드 패널 마크업), `viewer.html:927-944`(범례 렌더링), `viewer.html:946-957`(태그 필터 pill), `viewer.html:327-349`+`3761-3805`(질문 입력바), `viewer.html:3419-3436`(패널 태그 칩)
  ```js
  function buildLegends(g) {
    document.getElementById("leg-nodes").innerHTML = Object.keys(nc)...map(t => {
      const m = metaOf(t);
      return `<div class="leg" data-nt="${t}">${nodeGlyph(t)}<span class="ko">${m.ko}</span><span class="en">${t}</span><span class="ct">${nc[t]}</span></div>`;
    }).join("");
    ...
    document.querySelectorAll("[data-nt]").forEach(el => el.onclick = () => toggleNodeTypeHighlight(el.dataset.nt, el));
  }
  ```
  ```js
  async function askSubmit() {
    ...
    const r = await fetch("/api/ask", { method:"POST", headers:{...}, body:JSON.stringify({ question:q }) });
    ...
    j.answer ? renderAnswer(j.answer) : setAnswer("오류: " + esc(j.error || r.status), "error");
  }
  ```
- 구현 요지: 좌측 고정 사이드바(`#side`, 260px)에 "렌즈"(레이아웃 모드 세그먼트 버튼 5종), "주제·태그로 보기"(은하 단위 focus pill, `.focus-pill`), "노드 간격"(charge 세그먼트), "노드 유형"/"연결 종류" 범례(`#leg-nodes`/`#leg-edges`, 클릭 시 하이라이트 토글) 순서로 배치. 하단 중앙 고정 질문바(`#ask`, pill 모양, 로그인 전엔 `readonly`+클릭 시 인증 모달)와 답변 카드(`#answer`, 마크다운 렌더+인용 칩 `.cite`/`.cite-ref`+출처 리스트). 우측 슬라이드 패널(`#panel`, 노드 클릭 시 열림)은 제목/한영 부제/본문/출처카드/태그 칩(`#p-tags`)/관계별 그룹 연결 칩(`.rel-group`)을 표시. 모바일은 사이드바가 `transform:translateX(-100%)`로 접히고 `#side-toggle` 버튼으로 토글.
- 의존성: `marked@12`(답변 마크다운), `gsap@3.15.0`(카메라 이동/타임라인), Worker `/api/ask` 엔드포인트(`worker/ask.ts`).
- 추출 난도: **하** — 사이드바/범례/태그칩/질문바 마크업+CSS+토글 핸들러는 그래프 렌더러와 약결합(DOM id 참조뿐)이라 정적 UI 셸로 그대로 떼어내기 쉽다. 단, 질문바는 백엔드 `/api/ask`(`worker/ask.ts`, RAG 스타일 evidence selection) 의존이라 UI만 떼면 목업 상태로 남는다.

### +추가: 인증 모달 & 게스트/인증 상태 전환 (brain)
- 소스: `viewer.html:171-201`(CSS), `viewer.html:351-376`(마크업), `viewer.html:112-115`(`#ask.guest`/`#ask.authed` 상태 클래스)
- 구현 요지: 이메일/비밀번호 로그인 + "Google로 로그인" + "가입 요청 보내기" 3버튼 구성의 다크 카드 모달(`#auth-modal`, `backdrop-filter:blur`). 질문바는 `.guest`/`.authed` 클래스로 아이콘(자물쇠↔말풍선)과 placeholder(`"로그인 후 질문하기"`)를 스위칭. 게이트가 필요한 "질문하기"는 로그인, 그래프 탐색 자체는 비로그인 허용이라는 접근 정책이 CSS 상태값에 그대로 드러남.
- 의존성: Worker `worker/auth.ts`(미상세 확인, jose 라이브러리로 JWT 추정).
- 추출 난도: **하** — 모달 마크업/CSS/상태 클래스 토글은 그래프와 무관한 독립 컴포넌트.

### +추가: HUD (우상단 포커스 오버레이) (brain)
- 소스: `viewer.html:236-243`(CSS), `viewer.html:274-279`(마크업)
- 구현 요지: 노드 선택 시 우상단에 "Knowledge Universe" 킥커 + 큰 포커스 타이틀 + 힌트 텍스트 + "N memories activated" 활성 배지를 표시하는 오버레이(`pointer-events:none`). 질문에 답이 오면 관련 근거 노드가 그래프에서 빛나는("activated") 것과 짝을 이루는 시각 피드백.
- 의존성: 없음(그래프 상태 JS 변수만 참조).
- 추출 난도: **하** — 독립 오버레이 위젯.

---

## 소스-라이브 불일치 메모
- `worker/ask.ts`(340줄, RAG evidence selection 로직)와 `worker/auth.ts`는 이번 채굴에서 카드 근거로 인용하지 않았다(④의 `/api/ask` 호출부만 확인) — UI 재료 채굴 범위를 벗어나므로 미상세. 로컬(`localhost`)에서는 `askSubmit()`이 `/api/ask` 호출을 건너뛰고 "그래프 점등만 확인" 메시지를 보여주도록 하드코딩돼 있음(`viewer.html:3769-3773`) — 로컬 실행 시 실제 답변 흐름은 라이브에서만 검증 가능.

---

## 채굴 — 본체 (examples/ui-vocabulary-site)

# M22 소스 레벨 재료 채굴 — ui-vocabulary-site 본체

대상: `C:\Users\yusun\projects\ui-dictionary\examples\ui-vocabulary-site` (읽기 전용, 수정 없음)
핵심 파일: `src/components/home-page.tsx`(3229줄) · `src/components/landing-hero.tsx` · `src/index.css` · `src/lib/palette-generator.ts`
기등재 registry(`registry.json` items, 30종) 중 관련: `canvas-particle-field` · `mesh-gradient-surface` · `scroll-driven-reveal` · `lazy-three-object-scene`

---

### ⑤ 랜딩 페이지 히어로 구성 (본체)
- 소스: `src/components/landing-hero.tsx:1-35` (전체) + `src/components/home-page.tsx:3016-3227` (`FloatingField`, `HeroSearch`)
- 핵심 코드:
  ```tsx
  <h1 className="mt-4 text-center text-[clamp(3.5rem,16vw,8rem)] font-semibold leading-[0.9] tracking-normal text-foreground">
    Askewly Design
  </h1>
  ...
  <HeroSearch filter={filter} terms={terms} onNavigate={onNavigate} onSearch={onSearch} />
  <ShowcaseAtlas />
  ```
- 구현 요지: `LandingHero`가 `FloatingField`(배경 장식, ⑦ 참조) → 대형 `clamp()` 타이틀 → 서브카피 → CTA 버튼 2개(Get Started/Open Docs) → `HeroSearch`(검색바+자동완성 드롭다운) → `ShowcaseAtlas`(12칸 쇼케이스 그리드) 순으로 세로 스택. 검색바는 `getSearchSuggestions` 훅으로 실시간 후보를 뽑아 키보드 네비게이션(방향키/Enter/Escape)까지 갖춘 완결형 컴포넌트(`HeroSearch`, `home-page.tsx:3075-3227`).
- 의존성: React state/ref만 사용, 외부 라이브러리 없음(lucide-react 아이콘 제외).
- 기존 자산 중복: 없음 — registry에 히어로 레이아웃 자산 없음. 다만 아래 `+추가: Hero Composition Demo`(변형 로테이션 쇼케이스)와는 별개 개념(이건 실제 배포 히어로, 그건 쇼케이스 데모용 A/B 변주).
- 추출 난도: 중 — 구조 자체는 단순 세로 스택이라 낮지만, `HeroSearch`의 자동완성 로직(`getSearchSuggestions`, `search-suggestions.ts` 의존)과 outside-click/keyboard 핸들링까지 통째로 옮기려면 검색 데이터 모델(`terms.generated.ts`, `TermFilter`)까지 같이 따라온다.

---

### ⑥ 마우스 포인터 효과 (본체)
- 소스 A (Cursor-Reactive Field 데모, `AtlasDemo id==="pointer"`): `src/components/home-page.tsx:164-171`(타입), `469-506`(life-decay 인터벌), `869-916`(렌더+포인터 핸들러)
- 소스 B (히어로/쇼케이스 배경 바 reveal): `src/components/home-page.tsx:331-384`(`InvertedField`), `3016-3073`(`FloatingField`) — 둘 다 `pointermove`에 `--cursor-x/--cursor-y` CSS 변수를 세팅하고 거리 기반으로 `data-revealed` 토글
- 핵심 코드:
  ```tsx
  const closestX = Math.max(rect.left, Math.min(event.clientX, rect.right))
  const closestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom))
  const distance = Math.hypot(event.clientX - closestX, event.clientY - closestY)
  block.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`)
  if (distance <= revealRadius) block.dataset.revealed = "true"
  ```
  ```tsx
  // pointer 데모: 24x18 셀 그리드, 포인터 근접도로 글리프(o/_/>)와 life(감쇠 타이머) 갱신
  const influence = Math.max(0, 1 - distance / 7)
  const glyph = influence > 0.76 ? "o" : cluster % 5 === 0 ? "_" : ">"
  const life = Math.max(cell.life, Math.round(2 + influence * 13))
  ```
- 구현 요지: 두 가지 별개 기법. (1) **CSS 변수 기반 근접 조명** — `document.addEventListener("pointermove", ...)`로 전역 포인터를 추적해 각 장식 요소의 로컬 좌표를 CSS var로 밀어넣고, `::after`의 radial-gradient(48px 원)가 그 var를 읽어 마스크처럼 빛나게 함(`index.css:226-233`, `:310-323`). (2) **문자 그리드 필드 데모** — 384개(24×18) 셀을 상태로 들고 포인터 좌표와의 거리로 글리프를 바꾸고 85ms 인터벌로 life를 감쇠시켜 잔상처럼 사라짐.
- 의존성: 순수 React state + DOM 이벤트, 라이브러리 없음.
- 기존 자산 중복: 없음 — registry의 `canvas-particle-field`는 물리 시뮬레이션(matter-js) 기반이라 별개 기법. `mesh-gradient-surface`도 무관.
- 추출 난도: 상(그리드 필드 데모)/하(CSS var reveal) — 그리드 필드는 384-cell 상태 배열 + 감쇠 인터벌이라 성능/이식 고려가 필요하고, CSS var reveal은 `pointermove` 리스너 + `::after` radial-gradient 패턴 2줄로 어디든 붙일 수 있음.

---

### ⑦ 배경 장식 — 흩어진 바 + 그리드 (본체)
- 소스: `src/components/home-page.tsx:131-162`(`floatingBlocks`/`invertedBlocks` 좌표 데이터), `:3016-3073`(`FloatingField`), `:331-384`(`InvertedField`); CSS `src/index.css:128-166`(그리드 배경), `:290-495`(블록 float 애니메이션 변수 20종), `:1591-1620`(다크모드 오버라이드)
- 핵심 코드:
  ```ts
  const floatingBlocks = [
    { id: "a", className: "left-[7%] top-[16%] hidden h-28 w-8 xl:block", tone: "deep" },
    { id: "b", className: "left-[10%] top-[28%] hidden h-8 w-4 md:block", tone: "deep" },
    // ... 20개, tone: deep|mid|soft|pale
  ]
  ```
  ```css
  .floating-grid-field {
    background-image:
      url("data:image/svg+xml,...path d='M56 44v24M44 56h24'..."), /* 십자 도트 패턴 */
      linear-gradient(rgba(2,6,23,.045) 1px, transparent 1px), /* 세밀 그리드 */
      linear-gradient(90deg, rgba(2,6,23,.04) 1px, transparent 1px),
      linear-gradient(rgba(2,6,23,.08) 1px, transparent 1px), /* 굵은 그리드 */
      linear-gradient(90deg, rgba(2,6,23,.075) 1px, transparent 1px);
  }
  ```
- 구현 요지: 세로 막대(bar) 20개를 절대좌표(%)로 흩뿌리고 반응형 breakpoint(`hidden md:block` 등)로 화면 크기별 개수를 줄임. 각 바는 `tone`(deep/mid/soft/pale, 불투명도 계층)과 개별 float 애니메이션 변수(`--float-x/y/duration/delay`, 바마다 다른 값)를 가져 부유감을 냄. 배경 그리드는 5겹 레이어(십자 도트 SVG data-URI + 세밀/굵은 그리드 각 2겹)를 겹쳐 depth를 만드는 순수 CSS. 다크섹션(`InvertedField`)은 같은 구조를 색 반전(흰 바, `filter: invert(1)` 그리드)으로 재사용.
- 의존성: 순수 CSS(data-URI SVG 패턴), 라이브러리 없음.
- 기존 자산 중복: 없음 — registry item 목록에 배경 장식/그리드 자산 부재. `canvas-particle-field`(matter-js 물리)와는 무관.
- 추출 난도: 하 — 좌표 배열 + CSS 변수 애니메이션 패턴이라 그대로 복사해 색/개수만 조정하면 이식 가능. 단 다크모드 대응(`:1591-1620`)까지 챙기려면 CSS 오버라이드 블록도 함께 가져와야 함.

---

### +추가: Product Surface Coverflow (등재 미확인 → 추가 채굴)
- 소스: `src/components/home-page.tsx:965-1123` (`CoverflowCard`, `CoverflowDemo`)
- 핵심 코드:
  ```tsx
  let pos = index - active
  if (pos > total / 2) pos -= total
  if (pos < -total / 2) pos += total
  const x = pos * 66
  const rotateY = -side * 44
  const z = -abs * 70
  const scale = Math.max(0.6, 1 - abs * 0.14)
  ```
- 구현 요지: 6종 제품 서피스 카드(analytics/calendar/kanban/media/chat/pricing)를 2.6초 인터벌로 자동 순환시키며 3D perspective(`transformStyle: preserve-3d`)로 좌우 회전+깊이+스케일을 계산하는 루프형 3D 캐러셀. `pos` 부호로 좌우, 거리로 rotateY/z/scale/opacity를 감쇠.
- 의존성: 순수 CSS 3D transform, 라이브러리 없음.
- 기존 자산 중복: 없음.
- 추출 난도: 중 — 순환 거리 계산(`shortest signed distance`) 로직은 재사용 가치가 높지만 카드 내용(6종 프리뷰)은 예시성이라 실제 이식 시 자체 콘텐츠로 교체 필요.

### +추가: Hero Composition Demo (등재 미확인 → 추가 채굴)
- 소스: `src/components/home-page.tsx:1322-1407` (`HeroCompositionDemo`), 관련 데이터는 `heroCompositions`/`HERO_COMPOSITION_CYCLE_MS`(파일 내 별도 정의, 1322 이전)
- 핵심 코드:
  ```tsx
  <div role="tablist" aria-label="Hero composition variant" ...>
    {heroCompositions.map((item, index) => (
      <button role="tab" aria-selected={index === activeIndex} onClick={() => setActiveIndex(index)}>{item.label}</button>
    ))}
  </div>
  ```
- 구현 요지: "search" 증거형과 "workspace" 증거형 등 여러 히어로 조합(eyebrow+headline+subcopy+CTA 2개+proof 위젯)을 탭으로 전환하거나 자동 순환(interval)시켜 보여주는 A/B 변주 쇼케이스. 실제 배포 히어로(⑤)와는 별개로, "히어로를 어떻게 조합할 수 있는지"의 패턴 카탈로그 역할.
- 의존성: 없음(순수 React state).
- 기존 자산 중복: 없음. ⑤(실제 히어로)와 컨셉이 이어지지만 구현은 분리된 컴포넌트.
- 추출 난도: 하 — `composition` 데이터 배열 교체만으로 변주 추가 가능한 구조.

### +추가: Image Treatment Demo (등재 미확인 → 추가 채굴)
- 소스: `src/components/home-page.tsx:2279-2384` (`ImageRecipe` 타입, `imageRecipes`, `ImageTreatmentDemo`)
- 핵심 코드:
  ```tsx
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
  <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="alphaNoise" />
  <feComponentTransfer in="alphaNoise"><feFuncA type="linear" slope="4.2" intercept="-1.7" /></feComponentTransfer>
  ```
- 구현 요지: CSS `filter`(grayscale/sepia/contrast/saturate)와 오버레이 `mixBlendMode`, 그리고 SVG `feTurbulence`→`feColorMatrix`→`feComponentTransfer` 체인으로 만든 필름 그레인을 조합해 3종 사진 보정 레시피(Duotone+Grain/Warm Film/High-Contrast Mono)를 4.5초마다 순환. 그레인은 흔한 "smooth gray haze"가 아니라 luminance→alpha 변환 후 contrast를 강제로 올려 또렷한 speckle로 만든 것이 핵심 트릭(주석에 명시).
- 의존성: 순수 CSS filter + inline SVG filter, 라이브러리 없음.
- 기존 자산 중복: 없음.
- 추출 난도: 하 — SVG 필터 하나 + 레시피 객체 배열로 완결. 어디든 이식 가능.

### +추가: Color Palette Generator Demo (등재 미확인 → 추가 채굴)
- 소스: `src/components/home-page.tsx:1565-1635+`(`ColorPaletteGeneratorDemo`, 훨씬 더 길게 이어짐 — drag reorder, shade picker, HSV picker, export 패널 포함) + `src/lib/palette-generator.ts`(`createGeneratorPalette`, `generatePaletteFromSeed`, `buildPaletteQuality` 등 로직 본체)
- 핵심 코드:
  ```tsx
  const [palette, setPalette] = useState<GeneratorColor[]>(() => createGeneratorPalette(0))
  const paletteQuality = useMemo(() => buildPaletteQuality(palette), [palette])
  ```
- 구현 요지: 완결형 팔레트 생성기 UI — 시드 기반 팔레트 생성(`palette-generator.ts`), 드래그로 색 순서 변경, 색상 클릭 시 HSV 피커+shade set 패널, "quality" 평가(`buildPaletteQuality`), export 패널, 복사 토스트까지 갖춘 프로덕션급 도구형 데모. 단순 쇼케이스 카드가 아니라 실사용 가능한 별도 기능.
- 의존성: `src/lib/palette-generator.ts`(hex/hsv 변환 로직 포함), 외부 라이브러리 없음.
- 기존 자산 중복: 없음 — registry에 색상 도구 자산 없음.
- 추출 난도: 상 — UI 코드량이 가장 많고(1565줄 이후 수백 줄) `palette-generator.ts` 로직 전체를 함께 옮겨야 완전히 동작. 부분 추출(팔레트 생성 로직만)은 하.

---

## 참고 — 명칭은 겹치지만 기법이 다른 것 (혼동 주의)
- `ShaderGradientDemo`(`home-page.tsx:2247-2277`, `@paper-design/shaders-react`의 `MeshGradient`로 실제 WebGL 셰이더 렌더) vs 기등재 `mesh-gradient-surface`(`src/components/mesh-gradient-surface.tsx`, 순수 CSS radial-gradient 4겹 스택, 라이브러리 없음). **같은 "메시 그라디언트" 명칭이지만 구현 기법이 완전히 다르다** — 후자는 정적/저비용 tier ①, 전자는 실제 셰이더 tier. 자산화 시 별도 항목으로 분리 필요.
- `MatterPhysicsDemo`(`home-page.tsx:2809-` 이하, `matter-js` 엔진으로 실제 물리 시뮬레이션)는 기등재 `canvas-particle-field`와 이름은 안 겹치지만 "물리 기반 캔버스 데모"라는 카테고리가 겹칠 수 있어 자산화 전 상호 비교 필요(본 세션에서 `canvas-particle-field.tsx` 내부 로직까지는 diff하지 않음 — 필요 시 후속 확인 권장).

---

## 채굴 — bootcamp (ai-bootcamp-2026)

# 소스 레벨 재료 채굴 — bootcamp.askewly.com (ai-bootcamp-2026)

대상 레포: `C:\Users\yusun\projects\ai-bootcamp-2026` (읽기 전용, 실코드만 인용)

### ⑧ 마키(marquee) (bootcamp)
- 소스: `src\components\brand-marquee.tsx` (전체 25줄) + `src\app\globals.css:161-186`
  ```tsx
  // brand-marquee.tsx
  <div
    className="animate-marquee flex w-max items-center gap-8"
    style={{ animationDuration: `${Math.round(names.length * 1.15)}s` }}
  >
    {[...names, ...names].map((name, i) => (
      <span key={`${name}-${i}`} aria-hidden={i >= names.length}>{name}</span>
    ))}
  </div>
  ```
  ```css
  /* globals.css */
  @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .animate-marquee { animation: marquee-x 55s linear infinite; }
  .marquee-mask { mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
  .marquee-mask:hover .animate-marquee { animation-play-state: paused; }
  @media (prefers-reduced-motion: reduce) { .animate-marquee { animation: none; } }
  ```
- 구현 요지: 순수 CSS 애니메이션(JS 불필요). 배열을 두 번 이어붙여(`[...names, ...names]`) 폭 100%→-50% translateX 무한 루프로 이음선 없는 순환을 만든다. 지속시간을 브랜드 개수에 비례시켜(`names.length * 1.15`초) 항목이 늘어도 초당 흐름 속도가 일정하게 유지되도록 인라인 `style`로 동적 주입한다. 마스크 그라디언트로 좌우 페이드아웃, hover 시 `animation-play-state: paused`로 정지, `prefers-reduced-motion`에서 애니메이션 제거.
- 의존성: 없음(Tailwind 유틸 + 순수 CSS `@keyframes`). React는 배열 복제·aria 속성 부여용으로만 사용.
- 추출 난도: 하 — CSS 키프레임 3개 + 컴포넌트 25줄, 외부 라이브러리 의존 없이 그대로 이식 가능.

### ⑨ 히어로 문구 변화 효과 (bootcamp)
- 소스: `src\components\rotating-label.tsx` (전체 24줄) + `src\app\globals.css:138-159` + 호출부 `src\app\page.tsx:33`
  ```tsx
  // rotating-label.tsx
  const LABELS = ["M", "95", "L", "100", "XL", "66"];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % LABELS.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-grid w-[3.4ch] place-items-center overflow-hidden ...">
      <span key={index} className="animate-label-swap inline-block">{LABELS[index]}</span>
    </span>
  );
  ```
  ```css
  @keyframes label-swap {
    0%   { opacity: 0; transform: translateY(0.5em); }
    18%  { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-0.5em); }
  }
  .animate-label-swap { animation: label-swap 1.8s ease-in-out both; }
  @media (prefers-reduced-motion: reduce) { .animate-label-swap { animation: none; } }
  ```
  ```tsx
  // page.tsx:33 — 헤드라인 안에 인라인으로 박혀 있음
  내 사이즈는 <RotatingLabel />,
  ```
- 구현 요지: 트리거는 `setInterval` 1.8초 고정 주기(사용자 인터랙션 아님, 자동 순환). 전환 애니메이션은 JS 상태 변경이 아니라 **React `key={index}` 강제 리마운트 + CSS 키프레임**으로 처리 — index가 바뀌면 새 `<span key={index}>`가 마운트되며 `animate-label-swap`이 처음부터 재생(0%에서 아래→중앙, 100%에서 중앙→위로 사라짐, opacity와 translateY 결합). 폭을 `w-[3.4ch] overflow-hidden`으로 고정해 "M"→"100" 같은 글자수 변화에도 레이아웃 시프트 없음. 접근성은 `prefers-reduced-motion`에서 애니메이션 제거로 처리(단, aria-live 등 스크린리더 안내는 없음 — 순수 시각 장식으로 취급된 듯).
- 의존성: 없음(React `useState`/`useEffect` + 순수 CSS `@keyframes`). 라이브러리(Framer Motion 등) 미사용.
- 추출 난도: 하 — 컴포넌트 24줄 + CSS 키프레임 1개. `key` 리마운트 트릭이 핵심 아이디어이므로 그대로 패턴 문서화 가치 있음. 다만 aria-live 부재는 이식 시 개선점으로 메모할 만함(접근성 처리가 "생략"된 상태 — 있는 그대로 기록).

### +추가: 마스크 그라디언트 유틸 클래스 (`marquee-mask`)
- 소스: `src\app\globals.css:174-176`
- 구현 요지: `mask-image: linear-gradient(...)`로 스크롤 스트립 좌우 페이드아웃을 만드는 범용 유틸. 마키 전용이지만 다른 가로 스크롤 스트립(태그 클라우드, 캐러셀 등)에도 재사용 가능한 독립 패턴.
- 의존성: CSS `mask-image` (모던 브라우저 지원, `-webkit-` prefix 없음 — Safari 구버전 호환 미고려 상태로 기록).
- 추출 난도: 하 — 3줄 유틸리티 클래스.

## 소스-라이브 불일치 메모
- 본 채굴은 소스 코드만 확인했고 배포 라이브 사이트(bootcamp.askewly.com)와의 시각적 대조는 수행하지 않았다(스코프 밖 — 읽기 전용 소스 채굴 지시).

---

## 채굴 — dev (development-dictionary)

# M22 — 소스 레벨 재료 채굴: development-dictionary (dev.askewly.com)

대상 레포: `C:\Users\yusun\projects\development-dictionary` (읽기 전용 조사, 수정 없음)

---

### ⑩ 사전형 사이트 구조 (dev)

- **데이터 스키마**: `docs/development-vocabulary/terms.yml` (YAML 리스트, 1개 항목 예시 `server`는 1~80행). 핵심 필드(스키마 문서 `docs/development-vocabulary/schema.md:17-100`에 예시 항목 전체):
  - `id`, `status`(draft/reviewed/published), `category`, `kind`(framework/platform/service/concept/pattern/workflow/tool/risk)
  - `ko: { name, aliases[] }` / `en: { name, aliases[] }` — 이중 언어 이름+별칭
  - `one_liner`, `what_it_is`, `analogy`(비유 텍스트)
  - `visual_model: { type, nodes[] }` — 다이어그램 서술자 (예: `request-loop`, nodes `[브라우저, 요청, 서버, 응답]`)
  - `concept_image: { path, alt, caption }` — 선택적 로컬 래스터 이미지
  - `explanation_sections: [{ title, body[] }]` — 있으면 UI가 이걸로 렌더, 없으면 generic when-to-use/gotchas 섹션으로 대체
  - `misconceptions[]`, `related: [{ id, relation, note }]`(relation enum: compare/alternative/use-with/part-of/depends-on/connects-to)
  - `when_to_choose[]`, `when_not_to_choose[]`, `ai_prompt_phrases[]`, `gotchas[]`, `output_examples[]`
  - `sources: [{ source_id, note }]` — `docs/development-vocabulary/sources.md`의 Tier 등록 레지스트리를 참조 (source_id 미등록이면 빌드 실패)
  - `confidence`(low/medium/high), `planner_sections[]`(선택 — client/frontend/backend/server/database/auth/security/deployment/operations/ai)
- **빌드/검증**: `scripts/build-development-vocabulary-data.mjs:1-294`
  - `terms.yml` + `sources.md` 파싱 → 필수 필드·enum·source_id 참조·related relation 유효성 전부 런타임 assert (`assertTerm`, 12-194행) — 하나라도 깨지면 빌드 실패
  - 통과하면 각 term에 파생 필드를 얹어 UI용으로 변형: `description=what_it_is`, `visual_anatomy=output_examples`, `when_to_use=when_to_choose`, `anti_use=when_not_to_choose`, `prompt_phrases=ai_prompt_phrases`, `asset={kind:"mini-mock", variant:id}` (217-228행)
  - `src/data/terms.generated.ts`로 TS 리터럴 + 타입(`DevelopmentTerm`/`VocabularyTerm`) 출력 (234-293행) — "Do not edit directly" 배너 포함
- **내비 생성**: 별도 SoT `docs/development-vocabulary/navigation.yml` (사이드바 그룹 전용, terms.yml과 분리된 파일) — 섹션은 `flat terms[]` 또는 `subgroups: [{label, terms[]}]` 중 하나만 가짐, `compact_subgroups` 플래그로 2열 컴팩트 렌더 여부 결정 (navigation.yml:1-100)
  - `scripts/build-navigation-data.mjs:1-125`: term id 참조 유효성 + **모든 term이 최소 1개 섹션에 등장해야 함**(누락 시 빌드 실패, 90-93행) 검증 후 `src/data/navigation.generated.ts` 출력
  - 소비: `src/App.tsx` `ConceptNavigation` 컴포넌트 (787-918행) — `navigationSections.map` → 아이콘 문자열 키(`icon: "layers-3"`)를 `navigationIcons` 맵(1107-1124행)으로 lucide 컴포넌트 매핑, 없는 키는 `BookOpen` 기본값. 섹션 열림 상태는 선택된 term이 속한 섹션을 자동 펼침(797-813행).
- **상세 렌더**: `src/components/term-detail.tsx:1-468`
  - `explanation_sections` 존재 여부로 두 가지 레이아웃 분기: 있으면 커스텀 아티클(목차+섹션 순회, 142-171행), 없으면 generic 섹션들(무엇인가/비유/개념 흐름/오해/언제 떠올리나/주의할 점/관련 결과물/AI 프롬프트, 172-278행)
  - `visual_model.nodes`는 `ConceptFlow` 컴포넌트(433-454행)가 노드 배열을 화살표로 이어 렌더링 — 데이터 그대로 화면 다이어그램이 됨
  - `related[]`는 `getRelatedTerms`(`src/lib/term-ux.ts`)로 조회해 클릭 시 `onSelectTerm`으로 다른 term으로 점프 (227-262행)
  - `sources[]`는 `sourceRegistry`(terms.generated.ts에서 export)와 join해 Tier 배지 + 외부 링크 렌더 (`SourceList`, 385-420행)
- **검색**: `src/lib/search.ts:1-729` — **빌드타임 인덱스 없음, 순수 런타임 클라이언트 스코어링**
  - `searchTerms(terms, query, filter)` (387-415행): 전체 term 배열을 순회하며 필터 매칭 + `scoreTerm`으로 점수 계산 후 정렬
  - `scoreTerm`(526-594행): 필드별 가중치(정확/prefix/포함) 테이블(`getSearchFields`, 596-699행 — 이름>별칭>카테고리>kind>one_liner>prompt_phrases>when_to_use>visual_anatomy>description>analogy>misconceptions>visual_model.nodes>anti_use 순으로 가중치 감소) + 토큰 분해(다단어 질의는 마지막 토큰에 1.4배 head weight) + 수동 큐레이션 부스트 테이블 `discoveryQueryBoosts`(308-385행, "서버가 뭐야"→server 등 한국어 자연어 질의 하드코딩 매핑)
  - `TermFilter` 유니온이 카테고리/커스텀 그룹(`categoryGroups`)/kind/kind+category/kind+group 조합 필터를 문자열 인코딩으로 지원(`kind:${kind}:category:${category}` 등)
  - 소비: `src/App.tsx:74` `useMemo(() => searchTerms(terms, query, filter))` — 쿼리는 URL `?q=`/`?filter=`에 500ms debounce로 동기화(79-101행)
- **라우팅**: 진짜 라우터 없음 — `#/guides/vscode` 같은 단일 하드코딩 hash를 `window.location.hash` 문자열 비교로 분기(`App.tsx:57,143-149`), 나머지는 전부 React state(선택된 term, 검색 쿼리)로만 화면 전환. URL은 검색 상태 공유용 querystring만 진지하게 관리.
- **구현 요지**: `terms.yml`(용어 콘텐츠) + `navigation.yml`(사이드바 배치)이 별개 YAML SoT → 각각 독립 빌드 스크립트가 상호 참조 유효성(모든 term이 내비에 배치돼야 함, 내비의 모든 참조가 실존 term이어야 함)을 검증하며 `.generated.ts`로 컴파일 → React가 이 정적 배열을 그대로 import해 사이드바 트리·상세 페이지·클라이언트 검색을 전부 메모리 내에서 렌더. 서버/DB 없음, 빌드타임에 콘텐츠 무결성을 강제하는 것이 핵심 패턴.
- **의존성**: `yaml`(npm, YAML 파서), `lucide-react`(아이콘), Tailwind v4, `class-variance-authority`+`clsx`+`tailwind-merge`(cn 유틸) — 검색엔 Fuse.js 등 외부 서치 라이브러리 전혀 없음(직접 구현).
- **추출 난도**: 중 — YAML 스키마+빌드 스크립트+생성 타입 3종 세트라 파일 수는 적지만 스키마 필드가 15개+ 얽혀있어 그대로 옮기면 과할 수 있음. `terms.yml`+`build-development-vocabulary-data.mjs`+`navigation.yml`+`build-navigation-data.mjs` 4파일 구조 자체는 recipe 문서(사전형 IA 레시피)로 적합 — 필드 전체를 강제하기보다 "필수 5개(id/name/one_liner/category/related) + 선택 확장" 축소판으로 recipe화하는 편이 ui-dictionary 실제 채용에 낫다는 소견.

---

### +추가: 검색 결과 없음 복구 UX

- 위치: `src/App.tsx` `EmptySearchRecovery`(995-1047행) — 검색 결과 0건일 때 "검색어만 지우기"/"필터만 해제"/"전체 용어 보기" 3단계 개별 액션 버튼 + `getStarterQueries()`(`src/lib/search-suggestions.ts`) 기반 추천 검색어 칩을 제시.
- 가치: 일반적인 "결과 없음" 빈 화면 대신, 사용자가 검색어와 필터 중 무엇이 원인인지 분리해서 되돌릴 수 있게 한 것. UI 사전 detail-page recipe나 empty-state 패턴 문서에 채용 후보.
- 추출 난도: 하 — 컴포넌트 하나, 의존성 없음, 그대로 컴포넌트 레시피로 이식 가능.

### +추가: 필터 인코딩 방식 (kind+category+group 복합 필터를 문자열 하나로)

- 위치: `src/lib/search.ts:3-6` — `TermFilter` 타입이 `"kind:${TermKind}"`, `"kind:${TermKind}:category:${TermCategory}"`, `"kind:${TermKind}:group:${TermGroupId}"`를 템플릿 리터럴 유니온으로 인코딩하고 `isTermKindCategoryFilter` 등 파서 함수(471-517행)로 되풀이 판별.
- 가치: state 하나(문자열)로 복합 필터 조합을 표현해 URL querystring에 직렬화하기 쉬움. 단일 열거형 필터 이상으로 확장될 예정인 UI 사전 자체 필터 설계에 참고할 만한 패턴.
- 추출 난도: 하 — 순수 타입/함수, UI 프레임워크 무관.

---

## 채굴 — sixsense (archive/upstage-sixsense)

# 소스 레벨 재료 채굴 — upstage-sixsense (한입지도)

대상 레포: `C:\Users\yusun\projects\archive\upstage-sixsense` (읽기 전용, 수정 없음)
주력 파일: `public/index.html`(랜딩, 981줄), `public/app.html`(서비스 콘솔, 858줄), `public/theme.css`, `public/nav.js`

---

### ⑪ 마키(marquee) (sixsense)

**소스-라이브 불일치 — "마키"는 이름뿐, 실제로는 가로 무한 스크롤이 아니다.**

- 소스: `public/index.html:488-509` (JS), `:158-168` (CSS)
  ```js
  function buildMarquee(menus) {
    const items = menus.filter(isCleanMenu);
    const half = Math.ceil(items.length / 2);
    document.getElementById("wave1").innerHTML = rowHtml(items.slice(0, half));
    w2.style.transform = "translateX(72px)";  // 반 칸 밀어 세로 교차
  }
  ```
  ```css
  .waverow{display:flex;gap:28px;justify-content:center;white-space:nowrap;padding:8px 0}
  .wave-item{animation:floaty 3.6s ease-in-out infinite}
  @keyframes floaty{0%,100%{transform:translateY(7px)}50%{transform:translateY(-7px)}}
  ```
- 구현 요지: 함수명은 `buildMarquee`이지만 가로 이동(translateX 무한 루프)이 전혀 없다. 두 줄(`wave1`/`wave2`)에 실제 파싱된 메뉴명+가격을 채우고, 각 아이템에 `floaty` 세로 bobbing 애니메이션을 건다. `wave2`는 `translateX(72px)`로 반 칸만 고정 오프셋을 줘서 두 줄이 세로로 교차하는 파도처럼 보이게 한다. `getBoundingClientRect().left` 기반으로 각 아이템의 실제 화면 x좌표를 구해 `animation-delay`를 위상차로 부여해, 같은 x에 있는 위/아래 아이템이 같은 높이로 오르내리게 만든다(폰트 로드 후 재계산 `document.fonts.ready`, `resize` 리스너 포함). `mask-image` 선형 그라디언트로 좌우 페이드아웃.
- 의존성: 없음(순수 CSS keyframes + vanilla JS, 외부 라이브러리 없음)
- 추출 난도: 중 — 애니메이션 자체는 단순하지만, "위상 정렬"을 위해 렌더된 후 `getBoundingClientRect`로 좌표를 재계산하는 로직은 텍스트만 복제하면 놓치기 쉽다. 진짜 가로 스크롤 마키가 필요하면 이 소스는 참고가 아니라 재설계 대상이다.

---

### ⑫ 히어로 (sixsense)

- 소스: `public/index.html:285-286` (마크업), `:20-44` (CSS), `:852-866` (타이핑 JS)
  ```html
  <h1><span class="nowrap">오늘<span class="amt"><span id="budgetText">1만원</span><span class="caret"></span></span>으로</span><br>뭐 먹지<span class="qm-float">?</span></h1>
  <p class="lead lead-brand"><img class="uplogo" src="/img/upstage-logo.png" alt="Upstage"> <span>AI와 함께 최적의 한 끼를 선택해보세요.</span></p>
  ```
  ```css
  .hero{position:relative;overflow:hidden;padding:var(--s24) 0 var(--s12);text-align:center}
  .hero::before{content:"";position:absolute;inset:0 0 55% 0;background:url("/img/hero.jpg") center/cover;opacity:.09}
  .hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 55%,transparent) 0%,var(--bg) 46%)}
  .hero h1{font-size:clamp(38px,8vw,88px);line-height:1.12;margin:0 auto}
  .amt{display:inline-block;min-width:2.6em;margin-left:.08em;text-align:right;color:var(--accent)}
  ```
  ```js
  const HEADLINE_AMOUNTS = ["8천원", "1만원", "5천원"];
  (async function headlineLoop() {
    let hi = 0;
    while (true) {
      const pill = HEADLINE_AMOUNTS[hi % HEADLINE_AMOUNTS.length];
      amtEl.textContent = "";
      for (const ch of pill) { await sleep(120); amtEl.textContent += ch; }
      await sleep(6000); hi++;
    }
  })();
  ```
- 구현 요지: "오늘 [금액]으로 뭐 먹지?"를 초대형 클램프 헤딩(`clamp(38px,8vw,88px)`)으로 완전 중앙 정렬. `.amt` span이 타이핑 애니메이션으로 금액 문자열을 한 글자씩 채우고 옆에 CSS `caret`(`@keyframes blink`)이 깜빡인다. 배경은 `hero.jpg`를 opacity 0.09로 아주 은은하게 깔고, 그 위에 배경색으로 그라디언트 페이드를 씌워 텍스트 대비를 확보. 금액 자리(`.amt`)는 `min-width`+`text-align:right`로 폭을 미리 고정해 "8천원"처럼 짧은 문자열일 때도 레이아웃이 흔들리지 않게 처리(주석에 실사 근거 명시: 2026-07-21 감사).
- 의존성: 없음(vanilla CSS/JS, 이미지 1장)
- 추출 난도: 하 — 타이핑 루프·caret·min-width 고정 트릭 모두 프레임워크 불필요, 그대로 포팅 가능.

---

### ⑬ 랜딩 페이지·전체 페이지 구조 (sixsense)

**랜딩(`public/index.html`) 섹션 시퀀스** (실제 DOM 순서, `:283-407`):

1. `<section class="hero">` — 헤딩(타이핑 금액)+리드+CTA 2개(솔리드+틴트) → 인터랙티브 데모 카드(좌 지도무빙/우 챗봇 대화, `.demo` `.demo-body` grid `1fr 320px`) → 증거 카운터(`.proof`: 식당수·메뉴수·학식수) → 마키(웨이브) 스트립
2. `<section class="band-warm">` — "한입지도는 메뉴를 알아요" 대비 카드(`.duo`, 2열: 범용 챗봇 vs 한입지도, 각각 챗 버블 목업)
3. `<section class="band-ink">` (다크 배경) — "만들어지는 과정" 3단계 스테퍼(`.stepper` = 탭 3개 + 활성 탭 상세 패널)
4. `<section class="band-warm">` — "빠진 가게가 있나요?" 제보 CTA
5. `<section class="closing">` — "예산부터 골라 보세요" 예산 칩(5천/8천/1만/2만원) + 즉시 결과 미리보기(`.mini-results`) + 앱 이동 CTA
6. `<footer class="site-foot">` — 브랜드+한줄소개+운영자검수 링크 / 서비스 nav / 이야기 nav

**전체 앱 페이지 구조**(라우트 구성):
- `/` (`index.html`) — 랜딩(위 시퀀스), 모두 데모/목업 데이터
- `/app.html` — 실서비스 단일 페이지. `.console` = 좌(지도 `.console-stage`) + 우(340px 고정폭 대화 사이드 `.console-side`) grid, `/api/parse-query`→`/api/recommend` 실API 호출. 별도 "지도 페이지"/"챗 페이지" 라우트 분리 없음 — 한 화면 안에 지도+챗 콘솔.
- `/contribute.html` — 메뉴판 사진 제보
- `/about.html` — 데이터 파이프라인/Upstage AI 설명
- `/review.html`, `/verify.html`, `/test.html` — 운영자·검수용 내부 도구 페이지(공개 nav엔 `review.html`만 노출)

- 소스: `public/index.html:283-408` (섹션 시퀀스 전체), `public/app.html:17-40`(console grid), `public/nav.js:1-68`(공통 헤더 nav 동작 — contribute.html 항목 누락 실사례 주석 포함)
- 구현 요지: 페이지 간 공통 헤더/네비는 마크업을 각 HTML에 중복 배치하고 `nav.js`가 스크롤 페이드·현재 페이지 표시·로그인 팝오버 DOM만 공통 생성(SPA 라우터 없음, 순수 멀티페이지).
- 의존성: 없음(정적 멀티페이지, Vercel 서버리스 API)
- 추출 난도: 상(전체 시퀀스 이식) / 하(개별 섹션만 발췌) — 시퀀스 자체는 섹션 순서만 옮기면 되지만, 각 섹션이 실API 데이터(`/api/data`)에 의존해 데모 문구·카운터가 채워지므로 정적 이식 시 하드코딩 대체 필요.

---

### ⑭ 설명 텍스트 UI (sixsense)

- 소스: `public/index.html:330-357`(대비 카드 마크업), `:200-227`(대비 카드 CSS), `:363-380`(프로세스 스테퍼 마크업), `:230-242`(스테퍼 CSS), `:393-402`(예산 안내 마크업), `:189-198`(칩 CSS)

**대비 카드** (`.duo` — "범용 챗봇 vs 한입지도"):
  ```html
  <div class="duo-card">
    <div class="duo-head">
      <div><p class="who">범용 챗봇</p><p class="duo-line">식당은 찾아도<br>메뉴와 가격은 모릅니다.</p></div>
    </div>
    <div class="duo-visual is-gray">
      <div class="bubble q">근처에 8,000원 이하 혼밥하기 좋은 곳 있어?</div>
      <div class="bubble a muted-a">지금 계신 위치를 몰라서...</div>
    </div>
  </div>
  ```
  ```css
  .duo{display:grid;gap:var(--s6);grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
  .duo-head .who{font-size:var(--sm);color:var(--muted)}         /* 라벨 */
  .duo-line{font-family:var(--font-head);font-size:clamp(20px,2.4vw,26px);line-height:1.35}  /* 볼드 한 줄 */
  .duo-visual{flex:1;min-height:300px;padding:var(--s8)}          /* 비주얼 밴드 */
  .bubble{border-radius:12px;padding:10px 16px;max-width:85%}
  .duo-visual .bubble{animation:bubin 420ms ease-out both}
  .duo-visual .bubble.a{animation-delay:480ms}                     /* 질문→답 순차 등장 */
  ```

**프로세스 설명(스테퍼)**:
  ```html
  <li><button class="step-tab" role="tab" data-step="0" aria-selected="true">
    <span class="n">1</span><span class="t">메뉴판을 수집합니다</span>
    <span class="d">명륜동·혜화 일대 메뉴판을 찍어 한 곳에 저장합니다.</span></button></li>
  ```
  ```css
  .step-tab{border:1px solid rgba(247,249,252,.18);border-radius:var(--r);padding:var(--s4)}
  .step-tab[aria-selected="true"]{border-color:var(--accent);background:rgba(224,138,95,.12)}
  .step-tab .n{font-family:var(--font-head);color:#E08A5F}   /* 번호 강조 */
  .step-tab .d{display:block;font-size:var(--sm);color:var(--band-ink-muted)}  /* 설명행 */
  ```

**예산 안내(칩+미니결과)**:
  ```html
  <button class="chip" type="button" data-budget="8000" aria-pressed="true">8천원 이하</button>
  ```
  ```css
  .chip{height:36px;padding:0 14px;border-radius:var(--r);border:1px solid var(--border)}
  .chip[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-fg)}
  ```

- 구현 요지: 세 UI 모두 "라벨(무채색 작은 텍스트) → 굵은 헤드라인(`--font-head`) → 보조 설명(`--sm`, muted)"의 동일한 타이포 위계를 반복 사용한다. 대비 카드는 노션 스타일 카드(라벨+볼드 한줄+대형 비주얼 밴드)를 명시적으로 레퍼런스했다고 주석에 적혀 있다(`좌정렬 대형 헤딩 + 카드(라벨·볼드 문구·화살표 버튼) + 대형 비주얼`). 스테퍼는 탭(`role=tab`)이 곧 카드이며 선택 상태(`aria-selected`)에 따라 accent 컬러 보더+연한 배경이 켜진다. 칩은 토글 버튼(`aria-pressed`)로 accent 배경 반전.
- 의존성: 없음(순수 CSS/ARIA, JS는 상태 토글만)
- 추출 난도: 하 — 세 패턴 모두 프레임워크 무관, 클래스/ARIA 속성 그대로 포팅 가능. 다만 CSS 커스텀 프로퍼티(`--font-head`, `--s6` 등 spacing/타이포 스케일)는 `theme.css` 토큰 정의(`public/theme.css`)까지 같이 가져와야 완전히 재현된다.

---

### +추가: 인터랙티브 데모 카드 (지도+챗 사이드) — 랜딩 히어로 하위 요소

지목 목록엔 없었지만 ⑫⑬과 맞물려 가치가 높은 재료.

- 소스: `public/index.html:295-312`(마크업), `:46-58`(CSS), `:565~`(대사 재생 JS `startDemo`)
  ```css
  .demo{margin:var(--s16) auto 0;max-width:1000px;background:var(--surface);border-radius:8px;overflow:hidden}
  .demo-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;height:clamp(390px,42vw,485px);overflow:hidden}
  ```
- 구현 요지: 히어로 바로 아래에 "실제 서비스처럼 보이는" 목업 카드를 배치해 헤딩의 약속(예산→추천)을 즉시 시연한다. 좌측은 지도 위에 마커+대화가 오가고, 우측은 챗 사이드바가 대본(SCENARIOS)을 순차 재생. 데모 카드 세로 높이를 `clamp()`로 고정해 대화 길이가 늘어도 레이아웃이 흔들리지 않게 한 것이 재사용 가치가 있는 디테일.
- 의존성: 카카오맵 SDK(실제 지도 오버레이용, `demoMap`) — 지도 없이 정적 스크린샷으로 대체 가능.
- 추출 난도: 중 — grid 비율·높이 고정 트릭은 쉽지만, 대본 재생 로직(`startDemo`)은 통째로 옮기기보다 참고해 재작성하는 편이 낫다.

---

## step-2 — 착지 판정표 + 승격 순위안 (오케스트레이터 종합)

착지 그릇(plan 결정 2): 컴포넌트/모션→asset · 페이지/사이트 골격→블록·recipe/knowledge · 컬러감→팔레트 프리셋(킥스타트 브리프 옵션) · 코드 기법→asset 또는 knowledge.

### A. asset 착지 — 즉시 승격 후보 (난도 하~중, 신규성 상)

| # | 재료 | 승격 형태(안) | 난도 | 중복 대조 |
|---|---|---|---|---|
| A1 | ⑧ bootcamp 마키 (+마스크 유틸 증보) | `logo-marquee` asset — CSS keyframe 무한 순환·hover 정지·reduced-motion·페이드 마스크 | 하 | 기존 자산 0 (마키 계열 없음) |
| A2 | ⑨ bootcamp 문구 로테이션 | `rotating-label` asset — key 리마운트+keyframe, 폭 고정. aria-live 보강해 승격 | 하 | 없음 |
| A3 | ⑥-1 본체 포인터 근접 조명 | `cursor-proximity-glow` asset — pointermove→CSS var→radial-gradient | 하 | 없음 (Cursor-Reactive Field 데모와 별개 기법) |
| A4 | ⑤+⑦ 본체 랜딩 히어로+떠 있는 바 장식 | `floating-bars-hero` asset — clamp 타이틀+CTA+바 필드(다크 반전 포함) | 중 | 없음 (히어로 계열 자산 0) |
| A5 | ⑫ sixsense 타이핑 히어로 | `typing-headline` asset — caret 타이핑·min-width 흔들림 방지 | 하 | 없음 |
| A6 | ⑭ sixsense 대비 카드 | `contrast-duo-card` asset — 라벨→볼드 헤드→비주얼밴드 위계 | 하 | 스테퍼 부분은 tax/golf 계열 겹침 — duo 카드만 |
| A7 | ④ brain 범례/필터 패널·질문바·HUD | `graph-legend-panel`·`ask-input-bar` asset 2종(정적 UI 분리) | 하 | advanced-filter-builder 와 결 다름 |

### B. 비-asset 착지 — 문서·팔레트

| # | 재료 | 착지(안) |
|---|---|---|
| B1 | ① brain 컬러감 (7 타입 hex+글리프·3계층 HIER_COLOR·다크 그라운드) | 킥스타트 브리프 **팔레트 프리셋**(가칭 `dark-cosmos`) + DESIGN.md 예시 — 소비 경로 실존(CLI --color) |
| B2 | ⑩ dev 사전형 사이트 구조 | **recipe/knowledge 문서** `dictionary-site-ia` — YAML 이중 SoT(콘텐츠/내비 분리)+빌드 교차검증+클라이언트 가중 검색. 축약 코어 스키마(id/name/one_liner/category/related) 권고(worker 소견 채택) |
| B3 | ⑬ sixsense 랜딩 섹션 리듬 | **knowledge 문서** — band-warm/band-ink 교차 시퀀스(히어로→대비→스테퍼→CTA→클로징) 패턴 결정표 |
| B4 | ② brain 그래프 연결 방식 | **knowledge 문서** — 노드 7타입+3계층 hierarchy+13관계 스키마 결정표 (코드 이식은 C로) |

### C. 이월 (난도 상 또는 재설계 필요 — 후속 배치)

| # | 재료 | 사유 |
|---|---|---|
| C1 | ③ brain three.js 코드 (Points 셰이더+블룸+trackball) | 난도 중상 — threeState 전역 강결합, 독립화에 별도 step 필요 |
| C2 | +본체 Color Palette Generator | 난도 상 — 수백 줄 프로덕션 도구 |
| C3 | +본체 Coverflow·Hero Composition·Image Treatment | 미등재 데모 3종 — 배치 3 후보 |
| C4 | ⑪ sixsense 마키 | **소스-라이브 불일치** — 실체는 세로 bobbing. 마키 정본은 A1, 이건 기각(필요 시 floaty-wave 별도) |
| C5 | ⑥-2 본체 Cursor-Reactive Field 데모 · +brain 인증 모달·HUD | 배치 3 후보 |

### M23 배치 추천 (상한 재검 — plan 결정 1)

- **추천 배치**: A1~A7(asset 7건 — A7 은 2종이라 실물 8) + B1~B3(팔레트 1·문서 2) = **집행 11건**. 기본 상한 6을 넘는다 — 난도 하 위주라 얹을 수 있다고 보나, **상한·구성은 사용자 확정 게이트 소유**.
- 대안: 상한 6 유지 시 A1·A2·A3·A5·A6 + B1 (모션·팔레트 우선, 문서 2건 이월).

**사용자 확정 (2026-08-04)**: **11건 전체(A1~A7 + B1~B3) 집행** + 사용자 추가 지시 1건:

- **B5 (신규, 사용자 지시)** — **head 메타 스캐폴드**: OG 태그(og:title/description/image)·파비콘·탭 타이틀을 템플릿에 기본 포함("OG, 파비콘, 탭 이름 등도 템플릿에 넣어둬야지"). 착지: 킥스타트 산출물 + `templates/` — 구체 형태는 2차 채굴의 head 메타 실측(각 표면의 실제 정의 방식)이 입력.
- 집행 목록 = **12건** (A 7 + B1~B3 + B5). B4(그래프 스키마 knowledge)·C 전건은 이월 유지.
- 추가 지시 2 — "더 뽑아낼 것들도 찾고 싶다" → **2차 증보 채굴 라운드** 즉시 가동(M22 증보 허용 범위): worker 3기, 렌즈 교체(마이크로 인터랙션·head 메타 실측·타이포/스페이싱 시스템·유틸리티) + 1차 미채굴 소스 2곳(Askwely-company 잔여·ai-guide 잔여) 포함. 결과는 아래 「2차 증보 채굴」 절.


---

## 2차 증보 채굴 (사용자 지시 "더 뽑아낼 것들" — 렌즈: 마이크로 인터랙션·head 메타 실측·타이포 시스템·유틸리티)

> worker 3기. 오케스트레이터 dedupe 메모: mining2-rest A-1·A-2 는 1차 ⑧⑨ 와 동일(제외 계수). mining2-core-brain 의 actionable-toast·scroll-driven-reveal 은 기등재(제외). **본체 미등재 마이크로 인터랙션 6종(magnetic-hover-button·spring-drag-snap-card·swipe-action-row·pull-to-refresh·staggered-entrance·bottom-sheet-detents)은 사이트 소스에 실존하나 registry 미등재 — 배치 3 최우선 후보.**
> head 메타 실측 종합 (B5 입력): 완비 사례 = Askwely-company(Next Metadata API+동적 OG 생성) · sixsense(정적 OG/Twitter/이중 파비콘). 최소/결손 사례 = guide(title만)·dev(Vite 기본)·본체·brain(SPA 단일 정적 OG — 라우트별 title 만 클라이언트 오버라이드, 크롤러엔 빌드 시점 값). → 템플릿 계약: **정적 OG 폴백 + 라우트별 title 오버라이드**가 최소선.

### 2차 — askewly.com 잔여 + guide 잔여

# M22 2차 증보 채굴 — askewly.com(web) · guide.askewly.com(ai-guide)

## A. Askwely-company/web

### A-1 Reveal (스크롤 리빌) (Askwely-company/web)
- 소스: `src/components/reveal.tsx:11-39`
  ```tsx
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { el.classList.add("is-revealed"); observer.unobserve(el); } },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  ```
  CSS 짝 — `src/app/globals.css:293-310`
  ```css
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 700ms var(--ease-out), transform 700ms var(--ease-out); }
  .reveal.is-revealed { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) { .reveal, .reveal.is-revealed { opacity:1; transform:none; transition:none; } }
  ```
- 구현 요지: children을 감싸는 래퍼 컴포넌트. `IntersectionObserver` 1회 트리거 + `unobserve`로 재실행 방지. `delay` prop은 `transitionDelay` 인라인 스타일로 스태거. reduced-motion 대응 내장.
- 의존성: 없음(React only).
- 추출 난도: 하 — 40줄 단일 파일 + CSS 클래스 2개, 의존성 zero. 그대로 컴포넌트 레시피로 착지 가능.

### A-2 BlogTOC (스크롤 스파이 목차, 모바일/데스크톱 분기) (Askwely-company/web)
- 소스: `src/components/blog-toc.tsx:13-40`
  ```tsx
  const heads = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2, h3"));
  ...
  const obs = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible[0]) setActiveId(visible[0].target.id);
  }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
  ```
- 구현 요지: `article` 내 h2/h3를 런타임 스캔해 id 자동 부여(중복 방지 카운터) 후 목차 아이템 생성. desktop은 `position: sticky; top: 50vh; transform: translateY(-50%)`로 뷰포트 중앙 고정, mobile은 아코디언 토글. active 항목은 IntersectionObserver rootMargin으로 "화면 상단 20%~하단 30% 구간"을 활성 판정.
- 의존성: `slugify` 유틸(자체 구현, `src/lib/slugify.ts`).
- 추출 난도: 중 — 로직은 단순하지만 desktop/mobile 두 렌더 분기 + sticky-center 배치가 있어 옮길 때 CSS 변수(`--dur-fast`, `--indigo-ink` 등) 치환 필요.

### A-3 BlogTabs (다크 스트립 카테고리 탭, 톤별 언더라인) (Askwely-company/web)
- 소스: `src/components/blog-tabs.tsx:33-56`
  ```css
  .blog-tab[data-active="true"]::after {
    content: ""; position: absolute; left:16px; right:16px; bottom:0; height:3px;
    background: var(--tab-tone, var(--paper)); border-radius: 2px 2px 0 0;
  }
  ```
  ```tsx
  style={tone ? ({ ["--tab-tone" as string]: tone } as React.CSSProperties) : undefined}
  ```
- 구현 요지: 카테고리별 `tone` 색상을 CSS 커스텀 프로퍼티로 inline 주입해 언더라인 색을 항목마다 다르게(단일 CSS 규칙으로 N색 지원). 가로 스크롤 시 스크롤바 숨김(`scrollbar-width: none`).
- 의존성: Next `Link`, `@/lib/blog`의 `CATEGORIES`.
- 추출 난도: 하 — CSS 변수 인라인 주입 패턴 자체가 재사용 가치 있는 소품(톤 매핑 탭/뱃지 일반화 가능).

### A-4 HeroBathhouse — "에이전트 지도" 상호작용 히어로 (Askwely-company/web)
- 소스: `src/components/hero-bathhouse.tsx:229-368` (mount/runTask/watchPing 로직), 스타일 `:515-1287+`
  ```tsx
  function runTask(key: AgentKey) {
    ...
    el.classList.remove("hidden","dismissing"); el.classList.add("summoning");
    setComm(key, "?", "ask", 1100);
    window.setTimeout(() => { el.classList.remove("summoning"); el.classList.add("active"); }, 550);
    ...
  }
  ```
- 구현 요지: isometric 배경 이미지 위에 원형 아바타 "에이전트"들이 waypoint 좌표(%) 사이를 8초 주기로 이동하며 등장/말풍선(`comm` — ?/!/✓)/배지(`action-badge`)를 순차 애니메이션. Notion 스타일 OS 셸(사이드바+탭바) 안에 배치, 클릭 시 우상단 상세 카드가 열림. hover 시 자동 사이클 정지, `prefers-reduced-motion`·모바일에서 자동 사이클 자체를 비활성화.
- 의존성: 없음(React state/ref + DOM 직접 조작, CSS keyframes). 도메인(목욕탕) 콘텐츠는 특정적이나, "OS 셸 + 이동하는 에이전트 아바타 + 상태 말풍선 + 상세 사이드패널" 패턴은 일반화 가능.
- 추출 난도: 중 — 코드량이 크고(약 2900줄, 그중 절반이 view 컴포넌트 stub들) 도메인 문자열이 섞여 있어 발췌 시 "에이전트 마커 애니메이션 프레임워크" 부분만 스켈레톤화 필요. 그대로 복붙은 비효율.

### A-5 ContactForm (web3forms 연동 문의폼, 커스텀 select 화살표) (Askwely-company/web)
- 소스: `src/components/contact-form.tsx:184-201`
  ```css
  .cf-select-icon {
    position: absolute; right: 14px; top: 50%; width:16px; height:16px;
    background: center / 16px 16px no-repeat url("data:image/svg+xml,...path d='m6 9 6 6 6-6'...");
  }
  ```
- 구현 요지: `appearance: none` select + data-URI SVG 셰브론으로 네이티브 select 커스터마이징. 포커스 상태에 `box-shadow: 0 0 0 3px rgba(...)` 링, honeypot 체크박스(`botcheck`, `tabIndex={-1}`)로 스팸 방지.
- 의존성: web3forms API(외부 서비스), 없음 이외.
- 추출 난도: 하 — select 커스터마이징 패턴 + honeypot 패턴이 독립적으로 재사용 가치. 폼 자체는 도메인 종속(제품 옵션 목록).

### A-6 SiteFooter (다크 3-컬럼 + inline style 토큰) (Askwely-company/web)
- 소스: `src/components/site-footer.tsx:14-52`
- 구현 요지: 브랜드 블록(로고 invert) + 3컬럼(Studio/Products/Connect) 그리드, hover 시 링크가 `var(--coral)`로 변하는 `!important` 오버라이드. Tailwind 클래스와 inline `style` 혼용(변수 참조 목적).
- 의존성: 없음.
- 추출 난도: 하 — 구조는 표준적인 3컬럼 푸터. 재사용 가치는 낮은 편(레이아웃 자체가 범용적이라 새로울 게 적음) — 참고용으로만 카드화.

### A-7 head 메타 실측 — Next Metadata API + 커스텀 OG 이미지 생성 (Askwely-company/web)
- 소스: `src/app/layout.tsx:1-27` (title.template, openGraph, twitter, robots), `src/app/opengraph-image.tsx:1-116`
  ```tsx
  export const metadata: Metadata = {
    metadataBase: new URL("https://askewly.com"),
    title: { default: "어스큐리", template: "%s · 어스큐리" },
    openGraph: { type: "website", locale: "ko_KR", siteName: "어스큐리", title: "...", description: "..." },
    twitter: { card: "summary_large_image", title: "...", description: "..." },
    robots: { index: true, follow: true },
  };
  ```
  ```tsx
  // opengraph-image.tsx — 동적 OG 이미지, Google Fonts를 fetch해 ImageResponse에 주입
  export const size = { width: 1200, height: 630 };
  const [notoBlack, generalBold, quriPng] = await Promise.all([
    loadGoogleFont("Noto Sans KR", 900), loadGoogleFont("Be Vietnam Pro", 800),
    readFile(path.join(process.cwd(), "public/brand/pose-wave.png")),
  ]);
  return new ImageResponse(<div style={{...}}>...</div>, { ...size, fonts: [...] });
  ```
- 구현 요지: Next.js Metadata API(`export const metadata`)로 og/twitter 태그 선언, 파비콘은 `src/app/favicon.ico` + `src/app/icon.svg` 파일 컨벤션(라우트 세그먼트 자동 매핑, 코드 無). OG 이미지는 정적 파일이 아니라 `opengraph-image.tsx`에서 `next/og`의 `ImageResponse`로 런타임 생성 — Google Fonts CSS를 fetch해 폰트 바이너리를 추출하는 자체 로더(`loadGoogleFont`)까지 작성. `dynamic = "force-static"`으로 빌드 시 1회 생성.
- 의존성: `next/og`(`ImageResponse`), Google Fonts 웹폰트 API.
- 추출 난도: 중 — Metadata API 선언부는 그대로 템플릿화 가능(하), `loadGoogleFont` + 동적 OG 이미지 생성 파이프라인은 로직량이 있어 별도 유틸로 발췌해야(중). "head-meta 템플릿" 착지 입력으로는 이 파일 세트가 가장 직접적인 근거.

### A-8 타이포·스페이싱 시스템 (Askwely-company/web)
- 소스: `src/app/globals.css:78-201`
  ```css
  --t-display-1: clamp(48px, 6vw, 84px);
  --t-h1: clamp(36px, 4vw, 56px);
  --sp-1: 4px; --sp-2: 8px; ... --sp-24: 96px;  /* 4px 배수 스케일 */
  --r-xs: 6px; ... --r-pill: 999px;
  ```
- 구현 요지: 3-tier 유사 구조 — anchor(ink/paper) → semantic(fg-1~4, bg-*) → 컴포넌트 미적용(컴포넌트가 semantic 직접 참조). 타이포는 `clamp()` 기반 반응형 스케일 9단, spacing은 4px 배수 12단, radius 6단, shadow 4단(warm ink-tinted), easing 3종 + duration 4단. 한국어 전용 처리: `word-break: keep-all; overflow-wrap: anywhere;`, `text-wrap: balance`(heading)/`pretty`(p).
- 의존성: 없음(순수 CSS 변수).
- 추출 난도: 하 — 토큰 세트 전체가 그대로 참고용 카드. ui-dictionary 3-tier(primitive→semantic→component) 규약과 유사 사상이라 direct comparison 자료로 유용.

### 탈락 (A)
- blog-blocks/compare.tsx, stat-callout.tsx, flow.tsx, glossary.tsx, key-takeaways.tsx, questions.tsx, ref-list.tsx, stack.tsx, data-table.tsx — 모두 CSS class 기반 소품(수십 줄), 구조가 단순 리스트/카드 나열이라 개별 재사용 가치는 낮음(패턴 자체가 이미 일반적). 필요 시 blog-blocks.css 전체를 "MDX 블록 프리셋 모음"으로 통째 참고.
- login-dialog.tsx, ui/dialog.tsx, ui/button.tsx, ui/card.tsx, ui/input.tsx, ui/badge.tsx — shadcn/ui 표준 컴포넌트 그대로, 이미 ui-dictionary에 있을 표준 패턴과 중복.
- blog-editor/* (Tiptap 기반 MDX 에디터) — 재사용 가치는 있으나 범위가 "블로그 CMS 에디터"로 매체 밖(제품 UI 컴포넌트 라이브러리 성격이 아님) 판단, 이번 렌즈에서 제외.
- admin-client.tsx, edit-blog-client.tsx — 내부 운영 도구, 디자인 재사용 가치 없음.

---

## B. ai-guide (guide.askewly.com)

### B-1 SideNav — 섹션 그룹 사이드바 + 모바일 드로어 (ai-guide)
- 소스: `components/SideNav.tsx:12-38` (섹션 데이터 구조), `:209-260` (모바일 드로어)
  ```tsx
  type NavItem = { href: string; label: string; external?: boolean };
  type NavSection = { section: string; items: NavItem[] };
  type NavEntry = NavItem | NavSection;
  ```
  ```tsx
  <aside role="dialog" aria-modal="true" aria-label="사이트 메뉴"
    className={cn("... transition-transform duration-200 ease-out", open ? "translate-x-0" : "-translate-x-full")}>
  ```
- 구현 요지: flat item과 section(하위 items) 두 타입을 유니온으로 섞어 한 배열로 선언 — 데이터 구조 자체가 재사용 가치. 데스크톱은 `fixed` 고정폭(w-72) 사이드바, 모바일은 `role="dialog"` 오버레이 드로어(backdrop + slide-in, ESC 닫기, body scroll lock, 경로 변경 시 자동 닫힘). active 판정은 `pathname.startsWith(href + "/")`로 하위 경로까지 포함.
- 의존성: Next `usePathname`, Tailwind, `cn` 유틸.
- 추출 난도: 하 — 문서 사이트형 좌측 내비게이션의 표준 레시피로 그대로 착지 가능(멀티 레벨 nav 데이터 스키마 + 모바일 드로어 접근성 패턴 세트).

### B-2 ToolCard + "준비 중" 상태 배지 (ai-guide)
- 소스: `components/ToolCard.tsx:1-35`
  ```tsx
  {tool.status === "soon" && (
    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
      준비 중
    </span>
  )}
  ```
- 구현 요지: `status: "ready" | "soon"` 유니온 하나로 카드 배지 노출 + CTA 라벨("준비 중")을 동시 제어. 카드는 `Link` 전체가 클릭 영역, hover 시 border/bg 전환 + CTA 화살표 `translate-x-0.5`.
- 의존성: Next `Link`.
- 추출 난도: 하 — "상태 배지 하나로 배지+CTA를 같이 통제"하는 패턴이 작지만 명확한 재사용 소품.

### B-3 Callout (타입별 팔레트 알럿) (ai-guide)
- 소스: `components/Callout.tsx:9-13`
  ```tsx
  const palette: Record<NonNullable<CalloutProps["type"]>, string> = {
    tip: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
    warn: "border-amber-500/40 bg-amber-500/10 text-amber-100",
    info: "border-sky-500/40 bg-sky-500/10 text-sky-100",
  };
  ```
- 구현 요지: type→Tailwind 클래스 문자열 매핑 객체로 tip/warn/info 3종 알럿을 한 함수로 렌더. MDX 본문에서 바로 쓰는 문서용 컴포넌트.
- 의존성: `cn` 유틸.
- 추출 난도: 하 — 매핑 객체 패턴은 표준적이나 문서 사이트 alert 컴포넌트 레시피로 그대로 쓸 수 있음.

### B-4 DocNav (prev/next 페이지네이션) (ai-guide)
- 소스: `components/DocNav.tsx:15-18`
  ```tsx
  const idx = pages.findIndex((p) => p.href === current);
  const prev = idx > 0 ? pages[idx - 1] : null;
  const next = idx < pages.length - 1 ? pages[idx + 1] : null;
  ```
- 구현 요지: 현재 페이지 href로 배열에서 인덱스를 찾아 이전/다음 계산 — 별도 상태나 route 그래프 없이 순서 배열 하나로 문서 네비게이션 완성.
- 의존성: 없음.
- 추출 난도: 하 — 30줄, 문서 사이트 어디든 이식 가능한 최소 로직.

### B-5 head 메타 실측 — 정적 title/description만, OG/파비콘 커스터마이징 없음 (ai-guide)
- 소스: `app/layout.tsx:12-15`
  ```tsx
  export const metadata: Metadata = {
    title: "AI 학습 허브",
    description: "처음 시작하는 사람을 위한 도구별 AI 입문 가이드 — Claude Code · Microsoft 365",
  };
  ```
  파비콘: `app/favicon.ico` 파일 컨벤션 1개만 존재(`icon.svg`/`opengraph-image` 없음). `grep -rn "openGraph|og:" app/` 결과 0건 — OG 태그·twitter 카드 선언 자체가 없음.
- 구현 요지: Metadata API를 최소한으로만 사용(title/description). Askewly-company/web과 대비되는 사례로, "head-meta 템플릿"이 커버해야 할 최소 요구사항(title/description) vs 완비 사례(A-7)의 갭을 보여줌.
- 의존성: 없음.
- 추출 난도: 하(그 자체로 재사용할 코드는 없음, 반례 자료로만 가치).

### 탈락 (B)
- TerminalDemo.tsx — 이미 승격됨(과제 전제).
- CodeBlock.tsx, CopyButton.tsx, PrintButton.tsx, ZoomImage.tsx — 기능은 있으나 각 10~40줄 내 표준 유틸(클립보드 복사, window.print, 이미지 확대 lightbox)로 구현이 매우 일반적 — 재사용 가치는 낮음(다른 곳에도 흔한 구현).
- MdxComponents.tsx — MDX 커스텀 렌더러 매핑, 프레임워크 종속적 배선이라 디자인 자산으로서 가치 낮음.
- ui/button.tsx — shadcn 표준.
- app/globals.css, app/theme.generated.css — Tailwind 기본 + shadcn 변수 스캐폴딩 수준, Askewly-company/web의 globals.css(A-8)만큼 체계적인 커스텀 스케일이 없음(자체 clamp 타이포/spacing 토큰 부재).

### 2차 — 본체 + brain (렌즈 재탐)

# M22 2차 증보 채굴 — ui-vocabulary-site(A) / poc-graph(B)

읽기 전용 재탐. 1차에서 다룬 히어로·포인터·배경 장식·미등재 데모 4종(A), 팔레트·그래프 스키마·three.js·패널 UI·인증 모달·HUD(B)는 스킵.

## A. ui-vocabulary-site

### A-1 Magnetic hover button (motion/react spring) (ui-vocabulary-site)
- 소스: `src/components/magnetic-hover-button.tsx:19-51`
  ```
  const springX = useSpring(x, { stiffness: 320, damping: 22 })
  x.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * pull)
  ```
- 구현 요지: 버튼 내부 포인터 위치를 -1~1로 정규화해 `useMotionValue`에 쓰고, `useSpring`으로 감쇠시켜 `style={{x,y}}`에 바인딩. `onPointerLeave`에서 0으로 리셋해 스프링이 원위치로 되돌아간다. `useReducedMotion()`이면 핸들러 자체를 no-op.
- 의존성: `motion/react` (Framer Motion 계열)
- 추출 난도: 하 — 훅 3개(`useMotionValue`/`useSpring`/`useReducedMotion`) 조합, 컴포넌트 그대로 이식 가능.

### A-2 Actionable toast — undo + aria-live + 타이머 정리 (ui-vocabulary-site)
- 소스: `src/components/actionable-toast.tsx:25-55`
  ```
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, toast.duration)
    return () => window.clearTimeout(timer)
  }, [onDismiss, toast.duration])
  ```
- 구현 요지: `role="status"` + `aria-live="polite"`로 포커스 강탈 없이 결과 알림. unmount/dismiss 시 타이머 클린업으로 사라진 상태에 setState 호출 방지. Undo는 액션 최대 1개로 제한.
- 의존성: 없음(순수 React)
- 추출 난도: 하 — 20줄 이하 훅, 그대로 재사용 가능.

### A-3 Spring drag snap-back card (motion/react drag) (ui-vocabulary-site)
- 소스: `src/components/spring-drag-snap-card.tsx:18-30`
  ```
  dragElastic={0.2}
  dragSnapToOrigin
  dragTransition={reduceMotion ? {bounceStiffness:100000, bounceDamping:100000} : {bounceStiffness:380, bounceDamping:24}}
  ```
- 구현 요지: `drag`+`dragConstraints`+`dragSnapToOrigin`으로 드래그 후 원위치 복귀를 스프링으로 처리. 복귀 애니메이션 중 다시 잡아도(interrupt) 스프링이 재타겟팅되어 끊김이 없다(tween이 못 하는 지점). reduced-motion은 스프링 상수를 극단으로 올려 즉시 복귀로 대체.
- 의존성: `motion/react`
- 추출 난도: 하 — props 조합만으로 완성, 별도 상태관리 불필요.

### A-4 Swipe action row — 스와이프 대체 탭 어포던스 (ui-vocabulary-site)
- 소스: `src/components/swipe-action-row-pattern.tsx:35-100`
  ```
  {revealed === "leading" ? <button ... aria-label="Mark done">...
  {revealed === "none" ? <div>...ArchiveIcon/TrashIcon 버튼 두 개...
  ```
- 구현 요지: 실제 스와이프 제스처 대신 `revealed: "none"|"leading"|"trailing"` 상태만으로 leading/trailing 액션 노출을 시뮬레이션. 닫힌 행에 탭 전용 아이콘 버튼을 항상 노출해, 스와이프가 유일한 경로가 되지 않게 함(모든 액션이 별도 가시 버튼으로도 도달 가능).
- 의존성: 없음
- 추출 난도: 중 — 접근성 대체 경로 설계(스와이프=only path 금지)가 핵심 가치, 실제 드래그 제스처는 미구현이라 완전한 스와이프 물리는 별도 작업 필요.

### A-5 Pull-to-refresh 상태 머신 (ui-vocabulary-site)
- 소스: `src/components/pull-to-refresh-list-pattern.tsx:19-57`
  ```
  const clamped = Math.min(delta, MAX_PULL_PX)
  setPhase(clamped >= THRESHOLD_PX ? "threshold-crossed" : clamped > 0 ? "pulling" : "idle")
  ```
- 구현 요지: `idle → pulling → threshold-crossed → refreshing` 4단계 상태 머신. 임계값 미달 드래그는 스냅백만 하고 새로고침 트리거 안 함. 새로고침 인디케이터는 refreshing 동안 화면 밖으로 스크롤되지 않도록 고정 높이 유지(Material M3 가이드 준수 주석 포함).
- 의존성: 없음(Pointer Events)
- 추출 난도: 중 — 상태 머신 자체는 이식 쉬움, 실제 스크롤 컨테이너와의 `atScrollTop` 동기화는 통합 시 주의 필요.

### A-6 Staggered entrance group (ui-vocabulary-site)
- 소스: `src/components/staggered-entrance-group.tsx:22-38`
  ```
  variants={{ show: { transition: { staggerChildren: interval } } }}
  transition={{ type: "spring", stiffness: 420, damping: 32 }}
  ```
- 구현 요지: `staggerChildren`(≤0.06s 권장)으로 자식이 순차 등장하는 리듬을 만들고 개별 항목은 스프링으로 opacity/y 트랜지션. reduced-motion이면 `initial={false}`로 애니메이션 자체를 건너뜀(전부 즉시 보임 — choreography는 절대 게이팅 조건이 아니라는 원칙 주석).
- 의존성: `motion/react`
- 추출 난도: 하 — variants 객체 그대로 재사용 가능.

### A-7 Scroll-driven reveal — CSS `animation-timeline: view()` (ui-vocabulary-site)
- 소스: `src/components/scroll-driven-reveal.tsx:3-18`
  ```
  @supports (animation-timeline: view()) {
    .sdr-item { animation: sdr-reveal both; animation-timeline: view(); animation-range: entry 0% entry 70%; }
  }
  ```
- 구현 요지: JS 스크롤 리스너나 IntersectionObserver 없이 순수 CSS 뷰-타임라인으로 스크롤 진입 시 페이드/라이즈. `@supports` 밖에서는 초기 숨김 상태가 존재하지 않아 미지원 브라우저·reduced-motion 사용자는 항상 콘텐츠를 바로 봄 — "reveal 실패가 콘텐츠 손실이 되지 않는다"는 설계.
- 의존성: 없음 (브라우저 네이티브, Chrome/Edge 계열만 현재 지원)
- 추출 난도: 하 — 20줄 CSS 블록, 그대로 이식 가능. 단 브라우저 지원폭이 좁아 progressive-enhancement 전제 필요.

### A-8 Bottom sheet — standard/modal 변형 + 비드래그 detent 전환 (ui-vocabulary-site)
- 소스: `src/components/bottom-sheet-detents.tsx:39-79`
  ```
  function cycleDetent() { onDetentChange(detent === "collapsed" ? "expanded" : "collapsed") }
  {variant === "modal" ? <button aria-label="Dismiss sheet" className="...bg-foreground/50" data-slot="bottom-sheet-scrim" /> : null}
  ```
- 구현 요지: `standard`(배경 인터랙션 유지, scrim 없음) / `modal`(scrim으로 배경 차단) 두 변형. detent(collapsed/expanded) 전환은 드래그 핸들 탭으로도 가능해 "드래그가 유일한 입력 경로"가 되지 않게 함(VoiceOver·스위치 컨트롤 대비).
- 의존성: 없음
- 추출 난도: 하 — 상태 2개(open, detent)로 구성, 그대로 이식 가능.

### A-9 MutationObserver로 `<html class="dark">` 관찰 — 임의 컴포넌트 트리에서 사이트 테마 동기화 (ui-vocabulary-site)
- 소스: `src/lib/preview-theme.ts:52-63`
  ```
  const observer = new MutationObserver(() => setTheme(readDomTheme()))
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  ```
- 구현 요지: 데모 프리뷰처럼 React 트리 최상단과 분리된 하위 컴포넌트에서도 `document.documentElement`의 class 속성 변경을 관찰해 다크모드 상태를 읽는다. Context 전파가 어려운 격리된 트리(iframe 유사 프리뷰, 독립 렌더 영역)에서 전역 테마를 따라가게 하는 범용 유틸리티 훅.
- 의존성: 없음 (Web API)
- 추출 난도: 하 — 12줄 훅, 그대로 재사용 가능. 다크모드 자체 토글 메커니즘(FOUC 방지 인라인 스크립트, 3-상태 라이트/다크/시스템)은 `src/lib/preview-theme.ts:16-48`에도 있으나 표준적인 localStorage+matchMedia 패턴이라 별도 카드로는 탈락.

### 실측 — head-meta 소스 (A)
- `index.html:20-43`에 OG/Twitter 메타·파비콘·title이 **정적으로 하드코딩**되어 있고 이미지 1장(`og-image.png`)을 전체 사이트가 공유한다. 페이지별(용어별) 동적 OG 이미지/설명 생성 스크립트나 프리렌더 파이프라인은 이 레포에 없음(`vite.config.ts`·`package.json`에 react-snap/prerender/sitemap 관련 스크립트 없음 확인).
- 클라이언트 사이드 title/description만 라우트별로 갈아끼움: `src/lib/page-meta.ts:47-52` — `usePageMeta` 훅이 `document.title`과 `meta[name="description"]`을 `useEffect`에서 직접 DOM 조작으로 바꾼다. SPA라 SSR/프리렌더가 없으므로 이 값은 소셜 크롤러(OG 크롤러는 JS 미실행)에는 반영 안 됨 — **크롤러가 보는 OG는 항상 `index.html`의 정적값 하나**라는 갭이 head-meta 템플릿 설계의 입력이 될 수 있음.
- FOUC 방지 다크모드 결정은 `index.html:9-19` 인라인 스크립트(첫 페인트 전 동기 실행, 기본값 라이트).

### 탈락 (A)
- `src/tokens.css:45-68`의 spacing/radius 스케일(4px 배수, radius 4종) — 표준적인 4px 그리드라 새로울 게 없음.
- `src/hooks/use-mobile.ts` — `matchMedia` 기반 단순 브레이크포인트 훅, 흔한 패턴이라 카드화 가치 낮음.

---

## B. poc-graph

### B-1 인터럽터블 GSAP 타임라인 — 패널 오픈/클로즈 (sequence guard + reduced-motion 즉시 대체) (poc-graph)
- 소스: `viewer.html:3452-3555`
  ```
  function killFocusTimeline() { if (focusTimeline) { focusTimeline.kill(); focusTimeline = null; } ... }
  const sequence = ++focusSequence;
  killFocusTimeline();
  ...
  focusTimeline = gsap.timeline({ defaults:{ ease:"power3.out", overwrite:"auto" }, onComplete:() => { if (focusMotionState.sequence === sequence) ... } })
  ```
- 구현 요지: 노드를 빠르게 연속 클릭해도 이전 타임라인을 `kill()`하고 카메라 트윈까지 `killTweensOf`로 정리한 뒤 새 시퀀스 번호로 새 타임라인을 시작 — `onComplete`이 자기 시퀀스 번호와 다르면 상태를 건드리지 않아 레이스 컨디션 방지. `prefersReducedMotion()`이면 `applyImmediateDetailState()`로 transform/opacity를 직접 대입해 애니메이션을 완전히 스킵.
- 의존성: `gsap` (CDN)
- 추출 난도: 중 — 시퀀스 번호 가드 패턴은 범용적이지만, 패널/사이드바/그래프 3개 엘리먼트의 opacity를 한 타임라인에 물리는 구조라 이식 시 대상 엘리먼트 재정의 필요.

### B-2 3D→2D 라벨 오버랩 회피 배치 (screen-space label collision avoidance) (poc-graph)
- 소스: `viewer.html:1483-1509`
  ```
  const overlaps = placed.some(box => !(labelBox.right + 8 < box.left || labelBox.left > box.right + 8 || ...));
  if (!active && overlaps) return;
  placed.push(labelBox);
  ```
- 구현 요지: three.js 노드의 월드 좌표를 카메라에 projection한 화면 좌표로 라벨 박스를 만들고, 이미 배치된(`placed`) 박스와 AABB 겹침 검사를 해 겹치면 라벨을 그리지 않는다(단 focus/hover 중인 노드는 강제로 표시). depth cue로 멀리 있는 라벨은 opacity를 낮춤. DOM 엘리먼트는 필요한 것만 생성·재사용하고, 더 이상 필요 없는 라벨은 매 프레임 `remove()`.
- 의존성: `three`
- 추출 난도: 중 — AABB 겹침 검사 자체는 범용이나 projection/depth-cue 계산이 three.js 씬 구조에 묶여 있어 다른 3D 렌더러로 옮기려면 좌표 변환 부분을 재작성해야 함.

### B-3 세그먼트 컨트롤 토글 — 이벤트 위임 + 단일 active class (poc-graph)
- 소스: `viewer.html:3582-3586`
  ```
  document.getElementById("seg-layout").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setLayout(b.dataset.m); });
  document.querySelectorAll("#seg-space button").forEach(x => x.classList.toggle("on", x === b));
  ```
- 구현 요지: 버튼 그룹에 리스너를 하나만 걸고 `closest("button")`으로 클릭된 버튼을 찾아 데이터 속성으로 분기, 나머지 버튼의 `.on` 클래스를 일괄 초기화. 프레임워크 없는 세그먼트 컨트롤의 표준 바닐라 패턴.
- 의존성: 없음
- 추출 난도: 하 — 프레임워크 무관, 그대로 복붙 가능.

### 실측 — head-meta 소스 (B)
- `viewer.html:3-20`과 `dist/index.html:3-20`이 **완전히 동일**(빌드가 정적 HTML을 그대로 복사) — OG 타입/이미지(`og-image.png`, 1200x630, `og:image:alt`까지 명시)·Twitter card·favicon(`favicon.png`, 64x64)이 전부 하드코딩. 그래프 노드별(질문 페이지·특정 기억 딥링크) 동적 메타는 없음 — A와 동일한 "SPA 단일 정적 OG" 갭.
- `<title>` 은 `Second Brain — Knowledge Universe`로 고정, 런타임 노드 포커스와 무관하게 변경되지 않음(A의 `usePageMeta`처럼 라우트별 title 갈아끼우기조차 없음 — head-meta 템플릿 관점에서 A보다 더 단순한 사례).

### 탈락 (B)
- `.focus-pill:hover`/`.cite-ref:hover`/`.source-row:hover`(viewer.html:94, 156, 166) — 색상만 바뀌는 표준 hover 트랜지션, 새 기법 없음.
- `worker/citation-markers.ts` — 인용 텍스트 정규화 로직으로 UI 패턴이 아니라 서버 텍스트 처리, 디자인 시스템 대상 아님.
- `worker/auth.ts`·`access.ts`·`ask.ts`·`question-intent.ts`·`retrieval-policy.ts` — 모두 백엔드 로직(인증·RAG 정책), 화면 UI 미포함.

---

## 요약

- A: 마이크로 인터랙션 8종(magnetic button, actionable toast, spring drag, swipe row, pull-to-refresh, staggered entrance, scroll-driven reveal, bottom sheet) + 유틸리티 1종(MutationObserver 테마 동기화) + head-meta 실측(정적 단일 OG, 클라이언트 title만 라우트별).
- B: 마이크로 인터랙션/레이아웃 3종(interruptible GSAP 패널 타임라인, 3D 라벨 오버랩 회피, 세그먼트 컨트롤 위임 패턴) + head-meta 실측(A와 동일한 정적 단일 OG 갭, title도 고정).
- 두 레포 모두 SPA라 소셜 크롤러가 보는 OG 메타는 빌드 시점 정적값 1개뿐이라는 공통 갭 — head-meta 템플릿 착지 시 "정적 폴백 + (있다면) 라우트별 title/description 오버라이드"를 최소 계약으로 잡을 근거가 됨.

### 2차 — bootcamp + dev + sixsense (렌즈 재탐)

# M22 2차 증보 채굴 — A/B/C 재탐 (읽기 전용)

## A. ai-bootcamp-2026

### A-1 라벨 로테이션 (숫자→문자 크로스페이드) (ai-bootcamp-2026)
- 소스: `src/components/rotating-label.tsx:8-23`, `src/app/globals.css:138-159`
  ```tsx
  const [index, setIndex] = useState(0);
  useEffect(() => { const id = setInterval(() => setIndex(i => (i+1)%LABELS.length), 1800); return () => clearInterval(id); }, []);
  <span key={index} className="animate-label-swap inline-block">{LABELS[index]}</span>
  ```
  ```css
  @keyframes label-swap { 0%{opacity:0;transform:translateY(.5em)} 18%,82%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-.5em)} }
  ```
- 구현 요지: `key={index}`로 React가 매 인터벌마다 새 DOM 노드를 만들어 CSS keyframe 애니메이션을 재실행시킨다. `w-[3.4ch]` 고정 폭 그리드로 자릿수가 바뀌어도 레이아웃이 흔들리지 않음. `prefers-reduced-motion` 대응 포함.
- 의존성: 없음 (순수 React state + CSS keyframes)
- 추출 난도: 하 — 컴포넌트 하나, 의존성 없음, 폭 고정 트릭만 기억하면 그대로 이식 가능

### A-2 브랜드 마퀴 — 개수 비례 속도 (ai-bootcamp-2026)
- 소스: `src/components/brand-marquee.tsx:8-12`, `src/app/globals.css:161-180`
  ```tsx
  style={{ animationDuration: `${Math.round(names.length * 1.15)}s` }}
  ```
  ```css
  .marquee-mask{mask-image:linear-gradient(to right,transparent,black 10%,black 90%,transparent)}
  .marquee-mask:hover .animate-marquee{animation-play-state:paused}
  ```
- 구현 요지: 마퀴 속도를 항목 수에 비례시켜 "브랜드가 늘어도 체감 속도 동일"을 보장. 좌우 mask-image 페이드로 잘림을 감춤. hover 시 `animation-play-state:paused`로 정지(읽기 시간 확보).
- 의존성: 없음
- 추출 난도: 하 — CSS 변수 하나 + mask-image 한 줄

### A-3 카드 확장 시 형제 카드 blur (비교 패널) (ai-bootcamp-2026)
- 소스: `src/components/product-grid.tsx:119-123`
  ```tsx
  const cardStateClassName = expanded
    ? "relative z-10 ring-1 ring-primary shadow-lg -translate-y-[3px] scale-[1.01] ..."
    : anyExpanded
      ? "opacity-95 blur-[0.6px] hover:blur-none focus-within:blur-none transition-[transform,filter,opacity] duration-200 ..."
      : "...";
  ```
- 구현 요지: 그리드에서 카드 하나가 "비교" 패널을 펼치면, 확장된 카드는 살짝 뜨고(ring+translateY+scale), 나머지 형제 카드는 미세하게 blur 처리해 시선을 확장 카드로 유도. hover/focus 시 개별 blur 해제.
- 의존성: Tailwind arbitrary value(`blur-[0.6px]`)
- 추출 난도: 중 — 상태 하나(`expandedUrl`)와 조건부 className 3분기, 그리드 레이아웃에 이식 시 형제 셀렉터 대체 필요

### A-4 챗 위젯 라벨 hover 확장 FAB (ai-bootcamp-2026)
- 소스: `src/components/size-chat.tsx:146-162`
  ```tsx
  className="... transition-[max-width,opacity,margin-left] duration-200 ... sm:max-w-0 sm:opacity-0 sm:group-hover:ml-2 sm:group-hover:max-w-[10rem] sm:group-hover:opacity-100 sm:group-focus-visible:..."
  ```
- 구현 요지: 데스크톱(`sm:`)에서는 FAB이 아이콘만 보이다가 hover/focus 시 `max-width`를 0→10rem으로 트랜지션해 라벨 텍스트가 부드럽게 확장. 모바일은 항상 라벨 노출(hover 없음 고려).
- 의존성: Tailwind `group`/`group-hover`
- 추출 난도: 하 — className 조합만, 로직 없음

### A-5 head 메타 실측 (ai-bootcamp-2026, Next.js App Router)
- 소스: `src/app/layout.tsx:12-36`, `src/app/manifest.ts:1-27`
  ```ts
  export const metadata: Metadata = {
    metadataBase: new URL("https://bootcamp.askewly.com"),
    title: "너비 · 처음 보는 브랜드도 내 사이즈로",
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "default", title: "너비" },
    openGraph: { title, description, url, siteName, images:[{url:"/og.png",width:1200,height:630}], locale:"ko_KR", type:"website" },
  };
  export const viewport: Viewport = { themeColor: "#141414" };
  ```
- 구현 요지: Next.js `Metadata`/`Viewport` export 객체로 title/description/OG/appleWebApp을 한곳에 선언. `manifest.ts`가 코드로 `MetadataRoute.Manifest`(PWA 아이콘 192/512, standalone, theme_color)를 생성 — 정적 `.webmanifest` 파일이 따로 없고 런타임 라우트로 서빙됨.
- 의존성: Next.js 15 App Router 메타데이터 API
- 추출 난도: 중 — Next.js 특화 패턴(코드 생성 매니페스트)이라 다른 프레임워크로 옮기면 정적 JSON으로 재작성 필요

### 탈락 (A)
- `header-home.tsx`의 로고=홈 새로고침(`<a href>`+Link 배제)은 접근성/라우팅 트릭이라기보다 팀 요구사항 메모라 재사용 소재로 약함.
- `.pressable` 뉴모피즘 인셋(1차 카드에 이미 유사 항목 있을 가능성 높음 — hover:hover 미디어 쿼리 방어는 흔한 패턴).

---

## B. development-dictionary

### B-1 인쇄용 A4 포스터 스타일시트 (@media print) (development-dictionary)
- 소스: `src/index.css:664-762`
  ```css
  @media print {
    @page { margin: 12mm; size: A4 portrait; }
    [data-print-hidden] { display: none !important; }
    [data-export-poster] { display: block !important; }
    [data-print-card] { break-inside: avoid; box-shadow: none !important; }
  }
  ```
- 구현 요지: `data-*` 속성 셀렉터로 화면용 UI와 인쇄용 뷰를 완전히 분리(`data-print-hidden`/`data-export-poster`/`data-print-grid`). `break-inside:avoid`로 카드가 페이지 경계에서 잘리지 않게. 인쇄 시 다크 배경을 `oklch(1 0 0)` 화이트로 강제 전환.
- 의존성: 없음 (표준 CSS)
- 추출 난도: 하 — data 속성 규약만 따라 마크업에 부여하면 그대로 이식

### B-2 포스터 뷰 컴포넌트 (인쇄 전용 레이아웃) (development-dictionary)
- 소스: `src/components/poster-view.tsx:12-38`
  ```tsx
  const isLargeScope = terms.length > 72;
  {isLargeScope && <div className="...">범위가 큽니다. ... 저장하면 더 읽기 좋습니다.</div>}
  ```
- 구현 요지: 인쇄 대상 개수가 많으면(72개 초과) 사용자에게 "범위를 좁혀라" 안내를 인라인으로 띄우는 가드. `print:` Tailwind variant로 화면/인쇄 스타일을 한 클래스 문자열에서 분기.
- 의존성: Tailwind `print:` variant
- 추출 난도: 하

### B-3 시트(Sheet) 슬라이드 4방향 easing 세트 (development-dictionary)
- 소스: `src/index.css:150-236`
  ```css
  [data-slot="sheet-content"][data-side="right"][data-state="open"] { animation: sheet-slide-in-right 460ms cubic-bezier(0.16,1,0.3,1) both; }
  [data-slot="sheet-content"][data-side="right"][data-state="closed"] { animation: sheet-slide-out-right 260ms cubic-bezier(0.7,0,0.84,0) both; }
  ```
- 구현 요지: 열림은 느리고 부드러운 overshoot easing(`cubic-bezier(0.16,1,0.3,1)`, "expo-out" 계열), 닫힘은 더 짧고 가속하는 easing(`cubic-bezier(0.7,0,0.84,0)`)으로 비대칭 처리 — 열 때는 신중하게, 닫을 때는 빠르게. `data-side`(top/right/bottom/left) 4방향 모두 대응.
- 의존성: Radix UI `data-slot`/`data-state`/`data-side` 속성 규약(shadcn Sheet)
- 추출 난도: 중 — easing curve 값 자체는 바로 재사용 가능하나 data-attribute 트리거는 Radix 없이 쓰려면 직접 상태→속성 배선 필요

### B-4 hover 시 자식 오버레이를 `:has()`로 원격 활성화 (development-dictionary)
- 소스: `src/index.css:1217-1223`
  ```css
  .development-hub-room:has(.development-hub-back-bookshelf:hover) .development-hub-return-bookshelf-overlay,
  .development-hub-room:has(.development-hub-back-bookshelf:focus-visible) .development-hub-return-bookshelf-overlay {
    opacity: 1;
    filter: brightness(1.28) drop-shadow(0 0 18px rgb(0 190 255 / 0.28));
  }
  ```
- 구현 요지: 부모 컨테이너에 `:has()`로 자식 hover를 감지해, DOM 트리 순서상 형제가 아닌 다른 요소(글로우 오버레이)를 활성화. JS 없이 순수 CSS로 "이 버튼에 hover하면 다른 곳의 오버레이가 빛난다" 구현.
- 의존성: `:has()` 지원 브라우저(2023+ 대부분 모던 브라우저)
- 추출 난도: 중 — 셀렉터 자체는 간단하지만 오래된 브라우저 호환 여부 확인 필요

### B-5 확대 근접 뷰 — 팬/줌 뷰포트 + 가장자리 마스크 페이드 (development-dictionary)
- 소스: `src/index.css:1514-1620`, `src/components/library-closeup-scene.tsx` (미리 안 읽음, CSS만 근거)
  ```css
  .library-closeup-zoom-layer { transform-origin:center center; transition:transform 180ms ease; will-change:transform; }
  [data-library-closeup-scene][data-library-closeup-panning="true"] .library-closeup-zoom-layer { transition:none; }
  .library-closeup-visual-fade { -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgb(0 0 0/.72) 5%, black 12%, black 84%, rgb(0 0 0/.68) 93%, transparent 100%); mask-mode:alpha; }
  ```
- 구현 요지: 팬 중에는 `transition:none`으로 전환하고(드래그 즉응성), 팬이 끝나면 다시 transition을 살려 스냅. 사각형 뷰의 상/하/좌/우 가장자리를 alpha mask로 부드럽게 페이드아웃해 "줌인된 크롭"이 아니라 자연스러운 비네트로 보이게 함.
- 의존성: 없음 (mask-image, CSS transition 토글)
- 추출 난도: 중 — 팬 상태를 data attribute로 토글하는 JS 배선이 필요하지만 CSS 자체는 그대로 재사용 가능

### B-6 인쇄 다크→라이트 강제 전환 + 컴포넌트별 print override (development-dictionary)
- 소스: `src/index.css:670-676`
  ```css
  @media print {
    :root { --background: oklch(1 0 0); }
    html, body { background: white; }
  }
  ```
- 구현 요지: 다크 테마 전용 앱을 인쇄할 때 CSS 변수 재정의만으로 화이트 배경으로 뒤집는다. 별도 라이트 테마 전체를 만들 필요 없이 `--background` 하나만 오버라이드.
- 의존성: CSS 커스텀 프로퍼티
- 추출 난도: 하

### B-7 head 메타 실측 (development-dictionary)
- 소스: `index.html:1-13`
  ```html
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Askewly Dev Guide</title>
  ```
- 구현 요지: OG 태그·description·theme-color 전부 없음 — Vite 기본 템플릿을 거의 그대로 유지한 최소 head. "head-meta 템플릿" 관점에서는 반례(무엇을 채워야 하는지 보여주는 미달 사례)로만 유용.
- 의존성: 없음
- 추출 난도: 하 (그러나 재사용 가치는 "빠진 것 목록"으로만)

### 탈락 (B)
- `askewly-guide.css`는 이미 정본 토큰을 손편집 금지로 파생시킨 파일(자기 시스템의 토큰 소비 예시) — 외부 소재로 채굴할 대상이 아님(오히려 우리 시스템이 소스).
- `search-autocomplete.tsx`의 커맨드 팔레트 자체는 shadcn `Command` 컴포넌트 표준 사용이라 "재료"라기보다 라이브러리 사용법 — 1차 카드의 "빈 검색 복구 UX"와 결이 달라 스킵 대상.

---

## C. archive/upstage-sixsense

### C-1 head 메타 실측 — 완전한 OG/Twitter/favicon 세트 (upstage-sixsense)
- 소스: `public/index.html:4-16`, `public/app.html:4-16` (동일 패턴 페이지마다 반복)
  ```html
  <meta name="description" content="명륜동·혜화 메뉴판 사진에서 꺼낸 진짜 가격으로, 예산 안에서 학식과 식당을 한 판에 놓고 정해주는 서비스">
  <meta property="og:title" content="한입지도">
  <meta property="og:description" content="...">
  <meta property="og:image" content="https://sixsense.askewly.com/img/og.png">
  <meta property="og:url" content="https://sixsense.askewly.com/">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/img/favicon.svg?v=2">
  <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="48x48">
  ```
- 구현 요지: 정적 HTML 4페이지(index/app/about/contribute)에 OG 세트를 손으로 복제 — SVG 파비콘 우선 + ICO 폴백(`sizes="48x48"`)의 이중 favicon 링크, `og:image` 절대 URL, `twitter:card=summary_large_image`. 쿼리스트링(`?v=2`)으로 favicon 캐시 무효화.
- 의존성: 없음 (정적 HTML)
- 추출 난도: 하 — "head-meta 템플릿"의 최소 완비 세트로 그대로 베이스 템플릿화 가능. 단 4페이지 손복제는 반례(유지보수 취약점)로도 기록할 가치 있음.

### C-2 헤더 로그인 팝오버 — visibility+opacity+transform 3중 전환 (upstage-sixsense)
- 소스: `public/theme.css:112-129`, `public/nav.js:24-68`
  ```css
  .pop{ visibility:hidden;opacity:0;transform:translateY(-6px) scale(.97);transform-origin:top right;
    transition:opacity 140ms ease-out,transform 140ms ease-out,visibility 140ms; }
  .pop.open{visibility:visible;opacity:1;transform:none}
  ```
  ```js
  const open = pop.classList.toggle("open");
  document.addEventListener("click", (e) => { if (pop.classList.contains("open") && !wrap.contains(e.target)) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  ```
- 구현 요지: `display:none` 대신 `visibility+opacity+transform`을 함께 전환해 트랜지션이 항상 재생되게 함(hidden 속성은 트랜지션이 안 걸리는 문제를 회피). 마크업을 JS가 생성해 여러 정적 페이지에 복제된 헤더끼리 문구가 갈리지 않게 단일 소스화. 바깥 클릭+Esc 닫기, `aria-expanded` 동기화까지 포함.
- 의존성: 없음 (vanilla JS)
- 추출 난도: 하 — 프레임워크 무관 패턴, 그대로 포팅 가능

### C-3 좁은 화면 가로 스크롤 nav — 끝 도달 감지로 페이드 제거 (upstage-sixsense)
- 소스: `public/theme.css:83-100`, `public/nav.js:10-22`
  ```css
  .site-head .nav-main{ flex-wrap:nowrap;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none;
    -webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);
    mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent); }
  .site-head .nav-main.at-end{-webkit-mask-image:none;mask-image:none}
  ```
  ```js
  const atEnd = nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 2;
  nav.classList.toggle("at-end", atEnd || nav.scrollWidth <= nav.clientWidth);
  document.fonts?.ready?.then(sync); // 웹폰트 적용 후 폭이 바뀐다
  ```
- 구현 요지: "더 있음"을 알리는 우측 mask-image 페이드를 스크롤 끝에 도달하면 제거해, 마지막 항목이 계속 흐려 보이는("잘린 것처럼 보임") 오인을 방지. `document.fonts.ready` 이후 재계산까지 챙겨 웹폰트 로드로 인한 폭 변화도 반영.
- 의존성: 없음
- 추출 난도: 중 — 로직은 짧지만 "끝 도달 판정 + 폰트 로드 재동기화"라는 두 디테일을 함께 가져와야 완전한 효과가 남

### C-4 타이핑 커밋 카운터 + 캐럿 (레이아웃 흔들림 방지) (upstage-sixsense)
- 소스: `public/app.html` 스타일 블록 내 (`app.html:35-42` 범위, theme.css 아님)
  ```css
  .amt{display:inline-block;min-width:2.6em;margin-left:.08em;text-align:right;color:var(--accent)}
  .amt .caret{width:.06em;height:.74em;vertical-align:0;background:var(--accent)}
  ```
- 구현 요지: 타이핑 애니메이션으로 바뀌는 금액 자리에 `min-width`를 고정해 "8천원"처럼 짧은 값이 나와도 뒤 텍스트("으로")가 흔들리지 않게 함. 우측 정렬로 짧은 값의 빈 공간이 왼쪽으로 몰리게. 캐럿은 캡하이트보다 낮은 높이(`.74em`)로 줘서 줄 높이를 안 키움.
- 의존성: 없음
- 추출 난도: 하 — 값-폭 고정 트릭, 어디든 이식 가능

### C-5 챗 말풍선 등장 애니메이션 + 타이핑 인디케이터 (upstage-sixsense)
- 소스: `public/nav.js` 인접 스타일(`app.html`/`nav.js` 공유 `.cb`/`.typing` 규칙, `nav.js:54-65` 범위 실측은 theme 병합본에서 확인)
  ```css
  .cb{line-height:1.55;animation:cbin 260ms ease-out both}
  @keyframes cbin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .typing i{width:4px;height:4px;border-radius:99px;background:var(--muted);animation:tdot 1s ease-in-out infinite}
  .typing i:nth-child(2){animation-delay:.16s}.typing i:nth-child(3){animation-delay:.32s}
  @keyframes tdot{0%,100%{opacity:.3;transform:none}50%{opacity:1;transform:translateY(-3px)}}
  ```
- 구현 요지: 말풍선 등장은 짧은 fade+rise(260ms), 타이핑 인디케이터는 3개 점에 `nth-child` 지연을 0.16s씩 줘서 웨이브 효과. A의 size-chat.tsx `animate-bounce` 3점과 동형 패턴(다른 레포에서 독립 재발명).
- 의존성: 없음
- 추출 난도: 하

### 탈락 (C)
- `.chip` 자체(예산 칩)는 1차가 이미 "예산 칩 토글"로 카드화한 대상이라 재수록 스킵. 다만 실측 결과 이 칩들은 "토글"이 아니라 대화 안에서 한 번 누르면 사라지는 일회성 제안칩임(`state.chips`는 append-only, 재노출 없음) — 1차 카드가 "토글"이라 이름 붙였다면 정정 필요할 수 있음(참고로만 남김, 새 카드 아님).
- `.hero::before/::after` 배경 이미지+그라디언트 오버레이는 1차의 "히어로 구조"에 포함될 소재로 판단해 스킵.
- `api/_lib/chips.js`의 `mergeConditions` 서버 로직은 UI 재료가 아니라 백엔드 상태 병합 규칙이라 이 채굴 범위(UI 재료) 밖.

---

## 요약

- A: 5개 채택(A-1~A-5), 2개 탈락
- B: 7개 채택(B-1~B-7), 2개 탈락
- C: 5개 채택(C-1~C-5), 3개 탈락(+1 참고 정정)

가장 즉시 이식 가치 높은 것: A-1(라벨 로테이션), C-2(팝오버 3중 전환), C-3(스크롤 끝 감지 페이드), B-1(인쇄 data-attribute 규약), C-1(head-meta 완비 세트).

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

**사용자 확정**: (대기)

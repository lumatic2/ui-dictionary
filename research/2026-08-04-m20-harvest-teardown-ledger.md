# M20 harvest teardown ledger — 배포 표면 29종

> 2026-08-04 · 소비처: `plans/2026-08-04-m20-harvest-teardown.md` (M20 step-1~3 쓰기 정본) · 입력: `research/2026-08-04-harvest-asset-census.md`(29 표면 census, 동결)
> step-1 = 소스 매칭 열 · step-2 = 표면별 teardown 카드 · step-3 = 후보 순위(말미 절)

## step-1 — 소스 레포 매칭 (29행)

매칭 방법: wrangler.toml `name` 실측 + `.vercel/project.json` 실측 + `agent-orchestration/manifests/*.json`(기기별 레포 장부) + `lumatic2` 프로필 README + `Askwely-company` projects.ts + INDEX.md. "추정" 표기는 step-2 라이브 실측으로 판별.

| # | 표면 (도메인) | 호스팅 | 로컬 소스 | 근거 |
|---|---|---|---|---|
| 1 | ui.askewly.com | CF Pages `ui-dictionary` | `~/projects/ui-dictionary` | wrangler.toml name 일치 |
| 2 | dev.askewly.com | CF Pages `development-dictionary` | `~/projects/development-dictionary` | 동명 레포 (+.vercel 바인딩도 있으나 DNS 정본=Pages) |
| 3 | 음식노쇼.askewly.com | CF Pages `food-no-show` | `~/projects/food-no-show` | wrangler.toml name 일치 |
| 4 | americano-robot.askewly.com | CF Pages `americano-robot` | **소스 원격 — M4 기기 `americano-robot-site`** | m4.json manifest (origin 미기록) |
| 5 | accounting.askewly.com | CF Pages `askewly-accounting` | 관련 레포 `~/projects/kifrs-rag` (라벨 "kIFRS") — 배포 설정 로컬 미확인 | Askwely-company projects.ts 라벨 |
| 6 | tax.askewly.com | CF Pages `askewly-tax` | 관련 레포 `~/projects/tax-agent` (라벨 "tax AI") — 배포 설정 로컬 미확인 | Askwely-company projects.ts 라벨 |
| 7 | golf.askewly.com | CF Pages `askewly-golf` | `~/projects/archive/golf` | m4.json origin `golf-ai-caddy` + 라벨 "AI 골프 캐디" |
| 8 | fridge.askewly.com | CF Pages `askewly-fridge` | `~/projects/archive/askewly-fridge` | luma3-portfolio works.ts repoUrl `lumatic2/askewly-fridge` |
| 9 | askewly.com (apex) | Worker `askewly-company` | `~/projects/Askwely-company` | wrangler.toml name 일치 |
| 10 | brain.askewly.com | Worker `askewly-brain` | `~/projects/second-brain/poc-graph` | wrangler.toml name 일치 |
| 11 | account.askewly.com | Worker `earth-accounting-firm` | `~/projects/ai-accounting-firm/web` | wrangler.toml name 일치 |
| 12 | kifrs.askewly.com | Worker `kifrs-viz` | `~/projects/kifrs-rag/web` | wrangler.toml name 일치 |
| 13 | (workers.dev) askewly-knowledge-atlas | Worker | `~/projects/knowledge-graph/web` | wrangler.toml name 일치 |
| 14 | (route dashboard.askewly.com/*) dashboard-landing | Worker | `~/projects/askewly-command` (`scripts/cloudflare-dashboard-landing-worker.js`) | deploy-public-landing-worker.ps1 실측 |
| 15 | bizsim.askewly.com | Vercel | `~/projects/bizsim` | 동명 레포 (windows.json origin 일치) |
| 16 | bootcamp.askewly.com | Vercel | `~/projects/ai-bootcamp-2026` | manifest 매칭 |
| 17 | futsal.askewly.com | Vercel | **소스 원격 — `lumatic2/futsal-app` (M4)** | m4.json origin |
| 18 | guide.askewly.com | Vercel | `~/projects/ai-guide` | INDEX.md (learn.askewly.com 표기와 병존 — step-2 실측) |
| 19 | overrism.askewly.com | Vercel | `~/projects/archive/over-series-site` **추정** | layout.tsx title "OVER SERIES" |
| 20 | physical-ai-arm.askewly.com | Vercel | 관련 `~/projects/physical-ai` (americano-robot-arm 계보) | cover-letter GITHUB_AUDIT — **404 사망 표면** |
| 21 | portfolio.askewly.com | Vercel `luma3-portfolio` | `~/projects/luma3-portfolio` | .vercel/project.json 실측 |
| 22 | precon.askewly.com | Vercel | **소스 미상** — 로컬·manifest·프로필 전수 grep 0건 | step-2 라이브 실측으로 정체 판별 |
| 23 | robot-cleaner.askewly.com | Vercel | `~/projects/cleaning-context` (public SoT `Team-LG-Clean-Robot/cleaning-context`) | cover-letter GITHUB_PUBLIC_SURFACE 실사 |
| 24 | robotics.askewly.com | Vercel | `~/projects/physical-ai` | lumatic2 README ("피지컬 AI 랩 라이브 표면") |
| 25 | sixsense.askewly.com | Vercel `upstage-sixsense-staging` | `~/projects/archive/upstage-sixsense` | .vercel/project.json 실측 + INDEX.md(계속 서빙) |
| 26 | skku.askewly.com | Vercel | `~/projects/archive/skku-2026` 또는 `archive/skku-startup-hub` **미판별** | 동명 후보 2 — step-2 라이브 실측으로 판별 |
| 27 | ux.askewly.com | Vercel `ux-dictionary` | `~/projects/ux-dictionary` | .vercel/project.json 실측 |
| 28 | tax-benchmark.askewly.com | GitHub Pages (lumatic2.github.io) | `~/projects/ktaxbench-leaderboard` (원 벤치 `korean-tax-accounting-ax-benchmark`) | CNAME + 레포 빌드 산출물 실측 |
| 29 | prawn.askewly.com | A 76.76.21.21 (Vercel IP) | `~/projects/prawn` (+public mirror `prawn-public`) | .vercel/project.json 실측 — **무응답 사망 표면** |

step-1 검증: 행 29/29 (census 29 표면 1:1), 소스 칸 공란 0 (미상 1건은 "소스 미상" 명시 — #22).

## step-2 — 표면별 teardown 카드 (29건, 워커 6기 병렬 실측 + 오케스트레이터 표본 재검 3건 일치)

> 스크린샷 원본: 세션 scratchpad `m20-shots/` (viewport+full-page 58장). 카드 내 파일명은 그 디렉터리 기준.
> **step-1 판별 정정 4건**: #19 overrism 소스 = `archive/over-series-site` **확정**(워드마크·내비 일치) · #22 precon 소스 = **`archive/gcp-solana-agentic`**(README "라이브 관제 대시보드 → precon.askewly.com" 실측) · #26 skku 소스 = **`archive/skku-startup-hub`** 확정(창업 공지 콘텐츠) · #29 prawn = **사망 아님** — 콜드스타트 지연이었고 재실측 2회 HTTP 200, 라이브 ERP 대시보드(census 의 "무응답" 은 스윕 시점 timeout).

# M20 배포 표면 teardown — W1 조사 카드

### #1 ui.askewly.com — Askewly Design 정본 사이트
- 관측: `1-ui-askewly.png` · `1-ui-askewly-full.png` · HTTP 200 · 첫 화면은 대형 타이틀("Askewly Design") + 서브카피 + 2버튼(Get Started/Open Docs) + 검색바, 배경에 흩어진 회색/네이비 바 장식. Full-page에서는 "Agent-Ready Design System"(캔버스 에이전트 채팅 목업), "Cursor-Reactive Field", "Physics-Based Interaction", "Product Surface Coverflow"(3D 카드 캐러셀), "Motion Choreography"(달 궤도 영상), Color Palette Generator(5색 스와치+HEX/RGB), Shader Gradient System, Image Treatment(3인물 필터), Hero Composition, Command Center Interface, Commerce Flow(장바구니), Mobile App Patterns(설정 화면), 하단 SaaS 대시보드 쇼케이스, 다크 푸터까지 이어짐.
- 재료 등급: 해당 없음 — 이 사이트가 재료 저장고 본체.
- 품질: 상 — 그리드 배경 장식·보라 액센트·카드 12개 각각이 별도 인터랙티브 데모를 담아 타이포 위계·간격이 시스템적으로 일관됨. generic AI 티 없음.
- 중복: 해당 없음 (자기 자신).
- harvest 후보: no (저장고 본체) — 관측만 기록.

### #2 dev.askewly.com — Askewly Dev Guide (development-dictionary)
- 관측: `2-dev-askewly.png` · `2-dev-askewly-full.png` (뷰포트와 동일, 스크롤 콘텐츠 없음) · HTTP 200 · 다크 테마 문서 사이트. 좌측 고정 사이드바(20+ 개념 항목: 웹 기본 구조·요청과 API·데이터·백엔드 서비스·로그인과 보안·배포와 운영·AI 오케스트레이션 등, 화살표 아이콘 붙은 아코디언), 상단 헤더(로고+부제 "개발 개념과 에이전트 작업 가이드", 검색바, GitHub 아이콘), 메인 캔버스에 "개발 도서관"을 형상화한 대형 isometric 3D 일러스트(책장·서버랙·허브 게이트·AI 오케스트레이션 원형 콘솔 등 8개 구역에 라벨).
- 재료 등급: 패턴 — 다크 사이드바 문서 셀 (docs-code-block류 인접), 대형 커스텀 isometric 일러스트는 토큰이 아니라 아트 에셋이라 별도 범주.
- 품질: 중 — 사이드바 타이포·간격은 깔끔하지만 좁은 다크 네온 팔레트(청록 단색)에 의존, 커스텀 일러스트 자체는 고품질이나 나머지 UI는 표준 docs 템플릿 느낌.
- 중복: `versioned-docs-switcher-navbar-sidebar-swap` 블록과 좌측 사이드바+검색 구조가 겹침. `docs-code-block`, `doc-search-cmdk-grouped-results-panel`(우측 상단 검색)과도 근접.
- harvest 후보: no — isometric 일러스트는 이 레포 브랜드 자산이라 이식 대상 아님, UI 구조는 기존 docs 블록으로 이미 커버됨.

### #3 xn--bk1bs9o85bw39a.askewly.com (음식노쇼) — 배달할뻔
- 관측: `3-food-noshow.png` · `3-food-noshow-full.png` (동일, 스크롤 없음) · HTTP 200 · 데스크톱 뷰포트 중앙에 모바일 폭(iOS 스타일) 카드가 떠 있는 구조. 상단: 로고 "배달할뻔" + 위치("집 › 성균관대 근처") + 로그인, 검색바. 그 아래 오렌지 톤 프로모 배너("도착 화면까지 보고 실결제는 0원" + 스쿠터 일러스트 + 태그 칩), 음식 카테고리 필터 pill(치킨/피자/한식/버거…), "가게 불러오는 중..." 로딩 텍스트, "끌리는 맛집" 섹션에 정렬/필터 pill 2줄(추천순·빠른도착… + 패러디 칩 "배달비 낮은 척"·"가짜 혜택"), 하단 5탭 바텀 네비(홈/검색/찜/주문내역/My).
- 재료 등급: 블록 — 배달앱 홈 화면 전체(카테고리 필터+정렬 칩+바텀탭)가 `category-product-grid` + 커스텀 bottom-nav 조합에 해당. 오렌지 프로모 배너는 `promo-banner-system`과 겹침.
- 품질: 중 — 배민 스타일을 의도적으로 패러디한 문구("배달비 낮은 척", "가짜 혜택")는 톤이 명확하지만, 실제 가게 목록 데이터가 비어 있어("가게 불러오는 중..." 정지 상태) 완성도 판단이 제한적. 색·타이포는 배민 팔레트 재현 수준.
- 중복: `category-product-grid`, `promo-banner-system`과 강하게 겹침. 바텀탭 네비게이션은 기존 자산 목록에 정확히 대응하는 블록 없음(모바일 bottom-nav 자체는 신규 후보 가능).
- harvest 후보: no — 배민 UI 복제 패러디 성격이 강해 정본 자산으로 흡수하기보다 레퍼런스 노트로만 남기는 것이 적절.

### #4 americano-robot.askewly.com — Americano Robot Arm Digital Twin
- 관측: `4-americano-robot.png` · `4-americano-robot-full.png` · HTTP 200 · 다크 네이비 그리드 배경 위 히어로 카드("Americano Robot Arm Digital Twin" 타이틀 + 배지 칩 "21 tests passing"/"simulator-only"/"NO-GO: physical actuation" + Run Demo/Architecture/Evidence 버튼), 우측에 실시간 상태를 보여주는 아이소메트릭 로봇팔 씬(RINSE 스테이지 라벨, SAFETY GATES GREEN 인디케이터). Full-page 스크롤: "Operator Demo Cockpit" 패널(Auto brew/Step command/Clean/E-STOP 버튼, Runtime State, Telemetry 카드+JSON 코드블록, Fault Scenarios 체크박스, Manual Jog 버튼 그리드, State Timeline 리스트, Event Log), 이어서 System Architecture 파이프라인 다이어그램(RecipeEngine→SafetyInterlock→HardwareAdapter→SimulatorAdapter 카드), Safety Boundary 매트릭스(NOT IMPLEMENTED vs IN SCOPE 2단 리스트), Verification Status(4개 상태 배지 PASS/SIM/NO-GO/PASS + 터미널 커맨드 블록).
- 재료 등급: 패턴+블록 다수 — 운영자 콘솔형 대시보드(상태 배지+버튼 그리드+텔레메트리 코드블록)는 `stat-summary-grid` + `audit-log-filterable-export-feed`류 이벤트 로그 + `docs-code-block`(JSON/터미널)의 조합. 배지 칩 시스템("PASS_WITH_RUNTIME_BACKLOG" 등 상태 라벨)은 독립 토큰/패턴 후보.
- 품질: 상 — 다크 테크 팔레트(네이비+시안+경고오렌지)가 일관되고, "시뮬레이터 전용/NO-GO" 같은 안전 경계를 시각적으로 명확히 구분(색상 코드화)해 의도성이 뚜렷함. generic 템플릿 느낌 없음.
- 중복: Operator Cockpit 버튼 그리드는 `bulk-action-toolbar`와 유사, Event Log는 `audit-log-filterable-export-feed`와 근접, Architecture 파이프라인 다이어그램은 기존 목록에 정확한 대응 없음(신규 "pipeline-stage-diagram" 후보).
- harvest 후보: yes — 상태 배지 칩 시스템(색상 코드화된 verdict/verdict badge: PASS/SIM/NO-GO)과 파이프라인 스테이지 다이어그램은 기존 자산에 없는 패턴으로 harvest 가치 있음.

### #5 accounting.askewly.com — kIFRS AI (askewly-accounting / kifrs-rag)
- 관측: `5-accounting.png` · `5-accounting-full.png` · HTTP 200 · 첫 화면은 다크 네이비→인디고 라디얼 그라디언트 히어로: 배지 칩("K-IFRS AI · B2B") + 대형 타이틀(2줄 화이트+1줄 바이올렛 강조) + 서브카피 + 2버튼(무엇을 커버하나요/파트너 문의) + 우측 4-KPI 스탯 카드(86%/80%/+44%p/8,328개). Full-page: "거래 입력부터 검토 메모까지" 5-step 프로세스(아이콘+화살표 연결), "검증된 기준서·시나리오" 6카드 그리드(각 카드에 조항번호+제목+배지 칩), "kIFRS AI가 하는 것들" 2x3 피처 그리드(아이콘+제목+설명+태그 칩), 다크 CTA 밴드("파트너 재무팀을 찾습니다" + 이메일 버튼), 푸터.
- 재료 등급: 블록+패턴 — 히어로(그라디언트+스탯카드)는 `stat-summary-grid` 변형, 5-step 프로세스는 신규 "process-step-flow" 후보, 기준서 카드 그리드·피처 그리드는 `responsive-content-grid`와 겹침.
- 품질: 상 — 다크 인디고/바이올렛 팔레트가 통일감 있고 숫자 강조(대형 볼드 %)·배지 칩 라벨링이 B2B SaaS 톤에 맞게 의도적. 한글 타이포 위계도 명확.
- 중복: 스탯 카드는 `stat-summary-grid`, 피처/커버리지 그리드는 `responsive-content-grid`와 근접. 5-step 프로세스 플로우는 기존 목록에 정확한 대응 없음.
- harvest 후보: yes — 5-step 프로세스 플로우(아이콘+화살표 연결 스텝 시각화)와 다크 인디고/바이올렛 B2B 히어로 그라디언트 톤은 harvest 가치 있음.

### #6 tax.askewly.com — tax AI (B2B 세무 AI)
- 관측: 6-tax.png · 6-tax-full.png · HTTP 200 · 첫 화면은 다크 네이비 그라디언트 배경 위 좌측 대형 한글 헤드라인("세금 질문에, 조문과 판례가 함께 답합니다") + 우측 4분할 통계 카드(97%, 0건, 40+, +20%p). 상단 심플 헤더(로고+뱃지+CTA 버튼). full-page 스크롤 시 "How it works" 5단계 아이콘+화살표 파이프라인 → 2x3 피처 카드 그리드(각 카드 아이콘+제목+본문+소스 태그) → 6개 세목 카드(3x2, 번호 태그) → 다크 CTA 밴드("파일럿 함께 설계해요") → 다크 푸터.
- 재료 등급: 패턴 — 스탯 그리드(stat-summary-grid 자산과 겹침), 피처 카드 그리드, 5단계 프로세스 스텝퍼(신규 후보), 다크 네이비 히어로+통계 조합. 토큰 — 네이비/블루 계열 팔레트(다크 배경 + 밝은 블루 강조).
- 품질: 상 — 타이포 위계 명확(대형 헤드라인 3줄 그라디언트 강조), 카드 간격·라운드 일관, 스탯 숫자 강조 색상 절제됨, 세목 커버리지 섹션의 번호 태그가 정보밀도를 잘 관리함. AI 티 거의 없음, 실제 B2B SaaS 랜딩 수준.
- 중복: 부분 겹침 — stat-summary-grid(통계 카드), sidebar-application-shell류 아님. "How it works" 5단계 스텝퍼는 기존 자산 목록에 정확히 일치하는 게 없어 신규 패턴 후보(step-pipeline-with-connectors).
- harvest 후보: yes — 5단계 프로세스 스텝퍼 패턴과 다크 히어로+통계카드 조합이 재사용 가치 있음.

### #7 golf.askewly.com — AI 골프 캐디
- 관측: 7-golf.png · 7-golf-full.png · HTTP 200 · 첫 화면은 다크 그린 배경 위 좌측 헤드라인("AI가 만든 내 골프 캐디") + 우측 골프 전략카드 미리보기 위젯(홀별 클럽/파 테이블 + "실제 PDF 샘플은 하단에서 확인하세요" 안내 배너). full-page 스크롤 시 5단계 자동화 파이프라인(캘린더→코스데이터→Claude AI→PDF전략카드→텔레그램 전송) → 3열 피처 카드(18홀 맞춤 전략/실시간 날씨/피드백 학습) → "실제 전략카드 샘플" 섹션에 PDF 임베드가 "Couldn't load plugin." 오류로 깨져 있음 → 다크 푸터(Claude AI·Python·Typst·Open-Meteo·Telegram Bot 배지).
- 재료 등급: 패턴 — tax와 동일한 5단계 스텝퍼(재사용 확인), 홀별 테이블 미리보기 위젯(interactive-data-table 변형), 3열 피처 카드. 토큰 — 그린/옐로 골프 테마 팔레트.
- 품질: 중 — 구조와 타이포는 tax와 동일 시스템으로 일관성 있으나, PDF 뷰어가 "Couldn't load plugin."으로 깨져 노출됨(브라우저 네이티브 PDF 플러그인 미지원 이슈로 보임) — 이 부분만 감점. 나머지 레이아웃 품질은 상급.
- 중복: 겹침 — 5단계 스텝퍼는 #6 tax와 동일 컴포넌트 시스템(공유 패턴 확정). 홀별 테이블은 interactive-data-table과 근접.
- harvest 후보: no — tax와 동일 시스템 재사용이라 별도 harvest 불필요, 단 PDF 임베드 깨짐은 버그로 별도 기록.

### #8 fridge.askewly.com — 어슷 (냉장고 재고 관리 앱)
- 관측: 8-fridge.png · 8-fridge-full.png · HTTP 200 · 매우 단출한 라이트 배경 랜딩. 첫 화면은 로고+워드마크 헤더, 중앙 헤드라인("냉장고에 뭐 있지? 어슷이 알려드릴게요."), 서브텍스트, CTA 버튼 2개(더 알아보기/베타 참여 문의), 하단 3열 피처 카드(이모지 아이콘+제목+본문). full-page는 뷰포트 스크린샷과 거의 동일 — 피처 카드 아래 바로 심플 푸터(저작권+정책 링크)로 끝남. 페이지 전체가 짧고 콘텐츠가 매우 얇음.
- 재료 등급: 없음~토큰 — 3열 피처 카드는 매우 기본형(제목+본문+이모지)이라 재사용 가치 낮음. 팔레트는 민트그린+오프화이트 톤.
- 품질: 하 — 콘텐츠가 한 화면 분량뿐이고 히어로 외 섹션이 전혀 없음(소셜 프루프, 스크린샷, 상세 기능 설명 없음). 이모지 아이콘 사용이 제네릭 템플릿 느낌을 줌. 타이포 위계는 무난하지만 시각적으로 미완성 인상.
- 중복: 겹침 낮음 — 단순 3카드 피처 그리드는 기존 자산 어디에도 정확히 대응 안 됨(너무 기본형이라 패턴화 가치 낮음).
- harvest 후보: no — 재료로서 가치가 낮고(콘텐츠 자체가 미완성 랜딩), 참고할 만한 독창적 패턴 없음.

### #9 askewly.com — 회사 사이트
- 관측: 9-askewly-company.png · 9-askewly-company-full.png · HTTP 200 · 첫 화면은 라벤더/퍼플 배경 히어로 — 크림색 헤더 네비(Building/Products/Blog/Brand/Portfolio/로그인/Contact), 대형 블랙 헤드라인("내 가게 속 AI"), CTA 2개(오렌지 필+화이트 아웃라인), 그 아래 브라우저 크롬 프레임 안에 세탁소/목욕탕 대시보드 스크린샷(사이드바+아이소메트릭 일러스트). full-page 스크롤 시 "해답을 찾는 여정" 섹션 — 5단계 스토리텔링(현장에 들어갑니다/흐름을 이해합니다/정보를 수집합니다/모양을 가공합니다/도구를 만듭니다)을 지그재그 레이아웃(일러스트+텍스트 교차 배치)으로 풀어냄, 손그림풍 캐릭터 일러스트 다수. 그 아래 옐로/화이트 빈 배경 섹션이 콘텐츠 없이 길게 이어지다 다크 푸터(Studio/Products/Connect 3열)로 끝남.
- 재료 등급: 패턴 — 지그재그 스토리텔링 섹션(신규 후보, 기존 목록에 정확한 대응 없음), 브라우저 크롬 프레임 안 제품 스크린샷(product-detail-purchase-stack과는 다름, 신규). 토큰 — 라벤더/오렌지/크림 브랜드 팔레트, 커스텀 일러스트 스타일(다른 표면과 확연히 차별화된 유일한 브랜드 아이덴티티).
- 품질: 상 — 이 5개 표면 중 가장 브랜드 아이덴티티가 뚜렷함(커스텀 캐릭터 일러스트, 독자적 컬러 시스템, 지그재그 스토리텔링 구조). 다만 하단에 콘텐츠 없는 빈 옐로/화이트 섹션이 상당한 스크롤 길이로 이어져 미완성 인상(로딩 실패 또는 미구현 섹션으로 추정, 재확인 필요).
- 중복: 낮음 — 지그재그 스토리텔링과 브라우저 프레임 스크린샷 모두 기존 자산 목록과 겹치지 않는 신규 패턴.
- harvest 후보: yes — 지그재그 스토리텔링 섹션과 일러스트 스타일 토큰은 이식 가치가 높음. 단 빈 섹션은 별도로 버그/미완성으로 보고 필요.

### #10 brain.askewly.com — Second Brain 공개 세계관 그래프
- 관측: 10-brain.png · 10-brain-full.png · HTTP 200 · 풀블랙 배경의 force-directed 그래프 시각화가 화면 전체를 채움 — 좌측 고정 패널(제목 "Second Brain", 161 실제 노트·534 연결 카운트, 렌즈 필터 5종, 주제·태그 칩, 노드 간격 컨트롤, 노드 유형 범례 7종). 그래프는 흰/오렌지 점+선으로 노드-엣지를 그리며 주요 노드에 한글 라벨("하네스가 바꾸는 결과", "멀티에이전트 교차검증", "Luka의 일과 정체성" 등)이 떠 있음. 하단 중앙에 "로그인 후 질문하기" 인풋바. full-page는 뷰포트와 동일(스크롤 없는 캔버스 앱).
- 재료 등급: 패턴/모션 — force-directed 그래프 시각화 자체(canvas-particle-field와 근접하되 데이터 기반 노드-그래프라는 점이 다름, 신규 후보 "knowledge-graph-viewer"), 좌측 필터+범례 패널(advanced-filter-builder와 유사 구조). 토큰 — 풀블랙 배경+화이트/오렌지 accent, 다크모드 전용 팔레트.
- 품질: 상 — 그래프 레이아웃이 실제 데이터 밀도를 잘 표현하고(중심 허브 노드로 시선 유도), 좌측 패널의 정보 위계(카운트→렌즈→태그→간격→범례)가 체계적. generic AI 티 없음, 데이터 시각화 전문 제품 수준.
- 중복: 부분 겹침 — 좌측 필터 패널은 advanced-filter-builder·audit-log-filterable-export-feed와 구조적으로 유사(체크박스형 카테고리+카운트). 그래프 캔버스 자체는 canvas-particle-field/lazy-three-object-scene과 인접하지만 완전히 겹치진 않음(파티클이 아니라 라벨 달린 지식 그래프).
- harvest 후보: yes — force-directed 지식 그래프 시각화 패턴은 기존 자산 목록에 없는 독립 카테고리로 harvest 가치 높음.

### 11 account.askewly.com — earth-accounting-firm
- 관측: `11-earth-accounting-firm.png` · `11-earth-accounting-firm-full.png` · HTTP 200 · 첫 화면은 다크 네이비 히어로(오렌지 라벨 "VIRTUAL FIRM EXPERIMENT" + 대형 한글 헤드라인 + 본문 + 2버튼 CTA), 헤더는 라이트 톤 텍스트 네비. full-page는 히어로 이미지 아래로 4자리 KPI 스탯 그리드(0 / 0/17 / 5/5 / 0:0), "Featured AX 사례" 카드 슬롯, "AI가 못 하는 것" 경계 사례 카드 2개, 서비스 라인 카드 3개, 인사이트 카드 3개, "판단은 인간, 실행은 AI" 원칙 섹션, 조직도 CTA, 푸터로 이어짐.
- 재료 등급: 패턴 — KPI 스탯 그리드(stat-summary-grid 유사), 카드 그리드 3열 반복(서비스·인사이트), 다크 히어로+라이트 콘텐츠 섹션 전환 패턴. 토큰은 네이비/오렌지 악센트 팔레트.
- 품질: 중상 — 타이포 위계는 명확(라벨→헤드라인→본문 크기 단계), 카드 그리드 정렬 일관적이나 스탯 값이 전부 0이라(0, 0/17, 5/5, 0:0) 데이터 미채움 상태로 보임. 색 체계는 의도적(네이비+오렌지)이나 generic B2B 랜딩 톤에서 크게 벗어나지 않음.
- 중복: stat-summary-grid 블록과 개념적으로 겹침(4칸 KPI 그리드). 카드 그리드는 responsive-content-grid와도 겹침.
- harvest 후보: no — 이미 보유한 stat-summary-grid/responsive-content-grid 패턴과 실질적으로 동일 구조라 신규성 낮음.

### 12 kifrs.askewly.com — kifrs-viz
- 관측: `12-kifrs-viz.png` · `12-kifrs-viz-full.png` · HTTP 200 · 첫 화면은 라이트 세이지 배경, 좌측 정렬 대형 세리프 헤드라인("기준서 백 권을, 기계가 읽는 장부로.") + 통계 인라인 강조(17,899문단) + 서가 사진. full-page는 6개 넘버링 섹션: I.기준서 지도(막대형 트리맵/서가 시각화, 100권 분류), II.기준서 사이의 참조(force-directed 네트워크 그래프, 초록 노드), III.검색 품질(스탯 타일 4개 + 5-bar 비교 바차트), IV.파이프라인(사진 배너 + 6개 스탯 카드), V.drift 감시 루프(스탯 타일 4개), VI.수리 루프 연대기(타임라인 로그, 이슈→해소 diff 카드).
- 재료 등급: 블록 — 트리맵형 막대 시각화(서가), force-directed 네트워크 그래프, 바차트 비교, 타임라인/changelog 로그 카드. 토큰은 세이지그린+먹색 세리프 헤드라인의 학술/서가 톤.
- 품질: 상 — 데이터시각화 6종이 각기 다른 형식(트리맵·그래프·바차트·스탯타일·타임라인)으로 정교하게 조합되어 있고, 세리프 헤드라인+모노스페이스 라벨("K-IFRS RETRIEVAL ENGINE")의 대비가 의도적. generic AI 랜딩 티가 거의 없음 — 도메인 특화 시각화가 뚜렷한 근거.
- 중복: force-directed 네트워크 그래프는 기존 자산 목록에 없음(lazy-three-object-scene은 3D오브젝트 씬이라 다름, canvas-particle-field는 파티클이라 다름). 타임라인 로그는 audit-log-filterable-export-feed와 결이 다름(필터/export 아님, changelog형). 트리맵 서가 시각화도 신규.
- harvest 후보: yes — force-directed network graph 시각화와 트리맵형 서가 차트, changelog 타임라인 카드 3종이 기존 자산에 없는 데이터비주얼 재료.

### 13 askewly-knowledge-atlas.yusung8307.workers.dev — 지식 그래프 아틀라스
- 관측: `13-knowledge-atlas.png` · `13-knowledge-atlas-full.png` · HTTP 200 · 풀블랙 배경에 좌측 고정 사이드바(제목 "Knowledge Atlas" + 노드/연결 카운트 메타, 검색 입력, "렌즈" 토글 2개, 태그 칩 리스트 "주제로 둘러보기"— 카운트 배지 포함), 우측 대부분을 차지하는 인터랙티브 force-directed 그래프 캔버스(가는 선으로 연결된 점들, 붉은/초록 노드 컬러 코딩). full-page는 뷰포트와 동일(스크롤 콘텐츠 없음, 캔버스가 뷰 전체).
- 재료 등급: 모션/블록 — 인터랙티브 3D/2D force-directed 그래프 캔버스, 사이드바 필터 칩(태그+카운트) 패턴. 다크 모드 전용 팔레트(순흑 배경 + 형광 그린/레드 노드).
- 품질: 중 — 사이드바 타이포·칩 레이아웃은 정갈하지만 그래프 자체는 스크린샷 시점에 노드 밀도가 낮고 레이블이 안 보여(초기 로드 상태로 추정) 정보 전달력이 약함. 다크 캔버스+사이드바 조합은 개발자 도구풍이라 generic한 "그래프 뷰어" UI에 가까움.
- 중복: canvas-particle-field(파티클 필드)와 결이 다르지만 "점+선 네트워크 캔버스"라는 점에서 인접 — 완전한 신규는 아니고 lazy-three-object-scene과도 다름. 사이드바 태그 칩 필터는 advanced-filter-builder보다 단순(카운트 배지만 있는 토글 리스트).
- harvest 후보: no — #12의 force-directed 그래프가 더 완성도 높은 예시라 중복 수확 불필요, 태그 칩 필터도 신규성 낮음.

### 14 dashboard.askewly.com — dashboard-landing (Askewly Command)
- 관측: `14-dashboard-landing.png` · `14-dashboard-landing-full.png` · HTTP 200 · 첫 화면은 다크(거의 순흑) 배경 히어로 — 퍼플/오렌지 2톤 앱 아이콘, 대형 한글 헤드라인 + 서브텍스트 + 오렌지 프라이머리 버튼/아웃라인 세컨더리 버튼 + 3개 필 배지, 그 아래 앱 위젯 스크린샷(할일 리스트+캘린더 패널) 목업. full-page는 목업 아래로 섹션 네비 탭(개요/PC 위젯/Android/리듬/활용/FAQ), PC 위젯 소개(체크리스트+스크린샷 반복 레이아웃), Android 섹션(폰 프레임 목업), "리듬" 3카드(아침/진행 중/저녁 아이콘 카드), "활용 방식" 2x2 아이콘 카드 그리드, FAQ 아코디언(3문항), 푸터.
- 재료 등급: 패턴 — 다크 SaaS 랜딩 정석 구조(히어로+제품 목업+기능 3카드+2x2 아이콘 그리드+FAQ 아코디언). 오렌지+퍼플 악센트 온 다크 토큰.
- 품질: 중 — 위계·간격은 정돈되어 있으나 히어로 구성(중앙 정렬 아이콘+헤드라인+CTA+배지 3개+목업)이 매우 전형적인 "dark SaaS product landing" 템플릿 패턴과 겹쳐 generic 티가 남. 위젯 목업 스크린샷 자체(캘린더+할일 패널)는 실물 데이터가 있어 신뢰도는 있음.
- 중복: FAQ 아코디언은 자산 목록에 명시적 항목 없음(가장 근접한 건 doc-search류가 아님). 2x2 아이콘 카드 그리드는 stat-summary-grid·responsive-content-grid와 개념적으로 겹침. 전체 구조는 신규 블록이라기보다 기존 SaaS 랜딩 패턴 조합.
- harvest 후보: no — FAQ 아코디언 단독으로는 소재가 얇고 나머지는 기존 그리드/카드 패턴과 중복.

### 15 bizsim.askewly.com — AI 경영 시뮬레이션 (BizSim)
- 관측: `15-bizsim.png` · `15-bizsim-full.png` · HTTP 200 · 뷰포트/full-page 동일 화면(스크롤 콘텐츠 없음) — 라이트 그리드 배경 위 중앙 정렬 온보딩 카드: 작은 재생아이콘+워드마크("BizSim"), 카테고리 라벨("경영 시뮬레이션"), 헤드라인("BizSim에 오신 것을 환영합니다"), 파란 필 버튼("다음"), 3단 진행 도트, "건너뛰기" 링크.
- 재료 등급: 없음 — 온보딩 웰컴 스텝 1장뿐, 실제 시뮬레이션 UI·데이터·차트는 노출되지 않음(로그인/딥링크 이전 단계로 추정).
- 품질: 하 — 배경 그리드+중앙 카드+파란 CTA+진행 도트는 부트스트랩형 온보딩 보일러플레이트의 전형이라 generic AI 템플릿 티가 강함. 타이포 위계는 단순(라벨-헤드라인-버튼 3단뿐)이라 판정할 재료 자체가 부족.
- 중복: 기존 자산 목록에 온보딩 웰컴/스텝 패턴 항목 없음 — 다만 소재가 너무 얇아 비교 의미 없음.
- harvest 후보: no — 실질 콘텐츠 없이 1스텝 웰컴 화면만 노출되어 재료 등급 자체가 "없음".

### 16 bootcamp.askewly.com — 너비 · 사이즈 번역기 (AI Vibe Coding Bootcamp 2026)
- 관측: 16-bootcamp.png · 16-bootcamp-full.png · HTTP 200(추정, 정상 로드) · 첫 화면은 다크 텍스트/라임 하이라이트 헤더("내 사이즈는 L, 다른 브랜드에서는 뭘까요?") + 브랜드 로고 스트립(Calvin Klein, Carhartt, FILA 등) + Step 1/2 진행바가 있는 브랜드 선택 카드 그리드. full-page에서는 AI 사이즈표 검색 CTA, 실측 치수 입력 CTA, "결과 보기" 버튼, 하단 3열 푸터(사이즈 번역기 소개·기능 목록·"만드는 사람들: AI Vibe Coding Bootcamp 2026")까지 이어진다.
- 재료 등급: 패턴 — 라임/블랙 투톤 하이라이트 배지, step-progress 바, 브랜드 로고 캐러셀, 검색+체크박스형 선택 그리드.
- 품질: 중 — 헤드라인 타이포 위계(굵은 산세리프 + 언더라인 강조 입력값)는 의도적이나, 카드 그리드 간격·버튼 색상(회색 비활성 "결과 보기")이 다소 generic Tailwind 기본기 느낌. 라임 악센트 하나로 브랜드감을 주는 시도는 있음.
- 중복: bulk-action-toolbar/interactive-data-table류와는 다르고, step 진행형 폼은 기존 자산 목록에 정확히 겹치는 항목 없음. checkout-order-summary의 step indicator와 유사한 결이나 도메인이 다름.
- harvest 후보: no — 재료가 얇고(단일 폼 플로우), 톤이 프로덕트라기보다 해커톤 데모 수준.

### 17 futsal.askewly.com — Futsal Growth 대시보드
- 관측: 17-futsal.png · 17-futsal-full.png · HTTP 200(정상 로드, viewport와 full-page 동일 — 스크롤 콘텐츠 없음) · 다크 테마 대시보드. 상단 네비 "FUTSAL GROWTH" + 커리큘럼/강의/기록 탭, 본문은 "내 성장 대시보드" 헤더 + 난이도 세그먼트(초급/중급/고급) + 오늘의 미션 카드(원형 진행률 게이지 0%, 할 일 항목, 완료 체크 버튼) + 우측 "빠른 이동" 링크 리스트. 푸터에 "Local-only MVP · No DB · YouTube embed" 명시.
- 재료 등급: 패턴 — 원형 progress 게이지 + 미션 카드 조합, 난이도 세그먼트 컨트롤.
- 품질: 하 — 화면이 매우 단조롭고(카드 1개 + 사이드 링크 3개), 여백이 큰데 콘텐츠 밀도가 낮아 미완성 MVP 인상. 색 대비(초록 CTA)는 기능적이나 시스템감은 약함.
- 중복: stat-summary-grid의 progress 게이지 요소와 결이 겹치나 스코프가 너무 작아 독립 자산화 가치 낮음.
- harvest 후보: no — "Local-only MVP" 자기 표기대로 실험 단계 산출물, 재료 밀도 부족.

### 18 guide.askewly.com — AI 학습 허브
- 관측: 18-guide.png · 18-guide-full.png · HTTP 200(정상 로드) · 다크 테마 문서 허브. 좌측 고정 사이드바(AI CURRICULUM 그룹 헤더 + Claude Code/Microsoft 365 하위 섹션, 활성 항목 초록 하이라이트) + 우측 본문은 오렌지 방사형 로고 + "AI 학습 허브" 히어로, "강의를 듣고 나서도 혼자 굴러가게" 카드(강의 CTA). full-page에서 "어떤 도구로 시작할까요?" 2x2 카드 그리드(Claude Code/Microsoft 365 활성, ChatGPT/Gemini "준비 중" 배지)와 "Claude Code는 이렇게 동작합니다" 섹션의 터미널+브라우저 프리뷰 목업(맥 스타일 창틀, `$ 홈페이지 만들어줘` 커맨드 애니메이션 정지 프레임)까지 이어진다.
- 재료 등급: 블록 — sidebar-application-shell(섹션 그룹핑+활성 하이라이트)에 가까운 완성도, 추가로 "준비 중" 배지가 붙은 feature 카드 그리드, 터미널+브라우저 듀얼 패널 목업 컴포넌트.
- 품질: 상 — 타이포 위계(대형 굵은 헤드라인/서브카피/eyebrow 라벨 초록색)가 일관되고, 다크 테마 색 체계(배경 대비 카드 elevation, 초록/오렌지 악센트 분리 사용)가 의도적. 터미널 목업의 창틀 dot·경로 표시·타이핑 프롬프트 디테일까지 신경 씀. generic AI 티가 적은 축.
- 중복: 좌측 사이드바는 sidebar-application-shell·versioned-docs-switcher-navbar-sidebar-swap과 결이 겹침(그룹 헤더+활성 하이라이트 방식은 이미 자산화된 패턴에 근접). 터미널+브라우저 듀얼 패널 목업은 기존 목록에 정확히 일치하는 항목 없음(신규 후보).
- harvest 후보: yes — 터미널+브라우저 듀얼 패널 데모 컴포넌트, 신규 패턴으로 흡수 가치 있음. 사이드바는 기존 자산과 중복이라 재료로서는 우선도 낮음.

### 19 overrism.askewly.com — OVER SERIES
- 관측: 19-overrism.png · 19-overrism-full.png · HTTP 200(정상 로드) · 첫 화면은 화이트 배경, 상단 좌측 워드마크 "OVER SERIES" + 우측 텍스트 전용 내비(OVERTURE/OVERRIDE/OVERTHROW/OVERLOOK/OVERFLOW/OVERHAUL/OVERWRITE/OVERCAST/OVERLAP/OVERDRIVE 10개), 중앙 초대형 산세리프 헤드라인 "OVER / SERIES" + 이탤릭 서브카피 "Beyond default, in every direction." + "SCROLL" 유도 라벨. full-page 캡처는 헤드라인 아래로 대부분 빈 백색 공백이 이어지다 최하단에 푸터("OVER SERIES · BEYOND DEFAULT, IN EVERY DIRECTION. · CRAFTED BY LUMA")만 나타남 — 내비의 10개 섹션(OVERTURE 등) 콘텐츠가 정적 캡처에는 렌더되지 않음(스크롤/인터섹션 트리거형 reveal 콘텐츠로 추정, 정적 스크린샷에서는 빈 공백으로 잡힘).
- 소스 추정 판별: 확인 — 워드마크·헤드라인·서브카피·10개 내비 항목명이 archive/over-series-site "OVER SERIES" 추정과 정확히 일치. 다만 라이브에서 실제로 관측 가능한 콘텐츠는 히어로 한 화면뿐이고, 나머지 9개 이상 섹션은 스크롤 기반 reveal이 정적 렌더에서 비어 보여 실질 재료 평가는 히어로 타이포그래피에 한정된다.
- 재료 등급: 패턴 — 초대형 산세리프 타이포 히어로 + 텍스트 전용 다중 섹션 내비(스크롤 인디케이터 포함). 모션(스크롤 reveal) 후보이나 정적 캡처로는 미확인.
- 품질: 상 — 히어로 단독으로 보면 타이포 위계(초대형 볼드 + 얇은 이탤릭 서브카피 + 소문자 트래킹 라벨)가 매우 의도적이고 생성형 티가 거의 없다. 단, 나머지 섹션이 정적 캡처에서 비어 보이는 것은 완성도 검증 실패로 감점 요인.
- 중복: scroll-driven-reveal 자산과 정확히 겹칠 가능성 높음(내비 항목 수·구조상 스크롤형 다단 섹션 디자인으로 보임) — 다만 실제 스크롤 동작을 재현 검증하지 않았으므로 확정 아님.
- harvest 후보: yes — 히어로 타이포그래피 자체는 재료 가치 있음. 단 scroll-driven-reveal 중복 여부는 실제 스크롤 인터랙션 재검증 후 확정 필요.

### 20 physical-ai-arm.askewly.com — (사망 표면)
- 관측: 20-physical-ai-arm-404.png · `curl -s -o /dev/null -w "%{http_code}"` 실측 결과 = 404 · 화면은 Vercel 표준 404 오류 카드("404: NOT_FOUND", "Code: DEPLOYMENT_NOT_FOUND", "ID: icn1::z9rrp-1785821872620-480ae4cfb844") + 하단 파란 안내 배너("This deployment cannot be found. For more information and troubleshooting, see our documentation.") 단일 구성. full-page 캡처는 생략(사망 카드 규정에 따라 404 화면 1장만).
- 재료 등급: 사망 표면 — 판정 불가
- 품질: 사망 표면 — 판정 불가
- 중복: 사망 표면 — 판정 불가
- harvest 후보: no — 배포가 존재하지 않아(DEPLOYMENT_NOT_FOUND) 실측 가능한 콘텐츠 자체가 없음.

### 21 portfolio.askewly.com — Yusung 개인 포트폴리오 허브
- 관측: 21-portfolio.png · 21-portfolio-full.png · HTTP 200 · 첫 화면은 다크 배경 + 대형 세리프 없는 bold 타이포 히어로("Yusung" 초대형 워드마크 + "identity-first typographic portfolio hub" 서브헤드) 좌측, 우측에 2x2 카드 그리드("Choose a path" — Resume/Product Thinking/Engineering/Creative Systems). full-page 스크롤 시 evidence 카드 3열(Published/Placeholder/Private), 마퀴 티커(레포명 나열), 한글 섹션("포트폴리오 허브" 4카드 이미지+태그), "What belongs here" 3카드, "How I work" 3카드 넘버링, 마지막 CTA + footer.
- 재료 등급: 패턴 — 다크 히어로+2x2 링크 카드 패턴, 마퀴 티커 패턴, 3카드 근거/철학 섹션 패턴. 토큰 후보 — 다크(#0a0a0a대) + 오프화이트 텍스트 + cream 강조 버튼 팔레트, monospace 라벨(PORTFOLIO HUB / ASKEWLY 같은 카테고리 태그).
- 품질: 상 — 타이포 위계가 뚜렷하고(초대형 워드마크→서브헤드→본문), 카테고리 태그 색상 코딩(CAREER/PRODUCT/BUILD/CREATIVE)이 의도적이며 generic AI 템플릿 느낌이 없다. 한글/영어 섹션 전환도 자연스럽다.
- 중복: 기존 자산과 직접 겹치는 블록 없음 — sidebar-application-shell·saas-app-shell과는 다른 개인 링크형 히어로. 부분 유사: stat-summary-grid(2x2 링크 카드)와 결이 비슷하나 카드가 통계가 아닌 내비게이션 링크라 별개.
- harvest 후보: yes — 다크 히어로+카테고리 태그 카드 그리드, 마퀴 티커 패턴은 개인/제품 랜딩용 재사용 가치 있음.

### 22 precon.askewly.com — Askewly Precon (정체 판별 필요, 소스 미상)
- 관측: 22-precon.png · 22-precon-full.png · HTTP 200 · 첫 화면은 다크 네이비 배경 + 오렌지/앰버 강조, 상단 나비게이션("개요/데모 흐름/실시간 현황/거래 기록" + "Solana devnet · 1 USDC ≈ 실운용 50만원 축소판" 상태 배지), 중앙에 대형 한글 헤드라인 "에이전트의 결제는 체인을 통과해야 나간다" + 서브텍스트("광고비는 AI 에이전트가 알아서 쓰고, 회사가 정한 지출 규칙은 Solana 프로그램이 강제한다") + CTA 버튼("데모 흐름 따라가기"). full-page에서 통계 바(5.0 USDC 결제·18건 거부·8가지 규칙 검사) + 코드 비교 섹션("보통의 AI 결제"의 if-문 코드 vs "Precon"의 규칙 파이프라인) + 배포 계정 주소 footer.
- 정체 판별: **Solana 기반 AI 에이전트 지출 통제(스펜딩 가드레일) 데모 프로덕트.** AI 에이전트가 자율적으로 결제를 집행할 때, 지출 한도·승인 규칙을 앱 코드가 아니라 온체인 프로그램(Solana devnet, USDC)으로 강제해 해킹당해도 규칙 위반 결제가 나가지 못하게 한다는 컨셉의 해커톤/사이드 프로젝트형 랜딩+라이브 데모(실시간 현황·거래 기록 탭 존재로 보아 실제 devnet 트랜잭션을 붙인 워킹 데모로 추정). "Autonomous On-chain Settlement"라는 영문 태그라인이 핵심 포지셔닝.
- 재료 등급: 패턴 — 다크 히어로+오렌지 CTA+상태 배지 네비 패턴, 통계 바(스탯 3열) 패턴, "before/after 코드 비교" 섹션 패턴. 토큰 후보 — 네이비/블랙 배경 + 앰버(#f5a623대) 강조 팔레트, monospace 코드 블록.
- 품질: 상 — 헤드라인 타이포 크기·굵기 위계가 강하고 오렌지 강조가 절제되게 쓰였다. before/after 코드 비교 섹션은 개발자 대상 제품에서 설득력 있는 의도적 구성이며 generic한 AI 랜딩 티가 적다.
- 중복: audit-log-filterable-export-feed(거래 기록 탭)와 부분 유사할 수 있으나 확인 안 됨 — "거래 기록" 탭 미방문(스크린샷은 개요 탭만). 통계 바는 stat-summary-grid와 결이 유사.
- harvest 후보: yes — before/after 코드 비교 패턴, 오렌지+네이비 다크 팔레트, 상태 배지 네비게이션 바는 재사용 가치 있음.

### 23 robot-cleaner.askewly.com — 생활 맥락 로봇청소기 (LG 로봇청소기 시뮬레이터)
- 관측: 23-robot-cleaner.png · 23-robot-cleaner-full.png · HTTP 200 · 첫 화면은 라이트 배경, 좌측 상단 로고+타이틀("생활 맥락 로봇청소기" · "럭키 금성 · LG전자 가전 멘토링 트랙"), 본문 좌측에 집 평면도 SVG(로봇청소기 아이콘 배치) + "히트맵 보기" 토글, 우측에 "현재 위치: 주방" 카드와 청소 우선순위 리스트(방별 점수+상태 배지). full-page에서 IoT 센서 모니터링 그리드(12개 카드: 현관 도어락·인덕션·전자레인지 등, 활성 0/12), 시나리오 선택 카드 8개(비 오는 날 귀가/요리 직후/취침 직전/손님 방문 등, 각각 시간+조건 태그), AI 설명 박스("왜 주방?" 드롭다운), 하단 "이 결과에 대해 묻기" 챗 입력창.
- 재료 등급: 블록 — 평면도+실시간 위치 카드(도면 기반 상태 시각화), IoT 센서 카드 그리드(12개 디바이스 상태), 시나리오 선택 카드(시간+조건 태그 조합), AI 설명+후속질문 챗 패턴. 토큰 후보 — 라이트 그레이스케일 배경 + 미니멀 흑백 아이콘, 원형 순위 뱃지.
- 품질: 중 — 정보 밀도가 높고 도면 시각화·센서 그리드는 구체적 도메인(가전 IoT)에 맞춘 의도적 설계이나, 전체적으로 카드 스타일이 균일하고 색상 팔레트가 무채색 단조로워 시각적 차별점은 약함. AI 설명 박스 문구("응답 시간 0ms · 생활 맥락 입력 없음")는 투명성 있는 설계.
- 중복: IoT 센서 카드 그리드는 stat-summary-grid·audit-log-filterable-export-feed와 부분 겹침(카드형 상태 나열). 시나리오 선택 카드는 advanced-filter-builder와 유사한 태그 조합 UI. 챗 입력+후속질문 칩은 chat-conversation-panel과 겹침.
- harvest 후보: yes — 평면도 기반 실시간 위치 시각화 패턴과 시나리오 카드(시간+조건 태그) 조합은 기존 자산에 없는 신규 블록 후보.

### 24 robotics.askewly.com — Robotics Lab (피지컬 AI 랩)
- 관측: 24-robotics.png · 24-robotics-full.png (내용 동일, 스크롤 없음 — 고정 뷰포트 3D 씬) · HTTP 200 · 화면 좌측에 다크 플로팅 패널("Robotics Lab" 타이틀 + "로봇별 행동을 선택하는 MuJoCo 실험실" 서브텍스트, "지금 보는 것: Unitree G1 휴머노이드" 상태 카드, "실험실 배경" 3옵션 카드, "Flat lab v1" 환경 메타데이터, "로봇 선택" 2x2+1 카드 그리드: Unitree G1/Go1/Boston Dynamics Spot/Google Barkour/로봇 팔과 손), 우측 전체는 3D 렌더링 뷰포트(회색 그리드 바닥, 파란 기둥 장애물, 백색 휴머노이드 로봇 모델 + 좌표축 기즈모).
- 재료 등급: 블록 — 3D 시뮬레이션 뷰포트+플로팅 컨트롤 패널 레이아웃(캔버스-particle-field/lazy-three-object-scene 계열과 인접), 로봇/환경 선택 카드 그리드. 토큰 후보 — 다크 반투명 패널(글래스모피즘 유사) + 시안/블루 3D 좌표축 강조.
- 품질: 상 — 3D 뷰포트와 플로팅 정보 패널의 레이어링이 의도적이고(반투명 다크 패널이 3D 배경 위에 뜬 구성), 카드 위계(선택된 항목 스타일 구분)가 명확해 generic 템플릿 느낌이 없다. MuJoCo 도메인 특유의 기술적 정확성(좌표축, TERRAIN/OBSTACLE 메타데이터)도 신뢰도를 높인다.
- 중복: 3D 뷰포트+플로팅 패널 구성은 lazy-three-object-scene·canvas-particle-field와 인접하지만 "실시간 3D 시뮬레이션 컨트롤 패널"이라는 조합은 신규. 로봇 선택 카드 그리드는 category-product-grid와 결이 유사.
- harvest 후보: yes — 3D 뷰포트 위 플로팅 다크 패널 레이아웃(글래스모피즘+기술 메타데이터 카드)은 기존 자산에 없는 조합.

### 25 sixsense.askewly.com — 한입지도 (Upstage AI 해커톤 출품작, 학식·식당 추천)
- 관측: 25-sixsense.png · 25-sixsense-full.png · HTTP 200 · 첫 화면은 라이트 배경, 상단 심플 네비("한입지도" 로고+홈/메뉴 찾기/사진 제보/데이터 파이프라인/Upstage AI/로그인), 대형 헤드라인("오늘 8천원으로 뭐 먹지?" — 금액에 오렌지 강조) + Upstage 브랜드 언급 서브텍스트 + CTA 2개(메뉴 찾아보기/어떻게 만들었나), 하단에 지도(성균관대 인근)+우측 AI 에이전트 챗 패널(추천 메뉴판 리스트+가격). full-page에서 메뉴 가격 마퀴 티커, "범용 챗봇 vs 한입지도" 대비 카드 2개, "만들어지는 과정" 3단계 카드(수집→데이터화→추천) + 식당 리스트 텍스트 블록, "빠진 가게가 있나요?" 사진 제보 CTA, "예산부터 골라 보세요" 예산 탭+식당별 메뉴 가격 3카드, footer.
- 재료 등급: 패턴 — 지도+AI 챗 사이드패널 조합 패턴(location-based recommendation), before/after 대비 카드 패턴, 3단계 프로세스 카드, 예산 탭+가격 리스트 카드. 토큰 후보 — 라이트 배경 + 오렌지/테라코타 강조 팔레트, 손글씨풍 아닌 bold 고딕 헤드라인.
- 품질: 중 — 헤드라인 타이포와 오렌지 강조는 명확하지만, 지도+챗 패널 구성이 다소 빽빽하고 하단 마퀴 텍스트 잘림(가격 나열이 화면 밖으로 흘러넘침)이 있어 마감도가 낮다. 해커톤 산출물 특유의 급조된 티가 일부 섹션(식당 리스트 텍스트 블록)에서 드러난다.
- 중복: 지도+AI 챗 사이드패널은 chat-conversation-panel과 겹침. 예산 탭+가격 카드는 category-product-grid·product-detail-purchase-stack과 결이 유사. 3단계 프로세스 카드는 신규성 낮음(범용 온보딩 패턴).
- harvest 후보: no — 구성 패턴 대부분이 기존 자산과 겹치고, 지도+챗 조합 자체도 마감도가 낮아 재료로서 우선순위 낮음.

# M20 배포 표면 teardown — W6 조사 카드 (26~29)

### 26 skku.askewly.com — 창업 공지 리더보드 ("The Founder Gazette")
- 소스 판별: **archive/skku-startup-hub** (성균관대 창업 공지·행사 수집). 라이브 화면이 "성균관대 학내 공지부터 정부·민간 지원 사업까지" 를 마감·적합도 기준으로 매일 재구성하는 신문형 대시보드이고, 카드 예시가 "[서울창업허브M+] 'Slush 2026' 참가 지원 모집공고", "수원남문시장 창업아카데미", "혁신센터 Open Innovation Day" 등 실제 창업 공지·행사이므로 skku-2026(범용 스타터/데모 추정)이 아니라 skku-startup-hub 가 맞다.
- 관측: `26-skku.png`(뷰포트) · `26-skku-full.png`(풀페이지) · HTTP 200(암묵, playwright 정상 렌더). 첫 화면은 신문 레이아웃 — 좌측 세리프 로고("The Founder Gazette", VOL.01·EST.2026) + 다크 사이드바 네비(Front Page/Roster), 본문은 red-accent 헤드라인("오늘, 먼저 챙겨야 할 공고")과 4개 스탯 카드(In-house/External/Due Today/Within 7 Days). 풀페이지에서는 상단 탭(Front Page/Listings/Workshop/Ledger/Sources), 정렬 토글(추천순/마감임박순/최신순), "편집자의 선택" 3열 카드 그리드(마감 D-day 배지·기관명·"READ THE DISPATCH" 링크)까지 이어진다.
- 재료 등급: 패턴 — 신문/에디토리얼 레이아웃(세리프 헤드라인 + 다크 사이드바), 마감 D-day 배지, 3열 편집 카드 그리드, 4-스탯 요약 바.
- 품질: 상 — 세리프+산세리프 대비를 의도적으로 쓴 신문 컨셉이 일관되고, red accent 컬러가 헤드라인·배지·CTA에만 절제되어 반복되며, 숫자 카운터(00→08/13/74 등)와 배지 색 온도(빨강=오늘 마감, 회색=여유)가 정보 위계와 맞물려 있다. generic AI 템플릿 느낌이 거의 없다.
- 중복: 기존 자산과 직접 겹치는 항목 없음 — audit-log-filterable-export-feed 와 결이 비슷하나(필터·상태 배지 피드) 신문 에디토리얼 톤·D-day 카운트다운 조합은 별개 패턴.
- harvest 후보: yes — 신문형 대시보드 레이아웃 + D-day 마감 배지 패턴은 새 재사용 후보.

### 27 ux.askewly.com — UX 가이드 (ux-dictionary)
- 관측: `27-ux.png`(뷰포트) · `27-ux-full.png`(풀페이지) · HTTP 200(정상 렌더). 첫 화면은 좌측 필터 사이드바("UX 문제 탐색" — 문제 유형별 5개 카테고리·건수 배지)와 우측 메인에 검색바 + 6개 빠른 진입 칩(모바일 앱 UX 개선 등) + "개념 가이드" 카드(Beta 배지, 스킬 다운로드 CTA) + 첫 아티클("모바일 검색 UX 이해하기"). 풀페이지에서는 문제 해석 콜아웃(민트 배경), "핵심 관점" 2x2 정보 카드(함께 보는 도구/관찰할 데이터/산출물 활용/판단 기준), 체크리스트형 "필요한 관찰", 번호 리스트 "사례에서 보는 판단", 태그 필칩("UI 연결"), 불릿 리스트 "검증 지표"까지 이어지는 롱폼 지식베이스 문서 구조.
- 재료 등급: 패턴 — 좌측 필터+카운트 사이드바, 콜아웃 박스, 2x2 정보 카드 그리드, 체크리스트, 번호 리스트, 필칩. 문서형 지식 아티클 레이아웃(docs 계열).
- 품질: 중 — 타이포 위계와 간격은 깔끔하고 일관되지만, 카드 배경색(민트/회색)과 아이콘 사용이 표준 SaaS 문서 템플릿에 가깝고 브랜드 고유의 시각적 시그니처(고유 컬러 체계·독특한 타이포 선택)가 약하다. 기능적으로는 잘 정돈됐으나 "일반적인 잘 만든 문서 사이트" 인상.
- 중복: `api-reference-layout`, `docs-changelog-category-filter-page` 계열과 좌측 카운트 사이드바+본문 아티클 구조가 겹친다. 콜아웃+체크리스트+2x2 정보 카드는 `docs-code-block` 인접 문서 패턴군과 유사.
- harvest 후보: no — 기존 docs/api-reference 계열 패턴과 구조적으로 중복되고, 시각적으로 독자적 재료를 추가하지 않음.

### 28 tax-benchmark.askewly.com — K-TaxBench 리더보드
- 관측: `28-tax-benchmark.png`(뷰포트) · `28-tax-benchmark-full.png`(풀페이지) · HTTP 200(정상 렌더). 첫 화면은 다크 테마 리더보드 — 상단 상태 배지 3종(read-only leaderboard/holdout ranked/ranking eligible), 타이틀+서브카피, 우측 요약 통계(MODELS/HOLDOUT/PUBLIC 카운트), 4개 스탯 카드(HOLDOUT LEADER/LATEST RUN/SPREAD/FLAG), "해석 주의" 안내 박스, 그리고 "불확실성 밴드(holdout)"라는 커스텀 에러바 차트(모델별 점 추정 + bootstrap 95% CI + judge-sensitivity band, legacy 포인트 별도 표기). 풀페이지에서는 모델 랭킹 테이블(순위·holdout/공개셋 점수·등급분포 미니 바), 차원별 평균 히트맵 테이블(calculation_or_process~tool_process, 적/녹 색 그라디언트), 분야별 평균 히트맵(accounting~vat), "대표 오류 사례" 배지 리스트(hallucination/citation_error 색상 구분), 하단 "재출·운영 정책(ADR 0009)" 안내까지 이어진다.
- 재료 등급: 블록 — 커스텀 에러바/불확실성 밴드 차트, 히트맵 랭킹 테이블(색 그라디언트 셀), 배지 기반 오류 분류 리스트. `stat-summary-grid`(4카드 요약)와 결합된 리더보드 대시보드 전체 블록.
- 품질: 상 — 다크 테마에서 데이터 밀도가 높은데도 배지 색상(초록/파랑/보라 상태, 빨강 hallucination 등)이 의미론적으로 일관되고, 불확실성 밴드 차트는 일반 AI 생성 대시보드에서 잘 안 나오는 통계적으로 진지한 시각화다(CI + judge-sensitivity band 분리 표시). 히트맵 색 스케일과 배지 시스템이 전체적으로 통일감 있다.
- 중복: `stat-summary-grid`(4카드 요약)와 부분 중복하나, 불확실성 밴드 에러바 차트·이중 히트맵 랭킹 테이블·judge 교차검증 배지 조합은 신규 재료. `audit-log-filterable-export-feed`와는 오류 사례 배지 리스트 부분만 결이 비슷.
- harvest 후보: yes — 불확실성 밴드 차트(bootstrap CI + judge-sensitivity band)와 이중 히트맵 랭킹 테이블은 기존 자산 목록에 없는 독자적 데이터 시각화 패턴.

### 29 prawn.askewly.com — 제조 ERP 데모 (Prawn Robotics)
- 관측: `29-prawn.png`(뷰포트) · `29-prawn-full.png`(풀페이지) · **HTTP 200** (`curl -s -o /dev/null -w "%{http_code}" -m 10` 재확인 2회 모두 200, 응답 본문도 정상 Next.js HTML). 사전 스윕에서 기록된 무응답/timeout과 달리 이번 실측에서는 정상 응답 — 사망 표면이 아니라 **간헐적 콜드스타트 지연으로 재판정**. 첫 화면은 3열 앱 셸(좌: 로고+공개 데모 워크스페이스 카드+접힘 네비 메뉴, 중앙: "Prawn Robotics 운영 개요" — 5개 스탯 카드(가용 자금/수주 잔량/재고 위험/진행 작업지시/월마감) + 6단계 운영 흐름 파이프라인(수요→MRP→구매→생산/QC→출하→GL, 상태 배지) + 자금 추이 라인 차트 + "주의가 필요한 항목" 리스트, 우: 우측 AI 에이전트 패널("ERP Agent" + 빠른 액션 칩 3개)). 풀페이지에서는 "수주 대비 생산 커버리지" 막대 그래프(수주/생산 가능/출하 가능 3단 바)까지 추가.
- 재료 등급: 블록 — `sidebar-application-shell`(3열: 네비+본문+AI 어시스턴트 사이드패널) + `stat-summary-grid` + 파이프라인 단계 상태 배지(6단계) 조합.
- 품질: 상 — ERP 특유의 정보 밀도(다수 스탯·상태 배지·리스트)를 3열 그리드로 절제해 배치했고, 상태 배지 색(정상/주의/조치 필요)과 진행 흐름 배지가 의미론적으로 일관된다. 우측 AI 에이전트 패널이 워크스페이스 컨텍스트를 아는 척하는 카피("ERP operator agent")까지 갖춰 generic 템플릿 느낌이 낮다.
- 중복: `sidebar-application-shell`(saas-app-shell 계열)과 구조적으로 겹침 — 3열 레이아웃 자체는 기존 자산. 스탯 카드 부분은 `stat-summary-grid`와 중복.
- harvest 후보: no — 레이아웃 뼈대는 기존 saas-app-shell/sidebar-application-shell/stat-summary-grid 조합의 재현이며 독자적 신규 재료는 우측 AI 패널 정도로 미미.


## step-3 — harvest 후보 순위

후보 yes 14 / no 14 / 저장고 본체 1(#1). 순위 기준: 신규성(기존 자산 28종과 중복 낮음) > 품질 > 소스 접근성(로컬·추출 난이도).

### 1군 — M21 첫 승격 추천

| 순위 | 표면 | 승격 재료 | 근거 |
|---|---|---|---|
| 1 | #12 kifrs.askewly.com | **데이터비주얼 3종**: force-directed 참조 그래프 · 트리맵형 서가 차트 · changelog 타임라인 카드 | 품질 상 + 3종 전부 registry 공백(차트 계열 자산 0) + 소스 로컬 `kifrs-rag/web` |
| 2 | #26 skku.askewly.com | **에디토리얼 신문 레이아웃** (세리프/산세리프 대비 + D-day 마감 배지 + 스탯 밴드) | 품질 상 + 완전 신규 계열(에디토리얼 톤 자산 0) + 소스 로컬 `archive/skku-startup-hub` |

### 2군 — 후속 승격 후보 (M21 이후 큐)

| 표면 | 재료 | 비고 |
|---|---|---|
| #28 tax-benchmark | 불확실성 밴드 차트 + 히트맵 랭킹 테이블 | 신규 시각화 — 소스가 빌드 산출물이라 원레포(korean-tax-accounting-ax-benchmark) 추출 필요 |
| #24 robotics | 3D 뷰포트 + 글래스모피즘 플로팅 패널 | lazy-three-object-scene 인접이나 조합 신규 |
| #22 precon | before/after 코드 비교 섹션 + 네이비/앰버 팔레트 | 소스 `archive/gcp-solana-agentic` |
| #9 askewly.com | 지그재그 스토리텔링 + 브라우저 프레임 목업 | 브랜드 일러스트는 아이덴티티 자산이라 계약상 분리 필요 |
| #10 brain | 지식 그래프 캔버스 + 필터/범례 패널 | #12 그래프와 계열 중복 — 하나만 |
| #6 tax + #5 accounting | 5단계 프로세스 스텝퍼(양쪽 공유) | 동일 시스템 2회 등장 = 재사용 실증 |
| #18 guide | 터미널+브라우저 듀얼 패널 데모 목업 | 문서 사이트 계열 |
| #21 portfolio | 다크 타이포 히어로 + 마퀴 티커 | |
| #23 robot-cleaner | 평면도 위치 시각화 + 시나리오 카드 | 도메인 특화 — 일반화 판단 필요 |
| #4 americano-robot | verdict 배지 칩 + 파이프라인 다이어그램 | |
| #19 overrism | 초대형 타이포 히어로 | scroll-driven 콘텐츠 재검증 선행 |

### 제외 (no 14)

#2 dev(기존 docs 자산 커버) · #3 음식노쇼(타사 UI 패러디) · #7 golf(#6 중복) · #8 fridge(재료 없음) · #11 account(기존 grid 중복) · #13 atlas(#12 계열 하위) · #14 dashboard(전형 템플릿) · #15 bizsim(온보딩 1스텝뿐) · #16 bootcamp(재료 얇음) · #17 futsal(미완성) · #25 sixsense(마감도 부족) · #27 ux(docs 중복) · #20 physical-ai-arm(404 사망) · #29 prawn(라이브지만 기존 saas-app-shell 계열 중복).

**사용자 확정 (2026-08-04)**: 에이전트 추천(kifrs-viz·skku)을 **기각**하고 harvest 풀을 직접 확정 — **askewly.com(어스큐리) · brain · guide · dev · bootcamp · sixsense · ui-dictionary(본체)** 7 표면. 기각 사유(사용자 원문): "나머진 AI slop 느낌이 강함." 취향 판정은 사용자 소유 — 순위표의 신규성·품질 축과 다른 축(브랜드 개성)이 결정 기준이었음을 기록한다. ui-dictionary 본체는 승격 대상이 아니라 저장고이므로, 본체 표면의 미등재 쇼케이스 데모를 자산화 후보로 읽는다. M21 첫 승격 실증은 이 풀에서 집행.

---
title: AI 디자인/빌더 도구 — 시각 결정 위임 UI 조사 (도구 쪽 관행)
date: 2026-07-19
scope: v0, Lovable, Framer AI, Wix ADI/Studio, Squarespace Blueprint, Canva, Relume, Figma First Draft/Make, Google Stitch, Pexels/Unsplash API
---

# 1. 요약 — 공통 패턴

1. **"질문 → 좁은 후보군(3~14개) → 카드/썸네일 미리보기 → 전역 토큰에 즉시 반영" 흐름이 사실상 표준.** Squarespace Blueprint(브랜드 성격 7종 × 폰트 페어 14종 × 큐레이션 팔레트), Wix ADI(업종·스타일 질문 → 팔레트/폰트/레이아웃 자동 선택), Figma First Draft(프롬프트 → 테마 썸네일 미리보기 클릭 전환)가 모두 이 형태다. 자유 입력(색상 피커, 폰트 개별 선택)은 큐레이션 후보를 고른 *다음 단계*에서만 열어준다.
2. **원시 자유도(raw color wheel, 임의 폰트 업로드)보다 "페어링/팔레트 세트" 단위로 묶어 제시한다.** Canva Brand Kit는 원색 3~5개+폰트 최대 2개를 권장 상한으로 명시하고, Squarespace는 브랜드 성격당 폰트 2종(총 14종)만 노출한다. 결정 피로를 줄이려 후보 수를 의도적으로 작게 유지하는 관행이 도구 전반에서 관찰된다.
3. **"토큰 설명 텍스트 파일"이 새로운 인터페이스로 부상 중.** Google Stitch의 `design.md`(YAML frontmatter + 자연어 rationale)가 대표 사례 — 색상 하나도 "우리 primary는 #1A73E8" 식으로 사람이 읽는 설명과 함께 기계가 파싱하는 값을 같이 저장한다. 본 레포의 `DESIGN.md` 포맷이 이 계열의 오픈소스화된 버전.
4. **URL 기반 스타일 추출이 보조 입력 경로로 자리잡음.** Google Stitch(URL → 색상/타이포/컴포넌트 스타일 분석), Canva Brand Kit Builder(웹사이트/PDF → 로고·색·폰트 자동 추출)가 "무에서 질문 답하기" 대신 "기존 자산에서 역추출"을 제공한다.
5. **엔터프라이즈/Pro 티어에서만 "재사용 가능한 디자인 시스템" 개념이 등장.** Lovable은 무료/Pro/Teams/Business에 Design Systems 기능이 없고 Enterprise 전용. 즉 대부분의 AI 빌더는 "한 프로젝트용 테마"까지만 무료로 주고, 조직 전체 토큰 거버넌스는 유료 상단에 배치한다.

---

# 2. 도구별 온보딩 결정 UI 카탈로그

## v0 (Vercel)
- **무엇을**: shadcn/ui 프리셋 테마(색상/폰트/token) 선택 또는 프롬프트로 커스텀 테마 생성.
- **몇 개**: shadcn 기본 테마 세트 + 서드파티 tweakcn.com으로 무제한 커스텀.
- **형태**: "Design Mode" 비주얼 에디터 — 요소 클릭 → 색상/크기/텍스트 직접 조정 → 코드에 반영. 테마 전환 UI 별도 제공(v0 Themes).
- 출처: [Design systems | v0 Docs](https://v0.app/docs/design-systems-legacy), [Design mode | v0 Docs](https://v0.app/docs/design-mode), [v0 Themes - Vercel](https://vercel.com/changelog/v0-themes) (접근일 2026-07-19)

## Lovable
- **무엇을**: 프로젝트 단위로는 프롬프트 텍스트(감정 큐 — "luxurious", "brutalist", "friendly", "glitchy")로 스타일 지정. Enterprise 티어에서는 재사용 "Design System"(컴포넌트+토큰) 선택.
- **몇 개**: Themes 탭에서 primary/secondary/accent/배경/전경 색상, 폰트 패밀리, 기본 폰트 크기, spacing scale, border radius — 축별로 1개씩 값 지정(후보 카드 방식 아님, 직접 값 입력형 UI).
- **형태**: "Themes" 탭 = 비주얼 no-code 인터페이스(코드/크레딧 소모 없음). Design System 선택은 드롭다운(+ → Design → Use a design system).
- 출처: [Design systems - Lovable Documentation](https://docs.lovable.dev/features/design-systems), [How to 10x your UI with Lovable](https://nurxmedov.substack.com/p/how-to-10x-your-ui-with-lovable) (접근일 2026-07-19)

## Framer AI
- **무엇을**: 템플릿(또는 처음부터 시작) → 테마 → 색상 팔레트 → 폰트 조합. 커스텀 프로젝트는 hero tone(playful/futuristic/editorial), 색 선호, 브랜드 제약, 레퍼런스(로고/스크린샷/무드 이미지)를 자유 텍스트+이미지로 입력.
- **몇 개**: 명시적 개수 정보 없음(발견 실패) — "wide range"로만 서술.
- **형태**: 템플릿 갤러리 카드 선택 → 색상/폰트 조합 파인튠. 무드 레퍼런스는 이미지 업로드 + 짧은 프롬프트 텍스트.
- 출처: [Framer AI](https://www.framer.com/ai/), [AI Design for Framer](https://www.capcut.com/ideas/ai-design/ai-design-for-framer) (접근일 2026-07-19)

## Wix ADI / Wix Studio (AI Assistant)
- **무엇을**: 업종, 스타일, 콘텐츠에 대한 질문 → 팔레트/폰트/레이아웃 자동 선택. 이후 "Generate new theme"(전체 재생성) / "Shuffle these colors"(동일 테마 내 1·2차 색 교체) 버튼으로 반복.
- **몇 개**: 시작 시 3가지 경로(AI Assistant 채팅형 / 처음부터 / 템플릿). 폰트는 프리셋 페어 목록에서 선택 또는 헤딩·본문 개별 지정.
- **형태**: 채팅형 질의응답(ADI/AI Assistant) → 결과 미리보기 → 테마 스위치 토글 + 레이아웃 셔플 버튼.
- 출처: [Wix Editor: Creating an AI-Generated Site](https://support.wix.com/en/article/wix-editor-creating-an-ai-generated-site), [Studio Editor: About Site Styles](https://support.wix.com/en/article/studio-editor-about-site-styles) (접근일 2026-07-19)

## Squarespace Blueprint AI
- **무엇을**: 목표/업종/브랜드 성격 질문 → 콘텐츠·구조·색상·폰트 큐레이션 추천.
- **몇 개**: 5단계 온보딩. 브랜드 성격 **7종**(Professional, Playful, Sophisticated, Friendly, Bold, Quirky, Innovative) 중 택1 → 성격별 폰트 페어 2종(총 **14종**) + 성격에 맞는 큐레이션 색 팔레트 세트.
- **형태**: 단계별 선택 카드(브랜드 성격) → 결과로 좁혀진 팔레트/폰트 조합 카드 제시, 이후 편집기에서 수동 조정 가능.
- 출처: [Starting a Website with Squarespace Blueprint](https://www.squarespace.com/blog/starting-a-website-with-squarespace-blueprint), [How to Build a Website with Squarespace Blueprint AI](https://www.squarepros.io/blog/squarespace-blueprint-ai) (접근일 2026-07-19)

## Canva (Magic Design / Brand Kit)
- **무엇을**: Brand Kit — 로고, 색 팔레트(primary/secondary/neutral, 라벨 포함), 승인 폰트(헤딩/본문 페어), Brand Kit Builder는 웹사이트/PDF에서 로고·색·폰트를 AI로 자동 추출.
- **몇 개**: 색상 권장 3~5개, 폰트 최대 2개(가이드라인상 권장 상한).
- **형태**: Design > Styles에서 폰트×색 팔레트 조합을 미리보기 카드로 mix-and-match.
- 출처: [Set up Brand Kits](https://www.canva.com/help/brand-kit/), [Set up your Brand Kit automatically](https://www.canva.com/help/brand-kit-builder/) (접근일 2026-07-19)

## Relume
- **무엇을**: 회사 설명 프롬프트 → 사이트맵 자동 생성 → 와이어프레임(실 카피 포함) → AI Style Guide Builder로 스타일 가이드(색/타이포/컴포넌트) 생성. 온보딩 자체는 스타일 질문이 아니라 역할·주 사용 툴(Figma/Webflow/WordPress)·AI 경험 수준 3문항.
- **몇 개**: 온보딩 질문 3개(스타일 선택 질문 아님).
- **형태**: 프롬프트 텍스트 입력 → 사이트맵 트리 → 원클릭 와이어프레임 변환 → Figma/Webflow로 export.
- 출처: [Relume — Style Guide](https://www.relume.ai/style-guide), [Building a sitemap with AI](https://www.relume.io/resources/docs/building-a-sitemap-with-ai) (접근일 2026-07-19)

## Figma First Draft / Figma Make
- **무엇을**: 프롬프트(예: "developer tools startup용 가격 페이지") → 여러 테마 썸네일 생성 → 클릭으로 테마 미리보기 전환 → 프리셋 색상 또는 컬러 휠로 색 지정, 슬라이더로 border radius·spacing 조정. 라이브러리는 4종(와이어프레임용 저충실도 primitive ~ 고충실도 비주얼) 중 선택.
- **몇 개**: 테마 후보 다수(정확한 개수 미공개) 썸네일 그리드.
- **형태**: 프롬프트 → 테마 썸네일 그리드 클릭 → 컬러 휠/프리셋 + 슬라이더(radius, spacing) 미세조정.
- 출처: [Use First Draft with Figma AI](https://help.figma.com/hc/en-us/articles/23955143044247-Use-First-Draft-with-Figma-AI), [Building a better First Draft for designers](https://www.figma.com/blog/figma-ai-first-draft/) (접근일 2026-07-19)

## Google Stitch
- **무엇을**: 텍스트 프롬프트 또는 URL 입력 → 멀티스크린 프로토타입 생성. Theme 사이드바에서 라이트/다크 토글, primary color, corner radius, 폰트를 전역으로 편집(변경이 전체로 cascade).
- **형태**: 사이드바 토큰 편집기(전역 값 몇 개 slider/picker) + URL 붙여넣기로 기존 사이트 스타일 역추출.
- **DESIGN.md**: 색 팔레트, 폰트, spacing 규칙, 컴포넌트 스타일을 YAML(기계 파싱) + 자연어 설명(rationale)으로 병기하는 오픈 포맷 — 본 레포 `DESIGN.md` 컨벤션의 upstream.
- 출처: [How to Use Google Stitch to Build a Website Design System](https://www.mindstudio.ai/blog/how-to-use-google-stitch-website-design-system), [What Is Google Stitch's Design.md File?](https://www.mindstudio.ai/blog/what-is-google-stitch-design-md-file) (접근일 2026-07-19)

---

# 3. 디자인 시스템 결정 체크리스트 (도구 관행에서 관측된 축)

조사 대상 도구들이 실제로 사용자에게 값을 받거나 자동 결정하는 축을 모은 목록. (`docs/ui-vocabulary` 축과 별개로, "도구가 무엇을 묻는가" 관점.)

| 축 | 관측된 도구 | 후보 제시 방식 |
|---|---|---|
| 색상(primary/secondary/accent/neutral) | Canva(3-5색 권장), Lovable(축별 1개 입력), Wix(팔레트 셔플), Squarespace(성격별 큐레이션 팔레트) | 팔레트 세트 단위, 개별 hex 슬라이더는 2차 단계 |
| 타이포(헤딩/본문 페어) | Squarespace(14종), Canva(최대 2폰트 권장), Wix(프리셋 페어 또는 개별 지정) | 페어 단위 프리셋, 개별 폰트 선택은 세부 조정 |
| Spacing / 밀도 | Lovable(spacing scale 값 입력), Figma First Draft(슬라이더) | 슬라이더형 전역 값 |
| Radius | Lovable, Figma First Draft(둘 다 슬라이더), Google Stitch(사이드바) | 슬라이더 |
| Shadow / elevation | 명시적 온보딩 질문으로 발견된 사례 없음 — 발견 실패 | — |
| Motion | 온보딩 단계에서 명시적으로 다루는 도구 발견 실패 (v0/Lovable 모두 사후 코드 조정) | — |
| 아이콘/일러스트 | 온보딩 질문으로 다루는 도구 발견 실패 | — |
| 사진/이미지 톤 | Framer AI(무드 레퍼런스 이미지 업로드)만 명시적 확인, 나머지는 발견 실패 | 이미지 업로드 + 텍스트 프롬프트 |
| 다크모드 | Google Stitch(사이드바 토글, 별도 토큰 세트 미러링), Figma variable modes | 온/오프 토글 → 별도 토큰 세트 자동 생성 |
| 브랜드 성격/보이스(텍스트 톤) | Squarespace(7종 성격 → 색/폰트/AI 카피 톤에 반영), Lovable(감정 큐 프롬프트) | 성격 라벨 카드 선택 또는 자유 텍스트 |
| 브레이크포인트 | 온보딩 질문으로 다루는 도구 발견 실패(반응형은 대부분 자동/사후 처리) | — |

일반 디자인 시스템 방법론(Design Tokens 3-tier: primitive → semantic → component/contextual)은 여러 출처에서 공통 확인되나, "color/typography/spacing/radius/shadow/motion/icon/dark mode/density/breakpoint 전체"를 하나의 체크리스트로 명시한 단일 출처는 찾지 못함(designsystemchecklist.com은 카테고리 페이지 텍스트를 가져오지 못함 — 접근 제한). 개별 축별 근거는 위 표의 출처 참조.

- 출처: [Design tokens overview | Pajamas Design System](https://design.gitlab.com/product-foundations/design-tokens/), [Naming Tokens in Design Systems](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676), [Update 1: Tokens, variables, and styles – Figma Learn](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles) (접근일 2026-07-19)

---

# 4. 스톡 이미지 API 실무 조건 — Pexels vs Unsplash

| 항목 | Pexels API | Unsplash API |
|---|---|---|
| 키 발급 | 무료, Pexels 계정만 있으면 즉시 발급 | 무료, Developer 계정 등록 필요 |
| 기본 rate limit | 200 req/hour, 20,000 req/month | Demo 상태: **50 req/hour** |
| 상향 조건 | 약관 준수 + 적절한 attribution 시 무료로 무제한 신청 가능 | Production 상태 승인 시 5,000 req/hour |
| 한국어 검색 | **지원** — `locale=ko-KR` 파라미터(총 28개 locale 중 하나, 예: `?query=cafe&locale=ko-KR`) | **베타 제한** — 108개 언어 비영어 검색 지원이 베타 단계, `api@unsplash.com`에 앱 ID로 별도 신청 필요(전체 공개 아님) |
| Attribution | "Photo by [작가명] on Pexels" + 링크 권장, 없어도 이용은 가능하나 무제한 요청엔 필요 | 이미지 표시마다 Unsplash + 작가 크레딧 + 작가 프로필 링크 **필수** |
| 다운로드 추적 | 명시적 의무 언급 없음 | 다운로드(또는 유사 이벤트) 시 `download_location` 엔드포인트에 반드시 알림 요청 필요 |
| 금지 사항 | 사진 단독 재판매(프린트/굿즈 등), 데이터마이닝/ML 목적 자동 수집 금지, 핵심 기능 복제 금지 | 원본 사진 그대로 판매 금지, Unsplash 핵심 UX 복제 금지, ML/AI 학습·안면인식 목적 사용은 별도 허가 필요(unsplash.com/data), 상호작용 데이터로 경쟁 서비스 제작 금지 |
| 상업적 사용 | 가능(약관 범위 내) | 가능하나 대량 트래픽 시 Unsplash가 기술료(technology fee) 부과 가능 |

**추천**: 본 레포(한국어 사용자 대상 프로덕트)처럼 한국어 키워드로 이미지를 검색해야 하는 경우 **Pexels API가 실무적으로 더 유리** — `locale=ko-KR`이 정식 지원이라 별도 승인 절차 없이 바로 쓸 수 있는 반면, Unsplash의 비영어 검색은 이메일로 베타 신청부터 해야 하는 병목이 있다. 다만 Unsplash는 다운로드 추적 의무가 있어 "실제 사용량"을 더 엄격히 요구하고, Pexels는 상대적으로 요건이 가볍다.

- 출처: [How do I get unlimited requests? – Pexels](https://help.pexels.com/hc/en-us/articles/900005852323-How-do-I-get-unlimited-requests), [What are the Terms and Conditions? – Pexels](https://help.pexels.com/hc/en-us/articles/900005880463-What-are-the-Terms-and-Conditions), [Pexels API Documentation](https://www.pexels.com/api/documentation/), [Unsplash API Terms](https://unsplash.com/api-terms), [When should I apply for a higher rate limit? | Unsplash](https://help.unsplash.com/en/articles/3887917-when-should-i-apply-for-a-higher-rate-limit), [Support for languages beta | Unsplash API Changelog](https://changelog.unsplash.com/update/2020/08/21/languages-beta.html) (접근일 2026-07-19)

---

# 5. 출처 목록

- v0: https://v0.app/docs/design-systems-legacy · https://v0.app/docs/design-mode · https://vercel.com/changelog/v0-themes
- Lovable: https://docs.lovable.dev/features/design-systems · https://nurxmedov.substack.com/p/how-to-10x-your-ui-with-lovable
- Framer AI: https://www.framer.com/ai/ · https://www.capcut.com/ideas/ai-design/ai-design-for-framer
- Wix: https://support.wix.com/en/article/wix-editor-creating-an-ai-generated-site · https://support.wix.com/en/article/studio-editor-about-site-styles
- Squarespace Blueprint: https://www.squarespace.com/blog/starting-a-website-with-squarespace-blueprint · https://www.squarepros.io/blog/squarespace-blueprint-ai
- Canva: https://www.canva.com/help/brand-kit/ · https://www.canva.com/help/brand-kit-builder/
- Relume: https://www.relume.ai/style-guide · https://www.relume.io/resources/docs/building-a-sitemap-with-ai
- Figma: https://help.figma.com/hc/en-us/articles/23955143044247-Use-First-Draft-with-Figma-AI · https://www.figma.com/blog/figma-ai-first-draft/
- Google Stitch: https://www.mindstudio.ai/blog/how-to-use-google-stitch-website-design-system · https://www.mindstudio.ai/blog/what-is-google-stitch-design-md-file
- Design tokens: https://design.gitlab.com/product-foundations/design-tokens/ · https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676 · https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles
- Pexels API: https://help.pexels.com/hc/en-us/articles/900005852323-How-do-I-get-unlimited-requests · https://help.pexels.com/hc/en-us/articles/900005880463-What-are-the-Terms-and-Conditions · https://www.pexels.com/api/documentation/
- Unsplash API: https://unsplash.com/api-terms · https://help.unsplash.com/en/articles/3887917-when-should-i-apply-for-a-higher-rate-limit · https://changelog.unsplash.com/update/2020/08/21/languages-beta.html

(모든 항목 접근일: 2026-07-19)

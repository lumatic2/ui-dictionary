# UI 백과사전 재료 — 사이트 실측 진단

> 2026-07-27 · 소비처: milestone UE1~UE4 (goal `ui-encyclopedia`) · 직접 실측 (dev 서버 + Playwright 스크린샷 + 코드 확인)

## 목적

사용자 목표: "사이트에 들어가서 '아코디언'이라는 용어의 생김새·쓰임·바리에이션을 보고, 헤더·푸터 종류와 디자인 레퍼런스도 볼 수 있는 UI 백과사전". 현재 사이트가 그 목표에서 어디까지 와 있고 무엇이 비었는지 실측으로 확정한다.

## 방법

`examples/ui-vocabulary-site` dev 서버 기동 후 Playwright 로 홈·아코디언 상세(`?page=term&id=accordion`)·사이드바 클릭·딥링크 4종을 실행. 스크린샷 5장 + 코드 대조. 콘솔 에러 0건.

## 이미 있는 것 (실측)

- 용어 562개 (`docs/ui-vocabulary/terms.yml`), 스키마에 one_liner·description·visual_anatomy·when_to_use·anti_use·prompt_phrases·asset(mini-mock)·sources·related 완비.
- 용어 상세 페이지(`term-page.tsx`, 256줄): 정의·빠른 판단·생김새 단서·언제 쓰나·피해야 할 경우·AI 프롬프트 복사·비슷한 용어 비교·출처(Tier 표기)·PNG 내보내기. 아코디언 페이지 실렌더 확인.
- Tailwind Plus 식 IA 사이드바: Marketing / Application UI / Ecommerce + Page Sections(Hero·Feature·CTA·…·Header Sections·Footers). `navigation-model.ts` 에 경로 정의 실재.
- 유료 경계 설계 정본 실재: `docs/design-system/site-blueprint.md` v2 — 상위 축 Docs/Patterns/Colors/**Pro**(Tailwind Plus 모델), Production Exposure Policy("나열된 것 = 완성된 것"), `exposure.ts` 에 게이트 구현(plus-templates 프리픽스 게이트 포함).
- 로그인 실물 실재: 외부 auth 서버(`VITE_ASKEWLY_AUTH_ORIGIN`) + Google OAuth start + `/api/auth/session` 이 `{authenticated, email}` 반환 (`App.tsx:195-206`). 오너 판별(이메일 대조)에 필요한 재료가 이미 있다.

## 결함 (실측)

| # | 결함 | 실측 근거 |
|---|---|---|
| 1 | **사이드바 내비가 죽어 있다** | 아코디언 페이지에서 "Header Sections" 클릭 → URL·화면 무변화 (Playwright 실측, 스크린샷 05). 원인 후보: `navigateToNavigationPath` 가 `navigationCollections` 에서 경로를 못 찾으면 **조용히 return** (`App.tsx:334-338`) — 실패가 관측 불가 |
| 2 | **딥링크 폴백** | `?page=dictionary`, `?q=헤더` → 전부 홈으로 폴백 (스크린샷 03·04 = 홈과 동일) |
| 3 | **바리에이션·상태·실디자인 레퍼런스 0건** | 아코디언 시각 자료 = 미니목 1장. "생김새 단서"는 영어 텍스트 불릿. 변형(보더형·분리형·FAQ형)·상태(펼침/접힘/비활성)·레퍼런스 없음 |
| 4 | **정비 마찰** | `App.tsx` 23,507줄 모놀리스 — 내비·URL 수리가 전부 이 파일을 지나간다 |

## 사용자 확정 결정 (2026-07-27)

1. **유료 경계 = Tailwind Plus 모델** — 정의·대표 데모 1개 미리보기 무료, 바리에이션 전체·코드 복사·에셋 Pro 잠금. blueprint Pro 축과 정합.
2. **결제는 나중** — 이번엔 잠금 + 오너 언락만. 결제 연동은 콘텐츠가 차면 별도 milestone (CLAUDE.md "정합 전 결제 금지" 조항 정합).
3. **콘텐츠 범위 = Page Sections 전체** (2026-07-27 확장 확정 — 헤더/푸터 우선 착수 후 Hero·Feature·CTA·Bento·Pricing·Newsletter·Stats·Testimonials·Blog·Contact·Team·Content·Logo Clouds·FAQ 로 확대).
4. **오너 판별 = Google 로그인 이메일 대조** (세션 이메일 == 소유자 이메일이면 전체 열람). 기존 auth 서버 재사용.
5. **레퍼런스는 Dribbble·Pinterest 등에서 탐색 후 직접 구현 데모로 게재** — 스크린샷 게재 아님(저작권), 재해석 구현. 전역 인용 규칙(출처 URL + 접근일) 적용.

## milestone 도출

- **UE1 — 탐색이 작동한다**: 결함 1·2. 사이드바·검색·딥링크가 실제로 동작 (사람 관측으로 닫음 — RU1/DOG7 교훈).
- **UE2 — 용어 상세에 바리에이션 갤러리**: 결함 3의 구조 층. 스키마·렌더러 + 파일럿 1~2 용어.
- **UE3 — Page Sections 전체 레퍼런스 수집 → 직접 구현 데모 (배치식, 헤더/푸터 우선)**: 결함 3의 콘텐츠 층 + 결정 3·5.
- **UE4 — Pro 잠금 + 오너 언락**: 결정 1·2·4.

## 재현

```bash
cd examples/ui-vocabulary-site && npm run dev
# http://localhost:5173/?page=term&id=accordion 에서 사이드바 "Header Sections" 클릭 → 무반응
# ?page=dictionary → 홈 폴백
```

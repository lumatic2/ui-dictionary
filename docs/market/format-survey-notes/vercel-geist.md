# 조사 노트 — Vercel Geist

> SMC0 시장 포맷 조사. 수집: 2026-07-07, sonnet 리서치 에이전트. 게이트 검증 완료.

## 1. 정보구조

- **Foundations** (Colors, Typography, Materials, Grid) / **Assets** (Brand Assets, Icons, Typeface) / **Components** (컴포넌트별 문서).
- **특이점: 문서 URL에 `.md`를 붙이면 markdown raw로 접근 가능** — 에이전트 접근을 사이트가 1급 지원.

## 2. 토큰 체계

- Gray scale 10단계 (`100~1000`), CSS 변수 `--ds-[color]-[step]`.
- 단계별 용도: 100 기본 배경 / 200 호버 배경 / 300 활성 배경 / 400 기본 테두리 / 500 호버 테두리 / 600 활성 테두리 / 700 고대비 배경 / 800 호버 고대비 / 900 보조 텍스트 / 1000 주요 텍스트.
- Semantic alias 레이어 별도 존재: `--ds-background-100/200`.
- light/dark 처리 방식·component tier 존재 여부 **미확인**.

## 3. 컴포넌트 문서 구조

- **props 테이블 없음** — variant 조합 실사용 예시 중심 (Sizes → All Types → Shapes → Prefix/Suffix → Loading → Disabled → Link → Custom) + 마지막 **Best Practices** 서술.

## 4. 배포 형태

- 공개 npm: `@vercel/geistcn`(컴포넌트), `@vercel/geistcn-assets`(로고), `@vercel/geistdocs`.
- 폰트는 완전 오픈소스 트랙: `geist` npm (SIL OFL) — Geist Sans/Mono/Pixel.
- 커뮤니티 Geist UI(`geist-org`)는 비공식·archived — 혼동 주의.

## 5. 브랜드-시스템 경계

- 이식 불가: Vercel/Next.js 로고, "Geist" 네이밍·Pixel 서체 브랜드 룩, 개발자 도구 맥락의 Best Practices 톤.
- 이식 가능: numbered scale 구조, semantic alias 개념, 폰트 공개 배포 방식, `.md` raw 접근 패턴.

## 6. Askewly Design 채택 관점

가져올 것: ① `.md` raw 문서 접근(사람 페이지와 에이전트 markdown을 같은 소스에서 파생) ② numbered primitive + semantic alias 이층 구조 ③ variant 조합 예시 + Best Practices 문서 방식.

안 맞는 것: ① 전면 공개 npm 배포(현 단계 과투자) ② props 테이블 부재(에이전트는 명시적 타입 정보가 더 필요) ③ 개발자 도구 특화 톤(우리는 범용 디지털 제품 포괄).

## 7. 출처

- https://vercel.com/geist/introduction
- https://vercel.com/geist/colors
- https://vercel.com/geist/button
- https://github.com/vercel/geist-font

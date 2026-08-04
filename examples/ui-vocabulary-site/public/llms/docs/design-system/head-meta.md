# Head Meta Contract — OG · 파비콘 · 탭 타이틀 기본 계약

Date: 2026-08-04
Milestone: M23 (harvest 배치 2, B5 — 사용자 지시 "OG, 파비콘, 탭 이름 등도 템플릿에 넣어둬야지")
지위: 새 프로젝트가 배포 첫날부터 갖춰야 하는 head 메타의 최소 계약. 근거 = 자기 배포 표면 6곳 실측(`research/2026-08-04-m22-harvest-mining-ledger.md` 2차 채굴 — 완비 2 : Askwely-company(Next Metadata API+동적 OG)·sixsense(정적 완비) / 결손 4 : guide(title만)·dev(Vite 기본)·ui 본체·brain(SPA 단일 정적 OG)).

Audience: 에이전트 + 시스템 관리자.

## 최소 계약 (전 프로젝트 의무)

1. **탭 타이틀**: `<title>` 필수 + 라우트별 오버라이드(SPA 는 클라이언트 `document.title` 갱신으로 충분 — 사람 몫).
2. **정적 OG 폴백**: 소셜 크롤러는 SPA 의 클라이언트 갱신을 못 본다 — `index.html` 에 og:title·og:description·og:image(1200×630)·twitter:card 를 **빌드 시점 정적값**으로 반드시 박는다. 라우트별 동적 OG 는 상급 옵션이지 최소선이 아니다.
3. **파비콘 이중화**: `favicon.ico`(레거시) + SVG(현대 브라우저·다크 대응). PWA 면 192/512 아이콘까지.
4. 스니펫 정본: `templates/head-meta.html.tmpl` — 새 프로젝트에 복사 후 값만 치환.

## 트랙별 구현

| 트랙 | 방법 | 실측 선례 |
|---|---|---|
| 정적/Vite SPA | index.html 에 정적 태그 직접 (템플릿 스니펫) | sixsense (완비) · ui 본체(og 단일값 — 라우트별은 title 만) |
| Next.js | Metadata API(`layout.tsx` metadata + title.template) + 파일 컨벤션(`app/favicon.ico`·`icon.svg`) · 동적 OG 는 `opengraph-image.tsx`(ImageResponse) | Askwely-company (완비 — 동적 OG 생성 포함) |

## 반례 (실측 결손 — 반복 금지)

- title 만 있고 OG 0건(guide) · Vite 기본 템플릿 그대로(dev) — 링크 공유 시 제목 없는 회색 카드가 나간다.
- 페이지 4곳에 head 를 손 복제(sixsense) — 값 바꿀 때 한 곳이 남는다. 정적 사이트라도 스니펫은 한 곳에서 include/생성.

## Changelog

- 2026-08-04: 초판 — M23 (B5). 6표면 실측 기반 최소 계약 + 템플릿 스니펫 착지.

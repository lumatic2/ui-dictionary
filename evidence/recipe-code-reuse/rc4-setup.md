# RC4 통합 실연 준비

- Date: 2026-07-19
- 의뢰: Askewly Team Pulse — AI 팀 운영 B2B SaaS 랜딩
- 선택: `hero-cards-info`
- 선택 JSON: `evidence/recipe-code-reuse/rc4-selections.json`

## 선택 이유

`hero-cards-info`는 같은 실연에서 registry 코드 자산과 문서 재구현 폴백을 함께 검증한다.

| section | mapping | 출발 경로 |
|---|---|---|
| hero | `landing-hero` | recipe 문서 폴백 |
| cards | `responsive-content-grid` | `/r/responsive-content-grid.json` 코드 이식 |
| info | `article-documentation-layout` | recipe 문서 폴백 |

## 사전 점검

- 스튜디오 기본 데이터 생성: PASS — tiles 4, axes 18.
- 선택 JSON: 18/18 축 + `implementation.recipes` 포함.
- live registry `responsive-content-grid.json`: HTTP 200.
- live recipe `landing-hero.md`: HTTP 200.
- live recipe `article-documentation-layout.md`: HTTP 200.
- 끊긴 구현 출발 링크: 0.

## 다음 단계

격리 Vite+React+Tailwind 앱에서 코드 자산을 이식하고 두 폴백 섹션을 recipe 계약으로 구현한 뒤, warm-paper/terracotta/Noto 토큰으로 전체를 다시 입혀 브라우저 실연한다.

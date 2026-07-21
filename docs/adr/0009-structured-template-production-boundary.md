# ADR 0009 — 구조화 템플릿 제작 경계

- Status: accepted
- Date: 2026-07-19

## Context

AI 이미지 모델은 소재와 평면 시안을 빠르게 만들지만, 하나의 PNG는 텍스트·이미지·도형·그룹·브랜드 토큰을 독립 편집할 수 없다. Askewly Design은 브리프 결과를 재사용 가능한 제작 시스템으로 연결해야 한다.

## Decision

`CanvasDocument`를 템플릿 장면의 유일한 정본으로 쓴다. 편집 템플릿은 최소 하나의 편집 가능한 텍스트, 이미지 또는 도형, 명시적 그룹/프레임, semantic token binding을 보존해야 한다. 생성 이미지와 평면 시안은 `assetManifest`가 가리키는 대체 가능한 소재이며 장면 구조를 소유하지 않는다.

첫 형식은 `business-card`, `product-poster`, `infographic`이다. `TemplateProject`가 요청·콘텐츠·소재 manifest·장면을 묶고, 모든 조립과 내보내기는 장면 검증을 먼저 통과한다.

## Consequences

- 같은 입력은 결정론적 장면으로 컴파일할 수 있다.
- 이미지 모델 공급자를 교체해도 편집 구조는 유지된다.
- PNG만 가진 결과는 참고 시안일 수는 있어도 템플릿으로 판정하지 않는다.
- 라이브 이미지 API 호출, 원격 저장, 범용 자유 배치는 후속 승인 경계다.

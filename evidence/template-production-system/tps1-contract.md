# TPS1 템플릿 계약·장면 기반

- 문서 계약: ADR 0009와 `docs/design-system/template-production-system.md`가 평면 시안과 편집 템플릿을 구분한다.
- 장면 확장: canvas-core `image`, `shape` node 및 leaf/asset 속성 검증.
- 코어: `TemplateRequest + assets + CanvasDocument = TemplateProject`.
- 유효 fixture: 편집 가능한 text/image/shape/frame/token binding 명함.
- 실패 fixture: 평면 이미지 단독, 필수 연락처 누락, 깨진 asset 참조를 명시 코드로 거부.
- 검증: canvas-core 52 tests PASS + build PASS; template-core 3 tests PASS + build PASS.

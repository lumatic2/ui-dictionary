# CLAUDE — Design Layer

> 본 프로젝트의 디자인은 루트 `DESIGN.md` 가 단일 출처. 코딩 에이전트는 그것을 우선 읽고 본 문서로 보강.

## 규칙

- 토큰은 semantic 만 코드에서 참조한다. primitive 직접 사용은 디자인 시스템 문서 안에서만 허용한다.
- 컴포넌트 새로 만들 때는 `DESIGN.md` § 7. Components 의 spec 부터 확인한다. 없으면 추가 후 구현한다.
- 새 색, spacing, radius 값을 코드에서 즉흥적으로 만들지 않는다. 필요하면 `DESIGN.md` 에 먼저 토큰과 사용 의도를 추가한다.
- 커밋 전 `node C:\Users\yusun\projects\design-manual\scripts\lint\index.js .\DESIGN.md` 로 lint 한다.

## Style Family

Minimal 기반. 현재 프로젝트에서는 화이트 기반 Askewly Design 테마로 확장했다.

## External References

- 스펙: `C:\Users\yusun\projects\design-manual\docs\spec.md`
- 메타 레포: `C:\Users\yusun\projects\design-manual`

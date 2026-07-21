# 코드 자산 배포 포맷 조사 — shadcn registry 모델

Date: 2026-07-19
소비처: recipe-code-reuse horizon (RC1 배포 파이프라인 설계 입력)
방법: Context7 `/shadcn-ui/ui` 공식 문서 질의 (접근 2026-07-19) + 자체 코드베이스 결합도 실측

## 1. 질문

사이트 레시피 데모 코드(.tsx)를 "에이전트·사람이 가져다 출발할 수 있는 자산"으로 배포할 때, 검증된 표준 포맷이 있는가?

## 2. shadcn registry 모델 (공식)

- **registry.json** (인덱스) + 항목별 **registry-item.json**: `{name, type(registry:block|component|hook|file), title, description, registryDependencies(shadcn 내장·URL·네임스페이스), dependencies(npm 패키지), devDependencies, files[{path,type,target}], cssVars{theme/light/dark}}`.
  - 출처: https://ui.shadcn.com/docs/registry/registry-json · https://ui.shadcn.com/docs/registry/registry-item-json (Context7 경유, 접근 2026-07-19)
- **빌드**: `npx shadcn build` — registry.json → `public/r/<name>.json` 개별 파일로 컴파일 (정적 호스팅으로 배포).
- **소비**: `npx shadcn add <url>` — 파일 복사 + npm 의존 설치 + registryDependencies 재귀 해결. CLI 없이도 JSON을 fetch해 files[].content를 직접 쓸 수 있다(에이전트 경로).
- **cssVars**: 항목이 요구하는 CSS 변수(테마 토큰)를 선언 — 우리 3-tier 토큰과의 접점.

## 3. 자체 실측 (2026-07-19)

- `examples/ui-vocabulary-site/src/components/` 54개 .tsx, 총 ~14.6k줄.
- 공통 의존 상위: `cn`(26) · shadcn `Button`(26) · `Badge`(10) · `DeviceFrame`(7) · `Table`/`Input`(3) · lucide-react 아이콘 · `useState`(14+).
- 결합 유형 2종: ① **순수 데모** — shadcn primitives + Tailwind 클래스만(이식 용이, 예: cart-drawer 계열) ② **사이트 결합** — `terms.generated`·`home-page` 데이터/컴포넌트 의존(예: landing-hero — 이식하려면 데이터 결합 절단 필요).

## 4. 시사점 (RC1 설계 입력)

1. **포맷은 발명하지 말고 shadcn registry 호환으로** — `registryDependencies`(button 등 내장) + `dependencies`(lucide-react 등) 선언이 우리 "의존 선언" 요구와 정확히 일치하고, `npx shadcn add` 소비 경로가 공짜로 생긴다. 에이전트는 JSON fetch로 CLI 없이 소비.
2. **cssVars 필드에 semantic 토큰 요구를 선언**하면 component-restyle 계약(프로젝트 토큰 리맵)과 기계적으로 연결된다.
3. **사이트 결합 데모는 1차 배치에서 제외**하고 순수 데모부터 — 결합 절단은 항목별 후속.
4. 기존 llms md(문서)와 registry JSON(코드)은 상호 링크 — 레시피 md에 코드 자산 URL 추가.

## 종료

포화 판정: 표준 포맷 질문에 대한 공식 스키마·빌드·소비 경로가 확인돼 추가 소스가 새 사실을 더하지 않음 — 종료.

# 20260805-m29-docs-block-and-alias — M29 이식 경로 완결

> plan: `plans/2026-08-05-m29-docs-block-and-alias.md` · milestone: M29

## step-1 — `@/` alias 감지 + 안내

- 증상: 이식된 코드가 전부 `@/…` 로 import 하는데 킥스타트의 `Next steps` 는 그 alias 를 설정하라는 말을 하지 않았다. 신선 vite react-ts 프로젝트에서 `tsc -b` **6건 실패**, M28 라이브 E2E 두 번 모두 사람이 손으로 메웠다. (`@/` 의존은 `rewriteImports` 가 만드는 게 아니라 레지스트리 소스에 이미 있다.)
- 처리: `detectPathAlias(targetDir)` + `aliasStep(status, srcRel)` 두 순수 함수 추가. 설정이 **양쪽 다** 있으면 단계를 인쇄하지 않고, 없는 쪽 스니펫만 인쇄한다. `Next steps` 는 배열로 조립해 번호를 자동 부여(4단계 ↔ 5단계).
- **함정 ① JSONC**: tsconfig 는 주석을 허용해 `JSON.parse` 가 깨진다. 파서를 들이지 않고 `stripComments`(문자열 상태를 추적하는 20줄 스캐너)로 주석만 비운 뒤 원문 정규식으로 판정. 주석 처리된 `// "paths": { "@/*": … }` 는 **설정 없음**으로 읽힌다(테스트로 고정).
- **함정 ② 솔루션 tsconfig**: vite react-ts 템플릿의 루트 `tsconfig.json` 은 `references` 만 갖고 `compilerOptions` 는 `tsconfig.app.json` 이 소유한다. 루트에 `paths` 를 쓰면 `tsc -b` 가 무시하므로, **compilerOptions 를 실제로 소유한 파일을 지목**한다. 실행 확인: 스톡 프로젝트에서 안내가 `tsconfig.app.json` 을 지목.
- **실행이 잡은 결함 1건 (E2E 게이트의 값)**: 1차 스니펫이 `"baseUrl": "."` 를 포함했는데 **TypeScript 6.0.3 에서 `TS5101` 로 빌드가 깨진다**(deprecated). 미싱 모듈 6건을 deprecation 1건으로 바꾼 셈. `paths` 는 TS 4.4+ 부터 baseUrl 없이 tsconfig 상대로 해석되므로 `baseUrl` 을 뺐다. 테스트에 `not.toContain("baseUrl")` 로 고정.
- **신규 npm 의존 없음** (계획 기술결정 ⑥): `vite-tsconfig-paths` 를 권하지 않는다 — 인쇄되는 `npm i` 목록은 "이식된 파일이 실제로 import 하는 것"이라는 M28 계약이라, 빌드 도구 플러그인을 섞으면 그 계약이 흐려진다. 대신 `resolve.alias` + `fileURLToPath`(vite 가 이미 쓰는 Node 내장).
- 스니펫은 **이식이 실제로 일어난 위치**를 가리킨다 — `src/` 가 없는 프로젝트면 `["./*"]`·`new URL(".", …)`.
- 게이트: vitest **77/77**(신규 6) · `tsc --noEmit` exit 0 · **실표면 재현**(스니펫 수정 후 처음부터 다시): 빈 vite react-ts → `init . --block marketing-landing --color teal --yes` → **인쇄된 스니펫 그대로 적용** → **인쇄된 `npm i` 그대로** → `npx tsc -b` **exit 0**(M28 의 6건 무재현) → `npm run build` **exit 0** → 같은 디렉터리에서 재실행 시 alias 단계 **미인쇄**(4단계로 복귀).

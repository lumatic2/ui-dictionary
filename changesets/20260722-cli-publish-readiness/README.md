# 배포 준비와 dry-run — 압축 해제는 설치가 아니다

> 2026-07-22 · milestone DOG2 step-1 · changeset #250

## 왜

`npm view @askewly/design` → **E404**. 패키지는 `bin`·`files`·`prepack`까지 준비됐는데 레지스트리에 없다. 사용자가 고른 `npx` 경로가 아직 실재하지 않는다.

publish 전에 **무엇이 담기고 그게 남의 프로젝트에서 도는지**를 먼저 확인한다. 공개 배포는 되돌릴 수 없다.

## 무엇을

**메타데이터 정비**

| 필드 | 전 | 후 |
|---|---|---|
| `license` | `UNLICENSED` | **`MIT`** (승인 결정 7) |
| `repository` | 없음 | `lumatic2/ui-dictionary`, `directory: packages/cli` |
| `homepage` | 없음 | `https://ui.askewly.com` |
| `keywords` | 없음 | 5종 |
| `files` | `dist`·`data` | + `README.md`·`LICENSE` |

신규: `packages/cli/LICENSE`(루트 복사), `packages/cli/README.md`(npm 페이지).

`UNLICENSED` 인 채로는 공개 레지스트리에 올릴 수 없었다 — 이게 step-2의 실질적 차단 요인이었다.

## 관측

`npm pack`: **13 files · 237.0 kB** — `dist/`·`data/`·LICENSE·README·package.json 포함, `src/`·`test/`·`node_modules/`·`scripts/` **누출 없음**.

레포 밖 clean 프로젝트에 tarball 설치 후:

| 커맨드 | 결과 |
|---|---|
| `verify probe --ext tsx` | 위반 2건 (`:4 hex-literal` + `:4 raw-color-fn`), exit 1 |
| `terms search accordion` | 정상 |
| `tokens` / `recipes list` | 정상 |

**DOG1의 수정이 패키지 빌드에 실려 있다** — 한 줄 두 규칙이 둘 다 보고된다.

## 이 step이 바로잡은 것 둘

1. **압축 해제는 설치가 아니다.** 첫 시도로 tarball을 `tar -xzf`로 풀어 직접 실행했더니 `ERR_MODULE_NOT_FOUND: commander`. 의존성 해석이 없으니 당연하다. `npx`가 하는 일은 설치를 포함하므로 로컬 tarball 설치로 다시 쟀다.
2. **원격 조직명을 추정해 적었다.** `askewly/ui-dictionary`로 썼는데 실제는 `lumatic2/ui-dictionary`다. `git remote -v`로 확인해 고쳤다. 추정으로 URL을 적지 않는다 — 레포 인용 규약과 같은 규율.

## Failure probe

`files`에서 `data`를 빼고 재pack·재설치 → `ENOENT … data/terms.json`. 번들 누락이 실행을 깨뜨림을 확인, 원복 후 재확인 정상.

> plan의 probe 서술 정정: "`verify`가 terms.json을 못 찾아 실패"라고 적혀 있었으나 **`verify`는 데이터를 읽지 않는다.** 깨지는 것은 `terms`·`tokens`·`recipes` 다. probe 목적은 그대로 달성.

## Contract

- source of truth: `packages/cli/package.json`
- deploy/sync target: **아직 없음** — 실제 publish는 step-2(승인 정지점)
- compatibility: 런타임 코드 무변경. 메타데이터·동봉 파일만.
- out of scope: publish 실행, 버전 정책 문서화(step-3)

## 검증

- [x] `npm pack --dry-run` 파일 목록 관측 — 포함 4종·누출 0
- [x] 레포 밖 clean 프로젝트에 설치 후 `npx askewly-design verify` 실행 — exit 1 + 위반 2건
- [x] 데이터 의존 커맨드 3종(`terms`·`tokens`·`recipes`) 레포 밖 정상 동작
- [x] Failure probe 실행(`data` 제거 → ENOENT), 원복 확인
- [x] `packages/cli` 32 tests PASS · `tsc --noEmit` exit 0
- [x] 루트 `npm run verify` exit 0

## finding 큐

- **데이터 누락 시 raw stack trace 노출.** `ENOENT`가 잡히지 않아 Node 내부 스택이 사용자에게 나온다. "설치가 깨졌다" 한 줄이 맞다. step-3 또는 유지보수 후보.

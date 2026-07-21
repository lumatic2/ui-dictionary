# DOG2 — 배포 evidence

> horizon `design-output-gates` · milestone DOG2
> 기록(record). step 진행에 따라 섹션을 추가하고 앞 관측은 고치지 않는다.

## step-1 — 배포 준비와 dry-run (2026-07-22)

### 패키지 메타데이터

| 필드 | 전 | 후 |
|---|---|---|
| `license` | `UNLICENSED` | **`MIT`** (승인 결정 7 — 레포 루트 LICENSE와 일치) |
| `repository` | 없음 | `git+https://github.com/lumatic2/ui-dictionary.git`, `directory: packages/cli` |
| `homepage` | 없음 | `https://ui.askewly.com` |
| `keywords` | 없음 | design-system · design-tokens · linter · ui · coding-agent |
| `files` | `["dist","data"]` | `["dist","data","README.md","LICENSE"]` |

신규 파일: `packages/cli/LICENSE`(루트 복사), `packages/cli/README.md`(npm 페이지 본문).

> ⚠ 실사 정정 — 원격은 `askewly/ui-dictionary`가 아니라 **`lumatic2/ui-dictionary`** 다. 처음 조직명을 추정해 적었다가 `git remote -v`로 확인해 고쳤다. 추정으로 URL을 적지 않는다.

### `npm pack` 관측

```
📦 @askewly/design@0.1.0 — total files: 13 · package size: 237.0 kB · unpacked: 852.9 kB
  LICENSE · README.md
  data/{askewly.css, DESIGN.md, recipes.json, terms.json, tokens.css, tokens.json}
  dist/{index.js, inject.js, load.js, verify.js}
  package.json
```

**포함 확인**: `dist/`·`data/` 둘 다 들어감.
**누출 확인**: `src/`·`test/`·`node_modules/`·`tsconfig.json`·`scripts/` **없음**.

### 레포 밖 실행

⚠ **첫 시도가 틀린 방법이었다.** tarball을 `tar -xzf`로 풀어 `node package/dist/index.js`를 직접 실행했더니 `ERR_MODULE_NOT_FOUND: commander`. **압축 해제는 설치가 아니다** — 의존성 해석이 없다. `npx`가 실제로 하는 일은 설치를 포함하므로, 로컬 tarball을 clean 프로젝트에 설치하는 방식으로 다시 쟀다.

```bash
mkdir /tmp/installtest && cd /tmp/installtest && npm init -y
npm install <repo>/packages/cli/askewly-design-0.1.0.tgz   # added 2 packages
npx askewly-design verify probe --ext tsx
```

| 커맨드 | 결과 |
|---|---|
| `verify probe --ext tsx` (oneline fixture) | **위반 2건** — `:4 hex-literal` + `:4 raw-color-fn`, exit 1 |
| `terms search accordion` | 정상 — `accordion — Accordion (아코디언)` 외 |
| `tokens` | 정상 — 토큰 JSON 출력 |
| `recipes list` | 정상 — 45개 목록 |

**DOG1의 수정이 패키지 빌드에 실려 있다** — 같은 줄의 두 규칙이 둘 다 보고된다(step-3 이전이면 1건이었다).

### Failure probe

`files`에서 `data`를 빼고 재pack·재설치:

```
Error: ENOENT: no such file or directory,
  open '…/node_modules/@askewly/design/data/terms.json'
```

번들 누락이 실제로 실행을 깨뜨림을 확인. 원복 후 재확인 정상(13 files · 237.0 kB).

> **plan의 probe 서술 정정**: plan은 "`verify`가 `data/terms.json`을 못 찾아 실패한다"고 적었으나 **`verify`는 데이터를 읽지 않는다** — 깨지는 것은 `terms`·`tokens`·`recipes` 쪽이다. probe의 목적(번들 누락이 실행을 깨뜨림)은 그대로 달성됐고, 대상 커맨드만 다르다.

### finding 큐

- **데이터 누락 시 raw stack trace가 그대로 나온다.** `ENOENT`가 잡히지 않아 사용자에게 Node 내부 스택이 노출된다. 배포본에서 이런 실패는 "설치가 깨졌다"는 한 줄 안내가 맞다. DOG2 step-3(재배포 절차)이나 별도 유지보수 항목 후보.

### step-2 진입 조건

- 결정 7(license=MIT)·8(scope=public) **확정됨**
- 그러나 **publish 실행 자체가 승인 정지점**이다 — `name@version`은 unpublish 후에도 영구 재사용 불가([npm Unpublish Policy](https://docs.npmjs.com/policies/unpublish), 접근 2026-07-22).

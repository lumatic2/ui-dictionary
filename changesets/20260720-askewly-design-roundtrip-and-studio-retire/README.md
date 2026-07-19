# changeset: 왕복 내보내기·가져오기 + 스튜디오 은퇴

- Date: 2026-07-20
- Plan: TH3 step 3 (`plans/2026-07-20-th3-studio-real-editing.md`, 2026-07-20 개정본)

내보내기를 코어로 옮기고 AskewlyDesign에서 왕복을 실측한 뒤, `apps/template-studio`를 은퇴시켰다. 편집 표면이 하나만 남는다.

## 무엇을 바꿨나

- **exporters 이관** — `apps/template-studio/src/exporters.ts` → `packages/template-core/src/exporters.ts`. 표면이 하나로 모이면 내보내기는 표면이 아니라 코어가 소유해야 한다. 테스트도 스튜디오 fixture 대신 `createTemplateProject` 기반으로 다시 썼다(1 → 10 케이스).
- **왕복 UI** — 갤러리에 JSON/HTML/SVG 내보내기 + JSON 가져오기. 내보내기 대상은 **연 시점이 아니라 현재 장면**(`{...project, scene: document}`).
- **스튜디오 은퇴** — `apps/template-studio` 삭제, `archive/apps/template-studio`로 이동(gitignored). 코드는 커밋 `5271968`까지의 히스토리에 남는다.
- `check-line-length.mjs`의 감시 대상에서 스튜디오를 빼고 `TemplateGallery.tsx`를 넣었다.

## Verification

- [x] `npm --prefix packages/template-core test` — **72 PASS** (62 + 이관·확장 10) · `build` PASS
- [x] `npm --prefix apps/agent-design test` — **83 PASS** · `build` PASS
- [x] `node scripts/verify-template-production-system.mjs` — exit 0
- [x] `node scripts/check-line-length.mjs` — PASS

### 왕복 실측 (실브라우저)

```
1. infographic-comparison 열기          → 10 노드
2. 캔버스에서 title 직접 편집            → revision 1 → 2
3. JSON 내보내기                         → 12,399 bytes, 편집분 포함 확인
4. business-card-minimal로 갈아탐        → 6 노드, title 노드 없음
5. 내보낸 JSON 가져오기                  → 10 노드 복원, title "왕복 검증 제목"
   서명 tpl-7b927577 = 내보내기 직후와 동일
```

4단계를 넣은 이유는 **복원인지 잔상인지 구별하기 위해서**다. 갈아타지 않고 되가져오면 화면이 그대로여도 왕복이 됐는지 알 수 없다.

### Failure probe — 잘못된 가져오기가 문서를 망가뜨리는가

| 입력 | 결과 | 캔버스 |
|---|---|---|
| 깨진 JSON | `가져오기 차단 — Expected double-quoted property name...` | 무변경 |
| 스키마 불일치 | `가져오기 차단 — Cannot read properties of undefined` | 무변경 |
| 필수 슬롯 삭제본 | `가져오기 차단 — MISSING_CONTENT, MISSING_CONTENT, FLAT_ARTWORK_NOT_EDITABLE` | 무변경 |

3건 모두 부분 적용 없이 차단됐고 노드 수·텍스트·서명이 그대로였다.

### 근접 실패 — probe가 거짓 결함을 만들 뻔했다

첫 왕복 시도에서 "내보내기가 편집분을 담지 않는다"는 결과가 나왔다. 원인은 코드가 아니라 **probe였다** — 합성 `blur` 이벤트는 React 19의 `onBlur`(내부적으로 `focusout`)를 발화시키지 못해 텍스트가 애초에 커밋되지 않았다. `focusout`으로 바꾸자 revision이 1 → 2로 오르고 내보내기도 편집분을 담았다. 관측 도구가 틀렸는데 제품 결함으로 기록할 뻔했다.

## finding 큐

- `validateTemplateProject`가 형태가 깨진 입력에 `TypeError`를 던진다(`reading 'sourceRoot'`). 차단은 되지만 구조화된 오류 코드가 아니라 런타임 예외다 — 방어적 검증으로 다듬을 대상.
- `apps/template-studio` 디렉터리 껍데기가 남았다. 내용물은 전부 지워졌고 `archive/apps/template-studio`에 복사됐으나, 다른 프로세스가 그 경로를 붙잡고 있어 빈 폴더만 삭제되지 않았다. git에서는 삭제로 반영된다.
- 내보낸 HTML/SVG는 도형의 `node.fill`(현재 `#000000` 리터럴)만 쓰고 토큰 색·글꼴을 적용하지 않는다 — step-2에서 적발한 렌더 충실도 공백과 같은 뿌리다.

# changeset: Codex imagegen 라이브 실호출 실증

- Date: 2026-07-20
- Plan: TH5 step 2 (`plans/2026-07-20-th5-codex-imagegen-provider.md`)

라이브 호출 1회로 실제 소재를 만들었고, 그 소재가 템플릿에 렌더되는 것을 브라우저에서 확인했다.
**그리고 라이브 실행이 계약 테스트가 못 잡는 결함을 잡았다.**

## 라이브가 잡은 결함 — `spawn codex ENOENT`

첫 실호출이 즉시 실패했다.

```
CodexImageError: codex 실행 실패: spawn codex ENOENT
```

원인 둘:
1. **Windows에서 `codex`는 npm 전역 설치의 `.cmd` 셸 심**이다. `shell` 없이 `spawn`하면 찾지 못한다.
2. 지시문을 **argv에 실었다.** 줄바꿈·따옴표를 품은 문자열이라 셸 경유가 필요해지는 순간 인용 규칙에 걸린다.

수정: 지시문을 **stdin으로 넘긴다**(`codex exec -`는 stdin에서 지시문을 읽는다 — `codex exec --help` 확인, codex-cli 0.144.6). argv는 고정 플래그만 남으므로 `shell: true`를 Windows에서만 켜도 안전하다.

계약 테스트 15개는 이 결함을 잡을 수 없었다 — 실행기를 주입해 대체하는 게 테스트의 설계였으므로, **실행기 자체는 라이브에서만 검증된다.**

## 실호출 결과

| 항목 | 값 |
|---|---|
| 생성물 | 1000×800 PNG, 1,513,937바이트 |
| 요청 치수 | 1000×800 — **이번엔 일치** |
| 잘림 | 0% (종횡비 동일) |
| provenance | `generated` / `codex:image_generation:product` |
| 키 | 없음 |

**주의**: 계획의 결정 로그는 사전 probe에서 "정사각 요청에 1254×1254 반환(정확 치수 보장 없음)"을 기록했다. 이번 1000×800 요청은 정확히 맞았다. 두 관측이 모순은 아니지만 **어느 쪽이 규칙인지는 표본 2개로 알 수 없다** — 그래서 공급자는 여전히 파일 헤더를 정본으로 읽는다. 요청 치수를 믿는 구현으로 돌아가지 않는다.

## Verification

- [x] 라이브 `codex exec` 1회 — 소재 생성 성공, `AssetManifestEntry` 반환
- [x] 생성 이미지 육안 확인 — 프롬프트대로의 도자기 컵 제품 사진
- [x] `product-poster-hero`·`product-poster-editorial` HTML/SVG 내보내기에 소재가 실림
- [x] **브라우저 렌더 확인** — 이미지가 포스터 안에 표시됨. 콘솔 오류는 `favicon.ico` 404 하나뿐
- [x] `npm --prefix packages/template-image-provider-codex test` — 15 PASS (수정 후 무회귀)
- [x] 정적 서버 종료 확인 (포트 5301 closed)

증거: `evidence/template-production-hardening/th5/` (원본 + 렌더 화면)
fixture: `packages/template-core/src/__fixtures__/assets/cup-live.png`

### Failure probe — 조용히 빈 소재를 반환하지 않는가

`spawn codex ENOENT`가 **그 자체로 probe였다** — 실행이 실패했을 때 공급자는 빈 `AssetManifestEntry`를 만들지 않고 `CODEX_RUN_FAILED`로 던졌다. 계획의 step-2 failure probe("잘못된 경로로 호출해 확인한다")가 의도치 않게 실제 상황으로 발생했고, 설계대로 동작했다.

## finding 큐

- `shell: true` 사용으로 Node가 `DEP0190` 경고를 낸다. 현재 argv는 **고정 리터럴뿐**(사용자 데이터는 stdin)이라 주입 위험이 없으나, 경고 자체는 남는다 — `codex.cmd` 절대경로 해석으로 없앨 수 있다.
- 생성물 1.5MB를 fixture로 커밋했다. 소재가 늘면 레포 크기 관리가 필요하다.
- 소재 URI가 파일 경로다(data URI 아님) — 문서가 파일 시스템에 의존한다. 왕복·배포 시 경로 규약 미정.
- 치수 정확성 표본이 2개뿐이다(1254×1254 / 1000×800). 규칙을 단정하지 않는다.

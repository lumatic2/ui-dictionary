# changeset: horizon 문서 동기화 + 이월 finding 장부

- Date: 2026-07-20
- 성격: 유지보수(step 규모 — milestone 아님)

TH4 마감 후 남은 작업을 정리했다. **정리하다 계획이 두 장이라는 걸 발견했다.**

## 계획이 두 장이었다

- `plans/2026-07-20-th4-real-verification.md` — horizon 개설 시(02:44) 작성·승인
- `plans/2026-07-20-th4-verification-materialization.md` — 오늘 실행 세션이 새로 작성

실행 세션이 **기존 계획의 존재를 확인하지 않고** 새로 썼다. 하네스 §A cascade 읽기에서 `plans/` 목록을 안 본 탓이다. 실행된 계획은 옛 계획의 DoD를 포함하고 넘어서므로(입력 유래 단언은 옛 계획에 없다) 결과물은 문제없으나, **계약이 두 개가 된 상태**는 정리해야 한다.

옛 계획을 `archive/plans/`로 옮기고 은퇴 배너에 경위를 남겼다. 지우지 않은 이유 = 같은 실수를 다시 하지 않으려면 기록이 남아야 한다.

## 무엇을 바꿨나

- **horizon 문서 동기화** — milestone 표에 **TH7·TH9가 없었다**(개설 후 추가된 milestone). 등재하고, TH4 계획 경로를 실제 실행된 문서로 정정.
- **닫는 기준 개정** — 4항의 "스튜디오"를 AskewlyDesign으로(TH3에서 template-studio 은퇴). 사용자 결정으로 **8항(편집 지속성)·9항(발주 가능성)** 추가 — 7항 → 9항.
- **TH10·TH11 등록** — 사용자 확정. 순서 TH5 → TH10 → TH11 → TH6.
- **`docs/findings.md` 신설** — 이월 finding 장부. 수집 ~50건을 코드로 대조해 이미 닫힌 것(TH9가 고친 `height*0.45`, TH7이 고친 내보내기 토큰, TH4 step-2가 채운 대조 검증)과 소멸한 것(은퇴한 스튜디오의 `style.css`)을 걸러 **실제 열린 30건**을 A~F 6군으로 적재.
- **`generate-llms-txt.mjs` 300자 초과 2줄 해제** — 줄 길이 가드 감시 밖에 있던 마지막 잔여.
- **TH5 계획 표면 이름 정정** — step-2 verify의 "스튜디오" → AskewlyDesign.

## Verification

- [x] `node scripts/generate-llms-txt.mjs` — exit 0, **생성된 `llms.txt` diff 0바이트** (문자열 연결 리팩터가 출력을 안 바꿨다는 증거)
- [x] `awk 'length>300'` — `generate-llms-txt.mjs` 초과 0줄
- [x] `roadmap_sync.py status` — active 1 / completed 6 / pending 3
- [x] `roadmap_sync.py lint` — PASS (신규 milestone 2개 Scale 선언 충족)
- [x] ROADMAP 132줄 (상한 150)

### 현행성 대조 (수집 결과를 그대로 믿지 않았다)

수집기가 changeset을 시간순으로 훑어 **이미 닫힌 finding까지 담았다.** 코드로 직접 확인해 걸렀다:

| 대조 | 결과 |
|---|---|
| `validateTokenMode` 잔존? | 잔존 — **열림** |
| `storageKey = agent-design:${baseDocument.id}`? | 잔존 — **열림** |
| 청사진에 `maxLines` 선언? | 0건 — **열림** |
| `SAFE_AREA_INSET = 24`? | 잔존 — **열림** |
| 스튜디오 `style.css` minified? | **파일 자체가 없음** — 소멸(스튜디오 은퇴) |
| `generate-llms-txt.mjs` 300자 초과? | 2줄 — **열림**(이번에 해제) |

## finding 큐

- `archive/`가 `.gitignore`에 있는데 그 아래 74개 파일이 추적 중이다 — 규약과 실제가 어긋난다. `git add -f`로 관례를 따랐으나 규약 정리는 별건.
- `apps/template-studio` 빈 껍데기는 여전히 다른 프로세스가 붙잡고 있어 삭제 실패. git 추적 대상이 아니라 레포 영향은 없다.

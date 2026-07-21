# Evidence — DOG6 마무리 절차가 셋을 다 부른다

> 2026-07-22 · horizon `design-output-gates` · milestone DOG6 · changesets 264·265·266

## 1. 매체별 분기 (step-1)

`docs/design-system/entry-protocol.md`에 `N-0. Pin the medium`을 **첫 단계**로 넣고, 마무리 게이트(step 4)를 매체별로 갈랐다.

**선언**: 세 게이트가 서로의 기준을 베끼지 않는다.
**실측**: 교차 grep — 화면 게이트에 `rasterize` 없음, 인쇄 게이트에 `hover`/`dark mode` 없음, 발표 게이트에 `hover`/`bleed` 없음. 필수 어휘는 각각 존재.
**판정**: PASS

```
entry-protocol 매체 분기 OK
exit=0
```

**Failure probe** — 매체 판정 단계와 인쇄·발표 게이트 줄 삭제:

```
세 게이트 줄을 다 못 찾았다
인쇄 게이트에 래스터화 없음
인쇄 게이트에 도련 없음
발표 게이트에 프리셋 대조 없음
매체 판정 단계 없음
probe exit=1
```

원복 후 exit 0.

## 2. 검사기 호출 배선 + 스킬 정합 (step-2)

**두 레포에 걸친 변경**: `custom-skills`(원본 `a63253f`) + `ui-dictionary`(entry-protocol).

**선언**: 배포본에서 낡은 문장 2건이 사라지고 검사기 호출이 추가되며, 원본과 배포본이 동일하다.
**실측**:

```
$ bash ~/projects/custom-skills/setup.sh
recorded 2234 target(s) → install-state ✓

$ diff ~/projects/custom-skills/promoted/askewly-design/SKILL.md ~/.claude/skills/askewly-design/SKILL.md
diff 없음 (동일)

배포본 검증 OK
exit=0
```

- 낡은 문장 ① `"전역 CLAUDE.md §askewly-design"`(삭제된 절 참조) → **없음**
- 낡은 문장 ② `"이 스킬의 대상이 아니다"`(인쇄·슬라이드 배제) → **없음**
- `npx @askewly/design verify` → **있음**
- `"다시 실행한다"`(재측정 지시) → **있음**

**판정**: PASS

**Failure probe** — 배포본을 낡은 상태로 되돌려 "`setup.sh` 누락"을 재현:

```
낡은 문장 ① 잔존
낡은 문장 ② 잔존
검사기 호출 없음
원본-배포본 불일치
probe exit=1
```

원본만 고치고 배포를 빼먹는 것이 **결함 5가 형태만 바꿔 재발**하는 경로다 — 소스는 고쳐졌는데 에이전트가 읽는 배포본은 그대로. 동일성 검사가 그것을 잡는다.

## 3. 자가 수정 루프 실증 (step-3) — 이 milestone의 실표면

fixture: `evidence/design-output-gates/dog6-fixture/src/PricingCard.tsx`
실행 경로: **npm 공개 배포본** `npx @askewly/design@0.2.0` (레포 내부 빌드가 아니다)

### 1차 실행 — 위반 5건

```
$ npx @askewly/design@0.2.0 verify src --ext tsx
verify FAIL — 5 violation(s) in 1 file(s):
  PricingCard.tsx:5 [hex-literal] <section style={{ background: "#f7f5f2" }} className="rounded-xl p-8">
  PricingCard.tsx:6 [raw-color-fn] <p className="text-xs" style={{ color: "rgb(120, 113, 108)" }}>
  PricingCard.tsx:9 [hex-literal] <h2 className="text-4xl" style={{ color: "#1c1917" }}>
  PricingCard.tsx:18 [raw-color-fn] <small style={{ fontSize: "11px", color: "hsl(24, 6%, 50%)" }}>
  PricingCard.tsx:18 [typography-scale-exceeded] font-size steps: 11, 12, 14, 16, 20, 36, 40 (7 > limit 5)

Fix: replace color literals with semantic token utilities (bg-primary, text-foreground, ...);
     collapse extra type sizes onto the token scale, or raise --typography-threshold.
1차 exit=1
```

DOG1·DOG3 산출물이 여기서 동시에 작동한다 — 한 줄(18행)에서 색 규칙과 타이포 규칙이 **각각** 보고됐다(DOG1 step-3의 규칙 배열이 없었다면 하나만 나왔다).

### 수정 — 목록을 받아 고쳤다

```diff
-    <section style={{ background: "#f7f5f2" }} className="rounded-xl p-8">
-      <p className="text-xs" style={{ color: "rgb(120, 113, 108)" }}>
-        STARTER
-      </p>
-      <h2 className="text-4xl" style={{ color: "#1c1917" }}>
-        ₩29,000
-      </h2>
+    <section className="rounded-xl p-8 bg-surface-muted">
+      <p className="text-sm text-muted-foreground">STARTER</p>
+      <h2 className="text-2xl text-foreground">₩29,000</h2>
       <p className="text-sm">월 결제 기준</p>
       ...
-      <p className="text-2xl">지금 시작하기</p>
-      <small style={{ fontSize: "11px", color: "hsl(24, 6%, 50%)" }}>
-        부가세 별도
-      </small>
-      <span className="text-lg">자세히</span>
+      <p className="text-xl">지금 시작하기</p>
+      <small className="text-xs text-muted-foreground">부가세 별도</small>
+      <span className="text-base">자세히</span>
```

색 리터럴 4건 → semantic 토큰 유틸리티. 글자 크기 7단계(11·12·14·16·20·36·40) → 스케일 위 5단계.

### 2차 실행 — 위반 0건

```
$ npx @askewly/design@0.2.0 verify src --ext tsx
verify PASS — 1 file(s) scanned, no color literals and no file over 5 type sizes
2차 exit=0
```

**판정**: 1차 5건 > 0 · 실제 파일 수정 발생 · 2차 정확히 0 — 세 조건 모두 충족. **PASS**

### Failure probe — 안 고치고 재실행

```
probe exit=1
probe 위반 건수: 5
1차와 probe 출력 동일 (diff 없음)
```

2차가 0이 된 것이 "수정 때문"이지 "재실행이 항상 0을 낸다"가 아님을 이것이 가른다. 2차만 보면 "처음부터 위반이 없었다"와 구분되지 않는다.

## 4. 회귀 게이트

```
$ npm run verify                                    → exit 0
$ node scripts/generate-llms-txt.mjs                → exit 0
$ node scripts/generate-print-spec-doc.mjs --check  → exit 0
```

## 5. 사고 기록 — 미커밋 파일을 git으로 복원하려 했다, 두 번째

probe를 위해 수정 전 fixture로 되돌리려고 `git show HEAD:<path>`를 썼다. **그 파일은 한 번도 커밋된 적이 없어서 결과가 비었고, 리다이렉트가 파일을 0바이트로 만들었다.**

DOG5 step-2에서 `git checkout`으로 미커밋 구현을 날린 것과 **같은 부류의 두 번째 사고**다. 규율: **git은 커밋된 것만 되돌릴 수 있다. 미커밋 상태의 원복은 명시적 사본(`cp`)이나 역치환으로 한다.**

## 6. 한계

- **fixture는 파일 하나짜리 인공 예제다.** 실제 프로젝트에서 이 절차가 성가신지, 오탐이 몇 건 나는지는 이 실증이 답하지 못한다 — DOG7 사람 관측의 몫이다.
- **인쇄·발표 게이트는 실제로 돌지 않았다.** step-3이 실증한 것은 화면 매체의 자가 수정 루프뿐이다. 래스터화 확인·프리셋 대조는 절차에 적혔을 뿐 이번에 구동되지 않았다 — 슬라이드 청사진과 인쇄 산출물이 각각 0건이라 먹일 입력이 없다.
- **지금은 경고다.** 차단 승격은 DOG7 관측 뒤 사용자 판정.
- **`0.2.0`으로 고정 실행했다.** 배포된 최신이 그것이라 같은 결과지만, 규칙이 바뀌면 재배포 후 이 실증을 다시 돌려야 한다.

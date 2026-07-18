# changeset: entry-protocol human verification gate

- Date: 2026-07-18
- Milestone: SE1 step-1 (`plans/2026-07-18-se1-skill-and-human-gate.md`)
- 사용자 발의: "디자인 결과물을 사람이 눈으로 확인하는 단계는 꼭 필요해"

## 변경

- `docs/design-system/entry-protocol.md` — "Always" 절에 5단계 신설: 스크린샷 증거(라이트/다크 ≥2장 + 핵심 상태) 캡처·보고 첨부 의무 + **사람 확인 전 완료 선언·배포 금지**. 자가 판정(3단계)=하한선, 사람 확인=최종 게이트 관계 명시. Date 줄 갱신.
- llms 산출물 재생성 (`scripts/generate-llms-txt.mjs`).

## 검증 checklist

- [ ] `node scripts/generate-llms-txt.mjs` 성공
- [ ] push 후 `curl https://ui.askewly.com/llms/docs/design-system/entry-protocol.md` 에 "Human verification is the final gate" grep 1
- [ ] Failure probe: CDN 캐시 구버전이면 cache-bust 폴링로 반영 확인

// 의도적 위반 fixture — DOG6 자가 수정 루프 실증용.
// 1차 실행에서 5건이 잡혔고, 그 목록을 받아 아래처럼 고쳤다:
//   hex-literal ×2 · raw-color-fn ×2 → semantic 토큰 유틸리티로 교체
//   typography-scale-exceeded (7단계) → 토큰 스케일 위 5단계로 축소
export function PricingCard() {
  return (
    <section className="rounded-xl p-8 bg-surface-muted">
      <p className="text-sm text-muted-foreground">STARTER</p>
      <h2 className="text-2xl text-foreground">₩29,000</h2>
      <p className="text-sm">월 결제 기준</p>
      <ul className="text-base">
        <li>프로젝트 3개</li>
        <li>기본 지원</li>
      </ul>
      <p className="text-xl">지금 시작하기</p>
      <small className="text-xs text-muted-foreground">부가세 별도</small>
      <span className="text-base">자세히</span>
    </section>
  )
}

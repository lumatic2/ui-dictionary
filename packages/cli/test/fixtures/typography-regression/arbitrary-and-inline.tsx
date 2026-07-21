// FIXTURE — 임의값 + 인라인 style. 기대: {13, 14}
export const Arbitrary = () => (
  <div className="text-[13px]">
    <span style={{ fontSize: "0.875rem" }}>인라인</span>
  </div>
)

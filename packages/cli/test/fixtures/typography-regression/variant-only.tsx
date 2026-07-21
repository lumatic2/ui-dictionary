// FIXTURE — 크기가 **오직 반응형 접두사 뒤에만** 나온다. 기대: {16, 20, 28}
// responsive.tsx 는 md:text-lg 와 순수 text-lg 를 함께 담아, 접두사 처리를 없애도
// 뒤엣것이 값을 채워 결함이 안 보였다. 이 fixture 는 접두사 없이는 그 값에
// 도달할 수 없게 만들어 접두사 처리를 실제로 강제한다.
export const VariantOnly = () => (
  <div>
    <p className="text-base md:text-lg">본문</p>
    <h2 className="lg:text-xl">제목</h2>
  </div>
)

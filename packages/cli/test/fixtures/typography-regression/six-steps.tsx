// FIXTURE — 경계: 6단계. 임계값 5 초과이므로 FAIL 기대.
// 6번째 값(12px, text-xs)이 처음 등장하는 줄이 보고돼야 한다.
export const Six = () => (
  <section>
    <h1 className="text-2xl">40</h1>
    <h2 className="text-xl">28</h2>
    <h3 className="text-lg">20</h3>
    <p className="text-base">16</p>
    <span className="text-sm">14</span>
    <small className="text-xs">12</small>
  </section>
)

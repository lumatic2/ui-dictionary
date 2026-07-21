import React from "react";

const capabilities = [
  ["DESIGN.md", "프로젝트가 룩을 소유한다"],
  ["Recipes", "무엇을 만들지 판단한다"],
  ["Native PPTX", "편집 가능한 결과물로 닫는다"],
];

export function App() {
  return (
    <main>
      <nav aria-label="Primary navigation">
        <span className="brand">Askewly Design</span>
        <span className="nav-meta">GETDESIGN → DESIGN.MD → OUTPUT</span>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">DESIGN OUTPUT PILOT / 01</p>
        <h1 id="hero-title">한 번의 디자인 판단이<br />웹과 슬라이드에 이어진다.</h1>
        <p className="lede">
          Askewly Design은 프로젝트 고유의 DESIGN.md를 읽고, 사람이 보는 웹과 사람이 수정하는 PowerPoint를 같은 언어로 만듭니다.
        </p>
        <div className="actions">
          <a className="primary" href="#system">파일럿 보기</a>
          <span>16:9 · editable PPTX</span>
        </div>
      </section>

      <section className="proof" id="system" aria-label="Design system proof">
        <div className="proof-head">
          <div>
            <p className="eyebrow">ONE SOURCE, TWO SURFACES</p>
            <h2>같은 토큰이 다른 매체의 밀도를 결정합니다.</h2>
          </div>
          <span className="status"><i /> Native output</span>
        </div>
        <div className="flow" role="list">
          {capabilities.map(([label, copy], index) => (
            <article className="flow-card" key={label} role="listitem">
              <span className="index">0{index + 1}</span>
              <h3>{label}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="surface-preview" aria-label="Token mapping preview">
          <div className="preview-sidebar"><span className="dot active" /><span className="dot" /><span className="dot" /></div>
          <div className="preview-body">
            <p className="eyebrow">PROJECT-OWNED TOKENS</p>
            <strong>Dark surface ladder, one deliberate signal.</strong>
            <div className="token-row"><code>surface-raised</code><code>accent</code><code>text-muted</code></div>
          </div>
        </div>
      </section>
    </main>
  );
}

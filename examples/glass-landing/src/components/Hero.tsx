const stats = [
  { value: '7', suffix: '-stage', label: '자동 검증 파이프라인' },
  { value: '4', suffix: '가지', label: 'Aesthetic 레시피' },
  { value: '1', suffix: '장', label: 'DESIGN.md 진입점' },
  { value: '100', suffix: '%', label: 'DTCG 토큰 호환' },
];

export function Hero() {
  return (
    <section className="px-6 pt-20 pb-24 flex flex-col items-center">
      <div className="relative w-full max-w-[720px]">
        <div
          className="absolute -top-15 -left-20 w-[340px] h-[240px] rounded-full pointer-events-none opacity-55"
          style={{ background: 'oklch(78% 0.12 275)', filter: 'blur(48px)' }}
        />
        <div
          className="absolute -top-10 -right-15 w-[280px] h-[200px] rounded-full pointer-events-none opacity-55"
          style={{ background: 'oklch(82% 0.09 210)', filter: 'blur(48px)' }}
        />

        <div
          className="glass-panel relative z-10 w-full rounded-[28px] text-center"
          style={{ padding: '60px 56px 52px' }}
        >
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium tracking-widest uppercase mb-6"
            style={{
              color: 'var(--color-iris-500)',
              background: 'oklch(70% 0.16 280 / 0.10)',
              border: '1px solid oklch(70% 0.16 280 / 0.22)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: 'var(--color-iris-400)' }}
            />
            Vibe-coding the design layer
          </div>

          <h1 className="text-[52px] font-bold leading-[1.06] tracking-[-0.025em] mb-5">
            디자인을<br />코드처럼{' '}
            <em className="not-italic" style={{ color: 'var(--color-iris-500)' }}>버전 관리</em>
          </h1>

          <p className="mx-auto max-w-[460px] text-[17px] text-(--color-text-muted) leading-relaxed mb-9">
            DESIGN.md 한 장으로 코딩 에이전트와 시각 언어를 공유.<br />
            7-stage 검증으로 토큰·접근성·일관성을 강제합니다.
          </p>

          <div className="flex justify-center gap-2.5 flex-wrap">
            <button
              className="glass-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-medium cursor-pointer"
              style={{ fontFamily: 'inherit' }}
            >
              Get Started →
            </button>
            <button
              className="glass-btn inline-flex items-center px-6 py-3 rounded-full text-sm text-(--color-text-default) cursor-pointer"
              style={{ fontFamily: 'inherit' }}
            >
              Cookbook 보기
            </button>
          </div>

          <div
            className="flex justify-center gap-10 mt-11 pt-9 flex-wrap"
            style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-[22px] font-semibold tracking-[-0.02em]">
                  {s.value}
                  <span style={{ color: 'var(--color-iris-500)' }}>{s.suffix}</span>
                </span>
                <span className="text-xs text-(--color-text-muted)">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

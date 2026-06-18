const CheckIcon = ({ accent = false }: { accent?: boolean }) => (
  <svg viewBox="0 0 10 10" fill="none" style={{ width: 10, height: 10 }}>
    <path
      d="M2 5.2L4 7.2L8 3"
      stroke={accent ? 'oklch(55% 0.18 280)' : 'oklch(45% 0.04 250)'}
      strokeWidth={accent ? '1.5' : '1.4'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Tag = ({ children, accent = false }: { children: string; accent?: boolean }) => (
  <span
    className="self-start text-[10.5px] font-semibold tracking-[0.06em] uppercase rounded-full px-2 py-0.5 mb-0.5"
    style={
      accent
        ? {
            color: 'var(--color-iris-500)',
            background: 'oklch(70% 0.16 280 / 0.10)',
            border: '1px solid oklch(70% 0.16 280 / 0.22)',
          }
        : {
            color: 'var(--color-text-muted)',
            background: 'oklch(55% 0.04 250 / 0.08)',
            border: '1px solid var(--color-border-default)',
          }
    }
  >
    {children}
  </span>
);

const Pill = ({ done, children }: { done?: boolean; children: string }) => (
  <span
    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
    style={
      done
        ? {
            background: 'oklch(70% 0.16 280 / 0.14)',
            border: '1px solid oklch(70% 0.16 280 / 0.25)',
            color: 'var(--color-iris-500)',
          }
        : {
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(0,0,0,0.07)',
            color: 'var(--color-text-muted)',
          }
    }
  >
    {children}
  </span>
);

export function FeatureBento() {
  return (
    <section id="features" className="px-6 pb-24">
      <div className="mx-auto max-w-[1040px] mb-11 text-center">
        <span className="block text-xs font-semibold tracking-[0.10em] uppercase text-(--color-text-muted) mb-3">
          Features
        </span>
        <h2 className="text-[28px] font-semibold tracking-[-0.005em] mb-2.5">
          한 장에 담긴 디자인 시스템
        </h2>
        <p className="text-sm text-(--color-text-muted)">토큰부터 컴포넌트, 검증까지. 모든 것이 연결됩니다.</p>
      </div>

      <div className="mx-auto max-w-[1040px] grid grid-cols-4 auto-rows-[160px] gap-3">

        {/* DESIGN.md — big accent (2×2) */}
        <article className="glass-card-accent rounded-[20px] col-span-2 row-span-2 flex flex-col justify-end gap-1.5 p-[22px] overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[200px] h-[200px] rounded-full opacity-50" style={{ background: 'oklch(78% 0.12 275)', filter: 'blur(32px)', top: -40, right: -40 }} />
            <div className="absolute w-[140px] h-[140px] rounded-full opacity-50" style={{ background: 'oklch(80% 0.10 210)', filter: 'blur(32px)', bottom: 20, left: -20 }} />
          </div>
          <div className="relative rounded-[10px] p-3 mb-0.5 flex flex-col gap-1" style={{ background: 'oklch(15% 0.04 250 / 0.88)' }}>
            <code className="font-mono text-[10.5px] leading-[1.4] text-[oklch(60%_0.02_250)]">---</code>
            <code className="font-mono text-[10.5px] leading-[1.4]"><span style={{ color: 'oklch(78% 0.14 210)' }}>token</span><span style={{ color: 'oklch(60% 0.02 250)' }}>: </span><span style={{ color: 'oklch(75% 0.16 280)' }}>iris-500</span></code>
            <code className="font-mono text-[10.5px] leading-[1.4]"><span style={{ color: 'oklch(78% 0.14 210)' }}>value</span><span style={{ color: 'oklch(60% 0.02 250)' }}>: </span><span style={{ color: 'oklch(80% 0.12 145)' }}>oklch(55% 0.18 280)</span></code>
            <code className="font-mono text-[10.5px] leading-[1.4]"><span style={{ color: 'oklch(78% 0.14 210)' }}>type</span><span style={{ color: 'oklch(60% 0.02 250)' }}>:  </span><span style={{ color: 'oklch(75% 0.16 280)' }}>color</span></code>
            <code className="font-mono text-[10.5px] leading-[1.4] text-[oklch(60%_0.02_250)]">---</code>
          </div>
          <Tag accent>DESIGN.md</Tag>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] leading-[1.3]">YAML frontmatter + Markdown 9섹션</h3>
          <p className="text-[12.5px] text-(--color-text-muted) leading-[1.5]">DTCG 호환 토큰을 에이전트와 사람이 함께 읽는 단일 진입점.</p>
        </article>

        {/* 7-stage — wide tall (2×2) */}
        <article className="glass-card rounded-[20px] col-span-2 row-span-2 flex flex-col justify-end gap-1.5 p-[22px]">
          <div className="flex flex-wrap gap-[5px] mb-1">
            {['parse', 'schema', 'alias', 'contrast', 'CSS lint', 'axe', 'VRT'].map((s) => (
              <Pill key={s} done>{s}</Pill>
            ))}
          </div>
          <Tag>Validation</Tag>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] leading-[1.3]">7-stage 검증 파이프라인</h3>
          <p className="text-[12.5px] text-(--color-text-muted) leading-[1.5]">토큰 파싱부터 시각적 회귀까지. 커밋 전에 전부 잡습니다.</p>
        </article>

        {/* Token dots — 1×1 */}
        <article className="glass-card rounded-[20px] flex flex-col justify-end gap-1.5 p-[22px]">
          <div className="flex gap-1.5 mb-1">
            {['oklch(98% 0.01 250)', 'oklch(94% 0.02 250)', 'oklch(65% 0.04 250)', 'oklch(45% 0.04 250)', 'oklch(15% 0.04 250)'].map((c) => (
              <div key={c} className="w-[22px] h-[22px] rounded-full" style={{ background: c, border: '1.5px solid rgba(255,255,255,0.6)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }} />
            ))}
          </div>
          <div className="flex gap-1.5">
            {['oklch(70% 0.16 280)', 'oklch(55% 0.18 280)', 'oklch(40% 0.18 280)'].map((c) => (
              <div key={c} className="w-[22px] h-[22px] rounded-full" style={{ background: c, border: '1.5px solid rgba(255,255,255,0.6)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }} />
            ))}
          </div>
          <Tag>Tokens</Tag>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">Slate × Iris 색상 스케일</h3>
        </article>

        {/* 4 aesthetics — wide (2×1) */}
        <article className="glass-card rounded-[20px] col-span-2 flex flex-col justify-end gap-1.5 p-[22px]">
          <div className="grid grid-cols-2 gap-1.5 mb-1">
            <div className="h-11 rounded-lg flex items-end px-2 py-1.5 text-[9.5px] font-semibold tracking-[0.04em] uppercase text-(--color-text-muted)"
                 style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.20))', border: '1px solid rgba(255,255,255,0.5)' }}>Glass</div>
            <div className="h-11 rounded-lg flex items-end px-2 py-1.5 text-[9.5px] font-semibold tracking-[0.04em] uppercase text-(--color-text-muted)"
                 style={{ background: 'oklch(97% 0.005 240)', border: '1px solid rgba(0,0,0,0.08)' }}>Minimal</div>
            <div className="h-11 rounded-lg flex items-end px-2 py-1.5 text-[9.5px] font-semibold tracking-[0.04em] uppercase"
                 style={{ background: 'oklch(20% 0.04 250)', color: 'oklch(80% 0.03 250)' }}>Editorial</div>
            <div className="h-11 rounded-lg flex items-end px-2 py-1.5 text-[9.5px] font-semibold tracking-[0.04em] uppercase text-white"
                 style={{ background: 'oklch(60% 0.18 280)' }}>Brutalist</div>
          </div>
          <Tag>Cookbook</Tag>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">4가지 Aesthetic 레시피</h3>
          <p className="text-[12.5px] text-(--color-text-muted) leading-[1.5]">glassmorphism · magnetic · bento · spring 인터랙션.</p>
        </article>

        {/* CI/CD — 1×1 */}
        <article className="glass-card rounded-[20px] flex flex-col justify-end gap-1.5 p-[22px]">
          <Tag>CI/CD</Tag>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">Idempotent harness</h3>
          <p className="text-[12.5px] text-(--color-text-muted) leading-[1.5]">init-design.sh + propagate.sh. 해시 트래킹 자동 동기화.</p>
        </article>

        {/* Magnetic — 1×1 accent */}
        <article className="glass-card-accent rounded-[20px] flex flex-col justify-end gap-1.5 p-[22px]">
          <Tag accent>Interaction</Tag>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">Magnetic 버튼</h3>
          <p className="text-[12.5px] text-(--color-text-muted) leading-[1.5]">Spring physics 기반 커서 반응. 터치 디바이스 대응.</p>
        </article>

        {/* Typography — 1×1 */}
        <article className="glass-card rounded-[20px] flex flex-col justify-end gap-1.5 p-[22px]">
          <div className="flex gap-2.5 items-baseline mb-1">
            <span className="text-[28px] font-bold tracking-[-0.03em] leading-none">Aa</span>
            <span className="text-[18px] font-medium text-(--color-text-muted)">SUIT</span>
          </div>
          <Tag>Typography</Tag>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">가변 폰트 시스템</h3>
        </article>

        {/* WCAG — wide (2×1) */}
        <article className="glass-card rounded-[20px] col-span-2 flex flex-col justify-end gap-1.5 p-[22px]">
          <div className="flex gap-2 items-center mb-1">
            {[
              { label: 'AA 4.5:1', bg: 'oklch(55% 0.18 280)' },
              { label: 'AAA 7:1', bg: 'oklch(40% 0.18 280)' },
              { label: 'WCAG 2.2', bg: 'oklch(15% 0.04 250)' },
            ].map(({ label, bg }) => (
              <div key={label} className="h-5 rounded px-2 flex items-center" style={{ background: bg }}>
                <span className="text-[10px] text-white font-semibold">{label}</span>
              </div>
            ))}
          </div>
          <Tag>Accessibility</Tag>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em]">자동 명도 대비 검증</h3>
          <p className="text-[12.5px] text-(--color-text-muted) leading-[1.5]">모든 토큰 조합에 대해 axe-core 기반 접근성 테스트 자동화.</p>
        </article>

      </div>
    </section>
  );
}

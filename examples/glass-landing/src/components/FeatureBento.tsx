type Card = {
  title: string;
  body: string;
  cls: string; // grid-span classes
};

const cards: Card[] = [
  {
    title: 'DESIGN.md 한 장',
    body: 'YAML frontmatter 의 DTCG 호환 토큰 + Markdown 9 섹션. 에이전트가 자동 발견.',
    cls: 'md:col-span-2 md:row-span-2',
  },
  {
    title: '7-stage 검증',
    body: 'parse → schema → alias → contrast → CSS lint → axe → VRT. fail-fast, JSON 리포터.',
    cls: 'md:col-span-2',
  },
  {
    title: 'Cookbook',
    body: 'glassmorphism · magnetic · bento · spring · view-transitions — 한 장 = 한 기법.',
    cls: '',
  },
  {
    title: '4 aesthetic families',
    body: 'Minimal · Editorial · Brutalist · Glass. fork 후 토큰만 수정.',
    cls: '',
  },
  {
    title: 'Idempotent harness',
    body: 'init-design.sh + propagate.sh. hash-tracked sync 로 사용자 수정 보존.',
    cls: 'md:col-span-2',
  },
];

export function FeatureBento() {
  return (
    <section id="features" className="mx-auto max-w-[1200px] px-6 pb-24">
      <h2 className="mb-8 text-3xl font-semibold tracking-tight">무엇이 들어있나</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[200px]">
        {cards.map((c) => (
          <article
            key={c.title}
            className={
              'group flex flex-col justify-end gap-2 rounded-2xl p-6 ' +
              'border border-(--color-border-default) ' +
              'bg-(--color-surface-glass) backdrop-blur-md backdrop-saturate-150 ' +
              'transition-transform duration-[400ms] ease-(--ease-spring) ' +
              'hover:-translate-y-1 ' +
              c.cls
            }
            tabIndex={0}
          >
            <h3 className="text-lg font-semibold tracking-tight">{c.title}</h3>
            <p className="text-sm text-(--color-text-muted)">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { MagneticButton } from './MagneticButton.tsx';

export function Hero() {
  return (
    <section className="mx-auto max-w-[960px] px-6 pt-24 pb-16 text-center">
      <p className="mb-4 text-sm font-medium tracking-wide text-(--color-text-muted) uppercase">
        Vibe-coding the design layer
      </p>
      <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
        디자인을 코드처럼 <br />
        <span className="text-(--color-action-primary)">버전 관리</span>한다.
      </h1>
      <p className="mx-auto mb-10 max-w-[600px] text-lg text-(--color-text-muted)">
        DESIGN.md 한 장으로 코딩 에이전트와 시각 언어를 공유. 7-stage 검증으로
        토큰·접근성·일관성을 강제.
      </p>
      <div className="flex justify-center gap-3">
        <MagneticButton>Get Started</MagneticButton>
        <a
          href="#features"
          className="
            inline-flex items-center px-6 py-3 rounded-md
            border border-(--color-border-default)
            bg-(--color-surface-glass) backdrop-blur-md
            text-(--color-text-default)
            transition-colors hover:bg-(--color-surface-muted)
          "
        >
          Learn more
        </a>
      </div>
    </section>
  );
}

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  strength?: number;
  radius?: number;
};

export function MagneticButton({ children, strength = 0.3, radius = 100, className = '', ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;
    const mq = matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;

    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top - r.height / 2;
      if (Math.hypot(dx, dy) > radius) {
        btn.style.transform = '';
        return;
      }
      btn.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };
    const reset = () => { btn.style.transform = ''; };

    window.addEventListener('pointermove', onMove);
    btn.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      btn.removeEventListener('pointerleave', reset);
    };
  }, [strength, radius]);

  return (
    <button
      ref={ref}
      className={
        'px-6 py-3 rounded-md bg-(--color-action-primary) text-(--color-text-on-primary) ' +
        'font-medium will-change-transform ' +
        'transition-transform duration-[400ms] ease-(--ease-spring) ' +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}

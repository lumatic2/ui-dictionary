import { GlassNav } from './components/GlassNav.tsx';
import { Hero } from './components/Hero.tsx';
import { FeatureBento } from './components/FeatureBento.tsx';

export function App() {
  return (
    <>
      <GlassNav />
      <main>
        <Hero />
        <FeatureBento />
      </main>
      <footer className="mx-auto max-w-[960px] px-6 pb-10 text-center text-sm text-(--color-text-muted)">
        Built with desing-manual · glass aesthetic family
      </footer>
    </>
  );
}

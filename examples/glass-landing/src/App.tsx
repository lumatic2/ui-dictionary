import { GlassNav } from './components/GlassNav.tsx';
import { Hero } from './components/Hero.tsx';
import { FeatureBento } from './components/FeatureBento.tsx';
import { PricingSection } from './components/PricingSection.tsx';

export function App() {
  return (
    <>
      <GlassNav />
      <main>
        <Hero />
        <FeatureBento />
        <PricingSection />
      </main>
      <footer className="mx-auto max-w-[1040px] px-6 pb-10 text-center text-sm text-(--color-text-muted)">
        Built with design-manual · glass aesthetic family
      </footer>
    </>
  );
}

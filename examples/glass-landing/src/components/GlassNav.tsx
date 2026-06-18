export function GlassNav() {
  return (
    <div className="sticky top-0 z-50 px-6 pt-4 pointer-events-none">
      <nav
        className="glass-nav pointer-events-auto mx-auto flex max-w-[1040px] items-center justify-between rounded-full px-5 py-2.5"
        aria-label="Primary"
      >
        <a href="#" className="text-sm font-semibold tracking-tight">design-manual</a>
        <ul className="flex items-center gap-1.5 list-none text-sm text-(--color-text-muted)">
          <li>
            <a href="#features" className="px-2.5 py-1.5 rounded-full hover:bg-black/5 hover:text-(--color-text-default) transition-colors">
              Features
            </a>
          </li>
          <li>
            <a href="#cookbook" className="px-2.5 py-1.5 rounded-full hover:bg-black/5 hover:text-(--color-text-default) transition-colors">
              Cookbook
            </a>
          </li>
          <li>
            <a href="https://github.com" className="px-2.5 py-1.5 rounded-full hover:bg-black/5 hover:text-(--color-text-default) transition-colors">
              GitHub
            </a>
          </li>
          <li>
            <a
              href="#"
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-90"
              style={{
                background: 'var(--color-action-primary)',
                color: 'var(--color-text-on-primary)',
                boxShadow: '0 2px 10px oklch(55% 0.18 280 / 0.28)',
              }}
            >
              Get Started
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

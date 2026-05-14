export function GlassNav() {
  return (
    <nav
      className="
        sticky top-4 z-10 mx-auto mt-4 flex max-w-[960px] items-center justify-between
        rounded-full border border-(--color-border-default)
        bg-(--color-surface-glass)
        px-5 py-2.5
        backdrop-blur-md backdrop-saturate-150
      "
      aria-label="Primary"
    >
      <a href="#" className="font-semibold tracking-tight">desing-manual</a>
      <ul className="flex gap-5 text-sm text-(--color-text-muted)">
        <li><a href="#features" className="hover:text-(--color-text-default) transition-colors">Features</a></li>
        <li><a href="#cookbook" className="hover:text-(--color-text-default) transition-colors">Cookbook</a></li>
        <li><a href="https://github.com" className="hover:text-(--color-text-default) transition-colors">GitHub</a></li>
      </ul>
    </nav>
  );
}

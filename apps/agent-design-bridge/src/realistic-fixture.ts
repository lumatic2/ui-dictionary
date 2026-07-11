import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

/**
 * Describes one marked component written into the realistic fixture project.
 * `id` matches the `data-agent-design-id` marker value (and therefore the
 * canonical node id once ingested).
 */
export interface RealisticComponentSpec {
  id: string
  exportName: string
  file: string
  name: string
  label: string
}

export const REALISTIC_COMPONENTS: readonly RealisticComponentSpec[] = [
  { id: 'hero', exportName: 'Hero', file: 'src/components/Hero.tsx', name: 'Hero', label: 'Build faster, ship calmer' },
  { id: 'navbar', exportName: 'NavBar', file: 'src/components/NavBar.tsx', name: 'Primary navigation', label: 'Askewly' },
  { id: 'card-grid', exportName: 'CardGrid', file: 'src/components/CardGrid.tsx', name: 'Feature card grid', label: 'Everything you need' },
  { id: 'contact-form', exportName: 'ContactForm', file: 'src/components/ContactForm.tsx', name: 'Contact form', label: 'Talk to us' },
  { id: 'footer', exportName: 'Footer', file: 'src/components/Footer.tsx', name: 'Site footer', label: 'All rights reserved' },
]

function write(root: string, relativePath: string, content: string): string {
  const file = join(root, relativePath)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content, 'utf8')
  return file
}

/**
 * Writes a realistic multi-file React project into `projectRoot`: five
 * data-agent-design-* marked components spread across separate files, an
 * App.tsx that composes them, an unmarked helper component and utility
 * module ingestion must not disturb, and an index.html like the packaged
 * e2e fixture uses. Returns the absolute file paths written.
 */
export function writeRealisticProject(projectRoot: string): { files: string[]; components: readonly RealisticComponentSpec[] } {
  const files: string[] = []

  files.push(write(projectRoot, 'index.html', '<!doctype html>\n<html>\n  <head><title>Askewly demo</title></head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n'))

  files.push(write(
    projectRoot,
    'src/lib/formatDate.ts',
    [
      '// Small date helper shared across marketing sections.',
      '// Deliberately has no JSX and no data-agent-design markers -',
      '// ingestion must leave this file untouched.',
      'export function formatDate(date: Date): string {',
      "  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })",
      '}',
      '',
    ].join('\n'),
  ))

  files.push(write(
    projectRoot,
    'src/components/Badge.tsx',
    [
      '// Unmarked presentational helper. Renders JSX but carries no',
      '// data-agent-design-id, so ingestion must not turn it into a node.',
      'export function Badge({ children }: { children: string }) {',
      '  return <span className="badge">{children}</span>',
      '}',
      '',
    ].join('\n'),
  ))

  files.push(write(
    projectRoot,
    'src/components/Hero.tsx',
    [
      "import { Badge } from './Badge'",
      '',
      '// Marketing hero banner. The marked <section> below is the canvas node;',
      '// the surrounding helper and comment must survive ingestion untouched.',
      'export function Hero() {',
      '  return (',
      '    <section data-agent-design-id="hero" data-agent-design-name="Hero" data-agent-design-label="Build faster, ship calmer" className="hero">',
      '      <Badge>New</Badge>',
      '    </section>',
      '  )',
      '}',
      '',
    ].join('\n'),
  ))

  files.push(write(
    projectRoot,
    'src/components/NavBar.tsx',
    [
      '// Top-level site navigation.',
      'export function NavBar() {',
      '  return (',
      '    <nav data-agent-design-id="navbar" data-agent-design-name="Primary navigation" data-agent-design-label="Askewly" className="navbar">',
      '      <a href="/pricing">Pricing</a>',
      '    </nav>',
      '  )',
      '}',
      '',
    ].join('\n'),
  ))

  files.push(write(
    projectRoot,
    'src/components/CardGrid.tsx',
    [
      "import { formatDate } from '../lib/formatDate'",
      '',
      '// Feature card grid. formatDate is used at render time so this file',
      '// exercises an unmarked cross-file import next to the marked element.',
      'export function CardGrid() {',
      '  const today = formatDate(new Date(2026, 6, 12))',
      '  return (',
      '    <div data-agent-design-id="card-grid" data-agent-design-name="Feature card grid" data-agent-design-label="Everything you need" className="card-grid" title={today}>',
      '      <article>Card one</article>',
      '      <article>Card two</article>',
      '    </div>',
      '  )',
      '}',
      '',
    ].join('\n'),
  ))

  files.push(write(
    projectRoot,
    'src/components/ContactForm.tsx',
    [
      '// Contact form section.',
      'export function ContactForm() {',
      '  return (',
      '    <form data-agent-design-id="contact-form" data-agent-design-name="Contact form" data-agent-design-label="Talk to us" className="contact-form">',
      '      <input name="email" />',
      '    </form>',
      '  )',
      '}',
      '',
    ].join('\n'),
  ))

  files.push(write(
    projectRoot,
    'src/components/Footer.tsx',
    [
      '// Site footer.',
      'export function Footer() {',
      '  return (',
      '    <footer data-agent-design-id="footer" data-agent-design-name="Site footer" data-agent-design-label="All rights reserved" className="footer">',
      '      <small>Askewly</small>',
      '    </footer>',
      '  )',
      '}',
      '',
    ].join('\n'),
  ))

  files.push(write(
    projectRoot,
    'src/App.tsx',
    [
      "import { Hero } from './components/Hero'",
      "import { NavBar } from './components/NavBar'",
      "import { CardGrid } from './components/CardGrid'",
      "import { ContactForm } from './components/ContactForm'",
      "import { Footer } from './components/Footer'",
      '',
      '// Composition root. Deliberately unmarked itself - only the child',
      '// components below carry data-agent-design-id markers.',
      'export function App() {',
      '  return (',
      '    <main>',
      '      <NavBar />',
      '      <Hero />',
      '      <CardGrid />',
      '      <ContactForm />',
      '      <Footer />',
      '    </main>',
      '  )',
      '}',
      '',
    ].join('\n'),
  ))

  return { files, components: REALISTIC_COMPONENTS }
}

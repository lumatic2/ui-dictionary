export type AppMode = 'production' | 'benchmark'

/** The benchmark surface is opt-in; every other URL is the production shell. */
export function appModeFromSearch(search: string): AppMode {
  return new URLSearchParams(search).get('benchmark') === '1' ? 'benchmark' : 'production'
}

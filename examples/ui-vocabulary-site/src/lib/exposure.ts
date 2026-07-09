import { navigationCollections, type NavigationCollectionId } from "@/lib/navigation-model"

/**
 * Production exposure gate.
 *
 * Contract: docs/design-system/site-blueprint.md > "Production Exposure Policy".
 * Principle: listed = finished. Unfinished sections keep their data, components,
 * and routes in the codebase (nothing is deleted) but are hidden from the
 * production build. Dev mode (`npm run dev`) always shows everything — the
 * "as-built floor plan" for future buildout.
 */
export const SHOW_UNFILLED = import.meta.env.DEV

/**
 * Collection id prefixes that are gated regardless of their termIds content.
 * The Templates surface is defined in the blueprint as a future Pro-only
 * surface ("Templates 는 Pro 하위" / "Pro > Templates ... 껍데기") and stays
 * hidden until real, sellable templates exist — even though its termIds
 * already reference real, filled-in terms.
 */
const GATED_COLLECTION_ID_PREFIXES = ["plus-templates"]

function isCollectionUnfilled(id: NavigationCollectionId): boolean {
  if (GATED_COLLECTION_ID_PREFIXES.some((prefix) => id.startsWith(prefix))) {
    return true
  }

  const collection = navigationCollections.find((item) => item.id === id)

  return Boolean(collection?.termIds && collection.termIds.length === 0)
}

/** Whether a navigation collection should be exposed in the current build. */
export function isNavigationCollectionVisible(id: NavigationCollectionId): boolean {
  return SHOW_UNFILLED || !isCollectionUnfilled(id)
}

/** Same check, taking a raw filter string (e.g. "nav:plus-templates-oatmeal"). */
export function isNavigationFilterVisible(filter: string): boolean {
  if (SHOW_UNFILLED || !filter.startsWith("nav:")) {
    return true
  }

  return isNavigationCollectionVisible(filter.slice("nav:".length) as NavigationCollectionId)
}

/**
 * Whether a dev-only "shell" item (skeleton page/nav entry — layout and
 * headings, no source-quality content yet) should be exposed. Unlike the
 * navigation-collection gate above, shell status is an explicit flag on the
 * item itself (`shell: true`), not derived from `termIds`.
 */
export function isShellVisible(shell?: boolean): boolean {
  return SHOW_UNFILLED || !shell
}

/** Same check, taking a breadcrumb-style path (e.g. term.navigation.also_appears_in entries). */
export function isNavigationPathVisible(path: string[]): boolean {
  if (SHOW_UNFILLED) {
    return true
  }

  const collection = navigationCollections.find(
    (item) => item.path.length === path.length && item.path.every((segment, index) => segment === path[index])
  )

  return collection ? isNavigationCollectionVisible(collection.id) : true
}

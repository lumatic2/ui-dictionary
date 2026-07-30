import { toPng } from "html-to-image"
import type { VocabularyTerm } from "@/data/terms.generated"

export function getTermPngFileName(term: VocabularyTerm, date = new Date()) {
  return `ui-vocabulary-${term.id}-${toDateStamp(date)}.png`
}

export async function nodeToPngDataUrl(node: HTMLElement) {
  await document.fonts.ready

  return toPng(node, {
    // hardcoded-color-ok: exported PNG is a fixed white-background artifact, independent of site theme
    backgroundColor: "#ffffff",
    cacheBust: true,
    filter: (target) => !(target instanceof HTMLElement && target.dataset.exportIgnore === "true"),
    pixelRatio: 2,
  })
}

export async function downloadNodeAsPng(node: HTMLElement, fileName: string) {
  const dataUrl = await nodeToPngDataUrl(node)
  const link = document.createElement("a")
  link.download = fileName
  link.href = dataUrl
  link.click()

  return dataUrl
}

function toDateStamp(date: Date) {
  return date.toISOString().slice(0, 10)
}

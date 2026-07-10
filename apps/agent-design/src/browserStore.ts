import type { DocumentStore } from '@askewly/canvas-core'

export class BrowserDocumentStore implements DocumentStore {
  async read(key: string) { return window.localStorage.getItem(key) }
  async write(key: string, value: string) { window.localStorage.setItem(key, value) }
}

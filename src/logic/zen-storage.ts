/** Minimal async storage used by the zen editor. */
export interface ZenLocalStorage {
  get: (keys: string | string[]) => Promise<Record<string, any>>
  set: (items: Record<string, any>) => Promise<void>
  remove: (keys: string | string[]) => Promise<void>
}

const WEB_PREFIX = 'pali-zen:'

function isExtensionPage() {
  try {
    // Same gate as webextension-polyfill: chrome.runtime.id must exist.
    const chromeApi = (globalThis as any).chrome
    return typeof chromeApi === 'object'
      && !!chromeApi
      && !!chromeApi.runtime
      && typeof chromeApi.runtime.id === 'string'
  }
  catch {
    return false
  }
}

function webLocalStorage(): ZenLocalStorage {
  return {
    async get(keys) {
      const list = Array.isArray(keys) ? keys : [keys]
      const out: Record<string, any> = {}
      for (const key of list) {
        const raw = localStorage.getItem(WEB_PREFIX + key)
        if (raw == null)
          continue
        try {
          out[key] = JSON.parse(raw)
        }
        catch {
          out[key] = raw
        }
      }
      return out
    },
    async set(items) {
      for (const [key, value] of Object.entries(items))
        localStorage.setItem(WEB_PREFIX + key, JSON.stringify(value))
    },
    async remove(keys) {
      const list = Array.isArray(keys) ? keys : [keys]
      for (const key of list)
        localStorage.removeItem(WEB_PREFIX + key)
    },
  }
}

let cached: ZenLocalStorage | null = null

/**
 * Extension pages use `browser.storage.local`.
 * Plain Vite (`pnpm run dev:editor`) falls back to `localStorage`
 * so webextension-polyfill is never loaded outside an extension.
 */
export async function getZenLocalStorage(): Promise<ZenLocalStorage> {
  if (cached)
    return cached

  if (isExtensionPage()) {
    const browser = (await import('webextension-polyfill')).default
    cached = browser.storage.local
    return cached
  }

  cached = webLocalStorage()
  return cached
}

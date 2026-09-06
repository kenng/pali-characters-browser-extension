/**
 * macOS Option/Alt letter keys still emit OS glyphs after keydown.preventDefault():
 * - beforeinput / keypress: Opt+L → ¬, Opt+G → ©, Opt+M → µ, …
 * - composition*: Opt+N is a tilde dead key → ˜ (ṇ˜)
 *
 * Arm after a successful Pāli shortcut; keep armed briefly and across
 * composition so the OS glyph does not append or replace the Pāli char.
 */
let suppressOsInsert = false
let clearTimer: ReturnType<typeof setTimeout> | null = null

/** Common macOS Option leftovers for keys we map as underdots / related. */
const OS_OPTION_JUNK = new Set([
  '¬', // Opt+L
  '©', // Opt+G
  'µ', // Opt+M
  '∂', // Opt+D
  '†', // Opt+T
  '˜', // Opt+N dead tilde
  '¨', // Opt+U dead diaeresis
  '´', // Opt+E dead acute
  '`', // Opt+` dead grave
  'ˆ', // Opt+I dead circumflex
])

const SUPPRESS_MS = 250

export function armOsInsertSuppress() {
  suppressOsInsert = true
  if (clearTimer)
    clearTimeout(clearTimer)
  clearTimer = setTimeout(() => {
    suppressOsInsert = false
    clearTimer = null
  }, SUPPRESS_MS)
}

function disarm() {
  suppressOsInsert = false
  if (clearTimer) {
    clearTimeout(clearTimer)
    clearTimer = null
  }
}

function stripJunkFromField(junk: string, target?: EventTarget | null) {
  const el = (target as HTMLInputElement | HTMLTextAreaElement | null)
    || (document.activeElement as HTMLInputElement | HTMLTextAreaElement | null)
  if (!el || typeof el.value !== 'string')
    return
  const value = el.value
  if (!value.endsWith(junk))
    return
  const next = value.slice(0, -junk.length)
  const pos = Math.max(0, (el.selectionStart ?? next.length) - junk.length)
  el.value = next
  try {
    el.selectionStart = el.selectionEnd = pos
  }
  catch {
    // some hosts ignore caret on non-focused fields
  }
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

export function suppressOsInsertHandler(ev: Event) {
  if (!suppressOsInsert)
    return

  if (ev.type === 'input') {
    const el = (ev.target || document.activeElement) as HTMLInputElement | HTMLTextAreaElement | null
    if (el && typeof el.value === 'string' && el.value.length) {
      const last = el.value.slice(-1)
      if (OS_OPTION_JUNK.has(last))
        stripJunkFromField(last, el)
    }
    return
  }

  ev.preventDefault()

  if (ev.type === 'compositionend') {
    const data = (ev as CompositionEvent).data
    if (data && OS_OPTION_JUNK.has(data)) {
      stripJunkFromField(data, ev.target)
    }
    else {
      // Some engines omit compositionend.data; still drop a trailing Option glyph
      const el = (ev.target || document.activeElement) as HTMLInputElement | HTMLTextAreaElement | null
      if (el && typeof el.value === 'string' && el.value.length) {
        const last = [...el.value].pop()!
        if (OS_OPTION_JUNK.has(last))
          stripJunkFromField(last, el)
      }
    }
    disarm()
    return
  }

  if (ev.type === 'compositionstart' || ev.type === 'compositionupdate') {
    // Stay armed until compositionend or timeout
    return
  }
}

export function installOsInsertSuppress(target: Document | HTMLElement = document) {
  target.addEventListener('beforeinput', suppressOsInsertHandler, { capture: true })
  target.addEventListener('keypress', suppressOsInsertHandler, { capture: true })
  target.addEventListener('compositionstart', suppressOsInsertHandler, { capture: true })
  target.addEventListener('compositionupdate', suppressOsInsertHandler, { capture: true })
  target.addEventListener('compositionend', suppressOsInsertHandler, { capture: true })
  target.addEventListener('input', suppressOsInsertHandler, { capture: true })
}

/** Test helper */
export function resetOsInsertSuppress() {
  disarm()
}

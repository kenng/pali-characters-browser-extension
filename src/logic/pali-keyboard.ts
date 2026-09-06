// const letters = [
//     ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
//     ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
//     ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
//     ['ā', 'ḍ', 'ī', 'ḷ', 'ṁ', 'ṃ', 'ñ', 'ṇ', 'ṭ', 'ū', 'ŋ', 'ṅ'],
// ];

// Exported maps for help guide UI
export const tilde: Record<string, string> = {
  A: 'ā',
  I: 'ī',
  N: 'ñ',
  U: 'ū',
}

export const overdot: Record<string, string> = {
  M: 'ṁ',
  N: 'ṅ',
}

export const underdot: Record<string, string> = {
  D: 'ḍ',
  L: 'ḷ',
  M: 'ṃ',
  G: 'ŋ',
  N: 'ṇ',
  T: 'ṭ',
}

/**
 * Ctrl+Alt (+ letter) — no Cmd/Meta.
 * Irregular remaps: N→ṇ, M→ṃ.  ñ / ṁ / ṅ use dedicated chords elsewhere.
 */
export const universalCodes: Record<string, string> = {
  KeyA: 'ā',
  KeyI: 'ī',
  KeyU: 'ū',
  KeyN: 'ṇ',
  KeyM: 'ṃ',
  KeyD: 'ḍ',
  KeyL: 'ḷ',
  KeyT: 'ṭ',
  KeyG: 'ŋ',
}

// Physical Key Code Mappings (Layout Independent)
const tildeCodes: Record<string, string> = {
  KeyA: 'ā',
  KeyI: 'ī',
  KeyN: 'ñ',
  KeyU: 'ū',
  KeyY: 'ū',
}

const overdotCodes: Record<string, string> = {
  KeyM: 'ṁ',
  KeyN: 'ṅ',
  Comma: 'ṅ', // backup when Ctrl+N is stolen by the browser
}

const underdotCodes: Record<string, string> = {
  KeyD: 'ḍ',
  KeyL: 'ḷ',
  KeyM: 'ṃ',
  KeyG: 'ŋ',
  KeyN: 'ṇ',
  KeyT: 'ṭ',
}

function withCase(char: string, shift: boolean) {
  return shift ? char.toUpperCase() : char
}

export function onKeyDown(event: KeyboardEvent) {
  const isMac = typeof navigator !== 'undefined'
    && (navigator.userAgent.includes('Mac') || navigator.platform.includes('Mac'))

  const hasCtrl = event.ctrlKey
  const hasAlt = event.altKey
  const hasMeta = event.metaKey // Cmd on Mac
  const hasShift = event.shiftKey
  const code = event.code

  // Conflicting keys (N for new window, M for minimize)
  const isConflicting = code === 'KeyN' || code === 'KeyM'

  // ñ — irregular (must run before Ctrl+Alt universal, which uses KeyN for ṇ)
  // Mac: Ctrl+Cmd+Opt+N (Shift → Ñ)
  if (isMac && hasCtrl && hasAlt && hasMeta && code === 'KeyN') {
    event.preventDefault()
    return withCase('ñ', hasShift)
  }
  // Windows: Ctrl+Alt+Shift+N (Shift is part of the chord → always ñ)
  if (!isMac && hasCtrl && hasAlt && hasShift && !hasMeta && code === 'KeyN') {
    event.preventDefault()
    return 'ñ'
  }

  // Universal: Ctrl+Alt+Key without Cmd (KeyN→ṇ, KeyM→ṃ, …)
  if (hasCtrl && hasAlt && !hasMeta) {
    const char = universalCodes[code]
    if (char) {
      event.preventDefault()
      return withCase(char, hasShift)
    }
  }

  // Tilde: Mac Cmd+Alt+Key (skip N/M — system conflicts)
  if (isMac && hasMeta && hasAlt && !hasCtrl && !isConflicting) {
    const char = tildeCodes[code]
    if (char) {
      event.preventDefault()
      return withCase(char, hasShift)
    }
  }

  // Underdot: Alt+Key alone
  if (hasAlt && !hasCtrl && !hasMeta) {
    const char = underdotCodes[code]
    if (char) {
      event.preventDefault()
      return withCase(char, hasShift)
    }
  }

  // Overdot: Ctrl+Key (ṁ, ṅ) or Mac Cmd+Key when non-conflicting; ṅ also Ctrl+,
  if (((isMac && hasMeta && !isConflicting) || hasCtrl) && !hasAlt) {
    const char = overdotCodes[code]
    if (char) {
      event.preventDefault()
      return withCase(char, hasShift)
    }
  }

  return
}

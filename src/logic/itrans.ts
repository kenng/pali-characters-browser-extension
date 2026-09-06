/**
 * Common Pāli ITRANS sequences (romanized Unicode only).
 * Nasals: .m → ṃ, ;m → ṁ (not .M). Velar nasal: ;n → ṅ. Local: .g → ŋ.
 */

export const itransHelpRows: ReadonlyArray<{ seq: string; char: string }> = [
  { seq: 'aa', char: 'ā' },
  { seq: 'ii', char: 'ī' },
  { seq: 'uu', char: 'ū' },
  { seq: '~n', char: 'ñ' },
  { seq: ';n', char: 'ṅ' },
  { seq: '.n', char: 'ṇ' },
  { seq: '.t', char: 'ṭ' },
  { seq: '.d', char: 'ḍ' },
  { seq: '.l', char: 'ḷ' },
  { seq: '.m', char: 'ṃ' },
  { seq: ';m', char: 'ṁ' },
  { seq: '.g', char: 'ŋ' },
]

/** Full sequence → character map including uppercase forms. */
export const itransMap: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const { seq, char } of itransHelpRows) {
    map[seq] = char
    const upperSeq = upperSequence(seq)
    if (upperSeq !== seq)
      map[upperSeq] = char.toUpperCase()
  }
  return map
})()

function upperSequence(seq: string): string {
  return seq.replace(/[a-z]/g, c => c.toUpperCase())
}

let buffer = ''

export function getItransBuffer(): string {
  return buffer
}

export function resetItransBuffer() {
  buffer = ''
}

function isPrefix(s: string): boolean {
  if (!s)
    return false
  for (const key of Object.keys(itransMap)) {
    if (key.startsWith(s))
      return true
  }
  return false
}

export type ItransCommit = {
  char: string
  /** How many already-typed prefix chars to remove before inserting `char`. */
  backspace: number
}

/**
 * Feed a keydown into the ITRANS composer.
 * Prefix keys pass through (browser inserts them); a completed match
 * preventDefaults and returns a commit with backspace count.
 */
export function onItransKeyDown(event: KeyboardEvent): ItransCommit | undefined {
  if (event.ctrlKey || event.altKey || event.metaKey) {
    buffer = ''
    return
  }

  if (event.key === 'Escape') {
    buffer = ''
    return
  }

  if (event.key === 'Backspace') {
    if (buffer.length > 0)
      buffer = buffer.slice(0, -1)
    return
  }

  const key = event.key
  if (key.length !== 1) {
    buffer = ''
    return
  }

  const next = buffer + key

  const matched = itransMap[next]
  if (matched) {
    const backspace = buffer.length
    buffer = ''
    event.preventDefault()
    return { char: matched, backspace }
  }

  if (isPrefix(next)) {
    buffer = next
    return
  }

  if (isPrefix(key)) {
    buffer = key
    return
  }

  buffer = ''
}

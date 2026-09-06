import { itransHelpRows } from './itrans'
import { tilde, underdot, overdot, universalCodes } from './pali-keyboard'

export function isMac(): boolean {
  return typeof navigator !== 'undefined'
    && (navigator.userAgent.includes('Mac') || navigator.platform.includes('Mac'))
}

function codeLabel(code: string): string {
  return code.replace('Key', '').replace('Comma', ',').replace('Period', '.').replace('Slash', '/')
}

function reverseUniversalMap(): Record<string, string> {
  const reverseUniversal: Record<string, string> = {}
  for (const [key, val] of Object.entries(universalCodes))
    reverseUniversal[val] = codeLabel(key)
  return reverseUniversal
}

function kbd(label: string): string {
  return `<kbd>${label}</kbd>`
}

function joinKeys(...parts: string[]): string {
  return parts.join(' + ')
}

function ctrlAltChord(...keys: string[]): string {
  return isMac()
    ? joinKeys(kbd('⌃ Ctrl'), kbd('⌥ Opt'), ...keys.map(kbd))
    : joinKeys(kbd('Ctrl'), kbd('Alt'), ...keys.map(kbd))
}

/**
 * Primary shortcut shown in help for the remapped irregular chords.
 */
export function primaryShortcutLabel(
  group: 'tilde' | 'underdot' | 'overdot',
  letterKey: string,
  char: string,
  reverseUniversal: Record<string, string>,
): string {
  const uni = reverseUniversal[char] || letterKey

  // Shared irregulars — ñ avoids Cmd/Ctrl+N "new window"
  if (char === 'ñ') {
    return isMac()
      ? joinKeys(kbd('⌃ Ctrl'), kbd('⌘ Cmd'), kbd('⌥ Opt'), kbd('N'))
      : joinKeys(kbd('Ctrl'), kbd('Alt'), kbd('Shift'), kbd('N'))
  }
  if (char === 'ṅ') {
    return isMac()
      ? `${joinKeys(kbd('⌃ Ctrl'), kbd('N'))} <span class="opacity-40">or</span> ${joinKeys(kbd('⌃ Ctrl'), kbd(','))}`
      : `${joinKeys(kbd('Ctrl'), kbd('N'))} <span class="opacity-40">or</span> ${joinKeys(kbd('Ctrl'), kbd(','))}`
  }
  if (char === 'ṁ')
    return isMac() ? joinKeys(kbd('⌃ Ctrl'), kbd('M')) : joinKeys(kbd('Ctrl'), kbd('M'))

  if (!isMac()) {
    if (group === 'tilde')
      return ctrlAltChord(letterKey)
    if (group === 'underdot') {
      if (char === 'ṇ' || char === 'ṃ')
        return ctrlAltChord(uni)
      return joinKeys(kbd('Alt'), kbd(letterKey))
    }
    return joinKeys(kbd('Ctrl'), kbd(letterKey))
  }

  // Mac
  if (group === 'tilde')
    return joinKeys(kbd('⌘ Cmd'), kbd('⌥ Opt'), kbd(letterKey))
  if (group === 'underdot')
    return ctrlAltChord(uni)
  return joinKeys(kbd('⌃ Ctrl'), kbd(letterKey))
}

/** Faded second line — omit when primary is the only chord. */
export function secondaryShortcutLabel(
  char: string,
  reverseUniversal: Record<string, string>,
): string | null {
  if (char === 'ñ' || char === 'ṁ' || char === 'ṅ')
    return null
  const uni = reverseUniversal[char]
  if (!uni)
    return null
  return ctrlAltChord(uni)
}

export function getQuickCharBar(): string {
  const allChars = [...Object.values(tilde), ...Object.values(underdot), ...Object.values(overdot)]
  const uniqueChars = [...new Set(allChars)]

  let html = '<div class="pk-quick-bar-title text-[9px] font-black tracking-widest uppercase text-amber-500/60 mb-2">Quick Insert</div>'
  html += '<div class="pk-quick-bar flex flex-wrap gap-2 mb-6">'
  for (const char of uniqueChars)
    html += `<button class="pk-quick-char" data-char="${char}">${char}</button>`
  html += '</div>'
  return html
}

export function getKeyboardMappingStr(): string {
  let htmlStr = getQuickCharBar()
  const reverseUniversal = reverseUniversalMap()

  const renderSection = (
    title: string,
    data: Record<string, string>,
    group: 'tilde' | 'underdot' | 'overdot',
  ) => {
    let sectionHtml = `<div class="pk-help-title">${title}</div>`
    for (const [key, value] of Object.entries(data)) {
      const primary = primaryShortcutLabel(group, key, value, reverseUniversal)
      const secondary = secondaryShortcutLabel(value, reverseUniversal)
      sectionHtml += `
        <div class="pk-help-row">
          <div class="pk-help-char">
            <button class="pk-insert-btn" data-char="${value}" title="Insert ${value}">
              <span>+</span>
            </button>
            <span class="pk-help-glyph">${value}</span>
          </div>
          <div class="pk-help-keys">
            <code>${primary}</code>
            ${secondary ? `<code class="pk-help-keys-secondary">${secondary}</code>` : ''}
          </div>
        </div>`
    }
    return sectionHtml
  }

  htmlStr += renderSection('Tilde characters', tilde, 'tilde')
  htmlStr += renderSection('Underdot characters', underdot, 'underdot')
  htmlStr += renderSection('Overdot characters', overdot, 'overdot')
  htmlStr += getItransHelpSection()

  return htmlStr
}

export function getItransHelpSection(): string {
  let sectionHtml = '<div class="pk-help-title">ITRANS (when enabled)</div>'
  for (const { seq, char } of itransHelpRows) {
    sectionHtml += `
      <div class="pk-help-row">
        <div class="pk-help-char">
          <button class="pk-insert-btn" data-char="${char}" title="Insert ${char}">
            <span>+</span>
          </button>
          <span class="pk-help-glyph">${char}</span>
        </div>
        <div class="pk-help-keys">
          <code><kbd>${seq}</kbd></code>
        </div>
      </div>`
  }
  return sectionHtml
}


function setStyle() {
  const css = document.createElement('style')
  css.id = 'pk-styles'
  css.innerHTML = `
.pk-modal {
  display: block;
  position: fixed;
  z-index: 2147483647;
  right: 24px;
  top: 24px;
  width: 320px;
  background: white;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  border-radius: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2D3436;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  user-select: none;
  animation: pk-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pk-slide-in { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

.pk-modal-header {
  padding: 16px;
  background: #fdfdfd;
  border-bottom: 1px solid #f3f3f3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}

.pk-modal-title {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #9CA3AF;
}

.pk-close-modal {
  cursor: pointer;
  color: #9CA3AF;
  font-size: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}
.pk-close-modal:hover { background: #fef2f2; color: #ef4444; }

.pk-modal-body {
  max-height: 480px;
  overflow-y: auto;
  padding: 20px;
}

.pk-quick-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pk-quick-char {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F9FAFB;
  border: 1px solid #F3F4F6;
  border-radius: 10px;
  font-family: Garamond, Georgia, serif;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: #374151;
}

.pk-quick-char:hover {
  background: #E49B0F;
  color: white;
  border-color: #E49B0F;
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 4px 12px rgba(228, 155, 15, 0.2);
}

.pk-help-title {
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #D1D5DB;
  margin: 24px 0 8px 4px;
}

.pk-help-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 8px;
  border-bottom: 1px solid #F9FAFB;
  border-radius: 12px;
  transition: background 0.2s;
}

.pk-help-row:hover { background: #E49B0F08; }

.pk-help-char {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.pk-help-glyph {
  font-family: Garamond, Georgia, serif;
  font-size: 1.125rem;
  color: #1F2937;
}

.pk-help-keys {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.pk-help-keys code {
  display: block;
  max-width: 100%;
  font-size: 10px;
  color: #6B7280;
  line-height: 1.7;
  white-space: normal;
}

.pk-help-keys-secondary {
  margin-top: 2px;
  font-size: 8px !important;
  opacity: 0.4;
}

.pk-help-row kbd {
  display: inline-block;
  background: #F3F4F6;
  padding: 2px 5px;
  border-radius: 6px;
  color: #4B5563;
  font-size: 10px;
  font-weight: bold;
  white-space: nowrap;
}

.pk-help-row .opacity-40 { opacity: 0.4; }

.pk-insert-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E49B0F10;
  color: #E49B0F;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.pk-insert-btn:hover {
  background: #E49B0F;
  color: white;
  transform: scale(1.15) rotate(90deg);
}
  `
  document.head.appendChild(css)
}

function setScript() {
  const modal = document.createElement('div')
  modal.id = 'pk-draggable-modal'
  modal.className = 'pk-modal'
  modal.innerHTML = `
    <div class="pk-modal-header" id="pk-drag-handle">
      <span class="pk-modal-title">Pāli Shortcut Guide</span>
      <span class="pk-close-modal">&times;</span>
    </div>
    <div class="pk-modal-body">
      ${getKeyboardMappingStr()}
    </div>
  `
  document.body.appendChild(modal)

  // Drag logic
  let isDragging = false
  let currentX: number
  let currentY: number
  let initialX: number
  let initialY: number
  let xOffset = 0
  let yOffset = 0

  const dragHandle = document.getElementById('pk-drag-handle')!
  
  dragHandle.addEventListener('mousedown', dragStart)
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', dragEnd)

  function dragStart(e: MouseEvent) {
    initialX = e.clientX - xOffset
    initialY = e.clientY - yOffset
    if (e.target === dragHandle || dragHandle.contains(e.target as Node)) {
      isDragging = true
    }
  }

  function drag(e: MouseEvent) {
    if (isDragging) {
      e.preventDefault()
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY
      xOffset = currentX
      yOffset = currentY
      modal.style.transform = `translate(${currentX}px, ${currentY}px)`
    }
  }

  function dragEnd() {
    initialX = currentX
    initialY = currentY
    isDragging = false
  }

  // Close logic
  modal.querySelector('.pk-close-modal')!.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  // Insertion logic via event delegation
  modal.addEventListener('mousedown', (e) => {
    const target = e.target as HTMLElement
    const btn = target.closest('[data-char]') as HTMLElement
    if (btn) {
      e.preventDefault() // Prevent focus loss
      const char = btn.getAttribute('data-char')
      if (char) {
        window.postMessage({ type: 'PK_INSERT', char }, window.location.origin)
      }
    }
  })
}

export function getKeyboardMappingHtml() {
  console.log('pali-ext: getKeyboardMappingHtml called')
  const existing = document.getElementById('pk-draggable-modal')
  if (!existing) {
    if (!document.getElementById('pk-styles')) {
      console.log('pali-ext: injecting styles')
      setStyle()
    }
    console.log('pali-ext: injecting modal script/dom')
    setScript()
  }
  else {
    console.log('pali-ext: showing existing modal')
    existing.style.display = 'block'
  }
}

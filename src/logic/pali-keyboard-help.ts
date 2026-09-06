import { tilde, underdot, overdot, universalCodes } from './pali-keyboard'

export function isMac(): boolean {
  return typeof navigator !== 'undefined' && 
    (navigator.userAgent.includes('Mac') || navigator.platform.includes('Mac'))
}

/** Keys whose Cmd/Cmd+Opt shortcuts conflict with macOS / Chromium (New, Minimize). */
const MAC_CONFLICTING_LETTER_KEYS = new Set(['N', 'M'])

function codeLabel(code: string): string {
  return code.replace('Key', '').replace('Comma', ',').replace('Period', '.').replace('Slash', '/')
}

function reverseUniversalMap(): Record<string, string> {
  const reverseUniversal: Record<string, string> = {}
  for (const [key, val] of Object.entries(universalCodes))
    reverseUniversal[val] = codeLabel(key)
  return reverseUniversal
}

/**
 * Primary shortcut shown in help. Prefer working combos over advertised-but-blocked
 * Mac Cmd/Cmd+Opt for N/M (ñ, ṅ, ṁ).
 */
export function primaryShortcutLabel(
  group: 'tilde' | 'underdot' | 'overdot',
  letterKey: string,
  char: string,
  reverseUniversal: Record<string, string>,
): string {
  const uni = reverseUniversal[char] || letterKey
  const ctrlAlt = '<kbd>⌃ Ctrl</kbd> + <kbd>⌥ Opt</kbd> '

  if (!isMac()) {
    if (group === 'tilde')
      return `${ctrlAlt}+ ${letterKey}`
    if (group === 'underdot')
      return `<kbd>Alt</kbd> + ${letterKey}`
    // overdot: Ctrl+letter; ṅ also via Ctrl+,
    if (char === 'ṅ')
      return `<kbd>Ctrl</kbd> + , <span class="opacity-40">or</span> <kbd>Ctrl</kbd> + N`
    return `<kbd>Ctrl</kbd> + ${letterKey}`
  }

  // Mac
  if (group === 'tilde') {
    if (MAC_CONFLICTING_LETTER_KEYS.has(letterKey))
      return `${ctrlAlt}+ ${uni}`
    return `<kbd>⌘ Cmd</kbd> + <kbd>⌥ Opt</kbd> + ${letterKey}`
  }
  if (group === 'underdot') {
    // Almost every Opt+letter underdot collides with a macOS Option glyph
    // (Opt+N → ˜, Opt+G → ©, Opt+L → ¬, Opt+M → µ, …). Prefer Ctrl+Opt.
    return `${ctrlAlt}+ ${uni}`
  }
  // overdot: Cmd+M / Cmd+N are blocked — use Ctrl / Ctrl+Alt
  if (char === 'ṅ')
    return `<kbd>⌃ Ctrl</kbd> + , <span class="opacity-40">or</span> ${ctrlAlt}+ ${uni}`
  if (char === 'ṁ')
    return `<kbd>⌃ Ctrl</kbd> + M <span class="opacity-40">or</span> ${ctrlAlt}+ ${uni}`
  return `<kbd>⌃ Ctrl</kbd> + ${letterKey}`
}

export function getQuickCharBar(): string {
  const allChars = [...Object.values(tilde), ...Object.values(underdot), ...Object.values(overdot)]
  const uniqueChars = [...new Set(allChars)]
  
  let html = '<div class="pk-quick-bar-title text-[9px] font-black tracking-widest uppercase text-amber-500/60 mb-2">Quick Insert</div>'
  html += '<div class="pk-quick-bar flex flex-wrap gap-2 mb-6">'
  for (const char of uniqueChars) {
    html += `<button class="pk-quick-char" data-char="${char}">${char}</button>`
  }
  html += '</div>'
  return html
}

export function getKeyboardMappingStr(): string {
  let htmlStr = getQuickCharBar()
  
  const universalKbd = '<kbd>⌃ Ctrl</kbd> + <kbd>⌥ Opt</kbd> '
  const reverseUniversal = reverseUniversalMap()

  const renderSection = (
    title: string,
    data: Record<string, string>,
    group: 'tilde' | 'underdot' | 'overdot',
  ) => {
    let sectionHtml = `<div class="pk-help-title">${title}</div>`
    for (const [key, value] of Object.entries(data)) {
      const uniKey = reverseUniversal[value] || '?'
      const primary = primaryShortcutLabel(group, key, value, reverseUniversal)
      sectionHtml += `
        <div class="pk-help-row flex items-center justify-between border-b border-gray-50 py-3 last:border-0 hover:bg-amber-50/30 transition-colors px-2 rounded-xl">
          <div class="flex items-center gap-3">
            <button class="pk-insert-btn" data-char="${value}" title="Insert ${value}">
              <span>+</span>
            </button>
            <span class="font-serif text-lg text-gray-800">${value}</span>
          </div>
          <div class="flex flex-col items-end">
            <code class="text-[10px] text-gray-500">${primary}</code>
            <code class="text-[8px] opacity-40 mt-0.5">${universalKbd} + ${uniKey}</code>
          </div>
        </div>`
    }
    return sectionHtml
  }

  htmlStr += renderSection('Tilde characters', tilde, 'tilde')
  htmlStr += renderSection('Underdot characters', underdot, 'underdot')
  htmlStr += renderSection('Overdot characters', overdot, 'overdot')

  return htmlStr
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

.pk-help-row kbd {
  background: #F3F4F6;
  padding: 2px 5px;
  border-radius: 6px;
  color: #4B5563;
  font-size: 10px;
  font-weight: bold;
}

.pk-help-row code {
  font-size: 10px;
  color: #6B7280;
}

.pk-help-row kbd {
  background: #F3F4F6;
  padding: 2px 4px;
  border-radius: 4px;
  color: #374151;
}

.flex { display: flex; }
.items-center { align-items: center; }
.gap-3 { gap: 0.75rem; }
.flex-col { flex-direction: column; }
.items-end { align-items: flex-end; }
.font-serif { font-family: serif; }
.text-lg { font-size: 1.125rem; }
.opacity-40 { opacity: 0.4; }
.mt-0.5 { margin-top: 0.125rem; }
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
        window.postMessage({ type: 'PK_INSERT', char }, '*')
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

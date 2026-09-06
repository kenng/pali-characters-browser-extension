import { armOsInsertSuppress, installOsInsertSuppress } from './os-insert-suppress'
import { onKeyDown } from './pali-keyboard'
import { getText, setCaret, setText } from './text-helper'
let allInputElems: any[] = []
let osSuppressInstalled = false

function getInputElements(doc: Document) {
  const arr = [
    doc.getElementsByTagName('textarea'),
    doc.getElementsByTagName('input'),
    doc.querySelectorAll('[contenteditable]'),
  ]

  allInputElems = allInputElems.concat(arr)

  return arr
}

export function insertCharToActive(char: string) {
  const elem = document.activeElement
  if (!elem) return

  const out = getText(elem, char)
  if (out.pos > -1) {
    setText(elem, out.output)
    setCaret(elem, out.pos + 1)
    elem.dispatchEvent(
      new Event('input', { bubbles: true }),
    )
  }
}

function keyDownHandler(ev: Event) {
  const letter = onKeyDown(ev as KeyboardEvent)
  if (letter) {
    insertCharToActive(letter)
    // Block macOS Option glyph (e.g. ¬ after Opt+L → ḷ)
    armOsInsertSuppress()

    // this will stop propagate to additional event listener
    // e.g. some editor use ctrl-a to select-a. If allows to
    // propagate, when user type ctrl+alt+a and app return
    // 'ā', subsequently the whole text will be selected by
    // ctrl-a of the editor.
    ev.stopPropagation()
  }
}

export function listenOnInputElem(inputArray: Array<any>) {
  for (const elems of inputArray) {
    for (let i = 0; i < elems.length; i++) {
      elems[i].removeEventListener('keydown', keyDownHandler, { capture: true })
      elems[i].addEventListener(
        'keydown',
        keyDownHandler,
        { capture: true },
      )
    }
  }
}

function docAddKeydownListener() {
  document.removeEventListener(
    'keydown',
    keyDownHandler,
    { capture: true },
  )
  document.addEventListener(
    'keydown',
    keyDownHandler,
    { capture: true },
  )
}

export default function initPaliInput() {
  if (document.readyState === 'complete') {
    // eslint-disable-next-line no-console
    console.log('pali-ext: doc completed')
    if (!osSuppressInstalled) {
      installOsInsertSuppress(document)
      osSuppressInstalled = true
    }
    docAddKeydownListener()
    const inputArray = getInputElements(document)
    listenOnInputElem(inputArray)
    const iframes = document.getElementsByTagName('iframe')
    for (let idx = 0; idx < iframes.length; idx++) {
      const theIframeWin = iframes[idx].contentWindow
      if (theIframeWin != null) {
        const inputArray = getInputElements(theIframeWin.document)
        listenOnInputElem(inputArray)
      }
    }
  }
  else {
    window.addEventListener('load', () => {
      if (document.readyState === 'complete') initPaliInput()
    })
  }
}

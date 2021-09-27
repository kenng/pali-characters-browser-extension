import { onKeyDown } from './pali-keyboard'
import { getText, setCaret, setText } from './text-helper'
let allInputElems: any[] = [];

function getInputElements(doc: Document) {
  const arr = [
    doc.getElementsByTagName('textarea'),
    doc.getElementsByTagName('input'),
    doc.querySelectorAll('[contenteditable]'),
  ]

  allInputElems = allInputElems.concat(arr);

  return arr
}

export function listenOnInputElem(inputArray: Array<any>) {
  for (const elems of inputArray) {
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener(
        'keydown',
        (ev: Event) => {
          const elem = ev.target as Element
          const letter = onKeyDown(ev as KeyboardEvent)
          if (letter) {
            const out = getText(elem, letter)
            if (out.pos > -1) {
              setText(elem, out.output)
              setCaret(elem, out.pos + 1)
              elem.dispatchEvent(
                new Event('input', { bubbles: true }),
              )
            }

            // this will stop propagate to additional event listener
            // e.g. some editor use ctrl-a to select-a. If allows to
            // propagate, when user type ctrl+alt+a and app return
            // 'ā', subsequently the whole text will be selected by
            // ctrl-a of the editor.
            ev.stopPropagation()
          }
        },
        { capture: true },
      )
    }
  }
}

export default function initPaliInput() {
  if (document.readyState === 'complete') {
    // eslint-disable-next-line no-console
    console.log('initPaliInput... ', document.readyState)
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

import { onKeyDown } from './pali-keyboard'
import { getText, setCaret, setText } from './text-helper'
let inputElemArray: any = []

// eslint-disable-next-line no-console
console.log('injecting....')

function queryElem() {
  return [
    document.getElementsByTagName('textarea'),
    document.getElementsByTagName('input'),
    document.querySelectorAll('[contenteditable]'),
  ]
}

// @note: in order to have precise control on the keydown event propagation,
// we cannot use window.addEventListener, but target exactly on the editable
// element instead. Therefore, we will have to wait for web page to finish
// render all the element first.
export function listenOnInputElem() {
  debugger
  inputElemArray = queryElem()
  for (const elems of inputElemArray) {
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

export function listenOnWindow() {
  window.addEventListener('keydown', () => {
    // // simple check to see if there's any mutation to the DOM tree
    // const queriedArray = queryElem()
    // if (queriedArray.length !== inputElemArray.length)
    //   listenOnInputElem()
  })
}

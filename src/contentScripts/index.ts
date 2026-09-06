/* eslint-disable no-console */
import { storage } from 'webextension-polyfill'
import { onMessage } from 'webext-bridge'
import initPaliInput, { insertCharToActive } from '~/logic/keydown-listener'
import { getKeyboardMappingHtml } from '~/logic/pali-keyboard-help'
import { IMsg } from '~/global'
import { MsgType } from '~/logic/constant'

console.log('pali-ext: content script starting...')

onMessage('pali-action', ({ data }) => {
  const msg = data as any as IMsg
  console.log('pali-ext: [bridge] msg received', msg)
  if (msg.type === MsgType.HELP) {
    console.log('pali-ext: [bridge] displaying help guide')
    getKeyboardMappingHtml()
  }
  else if (msg.type === MsgType.RERUN || msg.type === MsgType.ACTIVATE) {
    console.log('pali-ext: [bridge] activating input')
    initPaliInput()
  }
  else if (msg.type === 'PK_INSERT_INTERNAL' && msg.char) {
    insertCharToActive(msg.char)
  }
})

// Handle messages from the injected draggable modal
window.addEventListener('message', (event) => {
  if (event.data?.type === 'PK_INSERT') {
    console.log('pali-ext: [window] insert char', event.data.char)
    insertCharToActive(event.data.char)
  }
})

// Check if global injection is enabled
storage.local.get('isGlobalEnabled').then((res) => {
  const isEnabled = res.isGlobalEnabled !== false // Default to true if not set
  console.log('pali-ext: storage isGlobalEnabled =', isEnabled)
  if (isEnabled) {
    initPaliInput()
  }
})

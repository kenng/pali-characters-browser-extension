/* eslint-disable no-console */
import { runtime } from 'webextension-polyfill'
import initPaliInput from '~/logic/keydown-listener'
import { getKeyboardMappingHtml } from '~/logic/pali-keyboard-help'
import { IMsg } from '~/global'
import { MsgType } from '~/logic/constant'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  runtime.onMessage.addListener((msg: IMsg) => {
    if (MsgType.HELP)
      getKeyboardMappingHtml()

    else if (MsgType.RERUN === msg.type)
      initPaliInput()
  })

  initPaliInput()

  // // mount component to context window
  // const container = document.createElement('div')
  // const root = document.createElement('div')
  // const styleEl = document.createElement('link')
  // const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  // styleEl.setAttribute('rel', 'stylesheet')
  // styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  // shadowDOM.appendChild(styleEl)
  // shadowDOM.appendChild(root)
  // document.body.appendChild(container)
  // createApp(App).mount(root)
})()

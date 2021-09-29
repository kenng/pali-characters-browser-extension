<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <h3>Pāli Inputs</h3>
    <button
      class="btn mt-2"
      @click="toggleHelp"
    >
      Help
    </button>
    <!-- <button
      class="btn mt-2"
      :class="{ 'to-gray-400': isContinuousInject }"
      @click="toggleContinuousReinject"
    >
      Re-enable on page refreshed
    </button>
    <p class="mt-2 opacity-50">
      This is the popup page 2021
    </p>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span>
      {{ storageDemo }}
    </div> -->
  </main>
</template>

<script setup lang="ts">
// import { tabs } from 'webextension-polyfill'

import { tabs } from 'webextension-polyfill'
import { IMsg } from '~/global'
import { getCurrentTab } from '~/logic/browser-helper'
import { MsgType } from '~/logic/constant'
// import { storageDemo } from '~/logic/storage'

async function toggleHelp() {
  const tab = await getCurrentTab()
  if (!tab.id) return
  tabs.sendMessage(tab.id, { msg: { type: MsgType.HELP } as IMsg })
  window.close()
}

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

// async function toggleReRun() {
//   const tab = await getCurrentTab()
//   if (!tab.id) return
//   tabs.sendMessage(tab.id, { msg: { type: MsgType.RERUN } as IMsg })

//   window.close()
// }

</script>

<template>
  <main class="min-h-screen bg-[#FAF9F6] p-8 font-sans text-[#2D3436]">
    <div class="max-w-md mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 bg-[#E49B0F] rounded-xl flex items-center justify-center text-white font-serif italic text-lg shadow-lg">
          ā
        </div>
        <div>
          <h1 class="text-base font-bold tracking-tight text-gray-900 leading-none">Pāli Inputs</h1>
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Options</p>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button
          class="group relative w-full py-4 px-4 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(228,155,15,0.1)] hover:-translate-y-1 flex items-center gap-4 overflow-hidden shadow-sm text-left"
          @click="openExtensionInTab"
        >
          <div class="w-10 h-10 rounded-xl bg-[#E49B0F]/10 flex items-center justify-center text-[#E49B0F] transition-colors group-hover:bg-[#E49B0F] group-hover:text-white">
            <carbon-launch class="text-xl" />
          </div>
          <div>
            <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Quick Access</div>
            <div class="text-sm font-bold text-gray-800">Open extension in new tab</div>
          </div>
        </button>

        <button
          class="group relative w-full py-4 px-4 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(228,155,15,0.1)] hover:-translate-y-1 flex items-center gap-4 overflow-hidden shadow-sm text-left"
          @click="openEditor"
        >
          <div class="w-10 h-10 rounded-xl bg-[#E49B0F]/10 flex items-center justify-center text-[#E49B0F] transition-colors group-hover:bg-[#E49B0F] group-hover:text-white">
            <carbon-edit class="text-xl" />
          </div>
          <div>
            <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Focus Mode</div>
            <div class="text-sm font-bold text-gray-800">Open Zen Editor</div>
          </div>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import browser from 'webextension-polyfill'

function openExtensionInTab() {
  browser.tabs.create({
    url: './dist/popup/index.html',
  })
}

function openEditor() {
  browser.tabs.create({
    url: './dist/editor/index.html',
  })
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.font-serif {
  font-family: 'Garamond', 'Georgia', serif;
}
</style>

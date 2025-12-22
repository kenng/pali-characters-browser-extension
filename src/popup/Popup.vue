<template>
  <main class="w-[320px] bg-[#FAF9F6] p-6 font-sans text-[#2D3436]">
    <div class="flex items-center gap-3 mb-8 cursor-default group">
      <div class="w-8 h-8 bg-[#E49B0F] rounded-xl flex items-center justify-center text-white font-serif italic text-base shadow-lg transition-transform group-hover:rotate-6">ā</div>
      <div>
        <h3 class="text-sm font-bold tracking-tight text-gray-900 leading-none">Pāli Inputs</h3>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Manifest V3 Edition</p>
      </div>
    </div>
    
    <div class="flex flex-col gap-4">
      <button
        class="group relative w-full py-4 px-4 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(228,155,15,0.1)] hover:-translate-y-1 flex items-center gap-4 overflow-hidden shadow-sm"
        @click="openEditor"
      >
        <div class="w-10 h-10 rounded-xl bg-[#E49B0F]/10 flex items-center justify-center text-[#E49B0F] transition-colors group-hover:bg-[#E49B0F] group-hover:text-white">
          <span class="i-carbon-edit text-xl" />
        </div>
        <div class="text-left">
          <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Focus Mode</div>
          <div class="text-sm font-bold text-gray-800">Open Zen Editor</div>
        </div>
      </button>

      <button
        class="group w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all flex items-center gap-3"
        @click="toggleHelp"
      >
        <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:text-[#E49B0F] shadow-sm transition-colors">
          <span class="i-carbon-help text-lg" />
        </div>
        <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900">Show Quick Help</span>
      </button>
    </div>

    <footer class="mt-8 pt-4 border-t border-gray-100 flex justify-center">
      <p class="text-[10px] text-gray-300 font-bold uppercase tracking-tighter italic">Peace begins with the first word</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { browser } from 'webextension-polyfill'

function toggleHelp() {
  browser.runtime.sendMessage({ action: 'toggle-help' })
  window.close()
}

function openEditor() {
  browser.tabs.create({
    url: './dist/editor/index.html',
  })
  window.close()
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

/* Icons for popup */
.i-carbon-edit {
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  background-color: currentColor;
  mask: url("https://api.iconify.design/carbon:edit.svg") no-repeat center / contain;
}
.i-carbon-help {
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  background-color: currentColor;
  mask: url("https://api.iconify.design/carbon:help.svg") no-repeat center / contain;
}
</style>

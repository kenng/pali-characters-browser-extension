<template>
  <main class="w-[360px] bg-[#FAF9F6] p-6 font-sans text-[#2D3436] relative overflow-hidden">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3 cursor-default group">
        <div class="w-8 h-8 bg-[#E49B0F] rounded-xl flex items-center justify-center text-white font-serif italic text-base shadow-lg transition-transform group-hover:rotate-6">ā</div>
        <div>
          <h3 class="text-sm font-bold tracking-tight text-gray-900 leading-none">Pāli Inputs</h3>
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Zen Edition</p>
        </div>
      </div>
      
      <!-- Global Toggle -->
      <div class="flex items-center gap-2">
        <span class="text-[9px] font-bold uppercase tracking-tighter text-gray-400">Auto-run</span>
        <button 
          @click="toggleGlobal"
          class="w-8 h-4 rounded-full transition-colors relative"
          :class="isGlobalEnabled ? 'bg-[#E49B0F]' : 'bg-gray-200'"
        >
          <div 
            class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform shadow-sm"
            :class="{ 'translate-x-4': isGlobalEnabled }"
          ></div>
        </button>
      </div>
    </div>
    
    <div v-if="!showHelp" class="flex flex-col gap-3 animate-fade-in">
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
        v-if="!isGlobalEnabled"
        class="group w-full py-4 px-4 bg-[#2D3436] text-white rounded-2xl transition-all hover:bg-black flex items-center gap-4 shadow-lg shadow-black/10 active:scale-[0.98]"
        @click="activateInTab"
      >
        <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white transition-colors group-hover:bg-white/20">
          <span class="i-carbon-flash text-xl" />
        </div>
        <div class="text-left">
          <div class="text-xs font-bold uppercase tracking-widest text-white/40 mb-0.5">Quick Action</div>
          <div class="text-sm font-bold">Enable on this Page</div>
        </div>
      </button>

      <button
        class="group w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all flex items-center gap-3"
        @click="showHelp = true"
      >
        <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:text-[#E49B0F] shadow-sm transition-colors">
          <span class="i-carbon-help text-lg" />
        </div>
        <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900">Show Keyboard Shortcuts</span>
      </button>
    </div>

    <!-- Popup Keyboard Guide -->
    <div v-else class="animate-slide-up">
      <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Shortcuts</h4>
          <button 
            @click="pinToPage"
            class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-amber-100 text-amber-600 transition-colors"
            title="Pin to Page as draggable modal"
          >
            <span class="i-carbon-pin text-sm" />
          </button>
        </div>
        <button @click="showHelp = false" class="text-xs font-bold text-[#E49B0F] hover:underline">Back</button>
      </div>
      <div 
        class="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-[11px]" 
        v-html="keyboardHelpContent"
        @mousedown="handleHelpClick"
      ></div>
    </div>

    <footer class="mt-8 pt-4 border-t border-gray-100 flex justify-center">
      <p class="text-[9px] text-gray-300 font-bold uppercase tracking-tighter italic">Peace begins with the first word</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import browser from 'webextension-polyfill'
import { sendMessage } from 'webext-bridge'
import { getKeyboardMappingStr } from '~/logic/pali-keyboard-help'
import { MsgType } from '~/logic/constant'

const isGlobalEnabled = ref(true)
const showHelp = ref(false)
const keyboardHelpContent = computed(() => getKeyboardMappingStr())

onMounted(async () => {
  const res = await browser.storage.local.get('isGlobalEnabled')
  if (res.isGlobalEnabled !== undefined)
    isGlobalEnabled.value = res.isGlobalEnabled
})

async function toggleGlobal() {
  isGlobalEnabled.value = !isGlobalEnabled.value
  await browser.storage.local.set({ isGlobalEnabled: isGlobalEnabled.value })
}

async function activateInTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  if (tabs[0]?.id) {
    sendMessage('pali-action', { type: MsgType.ACTIVATE }, { context: 'content-script', tabId: tabs[0].id })
  }
}

async function pinToPage() {
  console.log('pali-ext: pinToPage clicked')
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  if (tabs[0]?.id) {
    console.log('pali-ext: sending HELP msg to tab', tabs[0].id)
    sendMessage('pali-action', { type: MsgType.HELP }, { context: 'content-script', tabId: tabs[0].id })
    window.close() // Close popup after pinning
  }
}

function handleHelpClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const btn = target.closest('[data-char]') as HTMLElement
  if (btn) {
    const char = btn.getAttribute('data-char')
    if (char) {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]?.id) {
          sendMessage('pali-action', { type: 'PK_INSERT_INTERNAL', char }, { context: 'content-script', tabId: tabs[0].id })
        }
      })
    }
  }
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

/* Icons */
.i-carbon-edit { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:edit.svg") no-repeat center / contain; }
.i-carbon-help { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:help.svg") no-repeat center / contain; }
.i-carbon-flash { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:flash.svg") no-repeat center / contain; }
.i-carbon-pin { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:pin.svg") no-repeat center / contain; }

/* Help UI Styling in Popup */
.pk-quick-bar-title {
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #9CA3AF;
  margin-top: 1rem;
}
.pk-quick-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1.5rem;
}
.pk-quick-char {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #F3F4F6;
  border-radius: 8px;
  font-family: 'Garamond', serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: #374151;
}
.pk-quick-char:hover {
  background: #E49B0F;
  color: white;
  border-color: #E49B0F;
  transform: translateY(-2px) scale(1.1);
}

.pk-help-title {
  font-weight: 900;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #D1D5DB;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}
.pk-help-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.25rem;
  border-bottom: 1px solid #F9FAFB;
  color: #111827;
  transition: background 0.2s;
  border-radius: 8px;
}
.pk-help-row:hover { background: #E49B0F08; }

.pk-help-row code {
  font-size: 8px;
  color: #9CA3AF;
  font-weight: 500;
}
.pk-help-row kbd {
  background: #F3F4F6;
  padding: 1px 4px;
  border-radius: 4px;
  color: #4B5563;
  font-size: 9px;
  font-weight: bold;
}
.pk-insert-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E49B0F10;
  color: #E49B0F;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 12px;
  transition: all 0.2s;
}
.pk-insert-btn:hover { background: #E49B0F; color: white; transform: rotate(90deg) scale(1.1); }

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

.animate-fade-in { animation: fade-in 0.4s ease-out; }
.animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>

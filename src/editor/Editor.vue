<template>
  <div class="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2D3436] font-sans selection:bg-[#E49B0F]/20 selection:text-[#2D3436] transition-colors duration-500 overflow-x-hidden">
    <!-- Sophisticated Header -->
    <nav 
      class="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between transition-all duration-500"
      :class="[isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent']"
    >
      <div class="flex items-center gap-3 group cursor-default">
        <div class="w-9 h-9 bg-[#E49B0F] rounded-xl flex items-center justify-center text-white font-serif italic text-lg shadow-lg shadow-[#E49B0F]/20 group-hover:rotate-12 transition-transform duration-500">ā</div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-gray-900 leading-none">Pāli Zen</h1>
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Focused Writing</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2 md:gap-4">
        <button 
          @click="toggleFullscreen"
          class="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#E49B0F]"
          :class="{ 'text-[#E49B0F]': isFullscreen }"
          title="Toggle Full Screen"
        >
          <span :class="isFullscreen ? 'i-carbon-minimize' : 'i-carbon-maximize'" class="text-xl" />
        </button>
        <button 
          @click="isPinned = !isPinned"
          class="hidden md:flex p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#E49B0F]"
          :class="{ 'text-[#E49B0F] bg-white shadow-sm': isPinned }"
          title="Pin Helper to Sidebar"
        >
          <span class="i-carbon-pin text-xl" :class="{ 'rotate-45': isPinned }" />
        </button>
        <button 
          @click="showHelp = !showHelp"
          class="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#E49B0F]"
          title="Keyboard Shortcuts"
        >
          <span class="i-carbon-keyboard text-xl" />
        </button>
        <button 
          @click="copyToClipboard" 
          class="flex items-center gap-2 px-6 py-2 bg-[#2D3436] text-white rounded-full hover:bg-black transition-all shadow-md active:scale-95 text-xs font-bold uppercase tracking-widest leading-none h-[40px]"
        >
          <span class="i-carbon-copy" />
          <span class="hidden md:inline">Copy All</span>
        </button>
        <button 
          @click="clearText" 
          class="p-2 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
          title="Clear everything"
        >
          <span class="i-carbon-trash-can text-xl" />
        </button>
      </div>
    </nav>

    <div class="flex flex-1 relative">
      <!-- Content Area -->
      <main 
        class="flex-1 flex flex-col items-center pt-24 pb-12 px-6 transition-all duration-500 ease-in-out"
        :class="[isPinned ? 'md:mr-[320px]' : 'w-full max-w-4xl mx-auto']"
      >
        <!-- Premium Character Toolbar -->
        <div class="w-full flex justify-center mb-12 animate-fade-in transition-all duration-700" :class="[isScrolled ? 'opacity-40 hover:opacity-100' : 'opacity-100']">
          <div class="bg-white/90 backdrop-blur-xl p-2 rounded-[28px] shadow-[0_10px_40px_rgba(228,155,15,0.08)] border border-white/50 flex flex-wrap gap-1 items-center justify-center px-4 py-2">
            <div v-for="(group, name) in charGroups" :key="name" class="flex gap-0.5 items-center px-2 py-1 border-r border-gray-100 last:border-0">
              <button
                v-for="char in group"
                :key="char"
                @mousedown.prevent
                @click="insertChar(char)"
                class="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center hover:bg-[#E49B0F]/10 hover:text-[#E49B0F] rounded-xl transition-all text-lg md:text-xl font-medium active:scale-90"
              >
                {{ char }}
              </button>
            </div>
          </div>
        </div>

        <!-- Writing Column -->
        <div class="w-full max-w-2xl flex-1 flex flex-col">
          <textarea
            ref="textareaRef"
            v-model="text"
            placeholder="Peace begins with the first word..."
            class="flex-1 w-full bg-transparent p-0 text-2xl md:text-3xl leading-[1.7] resize-none focus:outline-none font-serif text-[#2D3436] placeholder-[#E49B0F]/20 min-h-[60vh] pb-32"
            @keydown="handleKeydown"
          ></textarea>
        </div>
      </main>

      <!-- Pinned Sidebar -->
      <aside 
        v-if="isPinned"
        class="hidden md:flex fixed right-0 top-0 bottom-0 w-[320px] bg-white border-l border-gray-100 shadow-2xl z-20 flex-col pt-24 px-8 overflow-y-auto custom-scrollbar animate-slide-left"
      >
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-lg font-bold tracking-tight">Quick Reference</h2>
            <p class="text-[9px] text-[#E49B0F] font-bold uppercase tracking-[0.2em] mt-1">Personal Assistant</p>
          </div>
          <button @click="isPinned = false" class="p-1.5 rounded-full hover:bg-gray-50 text-gray-300 transition-colors">
            <span class="i-carbon-close text-lg" />
          </button>
        </div>
        <div v-html="keyboardHelpContent" @click="handleHelperClick" class="text-sm"></div>
        <div class="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-8">
          <div class="flex gap-2 text-amber-800 font-bold text-[10px] mb-1 uppercase tracking-wider">
            <span class="i-carbon-information text-xs" />
            macOS Tip
          </div>
          <p class="text-[11px] text-amber-700 leading-relaxed">
            Use <code>⌃ Ctrl + ⌥ Opt + N</code> for Pāli characters to avoid window conflicts.
          </p>
        </div>
      </aside>
    </div>

    <!-- Sophisticated Overlay Components -->
    <Transition name="fade">
      <div v-if="showHelp" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2D3436]/10 backdrop-blur-md" @click.self="showHelp = false">
        <div class="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(228,155,15,0.15)] max-w-lg w-full p-10 animate-scale-up border border-white flex flex-col h-full max-h-[85vh]">
          <div class="flex justify-between items-center mb-10">
            <div>
              <h2 class="text-2xl font-bold tracking-tight">Keyboard Guide</h2>
              <p class="text-[10px] text-[#E49B0F] font-bold uppercase tracking-[0.2em] mt-2">The Golden Rule of Efficiency</p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="isPinned = !isPinned; showHelp = false" 
                class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl text-gray-400 hover:text-[#E49B0F] transition-colors"
                title="Pin to sidebar"
              >
                <span class="i-carbon-pin text-xl" />
              </button>
              <button @click="showHelp = false" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl text-gray-400 hover:text-[#E49B0F] transition-colors">&times;</button>
            </div>
          </div>
          
          <div class="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8">
            <div v-html="keyboardHelpContent" @click="handleHelperClick"></div>
            
            <div class="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <div class="flex gap-3 text-amber-800 font-bold text-sm mb-2">
                <span class="i-carbon-information" />
                macOS Conflict Tip
              </div>
              <p class="text-xs text-amber-700 leading-relaxed">
                On macOS, <code>⌘ Cmd + N</code> usually opens a new window. To avoid this, we recommend using <strong>Full Screen mode</strong> or using <code>⌃ Ctrl + ⌥ Opt + N</code> for Pāli characters.
              </p>
            </div>
          </div>
          
          <button @click="showHelp = false" class="mt-10 w-full py-5 bg-[#E49B0F] hover:bg-[#D48B00] text-white rounded-3xl font-bold transition-all shadow-xl shadow-[#E49B0F]/20 active:scale-[0.97]">I've got it</button>
        </div>
      </div>
    </Transition>

    <!-- Copy Status Toast -->
    <Transition name="slide-up">
      <div v-if="showToast" class="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#E49B0F] text-white px-8 py-4 rounded-full shadow-2xl shadow-[#E49B0F]/30 flex items-center gap-3 font-bold text-sm animate-fade-in z-[60] border border-white/20">
        <span class="i-carbon-checkmark" />
        Copied to clipboard
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { onKeyDown } from '~/logic/pali-keyboard'
import { getKeyboardMappingStr } from '~/logic/pali-keyboard-help'

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const showHelp = ref(false)
const showToast = ref(false)
const isScrolled = ref(false)
const isFullscreen = ref(false)
const isPinned = ref(false)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`)
    })
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false
      })
    }
  }
}

// Track full screen changes (e.g. if user presses Esc)
if (typeof document !== 'undefined') {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
}

const keyboardHelpContent = computed(() => getKeyboardMappingStr())

const charGroups = {
  vowels: ['ā', 'ī', 'ū', 'Ā', 'Ī', 'Ū'],
  nasals: ['ñ', 'ṅ', 'ṇ', 'ṁ', 'ṃ', 'Ñ', 'Ṅ', 'Ṇ', 'Ṁ', 'Ṃ'],
  retroflex: ['ḍ', 'ḷ', 'ṭ', 'Ḍ', 'Ḷ', 'Ṭ'],
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function insertChar(char: string) {
  const el = textareaRef.value
  if (!el) return
  
  const start = el.selectionStart
  const end = el.selectionEnd
  const content = text.value
  
  // Robust insertion using selection indices
  text.value = content.substring(0, start) + char + content.substring(end)
  
  // Maintain focus and update caret position
  setTimeout(() => {
    el.focus()
    const nextPos = start + char.length
    el.setSelectionRange(nextPos, nextPos)
  }, 0)
}

function handleKeydown(event: KeyboardEvent) {
  const char = onKeyDown(event)
  if (char) {
    insertChar(char)
  }
}

function handleHelperClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const btn = target.closest('.pk-insert-btn') as HTMLElement
  if (btn && btn.dataset.char) {
    insertChar(btn.dataset.char)
  }
}

function copyToClipboard() {
  if (!text.value) return
  navigator.clipboard.writeText(text.value)
    .then(() => {
      showToast.value = true
      setTimeout(() => showToast.value = false, 2000)
    })
}

function clearText() {
  if (text.value && confirm('Clear all text?')) {
    text.value = ''
    textareaRef.value?.focus()
  }
}

onMounted(() => {
  textareaRef.value?.focus()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* Reset & Modern Base */
html, body {
  margin: 0;
  padding: 0;
  background-color: #FAF9F6;
  overscroll-behavior-y: none;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translate(-50%, 100%); opacity: 0; }

@keyframes slide-left {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-left {
  animation: slide-left 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }

/* Typography */
.font-sans { font-family: 'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, sans-serif; }
.font-serif { font-family: 'Garamond', 'Georgia', serif; }

/* Help UI Styling */
.pk-help-title {
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9CA3AF;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.pk-help-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #F3F4F6;
  font-size: 0.95rem;
  color: #111827;
}
.pk-help-row code {
  font-size: 0.7rem;
  color: #6B7280;
}
.pk-help-row kbd {
  background: #F3F4F6;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: inherit;
  color: #374151;
  font-weight: 600;
}

.pk-insert-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #E49B0F10;
  color: #E49B0F;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid transparent;
}
.pk-insert-btn:hover {
  background: #E49B0F;
  color: white;
  transform: scale(1.15) rotate(90deg);
  border-color: #E49B0F;
  box-shadow: 0 4px 12px rgba(228, 155, 15, 0.2);
}
.pk-insert-btn:active {
  transform: scale(0.95);
}

/* Icons */
.i-carbon-keyboard { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:keyboard.svg") no-repeat center / contain; }
.i-carbon-copy { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:copy.svg") no-repeat center / contain; }
.i-carbon-trash-can { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:trash-can.svg") no-repeat center / contain; }
.i-carbon-checkmark { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:checkmark.svg") no-repeat center / contain; }
.i-carbon-edit { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:edit.svg") no-repeat center / contain; }
.i-carbon-help { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:help.svg") no-repeat center / contain; }
.i-carbon-maximize { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:maximize.svg") no-repeat center / contain; }
.i-carbon-minimize { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:minimize.svg") no-repeat center / contain; }
.i-carbon-information { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:information.svg") no-repeat center / contain; }
.i-carbon-pin { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:pin.svg") no-repeat center / contain; }
.i-carbon-close { display: inline-block; width: 1.25em; height: 1.25em; background-color: currentColor; mask: url("https://api.iconify.design/carbon:close.svg") no-repeat center / contain; }

@media (max-width: 768px) {
  textarea { line-height: 2 !important; }
}
</style>

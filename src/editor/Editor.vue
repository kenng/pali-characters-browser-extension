<template>
  <div
    class="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2D3436] font-sans transition-colors duration-500 overflow-x-hidden"
  >
    <!-- Sophisticated Header -->
    <nav
      class="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between transition-all duration-500"
      :class="[isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent']"
    >
      <div class="flex items-center gap-3 group cursor-default">
        <div
          class="w-9 h-9 bg-[#E49B0F] rounded-xl flex items-center justify-center text-white font-serif italic text-lg shadow-lg shadow-[#E49B0F]/20 group-hover:rotate-12 transition-transform duration-500"
        >
          ā
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-gray-900 leading-none">
            Pāli Zen
          </h1>
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
            Focused Writing
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <div
          class="flex items-center gap-1 mr-1"
          title="Editor font size"
        >
          <button
            class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#E49B0F] hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
            :disabled="fontSize <= FONT_SIZE_MIN"
            aria-label="Decrease font size"
            @click="adjustFontSize(-2)"
          >
            <span class="text-sm font-bold leading-none">−</span>
          </button>
          <span class="text-[10px] font-bold text-gray-500 tabular-nums min-w-[2.25rem] text-center">{{ fontSize }}px</span>
          <button
            class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#E49B0F] hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
            :disabled="fontSize >= FONT_SIZE_MAX"
            aria-label="Increase font size"
            @click="adjustFontSize(2)"
          >
            <span class="text-sm font-bold leading-none">+</span>
          </button>
        </div>
        <div
          class="flex items-center gap-2 mr-1"
          title="Save editor text to local storage and restore it next time"
        >
          <span class="text-[9px] font-bold uppercase tracking-tighter text-gray-400">Save draft</span>
          <button
            class="w-8 h-4 rounded-full transition-colors relative"
            :class="saveDraftEnabled ? 'bg-[#E49B0F]' : 'bg-gray-200'"
            :aria-pressed="saveDraftEnabled"
            aria-label="Toggle save draft"
            @click="saveDraftEnabled = !saveDraftEnabled"
          >
            <div
              class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform"
              :class="{ 'translate-x-4': saveDraftEnabled }"
            ></div>
          </button>
        </div>
        <div
          class="flex items-center gap-2 mr-1"
          title="ITRANS in this editor only (does not change the extension-wide setting)"
        >
          <span class="text-[9px] font-bold uppercase tracking-tighter text-gray-400 hidden sm:inline">ITRANS</span>
          <button
            class="w-8 h-4 rounded-full transition-colors relative"
            :class="isItransEnabled ? 'bg-[#E49B0F]' : 'bg-gray-200'"
            :aria-pressed="isItransEnabled"
            aria-label="Toggle ITRANS in this editor"
            @click="toggleItrans"
          >
            <div
              class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform"
              :class="{ 'translate-x-4': isItransEnabled }"
            ></div>
          </button>
        </div>
        <button
          class="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#E49B0F]"
          :class="{ 'text-[#E49B0F]': isFullscreen }"
          title="Toggle Full Screen"
          @click="toggleFullscreen"
        >
          <carbon-minimize v-if="isFullscreen" class="text-xl" />
          <carbon-maximize v-else class="text-xl" />
        </button>
        <button
          class="hidden md:flex p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#E49B0F]"
          :class="{ 'text-[#E49B0F] bg-white shadow-sm': isPinned }"
          title="Pin Helper to Sidebar"
          @click="isPinned = !isPinned"
        >
          <carbon-pin class="text-xl" :class="{ 'rotate-45': isPinned }" />
        </button>
        <button
          class="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#E49B0F]"
          title="Keyboard Shortcuts"
          @click="showHelp = !showHelp"
        >
          <carbon-keyboard class="text-xl" />
        </button>
        <button
          class="flex items-center gap-2 px-6 py-2 bg-[#2D3436] text-white rounded-full hover:bg-black transition-all shadow-md active:scale-95 text-xs font-bold uppercase tracking-widest leading-none h-[40px]"
          @click="copyToClipboard"
        >
          <carbon-copy />
          <span class="hidden md:inline">Copy All</span>
        </button>
        <button
          class="p-2 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
          title="Clear everything"
          @click="clearText"
        >
          <carbon-trash-can class="text-xl" />
        </button>
      </div>
    </nav>

    <!-- Page tabs -->
    <div
      class="fixed top-[72px] left-0 right-0 z-30 px-6 pt-1 pb-2 transition-all duration-500"
      :class="[isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent', isPinned ? 'md:pr-[332px]' : '']"
    >
      <div class="flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-4xl mx-auto">
        <div
          v-for="page in pages"
          :key="page.id"
          class="group relative flex items-center shrink-0"
        >
          <button
            v-if="renamingPageId !== page.id"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all max-w-[10rem] truncate"
            :class="page.id === activePageId
              ? 'bg-[#E49B0F]/15 text-[#E49B0F]'
              : 'text-gray-400 hover:text-gray-600 hover:bg-white/70'"
            :title="page.name"
            @click="switchPage(page.id)"
            @dblclick.stop="startRename(page)"
          >
            {{ page.name }}
          </button>
          <input
            v-else
            :ref="(el) => setRenameInputRef(el, page.id)"
            v-model="renameDraft"
            class="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide bg-white border border-[#E49B0F]/40 text-gray-800 outline-none shadow-sm w-28 max-w-[10rem]"
            maxlength="40"
            @keydown.enter.prevent="commitRename"
            @keydown.escape.prevent="cancelRename"
            @blur="commitRename"
            @click.stop
          >
          <button
            v-if="pages.length > 1 && renamingPageId !== page.id"
            class="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-white border border-gray-100 text-gray-300 hover:text-red-400 hover:border-red-100 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm"
            title="Delete page"
            @click.stop="deletePage(page.id)"
          >
            <span class="text-[10px] leading-none">&times;</span>
          </button>
        </div>
        <button
          class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-[#E49B0F] hover:bg-[#E49B0F]/10 transition-all"
          title="New page"
          @click="addPage"
        >
          <carbon-add class="text-lg" />
        </button>
      </div>
    </div>

    <div class="flex flex-1 relative">
      <!-- Content Area -->
      <main
        class="flex-1 flex flex-col items-center pt-32 pb-12 px-6 transition-all duration-500 ease-in-out"
        :class="[isPinned ? 'md:mr-[320px]' : 'w-full max-w-4xl mx-auto']"
      >
        <!-- Premium Character Toolbar -->
        <div
          class="w-full flex justify-center mb-12 animate-fade-in transition-all duration-700"
          :class="[isScrolled ? 'opacity-40 hover:opacity-100' : 'opacity-100']"
        >
          <div
            class="bg-white/90 backdrop-blur-xl p-2 rounded-[28px] shadow-[0_10px_40px_rgba(228,155,15,0.08)] border border-white/50 flex flex-wrap gap-1 items-center justify-center px-4 py-2"
          >
            <div
              v-for="(group, name) in charGroups"
              :key="name"
              class="flex gap-0.5 items-center px-2 py-1 border-r border-gray-100 last:border-0"
            >
              <button
                v-for="char in group"
                :key="char"
                class="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center hover:bg-[#E49B0F]/10 hover:text-[#E49B0F] rounded-xl transition-all text-lg md:text-xl font-medium active:scale-90"
                @mousedown.prevent
                @click="insertChar(char)"
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
            class="flex-1 w-full bg-transparent p-0 leading-[1.7] resize-none focus:outline-none font-serif text-[#2D3436] placeholder-[#E49B0F]/20 min-h-[60vh] pb-32"
            :style="{ fontSize: `${fontSize}px` }"
            @keydown="handleKeydown"
          ></textarea>
        </div>
      </main>

      <!-- Pinned Sidebar -->
      <aside
        v-if="isPinned"
        class="hidden md:flex fixed right-0 top-0 bottom-0 w-[320px] bg-white border-l border-gray-100 shadow-2xl z-20 flex-col pt-32 px-8 overflow-y-auto custom-scrollbar animate-slide-left"
      >
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-lg font-bold tracking-tight">
              Quick Reference
            </h2>
            <p class="text-[9px] text-[#E49B0F] font-bold uppercase tracking-[0.2em] mt-1">
              Personal Assistant
            </p>
          </div>
          <button class="p-1.5 rounded-full hover:bg-gray-50 text-gray-300 transition-colors" @click="isPinned = false">
            <carbon-close class="text-lg" />
          </button>
        </div>
        <div class="text-sm" @click="handleHelperClick" v-html="keyboardHelpContent"></div>
        <div class="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-8">
          <div class="flex gap-2 text-amber-800 font-bold text-[10px] mb-1 uppercase tracking-wider">
            <carbon-information class="text-xs" />
            macOS Tip
          </div>
          <p class="text-[11px] text-amber-700 leading-relaxed">
            <code>⌘ Cmd + N</code> opens a new window — use <code>⌃ Ctrl + ⌘ Cmd + ⌥ Opt + N</code> for
            <strong>ñ</strong> instead.
          </p>
        </div>
      </aside>
    </div>

    <!-- Sophisticated Overlay Components -->
    <Transition name="fade">
      <div
        v-if="showHelp"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2D3436]/10 backdrop-blur-md"
        @click.self="showHelp = false"
      >
        <div
          class="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(228,155,15,0.15)] max-w-lg w-full p-10 animate-scale-up border border-white flex flex-col h-full max-h-[85vh]"
        >
          <div class="flex justify-between items-center mb-10">
            <div>
              <h2 class="text-2xl font-bold tracking-tight">
                Keyboard Guide
              </h2>
              <p class="text-[10px] text-[#E49B0F] font-bold uppercase tracking-[0.2em] mt-2">
                The Golden Rule of
                Efficiency
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl text-gray-400 hover:text-[#E49B0F] transition-colors"
                title="Pin to sidebar"
                @click="isPinned = !isPinned; showHelp = false"
              >
                <carbon-pin class="text-xl" />
              </button>
              <button
                class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl text-gray-400 hover:text-[#E49B0F] transition-colors"
                @click="showHelp = false"
              >
                &times;
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8">
            <div @click="handleHelperClick" v-html="keyboardHelpContent"></div>

            <div class="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <div class="flex gap-3 text-amber-800 font-bold text-sm mb-2">
                <carbon-information />
                macOS Conflict Tip
              </div>
              <p class="text-xs text-amber-700 leading-relaxed">
                On macOS, <code>⌘ Cmd + N</code> opens a new window. For <strong>ñ</strong>, use
                <code>⌃ Ctrl + ⌘ Cmd + ⌥ Opt + N</code> (or Full Screen to reduce other conflicts).
              </p>
            </div>
          </div>

          <button
            class="mt-10 w-full py-5 bg-[#E49B0F] hover:bg-[#D48B00] text-white rounded-3xl font-bold transition-all shadow-xl shadow-[#E49B0F]/20 active:scale-[0.97]"
            @click="showHelp = false"
          >
            I've
            got it
          </button>
        </div>
      </div>
    </Transition>

    <!-- Copy Status Toast -->
    <Transition name="slide-up">
      <div
        v-if="showToast"
        class="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#E49B0F] text-white px-8 py-4 rounded-full shadow-2xl shadow-[#E49B0F]/30 flex items-center gap-3 font-bold text-sm animate-fade-in z-[60] border border-white/20"
      >
        <carbon-checkmark />
        Copied to clipboard
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { onItransKeyDown, resetItransBuffer } from '~/logic/itrans'
import { onKeyDown } from '~/logic/pali-keyboard'
import { getKeyboardMappingStr } from '~/logic/pali-keyboard-help'
import { armOsInsertSuppress, installOsInsertSuppress } from '~/logic/os-insert-suppress'
import { getZenLocalStorage } from '~/logic/zen-storage'

const DRAFT_STORAGE_KEY = 'zenEditorDraft'
const PAGES_STORAGE_KEY = 'zenEditorPages'
const SAVE_DRAFT_PREF_KEY = 'zenEditorSaveDraft'
const FONT_SIZE_STORAGE_KEY = 'zenEditorFontSize'
const FONT_SIZE_DEFAULT = 16
const FONT_SIZE_MIN = 12
const FONT_SIZE_MAX = 40

interface ZenPage {
  id: string
  name: string
  content: string
}

interface ZenPagesState {
  pages: ZenPage[]
  activePageId: string
}

function createPageId() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function createPage(name: string, content = ''): ZenPage {
  return { id: createPageId(), name, content }
}

function defaultPagesState(): ZenPagesState {
  const page = createPage('Page 1')
  return { pages: [page], activePageId: page.id }
}

const pages = ref<ZenPage[]>(defaultPagesState().pages)
const activePageId = ref(pages.value[0].id)
const draftReady = ref(false)
/** Persist editor text across sessions. Defaults on. */
const saveDraftEnabled = ref(true)
/** Writing area font size in px. Defaults to 16. */
const fontSize = ref(FONT_SIZE_DEFAULT)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const showHelp = ref(false)
const showToast = ref(false)
const isScrolled = ref(false)
const isFullscreen = ref(false)
const isPinned = ref(false)
/** Editor-only ITRANS preference; independent of popup `isItransEnabled`. Defaults on. */
const isItransEnabled = ref(true)

const renamingPageId = ref<string | null>(null)
const renameDraft = ref('')
const renameInputEls = new Map<string, HTMLInputElement>()

const activePage = computed(() =>
  pages.value.find(p => p.id === activePageId.value) ?? pages.value[0],
)

const text = computed({
  get: () => activePage.value?.content ?? '',
  set: (value: string) => {
    const page = pages.value.find(p => p.id === activePageId.value)
    if (page)
      page.content = value
  },
})

function pagesState(): ZenPagesState {
  return {
    pages: pages.value.map(p => ({ ...p })),
    activePageId: activePageId.value,
  }
}

const persistPages = useDebounceFn(async() => {
  if (!saveDraftEnabled.value)
    return
  const storage = await getZenLocalStorage()
  await storage.set({ [PAGES_STORAGE_KEY]: pagesState() })
  await storage.remove(DRAFT_STORAGE_KEY)
}, 300)

watch([pages, activePageId], () => {
  if (!draftReady.value || !saveDraftEnabled.value)
    return
  persistPages()
}, { deep: true })

watch(saveDraftEnabled, async(enabled) => {
  if (!draftReady.value)
    return
  const storage = await getZenLocalStorage()
  await storage.set({ [SAVE_DRAFT_PREF_KEY]: enabled })
  if (enabled)
    await storage.set({ [PAGES_STORAGE_KEY]: pagesState() })
  else
    await storage.remove([PAGES_STORAGE_KEY, DRAFT_STORAGE_KEY])
})

watch(fontSize, async(size) => {
  if (!draftReady.value)
    return
  const storage = await getZenLocalStorage()
  await storage.set({ [FONT_SIZE_STORAGE_KEY]: size })
})

function clampFontSize(size: number) {
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, size))
}

function adjustFontSize(delta: number) {
  fontSize.value = clampFontSize(fontSize.value + delta)
}

function setRenameInputRef(el: unknown, pageId: string) {
  if (el instanceof HTMLInputElement)
    renameInputEls.set(pageId, el)
  else
    renameInputEls.delete(pageId)
}

function switchPage(pageId: string) {
  if (pageId === activePageId.value || renamingPageId.value)
    return
  activePageId.value = pageId
  nextTick(() => textareaRef.value?.focus())
}

function addPage() {
  const n = pages.value.length + 1
  const page = createPage(`Page ${n}`)
  pages.value.push(page)
  activePageId.value = page.id
  nextTick(() => {
    textareaRef.value?.focus()
    startRename(page)
  })
}

function deletePage(pageId: string) {
  if (pages.value.length <= 1)
    return
  const page = pages.value.find(p => p.id === pageId)
  if (!page)
    return
  if (page.content.trim() && !confirm(`Delete “${page.name}”?`))
    return
  const idx = pages.value.findIndex(p => p.id === pageId)
  pages.value.splice(idx, 1)
  if (activePageId.value === pageId)
    activePageId.value = pages.value[Math.max(0, idx - 1)].id
  if (renamingPageId.value === pageId)
    cancelRename()
}

function startRename(page: ZenPage) {
  renamingPageId.value = page.id
  renameDraft.value = page.name
  nextTick(() => {
    const input = renameInputEls.get(page.id)
    if (!input)
      return
    input.focus()
    input.select()
  })
}

function commitRename() {
  const id = renamingPageId.value
  if (!id)
    return
  const page = pages.value.find(p => p.id === id)
  const name = renameDraft.value.trim() || page?.name || 'Untitled'
  if (page)
    page.name = name.slice(0, 40)
  renamingPageId.value = null
}

function cancelRename() {
  renamingPageId.value = null
}

function hydrateFromStorage(rawPages: unknown, legacyDraft: unknown) {
  if (rawPages && typeof rawPages === 'object' && Array.isArray((rawPages as ZenPagesState).pages)) {
    const state = rawPages as ZenPagesState
    const cleaned = state.pages
      .filter(p => p && typeof p.id === 'string' && typeof p.name === 'string')
      .map(p => ({
        id: p.id,
        name: p.name || 'Untitled',
        content: typeof p.content === 'string' ? p.content : '',
      }))
    if (cleaned.length) {
      pages.value = cleaned
      activePageId.value = cleaned.some(p => p.id === state.activePageId)
        ? state.activePageId
        : cleaned[0].id
      return
    }
  }

  // Migrate legacy single-string draft into Page 1
  if (typeof legacyDraft === 'string' && legacyDraft) {
    const fallback = defaultPagesState()
    fallback.pages[0].content = legacyDraft
    pages.value = fallback.pages
    activePageId.value = fallback.activePageId
  }
}

function toggleItrans() {
  isItransEnabled.value = !isItransEnabled.value
  if (!isItransEnabled.value)
    resetItransBuffer()
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch((err) => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`)
    })
  }
  else {
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

function insertChar(char: string, backspace = 0) {
  const el = textareaRef.value
  if (!el) return

  const start = el.selectionStart
  const end = el.selectionEnd
  const content = text.value
  const replaceFrom = Math.max(0, start - backspace)

  // Robust insertion using selection indices
  text.value = content.substring(0, replaceFrom) + char + content.substring(end)

  // Maintain focus and update caret position
  setTimeout(() => {
    el.focus()
    const nextPos = replaceFrom + char.length
    el.setSelectionRange(nextPos, nextPos)
  }, 0)
}

function handleKeydown(event: KeyboardEvent) {
  const char = onKeyDown(event)
  if (char) {
    resetItransBuffer()
    insertChar(char)
    armOsInsertSuppress()
    return
  }

  if (!isItransEnabled.value)
    return

  const commit = onItransKeyDown(event)
  if (commit)
    insertChar(commit.char, commit.backspace)
}

function handleHelperClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const btn = target.closest('.pk-insert-btn') as HTMLElement
  if (btn && btn.dataset.char)
    insertChar(btn.dataset.char)
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
  if (text.value && confirm('Clear all text on this page?')) {
    text.value = ''
    textareaRef.value?.focus()
  }
}

onMounted(async() => {
  installOsInsertSuppress(document)
  const storage = await getZenLocalStorage()
  const res = await storage.get([
    DRAFT_STORAGE_KEY,
    PAGES_STORAGE_KEY,
    SAVE_DRAFT_PREF_KEY,
    FONT_SIZE_STORAGE_KEY,
  ])
  if (typeof res[SAVE_DRAFT_PREF_KEY] === 'boolean')
    saveDraftEnabled.value = res[SAVE_DRAFT_PREF_KEY]
  if (typeof res[FONT_SIZE_STORAGE_KEY] === 'number')
    fontSize.value = clampFontSize(res[FONT_SIZE_STORAGE_KEY])
  // Only restore if saving is on and the user hasn't already started typing while storage loads.
  if (saveDraftEnabled.value && !text.value)
    hydrateFromStorage(res[PAGES_STORAGE_KEY], res[DRAFT_STORAGE_KEY])
  draftReady.value = true
  textareaRef.value?.focus()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (draftReady.value && saveDraftEnabled.value) {
    getZenLocalStorage().then(storage =>
      storage.set({ [PAGES_STORAGE_KEY]: pagesState() }),
    )
  }
})
</script>

<style>
/* Reset & Modern Base */
html,
body {
  margin: 0;
  padding: 0;
  background-color: #FAF9F6;
  overscroll-behavior-y: none;
}

/*
  Windi `selection:text-*` without a matching `selection:bg-*` makes Blink/WebKit
  paint a transparent selection highlight — looks like select is broken.
  Keep both color and background here (arbitrary opacity utilities are unreliable).
*/
textarea::selection,
::selection {
  background-color: rgba(228, 155, 15, 0.35);
  color: #2D3436;
}

textarea::-moz-selection,
::-moz-selection {
  background-color: rgba(228, 155, 15, 0.35);
  color: #2D3436;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}

@keyframes slide-left {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-left {
  animation: slide-left 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}

/* Typography */
.font-sans {
  font-family: 'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, sans-serif;
}

.font-serif {
  font-family: 'Garamond', 'Georgia', serif;
}

/* Help UI Styling */
.pk-help-title {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #D1D5DB;
  margin: 32px 0 12px 4px;
}

.pk-help-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 8px;
  border-bottom: 1px solid #F9FAFB;
  border-radius: 12px;
  transition: background 0.2s;
}

.pk-help-row:hover {
  background: #E49B0F05;
}

.pk-help-char {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.pk-help-glyph {
  font-family: Garamond, Georgia, serif;
  font-size: 1.125rem;
  color: #1F2937;
}

.pk-help-keys {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.pk-help-keys code {
  display: block;
  max-width: 100%;
  font-size: 11px;
  color: #9CA3AF;
  font-weight: 500;
  line-height: 1.7;
  white-space: normal;
}

.pk-help-keys-secondary {
  margin-top: 2px;
  font-size: 8px !important;
  opacity: 0.4;
}

.pk-help-row kbd {
  display: inline-block;
  background: #F3F4F6;
  padding: 2px 6px;
  border-radius: 6px;
  font-family: inherit;
  color: #4B5563;
  font-weight: 700;
  font-size: 11px;
  white-space: nowrap;
}

.pk-help-row .opacity-40 {
  opacity: 0.4;
}

.pk-quick-bar-title {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #E49B0F;
  margin-top: 1rem;
}

.pk-quick-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pk-quick-char {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #F3F4F6;
  border-radius: 12px;
  font-family: Garamond, Georgia, serif;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: #374151;
}

.pk-quick-char:hover {
  background: #E49B0F;
  color: white;
  border-color: #E49B0F;
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 4px 15px rgba(228, 155, 15, 0.25);
}

.pk-insert-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #E49B0F10;
  color: #E49B0F;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid transparent;
  cursor: pointer;
}

.pk-insert-btn:hover {
  background: #E49B0F;
  color: white;
  transform: scale(1.15) rotate(90deg);
  border-color: #E49B0F;
}

@media (max-width: 768px) {
  textarea {
    line-height: 2 !important;
  }
}
</style>

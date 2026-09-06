import { afterEach, describe, expect, it } from 'vitest'
import { getKeyboardMappingStr, getQuickCharBar, isMac } from './pali-keyboard-help'
import { overdot, tilde, underdot } from './pali-keyboard'

const originalNavigator = globalThis.navigator

function mockNavigator(platform: 'Mac' | 'Win') {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    writable: true,
    value: {
      userAgent: platform === 'Mac' ? 'Mozilla/5.0 (Macintosh)' : 'Mozilla/5.0 (Windows NT 10.0)',
      platform: platform === 'Mac' ? 'MacIntel' : 'Win32',
    },
  })
}

describe('pali-keyboard-help', () => {
  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      writable: true,
      value: originalNavigator,
    })
  })

  describe('isMac', () => {
    it('detects Mac user agents', () => {
      mockNavigator('Mac')
      expect(isMac()).toBe(true)
    })

    it('returns false on Windows', () => {
      mockNavigator('Win')
      expect(isMac()).toBe(false)
    })
  })

  describe('getQuickCharBar', () => {
    it('includes each unique mapped character as an insert button', () => {
      const html = getQuickCharBar()
      const chars = [...new Set([
        ...Object.values(tilde),
        ...Object.values(underdot),
        ...Object.values(overdot),
      ])]

      for (const char of chars)
        expect(html).toContain(`data-char="${char}"`)

      expect(html).toContain('Quick Insert')
    })
  })

  describe('getKeyboardMappingStr', () => {
    it('renders the three character sections', () => {
      mockNavigator('Win')

      const html = getKeyboardMappingStr()
      expect(html).toContain('Tilde characters')
      expect(html).toContain('Underdot characters')
      expect(html).toContain('Overdot characters')
      expect(html).toContain('ā')
      expect(html).toContain('ḍ')
      expect(html).toContain('ṁ')
    })

    it('shows Mac-oriented modifiers on Mac', () => {
      mockNavigator('Mac')

      const html = getKeyboardMappingStr()
      expect(html).toContain('⌘ Cmd')
      expect(html).toContain('⌥ Opt')
    })
  })
})

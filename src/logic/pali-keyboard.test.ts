import { afterEach, describe, expect, it, vi } from 'vitest'
import { onKeyDown, universalCodes } from './pali-keyboard'

function keyEvent(partial: {
  code: string
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
}) {
  return new KeyboardEvent('keydown', {
    code: partial.code,
    ctrlKey: partial.ctrlKey ?? false,
    altKey: partial.altKey ?? false,
    metaKey: partial.metaKey ?? false,
    shiftKey: partial.shiftKey ?? false,
    bubbles: true,
    cancelable: true,
  })
}

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

describe('onKeyDown', () => {
  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      writable: true,
      value: originalNavigator,
    })
  })

  describe('Ctrl+Alt universal mapping', () => {
    it.each(Object.entries(universalCodes))(
      'maps Ctrl+Alt+%s to %s',
      (code, char) => {
        mockNavigator('Win')
        const event = keyEvent({ code, ctrlKey: true, altKey: true })
        const preventDefault = vi.spyOn(event, 'preventDefault')

        expect(onKeyDown(event)).toBe(char)
        expect(preventDefault).toHaveBeenCalled()
      },
    )

    it('returns uppercase when Shift is held', () => {
      mockNavigator('Win')
      const event = keyEvent({
        code: 'KeyA',
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
      })

      expect(onKeyDown(event)).toBe('Ā')
    })
  })

  describe('Alt underdot mapping', () => {
    it.each([
      ['KeyD', 'ḍ'],
      ['KeyL', 'ḷ'],
      ['KeyM', 'ṃ'],
      ['KeyG', 'ŋ'],
      ['KeyN', 'ṇ'],
      ['KeyT', 'ṭ'],
    ] as const)('maps Alt+%s to %s', (code, char) => {
      mockNavigator('Win')
      expect(onKeyDown(keyEvent({ code, altKey: true }))).toBe(char)
    })

    it('does not map Alt when Ctrl is also held without a universal match', () => {
      mockNavigator('Win')
      expect(onKeyDown(keyEvent({ code: 'KeyZ', ctrlKey: true, altKey: true }))).toBeUndefined()
    })
  })

  describe('Ctrl overdot mapping', () => {
    it.each([
      ['KeyM', 'ṁ'],
      ['KeyN', 'ṅ'],
      ['Comma', 'ṅ'],
    ] as const)('maps Ctrl+%s to %s', (code, char) => {
      mockNavigator('Win')
      expect(onKeyDown(keyEvent({ code, ctrlKey: true }))).toBe(char)
    })
  })

  describe('Mac shortcuts', () => {
    it('maps Cmd+Alt+A to ā (tilde)', () => {
      mockNavigator('Mac')
      expect(
        onKeyDown(keyEvent({ code: 'KeyA', metaKey: true, altKey: true })),
      ).toBe('ā')
    })

    it('skips Cmd+M overdot because KeyM conflicts with system shortcuts', () => {
      mockNavigator('Mac')
      expect(onKeyDown(keyEvent({ code: 'KeyM', metaKey: true }))).toBeUndefined()
    })

    it('still maps Ctrl+M to ṁ on Mac', () => {
      mockNavigator('Mac')
      expect(onKeyDown(keyEvent({ code: 'KeyM', ctrlKey: true }))).toBe('ṁ')
    })

    it('skips Cmd+Alt for conflicting KeyN', () => {
      mockNavigator('Mac')
      expect(
        onKeyDown(keyEvent({ code: 'KeyN', metaKey: true, altKey: true })),
      ).toBeUndefined()
    })

    it('maps Alt+D underdot on Mac', () => {
      mockNavigator('Mac')
      expect(onKeyDown(keyEvent({ code: 'KeyD', altKey: true }))).toBe('ḍ')
    })
  })

  describe('non-matches', () => {
    it('returns undefined for plain letter keys', () => {
      mockNavigator('Win')
      expect(onKeyDown(keyEvent({ code: 'KeyA' }))).toBeUndefined()
    })

    it('returns undefined for unmapped Ctrl+Alt combinations', () => {
      mockNavigator('Win')
      expect(
        onKeyDown(keyEvent({ code: 'KeyZ', ctrlKey: true, altKey: true })),
      ).toBeUndefined()
    })
  })
})

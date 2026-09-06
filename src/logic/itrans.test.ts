import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getItransBuffer,
  itransHelpRows,
  itransMap,
  onItransKeyDown,
  resetItransBuffer,
} from './itrans'

function keyEvent(key: string, partial: {
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
} = {}) {
  return new KeyboardEvent('keydown', {
    key,
    ctrlKey: partial.ctrlKey ?? false,
    altKey: partial.altKey ?? false,
    metaKey: partial.metaKey ?? false,
    bubbles: true,
    cancelable: true,
  })
}

describe('itrans', () => {
  afterEach(() => {
    resetItransBuffer()
  })

  describe('itransMap', () => {
    it('maps common pāli sequences', () => {
      expect(itransMap.aa).toBe('ā')
      expect(itransMap.AA).toBe('Ā')
      expect(itransMap['~n']).toBe('ñ')
      expect(itransMap[';n']).toBe('ṅ')
      expect(itransMap['.m']).toBe('ṃ')
      expect(itransMap[';m']).toBe('ṁ')
      expect(itransMap['.g']).toBe('ŋ')
    })

    it('does not map .M to ṁ', () => {
      expect(itransMap['.M']).toBe('Ṃ')
      expect(itransMap['.M']).not.toBe('ṁ')
    })

    it('exposes one help row per lowercase sequence', () => {
      expect(itransHelpRows).toHaveLength(12)
      expect(itransHelpRows.map(r => r.seq)).toContain(';m')
      expect(itransHelpRows.map(r => r.seq)).not.toContain('.M')
    })
  })

  describe('onItransKeyDown', () => {
    it('commits aa → ā and backspaces the pending prefix', () => {
      const first = keyEvent('a')
      expect(onItransKeyDown(first)).toBeUndefined()
      expect(getItransBuffer()).toBe('a')

      const second = keyEvent('a')
      const preventDefault = vi.spyOn(second, 'preventDefault')
      expect(onItransKeyDown(second)).toEqual({ char: 'ā', backspace: 1 })
      expect(preventDefault).toHaveBeenCalled()
      expect(getItransBuffer()).toBe('')
    })

    it('does not treat la as ā (only aa)', () => {
      expect(itransMap.la).toBeUndefined()
      expect(onItransKeyDown(keyEvent('l'))).toBeUndefined()
      expect(getItransBuffer()).toBe('')
      expect(onItransKeyDown(keyEvent('a'))).toBeUndefined()
      // 'a' alone is a pending prefix of aa, not a commit
      expect(getItransBuffer()).toBe('a')
    })

    it('commits ;n → ṅ and ;m → ṁ', () => {
      onItransKeyDown(keyEvent(';'))
      expect(onItransKeyDown(keyEvent('n'))).toEqual({ char: 'ṅ', backspace: 1 })

      onItransKeyDown(keyEvent(';'))
      expect(onItransKeyDown(keyEvent('m'))).toEqual({ char: 'ṁ', backspace: 1 })
    })

    it('commits .g → ŋ and .m → ṃ', () => {
      onItransKeyDown(keyEvent('.'))
      expect(onItransKeyDown(keyEvent('g'))).toEqual({ char: 'ŋ', backspace: 1 })

      onItransKeyDown(keyEvent('.'))
      expect(onItransKeyDown(keyEvent('m'))).toEqual({ char: 'ṃ', backspace: 1 })
    })

    it('commits uppercase AA → Ā', () => {
      onItransKeyDown(keyEvent('A'))
      expect(onItransKeyDown(keyEvent('A'))).toEqual({ char: 'Ā', backspace: 1 })
    })

    it('clears buffer on Escape and modifiers', () => {
      onItransKeyDown(keyEvent('a'))
      expect(getItransBuffer()).toBe('a')
      onItransKeyDown(keyEvent('Escape'))
      expect(getItransBuffer()).toBe('')

      onItransKeyDown(keyEvent('a'))
      onItransKeyDown(keyEvent('a', { ctrlKey: true }))
      expect(getItransBuffer()).toBe('')
    })

    it('shrinks buffer on Backspace', () => {
      onItransKeyDown(keyEvent('a'))
      onItransKeyDown(keyEvent('Backspace'))
      expect(getItransBuffer()).toBe('')
    })

    it('resets when sequence cannot continue, then starts a new prefix', () => {
      onItransKeyDown(keyEvent('a'))
      expect(onItransKeyDown(keyEvent('x'))).toBeUndefined()
      expect(getItransBuffer()).toBe('')

      onItransKeyDown(keyEvent('.'))
      expect(getItransBuffer()).toBe('.')
    })
  })
})

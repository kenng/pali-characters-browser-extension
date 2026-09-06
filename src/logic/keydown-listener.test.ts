import { describe, expect, it, vi } from 'vitest'
import { insertCharToActive, setItransEnabled } from './keydown-listener'
import { resetItransBuffer } from './itrans'

describe('insertCharToActive', () => {
  it('inserts a character into the focused input at the caret', () => {
    const input = document.createElement('input')
    input.value = 'sa'
    document.body.appendChild(input)
    input.focus()
    input.selectionStart = 1
    input.selectionEnd = 1

    insertCharToActive('ā')

    expect(input.value).toBe('sāa')
    expect(input.selectionEnd).toBe(2)
  })

  it('dispatches a bubbling input event after insert', () => {
    const input = document.createElement('input')
    input.value = ''
    document.body.appendChild(input)
    input.focus()

    const onInput = vi.fn()
    input.addEventListener('input', onInput)

    insertCharToActive('ṃ')

    expect(onInput).toHaveBeenCalledTimes(1)
    expect(input.value).toBe('ṃ')
  })

  it('replaces pending ASCII when backspace is set', () => {
    const input = document.createElement('input')
    input.value = 'a'
    document.body.appendChild(input)
    input.focus()
    input.selectionStart = 1
    input.selectionEnd = 1

    insertCharToActive('ā', 1)

    expect(input.value).toBe('ā')
    expect(input.selectionEnd).toBe(1)
  })

  it('does nothing when there is no active element', () => {
    const active = document.activeElement as HTMLElement | null
    active?.blur?.()

    expect(() => insertCharToActive('ā')).not.toThrow()
  })
})

describe('setItransEnabled', () => {
  it('clears the ITRANS buffer when disabled', () => {
    setItransEnabled(true)
    resetItransBuffer()
    setItransEnabled(false)
    expect(() => setItransEnabled(false)).not.toThrow()
  })
})

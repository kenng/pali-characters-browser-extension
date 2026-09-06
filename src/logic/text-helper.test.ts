import { describe, expect, it } from 'vitest'
import { cursor_position, getText, setCaret, setText } from './text-helper'

describe('text-helper', () => {
  describe('cursor_position', () => {
    it('reads selectionEnd from input elements', () => {
      const input = document.createElement('input')
      input.value = 'hello'
      input.selectionEnd = 3

      expect(cursor_position(input)).toBe(3)
    })

    it('reads selectionEnd from textarea elements', () => {
      const textarea = document.createElement('textarea')
      textarea.value = 'pali'
      textarea.selectionEnd = 2

      expect(cursor_position(textarea)).toBe(2)
    })
  })

  describe('getText', () => {
    it('inserts a letter at the caret in an input', () => {
      const input = document.createElement('input')
      input.value = 'sa'
      input.selectionEnd = 1

      expect(getText(input, 'ā')).toEqual({
        pos: 1,
        output: 'sāa',
      })
    })

    it('appends when caret is at the end', () => {
      const input = document.createElement('input')
      input.value = 'buddha'
      input.selectionEnd = 6

      expect(getText(input, 'ṃ')).toEqual({
        pos: 6,
        output: 'buddhaṃ',
      })
    })

    it('prepends when caret is at the start', () => {
      const input = document.createElement('input')
      input.value = 'ana'
      input.selectionEnd = 0

      expect(getText(input, 'ñ')).toEqual({
        pos: 0,
        output: 'ñana',
      })
    })
  })

  describe('setText', () => {
    it('sets value on form elements', () => {
      const input = document.createElement('input')
      setText(input, 'ā')
      expect(input.value).toBe('ā')
    })

    it('sets innerHTML on contenteditable elements', () => {
      const div = document.createElement('div')
      div.contentEditable = 'true'
      setText(div, 'ī')
      expect(div.innerHTML).toBe('ī')
    })
  })

  describe('setCaret', () => {
    it('moves selectionEnd on form elements', () => {
      const input = document.createElement('input')
      input.value = 'ābc'
      setCaret(input, 1)
      expect(input.selectionEnd).toBe(1)
    })
  })
})

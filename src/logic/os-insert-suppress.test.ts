import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  armOsInsertSuppress,
  resetOsInsertSuppress,
  suppressOsInsertHandler,
} from './os-insert-suppress'

describe('os-insert-suppress', () => {
  afterEach(() => {
    resetOsInsertSuppress()
    vi.useRealTimers()
  })

  it('prevents beforeinput only while armed', () => {
    const ev = new Event('beforeinput', { cancelable: true })
    suppressOsInsertHandler(ev)
    expect(ev.defaultPrevented).toBe(false)

    armOsInsertSuppress()
    const ev2 = new Event('beforeinput', { cancelable: true })
    suppressOsInsertHandler(ev2)
    expect(ev2.defaultPrevented).toBe(true)
  })

  it('cancels compositionstart while armed (Opt+N tilde dead key)', () => {
    armOsInsertSuppress()
    const ev = new Event('compositionstart', { cancelable: true })
    suppressOsInsertHandler(ev)
    expect(ev.defaultPrevented).toBe(true)
  })

  it('strips ˜ on compositionend when preventDefault is not enough', () => {
    const input = document.createElement('textarea')
    input.value = 'ṇ˜'
    document.body.appendChild(input)

    armOsInsertSuppress()
    const ev = new Event('compositionend', { bubbles: true, cancelable: true })
    Object.defineProperty(ev, 'target', { configurable: true, value: input })
    Object.defineProperty(ev, 'data', { configurable: true, value: '˜' })
    suppressOsInsertHandler(ev)

    expect(input.value).toBe('ṇ')
  })

  it('disarms after SUPPRESS_MS', () => {
    vi.useFakeTimers()
    armOsInsertSuppress()
    vi.advanceTimersByTime(250)
    const ev = new Event('beforeinput', { cancelable: true })
    suppressOsInsertHandler(ev)
    expect(ev.defaultPrevented).toBe(false)
  })
})

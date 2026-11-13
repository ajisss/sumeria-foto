import { afterEach, describe, expect, it, vi } from 'vitest'
import { uid } from '../format'

const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

const real = globalThis.crypto

describe('uid', () => {
  afterEach(() => vi.unstubAllGlobals())
  it('is a v4 uuid and unique', () => {
    const ids = Array.from({ length: 1000 }, uid)
    expect(ids.every((i) => V4.test(i))).toBe(true)
    expect(new Set(ids).size).toBe(1000)
  })
  it('falls back to getRandomValues when randomUUID is missing', () => {
    vi.stubGlobal('crypto', { getRandomValues: <T extends ArrayBufferView<ArrayBuffer>>(a: T) => real.getRandomValues(a) })
    const ids = Array.from({ length: 200 }, uid)
    expect(ids.every((i) => V4.test(i))).toBe(true)
    expect(new Set(ids).size).toBe(200)
  })
})

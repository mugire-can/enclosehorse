import { describe, it, expect } from 'vitest'
import { createSeededRandom, dateSeed } from '../src/utils/seed'

describe('Seed Utils', () => {
  it('should produce deterministic random numbers from same seed', () => {
    const rng1 = createSeededRandom(42)
    const rng2 = createSeededRandom(42)

    expect(rng1()).toBe(rng2())
    expect(rng1()).toBe(rng2())
    expect(rng1()).toBe(rng2())
  })

  it('should produce different numbers from different seeds', () => {
    const rng1 = createSeededRandom(42)
    const rng2 = createSeededRandom(99)

    expect(rng1()).not.toBe(rng2())
  })

  it('should produce numbers between 0 and 1', () => {
    const rng = createSeededRandom(12345)
    for (let i = 0; i < 100; i++) {
      const val = rng()
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(1)
    }
  })

  it('should produce same seed for same date', () => {
    const seed1 = dateSeed(new Date('2025-01-15'))
    const seed2 = dateSeed(new Date('2025-01-15'))
    expect(seed1).toBe(seed2)
  })

  it('should produce different seeds for different dates', () => {
    const seed1 = dateSeed(new Date('2025-01-15'))
    const seed2 = dateSeed(new Date('2025-01-16'))
    expect(seed1).not.toBe(seed2)
  })
})

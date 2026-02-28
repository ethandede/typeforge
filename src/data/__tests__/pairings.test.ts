import { describe, it, expect } from 'vitest'
import { pairings } from '../pairings'

describe('curated pairings database', () => {
  it('has at least 20 pairings', () => {
    expect(pairings.length).toBeGreaterThanOrEqual(20)
  })

  it('every pairing has required fields', () => {
    pairings.forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.headingFont.family).toBeTruthy()
      expect(p.bodyFont.family).toBeTruthy()
      expect(p.headingFont.weights.length).toBeGreaterThan(0)
      expect(p.bodyFont.weights.length).toBeGreaterThan(0)
      expect(p.method).toBeTruthy()
      expect(p.mood.length).toBeGreaterThan(0)
      expect(p.useCase.length).toBeGreaterThan(0)
      expect(p.notes).toBeTruthy()
    })
  })

  it('all IDs are unique', () => {
    const ids = pairings.map(p => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('methods are valid', () => {
    const validMethods = ['modular-scale', 'utopia-fluid', 'tailwind', 'bootstrap', 'shadcn']
    pairings.forEach(p => {
      expect(validMethods).toContain(p.method)
    })
  })
})

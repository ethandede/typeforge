import { describe, it, expect } from 'vitest'
import { computeSpacingScale } from '../spacing'

describe('computeSpacingScale', () => {
  it('generates named spacing steps', () => {
    const steps = computeSpacingScale(16, 1.25)
    const names = steps.map(s => s.name)
    expect(names).toContain('--space-xs')
    expect(names).toContain('--space-sm')
    expect(names).toContain('--space-md')
    expect(names).toContain('--space-lg')
    expect(names).toContain('--space-xl')
    expect(names).toContain('--space-2xl')
  })

  it('--space-md equals base size', () => {
    const steps = computeSpacingScale(16, 1.25)
    const md = steps.find(s => s.name === '--space-md')!
    expect(md.sizePx).toBe(16)
  })

  it('steps scale by ratio', () => {
    const steps = computeSpacingScale(16, 1.25)
    const md = steps.find(s => s.name === '--space-md')!
    const lg = steps.find(s => s.name === '--space-lg')!
    expect(lg.sizePx).toBeCloseTo(md.sizePx * 1.25, 1)
  })

  it('generates fluid clamp values when viewport params provided', () => {
    const steps = computeSpacingScale(16, 1.25, 320, 1440, 14, 1.2)
    steps.forEach(step => {
      expect(step.clamp).not.toBeNull()
    })
  })

  it('has null clamp values when no viewport params', () => {
    const steps = computeSpacingScale(16, 1.25)
    steps.forEach(step => {
      expect(step.clamp).toBeNull()
    })
  })
})

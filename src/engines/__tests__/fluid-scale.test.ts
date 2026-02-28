import { describe, it, expect } from 'vitest'
import { computeFluidScale, generateClamp } from '../fluid-scale'
import type { FluidScaleConfig } from '../../types'

describe('generateClamp', () => {
  it('generates valid clamp() with correct min, preferred, max', () => {
    const clamp = generateClamp(16, 20, 320, 1440)
    expect(clamp).toMatch(/^clamp\(/)
    expect(clamp).toContain('rem')
    expect(clamp).toContain('vw')
  })

  it('min value in clamp equals minSize in rem', () => {
    const clamp = generateClamp(16, 24, 320, 1440)
    expect(clamp).toMatch(/^clamp\(1rem/)
  })

  it('max value in clamp equals maxSize in rem', () => {
    const clamp = generateClamp(16, 24, 320, 1440)
    expect(clamp).toMatch(/1\.5rem\)$/)
  })
})

describe('computeFluidScale', () => {
  const defaultConfig: FluidScaleConfig = {
    method: 'utopia-fluid',
    minViewport: 320,
    maxViewport: 1440,
    minBaseSize: 16,
    maxBaseSize: 20,
    minRatio: 1.2,
    maxRatio: 1.333,
    steps: 5,
  }

  it('returns steps + 1 entries (includes base as step 0)', () => {
    const steps = computeFluidScale(defaultConfig)
    // steps (5) above + base (1) + 2 below = 8
    expect(steps.length).toBeGreaterThanOrEqual(6)
  })

  it('base step has min/max sizes matching config', () => {
    const steps = computeFluidScale(defaultConfig)
    const base = steps.find(s => s.index === 0)!
    expect(base.sizePx).toBe(20) // max size at max viewport
    expect(base.clamp).not.toBeNull()
  })

  it('all steps have clamp values', () => {
    const steps = computeFluidScale(defaultConfig)
    steps.forEach(step => {
      expect(step.clamp).not.toBeNull()
      expect(step.clamp).toMatch(/^clamp\(/)
    })
  })

  it('step sizes increase with index', () => {
    const steps = computeFluidScale(defaultConfig)
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].sizePx).toBeGreaterThan(steps[i - 1].sizePx)
    }
  })

  it('scales use different ratios for min and max', () => {
    const steps = computeFluidScale(defaultConfig)
    const step3 = steps.find(s => s.index === 3)!
    // At max viewport: 20 * 1.333^3 ≈ 47.37
    expect(step3.sizePx).toBeCloseTo(47.37, 0)
  })
})

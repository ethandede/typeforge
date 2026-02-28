import { describe, it, expect } from 'vitest'
import { computeModularScale } from '../modular-scale'
import type { ModularScaleConfig } from '../../types'

describe('computeModularScale', () => {
  const defaultConfig: ModularScaleConfig = {
    method: 'modular-scale',
    baseSize: 16,
    ratio: 1.25, // Major Third
    stepsAbove: 5,
    stepsBelow: 2,
  }

  it('returns correct number of steps', () => {
    const steps = computeModularScale(defaultConfig)
    // stepsBelow (2) + base (1) + stepsAbove (5) = 8
    expect(steps).toHaveLength(8)
  })

  it('base step (index 0) equals baseSize', () => {
    const steps = computeModularScale(defaultConfig)
    const base = steps.find(s => s.index === 0)!
    expect(base.sizePx).toBe(16)
    expect(base.sizeRem).toBe(1)
  })

  it('step 1 equals baseSize * ratio', () => {
    const steps = computeModularScale(defaultConfig)
    const step1 = steps.find(s => s.index === 1)!
    expect(step1.sizePx).toBeCloseTo(20, 1) // 16 * 1.25
    expect(step1.sizeRem).toBeCloseTo(1.25, 2)
  })

  it('step -1 equals baseSize / ratio', () => {
    const steps = computeModularScale(defaultConfig)
    const stepNeg1 = steps.find(s => s.index === -1)!
    expect(stepNeg1.sizePx).toBeCloseTo(12.8, 1) // 16 / 1.25
  })

  it('step 5 equals baseSize * ratio^5', () => {
    const steps = computeModularScale(defaultConfig)
    const step5 = steps.find(s => s.index === 5)!
    // 16 * 1.25^5 = 48.828...
    expect(step5.sizePx).toBeCloseTo(48.83, 0)
  })

  it('clamp is always null for static scales', () => {
    const steps = computeModularScale(defaultConfig)
    steps.forEach(step => {
      expect(step.clamp).toBeNull()
    })
  })

  it('line heights decrease for larger sizes', () => {
    const steps = computeModularScale(defaultConfig)
    const base = steps.find(s => s.index === 0)!
    const step5 = steps.find(s => s.index === 5)!
    expect(step5.lineHeight).toBeLessThan(base.lineHeight)
  })

  it('steps are sorted by index ascending', () => {
    const steps = computeModularScale(defaultConfig)
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].index).toBeGreaterThan(steps[i - 1].index)
    }
  })

  it('uses Perfect Fourth ratio correctly', () => {
    const config: ModularScaleConfig = {
      ...defaultConfig,
      ratio: 1.333,
      stepsAbove: 3,
      stepsBelow: 0,
    }
    const steps = computeModularScale(config)
    const step1 = steps.find(s => s.index === 1)!
    expect(step1.sizePx).toBeCloseTo(21.33, 0) // 16 * 1.333
  })
})

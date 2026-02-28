import { describe, it, expect } from 'vitest'
import { computeTailwindScale, TAILWIND_DEFAULTS } from '../tailwind-scale'
import type { TailwindScaleConfig } from '../../types'

describe('TAILWIND_DEFAULTS', () => {
  it('contains all standard Tailwind text sizes', () => {
    const names = TAILWIND_DEFAULTS.map(d => d.name)
    expect(names).toContain('text-xs')
    expect(names).toContain('text-base')
    expect(names).toContain('text-9xl')
  })
})

describe('computeTailwindScale', () => {
  it('returns default scale when no overrides', () => {
    const config: TailwindScaleConfig = {
      method: 'tailwind',
      overrides: {},
      useFluid: false,
    }
    const steps = computeTailwindScale(config)
    expect(steps.length).toBe(TAILWIND_DEFAULTS.length)
    const base = steps.find(s => s.name === 'text-base')!
    expect(base.sizePx).toBe(16)
  })

  it('applies overrides to specific steps', () => {
    const config: TailwindScaleConfig = {
      method: 'tailwind',
      overrides: {
        'text-base': { size: 18, lineHeight: 1.6 },
      },
      useFluid: false,
    }
    const steps = computeTailwindScale(config)
    const base = steps.find(s => s.name === 'text-base')!
    expect(base.sizePx).toBe(18)
    expect(base.lineHeight).toBe(1.6)
  })

  it('generates clamp values when useFluid is true', () => {
    const config: TailwindScaleConfig = {
      method: 'tailwind',
      overrides: {},
      useFluid: true,
      fluidMinViewport: 320,
      fluidMaxViewport: 1440,
    }
    const steps = computeTailwindScale(config)
    steps.forEach(step => {
      expect(step.clamp).not.toBeNull()
    })
  })

  it('has no clamp values when useFluid is false', () => {
    const config: TailwindScaleConfig = {
      method: 'tailwind',
      overrides: {},
      useFluid: false,
    }
    const steps = computeTailwindScale(config)
    steps.forEach(step => {
      expect(step.clamp).toBeNull()
    })
  })
})

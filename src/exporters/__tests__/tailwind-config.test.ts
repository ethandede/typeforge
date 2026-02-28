import { describe, it, expect } from 'vitest'
import { generateTailwindConfig } from '../tailwind-config'
import type { TypographySystem } from '../../types'

function buildMockSystem(): TypographySystem {
  return {
    scaleConfig: { method: 'modular-scale', baseSize: 16, ratio: 1.25, stepsAbove: 2, stepsBelow: 0 },
    headingFont: { family: 'Playfair Display', weights: [400, 700], category: 'serif' },
    bodyFont: { family: 'Inter', weights: [400, 500, 600], category: 'sans-serif' },
    monoFont: null,
    scaleSteps: [
      { name: 'step-0', index: 0, sizePx: 16, sizeRem: 1, clamp: null, lineHeight: 1.5, letterSpacing: null },
      { name: 'step-1', index: 1, sizePx: 20, sizeRem: 1.25, clamp: null, lineHeight: 1.4, letterSpacing: null },
    ],
    elementMappings: [],
    spacingSteps: [
      { name: '--space-md', sizePx: 16, sizeRem: 1, clamp: null },
    ],
  }
}

describe('generateTailwindConfig', () => {
  it('outputs @theme block', () => {
    const output = generateTailwindConfig(buildMockSystem())
    expect(output).toContain('@theme')
  })

  it('includes font-family definitions', () => {
    const output = generateTailwindConfig(buildMockSystem())
    expect(output).toContain('--font-heading')
    expect(output).toContain('Playfair Display')
  })

  it('includes font-size definitions mapped to step names', () => {
    const output = generateTailwindConfig(buildMockSystem())
    expect(output).toContain('--font-size-')
  })

  it('includes spacing definitions', () => {
    const output = generateTailwindConfig(buildMockSystem())
    expect(output).toContain('--spacing-')
  })

  it('includes Google Fonts @import', () => {
    const output = generateTailwindConfig(buildMockSystem())
    expect(output).toContain('@import url')
  })
})

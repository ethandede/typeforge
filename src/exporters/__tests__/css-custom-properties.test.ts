import { describe, it, expect } from 'vitest'
import { generateCssCustomProperties } from '../css-custom-properties'
import type { TypographySystem, FontSelection, ScaleStep, ElementMapping, SpacingStep } from '../../types'

function buildMockSystem(): TypographySystem {
  const headingFont: FontSelection = { family: 'Playfair Display', weights: [400, 700], category: 'serif' }
  const bodyFont: FontSelection = { family: 'Inter', weights: [400, 500, 600], category: 'sans-serif' }

  const scaleSteps: ScaleStep[] = [
    { name: 'step-0', index: 0, sizePx: 16, sizeRem: 1, clamp: null, lineHeight: 1.5, letterSpacing: null },
    { name: 'step-1', index: 1, sizePx: 20, sizeRem: 1.25, clamp: null, lineHeight: 1.4, letterSpacing: null },
    { name: 'step-2', index: 2, sizePx: 25, sizeRem: 1.563, clamp: null, lineHeight: 1.35, letterSpacing: '-0.01em' },
  ]

  const elementMappings: ElementMapping[] = [
    { element: 'h1', scaleStep: 2, fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.01em', textTransform: 'none', marginBottom: 'var(--space-lg)' },
    { element: 'body', scaleStep: 0, fontWeight: 400, lineHeight: 1.5, letterSpacing: null, textTransform: 'none', marginBottom: 'var(--space-md)' },
  ]

  const spacingSteps: SpacingStep[] = [
    { name: '--space-sm', sizePx: 12.8, sizeRem: 0.8, clamp: null },
    { name: '--space-md', sizePx: 16, sizeRem: 1, clamp: null },
    { name: '--space-lg', sizePx: 20, sizeRem: 1.25, clamp: null },
  ]

  return {
    scaleConfig: { method: 'modular-scale', baseSize: 16, ratio: 1.25, stepsAbove: 2, stepsBelow: 0 },
    headingFont,
    bodyFont,
    monoFont: null,
    scaleSteps,
    elementMappings,
    spacingSteps,
  }
}

describe('generateCssCustomProperties', () => {
  it('outputs a :root block', () => {
    const css = generateCssCustomProperties(buildMockSystem())
    expect(css).toContain(':root {')
    expect(css).toContain('}')
  })

  it('includes font-family variables', () => {
    const css = generateCssCustomProperties(buildMockSystem())
    expect(css).toContain('--font-heading')
    expect(css).toContain('Playfair Display')
    expect(css).toContain('--font-body')
    expect(css).toContain('Inter')
  })

  it('includes scale step variables', () => {
    const css = generateCssCustomProperties(buildMockSystem())
    expect(css).toContain('--step-0')
    expect(css).toContain('1rem')
  })

  it('includes spacing variables', () => {
    const css = generateCssCustomProperties(buildMockSystem())
    expect(css).toContain('--space-md')
  })

  it('includes element styles', () => {
    const css = generateCssCustomProperties(buildMockSystem())
    expect(css).toContain('h1 {')
    expect(css).toContain('font-weight: 700')
  })

  it('includes Google Fonts @import', () => {
    const css = generateCssCustomProperties(buildMockSystem())
    expect(css).toContain('@import url')
    expect(css).toContain('fonts.googleapis.com')
  })
})

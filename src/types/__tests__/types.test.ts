import { describe, it, expect } from 'vitest'
import type {
  ScaleMethod,
  ScaleConfig,
  ModularScaleConfig,
  FluidScaleConfig,
  TailwindScaleConfig,
  ScaleStep,
  FontSelection,
  FontPairing,
  ElementMapping,
  TypographySystem,
  ExportFormat,
} from '../index'

describe('Type definitions', () => {
  it('ScaleMethod includes all supported methods', () => {
    const methods: ScaleMethod[] = [
      'modular-scale',
      'utopia-fluid',
      'tailwind',
      'bootstrap',
      'shadcn',
    ]
    expect(methods).toHaveLength(5)
  })

  it('ModularScaleConfig has required fields', () => {
    const config: ModularScaleConfig = {
      method: 'modular-scale',
      baseSize: 16,
      ratio: 1.25,
      stepsAbove: 5,
      stepsBelow: 2,
    }
    expect(config.method).toBe('modular-scale')
    expect(config.baseSize).toBe(16)
  })

  it('FluidScaleConfig has viewport and dual ratio fields', () => {
    const config: FluidScaleConfig = {
      method: 'utopia-fluid',
      minViewport: 320,
      maxViewport: 1440,
      minBaseSize: 16,
      maxBaseSize: 20,
      minRatio: 1.2,
      maxRatio: 1.333,
      steps: 5,
    }
    expect(config.minViewport).toBeLessThan(config.maxViewport)
  })

  it('TailwindScaleConfig supports overrides and fluid mode', () => {
    const config: TailwindScaleConfig = {
      method: 'tailwind',
      overrides: {
        'text-lg': { size: 18, lineHeight: 1.75 },
        'text-xl': { size: 20, lineHeight: 1.75, letterSpacing: '-0.01em' },
      },
      useFluid: true,
      fluidMinViewport: 320,
      fluidMaxViewport: 1440,
    }
    expect(config.method).toBe('tailwind')
    expect(config.useFluid).toBe(true)
    expect(Object.keys(config.overrides)).toHaveLength(2)
  })

  it('ScaleConfig union accepts any valid scale configuration', () => {
    const modular: ScaleConfig = {
      method: 'modular-scale',
      baseSize: 16,
      ratio: 1.25,
      stepsAbove: 5,
      stepsBelow: 2,
    }
    const fluid: ScaleConfig = {
      method: 'utopia-fluid',
      minViewport: 320,
      maxViewport: 1440,
      minBaseSize: 16,
      maxBaseSize: 20,
      minRatio: 1.2,
      maxRatio: 1.333,
      steps: 5,
    }
    expect(modular.method).toBe('modular-scale')
    expect(fluid.method).toBe('utopia-fluid')
  })

  it('ScaleStep contains computed values', () => {
    const step: ScaleStep = {
      name: 'step-3',
      index: 3,
      sizePx: 31.25,
      sizeRem: 1.953,
      clamp: null,
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    }
    expect(step.sizePx).toBeGreaterThan(0)
  })

  it('FontSelection describes a single font with weights and category', () => {
    const font: FontSelection = {
      family: 'Inter',
      weights: [400, 500, 600, 700],
      category: 'sans-serif',
    }
    expect(font.family).toBe('Inter')
    expect(font.weights).toContain(400)
    expect(font.category).toBe('sans-serif')
  })

  it('FontPairing contains metadata for gallery', () => {
    const pairing: FontPairing = {
      id: 'inter-playfair',
      headingFont: { family: 'Playfair Display', weights: [400, 700], category: 'serif' },
      bodyFont: { family: 'Inter', weights: [400, 500, 600], category: 'sans-serif' },
      method: 'modular-scale',
      mood: ['editorial', 'elegant'],
      useCase: ['blog', 'portfolio'],
      notes: 'Classic serif/sans pairing with strong contrast',
    }
    expect(pairing.mood.length).toBeGreaterThan(0)
  })

  it('ElementMapping assigns scale steps to HTML elements', () => {
    const mapping: ElementMapping = {
      element: 'h1',
      scaleStep: 5,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      textTransform: 'none',
      marginTop: '0',
      marginBottom: 'var(--space-md)',
    }
    expect(mapping.element).toBe('h1')
  })

  it('TypographySystem composes all parts into a complete system', () => {
    const system: TypographySystem = {
      scaleConfig: {
        method: 'modular-scale',
        baseSize: 16,
        ratio: 1.25,
        stepsAbove: 5,
        stepsBelow: 2,
      },
      headingFont: { family: 'Playfair Display', weights: [400, 700], category: 'serif' },
      bodyFont: { family: 'Inter', weights: [400, 500, 600], category: 'sans-serif' },
      monoFont: { family: 'JetBrains Mono', weights: [400, 700], category: 'monospace' },
      scaleSteps: [
        {
          name: 'step-0',
          index: 0,
          sizePx: 16,
          sizeRem: 1,
          clamp: null,
          lineHeight: 1.5,
          letterSpacing: null,
        },
      ],
      elementMappings: [
        {
          element: 'body',
          scaleStep: 0,
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: null,
          textTransform: 'none',
          marginTop: '0',
          marginBottom: '0',
        },
      ],
      spacingSteps: [
        { name: '--space-md', sizePx: 16, sizeRem: 1, clamp: null },
      ],
    }
    expect(system.scaleConfig.method).toBe('modular-scale')
    expect(system.scaleSteps).toHaveLength(1)
    expect(system.elementMappings).toHaveLength(1)
    expect(system.monoFont).not.toBeNull()
  })

  it('ExportFormat covers all output types', () => {
    const formats: ExportFormat[] = [
      'css-custom-properties',
      'scss',
      'tailwind-v4',
      'shadcn',
      'bootstrap',
      'design-tokens',
      'claude-prompt',
      'ai-prompt',
      'system-prompt',
    ]
    expect(formats.length).toBeGreaterThanOrEqual(9)
  })
})
